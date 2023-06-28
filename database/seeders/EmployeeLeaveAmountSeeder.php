<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\LeaveAmount;

class EmployeeLeaveAmountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Fetch all employees and leave amounts
        $employees = Employee::all();
        $leaveAmounts = LeaveAmount::all();

        // For each employee, attach a random leave amount
        foreach ($employees as $employee) {
            // Get a random leave amount id
            $randomLeaveAmountId = $leaveAmounts->random()->id;

            // Attach the leave amount to the employee
            $employee->leaveAmounts()->attach($randomLeaveAmountId);
        }
    }
}
