<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveRequest\StoreLeaveRequestRequest;
use App\Http\Requests\LeaveRequest\UpdateLeaveRequestRequest;
use App\Http\Requests\LeaveRequest\UpdateLeaveRequestStatus;
use App\Http\Requests\Request;
use App\Models\LeaveRequest;
use App\Http\Resources\LeaveRequest\LeaveRequestResource;
use App\Http\Resources\LeaveRequest\LeaveRequestCollection;
use App\Models\Company;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LeaveRequestController extends Controller
{
    public function index(Company $company)
    {
        $leaveRequests = $company->leaveRequests()->get();

        return new LeaveRequestCollection($leaveRequests);
    }

    public function getEmployeeLeaveRequests(Company $company)
    {
        // Get the authenticated employee ID from the JWT token
        $employee = Auth::guard('employee')->user();

        // Fetch the leave requests of the current authenticated employee
        $leaveRequests = $company->leaveRequests()
            ->where('employee_id', $employee->id)
            ->get();

        return new LeaveRequestCollection($leaveRequests);
    }

    public function getManagerEmployeeLeaveRequests(Company $company)
    {
        // Get the authenticated user ID from the JWT token
        $user = Auth::guard('employee')->user();

        // Initialize an empty array to hold the pending leave requests
        $pendingLeaveRequests = [];

        if ($user->role === 'manager') {
            // Fetch the departments where the current authenticated user is a manager
            $departments = $company->departments()
                ->where('manager_id', $user->id)
                ->get();

            // Loop through each department to get employees
            foreach ($departments as $department) {
                $employees = $department->employees; // Assuming employees is a relation in Department model

                // Loop through each employee to get their leave requests
                foreach ($employees as $employee) {
                    $leaveRequests = $employee->leaveRequests()
                        ->where('status', '!=', 'done')
                        ->orderBy('created_at', 'desc')
                        ->get();

                    // Add the pending leave requests to the array
                    foreach ($leaveRequests as $leaveRequest) {
                        $pendingLeaveRequests[] = $leaveRequest;
                    }
                }
            }
        } elseif ($user->role === 'hr') {
            // Fetch all employees in the company
            $employees = $company->employees; // Assuming employees is a relation in Company model

            // Loop through each employee to get their leave requests
            foreach ($employees as $employee) {
                $leaveRequests = $employee->leaveRequests()
                    ->where('status', '!=', 'done')
                    ->orderBy('created_at', 'desc')
                    ->get();

                // Add the pending leave requests to the array
                foreach ($leaveRequests as $leaveRequest) {
                    $pendingLeaveRequests[] = $leaveRequest;
                }
            }
        }

        return new LeaveRequestCollection($pendingLeaveRequests);
    }

    public function getEmployeeLeaveRequestsOnLeave(Company $company)
    {
        // Get the authenticated employee ID from the JWT token
        $employee = Auth::guard('employee')->user();

        // Get the current date
        $today = Carbon::today()->toDateString();

        // Fetch the leave requests of the current authenticated employee where they are currently on leave
        $leaveRequests = $company->leaveRequests()
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->where('status', "approved")
            ->get();

        return new LeaveRequestCollection($leaveRequests);
    }

    public function store(StoreLeaveRequestRequest $request, Company $company)
    {
        try {
            $validatedData = $request->validated();

            $employee = Auth::guard('employee')->user();

            $this->ensureLeaveRequestBelongsToEmployee($employee->id);

            $validatedData['employee_id'] = $employee->id;

            // When no manager to a department
            if ($employee->department->manager_id === null || $employee->department->manager_id === $employee->id || $company->require_manager_approval === false) {
                $validatedData['manager_approved'] = "approved";
            }

            // When HR request a leave
            if ($employee->role === "hr" || !$company->require_hr_approval) {
                $validatedData['hr_approved'] = "approved";
            }

            if (($validatedData['manager_approved'] ?? null) === "approved" && ($validatedData['hr_approved'] ?? null) === "approved") {
                $validatedData['status'] = "approved";
            }

            $leaveRequest = LeaveRequest::create($validatedData);

            if ($leaveRequest['status'] === "approved") {
                $this->updateAmountLeaves($leaveRequest, $leaveRequest->days_requested);
            }

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

            // Maybe not needed
            $this->ensureLeaveRequestBelongsToCompany($leaveRequest, $company);

            $employee = Auth::guard('employee')->user();

            $this->ensureLeaveRequestBelongsToEmployee($employee->id);
            $validatedData['employee_id'] = $employee->id;

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

    public function updateLeaveRequestStatus(Company $company, LeaveRequest $leaveRequest, UpdateLeaveRequestStatus $request)
    {
        $validatedData = $request->validated();
        try {
            // Ensure the leave request belongs to the company
            $this->ensureLeaveRequestBelongsToCompany($leaveRequest, $company);

            $currentUser = Auth::guard('employee')->user();

            // Check if the approver has the right to approve
            if (!$this->canApproveLeaveRequests($currentUser, $leaveRequest)) {
                return response()->json(['error' => 'Unauthorized', 'message' => 'You do not have permission to approve or decline leave requests'], 401);
            }

            if ($currentUser->role === 'hr') {
                $leaveRequest->hr_approved =  $validatedData['status'];
            } elseif ($currentUser->role === 'manager') {
                $leaveRequest->manager_approved = $validatedData['status'];
            }

            $leaveRequest->save();

            $originalStatus = $leaveRequest->status; // Store the current status before updating

            // Checking if both are approved, or either one is approved based on the company's requirements
            if (
                ($leaveRequest->hr_approved === "approved" && $leaveRequest->manager_approved === "approved") ||
                ($company->require_hr_approval === false && $leaveRequest->manager_approved === "approved") ||
                ($company->require_manager_approval === false && $leaveRequest->hr_approved === "approved")
            ) {
                $leaveRequest->status = 'approved';
            } elseif (
                ($leaveRequest->hr_approved === "rejected" ||  $leaveRequest->manager_approved === "rejected")
            ) {
                $leaveRequest->status = 'rejected';
            } elseif (
                ($leaveRequest->hr_approved === "approved" && $leaveRequest->manager_approved === "pending") ||
                ($leaveRequest->manager_approved === "approved" && $leaveRequest->hr_approved === "pending")
            ) {
                $leaveRequest->status = 'pending';
            }

            $leaveRequest->save();

            // Assume you have a 'days_requested' field in your LeaveRequest model
            $daysRequested = $leaveRequest->days_requested;

            // Update amount leaves
            $this->updateAmountLeaves($leaveRequest, $daysRequested, $originalStatus);

            return new LeaveRequestResource($leaveRequest);
        } catch (\Throwable $exception) {
            return response()->json(['error' => 'An error occurred', 'message' => $exception->getMessage()], 400);
        }
    }

    private function updateAmountLeaves($leaveRequest, $daysRequested, $originalStatus = "pending")
    {
        // Get the current year
        $currentYear = Carbon::now()->year;

        // Retrieve the relevant record from the employee_leave_type table
        $leaveTypeRecord = DB::table('employee_leave_type')
            ->where('employee_id', $leaveRequest->employee_id)
            ->where('leave_type_id', $leaveRequest->leave_type_id)
            ->where('year', $currentYear)
            ->first();

        if ($leaveTypeRecord) {
            // Determine the new values for 'used_leaves' and 'remaining_leaves' based on the leave request status
            if ($leaveRequest->status == 'approved') {
                $newUsedLeaves = $leaveTypeRecord->used_leaves + $daysRequested;
                $newRemainingLeaves = $leaveTypeRecord->remaining_leaves - $daysRequested;
            } elseif ($leaveRequest->status == 'rejected' && $originalStatus == 'approved') {
                $newUsedLeaves = $leaveTypeRecord->used_leaves - $daysRequested;
                $newRemainingLeaves = $leaveTypeRecord->remaining_leaves + $daysRequested;
            } else {
                // If the status is neither 'approved' nor transitioning from 'approved' to 'rejected', do nothing
                return new LeaveRequestResource($leaveRequest);
            }

            // Update the record in the employee_leave_type table
            DB::table('employee_leave_type')
                ->where('employee_id', $leaveRequest->employee_id)
                ->where('leave_type_id', $leaveRequest->leave_type_id)
                ->where('year', $currentYear)
                ->update([
                    'used_leaves' => $newUsedLeaves,
                    'remaining_leaves' => $newRemainingLeaves,
                ]);
        }
    }

    private function canApproveLeaveRequests($currentUser, $leaveRequest)
    {
        $employee = Employee::find($leaveRequest->employee_id);

        // Check if the user has role HR
        if ($currentUser->role === 'hr') {
            return true;
        }

        // Check if the user is a manager and if they manage the employee who made the leave request
        if ($currentUser->role === 'manager') {
            $department = $employee->department;  // Assuming you have a relation set up in your Employee model
            if ($department->manager_id == $currentUser->id) {
                return true;
            }
        }

        return false;
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
