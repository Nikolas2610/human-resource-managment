<?php

namespace App\Http\Resources\LeaveType;

use Illuminate\Http\Resources\Json\JsonResource;

class LeaveTypeResource extends JsonResource
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
            'leave_amount' =>  $this->leave_amount,
            'visible_to_employees' =>  $this->visible_to_employees,
            'limit' =>  $this->limit,
        ];
    }
}
