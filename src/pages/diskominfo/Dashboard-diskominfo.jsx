import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../contexts/AssetContext";
import api from "../../api";
import "./dashboard-diskominfo.css";

export default function DashboardDiskominfo() {
  const navigate = useNavigate();
  const { resetAssetData } = useAssetContext();
  const logoutControllerRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    assetsByStatus: { pending: 0, diterima: 0, ditolak: 0 },
    totalRisks: 0,
    risksByLevel: { High: 0, Medium: 0, Low: 0 },
    pendingDeletions: 0,
    acceptedDeletions: 0
  });

  useEffect(() => {
    resetAssetData();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    return () => {
      logoutControllerRef.current?.abort();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [assetsRes, risksRes, deletionsRes] = await Promise.all([
        api.getAssets(),
        api.getRisks(),
        api.getAssetDeletions()
      ]);

      const assets = assetsRes.data.data || [];
      const risks = risksRes.data.data || [];
      const deletions = deletionsRes.data.data || [];

      // Calculate statistics
      const stats = {
        totalAssets: assets.length,
        assetsByStatus: {
          pending: assets.filter(a => a.status === 'pending').length,
          diterima: assets.filter(a => a.status === 'diterima').length,
          ditolak: assets.filter(a => a.status === 'ditolak').length
        },
        totalRisks: risks.length,
        risksByLevel: {
          High: risks.filter(r => r.kriteria === 'High').length,
          Medium: risks.filter(r => r.kriteria === 'Medium').length,
          Low: risks.filter(r => r.kriteria === 'Low').length
        },
        pendingDeletions: deletions.filter(d => d.status === 'pending').length,
        acceptedDeletions: deletions.filter(d => d.status === 'accepted').length
      };

      setStatistics(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const controller = new AbortController();
    logoutControllerRef.current = controller;
    try {
      await api.logout({ signal: controller.signal });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    } catch (err) {
      if (controller.signal.aborted) return;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    }
  };

  if (loading) return <div className="dashboard-container"><div className="loading">Loading dashboard data...</div></div>;

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span
            className="active"
            onClick={() => navigate("/dashboard-diskominfo")}
          >
            Dashboard
          </span>
          <span onClick={() => navigate("/notifikasi-diskominfo")}>
            Asset Removal
          </span>
        </div>

        <div className="navbar-right">
          <div className="icon" onClick={() => navigate("")}>
            🔔
          </div>
          <div className="icon" onClick={handleLogout}><img src="/logout.png" alt="Logout" className="logo" /></div>
        </div>
      </nav>

      {/* Content */}
      <div className="content">
        <h1 className="title">Dashboard</h1>

        {/* Grids container */}
        <div className="grids-horizontal">
          <div className="grid1 grid-vertical">
            <div className="grid3 white-column">
              <div className="grid-header">Total Assets: {statistics.totalAssets}</div>
              <div className="grid-content"></div>
            </div>

            <div className="grid4 white-column">
              <div className="grid-header">Total Risks: {statistics.totalRisks}</div>
              <div className="grid-content"></div>
            </div>
          </div>

          <div className="grid2 grid-vertical">
            <div className="grid5 grids-horizontal">
              <div className="grid8 white-column">
                <div className="grid-header">High: {statistics.risksByLevel.High}</div>
                <div className="grid-content"></div>
              </div>

              <div className="grid9 white-column">
                <div className="grid-header">Medium: {statistics.risksByLevel.Medium}</div>
                <div className="grid-content"></div>
              </div>
            </div>

            <div className="grid6 white-column">
              <div className="grid-header">Pending Deletions: {statistics.pendingDeletions}</div>
              <div className="grid-content"></div>
            </div>

            <div className="grid7 white-column">
              <div className="grid-header">Accepted Deletions: {statistics.acceptedDeletions}</div>
              <div className="grid-content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
