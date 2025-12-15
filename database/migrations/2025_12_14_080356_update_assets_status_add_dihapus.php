<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update enum untuk status, tambahkan 'dihapus'
        DB::statement("ALTER TABLE assets MODIFY COLUMN status ENUM('pending', 'diterima', 'ditolak', 'pemeliharaan', 'dihapus') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Kembalikan enum status ke nilai lama
        DB::statement("ALTER TABLE assets MODIFY COLUMN status ENUM('pending', 'diterima', 'ditolak', 'pemeliharaan') DEFAULT 'pending'");
    }
};
