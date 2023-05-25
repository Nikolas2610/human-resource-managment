<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\EmployeeAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/employee/register', [EmployeeAuthController::class, 'register']);
Route::post('/employee/login', [EmployeeAuthController::class, 'login']);
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Company
    // TODO: Must move for the admin
    Route::prefix('companies')->group(function () {
        Route::get('/', [CompanyController::class, 'index'])->name('companies.index');
        Route::post('/', [CompanyController::class, 'store'])->name('companies.store');
        Route::get('/{company}', [CompanyController::class, 'show'])->name('companies.show');
        Route::put('/{company}', [CompanyController::class, 'update'])->name('companies.update');
        Route::delete('/{company}', [CompanyController::class, 'destroy'])->name('companies.destroy');
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

Route::middleware('company')->group(function () {
    // Departments
    Route::get('/companies/{company}/departments', [DepartmentsController::class, 'index']);
    Route::post('/companies/{company}/departments', [DepartmentsController::class, 'store']);
    Route::get('/companies/{company}/departments/{department}', [DepartmentsController::class, 'show']);
    Route::put('/companies/{company}/departments/{department}', [DepartmentsController::class, 'update']);
    Route::delete('/companies/{company}/departments/{department}', [DepartmentsController::class, 'destroy']);
});
