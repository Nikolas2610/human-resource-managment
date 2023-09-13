<?php

namespace App\Http\Resources\Employee;

use App\Http\Resources\Department\DepartmentResource;
use App\Http\Resources\LeaveAmount\LeaveAmountResource;
use App\Http\Resources\Position\PositionResource;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'active' => $this->active,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'role' => $this->role,
            'salary' => $this->salary,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'image' => asset('storage/' . $this->image),
            'work_start_date' => $this->work_start_date,
            'work_end_date' => $this->work_end_date,
            'department' => new DepartmentResource($this->department),
            'position' => new PositionResource($this->position),
            'managed_departments' => DepartmentResource::collection($this->managedDepartments),
            'reports_to' => new ReportToEmployeeResource($this->reportsTo),
            'leave_types' => EmployeeLeaveTypeResource::collection($this->leaveTypes),
            // 'documents' => EmployeeDocumentResource::collection($this->documents),
            'personal_email' => $this->personal_email,
            'birthday' => $this->birthday,
            'name_day' => $this->name_day,
            'married' => (bool) $this->married,
            'childs_count' => $this->childs_count,
            'type_of_job' => $this->type_of_job,
        ];
    }
}
