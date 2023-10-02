<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class CompaniesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) {
            $randomSubscriptionPlan = SubscriptionPlan::inRandomOrder()->first();

            DB::table('companies')->insert([
                'name' => $faker->company,
                'require_manager_approval' => $faker->boolean(),
                'require_hr_approval' => $faker->boolean(),

                // New fields
                'celebrate_birthdays' => $faker->boolean(),
                'celebrate_name_days' => $faker->boolean(),
                'celebrate_anniversaries' => $faker->boolean(),
                'email_company' => $faker->companyEmail,
                'logo' => $faker->imageUrl(200, 200, 'business'),
                'primary_color' => $faker->hexColor,
                'secondary_color' => $faker->hexColor,

                // Contact Information Fields
                'address' => $faker->address,
                'phone_number' => $faker->phoneNumber,
                'contact_email' => $faker->email,
                'website' => $faker->url,
                'facebook' => $faker->userName,
                'instagram' => $faker->userName,
                'twitter' => $faker->userName,
                'linkedin' => $faker->userName,
                'youtube' => $faker->userName,

                // Admin & HR mails
                'administrator_mail' => $faker->email,
                'hr_mail' => $faker->email,

                // Subscription Information Fields
                // 'subscription_plan_id' => optional($randomSubscriptionPlan)->id,
                // 'subscription_status' => $faker->randomElement(['active', 'expired', 'canceled', 'pending', 'trial']),
                // 'subscription_expiry_date' => $faker->dateTimeBetween('+1 month', '+1 year')->format('Y-m-d'),
                // 'trial_started_at' => $faker->dateTimeThisMonth()->format('Y-m-d H:i:s'),
                // 'trial_ends_at' => $faker->dateTimeBetween('+1 week', '+2 weeks')->format('Y-m-d H:i:s'),

                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
