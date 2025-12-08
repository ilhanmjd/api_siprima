import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./notif-accept-risk-treatment.css";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";

export default function NotifAcceptAset() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateAssetData, fetchAssetsOnce, loadingAssets } = useAssetContext();
  const locationStateId = location.state?.id;

  const [selectedCategory, setSelectedCategory] = useState("Risk Treatment");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedRiskTreatment, setSelectedRiskTreatment] = useState(null);
  const [riskDetail, setRiskDetail] = useState(null);
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

  const formatDateTime = useCallback((value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
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
        const list = Array.isArray(data) ? data : [];
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
    if (selectedCategory !== "Risk Treatment") return;
    let cancelled = false;
    setLoading(true);
    api
      .getRiskTreatments()
      .then((res) => {
        if (cancelled) return;
        const list = res?.data?.data ?? res?.data ?? [];
        setRiskTreatmentList(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setRiskTreatmentList([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  const activeRisks = riskTreatmentList.filter(
    (risk) =>
      risk.status !== "pending" && risk.status !== "ditolak"
  );

  console.log("Risk Treatment List:", riskTreatmentList);
  console.log("Active Risk:", activeRisks);
  console.log("Selected Risk Treatment:", selectedRiskTreatment);
  console.log("Risk Detail:", riskDetail);

  const handleCategoryChange = useCallback(
    (value) => {
      setSelectedCategory(value);
      if (value === "Asset") {
        navigate("/notif-accept-aset");
      } else if (value === "Risk") {
        navigate("/notif-accept-risk");
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
                riskList.filter(risk => risk.status === "ditolak").map((risk, index) => {
                  const isSelected = selectedRisk && selectedRisk.id === risk.id;
                  return (
                  <div
                    key={index}
                    className="aset-item-page-reject"
                    style={{
                      backgroundColor: risk.status !== "ditolak" && risk.status !== "pending" ? "#a9c9f8" : undefined,
                      border: isSelected ? "2px solid #000" : "none",
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedRisk(risk)}
                  >
                      <span className="aset-name">{risk.nama}</span>
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
                riskTreatmentList
                  .filter((risk) => risk.status !== "pending" && risk.status !== "ditolak")
                  .map((risk, index) => {
                  const isSelected = selectedRiskTreatment && selectedRiskTreatment.id === risk.id;
                  return (
                  <div
                    key={risk.id ?? index}
                    className="aset-item-page-reject"
                    style={{
                      backgroundColor: risk.status !== "ditolak" && risk.status !== "pending" ? "#a9c9f8" : undefined,
                      border: isSelected ? "2px solid #000" : "none",
                      cursor: "pointer"
                    }}
                      onClick={() => setRiskDetail(risk)}
                    >
                      <span className="aset-name">{risk.risk?.judul || risk.nama || `Risk Treatment ${risk.id}`}</span>
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
              <h3>{riskDetail?.risk?.asset.nama || ""}</h3>
              <span className="asset-date">{formatDateTime(riskDetail?.updated_at)}</span>
            </div>
            <div className="asset-body">
              <p>
                <b>Asset-Risiko</b> :{riskDetail?.risk?.asset.nama || ""} - {riskDetail?.risk?.judul || ""}
              </p>
              <p>
                <b>Strategi</b> :{riskDetail?.strategi || ""}
              </p>
              <p>
                <b>Pengendalian</b> :{riskDetail?.pengendalian || ""}
              </p>
              <p>
                <b>Person in Change</b> :{riskDetail?.penanggungjawab.nama || ""}
              </p>
              <p>
                <b>Biaya</b> :{riskDetail?.biaya || ""}
              </p>
              <p>
                <b>PxD</b> :{riskDetail?.risk?.probabilitas || ""} X {riskDetail?.risk?.nilai_dampak || ""} = {riskDetail?.risk?.level_risiko || ""}
              </p>
              <p className="asset-id">
                <b>ID RISK : {riskDetail?.risk?.id}</b>
              </p>
            </div>
          </div>

          <button
            className="risk-btn"
            onClick={() => navigate("/Maintenance1")}
          >
            Maintenance
          </button>
        </section>
      </div>
    </div>
  );
}
