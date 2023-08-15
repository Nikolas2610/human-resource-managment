<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use App\Models\Employee;

class EmployeesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        $companies = DB::table('companies')->pluck('id');
        $departments = DB::table('departments')->get();
        $positions = DB::table('positions')->pluck('id');

        $roles = [
            Employee::ROLE_HR,
            Employee::ROLE_ACCOUNTING,
            Employee::ROLE_ADMIN,
            Employee::ROLE_OWNER,
            Employee::ROLE_MANAGER,
        ];

        $employees = []; // store employee ids by their roles

        foreach ($companies as $companyId) {
            // Add one employee for each role
            foreach ($roles as $role) {
                $employeeId = $this->createEmployee($faker, $companyId, $departments, $positions, $role);
                $employees[$companyId][$role][] = $employeeId;
            }

            // Add the remaining employees with the default role
            for ($i = 0; $i < 26; $i++) {
                $employeeId = $this->createEmployee($faker, $companyId, $departments, $positions, Employee::ROLE_EMPLOYEE);
                $employees[$companyId][Employee::ROLE_EMPLOYEE][] = $employeeId;
            }
        }

        // Set reporting structure
        foreach ($employees as $companyId => $employeesByRole) {
            foreach ($employeesByRole[Employee::ROLE_EMPLOYEE] as $employeeId) {
                $managerId = $faker->randomElement($employeesByRole[Employee::ROLE_MANAGER]);
                DB::table('employees')->where('id', $employeeId)->update(['reports_to' => $managerId]);
            }

            foreach ($employeesByRole[Employee::ROLE_MANAGER] as $managerId) {
                $hrId = $faker->randomElement($employeesByRole[Employee::ROLE_HR]);
                DB::table('employees')->where('id', $managerId)->update(['reports_to' => $hrId]);
            }

            foreach ($employeesByRole[Employee::ROLE_HR] as $hrId) {
                $ownerId = $faker->randomElement($employeesByRole[Employee::ROLE_OWNER]);
                DB::table('employees')->where('id', $hrId)->update(['reports_to' => $ownerId]);
            }
        }
    }

    private function createEmployee($faker, $companyId, $departments, $positions, $role)
    {
        $firstName = $faker->firstName;
        $lastName = $faker->lastName;

        // Generate a unique email
        $email = $this->generateUniqueEmail($firstName, $lastName);
        
        // Get a random department id for the company
        $departmentId = $faker->randomElement($departments->where('company_id', $companyId)->pluck('id')->toArray());

        $employeeId = DB::table('employees')->insertGetId([
            'company_id' => $companyId,
            'department_id' => $departmentId,
            'position_id' => $faker->randomElement($positions),
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'email_verified_at' => now(),
            'password' => Hash::make('Password-0'),
            'phone' => $faker->phoneNumber,
            'address' => $faker->address,
            'image' => null,
            'work_start_date' => $faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'work_end_date' => $faker->dateTimeBetween('now', '+5 years')->format('Y-m-d'),
            'salary' => $faker->randomFloat(2, 1000, 10000),
            'role' => $role,
            'remember_token' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $employeeId;
    }

    private function generateUniqueEmail($firstName, $lastName)
    {
        $baseEmail = strtolower($firstName . '.' . $lastName . '@example.com');
        $email = $baseEmail;
        $counter = 1;

        // While the email exists in the database, append a number to the email
        while (DB::table('employees')->where('email', $email)->exists()) {
            $email = strtolower($firstName . '.' . $lastName . $counter . '@example.com');
            $counter++;
        }

        return $email;
    }
}
