import React from "react";
import { useNavigate } from "react-router-dom";
import "./VerifikasiAcceptPenghapusanAset.css";

export default function VerifikasiAcceptPenghapusanAset() {
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
            // onClick={() => navigate("/notifikasi-verifikator-penghapusan-aset")}
          >
            🔔
          </div> */}
          <div className="profile">👤</div>
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
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-scroll">
            <button className="sidebar-btn">Aset Laptop</button>
            <button className="sidebar-btn">Aset Komputer</button>
            <button className="sidebar-btn">Data Cloud</button>
            <button className="sidebar-btn">Server</button>
            <button className="sidebar-btn">Microsoft Office</button>
            <button className="sidebar-btn">Router</button>
            <button className="sidebar-btn">Printer</button>
            <button className="sidebar-btn">Firewall</button>
          </div>
        </aside>

        {/* Asset detail */}
        <section className="asset-detail">
          <div className="asset-card">
            <div className="asset-header">
              <h3>Penghapusan Aset Diterima</h3>
              <span className="asset-date">10/10/2025 - 17:23:34 PM</span>
            </div>

            <div className="asset-body">
              <p>
                <b>Kategori</b> :{" "}
              </p>
              <p>
                <b>Nama Asset</b> :{" "}
              </p>
              <p>
                <b>Kode Asset</b> :{" "}
              </p>
              <p>
                <b>Person in Charge</b> :{" "}
              </p>

              <p className="asset-id">
                <b>ID ASSET :</b>
              </p>

              <p>
                <b>Alasan Penghapusan</b> :{" "}
              </p>
              <p>
                <b>Status</b> : Penghapusan Disetujui
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
