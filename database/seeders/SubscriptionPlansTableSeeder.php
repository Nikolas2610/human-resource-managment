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
                'features' => '1-10 users',
                'stripe_price_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => false,
                'access_level' => 'level_zero',
                'min_users' => 1,
                'max_users' => 10,
                'has_trial' => false,
            ],
            [
                'name' => 'Basic',
                'price' => 29.99,
                'duration' => 'monthly',
                'features' => '11-25 users',
                'stripe_price_id' => 'price_1NrkUGFnEm3BUnQw0obCNXUP',
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => true,
                'access_level' => 'level_one',
                'min_users' => 11,
                'max_users' => 25,
                'has_trial' => false,
            ],
            [
                'name' => 'Pro',
                'price' => 59.99,
                'duration' => 'monthly',
                'features' => '26-50 users',
                'stripe_price_id' => 'price_1NrkVHFnEm3BUnQw6rNNV1jp',
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => true,
                'access_level' => 'level_two',
                'min_users' => 26,
                'max_users' => 50,
                'has_trial' => false,
            ],
            [
                'name' => 'Enterprise',
                'price' => 99.99,
                'duration' => 'monthly',
                'features' => '51 - 200 users',
                'stripe_price_id' => 'price_1NrkW7FnEm3BUnQwbrBw8fZY',
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => true,
                'access_level' => 'level_three',
                'min_users' => 51,
                'max_users' => 200,
                'has_trial' => false,
            ],
            // Yearly Plans
            [
                'name' => 'Basic',
                'price' => 299.99,  // Yearly price could offer some discount
                'duration' => 'yearly',
                'features' => '11-25 users',
                'stripe_price_id' => 'price_1NrkUGFnEm3BUnQw2KzQ9BBK',
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => true,
                'access_level' => 'level_one',
                'min_users' => 11,
                'max_users' => 25,
                'has_trial' => false,
            ],
            [
                'name' => 'Pro Yearly',
                'price' => 599.99,
                'duration' => 'yearly',
                'features' => '26-50 users',
                'stripe_price_id' => 'price_1NrkVHFnEm3BUnQwYCOMb4EY',
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => true,
                'access_level' => 'level_two',
                'min_users' => 26,
                'max_users' => 50,
                'has_trial' => false,
            ],
            [
                'name' => 'Enterprise Yearly',
                'price' => 999.99,
                'duration' => 'yearly',
                'features' => '51 - 200 users',
                'stripe_price_id' => 'price_1NrkW7FnEm3BUnQwX95cNv5S',
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => true,
                'access_level' => 'level_three',
                'min_users' => 51,
                'max_users' => 200,
                'has_trial' => false,
            ],
        ]);
    }
}
