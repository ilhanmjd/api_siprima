import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./notif-reject-risk-treatment.css";
import api from "../../../api";
import { useAssetContext } from "../../../contexts/AssetContext";

export default function NotifRejectRiskTreatment() {
  const navigate = useNavigate();
  const { updateAssetData } = useAssetContext();
  const [selectedCategory, setSelectedCategory] = useState("Risk Treatment");
  const [riskDetail, setRiskDetail] = useState(null);
  const [assetList, setAssetList] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const formatDateTime = useCallback((value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  }, []);
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
        const res = await api.getRiskTreatments();
        const rtRaw = res?.data?.data ?? res?.data ?? [];
        const rejectedRT = (Array.isArray(rtRaw) ? rtRaw : []).filter(
          (rt) => rt?.status === "rejected" || rt?.status === "ditolak"
        );
        setRiskList(sortByUpdatedAtDesc(rejectedRT));
      } catch (error) {
        setRiskList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortByUpdatedAtDesc]);

  const handleRiskTreatmentClick = async (risk) => {
    try {
      const res = await api.getRiskTreatmentById?.(risk.id) ?? api.getRiskTreatmentById(risk.id);
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
          {/* ===================== RISK TREATMENT ===================== */}
          {selectedCategory === "Risk Treatment" && (
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
        </aside>

        {/* Asset detail panel */}
        <section className="asset-detail">
          <div className="asset-card">
            <div className="asset-header">
              <h3>{riskDetail?.risk?.judul || riskDetail?.judul || " Detail Risk Treatment"}</h3>
              <span className="asset-date">{formatDateTime(riskDetail?.updated_at)}</span>
            </div>
            <div className="asset-body">
              <p>
                <b>Asset-Risiko</b> :{riskDetail?.risk?.asset?.nama || ""} - {riskDetail?.risk?.judul || ""}
              </p>
              <p>
                <b>Strategi</b> :{riskDetail?.strategi || ""}
              </p>
              <p>
                <b>Pengendalian</b> :{riskDetail?.pengendalian || ""}
              </p>
              <p>
                <b>Person in Change</b> :{riskDetail?.penanggungjawab?.nama || ""}
              </p>
              <p>
                <b>Biaya</b> :{riskDetail?.biaya || ""}
              </p>
              <p>
                <b>PxD</b> :{riskDetail?.risk?.level_risiko || ""}
              </p>
              <p>
                <b>Alasan ditolak</b> :{" "}
              </p>
            </div>
          </div>

          <button
            className="aset-btn"
            onClick={() => {
              if (riskDetail && riskDetail.id) {
                updateAssetData({ riskTreatmentId: riskDetail.id });
                navigate("/Maintenance1");
              }
            }}
            disabled={!riskDetail}
          >
            Maintenance
          </button>
        </section>
      </div>
    </div>
  );
}
