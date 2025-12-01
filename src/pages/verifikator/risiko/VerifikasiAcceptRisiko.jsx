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
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-scroll">
            <button className="sidebar-btn">Risiko Laptop</button>
            <button className="sidebar-btn">Risiko Komputer</button>
            <button className="sidebar-btn">Data Cloud</button>
            <button className="sidebar-btn">Server</button>
            <button className="sidebar-btn">Microsoft Office</button>
            <button className="sidebar-btn">Router</button>
            <button className="sidebar-btn">Printer</button>
            <button className="sidebar-btn">Firewall</button>
          </div>
        </aside>

        {/* Risiko detail panel */}
        <section className="risiko-detail">
          <div className="risiko-card">
            <div className="risiko-header">
              <h3>Risiko Laptop</h3>
              <span className="risiko-date">10/10/2025 - 17:23:34 PM</span>
            </div>
            <div className="risiko-body">
              <p>
                <b>Kategori</b> :{" "}
              </p>
              <p>
                <b>Nama Risiko</b> :{" "}
              </p>
              <p>
                <b>Kode Risiko</b> :{" "}
              </p>
              <p>
                <b>Person in Change</b> :{" "}
              </p>
              <p className="risiko-id">
                <b>ID RISIKO :</b>
              </p>
              <p>
                <b>Kondisi Risiko</b> :{" "}
              </p>
              <p>
                <b>Deskripsi Risiko</b> :{" "}
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
