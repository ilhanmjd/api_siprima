import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./AsetInput1.css";

function AssetForm() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [subKategoriFilter, setSubKategoriFilter] = useState("");

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    updateAssetData({ kategori: value });
    setIsDropdownOpen(false);
  };

  const handleSubSelectChange = (value) => {
    updateAssetData({ sub_kategori: value });
    setIsSubDropdownOpen(false);
  };

  const handleSubKategoriInputChange = (e) => {
    const value = e.target.value;
    updateAssetData({ sub_kategori: value });
    setSubKategoriFilter(value);
    setIsSubDropdownOpen(true);
  };

  const subKategoriOptions = ["Aset Laptop", "Aset Komputer", "Data Cloud", "Server"];
  const filteredOptions = subKategoriOptions.filter(option =>
    option.toLowerCase().includes(subKategoriFilter.toLowerCase())
  );

  const handleNext = () => {
    navigate("/AsetInput2");
  };

  const handleBack = () => {
    navigate("/Dashboard");
  };

  const allFilled = assetData.kategori && assetData.sub_kategori && assetData.nama && assetData.deskripsi_aset;

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
            <img src="/identitas%20aset.png" alt="Identitas Aset" width="30" height="23" />
          </div>
          <p>Identitas Aset</p>
        </div>

        {/* Connector 1 */}
        <div className="connector active-connector"></div>

        {/* Step 2 */}
        <div className="step-wrapper">
          <div className="icon-box inactive-bg">
            <img src="/detail%20perolehan.png" alt="Detail Perolehan" width="20" height="23" />
          </div>
          <p>Detail Perolehan</p>
        </div>

        {/* Connector 2 */}
        <div className="connector inactive-connector"></div>

        {/* Step 3 */}
        <div className="step-wrapper">
          <div className="icon-box inactive-bg">
            <img src="/Penanggung%20Jawab.png" alt="Penanggung Jawab" width="20" height="20" />
          </div>
          <p>Penanggung Jawab</p>
        </div>
      </div>

      {/* === FORM === */}
      <form className="asset-form">
        <label>Kategori Aset</label>
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {assetData.kategori || "Pilih Kategori"} <span>▾</span>
          </button>
          <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
            <div onClick={() => handleSelectChange("Aset TI")}>Aset TI</div>
            <div onClick={() => handleSelectChange("Non TI")}>Non TI</div>
          </div>
        </div>

        <label>Sub Kategori</label>
        <div className="dropdown">
          <div className="text-dropdown-container">
            <input
              type="text"
              className="dropdown-input"
              value={assetData.sub_kategori || ""}
              onChange={handleSubKategoriInputChange}
              onClick={() => setIsSubDropdownOpen(!isSubDropdownOpen)}
              placeholder="Pilih atau ketik Sub Kategori"
            />
            <span className="dropdown-arrow" onClick={() => setIsSubDropdownOpen(!isSubDropdownOpen)}>▾</span>
          </div>
          <div className={`dropdown-content subkategori-dropdown ${isSubDropdownOpen ? 'show' : ''}`}>
            {filteredOptions.map((option, index) => (
              <div key={index} onClick={() => handleSubSelectChange(option)}>{option}</div>
            ))}
          </div>
        </div>

        <label>Nama Aset</label>
        <input
          type="text"
          name="nama"
          value={assetData.nama || ""}
          onChange={handleChange}
        />

        <label>Deskripsi Aset</label>
        <input
          type="text"
          name="deskripsi_aset"
          value={assetData.deskripsi_aset || ""}
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

export default AssetForm;
