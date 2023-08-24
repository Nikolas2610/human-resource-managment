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
        Schema::create('employee_leave_type', function (Blueprint $table) {
            $table->foreignId('employee_id')->constrained();
            $table->foreignId('leave_type_id')->constrained();
            $table->integer('allocated_leaves')->default(0); // Total leaves an employee is entitled to for the current year
            $table->integer('used_leaves')->default(0);  // Number of leave days taken for that type
            $table->integer('unavailable_leaves')->default(0);  // Leaves that are unavailable due to late joining, etc.
            $table->integer('remaining_leaves')->default(0);  // Leaves still available for use
            $table->year('year');  // The year for this record
            $table->primary(['employee_id', 'leave_type_id', 'year']);  // Making the combination of employee_id, leave_type_id, and year unique
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee_leave_type');
    }
};
