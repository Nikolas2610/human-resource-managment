<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LeaveAmount;
use App\Models\Company;

class LeaveAmountSeeder extends Seeder
{
    public function run()
    {
        $faker = \Faker\Factory::create();

        // Get all company IDs
        $companyIds = Company::all()->pluck('id')->toArray();

        for($i = 0; $i < 50; $i++) {
            LeaveAmount::create([
                'title' => $faker->jobTitle,
                'leave_amount' => $faker->numberBetween(20,30),
                // Get a random company ID
                'company_id' => $faker->randomElement($companyIds),
            ]);
        }
    }
}
