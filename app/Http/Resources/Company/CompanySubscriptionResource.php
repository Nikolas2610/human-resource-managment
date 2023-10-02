<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanySubscriptionResource extends JsonResource
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
            'start_date' => $this->start_date,
            'expiry_date' => $this->expiry_date,
            'status' => $this->status,
            'employees_count' => $this->employees_count,
            'subscription_plan' => [
                'id' => $this->subscriptionPlan->id,
                'name' => $this->subscriptionPlan->name,
                'duration' => $this->subscriptionPlan->duration,
                'price' => $this->subscriptionPlan->price,
                'min_users' => $this->subscriptionPlan->min_users,
                'max_users' => $this->subscriptionPlan->max_users,
            ],
        ];
    }
}
