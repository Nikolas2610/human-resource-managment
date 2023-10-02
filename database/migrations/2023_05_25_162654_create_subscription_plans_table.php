<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. Basic, Pro, Enterprise
            $table->decimal('price', 8, 2); // Price for this plan
            $table->string('duration'); // e.g. monthly, yearly
            $table->text('features'); // Features included in this plan
            $table->text('stripe_price_id')->nullable(); // Features included in this plan
            $table->string('access_level')->nullable(); // Features included in this plan
            $table->boolean('is_active')->default(true); // Is this plan active?
            $table->integer('min_users')->default(1); // Minimum number of users for this plan
            $table->integer('max_users')->default(1); // Maximum number of users for this plan
            $table->boolean('has_trial')->default(false); // Does this plan have a trial?
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
        Schema::dropIfExists('subscription_plans');
    }
};
