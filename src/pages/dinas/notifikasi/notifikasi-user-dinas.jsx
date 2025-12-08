import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./notifikasi-user-dinas.css";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";

const NotifikasiUserDinasRisikoDariVerifikator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchAssetsOnce, loadingAssets } = useAssetContext();
  const fetchAssetsOnceRef = useRef(fetchAssetsOnce);
  const defaultCategory = location.state?.defaultCategory;

  const [selectedCategory, setSelectedCategory] = useState(
    defaultCategory || "Asset"
  );
  const [assetList, setAssetList] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [riskTreatmentList, setRiskTreatmentList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [penghapusanasetList, setPenghapusanasetList] = useState([]);
  const [loading, setLoading] = useState(false);

  const requestIdRef = useRef(0);
  const cancelledRef = useRef(false);
  const riskLoadedRef = useRef(false);
  const riskTreatmentLoadedRef = useRef(false);

  // Keep latest fetch function without putting it as a dependency to avoid analyzer loop warnings
  fetchAssetsOnceRef.current = fetchAssetsOnce;

  const riskConsume = useCallback(async (requestId) => {
    const res = await api.getRisks();
    const list = res?.data?.data ?? res?.data ?? [];
    if (cancelledRef.current || requestId !== requestIdRef.current) return;
    setRiskList(Array.isArray(list) ? list : []);
    riskLoadedRef.current = true;
  }, []);

  const riskTreatmentConsume = useCallback(async (requestId) => {
    const res = await api.getRiskTreatments();
    const list = res?.data?.data ?? res?.data ?? [];
    if (cancelledRef.current || requestId !== requestIdRef.current) return;
    setRiskTreatmentList(Array.isArray(list) ? list : []);
    riskTreatmentLoadedRef.current = true;
  }, []);

  const loadDataForCategory = useCallback(
    async (category) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      try {
        if (category === "Asset") {
          const data = await fetchAssetsOnceRef.current?.();
          if (cancelledRef.current || requestId !== requestIdRef.current) return;
          const assets = Array.isArray(data) ? data : [];
          setAssetList(
            [...assets].sort(
              (a, b) =>
                new Date(b?.updated_at || b?.updatedAt || 0) -
                new Date(a?.updated_at || a?.updatedAt || 0)
            )
          );
        } else if (category === "Risk") {
          if (riskLoadedRef.current) {
            setLoading(false);
            return;
          }
          await riskConsume(requestId);
        } else if (category === "Risk Treatment") {
          if (riskTreatmentLoadedRef.current) {
            setLoading(false);
            return;
          }
          await riskTreatmentConsume(requestId);
        } else if (category === "Maintenance") {
          if (cancelledRef.current || requestId !== requestIdRef.current) return;
          setMaintenanceList([]);
        } else if (category === "Penghapusan Aset") {
          if (cancelledRef.current || requestId !== requestIdRef.current) return;
          setPenghapusanasetList([]);
        }
      } catch (error) {
        if (cancelledRef.current || requestId !== requestIdRef.current) return;
        if (category === "Asset") setAssetList([]);
        if (category === "Risk") setRiskList([]);
        if (category === "Risk Treatment") setRiskTreatmentList([]);
        if (category === "Maintenance") setMaintenanceList([]);
        if (category === "Penghapusan Aset") setPenghapusanasetList([]);
      } finally {
        if (cancelledRef.current || requestId !== requestIdRef.current) return;
        setLoading(false);
      }
    },
    [riskConsume, riskTreatmentConsume]
  );

  useEffect(() => {
    loadDataForCategory(selectedCategory);
    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (defaultCategory && defaultCategory !== selectedCategory) {
      setSelectedCategory(defaultCategory);
      loadDataForCategory(defaultCategory);
    }
  }, [defaultCategory, loadDataForCategory, selectedCategory]);

  const handleCategoryChange = useCallback(
    (value) => {
      setSelectedCategory(value);
      loadDataForCategory(value);
    },
    [loadDataForCategory]
  );

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
            dY""
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
              onChange={(e) => handleCategoryChange(e.target.value)}
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
                    <span className="aset-name">{risk.judul}</span>
                    {risk.status === "pending" && <button className="verification-button under-review">UnderReview</button>}
                    {risk.status !== "ditolak" && risk.status !== "pending" && <button className="verification-button accepted" onClick={() => navigate('/notif-accept-risk', { state: { id: risk.id, nama: risk.judul } })}>Accepted</button>}
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
                    <span className="aset-name">{risk_treatment.risk.judul}</span>
                    {risk_treatment.status === "pending" && <button className="verification-button under-review">UnderReview</button>}
                    {risk_treatment.status !== "ditolak" && risk_treatment.status !== "pending" && <button className="verification-button accepted" onClick={() => navigate('/notif-accept-risk-treatment', { state: { id: risk_treatment.id, risk_judul: risk_treatment.risk.judul } })}>Accepted</button>}
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
