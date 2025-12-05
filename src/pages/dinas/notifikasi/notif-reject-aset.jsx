import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./notif-reject-aset.css";
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
                assetList.filter(asset => asset.status === "ditolak").map((asset, index) => {
                  console.log('Asset item:', asset);
                  const isSelected = selectedAsset && selectedAsset.id === asset.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-reject"
                      style={{
                        backgroundColor: asset.status === "ditolak" ? "#ff3636" : undefined,
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
                        backgroundColor: risk.status === "ditolak" ? "#ff3636" : undefined,
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
                        backgroundColor: riskTreatment.status === "ditolak" ? "#ff3636" : undefined,
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
                  const isSelected = selectedmaintenance && selectedmaintenance.id === maintenance.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-reject"
                      style={{
                        backgroundColor: maintenance.status === "ditolak" ? "#ff3636" : undefined,
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedmaintenance(maintenance)}
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
                penghapusanasetList.filter(penghapusanaset => penghapusanaset.status === "ditolak").map((penghapusanaset, index) => {
                  console.log('penghapusanaset item:', penghapusanaset);
                  const isSelected = selectedpenghapusanaset && selectedpenghapusanaset.id === penghapusanaset.id;
                  return (
                    <div
                      key={index}
                      className="aset-item-page-reject"
                      style={{
                        backgroundColor: penghapusanaset.status === "ditolak" ? "#ff3636" : undefined,
                        border: isSelected ? "2px solid #000" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedpenghapusanaset(penghapusanaset)}
                    >
                      <span className="aset-name">{penghapusanaset.nama}</span>
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
              <h3>Aset Laptop</h3>
              <span className="asset-date">10/10/2025 - 17:23:34 PM</span>
            </div>
            <div className="asset-body">
              <p>
                <b>Kategori</b> :{" "}
              </p>
              <p>
                <b>Nama Asset</b> :{" "}
              </p>
              <p>
                <b>Kode Asset</b> :{" "}
              </p>
              <p>
                <b>Person in Change</b> :{" "}
              </p>
              <p>
                <b className="status-rejected">Status Pengajuan : DITOLAK</b>
              </p>
              <p>
                <b>Alasan</b> :{" "}
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
