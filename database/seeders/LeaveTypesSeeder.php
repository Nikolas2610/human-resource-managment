<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $leaveTypes = [
            'Annual Leave',
            'Sick Leave',
            'Maternity Leave',
            'Paternity Leave',
            'Public Holidays',
        ];

        $faker = \Faker\Factory::create();

        $companies = DB::table('companies')->pluck('id');

        foreach ($companies as $companyId) {
            foreach ($leaveTypes as $leaveType) {
                // Generating the leave amount, it can be null or a number between 20 to 30.
                $leaveAmount = $faker->optional(0.7)->numberBetween(20, 30); // 70% chance of getting a number

                DB::table('leave_types')->insert([
                    'type' => $leaveType,
                    'company_id' => $companyId,
                    'leave_amount' => $leaveAmount,
                    'visible_to_employees' => $faker->boolean(),
                    'limit' => $leaveAmount ? true : false,  // if leave amount is null, the limit will be false.
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
