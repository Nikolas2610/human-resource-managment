<?php

namespace App\Http\Resources\LeaveRequest;

use Illuminate\Http\Resources\Json\JsonResource;

class LeaveRequestResource extends JsonResource
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
            'employee_id' => $this->employee_id,
            'employee_name' => $this->employee->first_name . " " . $this->employee->last_name,
            'department' => [
                'id' => $this->employee->department->id,
                'name' => $this->employee->department->name,
            ],
            'leave_type_id' =>  $this->leave_type_id,
            'leave_type_name' =>  $this->leaveType->type,
            'start_date' =>  $this->start_date,
            'end_date' =>  $this->end_date,
            'reason' =>  $this->reason,
            'status' =>  $this->status,
            'days_requested' =>  $this->days_requested,
            'manager_approved' =>  $this->manager_approved,
            'hr_approved' =>  $this->hr_approved,
            'created_at' =>  $this->created_at,
        ];
    }
}
