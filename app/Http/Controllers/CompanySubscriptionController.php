<?php

namespace App\Http\Controllers;

use App\Http\Resources\Company\CompanySubscriptionResource;
use App\Models\Company;
use App\Models\CompanyPayment;
use App\Models\CompanySubscriptions;
use Illuminate\Http\Request;

class CompanySubscriptionController extends Controller
{
    public function getCompanySubscription(Company $company)
    {
        $currentCompanySubscription = $company->latestSubscription;
        
        if (!$currentCompanySubscription) {
            return response()->json(['message' => 'No subscription found'], 404);
        }
        
        $currentCompanySubscription->subscriptionPlan;

        $currentCompanySubscription['employees_count']  = $company->employees()->count();

        return new CompanySubscriptionResource($currentCompanySubscription);
    }

    public function getCompanyInvoices(Company $company)
    {
        $subscriptions = CompanySubscriptions::where('company_id', $company->id)->get();

        foreach ($subscriptions as $subscription) {
            $subscription->payments;
        }

        return response()->json($subscriptions);
    }
}
