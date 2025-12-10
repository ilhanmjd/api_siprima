import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api.js";
import "./VerifikasiRiskTreatment2.css";

function VerifikasiRiskTreatment2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetData, updateAssetData } = useAssetContext();

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const fetchRiskTreatment = async () => {
      const id = location.state?.id;
      if (id) {
        try {
          const response = await api.getRiskTreatmentById(id);
          const data = response.data.data || response.data;
          updateAssetData({
            probabilitasAkhir: data.probabilitas_akhir || "",
            dampakAkhir: data.dampak_akhir || "",
            levelResidual: data.level_residual || "",
          });
        } catch (error) {
          console.error("Error fetching risk treatment:", error);
        }
      }
    };

    fetchRiskTreatment();
  }, [location.state, updateAssetData]);

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate("/VerifikasiRiskTreatment1");
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
        await api.rejectRiskTreatment(id, { reason: rejectReason });
        navigate("/VerifikasiRejectRiskTreatment");
      } catch (error) {
        console.error("Error rejecting risk treatment:", error);
        alert("Terjadi kesalahan saat menolak risk treatment");
      }
    } else {
      alert("Harap isi alasan penolakan");
    }
  };

  const handleVerify = async () => {
    if (allFilled) {
      const id = location.state?.id;
      if (id) {
        try {
          await api.approveRiskTreatment(id);
          navigate("/VerifikasiAcceptRiskTreatment", { state: { id } });
        } catch (error) {
          console.error("Error approving risk treatment:", error);
          alert("Terjadi kesalahan saat menyetujui risk treatment");
        }
      } else {
        alert("ID Risk Treatment tidak ditemukan");
      }
    } else {
      alert("Harap isi semua field");
    }
  };

  const allFilled =
    assetData.probabilitasAkhir &&
    assetData.dampakAkhir &&
    assetData.levelResidual;

  return (
    <div className="asset-container">
      {/* === PROGRESS BAR === */}
      <div className="progress-wrapper">
        {/* Step 1 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img
              src="/Rencana_Perlakuan.png"
              alt="Rencana Perlakuan"
              width="30"
              height="30"
            />
          </div>
          <p>Rencana Perlakuan</p>
        </div>

        {/* Connector 1 */}
        <div className="connector active-connector"></div>

        {/* Step 2 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img
              src="/Residual_Risiko2.png"
              alt="ResidualRisiko"
              width="30"
              height="30"
            />
          </div>
          <p>ResidualRisiko</p>
        </div>
      </div>

      {/* === FORM === */}
      <form className="asset-form">
        <label>Probabilitas Akhir</label>
        <input
          type="text"
          name="probabilitasAkhir"
          value={assetData.probabilitasAkhir || ""}
          readOnly
          disabled
        />

        <label>Dampak Akhir</label>
        <input
          type="text"
          name="dampakAkhir"
          value={assetData.dampakAkhir || ""}
          readOnly
          disabled
        />

        <label>Level Residual</label>
        <input
          type="text"
          name="levelResidual"
          value={assetData.levelResidual || ""}
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

export default VerifikasiRiskTreatment2;
