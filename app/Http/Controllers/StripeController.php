<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subscription\ChangeSubscriptionPlanRequest;
use App\Http\Requests\Subscription\DefaultSubscriptionRequest;
use App\Models\Company;
use App\Models\CompanySubscriptions;
use App\Models\PaymentToken;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Subscription;
use Stripe\Checkout\Session;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Stripe\Invoice;
use Stripe\Exception\ApiErrorException;
use Illuminate\Support\Str;

class StripeController extends Controller
{
    // public function createPaymentSession($subscriptionPlanId)
    // {

    //     Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

    //     $session = Session::create([
    //         'payment_method_types' => ['card'],
    //         'line_items' => [[
    //             'price_data' => [
    //                 'currency' => 'usd',
    //                 'unit_amount' => 2000,
    //                 'product_data' => [
    //                     'name' => 'One-Time Payment',
    //                 ],
    //             ],
    //             'quantity' => 1,
    //         ]],
    //         'mode' => 'payment',
    //         'success_url' => env('SUCCESS_PAYMENT_URL'),
    //         'cancel_url' => env('FAIL_PAYMENT_URL'),
    //     ]);

    //     return response()->json(['session_id' => $session->id]);
    // }

    public static function createSubscriptionSession($subscriptionPlanId, $companyId)
    {
        // Fetch existing subscription, if any
        $existingSubscription = CompanySubscriptions::where('company_id', $companyId)->first();

        // If there is no existing subscription or if the existing one is unpaid or canceled, create a new subscription
        if (!$existingSubscription || in_array($existingSubscription->status, ['unpaid', 'canceled', 'incomplete_expired'])) {
            // Fetch the company
            $company = Company::find($companyId);

            // Create or get Stripe Customer ID
            $stripeCustomerId = $company->stripe_customer_id ?? null;

            // Initialize Stripe
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            if (!$stripeCustomerId) {
                $customer = \Stripe\Customer::create([
                    'email' => $company->email_company, // Use the company's email
                    'name' => $company->name, // Use the company's name
                ]);
                $stripeCustomerId = $customer->id;

                // Save Stripe customer ID in your database
                $company->stripe_customer_id = $stripeCustomerId;
                $company->save();
            }

            // Generate a unique token for the payment
            // $paymentToken = Str::random(64);

            // Fetch the subscription plan
            $subscriptionPlan = SubscriptionPlan::find($subscriptionPlanId);

            $frontendUrl = env('FRONTEND_URL');

            // Create Stripe subscription session
            $session = Session::create([
                'customer' => $stripeCustomerId,
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price' => $subscriptionPlan->stripe_price_id,
                    'quantity' => 1,
                ]],
                'mode' => 'subscription',
                'success_url' => "$frontendUrl/success-payment?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url' => "$frontendUrl/failed-payment?session_id={CHECKOUT_SESSION_ID}",
            ]);

            // Save the session and company details in the database
            $companySubscription = new CompanySubscriptions([
                'company_id' => $companyId,
                'subscription_plan_id' => $subscriptionPlan->id,
                'stripe_session_id' => $session->id,
                'status' => 'incomplete',
            ]);
            $companySubscription->save();

