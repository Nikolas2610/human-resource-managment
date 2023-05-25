<?php

namespace App\Http\Controllers;

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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'default_leave_amount' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $company = Company::create([
            'name' => $request->name,
            'default_leave_amount' => $request->default_leave_amount,
        ]);

        return new CompanyResource($company);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'default_leave_amount' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $company = Company::findOrFail($id);

        $company->update($request->only(['name', 'default_leave_amount']));

        return new CompanyResource($company);
    }

    public function destroy($id)
    {
        $company = Company::findOrFail($id);

        $company->delete();

        return response()->json(['message' => 'Company deleted successfully']);
    }
}
