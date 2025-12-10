import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api.js";
import "./VerifikasiAset1.css";

function VerifikasiAset1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [kategori, setKategori] = useState("");
  const [subKategori, setSubKategori] = useState("");
  const [namaAset, setNamaAset] = useState("");
  const [deskripsiAset, setDeskripsiAset] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [subKategoriFilter, setSubKategoriFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subKategoriOptions = [
    "Aset Laptop",
    "Aset Komputer",
    "Data Cloud",
    "Server",
  ];
  const filteredOptions = subKategoriOptions.filter((option) =>
    option.toLowerCase().includes(subKategoriFilter.toLowerCase())
  );

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
        setKategori(
          typeof asset.kategori?.nama === "string" ? asset.kategori.nama : ""
        );
        setSubKategori(
          typeof asset.subkategori?.nama === "string"
            ? asset.subkategori.nama
            : ""
        );
        setNamaAset(typeof asset.nama === "string" ? asset.nama : "");
        setDeskripsiAset(
          typeof asset.deskripsi === "string" ? asset.deskripsi : ""
        );
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
    // Navigasi ke halaman berikutnya jika diperlukan
    navigate("/VerifikasiAset2");
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
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {kategori || "Pilih Kategori"} <span>▾</span>
          </button>
          <div className={`dropdown-content ${isDropdownOpen ? "show" : ""}`}>
            <div
              onClick={() => {
                setKategori("Aset TI");
                setIsDropdownOpen(false);
              }}
            >
              Aset TI
            </div>
            <div
              onClick={() => {
                setKategori("Non TI");
                setIsDropdownOpen(false);
              }}
            >
              Non TI
            </div>
          </div>
        </div>
        <label>Sub Kategori</label>
        <div className="dropdown">
          <div className="text-dropdown-container">
            <input
              type="text"
              className="dropdown-input"
              value={subKategori}
              onChange={(e) => {
                setSubKategori(e.target.value);
                setSubKategoriFilter(e.target.value);
                setIsSubDropdownOpen(true);
              }}
              onClick={() => setIsSubDropdownOpen(!isSubDropdownOpen)}
              placeholder="Pilih atau ketik Sub Kategori"
            />
            <span
              className="dropdown-arrow"
              onClick={() => setIsSubDropdownOpen(!isSubDropdownOpen)}
            >
              ▾
            </span>
          </div>
          <div
            className={`dropdown-content subkategori-dropdown ${
              isSubDropdownOpen ? "show" : ""
            }`}
          >
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  setSubKategori(option);
                  setIsSubDropdownOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        <label>Nama Aset</label>
        <input
          type="text"
          name="namaAset"
          value={namaAset}
          onChange={(e) => setNamaAset(e.target.value)}
        />
        <label>Deskripsi Aset</label>
        <input
          type="text"
          name="deskripsiAset"
          value={deskripsiAset}
          onChange={(e) => setDeskripsiAset(e.target.value)}
        />
        <button type="button" className="next-btn active" onClick={handleNext}>
          NEXT
        </button>
      </form>
    </div>
  );
}

export default VerifikasiAset1;
