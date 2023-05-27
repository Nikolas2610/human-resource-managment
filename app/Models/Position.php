<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = [
        'title',
        'department_id',
        'company_id'
    ];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
