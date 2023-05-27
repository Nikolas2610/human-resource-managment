<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $fillable = [
        'type', 
        'company_id'
    ];

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }
    
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}

