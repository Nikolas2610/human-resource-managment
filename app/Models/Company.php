<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'require_manager_approval',
        'require_hr_approval',
        'celebrate_birthdays',
        'celebrate_name_days',
        'celebrate_anniversaries',
        'email_company',
        'logo',
        'primary_color',
        'secondary_color',
        'address',
        'phone_number',
        'contact_email',
        'website',
        'facebook',
        'instagram',
        'twitter',
        'linkedin',
        'youtube',
        'administrator_mail',
        'hr_mail',
        'subscription_plan_id',
        'subscription_status',
        'subscription_expiry_date',
        'trial_started_at',
        'trial_ends_at',
    ];

    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    public function leaveTypes()
    {
        return $this->hasMany(LeaveType::class);
    }

    public function leaveRequests()
    {
        return LeaveRequest::whereIn('employee_id', function ($query) {
            $query->select('id')
                ->from('employees')
                ->where('company_id', $this->id);
        });
    }

    public function leaveAmounts()
    {
        return $this->hasMany(LeaveAmount::class);
    }

    public function subscriptionPlan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id', 'id');
    }
}
