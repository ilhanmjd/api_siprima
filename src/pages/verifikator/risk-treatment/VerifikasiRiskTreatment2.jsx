import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api.js";
import "./VerifikasiRiskTreatment2.css";

function VerifikasiRiskTreatment2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetData, updateAssetData } = useAssetContext();

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
    navigate("/VerifikasiRejectRiskTreatment");
  };

  const handleVerify = () => {
    if (allFilled) {
      navigate("/VerifikasiAcceptRiskTreatment");
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
          onChange={handleChange}
        />

        <label>Dampak Akhir</label>
        <input
          type="text"
          name="dampakAkhir"
          value={assetData.dampakAkhir || ""}
          onChange={handleChange}
        />

        <label>Level Residual</label>
        <input
          type="text"
          name="levelResidual"
          value={assetData.levelResidual || ""}
          onChange={handleChange}
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
    </div>
  );
}

export default VerifikasiRiskTreatment2;
