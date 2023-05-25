<?php

namespace App\Http\Controllers;

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
        $departments = $company->departments;

        return new DepartmentCollection($departments);
    }

    /**
     * Store a newly created department for a specific company in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Company $company)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department = $company->departments()->create([
            'name' => $request->name,
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
        // Make sure the department belongs to the company
        if ($company->id !== $department->company_id) {
            abort(404);
        }

        return new DepartmentResource($department);
    }

    /**
     * Update the specified department for a specific company in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Company  $company
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Company $company, Department $department)
    {
        // Make sure the department belongs to the company
        if ($company->id !== $department->company_id) {
            abort(404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department->update([
            'name' => $request->name,
        ]);

        return new DepartmentResource($department);
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
        // Make sure the department belongs to the company
        if ($company->id !== $department->company_id) {
            abort(404);
        }

        $department->delete();

        return response()->noContent();
    }
}
