<?php

namespace Database\Seeders;

use App\Models\Penanggungjawab;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PenanggungjawabSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $penanggungjawabs = [
            [
                'nama' => 'Budi Santoso',
                'jabatan' => 'Kepala Divisi IT',
            ],
            [
                'nama' => 'Siti Nurhaliza',
                'jabatan' => 'Manager Operasional',
            ],
            [
                'nama' => 'Ahmad Dahlan',
                'jabatan' => 'Supervisor Gudang',
            ],
            [
                'nama' => 'Rina Wijaya',
                'jabatan' => 'Kepala Bagian Umum',
            ],
            [
                'nama' => 'Dedi Mulyadi',
                'jabatan' => 'Staff Administrasi',
            ],
        ];

        foreach ($penanggungjawabs as $penanggungjawab) {
            Penanggungjawab::create($penanggungjawab);
        }
    }
}
