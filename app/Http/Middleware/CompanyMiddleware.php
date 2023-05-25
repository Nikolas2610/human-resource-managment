<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $company = $request->route('company'); // fetch company model from route parameters
        $companyId = $company->id; // get id from the company model

        $employee = Auth::guard('employee')->user(); // fetch authenticated employee

        // If the employee is not authenticated, return a 401 Unauthorized response
        if ($employee === null) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // If company id of employee does not match the requested company id, return unauthorized error
        if ($employee->company_id != $companyId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
