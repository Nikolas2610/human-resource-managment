<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Employee;

class DepartmentManagerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Fetch all departments
        $departments = Department::all();

        // For each department, assign a random employee as a manager
        foreach ($departments as $department) {
            // Get all employees from the same company as the department
            $employees = Employee::where('company_id', $department->company_id)->get();

            if ($employees->isNotEmpty()) {
                // Find the employee with the "employee" role
                $employee = $employees->firstWhere('role', Employee::ROLE_EMPLOYEE);

                if ($employee) {
                    // Change the employee's role to "manager"
                    $employee->role = Employee::ROLE_MANAGER;
                    $employee->save();

                    // Assign the employee as the manager of the department
                    $department->manager_id = $employee->id;
                    $department->save();
                }
            }
        }
    }
}
