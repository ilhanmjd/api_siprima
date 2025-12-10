# TODO: Implementasi Navigasi dan API Call untuk Notifikasi Verifikator Aset

## Langkah-langkah:

1. Edit `src/pages/verifikator/asset/notifikasi-verifikator-aset.jsx`: Ubah onClick pada notif-card untuk pass id asset menggunakan state navigation.
2. Edit `src/pages/verifikator/asset/VerifikasiAset1.jsx`:
   - Import useLocation dan useEffect.
   - Tambahkan state untuk loading dan error.
   - Di useEffect, ambil id dari location.state.id dan call api.getAssetById(id).
   - Populate form fields dengan data dari API.
   - Handle loading dan error states.
3. Test navigasi dan fetch data.
4. Jalankan aplikasi dan cek console untuk error.

## Status:

- [ ] Langkah 1: Edit notifikasi-verifikator-aset.jsx
- [ ] Langkah 2: Edit VerifikasiAset1.jsx
- [ ] Langkah 3: Test navigasi dan fetch data
- [ ] Langkah 4: Jalankan aplikasi dan cek error
