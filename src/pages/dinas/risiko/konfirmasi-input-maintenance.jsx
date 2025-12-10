//konfirmasi-input-maintenance
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";
import "./konfirmasi-input-maintenance.css";

export default function KonfirmasiInputMaintenance() {
  const navigate = useNavigate();
  const { assetData, resetAssetData } = useAssetContext();

  const handleConfirm = async () => {
    try {
      const payload = {
        asset_id: assetData.idAset,
        alasan_pemeliharaan: assetData.alasanPemeliharaan,
        buktiLampiran: assetData.buktiLampiran,
        status_review: "pending",
        risk_id: assetData.idRisiko,
      };

      await api.createMaintenance(payload);

      resetAssetData();

      navigate("/notifikasi-user-dinas",{state: {defaultCategory: "Maintenance"}});
    } catch (error) {
      console.error("Gagal create maintenance:", error);
    }
  };

  return (
    <div className="dashboard-container">
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

      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard")}>Dashboard</span> {">"} Input
        Maintenance
      </div>

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
