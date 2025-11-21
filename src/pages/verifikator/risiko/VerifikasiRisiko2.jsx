import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./VerifikasiRisiko2.css";

function VerifikasiRisiko2() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate("/VerifikasiRisiko1");
  };
  const handleReject = () => {
    navigate("/VerifikasiRejectRisiko");
  };

  const handleVerify = () => {
    if (allFilled) {
      navigate("/VerifikasiAcceptRisiko");
    } else {
      alert("Harap isi semua field");
    }
  };

  const allFilled =
    assetData.probabilitas &&
    assetData.nilaiDampak &&
    assetData.levelRisiko &&
    assetData.kriteria &&
    assetData.prioritas &&
    assetData.status;

  return (
    <div className="asset-container">
      {/* === PROGRESS BAR === */}
      <div className="progress-wrapper">
        {/* Step 1 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img
              src="/identifikasi risiko.png"
              alt="Identifikasi Risiko"
              width="30"
              height="23"
            />
          </div>
          <p>Identifikasi Risiko</p>
        </div>

        {/* Connector 1 */}
        <div className="connector active-connector"></div>

        {/* Step 2 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img
              src="/Analisis Awal2.png"
              alt="Analisis Awal"
              width="20"
              height="23"
            />
          </div>
          <p>Analisis Awal</p>
        </div>
      </div>

      {/* === FORM === */}
      <form className="asset-form">
        <label>Probabilitas</label>
        <input
          type="text"
          name="probabilitas"
          value={assetData.probabilitas || ""}
          onChange={handleChange}
        />

        <label>Nilai Dampak</label>
        <input
          type="text"
          name="nilaiDampak"
          value={assetData.nilaiDampak || ""}
          onChange={handleChange}
        />

        <label>Level Risiko</label>
        <input
          type="text"
          name="levelRisiko"
          value={assetData.levelRisiko || ""}
          onChange={handleChange}
        />

        <label>Kriteria</label>
        <input
          type="text"
          name="kriteria"
          value={assetData.kriteria || ""}
          onChange={handleChange}
        />

        <label>Prioritas</label>
        <input
          type="text"
          name="prioritas"
          value={assetData.prioritas || ""}
          onChange={handleChange}
        />

        <label>Status</label>
        <input
          type="text"
          name="status"
          value={assetData.status || ""}
          onChange={handleChange}
        />

        <div className="button-group">
          <button
            type="button"
            className="next-btn active"
            onClick={handleBack}
          >
            BACK
          </button>
          <button
            type="button"
            className="next-btn"
            style={{
              backgroundColor: "#FF0004",
            }}
            onClick={handleReject}
          >
            REJECT
          </button>
          <button
            type="button"
            className={`next-btn ${allFilled ? "active" : "disabled"}`}
            disabled={!allFilled}
            onClick={handleVerify}
            style={{ backgroundColor: allFilled ? "#29AE08" : undefined }}
          >
            VERIFIKASI
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerifikasiRisiko2;
