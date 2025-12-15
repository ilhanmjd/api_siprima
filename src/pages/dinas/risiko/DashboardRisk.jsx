import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import "./DashboardRisk.css";

export default function DashboardRisk() {
  const navigate = useNavigate();
  const { updateAssetData, assets, loadingAssets, assetsError, fetchAssetsOnce } =
    useAssetContext();

  useEffect(() => {
    fetchAssetsOnce();
  }, []);

  const filteredAssets = (Array.isArray(assets) ? assets : []).filter((asset) => {
    const status = (asset.status || "").toLowerCase();
    return status !== "pending" && status !== "ditolak";
  });

  return (
    <div className="dashboard-risk-page">
      {/* Navbar */}
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
            onClick={() =>
              navigate("/notifikasi-user-dinas")
            }
          >
            🔔
          </div>
        </div>
      </nav>

      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate("/Dashboard")}>
          Dashboard
        </span>{" "}
        {">"} Asset
      </div>

      <div className="content-box">
        <h2 className="content-title">Active Asset List</h2>
        {loadingAssets ? (
          <p>Loading assets...</p>
        ) : assetsError ? (
          <p>{assetsError}</p>
        ) : (
          <div className="risk-list">
            {filteredAssets.length === 0 ? (
              <p>Tidak ada aset aktif.</p>
            ) : (
              filteredAssets.map((asset) => (
                <div className="risk-itempp" key={asset.id || asset.nama}>
                  <span className="risk-name">{asset.nama}</span>
                  <button
                    className="risk-button"
                    onClick={() => {
                      updateAssetData({
                        asset_id: asset.id || asset.asset_id || "",
                      });
                      navigate("/InputRisiko1");
                    }}
                  >
                    Risiko
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
