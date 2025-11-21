import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./VerifikasiMaintenance1.css";

function VerifikasiMaintenance1() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate("/notifikasi-verifikator-maintenance");
  };
  const handleReject = () => {
    navigate("/VerifikasiRejectMaintenance");
  };

  const handleVerify = () => {
    if (allFilled) {
      navigate("/VerifikasiAcceptMaintenance");
    } else {
      alert("Harap isi semua field");
    }
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
      <form className="asset-form">
        <label>Id Aset</label>
        <input
          type="text"
          name="idAset"
          value={assetData.idAset || ""}
          onChange={handleChange}
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

export default VerifikasiMaintenance1;
