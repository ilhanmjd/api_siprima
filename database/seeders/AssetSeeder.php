<?php

namespace Database\Seeders;

use App\Models\Asset;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assets = [
            [
                'dinas_id' => 1,
                'kategori_id' => 1,
                'subkategori_id' => 1,
                'lokasi_id' => 1,
                'penanggungjawab_id' => 1,
                'nama' => 'Laptop Dell Latitude 5420',
                'deskripsi' => 'Laptop untuk keperluan kerja, spesifikasi: Intel Core i5, RAM 8GB, SSD 256GB',
                'tgl_perolehan' => now()->subMonths(6),
                'nilai_perolehan' => 12000000,
                'kondisi' => 'baik',
                'lampiran_bukti' => null,
                'is_usage' => 'active',
                'status' => 'diterima',
            ],
            [
                'dinas_id' => 1,
                'kategori_id' => 1,
                'subkategori_id' => 2,
                'lokasi_id' => 2,
                'penanggungjawab_id' => 2,
                'nama' => 'Printer Canon iR 2006N',
                'deskripsi' => 'Printer multifungsi untuk kebutuhan kantor',
                'tgl_perolehan' => now()->subMonths(12),
                'nilai_perolehan' => 8500000,
                'kondisi' => 'baik',
                'lampiran_bukti' => null,
                'is_usage' => 'active',
                'status' => 'diterima',
            ],
            [
                'dinas_id' => 2,
                'kategori_id' => 2,
                'subkategori_id' => 3,
                'lokasi_id' => 3,
                'penanggungjawab_id' => 3,
                'nama' => 'Meja Kerja Ergonomis',
                'deskripsi' => 'Meja kerja dengan adjustable height, ukuran 120x60 cm',
                'tgl_perolehan' => now()->subMonths(3),
                'nilai_perolehan' => 2500000,
                'kondisi' => 'baik',
                'lampiran_bukti' => null,
                'is_usage' => 'active',
                'status' => 'diterima',
            ],
            [
                'dinas_id' => 2,
                'kategori_id' => 1,
                'subkategori_id' => 1,
                'lokasi_id' => 4,
                'penanggungjawab_id' => 4,
                'nama' => 'Server Dell PowerEdge R740',
                'deskripsi' => 'Server untuk database dan aplikasi, spesifikasi: Xeon Silver, RAM 32GB',
                'tgl_perolehan' => now()->subMonths(18),
                'nilai_perolehan' => 45000000,
                'kondisi' => 'rusak-ringan',
                'lampiran_bukti' => null,
                'is_usage' => 'inactive',
                'status' => 'pemeliharaan',
            ],
            [
                'dinas_id' => 3,
                'kategori_id' => 2,
                'subkategori_id' => 4,
                'lokasi_id' => 5,
                'penanggungjawab_id' => 5,
                'nama' => 'AC Split Daikin 1.5 PK',
                'deskripsi' => 'AC untuk ruangan kantor cabang',
                'tgl_perolehan' => now()->subMonths(24),
                'nilai_perolehan' => 4500000,
                'kondisi' => 'baik',
                'lampiran_bukti' => null,
                'is_usage' => 'active',
                'status' => 'diterima',
            ],
        ];

        foreach ($assets as $asset) {
            Asset::create($asset);
        }
    }
}
