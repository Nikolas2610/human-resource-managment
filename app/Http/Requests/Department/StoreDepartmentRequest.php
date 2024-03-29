<?php

namespace App\Http\Requests\Department;

use App\Http\Requests\Request;

class StoreDepartmentRequest extends Request
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
            'manager_id' =>  'nullable|integer|exists:employees,id'
        ];
    }
}
