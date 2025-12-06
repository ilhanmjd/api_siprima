import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./InputRisiko2.css";

function InputRisiko2() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate("/InputRisiko1");
  };

  const handleNext = () => {
    if (allFilled) {
      navigate("/konfirmasi-input-risiko");
    } else {
      alert("Harap isi semua field");
    }
  };

  const allFilled =
    assetData.probabilitas &&
    assetData.dampak_nilai &&
    assetData.level_awal &&
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
        <select
          name="probabilitas"
          value={assetData.probabilitas || ""}
          onChange={handleChange}
          className="dropdown-input"
        >
          <option value="">Pilih probabilitas</option>
          {[1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <label>Nilai Dampak</label>
        <select
          name="dampak_nilai"
          value={assetData.dampak_nilai || ""}
          onChange={handleChange}
          className="dropdown-input"
        >
          <option value="">Pilih nilai dampak</option>
          {[1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <label>Level Risiko</label>
        <input
          type="text"
          name="level_awal"
          value={assetData.level_awal || ""}
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
        <select
          name="prioritas"
          value={assetData.prioritas || ""}
          onChange={handleChange}
          className="dropdown-input"
        >
          <option value="">Pilih prioritas</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

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

export default InputRisiko2;
