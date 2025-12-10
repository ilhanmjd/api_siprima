import React from "react";
import { useNavigate } from "react-router-dom";
import "./JadwalPemeliharaan.css";

export default function JadwalPemeliharaan() {
  const navigate = useNavigate();

  return (
    <div className="page-bg">
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
            onClick={() => navigate("/notifikasi-user-dinas")}
          >
            🔔
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span
          className="breadcrumb-link"
          onClick={() => navigate("/Dashboard")}
        >
          Dashboard
        </span>{" "}
        {">"} Jadwal Pemeliharaan
      </div>

      {/* Title */}
      <div className="title-container">
        <h1 className="title">Jadwal Pemeliharaan</h1>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-card">
          <div className="table-header-actions">
            <button className="btn-laporan">
              Laporan <i className="fas fa-plus-circle"></i>
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Id - Nama Aset</th>
                <th>Risiko</th>
                <th>Level</th>
                <th>Jadwal</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                onClick={() => navigate("/RiwayatPemeliharaan")}
                style={{ cursor: "pointer" }}
              >
                <td className="asset">r14a Laptop</td>
                <td>LCD Pecah</td>
                <td>Sedang</td>
                <td>20 Okt 2025</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
