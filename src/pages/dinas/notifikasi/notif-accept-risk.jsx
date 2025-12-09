import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./notif-accept-risk.css";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";

export default function NotifAcceptAset() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateAssetData, fetchAssetsOnce, loadingAssets } = useAssetContext();
  const locationStateId =
    location.state?.id || new URLSearchParams(location.search).get("id");

  const [selectedCategory, setSelectedCategory] = useState("Risk");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedRiskTreatment, setSelectedRiskTreatment] = useState(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [selectedPenghapusanAset, setSelectedPenghapusanAset] = useState(null);
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

  useEffect(() => {
    if (selectedCategory !== "Risk") return;
    let cancelled = false;
    setLoading(true);
    api
      .getRisks()
      .then((res) => {
        if (cancelled) return;
        const list = res?.data?.data ?? res?.data ?? [];
        setRiskList(sortByUpdatedAtDesc(Array.isArray(list) ? list : []));
      })
      .catch(() => {
        if (!cancelled) setRiskList([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  // Auto-select risk when coming from notifications (state/query id)
  useEffect(() => {
    if (!locationStateId || selectedRisk) return;
    const match = riskList.find(
      (risk) => String(risk?.id ?? "") === String(locationStateId ?? "")
    );
    if (match) setSelectedRisk(match);
  }, [locationStateId, riskList, selectedRisk]);

  const activeAssets = assetList.filter(
    (asset) =>
      asset.status !== "pending" && asset.status !== "ditolak"
  );

  const handleCategoryChange = useCallback(
    (value) => {
      setSelectedCategory(value);
      if (value === "Asset") {
        navigate("/notif-accept-aset");
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
            <div className="aset-list">
              {loading || loadingAssets ? <p>Loading...</p> :
                activeAssets.map((asset) => {
                  const isSelected =
                    selectedAsset &&
                    (selectedAsset.id ?? selectedAsset.asset_id) ===
                      (asset.id ?? asset.asset_id);
                  return (
                    <div
                      key={asset.id ?? asset.nama}
                      className="aset-item-page-accept"
                      style={{
                        backgroundColor: "#a9c9f8",
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => handleSelectAsset(asset)}
                    >
                      <span className="aset-name">{asset.nama}</span>
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
                riskList
                  .filter((risk) => risk.status !== "pending" && risk.status !== "ditolak")
                  .map((risk, index) => {
                  const isSelected = selectedRisk && selectedRisk.id === risk.id;
                  return (
                    <div
                      key={risk.id ?? index}
                      className="aset-item-page-reject"
                      style={{
                        backgroundColor: risk.status !== "ditolak" && risk.status !== "pending" ? "#a9c9f8" : undefined,
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedRisk(risk)}
                    >
                      <span className="aset-name">{risk.judul || risk.nama || `Risk ${risk.id}`}</span>
                    </div>
                  );
                })
              }
            </div>
          )}

          {/* ===================== RISK TREATMENT ===================== */}
          {selectedCategory === "Risk Treatment" && (
            <div className="aset-list">
              {loading ? <p>Loading...</p> :
                riskTreatmentList.filter(riskTreatment => riskTreatment.status === "ditolak").map((riskTreatment, index) => {
                  const isSelected = selectedRiskTreatment && selectedRiskTreatment.id === riskTreatment.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-reject"
                      style={{
                        backgroundColor: riskTreatment.status !== "ditolak" && riskTreatment.status !== "pending" ? "#a9c9f8" : undefined,
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedRiskTreatment(riskTreatment)}
                    >
                      <span className="aset-name">{riskTreatment.nama}</span>
                    </div>
                  );
                })
              }
            </div>
          )}

          {/* ===================== MAINTENANCE ===================== */}
          {selectedCategory === "Maintenance" && (
            <div className="aset-list">
              {loading ? <p>Loading...</p> :
                maintenanceList.filter(maintenance => maintenance.status === "ditolak").map((maintenance, index) => {
                  const isSelected = selectedMaintenance && selectedMaintenance.id === maintenance.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-reject"
                      style={{
                        backgroundColor: maintenance.status !== "ditolak" && maintenance.status !== "pending" ? "#a9c9f8" : undefined,
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedMaintenance(maintenance)}
                    >
                      <span className="aset-name">{maintenance.nama}</span>
                    </div>
                  );
                })
              }
            </div>
          )}

          {/* ===================== PENGHAPUSAN ASET ===================== */}
          {selectedCategory === "Penghapusan Aset" && (
            <div className="aset-list">
              {loading ? <p>Loading...</p> :
                penghapusanasetList.filter(penghapusan_aset => penghapusan_aset.status === "ditolak").map((penghapusan_aset, index) => {
                  const isSelected = selectedPenghapusanAset && selectedPenghapusanAset.id === penghapusan_aset.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-reject"
                      style={{
                        backgroundColor: penghapusan_aset.status !== "ditolak" && penghapusan_aset.status !== "pending" ? "#a9c9f8" : undefined,
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedPenghapusanAset(penghapusan_aset)}
                    >
                      <span className="aset-name">{penghapusan_aset.nama}</span>
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
              <h3>{selectedRisk?.judul || "Detail Risiko"}</h3>
              <span className="asset-date">
                {selectedRisk?.updated_at
                  ? new Date(selectedRisk.updated_at).toLocaleString()
                  : "—"}
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
                <b>Kategori Risiko:</b> {selectedRisk?.kategori || ""}
              </p>
              <p>
                <b>Level Risiko:</b> {selectedRisk?.level_risiko || ""}
              </p>
              <p>
                <b>Person in Change:</b> {selectedRisk?.penanggungjawab?.nama || ""}
              </p>
              <p>
                <b>Type Risiko:</b> {selectedRisk?.kriteria || ""}
              </p>
              <p>
                <b>Tindakan:</b> {selectedRisk?.tindakan || ""}
              </p>
              <p className="asset-id">
                <b>ID Risk:</b> {selectedRisk?.id || ""}
              </p>
            </div>
          </div>

          <button
            className="risk-btn"
            onClick={() => navigate("/RiskTreatment1")}
          >
            Risk Treatment
          </button>
        </section>
      </div>
    </div>
  );
}
