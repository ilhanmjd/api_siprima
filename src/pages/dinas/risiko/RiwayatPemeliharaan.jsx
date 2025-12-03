import React from "react";
import { useNavigate } from "react-router-dom";
import "./RiwayatPemeliharaan.css";

export default function RiwayatPemeliharaan() {
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
        {">"} Riwayat Pemeliharaan
      </div>

      {/* Title */}
      <div className="title-container">
        <h1 className="title">Laporan Pemeliharaan Aset</h1>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <select className="filter-select">
          <option>Oktober 2025</option>
        </select>

        <select className="filter-select">
          <option>Semua Status</option>
        </select>

        <select className="filter-select">
          <option>Semua Jenis</option>
        </select>

        <button className="btn-search">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {/* Table */}
      <div className="riwayat-table-container">
        <table className="riwayat-table">
          <thead>
            <tr>
              <th>ID Aset</th>
              <th>Nama Aset</th>
              <th>Jenis Pemeliharaan</th>
              <th>Tanggal</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1038u1031lje01</td>
              <td>Komputer</td>
              <td>Pergantian ti</td>
              <td>14 Januari 2023</td>
              <td>
                <span className="badge-red">Penanganan</span>
              </td>
            </tr>

            <tr>
              <td>102u3198y2312</td>
              <td>Laptop</td>
              <td>Servis Rutin</td>
              <td>25 Januari 2004</td>
              <td>
                <span className="badge-green">Selesai</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detail Box */}
      <div className="detail-box">
        <h2 className="detail-title">Laporan Pemeliharaan Aset</h2>

        <div className="detail-content">
          <p>
            <strong>ID Aset</strong> :{" "}
          </p>
          <p>
            <strong>Nama</strong> :{" "}
          </p>
          <p>
            <strong>Tanggal</strong> :{" "}
          </p>
          <p>
            <strong>Pelaksana</strong> :{" "}
          </p>
          <p>
            <strong>Deskripsi</strong> :{" "}
          </p>
          <p>
            <strong>Status</strong> :{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
