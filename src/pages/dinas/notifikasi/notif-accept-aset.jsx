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
                assetList.filter(asset => asset.status !== "pending" && asset.status !== "ditolak").map((asset, index) => {
                  console.log('Asset item:', asset);
                  const isSelected = selectedAsset && selectedAsset.id === asset.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-accept"
                      style={{
                        backgroundColor: asset.status !== "ditolak" && asset.status !== "pending" ? "#a9c9f8" : undefined,
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
                riskList.filter(risk => risk.status === "ditolak").map((risk, index) => {
                  console.log('Risk item:', risk);
                  const isSelected = selectedRisk && selectedRisk.id === risk.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-reject"
                      style={{
                        backgroundColor: asset.status !== "ditolak" && asset.status !== "pending" ? "#a9c9f8" : undefined,
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
                riskTreatmentList.filter(riskTreatment => riskTreatment.status === "ditolak").map((riskTreatment, index) => {
                  console.log('Risk Treatment item:', riskTreatment);
                  const isSelected = selectedRiskTreatment && selectedRiskTreatment.id === riskTreatment.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-reject"
                      style={{
                        backgroundColor: asset.status !== "ditolak" && asset.status !== "pending" ? "#a9c9f8" : undefined,
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
                  console.log('maintenance item:', maintenance);
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
                  console.log('Penghapusan Aset item:', penghapusan_aset);
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
