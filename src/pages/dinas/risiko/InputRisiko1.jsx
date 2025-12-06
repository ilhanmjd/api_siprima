import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./InputRisiko1.css";

function InputRisiko1() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.getAssets();
        const data = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        const filteredAssets = data.filter((asset) => {
          const status = (asset.status || "").toLowerCase();
          return status !== "pending" && status !== "ditolak";
        });
        setAssets(filteredAssets);
      } catch (err) {
        setError("Gagal memuat data aset");
      } finally {
        setLoadingAssets(false);
      }
    };

    fetchAssets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "asset_id") {
      updateAssetData({ asset_id: value });
      return;
    }
    updateAssetData({ [name]: value });
  };

  const handleNext = () => {
    navigate("/InputRisiko2");
  };

  const handleBack = () => {
    navigate("/DashboardRisk");
  };

  const allFilled =
    assetData.asset_id &&
    assetData.judul &&
    assetData.deskripsi &&
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
        <select
          name="asset_id"
          value={assetData.asset_id?.toString() || ""}
          onChange={handleChange}
          disabled={loadingAssets || assets.length === 0}
        >
          <option value="">
            {loadingAssets ? "Memuat aset..." : "Pilih ID aset"}
          </option>
          {assets.map((asset) => {
            const id = (asset.id || asset.asset_id)?.toString() || "";
            const name = asset.nama || asset.nama_aset || "Aset";
            return (
              <option key={id} value={id}>
                {`${id} (${name})`}
              </option>
            );
          })}
        </select>
        {error && <p className="asset-error">{error}</p>}

        <label>Judul Risiko</label>
        <input
          type="text"
          name="judul"
          value={assetData.judul || ""}
          onChange={handleChange}
        />

        <label>Deskripsi Risiko</label>
        <input
          type="text"
          name="deskripsi"
          value={assetData.deskripsi || ""}
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

export default InputRisiko1;
