<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class LeaveRequestsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        $employees = DB::table('employees')->pluck('id');
        $leaveTypes = DB::table('leave_types')->pluck('id');

        foreach ($employees as $employeeId) {
            $leaveRequestCount = $faker->numberBetween(1, 5);

            for ($i = 0; $i < $leaveRequestCount; $i++) {
                $startDate = $faker->dateTimeBetween('-1 month', '+1 month');
                $endDate = $faker->dateTimeBetween($startDate, '+1 month');

                DB::table('leave_requests')->insert([
                    'employee_id' => $employeeId,
                    'leave_type_id' => $faker->randomElement($leaveTypes),
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'reason' => $faker->paragraph,
                    'status' => $faker->randomElement(['pending', 'approved', 'rejected']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
