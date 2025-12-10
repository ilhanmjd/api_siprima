import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api.js";
import "./VerifikasiRisiko2.css";

function VerifikasiRisiko2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetData, updateAssetData } = useAssetContext();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const fetchRiskData = async () => {
      const id = location.state?.id;
      if (id) {
        try {
          const res = await api.getRiskById(id);
          const risk = res?.data?.data ?? res?.data;
          if (risk) {
            updateAssetData({
              idRisiko: risk.id || "",
              probabilitas: risk.probabilitas || "",
              nilaiDampak: risk.nilai_dampak || "",
              levelRisiko: risk.level_risiko || "",
              kriteria: risk.kriteria || "",
              prioritas: risk.prioritas || "",
              status: risk.status || "",
            });
          }
        } catch (error) {
          console.error("Error fetching risk data:", error);
        }
      }
    };

    fetchRiskData();
  }, [location.state, updateAssetData]);

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate("/VerifikasiRisiko1");
  };
  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleRejectCancel = () => {
    setIsRejectModalOpen(false);
    setRejectReason("");
  };
  const handleRejectSubmit = () => {
    // Here you can handle the rejection reason, e.g., send to API
    setIsRejectModalOpen(false);
    setRejectReason("");
    navigate("/VerifikasiRejectRisiko");
  };

  const handleVerify = async () => {
    if (allFilled) {
      try {
        await api.approveRisk(assetData.idRisiko);
        updateAssetData({ status: "diterima" });
        navigate("/VerifikasiAcceptRisiko", {
          state: { id: assetData.idRisiko },
        });
      } catch (error) {
        console.error("Error approving risk:", error);
        alert(
          "Terjadi kesalahan saat memverifikasi risiko. Silakan coba lagi."
        );
      }
    } else {
      alert("Harap isi semua field");
    }
  };

  const allFilled =
    assetData.idRisiko &&
    assetData.probabilitas &&
    assetData.nilaiDampak &&
    assetData.levelRisiko &&
    assetData.kriteria &&
    assetData.prioritas &&
    assetData.status;

  return (
    <div className="asset-container">
      {/* === PROGRESS BAR === */}
      <div className="progress-wrapper">
        {/* Step 1 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img
              src="/identifikasi risiko.png"
              alt="Identifikasi Risiko"
              width="30"
              height="23"
            />
          </div>
          <p>Identifikasi Risiko</p>
        </div>

        {/* Connector 1 */}
        <div className="connector active-connector"></div>

        {/* Step 2 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img
              src="/Analisis Awal2.png"
              alt="Analisis Awal"
              width="20"
              height="23"
            />
          </div>
          <p>Analisis Awal</p>
        </div>
      </div>

      {/* === FORM === */}
      <form className="asset-form">
        <label>Probabilitas</label>
        <input
          type="text"
          name="probabilitas"
          value={assetData.probabilitas || ""}
          readOnly
          disabled
        />

        <label>Nilai Dampak</label>
        <input
          type="text"
          name="nilaiDampak"
          value={assetData.nilaiDampak || ""}
          readOnly
          disabled
        />

        <label>Level Risiko</label>
        <input
          type="text"
          name="levelRisiko"
          value={assetData.levelRisiko || ""}
          readOnly
          disabled
        />

        <label>Kriteria</label>
        <input
          type="text"
          name="kriteria"
          value={assetData.kriteria || ""}
          readOnly
          disabled
        />

        <label>Prioritas</label>
        <input
          type="text"
          name="prioritas"
          value={assetData.prioritas || ""}
          readOnly
          disabled
        />

        <label>Status</label>
        <input
          type="text"
          name="status"
          value={assetData.status || ""}
          readOnly
          disabled
        />

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
            style={{ backgroundColor: "#FF0004" }}
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

export default VerifikasiRisiko2;
