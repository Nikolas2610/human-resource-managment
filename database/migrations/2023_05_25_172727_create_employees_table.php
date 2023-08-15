<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // TODO: Country, Type of Job (Onsite, Hybrid, Working from home), personal_email, documents relation, birthday, name_day, activeStatus, married(boolean), child's(number)
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained();
            $table->foreignId('department_id')->constrained();
            $table->foreignId('position_id')->constrained();
            $table->foreignId('leave_amount_id')->nullable()->constrained();
            $table->foreignId('reports_to')->nullable()->constrained('employees');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('image')->nullable();
            $table->date('work_start_date')->nullable();
            $table->date('work_end_date')->nullable();
            $table->decimal('salary', 8, 2)->nullable();
            $table->enum('role', ['employee', 'manager', 'hr', 'accounting', 'admin', 'owner'])->default('employee');
            $table->boolean('active')->default(true);
            $table->rememberToken();
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
        Schema::dropIfExists('employees');
    }
};
