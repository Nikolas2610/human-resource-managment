<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // TODO: Add fields => celebrate birthdays (bool), celebrate name days (bool), celebrate anniversaries(bool), email_company, logo, contact information [Address, Phone Number, email, website], information: [Description, company start date], administrator_mail, hr_mail
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('require_manager_approval')->default(true);
            $table->boolean('require_hr_approval')->default(true);

            // new fields
            $table->boolean('celebrate_birthdays')->default(true);
            $table->boolean('celebrate_name_days')->default(true);
            $table->boolean('celebrate_anniversaries')->default(true);
            $table->string('logo')->nullable();
            $table->string('primary_color')->nullable();
            $table->string('secondary_color')->nullable();

            // Contact Information Fields
            $table->string('email_company')->nullable();
            $table->string('address')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('website')->nullable();
            $table->string('facebook')->nullable();
            $table->string('instagram')->nullable();
            $table->string('twitter')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('youtube')->nullable();

            $table->string('administrator_mail')->nullable();
            $table->string('hr_mail')->nullable();

            // Subscription Information Fields
            $table->unsignedBigInteger('subscription_plan_id')->nullable();
            $table->foreign('subscription_plan_id')->references('id')->on('subscription_plans');
            $table->enum('subscription_status', ['active', 'expired', 'canceled', 'pending', 'trial'])->default('trial');
            $table->date('subscription_expiry_date')->nullable();
            $table->timestamp('trial_started_at')->nullable();
            $table->timestamp('trial_ends_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('companies');
    }
};
