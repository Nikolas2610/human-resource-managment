<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'company_id',
        'expires_at',
    ];

    protected $dates = [
        'expires_at',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
