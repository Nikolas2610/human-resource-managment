<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySubscriptions extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'subscription_plan_id',
        'stripe_session_id',
        'stripe_subscription_id',
        'status',
        'start_date',
        'expiry_date',
    ];

    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    public function subscriptionPlan()
    {
        return $this->belongsTo('App\Models\SubscriptionPlan', 'subscription_plan_id', 'id');
    }

    public function payments()
    {
        return $this->hasMany('App\Models\CompanyPayment', 'company_subscription_id', 'id');
    }
}
