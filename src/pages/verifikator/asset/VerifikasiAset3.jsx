import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api.js";
import "./VerifikasiAset3.css";

function VerifikasiAset3() {
  const navigate = useNavigate();
  const location = useLocation();
  const [penanggungJawab, setPenanggungJawab] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [status, setStatus] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isLokasiDropdownOpen, setIsLokasiDropdownOpen] = useState(false);
  const [lokasiFilter, setLokasiFilter] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lokasiOptions = [
    "Kantor Dinkes Lt.2",
    "Gudang Diskominfo",
    "Ruang Administrasi",
    "Ruang Staf",
    "Ruang TU",
    "Ruang Server Diskominfo",
    "Ruang Rapat Besar",
    "Kantor Kecamatan Sukamaju",
    "Ruang Pelayanan Publik",
    "Ruang Bendahara",
    "Ruang Keuangan",
    "Ruang Arsip",
    "Ruang Kepala Dinas",
    "Ruang IT Support",
    "Kantor Walikota Lt.1",
    "Ruang Sekretariat",
    "Ruang Rapat Utama",
    "Ruang Operator Server",
    "Gudang Aset Lama",
    "Kantor Kelurahan Mekar Jaya",
    "Ruang Pelayanan Kelurahan",
    "Ruang Lurah",
    "Kantor UPT Data Center",
    "Ruang Backup Server",
    "Ruang CCTV Monitoring",
    "Ruang Helpdesk IT",
    "Kantor Dinas Pendidikan",
    "Ruang Guru Digital",
    "Laboratorium Komputer",
    "Ruang Evaluasi",
    "Kantor Dinas Pertanian",
    "Ruang Penyuluhan",
    "Gudang Alat Pertanian",
    "Kantor Dinas Perhubungan",
    "Pos Pengawasan Lalu Lintas",
    "Kantor Dinas Koperasi",
    "Ruang UMKM Center",
    "Kantor Dinas Sosial",
    "Ruang Pelayanan Bantuan",
    "Kantor Diskominfo Lt.3.",
  ];

  const filteredLokasiOptions = lokasiOptions.filter((option) =>
    option.toLowerCase().includes(lokasiFilter.toLowerCase())
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
        const assetData = response.data.data || response.data;
        setPenanggungJawab(assetData.penanggungjawab?.nama || "");
        setLokasi(assetData.lokasi?.nama || "");
        setStatus(assetData.status || "");
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
    navigate("/VerifikasiAset2", { state: { id } });
  };
  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleVerify = async () => {
    const id = location.state?.id;
    if (!id) {
      setError("ID asset tidak ditemukan");
      return;
    }
    try {
      await api.updateAsset(id, { status: "diterima" });
      navigate("/VerifikasiAcceptAsset", { state: { id } });
    } catch (err) {
      setError(err.message);
      console.error("Error updating asset:", err);
    }
  };

  const handleStatusSelectChange = (value) => {
    setStatus(value);
    setIsStatusDropdownOpen(false);
  };

  const handleLokasiSelectChange = (value) => {
    setLokasi(value);
    setIsLokasiDropdownOpen(false);
  };

  const handleLokasiInputChange = (e) => {
    const value = e.target.value;
    setLokasi(value);
    setLokasiFilter(value);
    setIsLokasiDropdownOpen(true);
  };

  const handleRejectCancel = () => {
    setIsRejectModalOpen(false);
    setRejectReason("");
  };

  const handleRejectSubmit = () => {
    // Here you can handle the rejection reason, e.g., send to API
    setIsRejectModalOpen(false);
    setRejectReason("");
    navigate("/VerifikasiRejectAsset");
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
          <div className="icon-box active-bg">
            <img
              src="/Penanggung%20Jawab%20putih.png"
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
        <label>Penanggung Jawab</label>
        <input
          type="text"
          name="penanggungJawab"
          value={penanggungJawab}
          readOnly
          disabled
        />

        <label>Lokasi</label>
        <div className="dropdown">
          <div className="text-dropdown-container">
            <input
              type="text"
              className="dropdown-input"
              value={lokasi}
              readOnly
              disabled
              placeholder="Pilih atau ketik Lokasi"
            />
            <span className="dropdown-arrow" style={{ opacity: 0.5 }}>
              ▾
            </span>
          </div>
        </div>

        <label>Status</label>
        <div className="dropdown">
          <button type="button" className="dropdown-btn" disabled>
            {status || "Pilih Status"} <span>▾</span>
          </button>
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
            className="next-btn"
            style={{
              backgroundColor: "#FF0004",
            }}
            onClick={handleReject}
          >
            REJECT
          </button>

          <button
            type="button"
            className="next-btn active"
            onClick={handleVerify}
            style={{ backgroundColor: "#29AE08" }}
          >
            VERIFIKASI
          </button>
        </div>
      </form>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Alasan Ditolak:</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="tulis alasan ditolak!!!"
              rows="4"
              cols="50"
            />
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleRejectCancel}>
                Cancel
              </button>
              <button className="submit-btn" onClick={handleRejectSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifikasiAset3;
