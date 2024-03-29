<?php

namespace App\Http\Requests\Company;

use App\Http\Requests\Request;

class StoreCompanyRequest extends Request
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
            'name' => 'required|string|max:255',
            'require_manager_approval' => 'boolean',
            'require_hr_approval' => 'boolean',
            'position_title' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:employees',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string',
            'address' => 'required|string',
            'work_start_date' => 'required',
            'department_title' => 'required|string|max:255',
            'email_company' => 'required|string|email|max:255|unique:companies', 
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
        ];
    }
}
