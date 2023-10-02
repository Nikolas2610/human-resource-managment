<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'duration',
        'features',
        'stripe_price_id',
        'is_active',
        'access_level',
        'min_users',
        'max_users',
        'has_trial',
    ];

    public function companies()
    {
        return $this->hasMany(Company::class, 'subscription_plan_id', 'id');
    }
}
