import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./AsetInput2.css";

function AssetForm() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const [isKondisiDropdownOpen, setIsKondisiDropdownOpen] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);

  const tanggalRef = useRef(null);
  const nilaiRef = useRef(null);
  const kondisiRef = useRef(null);
  const docRef = useRef(null);

  const handleKondisiSelectChange = (value) => {
    updateAssetData({ kondisi: value });
    setIsKondisiDropdownOpen(false);
  };



  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    updateAssetData({ doc: e.target.files[0] });
  };

  const handleBack = () => {
    navigate("/AsetInput1");
  };

  const handleNext = () => {
    navigate("/AsetInput3");
  };



  const allFilled = assetData.tanggal_perolehan && assetData.nilai_perolehan && assetData.kondisi && assetData.doc;

  return (
    <div className="asset-container">
      {/* === PROGRESS BAR === */}
      <div className="progress-wrapper">
        {/* Step 1 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img src="/identitas%20aset.png" alt="Identitas Aset" width="30" height="23" />
          </div>
          <p>Identitas Aset</p>
        </div>

        {/* Connector 1 */}
        <div className="connector active-connector"></div>

        {/* Step 2 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img src="/detail%20perolehan%20putih.png" alt="Detail Perolehan" width="20" height="23" />
          </div>
          <p>Detail Perolehan</p>
        </div>

        {/* Connector 2 */}
        <div className="connector active-connector"></div>

        {/* Step 3 */}
        <div className="step-wrapper">
          <div className="icon-box inactive-bg">
            <img src="/Penanggung%20Jawab.png" alt="Penanggung Jawab" width="20" height="20" />
          </div>
          <p>Penanggung Jawab</p>
        </div>
      </div>

      {/* === FORM === */}
      <form className="asset-form" onSubmit={(e) => e.preventDefault()}>
        <label>Tanggal perolehan aset</label>
        <input
          type="date"
          name="tanggal_perolehan"
          value={assetData.tanggal_perolehan || ""}
          onChange={handleChange}
          ref={tanggalRef}
        />

        <label>Nilai Perolehan Aset</label>
        <input
          type="number"
          name="nilai_perolehan"
          value={assetData.nilai_perolehan || ""}
          onChange={handleChange}
          ref={nilaiRef}
        />

        <label>Kondisi Aset</label>
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => setIsKondisiDropdownOpen(!isKondisiDropdownOpen)}
            ref={kondisiRef}
          >
            {assetData.kondisi || "Pilih Kondisi"} <span>▾</span>
          </button>
          <div className={`dropdown-content ${isKondisiDropdownOpen ? 'show' : ''}`}>
            <a href="#" className={selectedOptionIndex === 0 ? 'selected' : ''} onClick={(e) => { e.preventDefault(); handleKondisiSelectChange("Baik"); }}>Baik</a>
            <a href="#" className={selectedOptionIndex === 1 ? 'selected' : ''} onClick={(e) => { e.preventDefault(); handleKondisiSelectChange("Sedang"); }}>Sedang</a>
            <a href="#" className={selectedOptionIndex === 2 ? 'selected' : ''} onClick={(e) => { e.preventDefault(); handleKondisiSelectChange("Buruk"); }}>Buruk</a>
          </div>
        </div>

        <label>Lampiran Bukti (PNG/PDF)</label>
        <div className="container">
          <input type="file" id="file" accept=".png,.pdf" onChange={handleFileChange} ref={docRef} />
        </div>

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
          >
            NEXT
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssetForm;
