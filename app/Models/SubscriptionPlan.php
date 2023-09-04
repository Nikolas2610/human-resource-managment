<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'duration', 'features'];

    public function companies()
    {
        return $this->hasMany(Company::class, 'subscription_plan_id', 'id');
    }
}
