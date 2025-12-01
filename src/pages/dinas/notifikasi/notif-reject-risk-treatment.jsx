import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./notif-reject-risk-treatment.css";

export default function NotifRejectRiskTreatment() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Asset");
  const [assetList, setAssetList] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API calls by setting empty arrays
    setAssetList([]);
    setRiskList([]);
    setMaintenanceList([]);
    setLoading(false);
  }, []);

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span className="active" onClick={() => navigate("/Dashboard")}>
            Dashboard
          </span>
          <span onClick={() => navigate("/service-desk")}>Requests</span>
          <span onClick={() => navigate("/faq")}>FAQ</span>
        </div>
        <div className="navbar-right">
          <div
            className="icon"
            onClick={() => navigate("/notifikasi-user-dinas")}
          >
            🔔
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard")}>Dashboard</span> {">"}{" "}
        Notification
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div
            className="dropdown-container"
            style={{
              marginBottom: "22.5px",
              textAlign: "left",
              animation: "fadeInUp 0.5s ease-out",
              fontSize: "12px",
            }}
          >
            <label
              htmlFor="category-select"
              style={{
                fontWeight: "500",
                color: "#111",
                marginBottom: "6px",
                display: "block",
                animation: "fadeIn 0.3s ease-out 0.2s both",
                fontSize: "12px",
              }}
            >
              Pilih Kategori:
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "9px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                fontSize: "12px",
                color: "#374151",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                width: "150px",
                animation: "slideInLeft 0.5s ease-out 0.4s both",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                e.target.style.transform = "scale(1.02)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                e.target.style.transform = "scale(1)";
              }}
            >
              <option value="Asset">Asset</option>
              <option value="Risk">Risk</option>
              <option value="Risk Treatment">Risk Treatment</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Penghapusan Aset">Penghapusan Aset</option>
            </select>
          </div>
          {selectedCategory === "Asset" && (
            <div className="aset-list">
              {loading ? (
                <p>Loading...</p>
              ) : (
                assetList.map((asset) => (
                  <div
                    key={asset.id}
                    className="aset-item"
                    style={{ backgroundColor: "#9C9C9C" }}
                  >
                    <span className="aset-name" style={{ color: "black" }}>
                      {asset.nama}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
          {selectedCategory === "Risk" && (
            <div className="aset-list" style={{ fontSize: "12px" }}>
              {loading ? (
                <p style={{ fontSize: "12px" }}>Loading...</p>
              ) : (
                riskList.map((risk) => (
                  <div
                    key={risk.id}
                    className="aset-item"
                    style={{ fontSize: "12px", backgroundColor: "#9C9C9C" }}
                  >
                    <span
                      className="aset-name"
                      style={{ fontSize: "12px", color: "black" }}
                    >
                      {risk.judul}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
          {selectedCategory === "Risk Treatment" && (
            <div className="aset-list" style={{ fontSize: "12px" }}>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#9C9C9C" }}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "black" }}
                >
                  Aset Laptop
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#0845C9" }}
                onClick={() => navigate("/notif-accept-risk-treatment")}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Aset Komputer
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#FF0004" }}
                onClick={() => navigate("/notif-reject-risk-treatment")}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Data Cloud
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#FF0004" }}
                onClick={() => navigate("/notif-reject-risk-treatment")}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Server
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#0845C9" }}
                onClick={() => navigate("/notif-accept-risk-treatment")}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Microsoft Office
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#9C9C9C" }}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "black" }}
                >
                  Router
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#FF0004" }}
                onClick={() => navigate("/notif-reject-risk-treatment")}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Printer
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#0845C9" }}
                onClick={() => navigate("/notif-accept-risk-treatment")}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Firewall
                </span>
              </div>
            </div>
          )}
          {selectedCategory === "Penghapusan Aset" && (
            <div className="aset-list" style={{ fontSize: "12px" }}>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#9C9C9C" }}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "black" }}
                >
                  Aset Laptop
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#0845C9" }}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Aset Komputer
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#FF0004" }}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Data Cloud
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#FF0004" }}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Server
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#0845C9" }}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Microsoft Office
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#9C9C9C" }}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "black" }}
                >
                  Router
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#FF0004" }}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Printer
                </span>
              </div>
              <div
                className="aset-item"
                style={{ fontSize: "12px", backgroundColor: "#0845C9" }}
              >
                <span
                  className="aset-name"
                  style={{ fontSize: "12px", color: "white" }}
                >
                  Firewall
                </span>
              </div>
            </div>
          )}
        </aside>

        {/* Asset detail panel */}
        <section className="asset-detail">
          <div className="asset-card">
            <div className="asset-header">
              <h3>Aset Laptop</h3>
              <span className="asset-date">10/10/2025 - 17:23:34 PM</span>
            </div>
            <div className="asset-body">
              <p>
                <b>Asset-Risiko</b> :{" "}
              </p>
              <p>
                <b>Strategi</b> :{" "}
              </p>
              <p>
                <b>Pengendalian</b> :{" "}
              </p>
              <p>
                <b>Person in Change</b> :{" "}
              </p>
              <p>
                <b>Biaya:</b> :{" "}
              </p>
              <p>
                <b>P × D</b> :{" "}
              </p>
              <p>
                <b>Alasan ditolak</b> :{" "}
              </p>
            </div>
          </div>

          <button
            className="aset-btn"
            onClick={() => navigate("/RiskTreatment1")}
          >
            Input Risk Treatment
          </button>
        </section>
      </div>
    </div>
  );
}
