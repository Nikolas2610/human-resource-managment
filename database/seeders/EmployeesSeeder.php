<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

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
        $departments = DB::table('departments')->pluck('id');
        $positions = DB::table('positions')->pluck('id');
    
        foreach ($companies as $companyId) {
            for ($i = 0; $i < 30; $i++) {
                $firstName = $faker->firstName;
                $lastName = $faker->lastName;
                $email = strtolower($firstName . '.' . $lastName . '@example.com');
    
                DB::table('employees')->insert([
                    'company_id' => $companyId,
                    'department_id' => $faker->randomElement($departments),
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
                    'remember_token' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
    
}
