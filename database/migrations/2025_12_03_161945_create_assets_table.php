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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('kode_bmd')->unique()->nullable();
            $table->foreignId('kategori_id')->constrained('kategoris')->onDelete('cascade');
            $table->foreignId('subkategori_id')->constrained('sub_kategoris')->onDelete('cascade');
            $table->foreignId('lokasi_id')->constrained('lokasis')->onDelete('cascade');
            $table->foreignId('penanggungjawab_id')->constrained('penanggungjawabs')->onDelete('cascade');
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->dateTime('tgl_perolehan')->nullable();
            $table->integer('nilai_perolehan')->nullable();
            $table->enum('kondisi', ['baik', 'rusak-ringan', 'rusak-berat'])->nullable();
            $table->string('lampiran_bukti')->nullable();
            $table->enum('is_usage', ['active', 'inactive'])->nullable();
            $table->enum('status', ['pending', 'diterima', 'ditolak', 'pemeliharaan'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
