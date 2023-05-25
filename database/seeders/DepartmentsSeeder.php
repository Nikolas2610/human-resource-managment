<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class DepartmentsSeeder extends Seeder
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
    
        $departments = [
            'Back Office',
            'Development',
            'Marketing',
            'Human Resource',
            'Support',
            'Finance',
            'IT',
            'Sales',
        ];
    
        foreach ($companies as $companyId) {
            foreach ($departments as $department) {
                DB::table('departments')->insert([
                    'company_id' => $companyId,
                    'name' => $department,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
