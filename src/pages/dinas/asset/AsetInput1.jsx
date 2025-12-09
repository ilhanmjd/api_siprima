import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";
import "./AsetInput1.css";
// AbortController presence for data fetch
const asetInput1AbortController = new AbortController();

function AssetForm() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [subKategoriFilter, setSubKategoriFilter] = useState("");

  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [allSubKategoriOptions, setAllSubKategoriOptions] = useState([]);
  const [selectedKategoriId, setSelectedKategoriId] = useState(null);

  const kategoriRef = useRef(null);
  const subKategoriRef = useRef(null);
  const namaRef = useRef(null);
  const deskripsiRef = useRef(null);

  useEffect(() => {
    const fetchAllSubKategoris = async () => {
      try {
        const response = await api.getSubKategoris();
        const subs = response?.data?.data;
        if (subs && Array.isArray(subs)) {
          setAllSubKategoriOptions(subs);
          const uniqueKategori = new Map();
          subs.forEach((sub) => {
            const id = sub?.kategori_id;
            if (!id || uniqueKategori.has(id)) return;
            const nama =
              sub?.kategori?.nama ||
              sub?.kategori_nama ||
              sub?.nama_kategori ||
              sub?.kategori_name ||
              sub?.kategori ||
              `Kategori ${id}`;
            uniqueKategori.set(id, { id, nama });
          });
          setKategoriOptions(Array.from(uniqueKategori.values()));
        } else {
          setAllSubKategoriOptions([]);
          setKategoriOptions([]);
        }
      } catch (error) {
        setAllSubKategoriOptions([]);
        setKategoriOptions([]);
      }
    };
    fetchAllSubKategoris();
  }, []);


  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (option) => {
    updateAssetData({
      kategori: option.nama,
      kategori_id: option.id,
      sub_kategori: "",
      subkategori_id: null,
    });
    setSelectedKategoriId(option.id);
    setIsDropdownOpen(false);
  };

  const handleSubSelectChange = (option) => {
    updateAssetData({
      sub_kategori: option?.nama || option,
      subkategori_id: option?.id || null,
      kategori_id: option?.kategori_id || selectedKategoriId || null,
    });
    setIsSubDropdownOpen(false);
  };

  const handleSubKategoriInputChange = (e) => {
    const value = e.target.value;
    updateAssetData({ sub_kategori: value, subkategori_id: null });
    setSubKategoriFilter(value);
    setIsSubDropdownOpen(true);
  };

  const filteredOptions = (selectedKategoriId
    ? allSubKategoriOptions.filter((option) => option.kategori_id === selectedKategoriId)
    : allSubKategoriOptions
  ).filter(
    (option) =>
      option &&
      option.nama &&
      option.nama.toLowerCase().includes(subKategoriFilter.toLowerCase())
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
            ref={kategoriRef}
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
              ref={subKategoriRef}
              placeholder="Pilih atau ketik Sub Kategori"
            />
            <span className="dropdown-arrow" onClick={() => setIsSubDropdownOpen(!isSubDropdownOpen)}>▾</span>
          </div>
          <div className={`dropdown-content subkategori-dropdown ${isSubDropdownOpen ? 'show' : ''}`}>
            {filteredOptions.map((option) => (
              <div key={option.id} onClick={() => handleSubSelectChange(option)}>{option.nama}</div>
            ))}
          </div>
        </div>

        <label>Nama Aset</label>
        <input
          type="text"
          name="nama"
          value={assetData.nama || ""}
          onChange={handleChange}
          ref={namaRef}
        />

        <label>Deskripsi Aset</label>
        <input
          type="text"
          name="deskripsi_aset"
          value={assetData.deskripsi_aset || ""}
          onChange={handleChange}
          ref={deskripsiRef}
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
