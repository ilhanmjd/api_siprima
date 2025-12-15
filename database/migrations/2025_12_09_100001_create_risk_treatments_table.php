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
        Schema::create('risk_treatments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('risiko_id')->constrained('risks')->onDelete('cascade');
            $table->string('strategi');
            $table->string('pengendalian');
            $table->foreignId('penanggung_jawab_id')->constrained('penanggungjawabs')->onDelete('cascade');
            $table->date('target_tanggal');
            $table->integer('biaya');
            $table->integer('probabilitas_akhir');
            $table->integer('dampak_akhir');
            $table->integer('level_residual');
            $table->enum('status', ['pending', 'rejected', 'accepted'])->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risk_treatments');
    }
};
