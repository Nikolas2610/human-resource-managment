<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\EmployeeUpdateRequest;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Resources\Employee\EmployeeResource;
use Illuminate\Support\Facades\Hash;
use App\Models\Company;
use App\Models\Employee;

class CompanyEmployeeController extends Controller
{
    public function index(Company $company)
    {
        $employees = $company->employees()->with('reportsTo')->get();
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

        return response()->json($employee);
    }


    // Delete an employee of a specific company
    public function destroy(Company $company, Employee $employee)
    {
        // Check if the employee belongs to the company
        if ($employee->company_id != $company->id) {
            return response()->json(['error' => 'Employee does not belong to this company'], 404);
        }

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
}
