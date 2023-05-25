<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call([
            UsersSeeder::class,
            CompaniesSeeder::class,
            DepartmentsSeeder::class,
            PositionsSeeder::class,
            EmployeesSeeder::class,
            LeaveTypesSeeder::class,
            LeaveRequestsSeeder::class,
            JobPostingsSeeder::class,
            AssignManagersToDepartmentsSeeder::class,
        ]);
    }
}
