import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./RiskTreatment2.css";

function RiskTreatment2() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update field dan otomatis hitung Level Residual
    let updatedData = { [name]: value };

    if (name === "probabilitasAkhir" || name === "dampakAkhir") {
      const probabilitas =
        name === "probabilitasAkhir" ? value : assetData.probabilitasAkhir;
      const dampak = name === "dampakAkhir" ? value : assetData.dampakAkhir;

      const levelResidual =
        probabilitas && dampak ? Number(probabilitas) * Number(dampak) : "";

      updatedData = { ...updatedData, levelResidual };
    }

    updateAssetData(updatedData);
  };

  const handleBack = () => {
    navigate("/RiskTreatment1");
  };

  const handleNext = () => {
    if (allFilled) {
      navigate("/konfirmasi-input-risk-treatment");
    } else {
      alert("Harap isi semua field");
    }
  };

  const allFilled =
    assetData.probabilitasAkhir &&
    assetData.dampakAkhir &&
    assetData.levelResidual;

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
        <label>Probabilitas Akhir</label>
        <input
          type="number"
          name="probabilitasAkhir"
          value={assetData.probabilitasAkhir || ""}
          onChange={handleChange}
        />

        <label>Dampak Akhir</label>
        <input
          type="number"
          name="dampakAkhir"
          value={assetData.dampakAkhir || ""}
          onChange={handleChange}
        />

        <label>Level Residual (otomatis)</label>
        <input
          type="number"
          name="levelResidual"
          value={assetData.levelResidual || ""}
          readOnly
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
            className={`next-btn ${allFilled ? "active" : "disabled"}`}
            disabled={!allFilled}
            onClick={handleNext}
            style={{ backgroundColor: allFilled ? "#29AE08" : undefined }}
          >
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
}

export default RiskTreatment2;
