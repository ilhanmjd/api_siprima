import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../contexts/AssetContext";
import "./dashboard-diskominfo.css";

export default function DashboardDiskominfo() {
  const navigate = useNavigate();
  const { resetAssetData, loading, error, assets, risks } = useAssetContext();

  useEffect(() => {
    resetAssetData();
  }, [resetAssetData]);

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear localStorage and navigate even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
              <div className="grid-header">Judul Grid 3</div>
              <div className="grid-content"></div>
            </div>

            <div className="grid4 white-column">
              <div className="grid-header">Judul Grid 4</div>
              <div className="grid-content"></div>
            </div>
          </div>

          <div className="grid2 grid-vertical">
            <div className="grid5 grids-horizontal">
              <div className="grid8 white-column">
                <div className="grid-header">Judul Grid 8</div>
                <div className="grid-content"></div>
              </div>

              <div className="grid9 white-column">
                <div className="grid-header">Judul Grid 9</div>
                <div className="grid-content"></div>
              </div>
            </div>

            <div className="grid6 white-column">
              <div className="grid-header">Judul Grid 6</div>
              <div className="grid-content"></div>
            </div>

            <div className="grid7 white-column">
              <div className="grid-header">Judul Grid 7</div>
              <div className="grid-content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
