<?php

namespace App\Http\Requests\LeaveType;

use App\Http\Requests\Request;

class StoreLeaveTypeRequest extends Request
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
            'type' => 'required|string',
            'leave_amount' => 'required_if:limit,true|integer|nullable',
            'visible_to_employees' => 'required|boolean',
            'limit' => 'required|boolean'
        ];
    }
}
