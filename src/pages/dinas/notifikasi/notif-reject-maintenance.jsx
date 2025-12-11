import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import "./notif-reject-maintenance.css";

export default function NotifRejectMaintenance() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Maintenance");
  const [assetList, setAssetList] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = useCallback(
    (value) => {
      setSelectedCategory(value);
      if (value === "Asset") navigate("/notif-reject-aset");
      else if (value === "Risk") navigate("/notif-reject-risk");
      else if (value === "Risk Treatment") navigate("/notif-reject-risk-treatment");
      else if (value === "Maintenance") navigate("/notif-reject-maintenance");
      else if (value === "Penghapusan Aset") navigate("/notif-reject-penghapusan-aset");
    },
    [navigate]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const maintenancesRes = await api.getMaintenances();
        const maintenanceData = Array.isArray(maintenancesRes?.data?.data)
          ? maintenancesRes.data.data
          : Array.isArray(maintenancesRes?.data)
          ? maintenancesRes.data
          : [];

        const rejectedMaintenances = maintenanceData.filter(
          (m) => m.status_review === "rejected"
        );
        setMaintenanceList(rejectedMaintenances);
      } catch (error) {
        setMaintenanceList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page-wrapper">
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
              onChange={(e) => handleCategoryChange(e.target.value)}
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
            </select>
          </div>
        </aside>
          {/* ===================== RISK TREATMENT ===================== */}
          {selectedCategory === "Maintenance" && (
            <div className="aset-list">
              {loading ? (
                <p>Loading...</p>
              ) : (
                riskList.map((risk) => (
                  <div
                    key={risk.id}
                    className="aset-item-page-reject"
                    style={{ backgroundColor: "#ff3636", cursor: "pointer" }}
                    onClick={() => handleRiskTreatmentClick(risk)}
                  >
                    <span className="aset-name">{risk.risk?.judul || risk.nama || `Risk Treatment ${risk.id}`}</span>
                  </div>
                ))
              )}
            </div>
          )}

        {/* Asset detail panel */}
        <section className="asset-detail">
          <div className="asset-card">
            <div className="asset-header">
              <h3>Aset Laptop</h3>
              <span className="asset-date">10/10/2025 - 17:23:34 PM</span>
            </div>
            <div className="asset-body">
              <p>
                <b>Id Aset:</b>
              </p>
              <p>
                <b>Alasan Pemeliharaan:</b>
              </p>
              <p>
                <b>Catatan Maintenance:</b>
              </p>
              <p>
                <b className="status-rejected">Status Pengajuan : DITOLAK</b>
              </p>
              <p>
                <b>Alasan:</b>
              </p>
            </div>
          </div>

          <button
            className="aset-btn"
            onClick={() => navigate("/Maintenance1")}
          >
            Input Maintenance
          </button>
        </section>
      </div>
    </div>
  );
}
