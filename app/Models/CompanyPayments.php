<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyPayments extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_subscription_id',
        'amount',
        'currency',
        'stripe_invoice_id',
    ];
}
