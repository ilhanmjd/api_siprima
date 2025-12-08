<?php

namespace Database\Seeders;

use App\Models\Risk;
use App\Models\RiskRejected;
use Illuminate\Database\Seeder;

class RiskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $risks = [
            [
                'asset_id' => 1,
                'judul' => 'Risiko Kerusakan Hardware Laptop',
                'deskripsi' => 'Potensi kerusakan pada komponen hardware laptop seperti keyboard, layar, atau baterai',
                'penyebab' => 'Usia perangkat sudah melewati masa garansi dan penggunaan intensif',
                'dampak' => 'Gangguan operasional kerja dan biaya perbaikan tinggi',
                'probabilitas' => 3,
                'nilai_dampak' => 4,
                'level_risiko' => 12,
                'kriteria' => 'High',
                'prioritas' => 'High',
                'status' => 'pending',
            ],
            [
                'asset_id' => 1,
                'judul' => 'Risiko Kehilangan Data',
                'deskripsi' => 'Potensi kehilangan data penting akibat kerusakan storage',
                'penyebab' => 'Hard disk atau SSD mengalami kerusakan mendadak',
                'dampak' => 'Kehilangan dokumen penting dan data operasional',
                'probabilitas' => 2,
                'nilai_dampak' => 5,
                'level_risiko' => 10,
                'kriteria' => 'High',
                'prioritas' => 'High',
                'status' => 'accepted',
            ],
            [
                'asset_id' => 2,
                'judul' => 'Risiko Paper Jam Printer',
                'deskripsi' => 'Kertas sering macet saat proses pencetakan',
                'penyebab' => 'Roller printer aus dan debu menumpuk',
                'dampak' => 'Menghambat proses pencetakan dokumen',
                'probabilitas' => 4,
                'nilai_dampak' => 2,
                'level_risiko' => 8,
                'kriteria' => 'Medium',
                'prioritas' => 'Medium',
                'status' => 'pending',
            ],
            [
                'asset_id' => 2,
                'judul' => 'Risiko Kualitas Cetak Menurun',
                'deskripsi' => 'Hasil cetakan menjadi buram atau bergaris',
                'penyebab' => 'Toner atau cartridge hampir habis atau head printer kotor',
                'dampak' => 'Dokumen tidak layak untuk presentasi atau arsip resmi',
                'probabilitas' => 3,
                'nilai_dampak' => 3,
                'level_risiko' => 9,
                'kriteria' => 'Medium',
                'prioritas' => 'Medium',
                'status' => 'accepted',
            ],
            [
                'asset_id' => 3,
                'judul' => 'Risiko Kerusakan Meja Kerja',
                'deskripsi' => 'Meja kerja mengalami kerusakan struktural',
                'penyebab' => 'Beban berlebih atau material sudah rapuh',
                'dampak' => 'Ketidaknyamanan kerja dan potensi kecelakaan',
                'probabilitas' => 1,
                'nilai_dampak' => 3,
                'level_risiko' => 3,
                'kriteria' => 'Low',
                'prioritas' => 'Low',
                'status' => 'rejected',
            ],
            [
                'asset_id' => 4,
                'judul' => 'Risiko AC Tidak Dingin',
                'deskripsi' => 'Unit AC tidak menghasilkan udara dingin secara optimal',
                'penyebab' => 'Freon habis atau filter kotor',
                'dampak' => 'Ketidaknyamanan ruangan dan produktivitas menurun',
                'probabilitas' => 3,
                'nilai_dampak' => 2,
                'level_risiko' => 6,
                'kriteria' => 'Medium',
                'prioritas' => 'Low',
                'status' => 'pending',
            ],
            [
                'asset_id' => 5,
                'judul' => 'Risiko Kerusakan Server',
                'deskripsi' => 'Server mengalami downtime atau kerusakan komponen',
                'penyebab' => 'Overheating, power surge, atau komponen hardware gagal',
                'dampak' => 'Semua layanan terganggu dan data tidak dapat diakses',
                'probabilitas' => 2,
                'nilai_dampak' => 5,
                'level_risiko' => 10,
                'kriteria' => 'High',
                'prioritas' => 'High',
                'status' => 'accepted',
            ],
            [
                'asset_id' => 5,
                'judul' => 'Risiko Serangan Siber',
                'deskripsi' => 'Server rentan terhadap serangan malware atau hacking',
                'penyebab' => 'Sistem keamanan tidak update atau konfigurasi lemah',
                'dampak' => 'Kebocoran data sensitif dan kerugian reputasi',
                'probabilitas' => 3,
                'nilai_dampak' => 5,
                'level_risiko' => 15,
                'kriteria' => 'High',
                'prioritas' => 'High',
                'status' => 'pending',
            ],
        ];

        foreach ($risks as $riskData) {
            $risk = Risk::create($riskData);

            // Jika status rejected, tambahkan alasan penolakan
            if ($riskData['status'] === 'rejected') {
                RiskRejected::create([
                    'risk_id' => $risk->id,
                    'alasan' => 'Risiko tidak relevan karena aset sudah tidak digunakan lagi dan akan segera dihapuskan dari inventaris.',
                ]);
            }
        }
    }
}
