<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // TODO: Add fields => celebrate birthdays, celebrate name days, celebrate anniversaries, email, logo, image, contact information [Address, Phone Number, email, website], information: [Description, company start date], administrator_mail, hr_mail
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
