import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api.js";
import "./VerifikasiRisiko1.css";

function VerifikasiRisiko1() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetData, updateAssetData } = useAssetContext();

  useEffect(() => {
    const fetchRiskData = async () => {
      const id = location.state?.id;
      if (id) {
        try {
          const res = await api.getRiskById(id);
          const risk = res?.data?.data ?? res?.data;
          if (risk) {
            updateAssetData({
              idAset: risk.asset_id || "",
              judulRisiko: risk.judul || "",
              deskripsiRisiko: risk.deskripsi || "",
              penyebab: risk.penyebab || "",
              dampak: risk.dampak || "",
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

  const handleNext = () => {
    const id = location.state?.id;
    navigate("/VerifikasiRisiko2", { state: { id } });
  };

  const handleBack = () => {
    navigate("/notifikasi-verifikator-risiko");
  };

  const allFilled =
    assetData.idAset &&
    assetData.judulRisiko &&
    assetData.deskripsiRisiko &&
    assetData.penyebab &&
    assetData.dampak;

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
          <div className="icon-box inactive-bg">
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
        <label>ID Aset</label>
        <input
          type="text"
          name="idAset"
          value={assetData.idAset || ""}
          onChange={handleChange}
        />

        <label>Judul Risiko</label>
        <input
          type="text"
          name="judulRisiko"
          value={assetData.judulRisiko || ""}
          onChange={handleChange}
        />

        <label>Deskripsi Risiko</label>
        <input
          type="text"
          name="deskripsiRisiko"
          value={assetData.deskripsiRisiko || ""}
          onChange={handleChange}
        />

        <label>Penyebab</label>
        <input
          type="text"
          name="penyebab"
          value={assetData.penyebab || ""}
          onChange={handleChange}
        />

        <label>Dampak</label>
        <input
          type="text"
          name="dampak"
          value={assetData.dampak || ""}
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

export default VerifikasiRisiko1;
