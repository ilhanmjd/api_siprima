import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";
import "./AsetInput1.css";

function AssetForm() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [subKategoriFilter, setSubKategoriFilter] = useState("");

  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [subKategoriOptions, setSubKategoriOptions] = useState([]);
  const [selectedKategoriId, setSelectedKategoriId] = useState(null);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await api.getKategori();
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setKategoriOptions(response.data.data);
        } else {
          console.error("Unexpected response format for kategori:", response.data);
          setKategoriOptions([]);
        }
      } catch (error) {
        console.error("Error fetching kategori:", error);
        setKategoriOptions([]);
      }
    };
    fetchKategori();
  }, []);

  useEffect(() => {
    if (selectedKategoriId) {
      const fetchSubKategori = async () => {
        try {
          const response = await api.getSubKategori(selectedKategoriId);
          if (response.data && response.data.data && Array.isArray(response.data.data)) {
            // Filter sub-kategori based on kategori_id to ensure only relevant ones are shown
            const filteredSubKategori = response.data.data.filter(option => option.kategori_id === selectedKategoriId);
            setSubKategoriOptions(filteredSubKategori);
          } else {
            console.error("Unexpected response format for sub kategori:", response.data);
            setSubKategoriOptions([]);
          }
        } catch (error) {
          console.error("Error fetching sub kategori:", error);
          setSubKategoriOptions([]);
        }
      };
      fetchSubKategori();
    } else {
      setSubKategoriOptions([]);
    }
  }, [selectedKategoriId]);

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (option) => {
    updateAssetData({ kategori: option.nama, sub_kategori: "" });
    setSelectedKategoriId(option.id);
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

  const filteredOptions = subKategoriOptions.filter(option =>
    option && option.nama && option.nama.toLowerCase().includes(subKategoriFilter.toLowerCase())
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
            {kategoriOptions.map((option) => (
              <div key={option.id} onClick={() => handleSelectChange(option)}>{option.nama}</div>
            ))}
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
            {filteredOptions.map((option) => (
              <div key={option.id} onClick={() => handleSubSelectChange(option.nama)}>{option.nama}</div>
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
