import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifikasiAset2.css";

function VerifikasiAset2() {
  const navigate = useNavigate();
  const [tanggalPerolehan, setTanggalPerolehan] = useState("");
  const [nilaiPerolehan, setNilaiPerolehan] = useState("");
  const [kondisiAset, setKondisiAset] = useState("");
  const [isKondisiDropdownOpen, setIsKondisiDropdownOpen] = useState(false);
  const [doc, setDoc] = useState(null);

  const handleBack = () => {
    navigate("/VerifikasiAset1");
  };

  const handleNext = () => {
    if (allFilled) {
      // Navigasi ke halaman berikutnya jika diperlukan
      navigate("/VerifikasiAset3");
    } else {
      alert("Harap isi semua field");
    }
  };

  const handleKondisiSelectChange = (value) => {
    setKondisiAset(value);
    setIsKondisiDropdownOpen(false);
  };

  const handleFileChange = (e) => {
    setDoc(e.target.files[0]);
  };

  const allFilled = tanggalPerolehan && nilaiPerolehan && kondisiAset && doc;

  return (
    <div className="asset-container">
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
          <div className="icon-box active-bg">
            <img
              src="/detail%20perolehan%20putih.png"
              alt="Detail Perolehan"
              width="20"
              height="23"
            />
          </div>
          <p>Detail Perolehan</p>
        </div>
        <div className="connector active-connector"></div>
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
        <label>Tanggal perolehan aset</label>
        <input
          type="date"
          name="tanggalPerolehan"
          value={tanggalPerolehan}
          onChange={(e) => setTanggalPerolehan(e.target.value)}
        />
        <label>Nilai Perolehan Aset</label>
        <input
          type="number"
          name="nilaiPerolehan"
          value={nilaiPerolehan}
          onChange={(e) => setNilaiPerolehan(e.target.value)}
        />
        <label>Kondisi Aset</label>
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => setIsKondisiDropdownOpen(!isKondisiDropdownOpen)}
          >
            {kondisiAset || "Pilih Kondisi"} <span>▼</span>
          </button>
          <div
            className={`dropdown-content ${
              isKondisiDropdownOpen ? "show" : ""
            }`}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleKondisiSelectChange("Baik");
              }}
            >
              Baik
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleKondisiSelectChange("Sedang");
              }}
            >
              Sedang
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleKondisiSelectChange("Buruk");
              }}
            >
              Buruk
            </a>
          </div>
        </div>
        <label>Lampiran Bukti (PNG/PDF)</label>
        <div className="container">
          <input
            type="file"
            id="file"
            accept=".png,.pdf"
            onChange={handleFileChange}
          />
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
            onClick={() => navigate("/VerifikasiAset3")}
          >
            NEXT
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerifikasiAset2;
