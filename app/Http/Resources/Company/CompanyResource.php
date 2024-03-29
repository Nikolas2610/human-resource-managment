<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
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
            'name' => $this->name,
            'require_manager_approval' => (bool) $this->require_manager_approval,
            'require_hr_approval' => (bool) $this->require_hr_approval,
            'celebrate_birthdays' => (bool) $this->celebrate_birthdays,
            'celebrate_name_days' => (bool) $this->celebrate_name_days,
            'celebrate_anniversaries' => (bool) $this->celebrate_anniversaries,
            'logo' => $this->logo ? asset('storage/' . $this->logo) : null,
            'administrator_mail' => $this->administrator_mail,
            'hr_mail' => $this->hr_mail,
            'primary_color' => $this->primary_color,
            'secondary_color' => $this->secondary_color
        ];
    }
}
