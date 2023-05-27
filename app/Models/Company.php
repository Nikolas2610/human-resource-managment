<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'default_leave_amount',
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
}
