import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./notif-accept-aset.css";
import api from "../../../api.js";

export default function NotifAcceptAset() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState("Asset");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetList, setAssetList] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [riskTreatmentList, setRiskTreatmentList] = useState([]);
  const [penghapusanasetList, setPenghapusanasetList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getAssets()
      .then(response => {
        const data = response.data.data;
        setAssetList(data);

        // Auto-select asset if state is passed
        const state = location.state;
        if (state && state.id) {
          const asset = data.find(a => a.id === state.id);
          if (asset) {
            setSelectedAsset(asset);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching assets:', error);
      })
      .finally(() => {
        setLoading(false);
      });
    setRiskList([]);
    setMaintenanceList([]);
    setRiskTreatmentList([]);
    setPenghapusanasetList([]);
  }, [location.state]);

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
              {loading ? <p>Loading...</p> :
                assetList.map((asset, index) => {
                  console.log('Asset item:', asset);
                  const isSelected = selectedAsset && selectedAsset.id === asset.id;
                  return (
                    <div
                      key={index}
                      className="aset-item"
                      style={{
                        backgroundColor: asset.status !== "ditolak" && asset.status !== "pending" ? "#72a5ff" : asset.status === "ditolak" ? "#ff3636" : undefined,
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedAsset(asset)}
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
                riskList.map((risk) => (
                  <div key={risk.id} className="aset-item" style={{ backgroundColor: risk.status !== "ditolak" && risk.status !== "pending" ? "#72a5ff" : risk.status === "ditolak" ? "#ff3636" : undefined }}>
                    <span className="aset-name">{risk.nama}</span>
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
                  <div key={risk_treatment.id} className="aset-item" style={{ backgroundColor: risk_treatment.status !== "ditolak" && risk_treatment.status !== "pending" ? "#72a5ff" : risk_treatment.status === "ditolak" ? "#ff3636" : undefined }}>
                    <span className="aset-name">{risk_treatment.nama}</span>
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
                  <div key={maintenance.id} className="aset-item" style={{ backgroundColor: maintenance.status !== "ditolak" && maintenance.status !== "pending" ? "#72a5ff" : maintenance.status === "ditolak" ? "#ff3636" : undefined }}>
                    <span className="aset-name">{maintenance.nama}</span>
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
                  <div key={penghapusan_aset.id} className="aset-item" style={{ backgroundColor: penghapusan_aset.status !== "ditolak" && penghapusan_aset.status !== "pending" ? "#72a5ff" : penghapusan_aset.status === "ditolak" ? "#ff3636" : undefined }}>
                    <span className="aset-name">{penghapusan_aset.nama}</span>
                  </div>
                ))
              }
            </div>
          )}
        </aside>

        {/* Detail Panel */}
        <section className="asset-detail">
          <div className="asset-card">
            <div className="asset-header">
              <h3>{selectedAsset ? selectedAsset.nama : "Aset Laptop"}</h3>
              <span className="asset-date">{selectedAsset && selectedAsset.tgl_perolehan ? new Date(selectedAsset.tgl_perolehan).toLocaleString() : "10/10/2025 - 17:23:34 PM"}</span>
            </div>

            <div className="asset-body">
              <p><b>Kategori</b> : {selectedAsset && selectedAsset.kategori ? String(selectedAsset.kategori.nama || "") : ""}</p>
              <p><b>Nama Asset</b> : {selectedAsset ? String(selectedAsset.nama || "") : ""}</p>
              <p><b>Kode Asset</b> : {selectedAsset ? String(selectedAsset.kode_asset || "") : ""}</p>
              <p><b>Person in Change</b> : {selectedAsset && selectedAsset.penanggungjawab ? String(selectedAsset.penanggungjawab.nama || "") : ""}</p>
              <p className="asset-id"><b>ID ASSET :</b> {selectedAsset ? String(selectedAsset.id || "") : ""}</p>
              <p><b>Kondisi Asset</b> : {selectedAsset ? String(selectedAsset.kondisi || "") : ""}</p>
              <p><b>Deskripsi Asset</b> : {selectedAsset ? String(selectedAsset.deskripsi || "") : ""}</p>
            </div>
          </div>

          <button
            className="risk-btn"
            onClick={() => navigate("/InputRisiko1")}
          >
            Risiko
          </button>
        </section>
      </div>
    </div>
  );
}
