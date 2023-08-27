<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Employee extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Roles
    const ROLE_EMPLOYEE = 'employee';
    const ROLE_HR = 'hr';
    const ROLE_ACCOUNTING = 'accounting';
    const ROLE_ADMIN = 'admin';
    const ROLE_OWNER = 'owner';
    const ROLE_MANAGER = 'manager';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'address',
        'image',
        'work_start_date',
        'work_end_date',
        'company_id',
        'department_id',
        'position_id',
        'role',
        'salary',
        'reports_to',
        'active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function getRememberTokenName()
    {
        return 'remember_token';
    }

    public function managedDepartments()
    {
        return $this->hasMany(Department::class, 'manager_id');
    }

    public function leaveAmounts()
    {
        return $this->belongsToMany(LeaveAmount::class, 'employee_leave_amount');
    }

    public function reportsTo()
    {
        return $this->belongsTo(Employee::class, 'reports_to');
    }

    public function leaveTypes()
    {
        return $this->belongsToMany('App\Models\LeaveType', 'employee_leave_type')  // specify the pivot table name if it's not the default
            ->withPivot('allocated_leaves', 'used_leaves', 'unavailable_leaves', 'year')
            ->orderByDesc('pivot_year');  // specify the additional pivot fields
    }

    public function currentYearLeaveTypes()
    {
        $currentYear = Carbon::now()->year; // Getting the current year using Carbon

        return $this->belongsToMany('App\Models\LeaveType', 'employee_leave_type')
            ->withPivot('allocated_leaves', 'used_leaves', 'unavailable_leaves', 'remaining_leaves', 'year')
            ->wherePivot('year', $currentYear) // Filtering by the current year
            ->orderByDesc('pivot_year');
    }
}
