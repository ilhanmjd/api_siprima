<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UnitKerja;
use App\Models\Dinas;

class UnitKerjaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all dinas
        $dinasPendidikan = Dinas::where('name', 'Dinas Pendidikan')->first();
        $dinasKesehatan = Dinas::where('name', 'Dinas Kesehatan')->first();
        $dinasPU = Dinas::where('name', 'Dinas Pekerjaan Umum dan Penataan Ruang')->first();
        $dinasPerhubungan = Dinas::where('name', 'Dinas Perhubungan')->first();
        $dinasSosial = Dinas::where('name', 'Dinas Sosial')->first();

        // Unit Kerja for Dinas Pendidikan
        if ($dinasPendidikan) {
            UnitKerja::create([
                'name' => 'Bidang Pendidikan Dasar',
                'dinas_id' => $dinasPendidikan->id
            ]);
            UnitKerja::create([
                'name' => 'Bidang Pendidikan Menengah',
                'dinas_id' => $dinasPendidikan->id
            ]);
            UnitKerja::create([
                'name' => 'Bidang Pendidikan Non Formal',
                'dinas_id' => $dinasPendidikan->id
            ]);
        }

        // Unit Kerja for Dinas Kesehatan
        if ($dinasKesehatan) {
            UnitKerja::create([
                'name' => 'Bidang Pelayanan Kesehatan',
                'dinas_id' => $dinasKesehatan->id
            ]);
            UnitKerja::create([
                'name' => 'Bidang Pencegahan dan Pengendalian Penyakit',
                'dinas_id' => $dinasKesehatan->id
            ]);
            UnitKerja::create([
                'name' => 'Bidang Kesehatan Masyarakat',
                'dinas_id' => $dinasKesehatan->id
            ]);
        }

        // Unit Kerja for Dinas PU
        if ($dinasPU) {
            UnitKerja::create([
                'name' => 'Bidang Bina Marga',
                'dinas_id' => $dinasPU->id
            ]);
            UnitKerja::create([
                'name' => 'Bidang Cipta Karya',
                'dinas_id' => $dinasPU->id
            ]);
            UnitKerja::create([
                'name' => 'Bidang Penataan Ruang',
                'dinas_id' => $dinasPU->id
            ]);
        }

        // Unit Kerja for Dinas Perhubungan
        if ($dinasPerhubungan) {
            UnitKerja::create([
                'name' => 'Bidang Lalu Lintas',
                'dinas_id' => $dinasPerhubungan->id
            ]);
            UnitKerja::create([
                'name' => 'Bidang Angkutan',
                'dinas_id' => $dinasPerhubungan->id
            ]);
        }

        // Unit Kerja for Dinas Sosial
        if ($dinasSosial) {
            UnitKerja::create([
                'name' => 'Bidang Rehabilitasi Sosial',
                'dinas_id' => $dinasSosial->id
            ]);
            UnitKerja::create([
                'name' => 'Bidang Pemberdayaan Sosial',
                'dinas_id' => $dinasSosial->id
            ]);
        }
    }
}
