import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./notifikasi-user-dinas.css";

const NotifikasiUserDinasRisikoDariVerifikator = ({ assets = [] }) => {
  const navigate = useNavigate();
  const hasAssets = assets.length > 0;
  const [selectedCategory, setSelectedCategory] = useState("Asset");
  const [assetList, setAssetList] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory === "Asset") {
      fetchAssets();
    } else if (selectedCategory === "Risk") {
      fetchRisks();
    } else if (selectedCategory === "Maintenance") {
      fetchMaintenances();
    }
  }, [selectedCategory]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      // API call removed as per plan
      setAssetList([]);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssetList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRisks = async () => {
    setLoading(true);
    try {
      // API call removed as per plan
      setRiskList([]);
    } catch (error) {
      console.error("Error fetching risks:", error);
      setRiskList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenances = async () => {
    setLoading(true);
    try {
      // API call removed as per plan
      setMaintenanceList([]);
    } catch (error) {
      console.error("Error fetching maintenances:", error);
      setMaintenanceList([]);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Form Card */}
      <div className="form-card">
        <div
          className="form-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <img src="/logo.png" alt="icon" className="form-icon" />
          <h1>Notification</h1>
        </div>

        <div className="content-box">
          <h2 className="content-title">Verification</h2>
          <div
            className="dropdown-container"
            style={{
              marginBottom: "30px",
              textAlign: "left",
              animation: "fadeInUp 0.5s ease-out",
            }}
          >
            <label
              htmlFor="category-select"
              style={{
                fontWeight: "500",
                color: "#111",
                marginBottom: "8px",
                display: "block",
                animation: "fadeIn 0.3s ease-out 0.2s both",
              }}
            >
              Pilih Kategori:
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                color: "#374151",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                width: "200px",
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
                  <div key={asset.id} className="aset-item">
                    <span className="aset-name">{asset.nama}</span>
                    <button className="verification-button under-review">
                      UnderReview
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
          {selectedCategory === "Risk" && (
            <div className="aset-list">
              {loading ? (
                <p>Loading...</p>
              ) : (
                riskList.map((risk) => (
                  <div key={risk.id} className="aset-item">
                    <span className="aset-name">{risk.judul}</span>
                    <button className="verification-button under-review">
                      UnderReview
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
          {selectedCategory === "Risk Treatment" && (
            <div className="aset-list">
              <div className="aset-item">
                <span className="aset-name">Aset Laptop</span>
                <button className="verification-button under-review">
                  UnderReview
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Aset Komputer</span>
                <button
                  className="verification-button accepted"
                  onClick={() => navigate("/notif-accept-risk-treatment")}
                >
                  Accepted
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Data Cloud</span>
                <button
                  className="verification-button rejected"
                  onClick={() => navigate("//notif-reject-risk-treatment")}
                >
                  Rejected
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Server</span>
                <button
                  className="verification-button rejected"
                  onClick={() => navigate("/notif-reject-risk-treatment")}
                >
                  Rejected
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Microsoft Office</span>
                <button
                  className="verification-button accepted"
                  onClick={() => navigate("/notif-accept-risk-treatment")}
                >
                  Accepted
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Router</span>
                <button className="verification-button under-review">
                  UnderReview
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Printer</span>
                <button
                  className="verification-button rejected"
                  onClick={() => navigate("/notif-reject-risk-treatment")}
                >
                  Rejected
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Firewall</span>
                <button
                  className="verification-button accepted"
                  onClick={() => navigate("/notif-accept-risk-treatment")}
                >
                  Accepted
                </button>
              </div>
            </div>
          )}
          {selectedCategory === "Maintenance" && (
            <div className="aset-list">
              {loading ? (
                <p>Loading...</p>
              ) : (
                maintenanceList.map((maintenance) => (
                  <div key={maintenance.id} className="aset-item">
                    <span className="aset-name">
                      {maintenance.nama || maintenance.judul}
                    </span>
                    <button className="verification-button under-review">
                      UnderReview
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
          {selectedCategory === "Penghapusan Aset" && (
            <div className="aset-list">
              <div className="aset-item">
                <span className="aset-name">Aset Laptop</span>
                <button className="verification-button under-review">
                  UnderReview
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Aset Komputer</span>
                <button
                  className="verification-button accepted"
                  onClick={() => navigate("/notif-accept-Penghapusan-Aset")}
                >
                  Accepted
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Data Cloud</span>
                <button
                  className="verification-button rejected"
                  onClick={() => navigate("/notif-reject-Penghapusan-Aset")}
                >
                  Rejected
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Server</span>
                <button
                  className="verification-button rejected"
                  onClick={() => navigate("/notif-reject-Penghapusan-Aset")}
                >
                  Rejected
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Microsoft Office</span>
                <button
                  className="verification-button accepted"
                  onClick={() => navigate("/notif-accept-Penghapusan-Aset")}
                >
                  Accepted
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Router</span>
                <button className="verification-button under-review">
                  UnderReview
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Printer</span>
                <button
                  className="verification-button rejected"
                  onClick={() => navigate("/notif-reject-Penghapusan-Aset")}
                >
                  Rejected
                </button>
              </div>
              <div className="aset-item">
                <span className="aset-name">Firewall</span>
                <button
                  className="verification-button accepted"
                  onClick={() => navigate("/notif-accept-Penghapusan-Aset")}
                >
                  Accepted
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotifikasiUserDinasRisikoDariVerifikator;
