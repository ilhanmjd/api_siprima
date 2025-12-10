import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api.js";
import "./VerifikasiRejectAsset.css";

export default function VerifikasiRejectAsset() {
  const navigate = useNavigate();
  const location = useLocation();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      const id = location.state?.id;
      if (!id) {
        setError("ID asset tidak ditemukan");
        setLoading(false);
        return;
      }
      try {
        const response = await api.getAssetById(id);
        const assetData = response.data.data || response.data;
        setAsset(assetData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching asset:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [location.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span
            onClick={() => navigate("/Dashboard-verifikator")}
            className="active"
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </span>
          <span
            onClick={() => navigate("/notifikasi-verifikator-maintenance")}
            style={{ cursor: "pointer" }}
          >
            Maintenance
          </span>
        </div>
        <div className="navbar-right">
          {/* <div
            className="icon"
          >
            🔔
          </div> */}
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard-verifikator")}>
          Dashboard
        </span>{" "}
        {">"} Notification
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Asset detail panel */}
        <section className="asset-detail">
          <div className="asset-card">
            <div className="asset-header">
              <h3>{asset?.nama || "Nama Aset"}</h3>
              <span className="asset-date">
                {asset?.updated_at
                  ? new Date(asset.updated_at).toLocaleString()
                  : "Tanggal tidak tersedia"}
              </span>
            </div>
            <div className="asset-body">
              <p>
                <b>Sub Kategori:</b>{" "}
                {asset?.subkategori?.nama || "Tidak tersedia"}
              </p>
              <p>
                <b>Kategori Aset:</b>{" "}
                {asset?.kategori?.nama || "Tidak tersedia"}
              </p>
              <p>
                <b>Status Aset:</b> {asset?.status || "Tidak tersedia"}
              </p>
              <p>
                <b>Kondisi Aset:</b> {asset?.kondisi || "Tidak tersedia"}
              </p>
              <p>
                <b>Penanggung Jawab:</b>{" "}
                {asset?.penanggungjawab?.nama || "Tidak tersedia"}
              </p>
              <p>
                <b>Lokasi:</b> {asset?.lokasi?.nama || "Tidak tersedia"}
              </p>
              <p>
                <b>Alasan ditolak:</b>{" "}
                {asset?.alasan_ditolak || "Tidak tersedia"}
              </p>
            </div>
          </div>

          {/* <button
            className="risk-btn"
            onClick={() => navigate("/InputRisiko1")}
          >
            Risiko
          </button> */}
        </section>
      </div>
    </div>
  );
}
