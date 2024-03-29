<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\EmployeeAuthController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\CompanyEmployeeController;
use App\Http\Controllers\CompanySubscriptionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\PaymentTokenController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\StripeWebhookController;
use App\Mail\DefaultEmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

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
Route::post('/employee/forgot-password', [EmployeeAuthController::class, 'forgotPassword']);
Route::post('/employee/reset-password', [EmployeeAuthController::class, 'resetPassword']);

// Admin Routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Get Current Employee
    Route::get('/user', [EmployeeAuthController::class, 'getUser']);
    // Company
    // TODO: Must move for the admin
    Route::prefix('companies')->group(function () {
        Route::get('/', [CompanyController::class, 'index'])->name('companies.index');
        Route::put('/{company}', [CompanyController::class, 'update'])->name('companies.update');
        Route::get('/{company}/details', [CompanyController::class, 'getCompanyFullDetails']);
        Route::delete('/{company}', [CompanyController::class, 'destroy'])->name('companies.destroy');
    });
});

Route::middleware(['custom.sanctum.auth'])->group(function () {
    Route::post('employee/logout', [EmployeeAuthController::class, 'logout'])->name('logout');
});

// Test Stripe Payments

Route::post('/create-payment-session', function (Request $request) {
    $response = StripeController::createSubscriptionSession($request->plan_id, $request->company_id);
    return response()->json(['response' => $response]);
});

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook']);
Route::post('/stripe/cancel-subscription', [StripeController::class, 'cancelSubscription']);
Route::post('/stripe/upgrade-subscription', [StripeController::class, 'changeSubscription']);
Route::post('/stripe/update-subscription-payment', [StripeController::class, 'updateSubscriptionPayment']);
Route::post('/stripe/renew-subscription', [StripeController::class, 'renewSubscription']);


// TODO: Separate employee-admin with employee routes
// Employee Routes
Route::middleware(['custom.sanctum.auth', 'company'])->group(function () {
    Route::prefix('companies/{company}')->group(function () {
        // Get company settings
        Route::get('/', [CompanyController::class, 'show'])->name('companies.show');
        Route::post('/updateCustomization', [CompanyController::class, 'updateCustomization']);

        Route::get('/get-company-employees', [CompanyController::class, 'getActiveEmployeesGroupedByDepartment']);

        Route::get('/dashboard/employee', [DashboardController::class, 'getEmployeeDashboardData']);

        // Departments
        Route::prefix('departments')->group(function () {
            Route::get('/', [DepartmentsController::class, 'index']);
            Route::post('/', [DepartmentsController::class, 'store']);
            Route::get('/{department}', [DepartmentsController::class, 'show']);
            Route::get('/{department}/employees', [DepartmentsController::class, 'getEmployeesByDepartment']);
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

        // Leave Amounts - Not using
        // Route::prefix('leave-amounts')->group(function () {
        //     Route::get('/', [LeaveAmountController::class, 'index']);
        //     Route::post('/', [LeaveAmountController::class, 'store']);
        //     Route::get('/{leaveAmount}', [LeaveAmountController::class, 'show']);
        //     Route::put('/{leaveAmount}', [LeaveAmountController::class, 'update']);
        //     Route::delete('/{leaveAmount}', [LeaveAmountController::class, 'destroy']);
        // });

        // Leave Types
        Route::prefix('leave-types')->group(function () {
            Route::get('/', [LeaveTypeController::class, 'index']);
            Route::post('/', [LeaveTypeController::class, 'store']);
            // Employee Route
            Route::get('/employee', [LeaveTypeController::class, 'getEmployeeLeaveTypes']);
            Route::get('/{leaveType}', [LeaveTypeController::class, 'show']);
            Route::put('/{leaveType}', [LeaveTypeController::class, 'update']);
            Route::delete('/{leaveType}', [LeaveTypeController::class, 'destroy']);
        });

        // Leave Requests
        Route::prefix('leave-requests')->group(function () {
            Route::get('/', [LeaveRequestController::class, 'index']);
            Route::get('/employee', [LeaveRequestController::class, 'getEmployeeLeaveRequests']);
            // Only for manager role
            Route::get('/manager', [LeaveRequestController::class, 'getManagerEmployeeLeaveRequests']);
            // For Employees and all
            Route::get('/on-leave', [LeaveRequestController::class, 'getEmployeeLeaveRequestsOnLeave']);
            Route::post('/', [LeaveRequestController::class, 'store']);

            Route::get('/{leaveRequest}', [LeaveRequestController::class, 'show']);
            Route::put('/{leaveRequest}', [LeaveRequestController::class, 'update']);
            Route::delete('/{leaveRequest}', [LeaveRequestController::class, 'destroy']);
            // For HR and manager
            Route::put('/{leaveRequest}/status-update', [LeaveRequestController::class, 'updateLeaveRequestStatus']);
        });


        Route::prefix('employees')->group(function () {
            Route::get('/', [CompanyEmployeeController::class, 'index']);
            Route::get('/anniversaries', [CompanyEmployeeController::class, 'employeesWithAnniversaries']);
            Route::get('/{employee}', [CompanyEmployeeController::class, 'show']);
            Route::get('/{employee}/documents', [CompanyEmployeeController::class, 'getEmployeeDocuments']);
            Route::post('/', [CompanyEmployeeController::class, 'store']);
            Route::post('/{employee}', [CompanyEmployeeController::class, 'update']);
            Route::delete('/{employee}', [CompanyEmployeeController::class, 'destroy']);
            Route::post('/{employee}/reset-password', [CompanyEmployeeController::class, 'resetPassword']);
        });

        Route::prefix('documents')->group(function () {
            // Not needed
            // Route::get('/', [DocumentsController::class, 'index']);
            // Route::get('/{document}', [DocumentsController::class, 'show']);
            Route::post('/', [DocumentsController::class, 'store']);
            Route::post('/{document}', [DocumentsController::class, 'update']);
            Route::delete('/{document}', [DocumentsController::class, 'destroy']);
        });

        Route::prefix('subscriptions')->group(function () {
            Route::get('/', [CompanySubscriptionController::class, 'getCompanySubscription']);
            Route::get('/invoices', [CompanySubscriptionController::class, 'getCompanyInvoices']);
            Route::post('/renew-previous-subscription', [CompanySubscriptionController::class, 'renewPreviousSubscription']);
            Route::post('/cancel-subscription', [StripeController::class, 'cancelSubscription']);
            Route::post('/change-subscription', [StripeController::class, 'changeSubscription']);
            Route::post('/update-subscription-payment-method', [StripeController::class, 'generateUpdatePaymentLink']);
            // Renew subscription if the subscription is still active and not expired
            Route::post('/renew-subscription', [StripeController::class, 'renewSubscription']);
            Route::get('get-invoices', [StripeController::class, 'getInvoices']);
        });

        // Payments Tokens
        Route::post('/payment-token/success-payment', [PaymentTokenController::class, 'handleSuccess']);
        Route::post('/payment-token/fail-payment', [PaymentTokenController::class, 'handleFailure']);
        Route::post('/payment-token/success-update', [PaymentTokenController::class, 'handlePaymentUpdateStatusSuccess']);
        Route::post('/payment-token/fail-update', [PaymentTokenController::class, 'handleUpdatePaymentStatusFailure']);
    });
});

// Route::middleware('auth:sanctum')->get('/test2', function (Request $request) {
//     return $request->user();
// });

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('/test-mail', function () {
    Mail::to('npsillou@gmail.com')->send(new DefaultEmailTemplate("My first Email", "Hello Nikolas"));
});
