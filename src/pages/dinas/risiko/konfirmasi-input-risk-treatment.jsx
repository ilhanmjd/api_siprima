import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api.js";
import "./konfirmasi-input-risk-treatment.css";

export default function KonfirmasiInputRiskTreatment() {
  const navigate = useNavigate();
  const { assetData, addRisk, resetAssetData } = useAssetContext();

  const isFormComplete = assetData.idRisiko && assetData.strategi && assetData.pengendalian && assetData.penanggungJawab && assetData.penanggungJawabId && assetData.targetTanggal && assetData.biaya && assetData.probabilitasAkhir && assetData.dampakAkhir && assetData.levelResidual &&
    assetData.idRisiko !== '' && assetData.strategi !== '' && assetData.pengendalian !== '' && assetData.penanggungJawab !== '' && assetData.penanggungJawabId !== '' && assetData.targetTanggal !== '' && assetData.biaya !== '' && assetData.probabilitasAkhir !== '' && assetData.dampakAkhir !== '' && assetData.levelResidual !== '';

  const handleConfirm = async () => {
    // Validate and parse numeric fields
    const biaya = parseInt(assetData.biaya, 10);
    const probabilitasAkhir = parseInt(assetData.probabilitasAkhir, 10);
    const dampakAkhir = parseInt(assetData.dampakAkhir, 10);
    const levelResidual = parseInt(assetData.levelResidual, 10);

    if (isNaN(biaya) || isNaN(probabilitasAkhir) || isNaN(dampakAkhir) || isNaN(levelResidual)) {
      alert("Please ensure all numeric fields are valid numbers.");
      return;
    }

    // Membuat objek risk treatment baru berdasarkan data yang ada
    const newRiskTreatment = {
      risiko_id: assetData.idRisiko,
      strategi: assetData.strategi,
      pengendalian: assetData.pengendalian,
      penanggung_jawab_id: assetData.penanggungJawabId,
      target_tanggal: assetData.targetTanggal,
      biaya: biaya,
      probabilitas_akhir: probabilitasAkhir,
      dampak_akhir: dampakAkhir,
      level_residual: levelResidual,
    };

    try {
      // Call API to create risk treatment
      await api.createRiskTreatment(newRiskTreatment);

      // Reset data setelah konfirmasi
      resetAssetData();

      // Navigate ke halaman notifikasi dengan default kategori "Risk Treatment"
      navigate("/notifikasi-user-dinas", {
        state: { defaultCategory: "Risk Treatment" },
      });
    } catch (error) {
      console.error("Error creating risk treatment:", error);
      // Handle error, e.g., show alert or notification
      alert("Failed to create risk treatment. Please try again.");
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
          <button type="submit" className="btn-confirm" onClick={handleConfirm} disabled={!isFormComplete}>
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}
