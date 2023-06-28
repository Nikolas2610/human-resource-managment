<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\EmployeeAuthController;
use App\Http\Controllers\LeaveAmountController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\PositionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// TODO: Delete the register user - Only for test
Route::post('/register', [AuthController::class, 'register']);

// TODO: Must be employee admin and with token
Route::post('/employee/register', [EmployeeAuthController::class, 'register']);

// TODO: Add private-app-key middleware
// Public Routes
Route::post('/employee/login', [EmployeeAuthController::class, 'login']);
Route::post('/companies', [CompanyController::class, 'store'])->name('companies.store');
// TODO: Add another header for protection
Route::post('/login', [AuthController::class, 'login']);

// Admin Routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Company
    // TODO: Must move for the admin
    Route::prefix('companies')->group(function () {
        Route::get('/', [CompanyController::class, 'index'])->name('companies.index');
        Route::get('/{company}', [CompanyController::class, 'show'])->name('companies.show');
        Route::put('/{company}', [CompanyController::class, 'update'])->name('companies.update');
        Route::delete('/{company}', [CompanyController::class, 'destroy'])->name('companies.destroy');
    });
});

// TODO: Separate employee-admin with employee routes
// Employee Routes
Route::middleware(['custom.sanctum.auth', 'company'])->group(function () {
    Route::prefix('companies/{company}')->group(function () {
        // Departments
        Route::prefix('departments')->group(function () {
            Route::get('/', [DepartmentsController::class, 'index']);
            Route::post('/', [DepartmentsController::class, 'store']);
            Route::get('/{department}', [DepartmentsController::class, 'show']);
            Route::put('/{department}', [DepartmentsController::class, 'update']);
            Route::delete('/{department}', [DepartmentsController::class, 'destroy']);
        });

        // Positions
        Route::prefix('positions')->group(function () {
            Route::get('/', [PositionController::class, 'index']);
            Route::post('/', [PositionController::class, 'store']);
            Route::get('/{position}', [PositionController::class, 'show']);
            Route::put('/{position}', [PositionController::class, 'update']);
            Route::delete('/{position}', [PositionController::class, 'destroy']);
        });

        // Leave Amounts
        Route::prefix('leave-amounts')->group(function () {
            Route::get('/', [LeaveAmountController::class, 'index']);
            Route::post('/', [LeaveAmountController::class, 'store']);
            Route::get('/{leaveAmount}', [LeaveAmountController::class, 'show']);
            Route::put('/{leaveAmount}', [LeaveAmountController::class, 'update']);
            Route::delete('/{leaveAmount}', [LeaveAmountController::class, 'destroy']);
        });

        // Leave Types
        Route::prefix('leave-types')->group(function () {
            Route::get('/', [LeaveTypeController::class, 'index']);
            Route::post('/', [LeaveTypeController::class, 'store']);
            Route::get('/{leaveType}', [LeaveTypeController::class, 'show']);
            Route::put('/{leaveType}', [LeaveTypeController::class, 'update']);
            Route::delete('/{leaveType}', [LeaveTypeController::class, 'destroy']);
        });

        // Leave Requests
        Route::prefix('leave-requests')->group(function () {
            Route::get('/', [LeaveRequestController::class, 'index']);
            Route::post('/', [LeaveRequestController::class, 'store']);
            Route::get('/{leaveRequest}', [LeaveRequestController::class, 'show']);
            Route::put('/{leaveRequest}', [LeaveRequestController::class, 'update']);
            Route::delete('/{leaveRequest}', [LeaveRequestController::class, 'destroy']);
        });
    });
});


// Testing
Route::get('/test', function (Request $request) {
    $user = Auth::guard('employee')->user();
    return response()->json([
        'employee' => $user
    ]);;
})->middleware(['auth:sanctum']);

Route::middleware('auth:sanctum')->get('/test2', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
