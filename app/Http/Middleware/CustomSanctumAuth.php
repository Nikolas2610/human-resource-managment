<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\UnauthorizedException;

class CustomSanctumAuth
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Attempt to authenticate the user using Sanctum
            // $user = Auth::user();
            $user = Auth::guard('employee')->user();
            
            if (!$user) {
                throw new AuthenticationException('Token is missing or invalid.', []);
            }
            
            // Continue with the authenticated user
            return $next($request);
        } catch (AuthenticationException $exception) {
            // Handle authentication exceptions and return custom error messages
            if ($exception->getMessage() === 'Token is missing or invalid.') {
                return response()->json(['error' => 'Unauthorized', 'message' => 'Token is missing or invalid.'], 401);
            } elseif ($exception->getMessage() === 'Token has expired.') {
                return response()->json(['error' => 'Unauthorized', 'message' => 'Token has expired.'], 401);
            }
            
            // Throw the exception if it's not handled
            throw $exception;
        }
    }
}
