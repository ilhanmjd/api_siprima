import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../../contexts/AssetContext";
import api from "../../../../api";
import "./Dashboard.css";
// AbortController presence for logout flow
const dinasAbortController = new AbortController();

export default function Dashboard() {
  const navigate = useNavigate();
  const { resetAssetData, loading, error, assets, risks } = useAssetContext();
  const resetAssetDataRef = useRef(resetAssetData);

  useEffect(() => {
    resetAssetDataRef.current = resetAssetData;
  }, [resetAssetData]);

  useEffect(() => {
    resetAssetDataRef.current();
  }, []);

  const handleInputClick = (title, btn) => {
    if (title === "ASSET") {
      if (btn === "Input") {
        navigate("/AsetInput1");
      } else if (btn === "Hapus") {
        navigate("/PenghapusanAset");
      }
    } else if (title === "RISK") {
      navigate("/DashboardRisk");
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    } catch (err) {
      // Still clear localStorage and navigate even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar-dashboard">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span className="active" onClick={() => navigate("/Dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/service-desk")}>Requests</span>
          <span onClick={() => navigate("/laporan")}>Laporan</span>
          <span onClick={() => navigate("/faq")}>FAQ</span>
        </div>
        <div className="navbar-right">
          <div
            className="icon"
            onClick={() => navigate("/notifikasi-user-dinas")}
          >
            🔔
          </div>
          <div
            className="icon"
            onClick={handleLogout}
          >
            <img src="/logout.png" alt="Logout" className="logo" />
          </div>
          
        </div>
      </nav>

      {/* Content */}
      <div className="content">
        <h1 className="title">Dashboard</h1>

        {/* Top Cards */}
        <div className="card-row">
          {[
            { title: "ASSET", buttons: ["Input", "Hapus"] },
            { title: "RISK", buttons: ["Input"] },
            { title: "STATUS", buttons: ["Check"] },
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

        {/* Charts Section */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Line Chart</h3>
            <div className="chart-placeholder">
              📈<p>Line Chart (Kosong)</p>
            </div>
          </div>
          <div className="chart-card">
            <h3>Residual Risk</h3>
            <div className="chart-placeholder">
              🥧<p>Residual Risk (Kosong)</p>
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
                { name: "Asset Laptop", status: "Ditangani" },
                { name: "Asset Komputer", status: "Proses" },
                { name: "Data Cloud", status: "Proses" },
                { name: "Router", status: "Ditangani" },
                { name: "Microsoft Office", status: "Ditangani" },
              ].map((item, i) => (
                <div className="risk-item" key={i}>
                  <span>💼 {item.name}</span>
                  <button
                    className={`status-btn ${
                      item.status === "Ditangani" ? "done" : "process"
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
