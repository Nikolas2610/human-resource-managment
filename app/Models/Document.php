<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'title',
        'description',
        'file_path',
    ];

    /**
     * Get the employee that owns the document.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
