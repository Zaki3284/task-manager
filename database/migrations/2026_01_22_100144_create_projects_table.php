<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('chef_id')->constrained('users')->onDelete('cascade'); // Chef de projet owner
            $table->string('name'); // Project name
            $table->text('description')->nullable(); // Optional description
            $table->enum('status', ['Pending', 'Ongoing', 'Completed'])->default('Pending'); // Status
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
