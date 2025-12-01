import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./konfirmasi-input-maintenance.css";

export default function KonfirmasiInputMaintenance() {
  const navigate = useNavigate();
  const { assetData, addRisk, resetAssetData } = useAssetContext();

  const handleConfirm = () => {
    // Membuat objek maintenance baru berdasarkan data yang ada
    const newMaintenance = {
      id: Date.now(), // Menggunakan timestamp sebagai ID unik
      idAset: assetData.idAset,
      alasanPemeliharaan: assetData.alasanPemeliharaan,
      buktiLampiran: assetData.buktiLampiran,
    };

    // Menambahkan maintenance ke array risks (atau buat array maintenance terpisah jika perlu)
    addRisk(newMaintenance);

    // Reset data setelah konfirmasi
    resetAssetData();

    // Navigate ke halaman notifikasi
    navigate("/notifikasi-user-dinas");
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
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard")}>Dashboard</span> {">"}{" "}
        Input Maintenance
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
          <h1>Input Maintenance</h1>
        </div>

        <form className="form-grid">
          <div>
            <label>ID Aset</label>
            <input type="text" value={assetData.idAset} readOnly />
          </div>
          <div>
            <label>Alasan Pemeliharaan</label>
            <input type="text" value={assetData.alasanPemeliharaan} readOnly />
          </div>

          <div>
            <label>Bukti Lampiran</label>
            <input
              type="text"
              value={assetData.buktiLampiran?.name || ""}
              readOnly
            />
          </div>
        </form>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/Maintenance1")}
          >
            Batal
          </button>
          <button type="submit" className="btn-confirm" onClick={handleConfirm}>
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}
