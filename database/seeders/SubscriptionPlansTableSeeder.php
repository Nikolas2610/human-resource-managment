<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionPlansTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('subscription_plans')->insert([
            // Monthly Plans
            [
                'name' => 'Free',
                'price' => 0,
                'duration' => 'monthly',
                'features' => '0-10 users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Basic',
                'price' => 29.99,
                'duration' => 'monthly',
                'features' => '11-25 users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pro',
                'price' => 59.99,
                'duration' => 'monthly',
                'features' => '26-50 users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Enterprise',
                'price' => 99.99,
                'duration' => 'monthly',
                'features' => '50+ users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Yearly Plans
            [
                'name' => 'Basic Yearly',
                'price' => 299.99,  // Yearly price could offer some discount
                'duration' => 'yearly',
                'features' => '11-25 users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pro Yearly',
                'price' => 599.99,
                'duration' => 'yearly',
                'features' => '26-50 users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Enterprise Yearly',
                'price' => 999.99,
                'duration' => 'yearly',
                'features' => '50+ users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
