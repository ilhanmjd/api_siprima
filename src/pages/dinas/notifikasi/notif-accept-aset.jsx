import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./notif-accept-aset.css";
import { useAssetContext } from "../../../contexts/AssetContext";

export default function NotifAcceptAset() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateAssetData, fetchAssetsOnce, loadingAssets } = useAssetContext();
  const locationStateId = location.state?.id;

  const [selectedCategory, setSelectedCategory] = useState("Asset");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetList, setAssetList] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [riskTreatmentList, setRiskTreatmentList] = useState([]);
  const [penghapusanasetList, setPenghapusanasetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const didSyncRef = useRef(false);
  const fetchAssetsOnceRef = useRef(fetchAssetsOnce);
  const handleSelectAssetRef = useRef(null);

  const sortByUpdatedAtDesc = useCallback((items = []) => {
    return [...items].sort(
      (a, b) =>
        new Date(b?.updated_at || b?.updatedAt || 0) -
        new Date(a?.updated_at || a?.updatedAt || 0)
    );
  }, []);

  const handleSelectAsset = useCallback(
    (asset) => {
      setSelectedAsset(asset);
      if (asset) {
        updateAssetData({ asset_id: asset.id || asset.asset_id || "" });
      }
    },
    [updateAssetData]
  );
  handleSelectAssetRef.current = handleSelectAsset;

  // keep fetch reference stable to avoid putting function in effect deps
  fetchAssetsOnceRef.current = fetchAssetsOnce;

  useEffect(() => {
    if (didSyncRef.current) return;
    didSyncRef.current = true;

    let cancelled = false;
    setLoading(true);
    fetchAssetsOnceRef.current()
      .then((data) => {
        if (cancelled) return;
        const list = sortByUpdatedAtDesc(Array.isArray(data) ? data : []);
        setAssetList(list);

        if (locationStateId) {
          const asset = list.find(
            (a) =>
              String(a.id ?? a.asset_id ?? "") === String(locationStateId ?? "")
          );
          if (asset) {
            handleSelectAssetRef.current?.(asset);
          }
        }
      })
      .catch((error) => {
        // ignore fetch error; keep list empty
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

  const activeAssets = assetList.filter(
    (asset) =>
      asset.status !== "pending" && asset.status !== "ditolak"
  );

  const handleCategoryChange = useCallback(
    (value) => {
      setSelectedCategory(value);
      if (value === "Risk") {
        navigate("/notif-accept-risk");
      } else if (value === "Risk Treatment") {
        navigate("/notif-accept-risk-treatment");
      }
    },
    [navigate]
  );

  const handleRiskNavigation = () => {
    const targetAsset = selectedAsset || activeAssets[0];
    if (targetAsset) {
      handleSelectAsset(targetAsset);
      navigate("/InputRisiko1");
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
            </select>
          </div>

          {/* ===================== ASSET ===================== */}
          {selectedCategory === "Asset" && (
            <div className="aset-list-asset-accept">
              {loading || loadingAssets ? <p>Loading...</p> :
                activeAssets.map((asset) => {
                  const isSelected =
                    selectedAsset &&
                    (selectedAsset.id ?? selectedAsset.asset_id) ===
                      (asset.id ?? asset.asset_id);
                  return (
                    <div
                      key={asset.id ?? asset.nama}
                      className="aset-item-page-asset-accept"
                      style={{
                        backgroundColor: "#a9c9f8",
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => handleSelectAsset(asset)}
                    >
                      <span className="aset-name">Asset {asset.nama}</span>
                    </div>
                  );
                })
              }
            </div>
          )}
        </aside>

        {/* Detail Panel */}
        <section className="asset-detail">
          <div className="asset-card">
            <div className="asset-header">
              <h3>{selectedAsset ? selectedAsset.nama : "Detail Asset"}</h3>
              <span className="asset-date">{selectedAsset && selectedAsset.tgl_perolehan ? new Date(selectedAsset.tgl_perolehan).toLocaleString() : "10/10/2025 - 17:23:34 PM"}</span>
            </div>

            <div className="asset-body">
              <p><b>Kategori</b> : {selectedAsset && selectedAsset.kategori ? String(selectedAsset.kategori.nama || "") : ""}</p>
              <p><b>Nama Asset</b> : {selectedAsset ? String(selectedAsset.nama || "") : ""}</p>
              <p><b>Kode Asset</b> : {selectedAsset ? String(selectedAsset.kode_bmd || "") : ""}</p>
              <p><b>Person in Change</b> : {selectedAsset && selectedAsset.penanggungjawab ? String(selectedAsset.penanggungjawab.nama || "") : ""}</p>
              <p className="asset-id"><b>ID ASSET :</b> {selectedAsset ? String(selectedAsset.id || "") : ""}</p>
              <p><b>Kondisi Asset</b> : {selectedAsset ? String(selectedAsset.kondisi || "") : ""}</p>
              <p><b>Deskripsi Asset</b> : {selectedAsset ? String(selectedAsset.deskripsi || "") : ""}</p>
            </div>
          </div>

          <button
            className="risk-btn"
            onClick={handleRiskNavigation}
          >
            Risiko
          </button>
        </section>
      </div>
    </div>
  );
}
