<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\EmployeeUpdateRequest;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Resources\Employee\EmployeeResource;
use Illuminate\Support\Facades\Hash;
use App\Models\Company;
use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Support\Facades\DB;

class CompanyEmployeeController extends Controller
{
    public function index(Company $company)
    {
        $employees = $company->employees()->with('reportsTo', 'leaveTypes')->get();
        return EmployeeResource::collection($employees);
    }

    public function store(Company $company, StoreEmployeeRequest $request)
    {
        $request->validated();

        $employee = new Employee([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'work_start_date' => $request->work_start_date,
            'company_id' => $company->id,
            'department_id' => $request->department_id,
            'position_id' => $request->position_id,
            'role' => $request->role,
            'salary' => $request->salary,
            'reports_to' => $request->reports_to,
            'active' => $request->active
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('public/user_images');
            $employee->image = $path;
        }

        $employee->save();

        // Check if leave_types are provided in the request
        $this->syncEmployeeLeaveTypes($employee, $request, $company);

        return response()->json([
            'message' => 'Employee registered successfully',
        ]);
    }

    public function show(Company $company, Employee $employee)
    {
        if ($employee->company_id != $company->id) {
            return response()->json(['error' => 'Employee does not belong to this company'], 404);
        }
        return new EmployeeResource($employee);
    }

    public function update(EmployeeUpdateRequest $request, Company $company, Employee $employee)
    {
        // Check if the employee belongs to the company
        if ($employee->company_id != $company->id) {
            return response()->json(['error' => 'Employee does not belong to this company'], 404);
        }

        // Get validated data and exclude password and password_confirmation
        $dataToUpdate = collect($request->validated())
            ->except(['password', 'password_confirmation'])
            ->toArray();

        $employee->update($dataToUpdate);

        $this->syncEmployeeLeaveTypes($employee, $request, $company);

        return response()->json($employee);
    }


    // Delete an employee of a specific company
    public function destroy(Company $company, Employee $employee)
    {
        // Check if the employee belongs to the company
        if ($employee->company_id != $company->id) {
            return response()->json(['error' => 'Employee does not belong to this company'], 404);
        }

        // Manually delete related rows in employee_leave_type
        $employee->leaveTypes()->detach();

        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully.'], 200);
    }

    public function resetPassword(Company $company, Employee $employee)
    {
        // Check if the employee belongs to the company
        if ($employee->company_id != $company->id) {
            return response()->json(['error' => 'Employee does not belong to this company'], 404);
        }

        // Generate new password base employee credentials
        $newPassword = $employee->first_name . $employee->last_name . "|$employee->id";
        // Delete spaces
        $newPassword = str_replace(' ', '', $newPassword);

        $employee->password = Hash::make($newPassword);
        $employee->save();

        return response()->json([
            'message' => 'Employee reset password successfully',
            "pass" => $newPassword
        ]);
    }

    private function syncEmployeeLeaveTypes(Employee $employee, $request, Company $company)
    {
        if ($request->has('leave_types')) {
            // Fetch the leave type IDs associated with the current company
            $validLeaveTypeIds = LeaveType::where('company_id', $company->id)->pluck('id')->toArray();

            foreach ($request->leave_types as $leaveType) {
                if (in_array($leaveType['id'], $validLeaveTypeIds)) {
                    $conditions = [
                        'employee_id' => $employee->id,
                        'leave_type_id' => $leaveType['id'],
                        'year' => $leaveType['year']
                    ];

                    $values = [
                        'allocated_leaves' => $leaveType['allocated_leaves'],
                        'used_leaves' => $leaveType['used_leaves'],
                        'unavailable_leaves' => $leaveType['unavailable_leaves'],
                        'remaining_leaves' => $leaveType['allocated_leaves'] - ($leaveType['used_leaves'] + $leaveType['unavailable_leaves'])
                    ];

                    // Use updateOrInsert to either update the existing record or insert a new one
                    DB::table('employee_leave_type')->updateOrInsert($conditions, $values);
                }
            }
        }
    }
}
