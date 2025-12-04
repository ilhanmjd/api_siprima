<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Dinas;

class DinasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dinas = [
            ['name' => 'Dinas Pendidikan'],
            ['name' => 'Dinas Kesehatan'],
            ['name' => 'Dinas Pekerjaan Umum dan Penataan Ruang'],
            ['name' => 'Dinas Perhubungan'],
            ['name' => 'Dinas Sosial'],
            ['name' => 'Dinas Tenaga Kerja dan Transmigrasi'],
            ['name' => 'Dinas Komunikasi dan Informatika'],
            ['name' => 'Dinas Koperasi, Usaha Kecil dan Menengah'],
            ['name' => 'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu'],
            ['name' => 'Dinas Kepemudaan dan Olahraga'],
        ];

        foreach ($dinas as $item) {
            Dinas::create($item);
        }
    }
}
