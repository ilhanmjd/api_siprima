import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api.js";
import "./VerifikatorPenghapusanAset.css";

function PenghapusanAset() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetData, updateAssetData } = useAssetContext();

  useEffect(() => {
    const fetchAssetDeletion = async () => {
      const id = location.state?.id;
      if (id) {
        try {
          const response = await api.getAssetDeletionById(id);
          const data = response.data.data || response.data;
          updateAssetData({
            idAset: data.asset_id || "",
            alasanPenghapusan: data.alasan_penghapusan || "",
            lampiran: data.lampiran || null,
          });
        } catch (error) {
          console.error("Error fetching asset deletion:", error);
        }
      }
    };
    fetchAssetDeletion();
  }, [location.state, updateAssetData]);

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = () => {
    // Logika untuk submit penghapusan aset
    // Navigasi ke halaman konfirmasi penghapusan aset
    navigate("/Konfirmasi-PenghapusanAset");
  };

  const handleBack = () => {
    navigate("/Notifikasi-verifikator-penghapusan-aset");
  };
  const handleReject = () => {
    navigate("/verifikasi-reject-penghapusan-aset");
  };

  const handleVerify = () => {
    if (allFilled) {
      const id = location.state?.id;
      navigate("/verifikasi-accept-penghapusan-aset", { state: { id } });
    } else {
      alert("Harap isi semua field");
    }
  };

  const step1Active = assetData.idAset;
  const connectorActive = assetData.idAset && assetData.alasanPenghapusan;
  const step2Active =
    assetData.idAset && assetData.alasanPenghapusan && assetData.lampiran;

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
              src="/identitas aset.png"
              alt="Identitas Aset"
              width="30"
              height="23"
            />
          </div>
          <p>Identitas Aset</p>
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
              src="/Penghapusan_Aset.png"
              alt="Penghapusan Aset"
              width="30"
              height="30"
            />
          </div>
          <p>Penghapusan Aset</p>
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
        <input
          type="text"
          name="idAset"
          value={assetData.idAset || ""}
          onChange={handleChange}
          required
        />

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
            disabled={!allFilled}
            onClick={handleVerify}
            style={{ backgroundColor: allFilled ? "#29AE08" : undefined }}
          >
            VERIFIKASI
          </button>
        </div>
      </form>
    </div>
  );
}

export default PenghapusanAset;
