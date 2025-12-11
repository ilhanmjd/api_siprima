import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api.js";
import "./VerifikatorPenghapusanAset.css";

function PenghapusanAset() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetData, updateAssetData } = useAssetContext();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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
    setIsRejectModalOpen(true);
  };

  const handleRejectCancel = () => {
    setIsRejectModalOpen(false);
    setRejectReason("");
  };

  const handleRejectSubmit = async () => {
    const id = location.state?.id;
    if (id && rejectReason.trim()) {
      try {
        await api.updateAssetDeletion(id, {
          status: "rejected",
          reject_reason: rejectReason,
        });
        navigate("/verifikasi-reject-penghapusan-aset", { state: { id } });
      } catch (error) {
        console.error("Error rejecting asset deletion:", error);
        alert("Gagal menolak penghapusan aset. Silakan coba lagi.");
      }
    } else {
      alert("Harap isi alasan penolakan.");
    }
  };

  const handleVerify = async () => {
    if (allFilled) {
      const id = location.state?.id;
      if (id) {
        try {
          await api.updateAssetDeletion(id, { status: "accepted" });
          navigate("/verifikasi-accept-penghapusan-aset", { state: { id } });
        } catch (error) {
          console.error("Error updating asset deletion status:", error);
          alert("Gagal memperbarui status. Silakan coba lagi.");
        }
      }
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

export default PenghapusanAset;
