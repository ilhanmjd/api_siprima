import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api.js";
import "./VerifikasiAcceptRisiko.css";

export default function VerifikasiAcceptRisiko() {
  const navigate = useNavigate();
  const location = useLocation();
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskData = async () => {
      const id = location.state?.id;
      if (id) {
        try {
          const res = await api.getRiskById(id);
          const risk = res?.data?.data ?? res?.data;
          setRiskData(risk);
        } catch (err) {
          console.error("Error fetching risk data:", err);
          setError("Gagal memuat data risiko");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("ID risiko tidak ditemukan");
      }
    };

    fetchRiskData();
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
        {">"} Notification
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Risiko detail panel */}
        <section className="risiko-detail">
          {loading ? (
            <div className="loading">Memuat data risiko...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : riskData ? (
            <div className="risiko-card">
              <div className="risiko-header">
                <h3>{riskData.nama_risiko || "Risiko"}</h3>
                <span className="risiko-date">
                  {riskData.created_at
                    ? new Date(riskData.updated_at).toLocaleString()
                    : "Tanggal tidak tersedia"}
                </span>
              </div>
              <div className="risiko-body">
                <p>
                  <b>Sub Kategori</b> : {riskData.sub_kategori?.nama || ""}
                </p>
                <p>
                  <b>Kategori Risiko</b> :{" "}
                  {riskData.kategori_risiko?.nama || ""}
                </p>
                <p>
                  <b>Dampak Risiko</b> : {riskData.dampak_risiko || ""}
                </p>
                <p>
                  <b>Level Risiko</b> : {riskData.level_risiko || ""}
                </p>
                <p>
                  <b>Penanggung Jawab</b> :{" "}
                  {riskData.penanggung_jawab?.nama || ""}
                </p>
                <p>
                  <b>Probabilitas</b> : {riskData.probabilitas || ""}
                </p>
                <p>
                  <b>Deskripsi</b> : {riskData.deskripsi || ""}
                </p>
                <p className="risiko-id">
                  <b>ID Risiko</b> : {riskData.id || ""}
                </p>
              </div>
            </div>
          ) : (
            <div className="no-data">Data risiko tidak ditemukan</div>
          )}

          {/* <button
            className="risk-btn"
            onClick={() => navigate("/InputRisiko1")}
          >
            Risiko
          </button> */}
        </section>
      </div>
    </div>
  );
}
