<?php

namespace App\Http\Requests\Subscription;

use App\Http\Requests\Request;

class ChangeSubscriptionPlanRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
        ];
    }
}
