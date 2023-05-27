<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\EmployeeAuthController;
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
        Route::get('/departments', [DepartmentsController::class, 'index']);
        Route::post('/departments', [DepartmentsController::class, 'store']);
        Route::get('/departments/{department}', [DepartmentsController::class, 'show']);
        Route::put('/departments/{department}', [DepartmentsController::class, 'update']);
        Route::delete('/departments/{department}', [DepartmentsController::class, 'destroy']);

        // Positions
        Route::get('/positions', [PositionController::class, 'index']);
        Route::post('/positions', [PositionController::class, 'store']);
        Route::get('/positions/{position}', [PositionController::class, 'show']);
        Route::put('/positions/{position}', [PositionController::class, 'update']);
        Route::delete('/positions/{position}', [PositionController::class, 'destroy']);

        // Leave Types
        Route::get('/leave-types', [LeaveTypeController::class, 'index']);
        Route::post('/leave-types', [LeaveTypeController::class, 'store']);
        Route::get('/leave-types/{leaveType}', [LeaveTypeController::class, 'show']);
        Route::put('/leave-types/{leaveType}', [LeaveTypeController::class, 'update']);
        Route::delete('/leave-types/{leaveType}', [LeaveTypeController::class, 'destroy']);
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
