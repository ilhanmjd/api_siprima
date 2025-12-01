import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./konfirmasi-penghapusan-aset.css";

export default function KonfirmasiPenghapusanAset() {
  const navigate = useNavigate();
  const { assetData, addRisk, resetAssetData } = useAssetContext();

  const handleConfirm = () => {
    // Membuat objek penghapusan aset baru berdasarkan data yang ada
    const newPenghapusan = {
      id: Date.now(), // Menggunakan timestamp sebagai ID unik
      idAset: assetData.idAset,
      alasanPenghapusan: assetData.alasanPenghapusan,
      lampiran: assetData.lampiran,
    };

    // Menambahkan penghapusan ke array risks (atau buat array penghapusan terpisah jika perlu)
    addRisk(newPenghapusan);

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
        <span onClick={() => navigate("/Dashboard")}>Dashboard</span> {">"}
        Penghapusan Aset
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
          <h1>Penghapusan Aset</h1>
        </div>

        <form className="form-grid">
          <div>
            <label>ID Aset</label>
            <input type="text" value={assetData.idAset} readOnly />
          </div>
          <div>
            <label>Alasan Penghapusan</label>
            <input type="text" value={assetData.alasanPenghapusan} readOnly />
          </div>

          <div>
            <label>Lampiran</label>
            <input
              type="text"
              value={assetData.lampiran?.name || ""}
              readOnly
            />
          </div>
        </form>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/PenghapusanAset")}
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
