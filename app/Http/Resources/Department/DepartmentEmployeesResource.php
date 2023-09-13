<?php

namespace App\Http\Resources\Department;

use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentEmployeesResource extends JsonResource
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
            'id' => $this->id,
            'name' => $this->name,
            'manager_name' => $this->manager ? $this->manager->first_name . " " . $this->manager->last_name  : null,
            'employees' => $this->employees->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->first_name . " " . $employee->last_name,
                    'image' => asset('storage/' . $employee->image),
                    'email' => $employee->email,
                    'role' => $employee->role,
                    'salary' => $employee->salary,
                    'phone' => $employee->phone,
                    'address' => $employee->address,
                    'reports_to' => $employee->reportsTo ?
                        $employee->reportsTo->first_name . " " . $employee->reportsTo->last_name : null,
                    'position' => $employee->position ?
                        $employee->position->title : null,
                    'leaves' => $employee->currentYearLeaveTypes->map(function ($leaveType) {
                        return [
                            'allocated_leaves' => $leaveType->pivot->allocated_leaves ?? null,
                            'used_leaves' => $leaveType->pivot->used_leaves ?? null,
                            'remaining_leaves' => $leaveType->pivot->remaining_leaves ?? null,
                            'unavailable_leaves' => $leaveType->pivot->unavailable_leaves ?? null,
                            'type' => $leaveType->type ?? null,
                        ];
                    })
                ];
            })
        ];
    }
}
