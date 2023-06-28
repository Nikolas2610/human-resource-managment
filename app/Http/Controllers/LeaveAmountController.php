<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveAmount;
use App\Http\Requests\LeaveAmount\StoreLeaveAmountRequest;
use App\Http\Resources\LeaveAmount\LeaveAmountResource;
use App\Models\Company;

class LeaveAmountController extends Controller
{
    public function index(Company $company)
    {
        return LeaveAmountResource::collection($company->leaveAmounts);
    }

    public function store(StoreLeaveAmountRequest $request, Company $company)
    {
        $leave = LeaveAmount::create($request->validated());
        return new LeaveAmountResource($leave);
    }

    public function show(Company $company, LeaveAmount $leaveAmount)
    {
        return new LeaveAmountResource($leaveAmount);
    }

    public function update(StoreLeaveAmountRequest $request, Company $company, LeaveAmount $leaveAmount)
    {
        $leaveAmount->update($request->validated());
        return new LeaveAmountResource($leaveAmount);
    }

    public function destroy(Company $company, LeaveAmount $leaveAmount)
    {
        $leaveAmount->delete();
        return response()->json(null, 204);
    }
}
