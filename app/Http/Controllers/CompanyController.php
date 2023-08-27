<?php

namespace App\Http\Controllers;

use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Resources\Company\CompanyResource;
use App\Models\Company;
use App\Models\Department;
use App\Models\Position;
use App\Http\Resources\Company\CompanyCollection;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::all();

        return new CompanyCollection($companies);
    }

    public function show(Company $company)
    {
        return new CompanyResource($company);
    }

    public function store(StoreCompanyRequest $request)
    {
        $validatedData = $request->validated();

        $company = Company::create([
            'name' => $validatedData['name'],
            'require_manager_approval' => $validatedData['require_manager_approval'] ?? true,
            'require_hr_approval' => $validatedData['require_hr_approval'] ?? true,
        ]);

        // Create the management department
        $department = Department::create([
            'name' => 'Management',
            'company_id' => $company->id,
        ]);

        // Create the CEO position
        $position = Position::create([
            'title' =>  $validatedData['position_title'],
            'department_id' => $department->id,
            'company_id' => $company->id,
        ]);

        $employee = Employee::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'phone' => $validatedData['phone'],
            'address' => $validatedData['address'],
            'work_start_date' => $validatedData['work_start_date'],
            'company_id' => $company->id,
            'department_id' => $department->id,
            'position_id' => $position->id,
        ]);

        return new CompanyResource($company);
    }

    public function update(UpdateCompanyRequest $request, $id)
    {
        $validatedData = $request->validated();

        $company = Company::findOrFail($id);

        $company->update([
            'name' => $validatedData['name'],
            'default_leave_amount' => $validatedData['default_leave_amount'],
        ]);

        return new CompanyResource($company);
    }

    public function destroy($id)
    {
        $company = Company::findOrFail($id);

        $company->delete();

        return response()->json(['message' => 'Company deleted successfully']);
    }
}
