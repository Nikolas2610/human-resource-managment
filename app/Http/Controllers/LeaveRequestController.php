<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveRequest\StoreLeaveRequestRequest;
use App\Http\Requests\LeaveRequest\UpdateLeaveRequestRequest;
use App\Models\LeaveRequest;
use App\Http\Resources\LeaveRequest\LeaveRequestResource;
use App\Http\Resources\LeaveRequest\LeaveRequestCollection;
use App\Models\Company;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;

class LeaveRequestController extends Controller
{
    public function index(Company $company)
    {
        $leaveRequests = $company->leaveRequests()->get();

        return new LeaveRequestCollection($leaveRequests);
    }

    public function store(StoreLeaveRequestRequest $request, Company $company)
    {
        try {
            $validatedData = $request->validated();

            $this->ensureLeaveRequestBelongsToEmployee($validatedData['employee_id']);

            $validatedData['status'] = 'pending';

            $leaveRequest = LeaveRequest::create($validatedData);

            return new LeaveRequestResource($leaveRequest);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }
    }

    public function show(Company $company, LeaveRequest $leaveRequest)
    {
        try {
            $this->ensureLeaveRequestBelongsToCompany($leaveRequest, $company);

            return new LeaveRequestResource($leaveRequest);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }
    }

    public function update(UpdateLeaveRequestRequest $request, Company $company, LeaveRequest $leaveRequest)
    {
        try {
            $validatedData = $request->validated();

            $this->ensureLeaveRequestBelongsToCompany($leaveRequest, $company);

            $this->ensureLeaveRequestBelongsToEmployee($validatedData['employee_id']);

            $leaveRequest->update($validatedData);

            return new LeaveRequestResource($leaveRequest);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }
    }

    public function destroy(Company $company, LeaveRequest $leaveRequest)
    {
        try {
            $this->ensureLeaveRequestBelongsToCompany($leaveRequest, $company);

            $this->ensureLeaveRequestBelongsToEmployee($leaveRequest->employee_id);

            $leaveRequest->delete();

            return response()->json(['message' => 'Leave Request deleted successfully.'], 200);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'Unauthorized', 'message' => $exception->getMessage()], 401);
        }

    }

    protected function ensureLeaveRequestBelongsToCompany($leaveRequest, $company)
    {
        $employee = Employee::find($leaveRequest->employee_id);

        if ($company->id !== $employee->company_id) {
            abort(401, 'The leave request does not belong to this company.');
        }
    }

    protected function ensureLeaveRequestBelongsToEmployee($leaveRequestEmployeeId)
    {
        $employee = Auth::guard('employee')->user();

        if ($employee->id !== $leaveRequestEmployeeId) {
            abort(401, 'This leave request does not belong to you');
        }
    }
}
