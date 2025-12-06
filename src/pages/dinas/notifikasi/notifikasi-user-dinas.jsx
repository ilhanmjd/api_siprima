import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./notifikasi-user-dinas.css";
import { useAssetContext } from "../../../contexts/AssetContext";

const NotifikasiUserDinasRisikoDariVerifikator = ({ assets = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { assets: cachedAssets, fetchAssetsOnce, loadingAssets } = useAssetContext();
  const fetchAssetsOnceRef = useRef(fetchAssetsOnce);
  const defaultCategory = location.state?.defaultCategory;
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.defaultCategory || "Asset"
  );
  const [assetList, setAssetList] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [riskTreatmentList, setRiskTreatmentList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [penghapusanasetList, setPenghapusanasetList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Keep latest fetch function without putting it as a dependency to avoid analyzer loop warnings
  fetchAssetsOnceRef.current = fetchAssetsOnce;

  useEffect(() => {
    if (defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, [defaultCategory]);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      try {
        if (selectedCategory === "Asset") {
          const data = await fetchAssetsOnceRef.current?.();
          if (!cancelled) {
            setAssetList(Array.isArray(data) ? data : []);
          }
        } else if (selectedCategory === "Risk") {
          if (!cancelled) setRiskList([]);
        } else if (selectedCategory === "Maintenance") {
          if (!cancelled) setMaintenanceList([]);
        }
      } catch (error) {
        if (!cancelled) {
          if (selectedCategory === "Asset") setAssetList([]);
          if (selectedCategory === "Risk") setRiskList([]);
          if (selectedCategory === "Maintenance") setMaintenanceList([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

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
          <div className="icon" onClick={() => navigate("/notifikasi-user-dinas")}>
            🔔
          </div>
        </div>
      </nav>

      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard")}>Dashboard</span> {">"} Notification
      </div>

      <div className="form-card">
        <div className="form-header">
          <img src="/logo.png" alt="icon" className="form-icon" />
          <h1>Notification</h1>
        </div>

        <div className="content-box">
          <h2 className="content-title">Verification</h2>

          <div className="dropdown-container">
            <label htmlFor="category-select" className="dropdown-label">
              Pilih Kategori:
            </label>

            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="dropdown-select"
            >
              <option value="Asset">Asset</option>
              <option value="Risk">Risk</option>
              <option value="Risk Treatment">Risk Treatment</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Penghapusan Aset">Penghapusan Aset</option>
            </select>
          </div>

          {/* ===================== ASSET ===================== */}
          {selectedCategory === "Asset" && (
            <div className="aset-list">
              {loading || loadingAssets ? <p>Loading...</p> :
                assetList.map((asset, index) => {
                  return (
                    <div key={index} className="aset-item">
                      <span className="aset-name">{asset.nama}</span>
                      {asset.status === "pending" && <button className="verification-button under-review">UnderReview</button>}
                      {asset.status !== "ditolak" && asset.status !== "pending" && <button className="verification-button accepted" onClick={() => navigate('/notif-accept-aset', { state: { id: asset.id, nama: asset.nama } })}>Accepted</button>}
                      {asset.status === "ditolak" && <button className="verification-button rejected">Rejected</button>}
                    </div>
                  );
                })
              }
            </div>
          )}

          {/* ===================== RISK ===================== */}
          {selectedCategory === "Risk" && (
            <div className="aset-list">
              {loading ? <p>Loading...</p> :
                riskList.map((risk) => (
                  <div key={risk.id} className="aset-item">
                    <span className="aset-name">{risk.nama}</span>
                    {risk.status === "pending" && <button className="verification-button under-review">UnderReview</button>}
                    {risk.status !== "ditolak" && risk.status !== "pending" && <button className="verification-button accepted" onClick={() => navigate('/notif-accept-risk', { state: { id: risk.id, nama: risk.nama } })}>Accepted</button>}
                    {risk.status === "ditolak" && <button className="verification-button rejected">Rejected</button>}
                  </div>
                ))
              }
            </div>
          )}

          {/* ===================== RISK TREATMENT ===================== */}
          {selectedCategory === "Risk Treatment" && (
            <div className="aset-list">
              {loading ? <p>Loading...</p> :
                riskTreatmentList.map((risk_treatment) => (
                  <div key={risk_treatment.id} className="aset-item">
                    <span className="aset-name">{risk_treatment.nama}</span>
                    {risk_treatment.status === "pending" && <button className="verification-button under-review">UnderReview</button>}
                    {risk_treatment.status !== "ditolak" && risk_treatment.status !== "pending" && <button className="verification-button accepted" onClick={() => navigate('/notif-accept-risk-treatment', { state: { id: risk_treatment.id, nama: risk_treatment.nama } })}>Accepted</button>}
                    {risk_treatment.status === "ditolak" && <button className="verification-button rejected">Rejected</button>}
                  </div>
                ))
              }
            </div>
          )}

          {/* ===================== MAINTENANCE ===================== */}
          {selectedCategory === "Maintenance" && (
            <div className="aset-list">
              {loading ? <p>Loading...</p> :
                maintenanceList.map((maintenance) => (
                  <div key={maintenance.id} className="aset-item">
                    <span className="aset-name">{maintenance.nama}</span>
                    {maintenance.status === "pending" && <button className="verification-button under-review">UnderReview</button>}
                    {maintenance.status !== "ditolak" && maintenance.status !== "pending" && <button className="verification-button accepted" onClick={() => navigate('/notif-accept-maintenance', { state: { id: maintenance.id, nama: maintenance.nama } })}>Accepted</button>}
                    {maintenance.status === "ditolak" && <button className="verification-button rejected">Rejected</button>}
                  </div>
                ))
              }
            </div>
          )}

          {/* ===================== PENGHAPUSAN ASET ===================== */}
          {selectedCategory === "Penghapusan Aset" && (
            <div className="aset-list">
              {loading ? <p>Loading...</p> :
                penghapusanasetList.map((penghapusan_aset) => (
                  <div key={penghapusan_aset.id} className="aset-item">
                    <span className="aset-name">{penghapusan_aset.nama}</span>
                    {penghapusan_aset.status === "pending" && <button className="verification-button under-review">UnderReview</button>}
                    {penghapusan_aset.status !== "ditolak" && penghapusan_aset.status !== "pending" && <button className="verification-button accepted" onClick={() => navigate('/notif-accept-penghapusan-aset', { state: { id: penghapusan_aset.id, nama: penghapusan_aset.nama } })}>Accepted</button>}
                    {penghapusan_aset.status === "ditolak" && <button className="verification-button rejected">Rejected</button>}
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotifikasiUserDinasRisikoDariVerifikator;
