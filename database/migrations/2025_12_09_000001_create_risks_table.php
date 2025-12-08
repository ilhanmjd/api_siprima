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
        Schema::create('risks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->onDelete('cascade');
            $table->string('judul');
            $table->string('deskripsi');
            $table->string('penyebab');
            $table->string('dampak');
            $table->integer('probabilitas');
            $table->integer('nilai_dampak');
            $table->integer('level_risiko');
            $table->enum('kriteria', ['Low', 'Medium', 'High']);
            $table->enum('prioritas', ['Low', 'Medium', 'High']);
            $table->enum('status', ['pending', 'rejected', 'accepted'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risks');
    }
};
