import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api.js";

import "./konfirmasi-input-aset.css";

export default function KonfirmasiInputAset() {
  const navigate = useNavigate();
  const { assetData, resetAssetData } = useAssetContext();
  const [isLoading, setIsLoading] = useState(false);

  const isDataComplete = () =>
    assetData.kategori &&
    assetData.nama &&
    assetData.sub_kategori &&
    assetData.kondisi &&
    assetData.tanggal_perolehan &&
    assetData.lokasi &&
    assetData.nilai_perolehan &&
    assetData.deskripsi_aset &&
    assetData.status &&
    assetData.penanggung_jawab;

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!isDataComplete()) {
      alert("Semua data wajib harus diisi sebelum konfirmasi.");
      return;
    }
    setIsLoading(true);
    try {
      // Fetch kategori to get kategori_id
      const kategoriRes = await api.getKategori();
      const kategori = kategoriRes.data.data.find(k => k.nama === assetData.kategori);
      if (!kategori) throw new Error("Kategori tidak ditemukan.");
      const kategori_id = kategori.id;

      // Fetch sub_kategori using kategori_id to get subkategori_id
      const subKategoriRes = await api.getSubKategori(kategori_id);
      const subKategori = subKategoriRes.data.data.find(s => s.nama === assetData.sub_kategori);
      if (!subKategori) throw new Error("Sub Kategori tidak ditemukan.");
      const subkategori_id = subKategori.id;

      // Parallel fetch lokasi and penanggung_jawab
      const [lokasiRes, penanggungJawabRes] = await Promise.all([
        api.getLokasi(),
        api.getPenanggungJawab()
      ]);

      const lokasi = lokasiRes.data.data.find(l => l.nama === assetData.lokasi);
      if (!lokasi) throw new Error("Lokasi tidak ditemukan.");
      const lokasi_id = lokasi.id;

      const penanggungJawab = penanggungJawabRes.data.data.find(p => p.nama === assetData.penanggung_jawab);
      if (!penanggungJawab) throw new Error("Penanggung Jawab tidak ditemukan.");
      const penanggungjawab_id = penanggungJawab.id;

      // Construct newAsset with IDs
      const newAsset = {
        kategori_id: kategori_id,
        subkategori_id: subkategori_id,
        nama: assetData.nama,
        lokasi_id: lokasi_id,
        penanggungjawab_id: penanggungjawab_id,
        tgl_perolehan: assetData.tanggal_perolehan,
        nilai_perolehan: parseInt(assetData.nilai_perolehan),
        kondisi: assetData.kondisi === 'Baik' ? 'baik' :
                 assetData.kondisi === 'Sedang' ? 'sedang' :
                 assetData.kondisi === 'Buruk' ? 'buruk' : assetData.kondisi,
        is_usage: assetData.status === 'Active' ? 'active' : 'inactive',
        deskripsi: assetData.deskripsi_aset,
        lampiran_bukti: assetData.doc ? assetData.doc.name : null,
      };

      // Call POST /api/assets
      await api.createAsset(newAsset);

      resetAssetData();
      navigate("/notifikasi-user-dinas");
    } catch (error) {
      alert(error.message || "Gagal menambahkan asset. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span onClick={() => navigate("/Dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/service-desk")}>Requests</span>
          <span onClick={() => navigate("/laporan")}>Laporan</span>
          <span onClick={() => navigate("/faq")}>FAQ</span>
        </div>

        <div className="navbar-right">
          <div
            className="icon"
            onClick={() => navigate("/notifikasi-user-dinas")}
          >
            🔔
          </div>
          
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard")}>Dashboard</span> {">"}{" "}
        Input Asset
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div
          className="form-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <img src="/logo.png" alt="icon" className="form-icon" />
          <h1>Input Asset</h1>
        </div>
        <form className="form-grid" onSubmit={handleConfirm}>
          <div>
            <label>Kategori Asset</label>
            <input type="text" value={assetData.kategori} readOnly />
          </div>
          <div>
            <label>Nama Asset</label>
            <input type="text" value={assetData.nama} readOnly />
          </div>
          <div>
            <label>Sub Kategori</label>
            <input type="text" value={assetData.sub_kategori} readOnly />
          </div>
          <div>
            <label>Kondisi Asset</label>
            <input type="text" value={assetData.kondisi} readOnly />
          </div>
          <div>
            <label>Tanggal Perolehan Asset</label>
            <input type="date" value={assetData.tanggal_perolehan} readOnly />
          </div>
          <div>
            <label>Lokasi</label>
            <input type="text" value={assetData.lokasi} readOnly />
          </div>
          <div>
            <label>Nilai Perolehan Asset</label>
            <input type="number" value={assetData.nilai_perolehan} readOnly />
          </div>
          {assetData.doc && (
            <div>
              <label>Lampiran Bukti</label>
              <input
                type="text"
                value={assetData.doc.name || "File terlampir"}
                readOnly
              />
            </div>
          )}
          <div className="col-span">
            <label>Deskripsi Asset</label>
            <input type="text" value={assetData.deskripsi_aset} readOnly />
          </div>
          <div className="col-span">
            <label>Status</label>
            <input type="text" value={assetData.status} readOnly />
          </div>
          <div className="col-span">
            <label>Penanggung Jawab</label>
            <input type="text" value={assetData.penanggung_jawab} readOnly />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/AsetInput3")}
            >
              Batal
            </button>
            <button type="submit" className="btn-confirm" disabled={isLoading}>
              {isLoading ? "Loading..." : "Konfirmasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
