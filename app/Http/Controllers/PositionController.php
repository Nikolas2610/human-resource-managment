<?php

namespace App\Http\Controllers;

use App\Http\Requests\Position\StorePositionRequest;
use App\Http\Requests\Position\UpdatePositionRequest;
use App\Models\Company;
use App\Models\Position;
use App\Http\Resources\Position\PositionResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class PositionController extends Controller
{
    public function index(Company $company)
    {
        try {
            $employee = $this->getAuthenticatedEmployee();

            $this->authorizeForCompany($employee, $company);

            $positions = $company->positions;

            return PositionResource::collection($positions);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Unauthorized', 'message' => $th->getMessage()], 401);
        }
    }

    public function store(StorePositionRequest $request, Company $company)
    {
        try {
            $employee = $this->getAuthenticatedEmployee();

            $this->authorizeForCompany($employee, $company);

            $validatedData = $request->validated();
            $validatedData['company_id'] = $company->id;

            $position = $company->positions()->create($validatedData);

            return new PositionResource($position);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Unauthorized', 'message' => $th->getMessage()], 401);
        }
    }

    public function show(Company $company, Position $position)
    {
        try {
            $employee = $this->getAuthenticatedEmployee();

            $this->authorizeForCompany($employee, $company);
            $this->ensurePositionBelongsToCompany($company, $position);

            return new PositionResource($position);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Unauthorized', 'message' => $th->getMessage()], 401);
        }
    }

    public function update(UpdatePositionRequest $request, Company $company, Position $position)
    {
        try {
            $employee = $this->getAuthenticatedEmployee();
            $this->authorizeForCompany($employee, $company);
            $this->ensurePositionBelongsToCompany($company, $position);

            $validatedData = $request->validated();

            $position->update($validatedData);

            return new PositionResource($position);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Unauthorized', 'message' => $th->getMessage()], 401);
        }
    }

    public function destroy(Company $company, Position $position)
    {
        try {
            $employee = $this->getAuthenticatedEmployee();

            $this->authorizeForCompany($employee, $company);
            $this->ensurePositionBelongsToCompany($company, $position);

            $position->delete();

            return response()->json(['message' => 'Position deleted successfully.'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Unauthorized', 'message' => $th->getMessage()], 401);
        }
    }

    protected function getAuthenticatedEmployee()
    {
        return Auth::guard('employee')->user();
    }

    protected function authorizeForCompany($employee, $company)
    {
        if ($employee->company_id !== $company->id) {
            $this->unauthorizedResponse('You are not authorized to access positions for this company.');
        }
    }

    protected function ensurePositionBelongsToCompany($company, $position)
    {
        if ($position->company_id !== $company->id) {
            $this->forbiddenResponse('The position does not belong to this company.');
        }
    }

    protected function unauthorizedResponse($message): JsonResponse
    {
        abort(403, $message);
    }

    protected function forbiddenResponse($message): JsonResponse
    {
        abort(403, $message);
    }

    protected function handleException(\Throwable $exception): JsonResponse
    {
        return response()->json(['error' => 'Internal Server Error', 'message' => $exception->getMessage()], 500);
    }
}
