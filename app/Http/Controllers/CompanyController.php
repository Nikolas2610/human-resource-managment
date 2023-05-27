<?php

namespace App\Http\Controllers;

use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Resources\Company\CompanyResource;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\Company\CompanyCollection;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::all();

        return new CompanyCollection($companies);
    }

    public function show($id)
    {
        $company = Company::findOrFail($id);

        return new CompanyResource($company);
    }

    public function store(StoreCompanyRequest $request)
    {
        $validatedData = $request->validated();

        $company = Company::create([
            'name' => $validatedData['name'],
            'default_leave_amount' => $validatedData['default_leave_amount'],
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
