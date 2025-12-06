import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./Dashboard-verifikator.css";

export default function DashboardVerifikator() {
  const navigate = useNavigate();
  const { resetAssetData, loading, error, assets, risks } = useAssetContext();
  const hasReset = useRef(false);

  useEffect(() => {
    if (hasReset.current) return;
    resetAssetData();
    hasReset.current = true;
  }, [resetAssetData]);

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear localStorage and navigate even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    }
  };

  const handleInputClick = (title, btn) => {
    if (title === "ASSET") {
      if (btn === "Verifikasi") {
        navigate("/notifikasi-verifikator-aset");
      } else if (btn === "Hapus") {
        navigate("/Notifikasi-verifikator-penghapusan-aset");
      }
    } else if (title === "RISK") {
      navigate("/notifikasi-verifikator-risiko");
    } else if (title === "RISK TREATMENT") {
      navigate("/notifikasi-verifikator-risk-treatment");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        
        <div className="navbar-center">
          <span className="active" onClick={() => navigate("/Dashboard")}>
            Dashboard
          </span>
          <span onClick={() => navigate("/notifikasi-verifikator-maintenance")}>Maintenance</span>
        </div>
        <div className="navbar-right">
          {/* <div
            className="icon"
            // onClick={() => navigate("/notifikasi-verifikator-aset")}
          >
            🔔
          </div> */}
          <div className="icon" onClick={handleLogout}><img src="/logout.png" alt="Logout" className="logo" /></div>
        </div>
      </nav>

      {/* Content */}
      <div className="content">
        <h1 className="title">Dashboard Verifikator</h1>

        {/* Top Cards */}
        <div className="card-row">
          {[
            { title: "ASSET", buttons: ["Verifikasi", "Hapus"] },
            { title: "RISK TREATMENT", buttons: ["Verifikasi"] },
            { title: "RISK", buttons: ["Verifikasi"] },
          ].map((item, i) => (
            <div className="main-card" key={i}>
              <h2>{item.title}</h2>
              <div className="button-row">
                {item.buttons.map((btn, j) => (
                  <button
                    className="yellow-btn"
                    key={j}
                    onClick={() => handleInputClick(item.title, btn)}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <h2 className="subtitle">Actions</h2>
        <div className="actions-row">
          {[
            "ASSET AKTIF",
            "MAINTENANCE",
            "END OF LIFE",
            "ASSET BERMASALAH",
          ].map((item, i) => (
            <button className="action-btn" key={i}>
              {item}
            </button>
          ))}
        </div>

        {/* Charts Section */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Verification Stats</h3>
            <div className="chart-placeholder">
              📈<p>Verification Stats (Kosong)</p>
            </div>
          </div>
          <div className="chart-card">
            <h3>Pending Verifications</h3>
            <div className="chart-placeholder">
              🥧<p>Pending Verifications (Kosong)</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Risiko Prioritas</h3>
            <div className="chart-placeholder">
              📊<p>Risiko Prioritas (Kosong)</p>
            </div>
          </div>

          <div className="chart-card">
            <h3>Penanganan Risiko</h3>
            <div className="risk-list">
              {[
                { name: "Asset Laptop", status: "Verified" },
                { name: "Asset Komputer", status: "Pending" },
                { name: "Data Cloud", status: "Pending" },
                { name: "Router", status: "Verified" },
                { name: "Microsoft Office", status: "Verified" },
              ].map((item, i) => (
                <div className="risk-item" key={i}>
                  <span>💼 {item.name}</span>
                  <button
                    className={`status-btn ${
                      item.status === "Verified" ? "done" : "process"
                    }`}
                  >
                    {item.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
