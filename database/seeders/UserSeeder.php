<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Dinas;
use App\Models\UnitKerja;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $roleStaff = Role::where('name', 'staff')->first();
        $roleKepalaSeksi = Role::where('name', 'kepala_seksi')->first();
        $roleAdminKota = Role::where('name', 'admin_kota')->first();
        $roleAuditor = Role::where('name', 'auditor')->first();

        // Get sample dinas and unit kerja
        $dinasPendidikan = Dinas::where('name', 'Dinas Pendidikan')->first();
        $dinasKesehatan = Dinas::where('name', 'Dinas Kesehatan')->first();
        $unitKerjaPendidikanDasar = UnitKerja::where('name', 'Bidang Pendidikan Dasar')->first();
        $unitKerjaKesehatan = UnitKerja::where('name', 'Bidang Pelayanan Kesehatan')->first();

        // User dengan role staff
        if ($roleStaff && $dinasPendidikan && $unitKerjaPendidikanDasar) {
            User::create([
                'name' => 'Staff Dinas',
                'email' => 'staff@siprima.com',
                'password' => Hash::make('password123'),
                'dinas_id' => $dinasPendidikan->id,
                'unit_kerja_id' => $unitKerjaPendidikanDasar->id,
                'role_id' => $roleStaff->id,
                'nip' => '199001012020011001',
                'jenis_kelamin' => 'Laki-laki',
            ]);
        }

        // User dengan role kepala_seksi
        if ($roleKepalaSeksi && $dinasKesehatan && $unitKerjaKesehatan) {
            User::create([
                'name' => 'Kepala Seksi',
                'email' => 'kepala.seksi@siprima.com',
                'password' => Hash::make('password123'),
                'dinas_id' => $dinasKesehatan->id,
                'unit_kerja_id' => $unitKerjaKesehatan->id,
                'role_id' => $roleKepalaSeksi->id,
                'nip' => '199002022020022002',
                'jenis_kelamin' => 'Perempuan',
            ]);
        }

        // User dengan role admin_kota
        if ($roleAdminKota && $dinasPendidikan && $unitKerjaPendidikanDasar) {
            User::create([
                'name' => 'Admin Kota',
                'email' => 'admin.kota@siprima.com',
                'password' => Hash::make('password123'),
                'dinas_id' => $dinasPendidikan->id,
                'unit_kerja_id' => $unitKerjaPendidikanDasar->id,
                'role_id' => $roleAdminKota->id,
                'nip' => '199003032020033003',
                'jenis_kelamin' => 'Laki-laki',
            ]);
        }

        // User dengan role auditor
        if ($roleAuditor && $dinasKesehatan && $unitKerjaKesehatan) {
            User::create([
                'name' => 'Auditor',
                'email' => 'auditor@siprima.com',
                'password' => Hash::make('password123'),
                'dinas_id' => $dinasKesehatan->id,
                'unit_kerja_id' => $unitKerjaKesehatan->id,
                'role_id' => $roleAuditor->id,
                'nip' => '199004042020044004',
                'jenis_kelamin' => 'Perempuan',
            ]);
        }
    }
}
