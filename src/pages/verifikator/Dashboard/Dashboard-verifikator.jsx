import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";
import "./Dashboard-verifikator.css";

export default function DashboardVerifikator() {
  const navigate = useNavigate();
  const { resetAssetData } = useAssetContext();
  const hasReset = useRef(false);
  const resetAssetDataRef = useRef(resetAssetData);
  
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    pendingAssets: 0,
    pendingRisks: 0,
    pendingTreatments: 0,
    pendingMaintenances: 0,
    pendingDeletions: 0,
    pendingAssetsList: [],
    topRisksByLevel: [],
    risks: []
  });

  useEffect(() => {
    resetAssetDataRef.current = resetAssetData;
  }, [resetAssetData]);

  useEffect(() => {
    if (hasReset.current) return;
    resetAssetDataRef.current();
    hasReset.current = true;
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [assetsRes, risksRes, treatmentsRes, maintenancesRes, deletionsRes, allRisksRes] = await Promise.all([
        api.getAssets({ status: 'pending' }),
        api.getRisks({ status: 'pending' }),
        api.getRiskTreatments({ status: 'pending' }),
        api.getMaintenances({ status_review: 'pending' }),
        api.getAssetDeletions({ status: 'pending' }),
        api.getRiskfs() // Get all risks for priority chart
      ]);

      const pendingAssets = assetsRes.data.data || [];
      const pendingRisks = risksRes.data.data || [];
      const pendingTreatments = treatmentsRes.data.data || [];
      const pendingMaintenances = maintenancesRes.data.data || [];
      const pendingDeletions = deletionsRes.data.data || [];
      const allRisks = allRisksRes.data.data || [];

      // Sort risks by level_risiko (descending) and take top 5
      const topRisks = [...allRisks]
        .sort((a, b) => b.level_risiko - a.level_risiko)
        .slice(0, 5);

      setStatistics({
        pendingAssets: pendingAssets.length,
        pendingRisks: pendingRisks.length,
        pendingTreatments: pendingTreatments.length,
        pendingMaintenances: pendingMaintenances.length,
        pendingDeletions: pendingDeletions.length,
        pendingAssetsList: pendingAssets,
        topRisksByLevel: topRisks,
        risks: allRisks.slice(0, 5)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    }
  };

  const handleInputClick = (title, btn) => {
    if (title === "ASSET") {
      if (btn === "Verifikasi") {
        navigate("/notifikasi-verifikator-aset");
      } else if (btn === "Hapus") {
        navigate("/Notifikasi-verifikator-penghapusan-aset");
      }
    } else if (title === "RISK") {
      navigate("/notifikasi-verifikator-risiko");
    } else if (title === "RISK TREATMENT") {
      navigate("/notifikasi-verifikator-risk-treatment");
    }
  };

  if (loading) return (
    <div className="dashboard-container">
      <div style={{ padding: '50px', textAlign: 'center' }}>Loading dashboard data...</div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        
        <div className="navbar-center">
          <span className="active" onClick={() => navigate("/Dashboard")}>
            Dashboard
          </span>
          <span onClick={() => navigate("/notifikasi-verifikator-maintenance")}>Maintenance</span>
        </div>
        <div className="navbar-right">
          {/* <div
            className="icon"
            // onClick={() => navigate("/notifikasi-verifikator-aset")}
          >
            🔔
          </div> */}
          <div className="icon" onClick={handleLogout}><img src="/logout.png" alt="Logout" className="logo" /></div>
        </div>
      </nav>

      {/* Content */}
      <div className="content">
        <h1 className="title">Dashboard Verifikator</h1>

        {/* Top Cards */}
        <div className="card-row">
          <div className="main-card">
            <h2>ASSET</h2>
            <div className="button-row">
              <button
                className="yellow-btn"
                onClick={() => handleInputClick("ASSET", "Verifikasi")}
              >
                Verifikasi
              </button>
              <button
                className="yellow-btn"
                onClick={() => handleInputClick("ASSET", "Hapus")}
              >
                Hapus
              </button>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
              Pending: {statistics.pendingAssets}
            </div>
          </div>
          
          <div className="main-card">
            <h2>RISK TREATMENT</h2>
            <div className="button-row">
              <button
                className="yellow-btn"
                onClick={() => handleInputClick("RISK TREATMENT", "Verifikasi")}
              >
                Verifikasi
              </button>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
              Pending: {statistics.pendingTreatments}
            </div>
          </div>
          
          <div className="main-card">
            <h2>RISK</h2>
            <div className="button-row">
              <button
                className="yellow-btn"
                onClick={() => handleInputClick("RISK", "Verifikasi")}
              >
                Verifikasi
              </button>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
              Pending: {statistics.pendingRisks}
            </div>
          </div>
        </div>

        {/* Actions */}
        <h2 className="subtitle">Actions</h2>
        <div className="actions-row">
          <button className="action-btn" onClick={() => navigate("/asset-aktif")}>
            ASSET AKTIF
          </button>
          <button className="action-btn" onClick={() => navigate("/notifikasi-verifikator-maintenance")}>
            MAINTENANCE ({statistics.pendingMaintenances})
          </button>
          <button className="action-btn" onClick={() => navigate("/Notifikasi-verifikator-penghapusan-aset")}>
            END OF LIFE ({statistics.pendingDeletions})
          </button>
          {/* <button className="action-btn">
            ASSET BERMASALAH
          </button> */}
        </div>

        {/* Charts Section */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Verification Stats</h3>
            <div className="chart-placeholder">
              📈<p>Verification Stats (Kosong)</p>
            </div>
          </div>
          <div className="chart-card">
            <h3>Pending Verifications</h3>
            {statistics.pendingAssetsList.length === 0 ? (
              <div className="chart-placeholder">
                🥧<p>Tidak ada asset pending</p>
              </div>
            ) : (
              <div className="risk-list">
                {statistics.pendingAssetsList.map((asset) => (
                  <div className="risk-item" key={asset.id}>
                    <span>💼 {asset.nama}</span>
                    <button className="status-btn process">
                      Pending
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Risiko Prioritas</h3>
            {statistics.topRisksByLevel.length === 0 ? (
              <div className="chart-placeholder">
                📊<p>Tidak ada data risiko</p>
              </div>
            ) : (
              <div className="risk-list">
                {statistics.topRisksByLevel.map((risk, index) => (
                  <div className="risk-item" key={risk.id}>
                    <span>
                      {index + 1}. {risk.judul} 
                      <span style={{ 
                        marginLeft: '8px', 
                        fontSize: '0.85rem',
                        color: risk.kriteria === 'High' ? '#d32f2f' : 
                               risk.kriteria === 'Medium' ? '#f57c00' : '#388e3c'
                      }}>
                        (Level: {risk.level_risiko})
                      </span>
                    </span>
                    <button
                      className={`status-btn ${
                        risk.kriteria === "High" ? "process" : "done"
                      }`}
                      style={{
                        backgroundColor: risk.kriteria === 'High' ? '#d32f2f' : 
                                       risk.kriteria === 'Medium' ? '#f57c00' : '#388e3c'
                      }}
                    >
                      {risk.kriteria}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chart-card">
            <h3>Penanganan Risiko</h3>
            <div className="risk-list">
              {statistics.risks.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Tidak ada data risiko
                </div>
              ) : (
                statistics.risks.map((risk) => (
                  <div className="risk-item" key={risk.id}>
                    <span>💼 {risk.asset?.nama || `Asset #${risk.asset_id}`}</span>
                    <button
                      className={`status-btn ${
                        risk.status === "accepted" ? "done" : "process"
                      }`}
                    >
                      {risk.status === "accepted" ? "Verified" : 
                       risk.status === "pending" ? "Pending" : "Rejected"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
