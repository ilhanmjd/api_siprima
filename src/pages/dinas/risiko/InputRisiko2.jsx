import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./InputRisiko2.css";

function InputRisiko2() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();
  const [openDropdown, setOpenDropdown] = useState("");

  const deriveKriteria = (level) => {
    const numericLevel = parseInt(level, 10);
    if (Number.isNaN(numericLevel)) return "";
    if (numericLevel >= 1 && numericLevel <= 6) return "Low";
    if (numericLevel >= 7 && numericLevel <= 14) return "Medium";
    if (numericLevel >= 15 && numericLevel <= 25) return "High";
    return "";
  };

  const { level_risiko: levelRisiko } = assetData;
  const derivedKriteria = deriveKriteria(levelRisiko);
  const statusValue = assetData.status || "Baru";

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleSelect = (name, value) => {
    const updates = { [name]: value };
    if (name === "level_risiko") {
      updates.kriteria = deriveKriteria(value);
    }
    updateAssetData(updates);
    setOpenDropdown("");
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? "" : name));
  };

  const handleBack = () => {
    navigate("/InputRisiko1");
  };

  const handleNext = () => {
    if (allFilled) {
      updateAssetData({
        kriteria: derivedKriteria,
        status: statusValue,
      });
      navigate("/konfirmasi-input-risiko");
    } else {
      alert("Harap isi semua field");
    }
  };

  const allFilled =
    assetData.probabilitas &&
    assetData.nilai_dampak &&
    assetData.level_risiko &&
    assetData.prioritas &&
    derivedKriteria &&
    statusValue;

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
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => toggleDropdown("probabilitas")}
          >
            {assetData.probabilitas || "Pilih Probabilitas"} <span>▾</span>
          </button>
          <div
            className={`dropdown-content ${
              openDropdown === "probabilitas" ? "show" : ""
            }`}
          >
            {[1, 2, 3, 4, 5].map((option) => (
              <div
                key={option}
                onClick={() => handleSelect("probabilitas", option.toString())}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <label>Nilai Dampak</label>
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => toggleDropdown("nilai_dampak")}
          >
            {assetData.nilai_dampak || "Pilih Nilai Dampak"} <span>▾</span>
          </button>
          <div
            className={`dropdown-content ${
              openDropdown === "nilai_dampak" ? "show" : ""
            }`}
          >
            {[1, 2, 3, 4, 5].map((option) => (
              <div
                key={option}
                onClick={() => handleSelect("nilai_dampak", option.toString())}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <label>Level Risiko</label>
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => toggleDropdown("level_risiko")}
          >
            {assetData.level_risiko || "Pilih Level Risiko"} <span>▾</span>
          </button>
          <div
            className={`dropdown-content ${
              openDropdown === "level_risiko" ? "show" : ""
            }`}
          >
            {Array.from({ length: 25 }, (_, i) => i + 1).map((option) => (
              <div
                key={option}
                onClick={() => handleSelect("level_risiko", option.toString())}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <label>Kriteria (otomatis)</label>
        <input
          type="text"
          value={deriveKriteria(assetData.level_risiko) || ""}
          readOnly
        />

        <label>Prioritas</label>
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => toggleDropdown("prioritas")}
          >
            {assetData.prioritas || "Pilih Prioritas"} <span>▾</span>
          </button>
          <div
            className={`dropdown-content ${
              openDropdown === "prioritas" ? "show" : ""
            }`}
          >
            {["Low", "Medium", "High"].map((option) => (
              <div key={option} onClick={() => handleSelect("prioritas", option)}>
                {option}
              </div>
            ))}
          </div>
        </div>

        <label>Status (otomatis)</label>
        <input
          type="text"
          value={assetData.status || "Baru"}
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

export default InputRisiko2;
