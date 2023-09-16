<?php

namespace App\Http\Controllers;

use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Requests\Company\UpdateCustomizationRequest;
use App\Http\Resources\Company\CompanyResource;
use App\Models\Company;
use App\Models\Department;
use App\Models\Position;
use App\Http\Resources\Company\CompanyCollection;
use App\Http\Resources\Company\CompanyDepartmentResource;
use App\Http\Resources\Company\FullDetailsCompanyResource;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

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

    public function getCompanyFullDetails(Company $company)
    {
        return new FullDetailsCompanyResource($company);
    }

    public function getActiveEmployeesGroupedByDepartment(Company $company)
    {
        // Fetch departments and their active employees
        $departments = $company->departments()->with(['employees' => function ($query) {
            $query->where('active', 1);
        }])->get();

        // Initialize result array
        $result = [];

        // Populate result array
        foreach ($departments as $department) {
            $result[] = [
                'department_id' => $department->id,
                'department_name' => $department->name,
                'employees' => $department->employees,
            ];
        }

        return CompanyDepartmentResource::collection($departments);
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
            'name' => $validatedData['department_title'],
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
            'role' => 'hr'
        ]);

        return new CompanyResource($company);
    }

    public function update(UpdateCompanyRequest $request, $id)
    {
        $validatedData = $request->validated();

        $company = Company::findOrFail($id);

        foreach ($validatedData as $key => $value) {
            $company->$key = $value;
        }

        $company->save();

        return new CompanyResource($company);
    }

    public function updateCustomization(Company $company, UpdateCustomizationRequest $request)
    {
        $validatedData = $request->validated();
        // return response()->json(['data' => $validatedData]);

        // Handle logo image
        if ($request->hasFile('logo')) {
            // Delete previous image if exists
            if ($company->logo) {
                Storage::delete($company->logo);
            }

            // Store new image
            $logoPath = $request->file('logo')->store('logos', 'public');
            $validatedData['logo'] = $logoPath;
        }

        $company->update($validatedData);

        return new CompanyResource($company);
    }

    public function destroy($id)
    {
        $company = Company::findOrFail($id);

        $company->delete();

        return response()->json(['message' => 'Company deleted successfully']);
    }
}
