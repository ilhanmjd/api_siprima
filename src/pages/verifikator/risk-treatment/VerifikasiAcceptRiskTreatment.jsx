import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api.js";
import "./VerifikasiAcceptRiskTreatment.css";

export default function VerifikasiAcceptRiskTreatment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [riskTreatmentData, setRiskTreatmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskTreatmentData = async () => {
      const id = location.state?.id;
      if (id) {
        try {
          const res = await api.getRiskTreatmentById(id);
          const riskTreatment = res?.data?.data ?? res?.data;
          setRiskTreatmentData(riskTreatment);
        } catch (err) {
          console.error("Error fetching risk treatment data:", err);
          setError("Gagal memuat data risk treatment");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("ID risk treatment tidak ditemukan");
      }
    };

    fetchRiskTreatmentData();
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
        {/* Risk Treatment detail panel */}
        <section className="risiko-detail">
          {loading ? (
            <div className="loading">Memuat data risk treatment...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : riskTreatmentData ? (
            <div className="risiko-card">
              <div className="risiko-header">
                <h3>{riskTreatmentData.nama_risiko || "Risk Treatment"}</h3>
                <span className="risiko-date">
                  {riskTreatmentData.created_at
                    ? new Date(riskTreatmentData.updated_at).toLocaleString()
                    : "Tanggal tidak tersedia"}
                </span>
              </div>
              <div className="risiko-body">
                <p>
                  <b>Strategi</b> : {riskTreatmentData.strategi || ""}
                </p>
                <p>
                  <b>Pengendalian</b> : {riskTreatmentData.pengendalian || ""}
                </p>
                <p>
                  <b>Penanggung Jawab</b> :{" "}
                  {riskTreatmentData.penanggungjawab?.nama || ""}
                </p>
                <p>
                  <b>Target Tanggal</b> :{" "}
                  {riskTreatmentData.target_tanggal
                    ? new Date(
                        riskTreatmentData.target_tanggal
                      ).toLocaleDateString()
                    : ""}
                </p>
                <p>
                  <b>Biaya</b> :{" "}
                  {riskTreatmentData.biaya
                    ? `Rp ${riskTreatmentData.biaya.toLocaleString()}`
                    : ""}
                </p>
                <p>
                  <b>Probabilitas Akhir</b> :{" "}
                  {riskTreatmentData.probabilitas_akhir || ""}
                </p>
                <p>
                  <b>Dampak Akhir</b> : {riskTreatmentData.dampak_akhir || ""}
                </p>
                <p>
                  <b>Level Residual</b> :{" "}
                  {riskTreatmentData.level_residual || ""}
                </p>
                <p>
                  <b>Status</b> : {riskTreatmentData.status || ""}
                </p>
                <h4>Risiko Terkait:</h4>
                <p>
                  <b>Judul</b> : {riskTreatmentData.risk?.judul || ""}
                </p>
                <p>
                  <b>Deskripsi</b> : {riskTreatmentData.risk?.deskripsi || ""}
                </p>
                <h4>Aset Terkait:</h4>
                <p>
                  <b>Nama Aset</b> : {riskTreatmentData.risk?.asset?.nama || ""}
                </p>
                <p>
                  <b>Kode BMD</b> :{" "}
                  {riskTreatmentData.risk?.asset?.kode_bmd || ""}
                </p>
              </div>
            </div>
          ) : (
            <div className="no-data">Data risk treatment tidak ditemukan</div>
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
