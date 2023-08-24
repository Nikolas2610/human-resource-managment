<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $fillable = [
        'type',
        'company_id',
        'visible_to_employees',
        'limit',
        'leave_amount'
    ];

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function employees()
    {
        return $this->belongsToMany('App\Models\Employee')
            ->withPivot('leave_days_taken');
    }
}
