<?php

namespace App\Http\Resources\LeaveType;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeLeavesResource extends JsonResource
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
            'type' => $this->type,
            'limit' => (bool) $this->limit,
            'leave_amount' => $this->leave_amount,
            'visible_to_employees' => (bool) $this->visible_to_employees,
            'allocated_leaves' => optional($this->pivot)->allocated_leaves,
            'used_leaves' => optional($this->pivot)->used_leaves,
            'remaining_leaves' => optional($this->pivot)->remaining_leaves,
            'year' => optional($this->pivot)->year,
        ];
    }
}
