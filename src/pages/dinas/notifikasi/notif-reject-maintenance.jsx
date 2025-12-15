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
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  

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

      <div className="main-content">
        <aside className="sidebar">
          <div className="dropdown-container">
            <label htmlFor="category-select" className="dropdown-label">
              Pilih Kategori:
            </label>

            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="dropdown-select"
            >
              <option value="Asset">Asset</option>
              <option value="Risk">Risk</option>
              <option value="Risk Treatment">Risk Treatment</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          {/* ===================== MAINTENANCE ===================== */}
          {selectedCategory === "Maintenance" && (
            <div className="aset-list">
              {loading ? <p>Loading...</p> :
                maintenanceList.filter(maintenance => maintenance.status_review === "rejected").map((maintenance, index) => {
                  const isSelected = selectedMaintenance && selectedMaintenance.id === maintenance.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-maintenance-reject"
                      style={{
                        backgroundColor: maintenance.status_review === "rejected" ? "#ff3636" : undefined,
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedMaintenance(maintenance)}
                    >
                      <span className="aset-name">Maintenance {maintenance.asset.nama}</span>
                    </div>
                  );
                })
              }
            </div>
          )}
        </aside>

        {/* Asset detail panel */}
        <section className="asset-detail">
          <div className="asset-card">
            <div className="asset-header">
              <h3>
                {selectedMaintenance?.asset?.nama || "Maintenance Rejected"}
              </h3>
              <span className="asset-date">
                {selectedMaintenance?.updated_at || ""}
              </span>
            </div>
            <div className="asset-body">
              <p>
                <b>Id Aset:</b>{" "}
                {selectedMaintenance && selectedMaintenance.asset
                  ? `${selectedMaintenance.asset.id} - ${selectedMaintenance.asset.nama}`
                  : ""}
              </p>
              <p>
                <b>Alasan Pemeliharaan:</b>{" "}
                {selectedMaintenance?.alasan_pemeliharaan || ""}
              </p>
              <p>
                <b>Catatan Maintenance:</b>{" "}
                {selectedMaintenance?.risk?.deskripsi || ""}
              </p>
              <p>
                <b className="status-rejected">Status Pengajuan : DITOLAK</b>
              </p>
              <p>
                <b>Alasan:</b> {selectedMaintenance?.alasan_ditolak || ""}
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
