<?php

namespace Database\Seeders;

use App\Models\Lokasi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LokasiSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lokasis = [
            [
                'nama' => 'Kantor Pusat',
                'alamat' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
            ],
            [
                'nama' => 'Gedung A Lantai 1',
                'alamat' => 'Jl. Thamrin No. 45, Jakarta Pusat',
                'latitude' => -6.1944,
                'longitude' => 106.8229,
            ],
            [
                'nama' => 'Gedung B Lantai 2',
                'alamat' => 'Jl. Gatot Subroto No. 78, Jakarta Selatan',
                'latitude' => -6.2297,
                'longitude' => 106.8172,
            ],
            [
                'nama' => 'Gudang Utama',
                'alamat' => 'Jl. Raya Bekasi KM 25, Bekasi',
                'latitude' => -6.2383,
                'longitude' => 106.9756,
            ],
            [
                'nama' => 'Kantor Cabang Bandung',
                'alamat' => 'Jl. Asia Afrika No. 8, Bandung',
                'latitude' => -6.9175,
                'longitude' => 107.6191,
            ],
        ];

        foreach ($lokasis as $lokasi) {
            Lokasi::create($lokasi);
        }
    }
}
