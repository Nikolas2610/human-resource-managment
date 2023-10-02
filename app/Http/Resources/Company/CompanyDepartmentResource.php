<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CompanyDepartmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'department_id' => $this->id,
            'department_name' => $this->name,
            'employees' => $this->employees->filter(function ($employee) {
                // Only include employees who have started working
                return Carbon::parse($employee->work_start_date)->isPast();
            })->map(function ($employee) {
                // Calculate the time they've been at the company
                $workStartDate = Carbon::parse($employee->work_start_date);
                $currentDate = Carbon::now();
                $years = $workStartDate->diffInYears($currentDate);
                $months = $workStartDate->diffInMonths($currentDate) % 12;

                // Determine the work duration string
                $workDuration = ($years > 0 ? $years . " years " : "") . ($months > 0 ? $months . " months" : "");
                if ($years === 0 && $months === 0) {
                    $workDuration = "0 months";
                }

                return [
                    'id' => $employee->id,
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                    'position' => optional($employee->position)->title,
                    'email' => $employee->email,
                    'phone' => $employee->phone,
                    'work_duration' => $workDuration,
                    'reports_to' => $employee->reports_to ? optional($employee->reportsTo)->first_name . ' ' . optional($employee->reportsTo)->last_name : null,
                    'reports_to_image' => asset('storage/' . optional($employee->reportsTo)->image),
                    'work_start_date' => $employee->work_start_date,
                    'image' => asset('storage/' . $employee->image)
                ];
            }),
        ];
    }
}
