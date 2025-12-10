import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api.js";
import "./VerifikasiAset1.css";

function VerifikasiAset1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [kategori, setKategori] = useState("");

  // Removed unused state variables for read-only form
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [asset, setAsset] = useState(null);

  // Removed unused variables for read-only form

  useEffect(() => {
    const fetchAsset = async () => {
      const id = location.state?.id;
      if (!id) {
        setError("ID asset tidak ditemukan");
        setLoading(false);
        return;
      }
      try {
        const response = await api.getAssetById(id);
        const asset = response.data.data || response.data;
        setAsset(asset);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching asset:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [location.state]);

  const handleNext = () => {
    // Navigasi ke halaman berikutnya dengan id dan asset
    const id = location.state?.id;
    navigate("/VerifikasiAset2", { state: { id, asset } });
  };

  const handleBack = () => {
    navigate("/notifikasi-verifikator-aset");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="asset-container">
      <button className="back-btn" onClick={handleBack}>
        <img src="/kembali.png" alt="Kembali" width="16" height="29" />
      </button>

      {/* === PROGRESS BAR === */}
      <div className="progress-wrapper">
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img
              src="/identitas%20aset.png"
              alt="Identitas Aset"
              width="30"
              height="23"
            />
          </div>
          <p>Identitas Aset</p>
        </div>
        <div className="connector active-connector"></div>
        <div className="step-wrapper">
          <div className="icon-box inactive-bg">
            <img
              src="/detail%20perolehan.png"
              alt="Detail Perolehan"
              width="20"
              height="23"
            />
          </div>
          <p>Detail Perolehan</p>
        </div>
        <div className="connector inactive-connector"></div>
        <div className="step-wrapper">
          <div className="icon-box inactive-bg">
            <img
              src="/Penanggung%20Jawab.png"
              alt="Penanggung Jawab"
              width="20"
              height="20"
            />
          </div>
          <p>Penanggung Jawab</p>
        </div>
      </div>
      {/* === FORM === */}
      <form className="asset-form">
        <label>Kategori Aset</label>
        <div className="dropdown">
          <button type="button" className="dropdown-btn" disabled>
            {asset?.kategori?.nama || "Pilih Kategori"} <span>▾</span>
          </button>
        </div>

        <label>Sub Kategori</label>
        <div className="dropdown">
          <div className="text-dropdown-container">
            <input
              type="text"
              className="dropdown-input"
              value={asset?.subkategori?.nama || ""}
              readOnly
              disabled
            />
          </div>
        </div>

        <label>Nama Aset</label>
        <input
          type="text"
          name="namaAset"
          value={asset?.nama || ""}
          readOnly
          disabled
        />

        <label>Deskripsi Aset</label>
        <input
          type="text"
          name="deskripsiAset"
          value={asset?.deskripsi || ""}
          readOnly
          disabled
        />

        <button type="button" className="next-btn active" onClick={handleNext}>
          NEXT
        </button>
      </form>
    </div>
  );
}

export default VerifikasiAset1;
