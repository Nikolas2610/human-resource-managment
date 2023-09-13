<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Resources\Json\JsonResource;

class FullDetailsCompanyResource extends JsonResource
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
            'logo' => asset('storage/' . $this->logo),
            'administrator_mail' => $this->administrator_mail,
            'hr_mail' => $this->hr_mail,
            'primary_color' => $this->primary_color,
            'email_company' => $this->email_company,
            'address' => $this->address,
            'phone_number' => $this->phone_number,
            'contact_email' => $this->contact_email,
            'website' => $this->website,
            'facebook' => $this->facebook,
            'instagram' => $this->instagram,
            'twitter' => $this->twitter,
            'linkedin' => $this->linkedin,
            'youtube' => $this->youtube,
            'administrator_mail' => $this->administrator_mail,
            'hr_mail' => $this->hr_mail,
        ];
    }
}
