import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api.js";
import "./VerifikasiAset2.css";

function VerifikasiAset2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tanggalPerolehan, setTanggalPerolehan] = useState("");
  const [nilaiPerolehan, setNilaiPerolehan] = useState("");
  const [kondisiAset, setKondisiAset] = useState("");
  const [isKondisiDropdownOpen, setIsKondisiDropdownOpen] = useState(false);
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const assetData = response.data.data || response.data;
        // Format tanggal ke YYYY-MM-DD untuk input type="date"
        const formattedDate = assetData.tgl_perolehan
          ? new Date(assetData.tgl_perolehan).toISOString().split("T")[0]
          : "";
        setTanggalPerolehan(formattedDate);
        setNilaiPerolehan(assetData.nilai_perolehan || "");
        setKondisiAset(assetData.kondisi || "");
        // Jika ada file lampiran, setDoc bisa diatur jika diperlukan
        if (assetData.lampiran_bukti) {
          // Untuk file input, tidak bisa set value langsung, tapi bisa simpan URL atau path
          setDoc(assetData.lampiran_bukti);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching asset:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [location.state]);

  const handleBack = () => {
    const id = location.state?.id;
    navigate("/VerifikasiAset1", { state: { id } });
  };

  const handleNext = () => {
    // Navigasi ke halaman berikutnya dengan id asset
    const id = location.state?.id;
    navigate("/VerifikasiAset3", { state: { id } });
  };

  const handleKondisiSelectChange = (value) => {
    setKondisiAset(value);
    setIsKondisiDropdownOpen(false);
  };

  const handleFileChange = (e) => {
    setDoc(e.target.files[0]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            {kondisiAset || "Pilih Kondisi"} <span>▾</span>
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
          {doc && (
            <div className="existing-file">
              <p>
                File saat ini:{" "}
                {/* Tampilkan sebagai link jika ini adalah URL */}
                <a href={doc} target="_blank" rel="noopener noreferrer">
                  {doc.split("/").pop()}
                </a>
              </p>
            </div>
          )}
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
            className="next-btn active"
            onClick={handleNext}
          >
            NEXT
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerifikasiAset2;
