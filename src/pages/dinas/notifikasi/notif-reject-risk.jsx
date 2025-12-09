import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./notif-reject-risk.css";
import api from "../../../api";

export default function NotifikasiRejectRisk() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Risk");
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [riskDetail, setRiskDetail] = useState(null);
  const [assetList, setAssetList] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const sortByUpdatedAtDesc = useCallback(
    (items = []) =>
      [...items].sort(
        (a, b) =>
          new Date(b?.updated_at || b?.updatedAt || 0) -
          new Date(a?.updated_at || a?.updatedAt || 0)
      ),
    []
  );

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
        // Fetch risks, filter rejected, sort by updated_at desc
        const risksRes = await api.getRisks();
        const risksRaw = risksRes?.data?.data ?? risksRes?.data ?? [];
        const rejectedRisks = (Array.isArray(risksRaw) ? risksRaw : []).filter(
          (r) => r?.status === "rejected" || r?.status === "ditolak"
        );
        setRiskList(sortByUpdatedAtDesc(rejectedRisks));
      } catch (error) {
        setRiskList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortByUpdatedAtDesc]);

  const handleRiskClick = async (risk) => {
    setSelectedRisk(risk);
    try {
      const res = await api.getRiskById(risk.id);
      const detail = res?.data?.data ?? res?.data ?? null;
      setRiskDetail(detail);
    } catch (error) {
      setRiskDetail(risk);
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
          
          {/* ===================== RISK ===================== */}
          {selectedCategory === "Risk" && (
            <div className="aset-list">
              {loading ? <p>Loading...</p> :
                riskList
                  .filter((risk) => risk.status !== "pending" && risk.status !== "ditolak")
                  .map((risk, index) => {
                  const isSelected = selectedRisk && selectedRisk.id === risk.id;
                  return (
                    <div
                      key={risk.id ?? index}
                      className="aset-item-page-reject"
                      style={{
                        backgroundColor: risk.status !== "ditolak" && risk.status !== "pending" ? "#ff3636" : undefined,
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => handleRiskClick(risk)}
                    >
                      <span className="aset-name">{risk.judul || risk.nama || `Risk ${risk.id}`}</span>
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
              <h3>{riskDetail?.judul || riskDetail?.nama || "Detail Risk"}</h3>
              <span className="asset-date">
                {riskDetail?.updated_at
                  ? new Date(riskDetail.updated_at).toLocaleString()
                  : ""}
              </span>
            </div>
            <div className="asset-body">
              <p>
                <b>Id Asset :</b>{" "}
                {selectedRisk
                  ? `${selectedRisk.asset?.id ?? selectedRisk.asset_id ?? "-"} - ${
                      selectedRisk.asset?.nama ?? selectedRisk.asset_nama ?? ""
                    }`
                  : ""}
              </p>
              <p>
                <b>Kategori Risiko:</b> {riskDetail?.kriteria || ""}
              </p>
              <p>
                <b>Level Risiko:</b> {riskDetail?.level_risiko || ""}
              </p>
              <p>
                <b>Person in Change:</b> {riskDetail?.penanggungjawab?.nama || ""}
              </p>
              <p>
                <b>Type Risiko:</b> {riskDetail?.kriteria || ""}
              </p>
              <p>
                <b className="status-rejected">Status Pengajuan : DITOLAK</b>
              </p>
              <p>
                <b>Alasan:</b> {riskDetail?.alasan || ""}
              </p>
            </div>
          </div>

          <button
            className="aset-btn"
            onClick={() => navigate("/InputRisiko1")}
          >
            Input Risk
          </button>
        </section>
      </div>
    </div>
  );
}
