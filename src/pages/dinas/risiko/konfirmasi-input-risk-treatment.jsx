import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./konfirmasi-input-risk-treatment.css";

export default function KonfirmasiInputRiskTreatment() {
  const navigate = useNavigate();
  const { assetData, addRisk, resetAssetData } = useAssetContext();

  const handleConfirm = () => {
    // Membuat objek risk treatment baru berdasarkan data yang ada
    const newRiskTreatment = {
      id: Date.now(), // Menggunakan timestamp sebagai ID unik
      idRisiko: assetData.idRisiko,
      strategi: assetData.strategi,
      pengendalian: assetData.pengendalian,
      penanggungJawab: assetData.penanggungJawab,
      targetTanggal: assetData.targetTanggal,
      biaya: assetData.biaya,
      probabilitasAkhir: assetData.probabilitasAkhir,
      dampakAkhir: assetData.dampakAkhir,
      levelResidual: assetData.levelResidual,
    };

    // Menambahkan risk treatment ke array riskTreatments
    // addRiskTreatment(newRiskTreatment); // TODO: Implement addRiskTreatment in context

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
        Input Risk Treatment
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
          <h1>Input Risk Treatment</h1>
        </div>

        <form className="form-grid">
          <div>
            <label>ID Risiko</label>
            <input type="text" value={assetData.idRisiko} readOnly />
          </div>
          <div>
            <label>Strategi</label>
            <input type="text" value={assetData.strategi} readOnly />
          </div>

          <div>
            <label>Pengendalian</label>
            <input type="text" value={assetData.pengendalian} readOnly />
          </div>
          <div>
            <label>Penanggung Jawab</label>
            <input type="text" value={assetData.penanggungJawab} readOnly />
          </div>

          <div>
            <label>Target Tanggal</label>
            <input type="text" value={assetData.targetTanggal} readOnly />
          </div>
          <div>
            <label>Biaya</label>
            <input type="text" value={assetData.biaya} readOnly />
          </div>

          <div>
            <label>Probabilitas Akhir</label>
            <input type="text" value={assetData.probabilitasAkhir} readOnly />
          </div>
          <div>
            <label>Dampak Akhir</label>
            <input type="text" value={assetData.dampakAkhir} readOnly />
          </div>

          <div>
            <label>Level Residual</label>
            <input type="text" value={assetData.levelResidual} readOnly />
          </div>
        </form>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/RiskTreatment2")}
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
