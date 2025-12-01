<?php

namespace Database\Seeders;

use App\Models\SubKategori;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubKategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sub-kategori TI (kategori_id = 1)
        $tiSubKategori = [
            'Laptop', 'PC Desktop', 'Monitor', 'Keyboard', 'Mouse', 'Printer', 'Scanner',
            'Router', 'Switch', 'Access Point', 'Firewall', 'NAS Storage', 'UPS', 'Modem',
            'Projector', 'Webcam', 'Headset', 'Microphone', 'Smartphone', 'Tablet', 'Server',
            'Network Cable', 'Rack Server', 'Patch Panel', 'Barcode Scanner', 'Card Reader',
            'CCTV Camera', 'NVR', 'DVR', 'Software OS', 'Software Office', 'Software Antivirus',
            'Software Database', 'Software ERP', 'Software HRIS', 'Software Finance',
            'Software Backup', 'Software Email', 'Software Monitoring', 'Software Security',
            'Software Inventory', 'Software CRM', 'Software E-Learning', 'Software Helpdesk',
            'Software Project Management', 'Software Cloud', 'Software Collaboration',
            'Software Ticketing', 'Software Accounting', 'Software GIS', 'Software CAD',
            'Software Analytics', 'Software API', 'Software Integration', 'Software Mobile',
            'Software IoT', 'Software AI/ML', 'Software Data Visualization', 'Software CMS',
            'Software LMS', 'Software Reporting', 'Software Testing', 'Software Repository',
            'Software Container', 'Software Automation', 'Software Encryption', 'Software VPN',
            'Software Firewall', 'Software Proxy', 'Software DevOps', 'Software Cloud Storage',
            'Software Data Backup', 'Software Email Server', 'Software Network Management',
            'Software Scheduling', 'Software Documentation', 'Software Chatbot',
            'Software Web Development', 'Software Remote Desktop', 'Software File Management',
            'Software Workflow', 'Software Monitoring Tools', 'Software HR Attendance',
            'Software Payroll', 'Software Procurement', 'Software Asset Management',
            'Software Maintenance', 'Software ITSM', 'Software Support Desk',
            'Software Security Audit', 'Software Digital Signature', 'Software Cloud Management',
            'Software CRM Online', 'Software VPN Client', 'Software Remote Access',
            'Software Browser', 'Software Meeting', 'Software Virtual Machine',
            'Software Office Suite', 'Software Backup Recovery'
        ];

        foreach ($tiSubKategori as $nama) {
            SubKategori::create([
                'nama' => $nama,
                'kategori_id' => 1
            ]);
        }

        // Sub-kategori Non-TI (kategori_id = 2)
        $nonTiSubKategori = [
            'Meja Kerja', 'Kursi Kantor', 'Lemari Arsip', 'Rak Dokumen', 'Whiteboard',
            'Papan Pengumuman', 'AC Split', 'Kipas Angin', 'Lampu Kantor', 'Telepon Meja',
            'Dispenser', 'Kulkas', 'Kopi Maker', 'Mesin Air Minum', 'Jam Dinding',
            'Tempat Sampah', 'Brankas', 'Filing Cabinet', 'Papan Nama', 'Gorden', 'Karpet',
            'Tirai', 'Peralatan Tulis', 'Buku Catatan', 'Kalkulator', 'Tangga Lipat',
            'Kotak P3K', 'Helm Safety', 'Rompi Safety', 'Jaket Kerja', 'Seragam Pegawai',
            'Sepatu Safety', 'Kacamata Safety', 'Sarung Tangan', 'Masker', 'Mobil Dinas',
            'Motor Operasional', 'Sepeda Lipat', 'Mobil Operasional', 'Bus Kantor',
            'Rak Besi', 'Ruang Rapat', 'Ruang Kerja', 'Ruang Tamu', 'Ruang Tunggu',
            'Toilet', 'Musholla', 'Kantin', 'Kafetaria', 'Gudang', 'Pintu Kantor',
            'Jendela', 'Lantai', 'Plafon', 'Dinding', 'Tangga', 'Lift', 'Pagar',
            'Gerbang', 'Pos Satpam', 'Tempat Parkir', 'Halaman', 'Taman', 'Pot Bunga',
            'Tempat Duduk Taman', 'Lampu Taman', 'Tempat Sampah Luar', 'Tempat Cuci Tangan',
            'Wastafel', 'Kloset', 'Urinoir', 'Kran Air', 'Pompa Air', 'Tandon Air',
            'Mesin Pemotong Rumput', 'Selang Air', 'Tangki Air', 'Generator', 'Panel Listrik',
            'Meteran Listrik', 'Kabel Listrik', 'Saklar', 'Stop Kontak', 'Genset Kantor',
            'Sound System', 'Meja Rapat', 'Kursi Rapat', 'Peralatan Presentasi',
            'Peralatan Kebersihan', 'Tempat Penyimpanan Barang', 'Rak Arsip',
            'Tempat Duduk Tamu', 'Sofa Kantor', 'Tirai Ruangan', 'Peralatan Pantry',
            'Tempat Makan Pegawai', 'Tempat Minum', 'Kotak Saran', 'Jam Digital Kantor',
            'Tempat Helm'
        ];

        foreach ($nonTiSubKategori as $nama) {
            SubKategori::create([
                'nama' => $nama,
                'kategori_id' => 2
            ]);
        }
    }
}