            // Return the Stripe session ID
            return response()->json([
                'message' => 'Subscription session created successfully.',
                'session_id' => $session->id,
            ]);
        } else {

            // Determine the existing subscription status
            $status = $existingSubscription->status;

            // Handle different existing subscription statuses
            $statusMessages = [
                'active' => 'You already have an active subscription.',
                'trialing' => 'You already have an active subscription.',
                'pending' => 'You already have an active subscription.',
                'incomplete' => 'You have an incomplete subscription. Please complete the payment.',
                'incomplete_expired' => 'Your previous subscription payment has expired. Please initiate a new subscription.',
                'past_due' => 'Your subscription is past due. Please update your payment method to reactivate.',
                'active_to_cancel' => 'Your subscription is set to be canceled at the end of the current period',
            ];

            return response()->json(['message' => $statusMessages[$status] ?? 'Unexpected status'], 400);
        }
    }

    public function cancelSubscription(Company $company)
    {
        $companyId = $company->id;

        try {
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            $companySubscription = CompanySubscriptions::where('company_id', $companyId)
                ->where('status', 'active')
                ->orWhere('status', 'past_due')
                ->orWhere('status', 'trialing')
                ->first();

            if (!$companySubscription) {
                return response()->json(['message' => 'No active subscription found.'], 404);
            }

            // Cancel the Stripe subscription
            $stripeResponse = Subscription::update(
                $companySubscription->stripe_subscription_id,
                [
                    'cancel_at_period_end' => true,
                ]
            );

            // If the Stripe subscription is set to cancel at the period's end
            if ($stripeResponse->cancel_at_period_end) {
                // Update the local database to reflect this change
                $companySubscription->status = 'active_to_cancel';  // Use an appropriate status value
                $companySubscription->save();
            }

            return response()->json([
                'message' => 'Subscription is set to be canceled at the end of the current period.',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while canceling the subscription: ' . $e->getMessage()], 400);
        }
    }

    public function changeSubscription(Company $company, ChangeSubscriptionPlanRequest $request)
    {
        // Initialize Stripe
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        // Fetch the current user's subscription from your database
        $companySubscription = CompanySubscriptions::where('company_id', $company->id)
            ->where(function ($query) {
                $query->where('status', 'active')
                    ->orWhere('status', 'active_to_cancel')
                    ->orWhere('status', 'past_due');
            })
            ->first();



        if (!$companySubscription) {
            return response()->json(['message' => 'No active subscription found'], 404);
        }

        try {
            // Fetch the Stripe subscription object
            $stripeSubscription = Subscription::retrieve($companySubscription->stripe_subscription_id);

            $newSubscriptionPlan = SubscriptionPlan::find($request->subscription_plan_id);

            // Update the subscription
            $response = Subscription::update($companySubscription->stripe_subscription_id, [
                'cancel_at_period_end' => false,
                'proration_behavior' => 'always_invoice',
                'items' => [
                    [
                        'id' => $stripeSubscription->items->data[0]->id,
                        'price' => $newSubscriptionPlan->stripe_price_id,
                    ],
                ],
            ]);

            // Now, update the local database using the Stripe response data
            if ($response->cancel_at_period_end) {
                $companySubscription->status = 'active_to_cancel';
            } else {
                $stripePriceId = $response->items->data[0]->price->id;
                $newPlan = SubscriptionPlan::where('stripe_price_id', $stripePriceId)->first();

                if ($newPlan && $response->status === 'active') {
                    $companySubscription->subscription_plan_id = $newPlan->id;
                    $companySubscription->start_date = Carbon::createFromTimestamp($response->current_period_start);
                    $companySubscription->expiry_date = Carbon::createFromTimestamp($response->current_period_end);
                }
                $companySubscription->status = $response->status;
            }

            // Save the updated local subscription data
            $companySubscription->save();

            return response()->json([
                'message' => 'Subscription updated successfully',
                'response' => $response
            ]);
        } catch (ApiErrorException $e) {
            return response()->json(['message' => 'Stripe API Error: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function renewSubscription(Company $company)
    {
        $companyId = $company->id;

        $companySubscription = CompanySubscriptions::where('company_id', $companyId)->first();

        if (!$companySubscription) {
            return response()->json(['message' => 'Subscription not found'], 404);
        }

        if ($companySubscription->status !== 'active_to_cancel') {
            return response()->json(['message' => 'Subscription is not set to cancel, cannot renew'], 400);
        }

        // Initialize Stripe
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        try {
            // Retrieve the Stripe subscription object
            $stripeSubscription = Subscription::retrieve($companySubscription->stripe_subscription_id);

            if ($stripeSubscription->cancel_at_period_end) {
                // Renew the Stripe subscription
                $updatedSubscription = Subscription::update(
                    $companySubscription->stripe_subscription_id,
                    [
                        'cancel_at_period_end' => false,
                        // Optionally, you can add other parameters like proration
                    ]
                );

                // If the updated subscription is no longer set to cancel at the end of the period
                if (!$updatedSubscription->cancel_at_period_end) {
                    // Update the local database to set status to "active"
                    $companySubscription->status = 'active';
                    $companySubscription->save();
                }

                return response()->json(
                    [
                        'message' => 'Subscription successfully renewed',
                    ]
                );
            } else {
                return response()->json(['message' => 'Subscription is not set to cancel at period end, cannot renew'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to renew subscription: ' . $e->getMessage()], 500);
        }
    }

    public function renewPreviousSubscription(Company $company)
    {
        $companyId = $company->id;

        $companySubscription = CompanySubscriptions::where('company_id', $companyId)->first();

        if (!$companySubscription) {
            return response()->json(['message' => 'Subscription not found'], 404);
        }

        // accept only if the subscription is canceled and incomplete expired
        if ($companySubscription->status !== 'canceled' && $companySubscription->status !== 'incomplete_expired') {
            return response()->json(['message' => 'Cannot renew to the previous subscription based on the status'], 400);
        }

        $response = $this->createSubscriptionSession($companySubscription->subscription_plan_id, $companyId);

        $stripeData = json_decode($response->getContent(), true);

        return response()->json($stripeData);
    }

    public static function generateUpdatePaymentLink(Company $company)
    {
        // Initialize Stripe
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        // Get the associated Stripe customer ID from your database
        if (!$company || !$company->stripe_customer_id) {
            return response()->json(['message' => 'Company or Stripe Customer ID not found'], 404);
        }

        $frontendUrl = env('FRONTEND_URL');

        // Create a Checkout session for updating the payment method
        $session = \Stripe\Checkout\Session::create([
            'mode' => 'setup',
            'payment_method_types' => ['card'],
            'customer' => $company->stripe_customer_id,
            'success_url' => "$frontendUrl/success-update-payment-method?session_id={CHECKOUT_SESSION_ID}",
            'cancel_url' => "$frontendUrl/failed-update-payment-method?session_id={CHECKOUT_SESSION_ID}",
        ]);

        $companySubscription = $company->latestSubscription;

        $companySubscription->stripe_session_id = $session->id;
        $companySubscription->save();

        return response()->json([
            'message' => 'Checkout session created successfully for payment method update',
            'session_id' => $session->id,
        ]);
    }

    public function getInvoices(Company $company)
    {
        // Set the Stripe secret key
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        // Check if the company has a Stripe customer ID
        if (!$company->stripe_customer_id) {
            return response()->json(['message' => 'No associated Stripe customer ID.'], 404);
        }

        // Fetch the invoices for the Stripe customer
        try {
            $stripeInvoices = Invoice::all(['customer' => $company->stripe_customer_id]);
            $formattedInvoices = [];

            foreach ($stripeInvoices->data as $invoice) {
                $formattedInvoice = [
                    'invoice_number' => $invoice->number,
                    'due_date' => date('Y-m-d', $invoice->due_date),
                    'amount_due' => $invoice->amount_due / 100, // Assuming default currency is in cents
                    'currency' => $invoice->currency,
                    'status' => $invoice->status
                ];

                // If the invoice payment failed, add the payment link
                if ($invoice->status == 'open' || $invoice->status == 'void') {
                    $formattedInvoice['payment_link'] = $invoice->hosted_invoice_url;
                }

                $formattedInvoices[] = $formattedInvoice;
            }

            return response()->json($formattedInvoices);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching invoices: ' . $e->getMessage()], 500);
        }
    }
}
