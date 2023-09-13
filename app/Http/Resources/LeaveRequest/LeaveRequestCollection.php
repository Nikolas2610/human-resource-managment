<?php

namespace App\Http\Resources\LeaveRequest;

use Illuminate\Http\Resources\Json\ResourceCollection;

class LeaveRequestCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->collection->transform(function ($leaveRequest) {
            return [
                'id' => $leaveRequest->id,
                'employee_id' => $leaveRequest->employee_id,
                'employee_name' => $leaveRequest->employee->first_name . " " . $leaveRequest->employee->last_name,
                'employee_image' => $leaveRequest->employee->image,
                'employee_image' =>  $leaveRequest->employee->image ? asset('storage/' . $leaveRequest->employee->image) : null,
                'department' => [
                    'id' => $leaveRequest->employee->department->id,
                    'name' => $leaveRequest->employee->department->name,
                ],
                'leave_type_id' =>  $leaveRequest->leave_type_id,
                'leave_type_name' =>  $leaveRequest->leaveType->type,
                'start_date' =>  $leaveRequest->start_date,
                'end_date' =>  $leaveRequest->end_date,
                'reason' =>  $leaveRequest->reason,
                'status' =>  $leaveRequest->status,
                'days_requested' =>  $leaveRequest->days_requested,
                'manager_approved' =>  $leaveRequest->manager_approved,
                'hr_approved' =>  $leaveRequest->hr_approved,
                'created_at' =>  $leaveRequest->created_at,
            ];
        });
    }
}
