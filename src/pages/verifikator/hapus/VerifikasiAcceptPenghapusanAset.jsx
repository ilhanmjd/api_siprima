import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api.js";
import "./VerifikasiAcceptPenghapusanAset.css";

export default function VerifikasiAcceptPenghapusanAset() {
  const navigate = useNavigate();
  const location = useLocation();
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssetDeletion = async () => {
      const id = location.state?.id;
      if (id) {
        try {
          const response = await api.getAssetDeletionById(id);
          const data = response.data.data || response.data;
          setAssetData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchAssetDeletion();
  }, [location.state]);

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>

        <div className="navbar-center">
          <span
            onClick={() => navigate("/Dashboard-verifikator")}
            className="active"
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </span>
          <span
            onClick={() => navigate("/notifikasi-verifikator-maintenance")}
            style={{ cursor: "pointer" }}
          >
            Maintenance
          </span>
        </div>
        <div className="navbar-right">
          {/* <div
            className="icon"
            // onClick={() => navigate("/notifikasi-verifikator-penghapusan-aset")}
          >
            🔔
          </div> */}
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard-verifikator")}>
          Dashboard
        </span>{" "}
        {">"} Accept Penghapusan Aset
      </div>

      {/* Main content */}
      <div className="main-content">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && assetData && (
          <section className="asset-detail">
            <div className="asset-card">
              <div className="asset-header">
                <h3>Penghapusan Aset Diterima</h3>
                <span className="asset-date">{assetData.updated_at || ""}</span>
              </div>

              <div className="asset-body">
                <p>
                  <b>Kategori</b> : {assetData.asset?.kategori?.nama || ""}
                </p>
                <p>
                  <b>Nama Asset</b> : {assetData.asset?.nama || ""}
                </p>
                <p>
                  <b>Kode Asset</b> : {assetData.asset?.kode_bmd || ""}
                </p>

                <p>
                  <b>ID ASSET :</b> {assetData.asset?.id || ""}
                </p>

                <p>
                  <b>Alasan Penghapusan</b> :{" "}
                  {assetData.alasan_penghapusan || ""}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
