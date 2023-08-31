<?php

namespace App\Http\Resources\Employee;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeAnniversaryResource extends JsonResource
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
            'name' => $this->first_name . " " . $this->last_name,
            'next_anniversary' => $this->next_anniversary,
            'years_worked' => $this->years_worked,
            'image' => $this->image,
        ];
    }
}
