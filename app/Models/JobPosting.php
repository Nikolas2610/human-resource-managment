<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = [
        'title',
        'department_id',
        'position_id',
        'description',
        'requirements',
        'responsibilities',
        'salary_range',
        'employment_type',
        'location',
        'status',
        'posted_date',
        'closing_date',
        'company_id',
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
}
