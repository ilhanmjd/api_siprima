import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api.js";
import "./VerifikasiMaintenance1.css";

function VerifikasiMaintenance1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [maintenance, setMaintenance] = useState(null);
  const [formData, setFormData] = useState({
    idAset: "",
    alasanPemeliharaan: "",
    buktiLampiran: null,
  });

  useEffect(() => {
    const fetchMaintenance = async () => {
      const id = location.state?.id;
      if (!id) {
        return;
      }
      try {
        const response = await api.getMaintenanceById(id);
        const maintenanceData = response.data.data || response.data;
        setMaintenance(maintenanceData);
        setFormData({
          idAset: maintenanceData.asset?.id || "",
          alasanPemeliharaan: maintenanceData.alasan_pemeliharaan || "",
          buktiLampiran: null, // File input tidak bisa di-pre-fill
        });
        setMaintenance(maintenanceData);
      } catch (err) {
        console.error("Error fetching maintenance:", err);
      }
    };
    fetchMaintenance();
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, buktiLampiran: e.target.files[0] }));
  };

  const handleBack = () => {
    navigate("/notifikasi-verifikator-maintenance");
  };

  const handleReject = () => {
    navigate("/VerifikasiRejectMaintenance", {
      state: { id: maintenance?.id },
    });
  };

  const handleVerify = () => {
    if (allFilled) {
      navigate("/VerifikasiAcceptMaintenance", {
        state: { id: maintenance?.id },
      });
    } else {
      alert("Harap isi semua field");
    }
  };

  const allFilled =
    maintenance && formData.idAset && formData.alasanPemeliharaan;

  const step1Active = formData.idAset;
  const connectorActive = formData.idAset && formData.alasanPemeliharaan;
  const step2Active = formData.idAset && formData.alasanPemeliharaan;

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
              src="/identitas aset.png"
              alt="Id-Nama Asset"
              width="30"
              height="23"
            />
          </div>
          <p>Id-Nama Asset</p>
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
              src="/Pemeliharaan.png"
              alt="Pemeliharaan"
              width="30"
              height="30"
            />
          </div>
          <p>Pemeliharaan</p>
        </div>
      </div>

      {/* === FORM === */}
      {/* === FORM === */}
      <form className="asset-form">
        <label>Id Aset</label>
        <input type="text" name="idAset" value={formData.idAset} readOnly />

        <label>Alasan Pemeliharaan</label>
        <input
          type="text"
          name="alasanPemeliharaan"
          value={formData.alasanPemeliharaan}
          readOnly
        />

        <label>Bukti Lampiran</label>
        {maintenance?.bukti_lampiran && (
          <p>File existing: {maintenance.bukti_lampiran}</p>
        )}

        {/* File input tidak boleh readonly, jadi disable */}
        <input type="file" name="buktiLampiran" disabled />

        <div className="button-group">
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
            className={`next-btn ${allFilled ? "active" : "disabled"}`}
            disabled={false} // <-- selalu bisa ditekan
            onClick={handleVerify}
            style={{ backgroundColor: "#29AE08" }}
          >
            VERIFIKASI
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerifikasiMaintenance1;
