import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api.js";
import "./VerifikasiRiskTreatment1.css";

function VerifikasiRiskTreatment1() {
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
            idRisiko: data.risiko_id || "",
            strategi: data.strategi || "",
            pengendalian: data.pengendalian || "",
            penanggungJawab: data.penanggungjawab?.nama || "",
            targetTanggal: data.target_tanggal
              ? data.target_tanggal.split("T")[0]
              : "",
            biaya: data.biaya ? String(data.biaya) : "",
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

  const handleNext = () => {
    const id = location.state?.id;
    navigate("/VerifikasiRiskTreatment2", { state: { id } });
  };

  const handleBack = () => {
    navigate("/notifikasi-verifikator-risk-treatment");
  };

  const allFilled =
    assetData.idRisiko &&
    assetData.strategi &&
    assetData.pengendalian &&
    assetData.penanggungJawab &&
    assetData.targetTanggal &&
    assetData.biaya;

  return (
    <div className="asset-container">
      <button className="back-btn" onClick={handleBack}>
        <img src="/kembali.png" alt="Kembali" width="26" height="52" />
      </button>
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
          <div className="icon-box inactive-bg">
            <img
              src="/Residual_Risiko1.png"
              alt="Residual Risiko"
              width="30"
              height="30"
            />
          </div>
          <p>Residual Risiko</p>
        </div>
      </div>

      {/* === FORM === */}
      <form className="asset-form">
        <label>ID Risiko</label>
        <input
          type="text"
          name="idRisiko"
          value={assetData.idRisiko || ""}
          onChange={handleChange}
        />

        <label>Strategi</label>
        <input
          type="text"
          name="strategi"
          value={assetData.strategi || ""}
          onChange={handleChange}
        />

        <label>Pengendalian</label>
        <input
          type="text"
          name="pengendalian"
          value={assetData.pengendalian || ""}
          onChange={handleChange}
        />

        <label>Penanggung Jawab</label>
        <input
          type="text"
          name="penanggungJawab"
          value={assetData.penanggungJawab || ""}
          onChange={handleChange}
        />

        <label>Target Tanggal</label>
        <input
          type="date"
          name="targetTanggal"
          value={assetData.targetTanggal || ""}
          onChange={handleChange}
        />

        <label>Biaya</label>
        <input
          type="text"
          name="biaya"
          value={assetData.biaya || ""}
          onChange={handleChange}
        />

        <button
          type="button"
          className={`next-btn ${allFilled ? "active" : "disabled"}`}
          disabled={!allFilled}
          onClick={handleNext}
        >
          NEXT
        </button>
      </form>
    </div>
  );
}

export default VerifikasiRiskTreatment1;
