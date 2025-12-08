<?php

namespace Database\Seeders;

use App\Models\RiskTreatment;
use App\Models\RiskTreatmentRejected;
use Illuminate\Database\Seeder;

class RiskTreatmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $riskTreatments = [
            [
                'risiko_id' => 1,
                'strategi' => 'Mitigasi',
                'pengendalian' => 'Backup data rutin setiap hari dan pemeliharaan hardware berkala',
                'penanggung_jawab_id' => 1,
                'target_tanggal' => '2025-12-31',
                'biaya' => 5000000,
                'probabilitas_akhir' => 1,
                'dampak_akhir' => 2,
                'level_residual' => 2,
                'status' => 'pending',
            ],
            [
                'risiko_id' => 2,
                'strategi' => 'Transfer',
                'pengendalian' => 'Menggunakan cloud storage dengan backup otomatis',
                'penanggung_jawab_id' => 2,
                'target_tanggal' => '2025-11-30',
                'biaya' => 12000000,
                'probabilitas_akhir' => 1,
                'dampak_akhir' => 1,
                'level_residual' => 1,
                'status' => 'accepted',
            ],
            [
                'risiko_id' => 3,
                'strategi' => 'Mitigasi',
                'pengendalian' => 'Maintenance rutin dan pembersihan printer setiap minggu',
                'penanggung_jawab_id' => 1,
                'target_tanggal' => '2025-12-15',
                'biaya' => 2000000,
                'probabilitas_akhir' => 2,
                'dampak_akhir' => 1,
                'level_residual' => 2,
                'status' => 'pending',
            ],
            [
                'risiko_id' => 4,
                'strategi' => 'Accept',
                'pengendalian' => 'Monitoring kualitas cetak dan penggantian toner tepat waktu',
                'penanggung_jawab_id' => 3,
                'target_tanggal' => '2025-12-20',
                'biaya' => 3000000,
                'probabilitas_akhir' => 2,
                'dampak_akhir' => 2,
                'level_residual' => 4,
                'status' => 'accepted',
            ],
            [
                'risiko_id' => 5,
                'strategi' => 'Avoid',
                'pengendalian' => 'Penggantian meja kerja yang sudah rusak dengan yang baru',
                'penanggung_jawab_id' => 2,
                'target_tanggal' => '2026-01-15',
                'biaya' => 15000000,
                'probabilitas_akhir' => 1,
                'dampak_akhir' => 1,
                'level_residual' => 1,
                'status' => 'rejected',
            ],
        ];

        foreach ($riskTreatments as $treatment) {
            RiskTreatment::create($treatment);
        }

        // Create rejection reason for rejected treatment
        RiskTreatmentRejected::create([
            'risk_treatment_id' => 5,
            'alasan' => 'Biaya penggantian meja terlalu tinggi, disarankan untuk melakukan perbaikan saja',
        ]);
    }
}
