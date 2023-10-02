<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanySubscriptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Invoice;

class PaymentTokenController extends Controller
{
    public function handleSuccess(Company $company, Request $request)
    {

        // Set the Stripe API key
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        // Get the session ID from the request
        $sessionId = $request->get('session_id');

        if (!$sessionId) {
            return response()->json([
                'success' => false,
                'message' => 'Session ID not provided.'
            ], 400);
        }

        // Retrieve the session
        try {
            $session = Session::retrieve($sessionId);

            // Fetch the invoices for the Stripe customer
            try {
                $stripeInvoices = Invoice::all(['customer' => $company->stripe_customer_id]);


                $formattedInvoice = [
                    'invoice_number' => $stripeInvoices->data[0]->number,
                    'due_date' => date('Y-m-d', $stripeInvoices->data[0]->due_date),
                    'amount_due' => $stripeInvoices->data[0]->amount_due / 100, // Assuming default currency is in cents
                    'currency' => $stripeInvoices->data[0]->currency,
                    'status' => $stripeInvoices->data[0]->status
                ];

                $message = $stripeInvoices->data[0]->status ? 'Payment successful!' : 'Payment successful, but there are still unpaid invoices.';

                return response()->json([
                    'success' => true,
                    'message' => $message,
                    'invoice' => $formattedInvoice
                ]);
            } catch (\Exception $e) {
                throw new \Exception('Error fetching invoices: ' . $e->getMessage());
            }
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Payment was not successful. Please contact support.',
            ]);
        }
    }

    public function handleFailure(Company $company, Request $request)
    {
        // Set the Stripe API key
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        // Get the session ID from the request
        $sessionId = $request->get('session_id');

        // If session ID is not provided, return an error
        if (!$sessionId) {
            return response()->json([
                'success' => false,
                'message' => 'Session ID not provided.'
            ], 400);
        }

        // Attempt to retrieve the session to validate the session ID
        try {
            $session = \Stripe\Checkout\Session::retrieve($sessionId);

            // If session is retrieved successfully, then return the failure message
            return response()->json([
                'success' => true,
                'message' => 'Payment failed. Please try again or contact support.'
            ]);
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            // If the session ID is invalid or some other Stripe error occurs, return an error message
            return response()->json([
                'success' => false,
                'message' => 'Invalid session ID.'
            ], 400);
        }
    }

    public function handlePaymentUpdateStatusSuccess(Company $company, Request $request)
    {
        // Set the Stripe API key
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $sessionId = $request->input('session_id');

        if (!$sessionId) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payment session.'
            ], 400);
        }

        try {
            $session = \Stripe\Checkout\Session::retrieve($sessionId);
            $customerId = $session->customer;

            // Check if there are any unpaid/open invoices for this customer
            $unpaidInvoices = \Stripe\Invoice::all([
                'customer' => $customerId,
                'status' => 'open'
            ]);

            if (count($unpaidInvoices->data) > 0) {
                // There are still unpaid invoices after the payment method update
                return response()->json([
                    'success' => true,
                    'message' => 'Your payment method has been updated, but there were issues processing some invoices. Please update payment method or contact support.'
                ]); // HTTP 402 Payment Required
            } else {
                return response()->json([
                    'success' => true,
                    'message' => 'Your payment method has been updated successfully, and any pending invoices have been paid.'
                ], 200); // HTTP 200 OK
            }
        } catch (\Exception $e) {
            Log::error('Error in handlePaymentUpdateStatus: ' . $e->getMessage());
            return response()->json([
                'success' => true,
                'error' => 'An error occurred while processing the payment status. Please try again later or contact support.'
            ], 500);
        }
    }

    public function handleUpdatePaymentStatusFailure(Company $company, Request $request)
    {
        // Set the Stripe API key
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $sessionId = $request->input('session_id');

        if (!$sessionId) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payment session.'
            ], 400);
        }

        try {
            $session = \Stripe\Checkout\Session::retrieve($sessionId);
            $customerId = $session->customer;

            // Check if there are any unpaid/open invoices for this customer
            $unpaidInvoices = \Stripe\Invoice::all([
                'customer' => $customerId,
                'status' => 'open'
            ]);

            if (count($unpaidInvoices->data) > 0) {
                return response()->json([
                    'success' => true,
                    'message' => 'Your payment method update failed, and there are still pending invoices. Please try again or contact support.'
                ]);
            } else {
                return response()->json([
                    'success' => true,
                    'message' => 'Your payment method update failed. Please try again or contact support.'
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in handleFailure: ' . $e->getMessage());
            return response()->json([
                'success' => true,
                'error' => 'An error occurred while processing the payment status. Please try again later or contact support.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
