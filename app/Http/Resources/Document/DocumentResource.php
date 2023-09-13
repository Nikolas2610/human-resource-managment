<?php

namespace App\Http\Resources\Document;

use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
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
            'title' => $this->title,
            'file_path' => asset('storage/' . $this->file_path),
            'employee_id' => $this->employee_id,
            'employee_name' => $this->employee->first_name . ' ' . $this->employee->last_name,
        ];
    }
}
