import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./DashboardAuditor.css";

export default function DashboardAuditor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    risksByLevel: { High: 0, Medium: 0, Low: 0 },
    totalRisks: 0,
    maintenances: [],
    assetDeletions: [],
    dinasStats: []
  });

  useEffect(() => {
    fetchAuditorData();
  }, []);

  const fetchAuditorData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [assetsRes, risksRes, maintenancesRes, deletionsRes, dinasRes, treatmentsRes] = await Promise.all([
        api.getAssets(),
        api.getRisks(),
        api.getMaintenances(),
        api.getAssetDeletions(),
        api.getDinas(),
        api.getRiskTreatments()
      ]);

      const assets = assetsRes.data.data || [];
      const risks = risksRes.data.data || [];
      const maintenances = maintenancesRes.data.data || [];
      const deletions = deletionsRes.data.data || [];
      const dinases = dinasRes.data.data || [];
      const treatments = treatmentsRes.data.data || [];

      // Calculate risk statistics
      const riskStats = {
        High: risks.filter(r => r.kriteria === 'High').length,
        Medium: risks.filter(r => r.kriteria === 'Medium').length,
        Low: risks.filter(r => r.kriteria === 'Low').length
      };

      // Calculate per-dinas statistics
      const dinasStatistics = dinases.map(dinas => {
        const dinasAssets = assets.filter(a => a.dinas_id === dinas.id);
        const pendingCount = dinasAssets.filter(a => a.status === 'pending').length;
        return {
          id: dinas.id,
          name: dinas.name,
          assetCount: dinasAssets.length,
          pendingCount: pendingCount
        };
      });

      setStatistics({
        totalAssets: assets.length,
        risksByLevel: riskStats,
        totalRisks: risks.length,
        maintenances: maintenances.slice(0, 5), // Top 5 for display
        assetDeletions: deletions.filter(d => d.status === 'accepted'),
        dinasStats: dinasStatistics
      });
    } catch (error) {
      console.error('Failed to fetch auditor data:', error);
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

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span className="active" onClick={() => navigate("/dashboard-auditor")}>Dashboard</span>
        </div>
        <div className="navbar-right">
          <div className="icon">🔔</div>
          <div className="icon" onClick={handleLogout}><img src="/logout.png" alt="Logout" className="logo" /></div>
        </div>
      </nav>

      {/* Content */}
      <div className="content">
        <h1 className="title">Auditor Dashboard</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard data...</div>
        ) : (
          <>
            {/* TOP WIDGETS */}
            <div className="top-grid">
              <div className="card total-aset">
                <div className="total-aset-container" style={{display: "flex", justifyContent: "space-between"}}>
                  <div className="total-aset-section" style={{flex: "1", marginRight: "10px"}}>
                    <h4>Total Seluruh Aset</h4>
                    <div className="value">{statistics.totalAssets}</div>
                  </div>
                  <div className="risiko-teridentifikasi-section" style={{flex: "1", marginLeft: "10px"}}>
                    <h4>Risiko Teridentifikasi</h4>
                    <div className="risk-list">
                      <div>🟦 Low: {statistics.risksByLevel.Low}</div>
                      <div>🟧 Medium: {statistics.risksByLevel.Medium}</div>
                      <div>🟥 High: {statistics.risksByLevel.High}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card risiko merah">
                <span>Risiko Tinggi</span>
                <h1>{statistics.risksByLevel.High}</h1>
              </div>

              <div className="card risiko kuning">
                <span>Risiko Sedang</span>
                <h1>{statistics.risksByLevel.Medium}</h1>
              </div>

              <div className="card risiko biru">
                <span>Risiko Rendah</span>
                <h1>{statistics.risksByLevel.Low}</h1>
              </div>
            </div>
          </>
        )}

        {/* CHART + HEATMAP */}
        <div className="mid-grid">
          <div className="card chart" style={{display: "flex", flexDirection: "column"}}>
            <div className="chart-title">
              <h3>Jumlah Insiden</h3>
            </div>
            <div className="chart-content" style={{flexGrow: 1}}>
              {/* Kolom untuk menampilkan chart */}
              Dummy Chart
            </div>
          </div>
          <div className="card mitigasi" style={{display: "flex", flexDirection: "column"}}>
            <div className="mitigasi-title" style={{flexShrink: 0}}>
              <h3>Penurunan Risiko sesudah Mitigasi</h3>
            </div>
            <div className="mitigasi-content" style={{flexGrow: 1}}>
              Dummy Mitigasi Chart
            </div>
          </div>
          <div className="card heatmap" style={{display: "flex", flexDirection: "column"}}>
            <div className="heatmap-title" style={{flexShrink: 0}}>
              <h3>Heatmap Risiko (Matrix PxD)</h3>
            </div>
            <div className="heatmap-content" style={{flexGrow: 1}}>
              <div className="grid-heatmap">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="heatbox"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LIST + VERIFIKASI + PENGHAPUSAN */}
        <div className="bottom-grid">

          <div className="card jadwal" style={{display: "flex", flexDirection: "column"}}>
            <div className="jadwal-title" style={{flexShrink: 0}}>
              <h3>Jadwal Pemeliharaan</h3>
            </div>
            <div className="jadwal-content" style={{flexGrow: 1}}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
              ) : statistics.maintenances.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Tidak ada jadwal pemeliharaan
                </div>
              ) : (
                statistics.maintenances.map((item) => (
                  <div className="row" key={item.id}>
                    <span>{item.asset?.nama || `Asset #${item.asset_id}`}</span>
                    <button className={item.status_review === 'accepted' ? 'ditangani' : 'proses'}>
                      {item.status_review === 'accepted' ? 'Approved' : 
                       item.status_review === 'pending' ? 'Pending' : 'Rejected'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card verifikasi" style={{display: "flex", flexDirection: "column"}}>
            <div className="verifikasi-title" style={{flexShrink: 0}}>
              <h3>Status Dinas</h3>
            </div>
            <div className="verifikasi-content" style={{flexGrow: 1}}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
              ) : statistics.dinasStats.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Tidak ada data dinas
                </div>
              ) : (
                statistics.dinasStats.map((dinas) => {
                  const percentage = dinas.assetCount > 0 
                    ? Math.round((dinas.assetCount - dinas.pendingCount) / dinas.assetCount * 100)
                    : 100;
                  return (
                    <div key={dinas.id} style={{ marginBottom: '10px' }}>
                      {dinas.name} - {dinas.assetCount} assets ({dinas.pendingCount} pending)
                      <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{percentage}%</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="card notifver" style={{display: "flex", flexDirection: "column"}}>
            <div className="notifver-title" style={{flexShrink: 0}}>
              <h3>Notifikasi Per Dinas</h3>
            </div>
            <div className="notifver-content" style={{flexGrow: 1}}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
              ) : statistics.dinasStats.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Tidak ada notifikasi
                </div>
              ) : (
                statistics.dinasStats.map((dinas) => (
                  <div className="notif-row" key={dinas.id}>
                    <span>{dinas.name}</span>
                    <span className="badge">{dinas.pendingCount}</span>
                    <button className="lihat" onClick={() => alert(`Pending verifications: ${dinas.pendingCount}`)}>
                      Lihat
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card hapus" style={{display: "flex", flexDirection: "column"}}>
            <div className="hapus-title" style={{flexShrink: 0}}>
              <h3>Penghapusan Aset ({statistics.assetDeletions.length})</h3>
            </div>
            <div className="hapus-content" style={{flexGrow: 1}}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
              ) : statistics.assetDeletions.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Tidak ada penghapusan aset
                </div>
              ) : (
                statistics.assetDeletions.map((deletion) => (
                  <div className="hapus-row" key={deletion.id}>
                    <span>{deletion.asset?.nama || `Asset #${deletion.asset_id}`}</span>
                    <button 
                      className="detail"
                      onClick={() => alert(`Asset: ${deletion.asset?.nama}\nReason: ${deletion.alasan_penghapusan}`)}
                    >
                      Detail
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
