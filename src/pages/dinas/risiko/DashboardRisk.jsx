import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import "./DashboardRisk.css";

export default function DashboardRisk() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setError("Gagal memuat daftar aset");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="dashboard-risk-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span onClick={() => navigate("/Dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/service-desk")}>Requests</span>
          <span onClick={() => navigate("/laporan")}>Laporan</span>
          <span onClick={() => navigate("/faq")}>FAQ</span>
        </div>
        <div className="navbar-right">
          <div
            className="icon"
            onClick={() =>
              navigate("/notifikasi-user-dinas")
            }
          >
            🔔
          </div>
        </div>
      </nav>

      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate("/Dashboard")}>
          Dashboard
        </span>{" "}
        {">"} Asset
      </div>

      <div className="content-box">
        <h2 className="content-title">Active Asset List</h2>
        {loading ? (
          <p>Loading assets...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="risk-list">
            {assets.length === 0 ? (
              <p>Tidak ada aset aktif.</p>
            ) : (
              assets.map((asset) => (
                <div className="risk-item" key={asset.id || asset.nama}>
                  <span className="risk-name">{asset.nama}</span>
                  <button
                    className="risk-button"
                    onClick={() => navigate("/InputRisiko1")}
                  >
                    Risiko
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
