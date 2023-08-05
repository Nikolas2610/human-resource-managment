<?php

namespace App\Http\Controllers;

use App\Http\Requests\Department\StoreDepartmentRequest;
use App\Http\Resources\Department\DepartmentCollection;
use App\Http\Resources\Department\DepartmentResource;
use App\Models\Company;
use App\Models\Department;
use Illuminate\Http\Request;


class DepartmentsController extends Controller
{
    /**
     * Display a listing of the departments for a specific company.
     *
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function index(Company $company)
    {
        $departments = $company->departments()->with('employees')->get();

        // return DepartmentCollection::make($departments)->resolve();
        return new DepartmentCollection($departments);
        // return response()->json($departments);
    }

    /**
     * Store a newly created department for a specific company in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function store(StoreDepartmentRequest $request, Company $company)
    {
        $validateData = $request->validated();

        $department = $company->departments()->create([
            'name' => $validateData['name'],
        ]);

        return new DepartmentResource($department);
    }

    /**
     * Display the specified department for a specific company.
     *
     * @param  \App\Models\Company  $company
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function show(Company $company, Department $department)
    {
        try {
            // Make sure the department belongs to the company
            $this->ensureDepartmentBelongsToCompany($company, $department);
            return new DepartmentResource($department);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }
    }

    /**
     * Update the specified department for a specific company in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Company  $company
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function update(StoreDepartmentRequest $request, Company $company, Department $department)
    {
        try {
            $this->ensureDepartmentBelongsToCompany($company, $department);

            $validatedData = $request->validated();

            $department->update([
                'name' => $validatedData['name'],
            ]);

            return new DepartmentResource($department);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }
    }

    /**
     * Remove the specified department for a specific company from storage.
     *
     * @param  \App\Models\Company  $company
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function destroy(Company $company, Department $department)
    {
        try {
            // Make sure the department belongs to the company
            $this->ensureDepartmentBelongsToCompany($company, $department);
    
            $department->delete();
    
            return response()->json(['message' => 'Department deleted successfully.'], 200);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => 'Unable to delete department.'], 401);
        }
    }

    private function ensureDepartmentBelongsToCompany(Company $company, Department $department)
    {
        if ($company->id !== $department->company_id) {
            abort(401, 'Department does not belong to the company.');
        }
    }
}
