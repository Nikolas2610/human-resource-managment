<?php

namespace App\Http\Requests\Company;

use App\Http\Requests\Request;

class UpdateCompanyRequest extends Request
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
            'name' => 'nullable|string|max:255',
            'email_company' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:255',
            'contact_email' => 'nullable|string|max:255',
            'hr_mail' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'twitter' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'youtube' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'require_hr_approval' => 'nullable|boolean',
            'require_manager_approval' => 'nullable|boolean',
            'celebrate_birthdays' => 'nullable|boolean',
            'celebrate_name_days' => 'nullable|boolean',
            'celebrate_anniversaries' => 'nullable|boolean',
        ];
    }
}
