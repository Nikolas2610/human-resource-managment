<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employee\EmployeeRegisterRequest;
use App\Http\Requests\Employee\LoginEmployeeRequest;
use App\Http\Resources\Employee\EmployeeAuthResource;
use App\Http\Resources\Employee\LoginEmployeeResource;
use App\Mail\DefaultEmailTemplate;
use App\Models\CompanySubscriptions;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

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

            // Check if the user is active
            if (!$employee->active) {
                return response()->json([
                    'error' => 'account_inactive',
                    'message' => 'Your account is inactive. Please contact the administrator.'
                ], 403);
            }

            $subscription = CompanySubscriptions::where('company_id', $employee->company_id)
                ->whereIn('status', ['active', 'active_to_cancel', 'past_due'])
                ->first();

            if (!$subscription && $employee->role !== 'admin') {
                return response()->json([
                    'error' => 'company_inactive',
                    'message' => 'Your company subscription has expired. Please contact with the administrator.'
                ], 404);
            }

            $employee['subscription_access_level'] = $subscription->subscriptionPlan->access_level ?? "expired";

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

    public function logout(Request $request)
    {
        $user = Auth::guard('employee')->user();

        if ($user) {
            $user->tokens()->delete();
            return response()->json(['message' => 'Logged out successfully'], 200);
        }

        return response()->json(['error' => 'No authenticated user found'], 404);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $employee = Employee::where('email', $request->email)->first();

        if (!$employee) {
            return response()->json(['message' => 'We can\'t find a user with that email address.'], 404);
        }

        // Delete any existing tokens for this email
        DB::table('password_resets')->where('email', $request->email)->delete();

        // Generate a token for the user
        $token = Str::random(60);
        $hashedToken = Hash::make($token);

        // Insert token into the password_resets table
        DB::table('password_resets')->insert([
            'email' => $employee->email,
            'token' => $hashedToken,
            'created_at' => Carbon::now()
        ]);

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        Mail::to($employee->email)->send(new DefaultEmailTemplate("Password Reset", "Hello {$employee->first_name},<br><br>You are receiving this email because we received a password reset request for your account.<br><br>Click the button below to reset your password:<br><br><a href='$frontendUrl/auth/reset-password?token={$token}'>Reset Password</a><br><br>If you did not request a password reset, no further action is required.<br><br>Regards,<br>Your App Team"));

        return response()->json(['message' => 'Password reset email sent.'], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
            'token' => 'required|string'
        ]);

        // Get the latest reset token for the email
        $reset = DB::table('password_resets')
            ->where('email', $request->email)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$reset || !Hash::check($request->token, $reset->token)) {
            // Token invalid or not found
            return response()->json([
                'message' => 'Invalid token',
                'status' => 'fail'
            ], 400);
        }

        // Update the employee's password and delete the reset token
        $employee = Employee::where('email', $request->email)->first();
        $employee->password = Hash::make($request->password);
        $employee->save();

        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password reset successfully',
            'status' => 'success'
        ]);
    }

    public function getUser(Request $request)
    {
        $user = Auth::guard('employee')->user();

        if (!$user->active) {
            return response()->json([
                'error' => 'account_inactive',
                'message' => 'Your account is inactive. Please contact the administrator'
            ], 403);
        }

        $subscription = CompanySubscriptions::where('company_id', $user->company_id)
            ->whereIn('status', ['active', 'active_to_cancel', 'past_due'])
            ->first();

        if (!$subscription && $user->role !== 'admin') {
            return response()->json([
                'error' => 'company_inactive',
                'message' => 'Your company subscription has expired. Please contact with the administrator.'
            ], 404);
        }

        $user['subscription_access_level'] = $subscription->subscriptionPlan->access_level ?? "expired";

        return new LoginEmployeeResource($user);
    }
}
