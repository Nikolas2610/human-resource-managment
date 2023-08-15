<?php

namespace App\Http\Resources\LeaveType;

use Illuminate\Http\Resources\Json\ResourceCollection;

class LeaveTypeCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->collection->transform(function ($leaveType) {
            return [
                'id' => $leaveType->id,
                'type' => $leaveType->type,
            ];
        });
    }
}
