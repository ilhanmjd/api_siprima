import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import { addRisk as apiAddRisk } from "../../../api";
import "./konfirmasi-input-risiko.css";

export default function KonfirmasiInputRisiko() {
  const navigate = useNavigate();
  const { assetData, resetAssetData } = useAssetContext();
  const [loading, setLoading] = useState(false);

  // Fungsi validasi data risiko
  const validateRiskData = (data) => {
    if (
      !data.asset_id ||
      !data.judul ||
      !data.deskripsi ||
      !data.penyebab ||
      !data.dampak ||
      data.probabilitas === undefined ||
      data.dampak_nilai === undefined ||
      !data.level_awal ||
      !data.kriteria ||
      !data.prioritas ||
      !data.status
    ) {
      return false;
    }
    // Pastikan numerik
    if (
      isNaN(data.asset_id) ||
      isNaN(data.probabilitas) ||
      isNaN(data.dampak_nilai)
    ) {
      return false;
    }
    return true;
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Konversi tipe data numerik
      const newRisk = {
        asset_id: Number(assetData.asset_id),
        judul: assetData.judul,
        deskripsi: assetData.deskripsi,
        penyebab: assetData.penyebab,
        dampak: assetData.dampak,
        probabilitas: Number(assetData.probabilitas),
        dampak_nilai: Number(assetData.dampak_nilai),
        level_awal: assetData.level_awal,
        kriteria: assetData.kriteria,
        prioritas: assetData.prioritas,
        status: assetData.status,
      };

      // Validasi data
      if (!validateRiskData(newRisk)) {
        alert(
          "Semua field wajib diisi dan asset_id, probabilitas, nilai dampak harus berupa angka."
        );
        setLoading(false);
        return;
      }

      // Mengirim data risiko ke API
      await apiAddRisk(newRisk);

      // Reset data setelah konfirmasi
      resetAssetData();

      // Navigate ke halaman notifikasi
      navigate("/notifikasi-user-dinas");
    } catch (error) {
      console.error("Error adding risk:", error);
      alert("Terjadi kesalahan saat menambahkan risiko. Silakan coba lagi.");
    } finally {
      setLoading(false);
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
          <span className="active" onClick={() => navigate("/Dashboard")}>
            Dashboard
          </span>
          <span onClick={() => navigate("/service-desk")}>Requests</span>
          <span onClick={() => navigate("/faq")}>FAQ</span>
        </div>
        <div className="navbar-right">
          <div
            className="icon"
            onClick={() => navigate("/notifikasi-user-dinas")}
          >
            🔔
          </div>
          <div className="profile">👤</div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard")}>Dashboard</span> {">"}{" "}
        Input Risiko
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
          <h1>Input Risiko</h1>
        </div>

        <form className="form-grid">
          <div>
            <label>ID Aset</label>
            <input type="text" value={assetData.asset_id} readOnly />
          </div>
          <div>
            <label>Judul Risiko</label>
            <input type="text" value={assetData.judul} readOnly />
          </div>

          <div>
            <label>Deskripsi Risiko</label>
            <input type="text" value={assetData.deskripsi} readOnly />
          </div>
          <div>
            <label>Penyebab</label>
            <input type="text" value={assetData.penyebab} readOnly />
          </div>

          <div>
            <label>Dampak</label>
            <input type="text" value={assetData.dampak} readOnly />
          </div>
          <div>
            <label>Probabilitas</label>
            <input type="text" value={assetData.probabilitas} readOnly />
          </div>

          <div>
            <label>Nilai Dampak</label>
            <input type="text" value={assetData.dampak_nilai} readOnly />
          </div>
          <div>
            <label>Level Risiko</label>
            <input type="text" value={assetData.level_awal} readOnly />
          </div>

          <div>
            <label>Kriteria</label>
            <input type="text" value={assetData.kriteria} readOnly />
          </div>
          <div>
            <label>Prioritas</label>
            <input type="text" value={assetData.prioritas} readOnly />
          </div>
          <div>
            <label>Status</label>
            <input type="text" value={assetData.status} readOnly />
          </div>
        </form>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/InputRisiko2")}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
