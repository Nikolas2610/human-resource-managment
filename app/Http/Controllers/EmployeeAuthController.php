<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\EmployeeRegisterRequest;
use App\Http\Requests\Employee\LoginEmployeeRequest;
use App\Http\Resources\Employee\LoginEmployeeResource;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


class EmployeeAuthController extends Controller
{
    public function register(EmployeeRegisterRequest $request)
    {
        $request->validated();

        $employee = new Employee([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'work_start_date' => $request->work_start_date,
            'company_id' => $request->company_id,
            'department_id' => $request->department_id,
            'position_id' => $request->position_id,
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('public/user_images');
            $employee->image = $path;
        }

        $employee->save();

        return response()->json([
            'message' => 'Employee registered successfully',
        ]);
    }

    public function login(LoginEmployeeRequest $request)
    {
        try {
            $request->validated();

            $credentials = $request->only('email', 'password');

            // Fetch the employee by email
            $employee = Employee::where('email', $credentials['email'])->first();

            // Verify the password
            if (!$employee || !Hash::check($credentials['password'], $employee->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            // If credentials are correct, issue the token
            $token = $employee->createToken('token-name')->plainTextToken;

            return response()->json([
                'employee' => new LoginEmployeeResource($employee),
                'token' => $token,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => 'login_fail',
                'message' => $th->getMessage()
            ], 404);
        }
    }
}
