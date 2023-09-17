<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\EmployeeUpdateRequest;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Resources\Document\DocumentResource;
use App\Http\Resources\Employee\EmployeeAnniversaryResource;
use App\Http\Resources\Employee\EmployeeResource;
use App\Mail\DefaultEmailTemplate;
use Illuminate\Support\Facades\Hash;
use App\Models\Company;
use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CompanyEmployeeController extends Controller
{
    public function index(Company $company)
    {
        $employees = $company->employees()->with('reportsTo', 'leaveTypes')->get();
        return EmployeeResource::collection($employees);
    }

    public function employeesWithAnniversaries(Company $company)
    {
        $employees = $company->employees()->get();

        $employees->each(function ($employee) {
            $workStartDate = Carbon::parse($employee->work_start_date);
            $today = Carbon::today();
            $yearsWorked = $today->diffInYears($workStartDate);

            $nextAnniversary = $workStartDate->copy()->year($today->year);

            if ($today->greaterThan($nextAnniversary)) {
                $nextAnniversary->addYear();
            }

            $employee->next_anniversary = $nextAnniversary->toDateString();
            $employee->years_worked = $yearsWorked;
        });

        $sortedEmployees = $employees->sortBy('next_anniversary');

        return EmployeeAnniversaryResource::collection($sortedEmployees);
    }

    public function getEmployeeDocuments(Company $company, Employee $employee)
    {
        // Check if the employee belongs to the company
        if ($employee->company_id != $company->id) {
            return response()->json(['error' => 'Employee does not belong to this company'], 404);
        }

        $documents = $employee->documents()->get();

        return DocumentResource::collection($documents);
    }

    public function store(Company $company, StoreEmployeeRequest $request)
    {
        $requestData = $request->validated(); // This contains the validated request data

        // Handle Boolean Fields
        if (isset($requestData['active'])) {
            $requestData['active'] = $requestData['active'] === 'true' ? true : false;
        }
        if (isset($requestData['married'])) {
            $requestData['married'] = $requestData['married'] === 'true' ? true : false;
        }

        if (isset($requestData['leave_types'])) {
            $leaveTypes = json_decode($requestData['leave_types'], true);
            $rules = [
                'leave_types' => 'sometimes|array',
                'leave_types.*.id' => 'required|integer|exists:leave_types,id',
                'leave_types.*.allocated_leaves' => 'required|integer|min:0',
                'leave_types.*.used_leaves' => 'required|integer|min:0',
                'leave_types.*.unavailable_leaves' => 'required|integer|min:0',
                'leave_types.*.year' => 'required|integer|min:1900|max:2100',
            ];
            $requestData['leave_types'] = Validator::make($leaveTypes, $rules);
        }

        $employee = new Employee($requestData); // Initialize the Employee with validated data
        $employee->company_id = $company->id;  // Set the company_id here


        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('employee_images', 'public');
            $employee->image = $path;
        }

        $employee->save();

        $this->syncEmployeeLeaveTypes($employee, $request, $company); // I assumed this is a custom function you've defined elsewhere

        return response()->json([
            'message' => 'Employee registered successfully',
        ]);
    }

    public function show(Company $company, Employee $employee)
    {
        if ($employee->company_id != $company->id) {
            return response()->json(['error' => 'Employee does not belong to this company'], 404);
        }
        return new EmployeeResource($employee);
    }

    public function update(Company $company, Employee $employee, EmployeeUpdateRequest $request)
    {
        // Check if the employee belongs to the company
        if ($employee->company_id != $company->id) {
            return response()->json(['error' => 'Employee does not belong to this company'], 404);
        }

        // Validate data
        $dataToUpdate = $request->validated();

        // Handle Boolean Fields
        if (isset($dataToUpdate['active'])) {
            $dataToUpdate['active'] = $dataToUpdate['active'] === 'true' ? true : false;
        }
        if (isset($dataToUpdate['married'])) {
            $dataToUpdate['married'] = $dataToUpdate['married'] === 'true' ? true : false;
        }

        if (isset($dataToUpdate['leave_types'])) {
            $leaveTypes = json_decode($dataToUpdate['leave_types'], true);
            $rules = [
                'leave_types' => 'sometimes|array',
                'leave_types.*.id' => 'required|integer|exists:leave_types,id',
                'leave_types.*.allocated_leaves' => 'required|integer|min:0',
                'leave_types.*.used_leaves' => 'required|integer|min:0',
                'leave_types.*.unavailable_leaves' => 'required|integer|min:0',
                'leave_types.*.year' => 'required|integer|min:1900|max:2100',
            ];
            $dataToUpdate['leave_types'] = Validator::make($leaveTypes, $rules);
        }

        // Delete the old image if a new one is provided
        if ($request->hasFile('image')) {
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }
            $path = $request->file('image')->store('employee_images', 'public');
            $dataToUpdate['image'] = $path;
        }

        $employee->update($dataToUpdate);

        $this->syncEmployeeLeaveTypes($employee, $request, $company); // Custom function

        return response()->json($employee);
    }


    // Delete an employee of a specific company
    public function destroy(Company $company, Employee $employee)
    {
        // Check if the employee belongs to the company
        if ($employee->company_id != $company->id) {
            return response()->json(['error' => 'Employee does not belong to this company'], 404);
        }

        // Manually delete related rows in employee_leave_type
        $employee->leaveTypes()->detach();

        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully.'], 200);
    }

    public function resetPassword(Company $company, Employee $employee)
    {
        // Check if the employee belongs to the company
        if ($employee->company_id != $company->id) {
            return response()->json(['error' => 'Employee does not belong to this company'], 404);
        }

        // Delete any existing tokens for this email
        DB::table('password_resets')->where('email', $employee->email)->delete();

        // Generate a token for the user
        $token = Str::random(60);
        $hashedToken = Hash::make($token);

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        Mail::to($employee->email)->send(new DefaultEmailTemplate("Password Reset", "Hello {$employee->first_name},<br><br>You are receiving this email because we received a password reset request for your account.<br><br>Click the button below to reset your password:<br><br><a href='$frontendUrl/auth/reset-password?token={$token}'>Reset Password</a><br><br>If you did not request a password reset, no further action is required.<br><br>Regards,<br>Your App Team"));
        // Insert token into the password_resets table
        DB::table('password_resets')->insert([
            'email' => $employee->email,
            'token' => $hashedToken,
            'created_at' => Carbon::now()
        ]);

        return response()->json([
            'message' => 'Employee reset password successfully'
        ]);
    }

    private function syncEmployeeLeaveTypes(Employee $employee, $request, Company $company)
    {
        if ($request->has('leave_types')) {
            // Decode JSON to array if it's a JSON string
            $leave_types = gettype($request->leave_types) === 'string' ? json_decode($request->leave_types, true) : $request->leave_types;

            if (is_array($leave_types)) { // Ensure it's an array before proceeding
                // Fetch the leave type IDs associated with the current company
                $validLeaveTypeIds = LeaveType::where('company_id', $company->id)->pluck('id')->toArray();

                foreach ($leave_types as $leaveType) {
                    if (in_array($leaveType['id'], $validLeaveTypeIds)) {
                        $conditions = [
                            'employee_id' => $employee->id,
                            'leave_type_id' => $leaveType['id'],
                            'year' => $leaveType['year']
                        ];

                        $values = [
                            'allocated_leaves' => $leaveType['allocated_leaves'],
                            'used_leaves' => $leaveType['used_leaves'],
                            'unavailable_leaves' => $leaveType['unavailable_leaves'],
                            'remaining_leaves' => $leaveType['allocated_leaves'] - ($leaveType['used_leaves'] + $leaveType['unavailable_leaves'])
                        ];

                        // Use updateOrInsert to either update the existing record or insert a new one
                        DB::table('employee_leave_type')->updateOrInsert($conditions, $values);
                    }
                }
            }
        }
    }
}
