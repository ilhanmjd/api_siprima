import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./notif-reject-aset.css";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";

export default function NotifAcceptAset() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchAssetsOnce, loadingAssets } = useAssetContext();
  const locationStateId = location.state?.id;

  const [selectedCategory, setSelectedCategory] = useState("Asset");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetDetail, setAssetDetail] = useState(null);
  const [assetList, setAssetList] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [riskTreatmentList, setRiskTreatmentList] = useState([]);
  const [penghapusanasetList, setPenghapusanasetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const didSyncRef = useRef(false);
  const fetchAssetsOnceRef = useRef(fetchAssetsOnce);

  // keep the latest fetch without adding function to dependency arrays
  fetchAssetsOnceRef.current = fetchAssetsOnce;

  const handleCategoryChange = useCallback(
    (value) => {
      setSelectedCategory(value);
      if (value === "Asset") navigate("/notif-reject-aset");
      else if (value === "Risk") navigate("/notif-reject-risk");
      else if (value === "Risk Treatment") navigate("/notif-reject-risk-treatment");
      else if (value === "Maintenance") navigate("/notif-reject-maintenance");
      else if (value === "Penghapusan Aset")
        navigate("/notif-reject-penghapusan-aset");
    },
    [navigate]
  );

  useEffect(() => {
    if (didSyncRef.current) return;
    didSyncRef.current = true;

    let cancelled = false;
    setLoading(true);
    fetchAssetsOnceRef.current()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setAssetList(list);

        if (locationStateId) {
          const asset = list.find((a) => a.id === locationStateId);
          if (asset) {
            setSelectedAsset(asset);
          }
        }
      })
      .catch((error) => {
        // keep silent if fetch fails
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    setRiskList([]);
    setMaintenanceList([]);
    setRiskTreatmentList([]);
    setPenghapusanasetList([]);

    return () => {
      cancelled = true;
    };
  }, [locationStateId]);

  const handleAssetClick = async (asset) => {
    setSelectedAsset(asset);
    try {
      const res = await api.getAssetById(asset.id);
      const detail = res?.data?.data ?? res?.data ?? null;
      setAssetDetail(detail);
    } catch (error) {
      setAssetDetail(asset);
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

      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard")}>Dashboard</span> {">"} Notification
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

          {/* ===================== ASSET ===================== */}
          {selectedCategory === "Asset" && (
            <div className="aset-list">
              {loading || loadingAssets ? <p>Loading...</p> :
                assetList.filter(asset => asset.status === "ditolak").map((asset, index) => {
                  const isSelected = selectedAsset && selectedAsset.id === asset.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-asset-reject"
                      style={{
                        backgroundColor: asset.status === "ditolak" ? "#ff3636" : undefined,
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => handleAssetClick(asset)}
                    >
                      <span className="aset-name">{asset.nama}</span>
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
              <h3>{assetDetail?.nama || selectedAsset?.nama || "Aset Rejected"}</h3>
              <span className="asset-date">
                {assetDetail?.tgl_perolehan
                  ? new Date(assetDetail.tgl_perolehan).toLocaleString()
                  : ""}
              </span>
            </div>
            <div className="asset-body">
              <p>
                <b>Kategori</b> : {assetDetail?.kategori?.nama || ""}
              </p>
              <p>
                <b>Nama Asset</b> : {assetDetail?.nama || ""}
              </p>
              <p>
                <b>Kode Asset</b> : {assetDetail?.kode_bmd || assetDetail?.kode_asset || ""}
              </p>
              <p>
                <b>Person in Change</b> : {assetDetail?.penanggungjawab?.nama || ""}
              </p>
              <p>
                <b className="status-rejected">Status Pengajuan : DITOLAK</b>
              </p>
              <p>
                <b>Alasan</b> : {assetDetail?.alasan_ditolak || ""}
              </p>
            </div>
          </div>

          <button className="aset-btn" onClick={() => navigate("/AsetInput1")}>
            Input Aset
          </button>
        </section>
      </div>
    </div>
  );
}
