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

  useEffect(() => {
    const fetchAsset = async () => {
      const id = location.state?.id;
      if (id) {
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
          console.error("Error fetching asset:", err);
        }
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
          readOnly
          disabled
        />

        <label>Nilai Perolehan Aset</label>
        <input
          type="number"
          name="nilaiPerolehan"
          value={nilaiPerolehan}
          readOnly
          disabled
        />

        <label>Kondisi Aset</label>
        <div className="dropdown">
          <button type="button" className="dropdown-btn" disabled>
            {kondisiAset || "Pilih Kondisi"} <span>▾</span>
          </button>
        </div>

        <label>Lampiran Bukti (PNG/PDF)</label>
        <div className="container">
          {doc && (
            <div className="existing-file">
              <p>
                File saat ini:{" "}
                <a href={doc} target="_blank" rel="noopener noreferrer">
                  {doc.split("/").pop()}
                </a>
              </p>
            </div>
          )}
          <input type="file" id="file" accept=".png,.pdf" disabled />
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
