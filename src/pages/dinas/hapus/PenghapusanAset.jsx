import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";
import "./PenghapusanAset.css";

function PenghapusanAset() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.getAssets();
        const filteredAssets = Array.isArray(response.data.data)
          ? response.data.data.filter(asset => asset.status !== 'pending' && asset.status !== 'ditolak')
          : [];
        setAssets(filteredAssets);
      } catch (err) {
        setError("Failed to load assets");
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.files[0] });
  };

  const handleSelectChange = (asset) => {
    updateAssetData({ idAset: asset.id });
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    // Logika untuk submit penghapusan aset
    console.log("Data penghapusan aset:", assetData);
    // Navigasi ke halaman konfirmasi penghapusan aset
    navigate("/konfirmasi-penghapusan-aset");
  };

  const handleBack = () => {
    navigate("/Dashboard");
  };

  const step1Active = true;
  const connectorActive = false;
  const step2Active = false;

  const allFilled =
    assetData.idAset && assetData.alasanPenghapusan && assetData.lampiran;

  return (
    <div className="asset-container">
      <button className="back-btn" onClick={handleBack}>
        <img src="/kembali.png" alt="Kembali" width="26" height="52" />
      </button>
      {/* === PROGRESS BAR === */}
      <div className="progress-wrapper">
        {/* Step 1 */}
        <div className="step-wrapper">
          <div
            className={`icon-box ${step1Active ? "active-bg" : "inactive-bg"}`}
          >
            <img
              src="/identifikasi risiko.png"
              alt="Identifikasi Risiko"
              width="30"
              height="23"
            />
          </div>
          <p>Penghapusan Aset</p>
        </div>

        {/* Connector 1 */}
        <div
          className={`connector ${
            connectorActive ? "active-connector" : "inactive-connector"
          }`}
        ></div>

        {/* Step 2 */}
        <div className="step-wrapper">
          <div
            className={`icon-box ${step2Active ? "active-bg" : "inactive-bg"}`}
          >
            <img
              src="/Analisis Awal.png"
              alt="Analisis Awal"
              width="20"
              height="23"
            />
          </div>
          <p>Konfirmasi</p>
        </div>
      </div>

      {/* === FORM === */}
      <form
        className="asset-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label>ID Aset</label>
{loading ? (
  <p>Loading assets...</p>
) : error ? (
  <p>{error}</p>
) : (
  <div className="dropdown">
    <button
      type="button"
      className="dropdown-btn"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      {assetData.idAset ? `${assetData.idAset} - ${assets.find(asset => asset.id === assetData.idAset)?.nama}` : "Pilih ID Aset"} <span>▾</span>
    </button>
    <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
      {assets.map((asset) => (
        <div key={asset.id} onClick={() => handleSelectChange(asset)}>
          {asset.id} - {asset.nama}
        </div>
      ))}
    </div>
  </div>
)}


        <label>Alasan Penghapusan</label>
        <input
          type="text"
          name="alasanPenghapusan"
          value={assetData.alasanPenghapusan || ""}
          onChange={handleChange}
          required
        />

        <label>Lampiran</label>
        <input
          type="file"
          name="lampiran"
          onChange={handleFileChange}
          required
        />

        <button
          type="submit"
          className={`next-btn ${allFilled ? "active" : "disabled"}`}
          disabled={!allFilled}
          style={{ backgroundColor: allFilled ? "#29AE08" : undefined }}
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default PenghapusanAset;
