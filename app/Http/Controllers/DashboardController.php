<?php

namespace App\Http\Controllers;

use App\Http\Resources\Employee\EmployeeAnniversaryResource;
use App\Http\Resources\LeaveRequest\LeaveRequestCollection;
use App\Models\Company;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;


class DashboardController extends Controller
{
    public function getEmployeeDashboardData(Company $company)
    {
        $data = [];

        // Add Company Settings
        $data['celebrate_anniversaries'] = (bool) $company->celebrate_anniversaries;
        $data['celebrate_birthdays'] = (bool) $company->celebrate_birthdays;
        $data['celebrate_name_days'] = (bool) $company->celebrate_name_days;

        // Get the employees with anniversaries.
        $data['anniversaries'] = $company->celebrate_anniversaries
            ? $this->employeesWithAnniversaries($company)
            : [];

        // Get the employee leave requests on leave.
        $data['leaveRequests'] = $this->getEmployeeLeaveRequestsOnLeave($company);

        // Get the employees with the next birthdays.
        $data['nextBirthdays'] = $company->celebrate_birthdays
            ? $this->getNextBirthdays($company)
            : [];

        // Get the employees with the next name days.
        $data['nextNameDays'] = $company->celebrate_name_days
            ? $this->getNextNameDays($company)
            : [];

        return response()->json($data);
    }

    public function employeesWithAnniversaries(Company $company)
    {
        $employees = $company->employees()->where('active', true)->get();
        $today = Carbon::today(); // Calculate today's date once

        // Filter out employees who haven't started yet
        $employees = $employees->filter(function ($employee) use ($today) {
            $workStartDate = Carbon::parse($employee->work_start_date);
            return $today->greaterThanOrEqualTo($workStartDate);
        });

        $employees->each(function ($employee) use ($today) {
            $workStartDate = Carbon::parse($employee->work_start_date);
            $yearsWorked = $today->diffInYears($workStartDate);

            $nextAnniversary = $workStartDate->copy()->year($today->year);

            if ($today->greaterThan($nextAnniversary)) {
                $nextAnniversary->addYear();
            }

            // Calculate the number of days until the next anniversary
            $daysUntilNextAnniversary = $today->diffInDays($nextAnniversary);

            $employee->next_anniversary = $nextAnniversary->toDateString();
            $employee->years_worked = $yearsWorked;
            $employee->days_until_next_anniversary = $daysUntilNextAnniversary;
        });

        // Sort by the number of days until the next anniversary, ascending order
        $sortedEmployees = $employees->sortBy('days_until_next_anniversary');

        return EmployeeAnniversaryResource::collection($sortedEmployees);
    }



    public function getEmployeeLeaveRequestsOnLeave(Company $company)
    {
        // Get the authenticated employee ID from the JWT token
        $employee = Auth::guard('employee')->user();

        // Get the current date
        if (env('APP_ENV') === 'local') {
            $today = Carbon::today('Europe/Athens')->toDateString();
        } else {
            $today = Carbon::today()->toDateString();
        }

        // Fetch the leave requests of the current authenticated employee where they are currently on leave
        $leaveRequests = $company->leaveRequests()
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->where('status', "approved")
            ->get();

        return new LeaveRequestCollection($leaveRequests);
    }

    protected function getNextBirthdays(Company $company)
    {
        $today = Carbon::today();
        $employees = $company->employees()
            ->where('active', true)
            ->whereNotNull('birthday')
            ->whereNotNull('work_start_date')
            ->get();

        $result = new Collection();

        $employees->each(function ($employee) use ($today, $result) {
            $workStartDate = Carbon::parse($employee->work_start_date);

            if ($today->greaterThanOrEqualTo($workStartDate)) {
                $nextBirthday = Carbon::parse($employee->birthday)->year($today->year);

                if ($today->greaterThan($nextBirthday)) {
                    $nextBirthday->addYear();
                }

                $daysUntil = $today->diffInDays($nextBirthday, false);

                if ($daysUntil >= 0 && $daysUntil <= 365) {
                    $result->push((object)[
                        'employee_name' => $employee->first_name . ' ' . $employee->last_name,
                        'employee_id' => $employee->id,
                        'employee_image' => $employee->image ? asset('storage/' . $employee->image) : null,
                        'next_birthday' => $nextBirthday->toDateString(),
                        'days_until' => $daysUntil
                    ]);
                }
            }
        });

        return $result->sortBy('days_until')->values()->all();
    }



    protected function getNextNameDays(Company $company)
    {
        $today = Carbon::today();
        $employees = $company->employees()
            ->where('active', true)
            ->whereNotNull('name_day')
            ->whereNotNull('work_start_date')
            ->get();

        $result = new Collection();

        $employees->each(function ($employee) use ($today, $result) {
            $workStartDate = Carbon::parse($employee->work_start_date);

            if ($today->greaterThanOrEqualTo($workStartDate)) {
                $nextNameDay = Carbon::parse($employee->name_day)->year($today->year);

                if ($today->greaterThan($nextNameDay)) {
                    $nextNameDay->addYear();
                }

                $daysUntil = $today->diffInDays($nextNameDay, false);

                if ($daysUntil >= 0) {
                    $result->push((object)[
                        'employee_name' => $employee->first_name . ' ' . $employee->last_name,
                        'employee_id' => $employee->id,
                        'employee_image' => $employee->image ? asset('storage/' . $employee->image) : null,
                        'next_name_day' => $nextNameDay->toDateString(),
                        'days_until' => $daysUntil
                    ]);
                }
            }
        });

        return $result->sortBy('days_until')->values()->all();
    }
}
