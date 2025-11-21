import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./VerifikasiRiskTreatment1.css";

function VerifikasiRiskTreatment1() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    navigate("/VerifikasiRiskTreatment2");
  };

  const handleBack = () => {
    navigate("/notifikasi-verifikator-risk-treatment");
  };

  const allFilled =
    assetData.idRisiko &&
    assetData.strategi &&
    assetData.pengendalian &&
    assetData.penanggungJawab &&
    assetData.targetTanggal &&
    assetData.biaya;

  return (
    <div className="asset-container">
      <button className="back-btn" onClick={handleBack}>
        <img src="/kembali.png" alt="Kembali" width="26" height="52" />
      </button>
      {/* === PROGRESS BAR === */}
      <div className="progress-wrapper">
        {/* Step 1 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img
              src="/Rencana_Perlakuan.png"
              alt="Rencana Perlakuan"
              width="30"
              height="30"
            />
          </div>
          <p>Rencana Perlakuan</p>
        </div>

        {/* Connector 1 */}
        <div className="connector active-connector"></div>

        {/* Step 2 */}
        <div className="step-wrapper">
          <div className="icon-box inactive-bg">
            <img
              src="/Residual_Risiko1.png"
              alt="Residual Risiko"
              width="30"
              height="30"
            />
          </div>
          <p>Residual Risiko</p>
        </div>
      </div>

      {/* === FORM === */}
      <form className="asset-form">
        <label>ID Risiko</label>
        <input
          type="text"
          name="idRisiko"
          value={assetData.idRisiko || ""}
          onChange={handleChange}
        />

        <label>Strategi</label>
        <input
          type="text"
          name="strategi"
          value={assetData.strategi || ""}
          onChange={handleChange}
        />

        <label>Pengendalian</label>
        <input
          type="text"
          name="pengendalian"
          value={assetData.pengendalian || ""}
          onChange={handleChange}
        />

        <label>Penanggung Jawab</label>
        <input
          type="text"
          name="penanggungJawab"
          value={assetData.penanggungJawab || ""}
          onChange={handleChange}
        />

        <label>Target Tanggal</label>
        <input
          type="date"
          name="targetTanggal"
          value={assetData.targetTanggal || ""}
          onChange={handleChange}
        />

        <label>Biaya</label>
        <input
          type="text"
          name="biaya"
          value={assetData.biaya || ""}
          onChange={handleChange}
        />

        <button
          type="button"
          className={`next-btn ${allFilled ? "active" : "disabled"}`}
          disabled={!allFilled}
          onClick={handleNext}
        >
          NEXT
        </button>
      </form>
    </div>
  );
}

export default VerifikasiRiskTreatment1;
