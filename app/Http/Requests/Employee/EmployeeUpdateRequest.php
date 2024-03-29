<?php

namespace App\Http\Requests\Employee;

use App\Http\Requests\Request;

class EmployeeUpdateRequest extends Request
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
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string',
            'address' => 'sometimes|string',
            'work_start_date' => 'sometimes|date',
            'company_id' => 'sometimes|integer|exists:companies,id',
            'department_id' => 'sometimes|integer|exists:departments,id',
            'position_id' => 'sometimes|integer|exists:positions,id',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'email' => 'sometimes|string|email|max:255|unique:employees,email,' . $this->employee->id,
            // 'password' => 'sometimes|string|min:8|confirmed',
            'active' => 'required|in:true,false',
            'role' => 'required|string|in:employee,hr,accounting,admin,owner,manager',
            'personal_email' => 'nullable|string|email|max:255',
            'birthday' => 'nullable|date',
            'name_day' => 'nullable|date',
            'married' => 'nullable|in:true,false',
            'childs_count' => 'nullable|integer|min:0',
            'type_of_job' => 'nullable|string|in:on-site,hybrid,working-from-home',
            'image' => 'nullable|image|mimes:jpeg,png,gif,svg|max:1024',
            'reports_to' => 'nullable|integer|exists:employees,id',
            'salary' => 'numeric|min:0',
        ];
    }
}
