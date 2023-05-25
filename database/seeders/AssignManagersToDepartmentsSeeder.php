<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use App\Models\Department;

class AssignManagersToDepartmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $departments = Department::all();

        foreach ($departments as $department) {
            $company = $department->company;
            $managers = $company->employees()->where('position_id', $department->position_id)->get();

            if ($managers->count() > 0) {
                $manager = $managers->random();
                $department->manager_id = $manager->id;
                $department->save();
            }
        }
    }
}
