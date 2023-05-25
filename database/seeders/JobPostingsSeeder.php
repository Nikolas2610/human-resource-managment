<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class JobPostingsSeeder extends Seeder
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
            for ($i = 0; $i < 10; $i++) {
                $postedDate = $faker->dateTimeBetween('-1 month', 'now');
                $closingDate = $faker->optional(0.5)->dateTimeBetween($postedDate, '+1 month');

                DB::table('job_postings')->insert([
                    'company_id' => $companyId,
                    'department_id' => $faker->randomElement($departments),
                    'position_id' => $faker->randomElement($positions),
                    'title' => $faker->jobTitle,
                    'description' => $faker->paragraph,
                    'requirements' => $faker->paragraph,
                    'responsibilities' => $faker->paragraph,
                    'salary_range' => $faker->optional(0.3)->randomFloat(2, 2000, 5000),
                    'employment_type' => $faker->randomElement(['full-time', 'part-time', 'contract']),
                    'location' => $faker->city,
                    'status' => $faker->randomElement(['open', 'closed']),
                    'posted_date' => $postedDate,
                    'closing_date' => $closingDate,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
