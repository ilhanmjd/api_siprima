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
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->onDelete('cascade');
            $table->foreignId('risk_id')->nullable()->constrained('risks')->onDelete('set null');
            $table->foreignId('risk_treatment_id')->nullable()->constrained('risk_treatments')->onDelete('set null');
            $table->text('alasan_pemeliharaan');
            $table->enum('status_pemeliharaan', ['pending', 'penanganan', 'selesai'])->nullable();
            $table->enum('status_review', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->string('bukti_lampiran')->nullable();
            $table->text('alasan_ditolak')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
