<?php

namespace App\Http\Controllers;

use App\Models\CompanyPayments;
use App\Models\CompanySubscriptions;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;
use Stripe\Stripe;
use Carbon\Carbon;

class StripeWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $payload = $request->all();
        $sig_header = $request->header('Stripe-Signature');
        $event = null;

        try {
            $event = Webhook::constructEvent($request->getContent(), $sig_header, env('STRIPE_WEBHOOK_SECRET'));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Webhook error: ' . $e->getMessage()], 400);
        }

        Log::info('Webhook received! ' . $event->type);

        // Lookup based on the event type
        if ($event->type === 'checkout.session.completed') {
            Log::info("Handling checkout session with id: " . $event->data->object->id);
            $companySubscription = CompanySubscriptions::where('stripe_session_id', $event->data->object->id)->first();
        } else if ($event->type === 'invoice.paid') {
            Log::info("Handling invoice with subscription id: " . $event->data->object->subscription);
            $companySubscription = CompanySubscriptions::where('stripe_subscription_id', $event->data->object->subscription)->first();
        } else {
            $companySubscription = CompanySubscriptions::where('stripe_subscription_id', $event->data->object->id)->first();
        }

        if ($companySubscription) {
            switch ($event->type) {
                case 'checkout.session.completed':
                    $stripeSession = $event->data->object;
                    Log::info("Test: " . $stripeSession);
                    if ($stripeSession->mode == 'setup') {
                        Log::info("Handling setup session");
                        // Payment method update logic
                        $setupIntent = \Stripe\SetupIntent::retrieve($stripeSession->setup_intent);
                        $paymentMethod = $setupIntent->payment_method;

                        // 2. Set the new payment method as the default
                        \Stripe\Customer::update($stripeSession->customer, [
                            'invoice_settings' => ['default_payment_method' => $paymentMethod]
                        ]);

                        // 3. Attempt to pay outstanding invoices
                        $this->payUnpaidInvoices($stripeSession->customer);
                    } else {
                        Log::info("Handling regular session");
                        // Handle regular subscriptions
                        $companySubscription->status = 'active';
                        $companySubscription->stripe_subscription_id = $stripeSession->subscription;

                        if ($companySubscription->stripe_subscription_id) {
                            $stripeSubscription = \Stripe\Subscription::retrieve($stripeSession->subscription);

                            $companySubscription->start_date = Carbon::createFromTimestamp($stripeSubscription->current_period_start);
                            $companySubscription->expiry_date = Carbon::createFromTimestamp($stripeSubscription->current_period_end);

                            $companySubscription->save();
                        } else {
                            // Handle scenarios where subscription ID might be null
                            Log::error("No subscription ID found for checkout session: " . $stripeSession->id);
                        }
                    }
                    break;

                case 'invoice.paid':
                    Log::info("Handling invoice paid: " . $companySubscription->id . ", " . $event->data->object->total . ", " . $event->data->object->currency . ", " .  $event->data->object->id);
                    CompanyPayments::create([
                        'company_subscription_id' => $companySubscription->id,
                        'amount' => $event->data->object->total,
                        'currency' => $event->data->object->currency,
                        'stripe_invoice_id' => $event->data->object->id,
                    ]);
                    break;

                case 'customer.subscription.updated':
                    $stripeSubscription = $event->data->object;

                    if ($stripeSubscription->cancel_at_period_end) {
                        // Scenario 2: User requests to cancel but still active until plan ends
                        $companySubscription->status = 'active_to_cancel';
                        Log::info("Setting subscription status to active_to_cancel");
                    } else {
                        // Scenario 1: Successful change of plan
                        $stripePriceId = $stripeSubscription->items->data[0]->price->id;
                        $newPlan = SubscriptionPlan::where('stripe_price_id', $stripePriceId)->first();

                        if ($newPlan && $stripeSubscription->status === 'active') {
                            $companySubscription->subscription_plan_id = $newPlan->id;
                            $companySubscription->start_date = Carbon::createFromTimestamp($stripeSubscription->current_period_start);
                            $companySubscription->expiry_date = Carbon::createFromTimestamp($stripeSubscription->current_period_end);
                            Log::info("Setting new plan: " . $newPlan->name);
                        }

                        // Update the status as per Stripe's subscription status
                        $companySubscription->status = $stripeSubscription->status;
                        Log::info("Setting subscription status to " . $stripeSubscription->status);
                    }

                    // Save the changes
                    $companySubscription->save();
                    Log::info("Subscription status and expiry_date saved");
                    break;

                case 'customer.subscription.deleted':
                    $stripeSubscription = $event->data->object;
                    // Scenario 3: Subscription is permanently canceled
                    $companySubscription->status = 'canceled';
                    $companySubscription->start_date = Carbon::createFromTimestamp($stripeSubscription->current_period_start);
                    $companySubscription->expiry_date = Carbon::createFromTimestamp($stripeSubscription->current_period_end);
                    $companySubscription->save();
                    Log::info("Subscription status set to canceled");
                    break;

                default:
                    Log::info('Unhandled event type: ' . $event->type);
            }
        }

        return response()->json(['message' => 'success']);
    }

    private function payUnpaidInvoices($customerId)
    {
        $invoices = \Stripe\Invoice::all([
            'customer' => $customerId,
            'status' => 'open',
        ]);

        foreach ($invoices->data as $invoice) {
            try {
                if ($invoice instanceof \Stripe\Invoice && $invoice->id) {
                    try {
                        $invoice->pay();
                        Log::info("Invoice pay: " . $invoice);
                    } catch (\Exception $e) {
                        // Handle the payment errors
                        Log::error("Error paying invoice: " . $e->getMessage());
                    }
                } else {
                    Log::error("Invalid invoice object or ID");
                }
            } catch (\Exception $e) {
                // Handle the payment errors
                Log::error("Error paying invoice: " . $e->getMessage());
            }
        }
    }
}
