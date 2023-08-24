<?php

namespace App\Http\Requests\Employee;

use App\Http\Requests\Request;

class StoreEmployeeRequest extends Request
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
            'active' => 'required|boolean',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:employees',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string',
            'address' => 'required|string',
            'work_start_date' => 'required',
            'department_id' => 'required|integer',
            'position_id' => 'required|integer',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'salary' => 'numeric|min:0',  // Adjust the min and max as needed
            'role' => 'required|string|in:employee,hr,accounting,admin,owner,manager',
            'reports_to' => 'nullable|integer|exists:employees,id',  // Ensure the referenced ID exists
            'leave_types' => 'sometimes|array',
            'leave_types.*.id' => 'required|integer|exists:leave_types,id',
            'leave_types.*.allocated_leaves' => 'required|integer|min:0',
            'leave_types.*.used_leaves' => 'required|integer|min:0',
            'leave_types.*.unavailable_leaves' => 'required|integer|min:0',
            'leave_types.*.year' => 'required|integer|min:1900|max:2100'
        ];
    }
}
