<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'name',
        'company_id',
        'manager_id'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class)->where('active', 1);
    }

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }
}
