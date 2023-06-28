<?php

namespace App\Http\Requests\LeaveAmount;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveAmountRequest extends FormRequest
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
            'title' => 'required|max:255',
            'leave_amount' => 'required|integer',
            'company_id' => 'required|exists:companies,id',
        ];
    }
}
