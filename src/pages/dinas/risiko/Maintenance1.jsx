import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./Maintenance1.css";

function Maintenance1() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetData, updateAssetData } = useAssetContext();

  const riskTreatmentIdFromLocation = location.state?.id;

  console.log("ID Risk Treatment:", riskTreatmentIdFromLocation);

  useEffect(() => {
    if (riskTreatmentIdFromLocation && assetData.idAset !== riskTreatmentIdFromLocation) {
      updateAssetData({ idAset: riskTreatmentIdFromLocation });
    }
  }, [riskTreatmentIdFromLocation, updateAssetData, assetData.idAset]);

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    navigate("/konfirmasi-input-maintenance");
  };

  const handleBack = () => {
    navigate("/notif-accept-risk-treatment");
  };

  const allFilled =
    assetData.idAset && assetData.alasanPemeliharaan && assetData.buktiLampiran;

  const step1Active = assetData.idAset;
  const connectorActive = assetData.idAset && assetData.alasanPemeliharaan;
  const step2Active =
    assetData.idAset && assetData.alasanPemeliharaan && assetData.buktiLampiran;

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
              src="/identifikasi risiko.png"
              alt="Identifikasi Risiko"
              width="30"
              height="23"
            />
          </div>
          <p>Identifikasi Risiko</p>
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
              src="/Analisis Awal.png"
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
        <label>Id Aset</label>
        <input
          type="text"
          name="idAset"
          value={assetData.idAset || ""}
          onChange={handleChange}
          readOnly={!!riskTreatmentIdFromLocation} // Make read-only if pre-filled from location state
        />

        <label>Alasan Pemeliharaan</label>
        <input
          type="text"
          name="alasanPemeliharaan"
          value={assetData.alasanPemeliharaan || ""}
          onChange={handleChange}
        />

        <label>Bukti Lampiran</label>
        <input
          type="file"
          name="buktiLampiran"
          onChange={(e) =>
            updateAssetData({ buktiLampiran: e.target.files[0] })
          }
        />

        <button
          type="button"
          className={`next-btn ${allFilled ? "active" : "disabled"}`}
          disabled={!allFilled}
          onClick={handleNext}
          style={{ backgroundColor: allFilled ? "#29AE08" : undefined }}
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default Maintenance1;
