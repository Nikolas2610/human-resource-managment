<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveType\StoreLeaveTypeRequest;
use App\Http\Requests\LeaveType\UpdateLeaveTypeRequest;
use App\Models\LeaveType;
use App\Models\Company;
use App\Http\Resources\LeaveType\LeaveTypeResource;
use App\Http\Resources\LeaveType\LeaveTypeCollection;
use Illuminate\Http\JsonResponse;

class LeaveTypeController extends Controller
{
    public function index(Company $company)
    {
        try {
            $leaveTypes = $company->leaveTypes;

            return new LeaveTypeCollection($leaveTypes);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }
    }

    public function store(StoreLeaveTypeRequest $request, Company $company)
    {
        try {
            $validatedData = $request->validated();

            $validatedData['company_id'] = $company->id;

            $leaveType = LeaveType::create($validatedData);

            return new LeaveTypeResource($leaveType);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }
    }

    public function show(Company $company, LeaveType $leaveType)
    {
        try {
            $this->ensureLeaveTypeBelongsToCompany($company, $leaveType);

            return new LeaveTypeResource($leaveType);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }
    }

    public function update(UpdateLeaveTypeRequest $request, Company $company, LeaveType $leaveType)
    {
        try {
            $validatedData = $request->validated();

            $this->ensureLeaveTypeBelongsToCompany($company, $leaveType);

            $validatedData['company_id'] = $company->id;

            $leaveType->update($validatedData);

            return new LeaveTypeResource($leaveType);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }
    }

    public function destroy(Company $company, LeaveType $leaveType)
    {
        try {
            $this->ensureLeaveTypeBelongsToCompany($company, $leaveType);

            $leaveType->delete();

            return response()->json(['message' => 'Leave type deleted successfully.'], 200);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }
    }

    protected function ensureLeaveTypeBelongsToCompany($company, $leaveType)
    {
        if ($leaveType->company_id !== $company->id) {
            $this->unauthorizedResponse('The leave type does not belong to this company.');
        }
    }

    protected function unauthorizedResponse($message): JsonResponse
    {
        abort(403, $message);
    }
}
