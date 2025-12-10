import React from "react";
import { useNavigate } from "react-router-dom";
import "./VerifikasiAcceptRisiko.css";

export default function VerifikasiAcceptRisiko() {
  const navigate = useNavigate();

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
          <div className="risiko-card">
            <div className="risiko-header">
              <h3>Risiko Laptop</h3>
              <span className="risiko-date">10/10/2025 - 17:23:34 PM</span>
            </div>
            <div className="risiko-body">
              <p>
                <b>Sub Kategori</b> :{" "}
              </p>
              <p>
                <b>Kategori Risiko</b> :{" "}
              </p>
              <p>
                <b>Dampak Risiko</b> :{" "}
              </p>
              <p>
                <b>Level Risiko</b> :{" "}
              </p>
              <p>
                <b>Penanggung Jawab</b> :{" "}
              </p>
              <p>
                <b>Probabilitas</b> :{" "}
              </p>
              <p>
                <b>Deskripsi</b> :{" "}
              </p>
              <p className="risiko-id">
                <b>ID Risiko</b> :
              </p>
            </div>
          </div>

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
