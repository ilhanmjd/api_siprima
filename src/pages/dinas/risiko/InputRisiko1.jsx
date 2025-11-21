import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./InputRisiko1.css";

function InputRisiko1() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    navigate("/InputRisiko2");
  };

  const handleBack = () => {
    navigate("/DashboardRisk");
  };

  const allFilled =
    assetData.asset_id &&
    assetData.judul &&
    assetData.deskripsi &&
    assetData.penyebab &&
    assetData.dampak;

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
          <div className="icon-box inactive-bg">
            <img
              src="/Analisis Awal.png"
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
        <label>ID Aset (hanya angka)</label>
        <input
          type="number"
          name="asset_id"
          value={assetData.asset_id || ""}
          onChange={handleChange}
        />

        <label>Judul Risiko</label>
        <input
          type="text"
          name="judul"
          value={assetData.judul || ""}
          onChange={handleChange}
        />

        <label>Deskripsi Risiko</label>
        <input
          type="text"
          name="deskripsi"
          value={assetData.deskripsi || ""}
          onChange={handleChange}
        />

        <label>Penyebab</label>
        <input
          type="text"
          name="penyebab"
          value={assetData.penyebab || ""}
          onChange={handleChange}
        />

        <label>Dampak</label>
        <input
          type="text"
          name="dampak"
          value={assetData.dampak || ""}
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

export default InputRisiko1;
