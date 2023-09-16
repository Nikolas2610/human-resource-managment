<?php

namespace App\Http\Resources\Employee;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeLeaveTypeResource extends JsonResource
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
            'allocated_leaves' => $this->pivot->allocated_leaves,
            'used_leaves' => $this->pivot->used_leaves,
            'unavailable_leaves' => $this->pivot->unavailable_leaves,
            'year' => $this->pivot->year,
            'leave_type_id' => $this->pivot->leave_type_id,
            'leave_type' => $this->type,
        ];
    }
}
