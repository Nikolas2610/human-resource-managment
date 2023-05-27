<?php

namespace App\Http\Resources\Position;

use App\Http\Resources\Department\DepartmentResource;
use Illuminate\Http\Resources\Json\JsonResource;

class PositionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'department' => new DepartmentResource($this->department),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
