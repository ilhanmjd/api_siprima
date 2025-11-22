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
          <span className="active" onClick={() => navigate("/Dashboard")}>
            Dashboard
          </span>

          <span onClick={() => navigate("/service-desk")}>Requests</span>
          <span onClick={() => navigate("/faq")}>FAQ</span>
        </div>

        <div className="navbar-right">
          <div
            className="icon"
            onClick={() => navigate("/notifikasi-user-dinas")}
          >
            🔔
          </div>
          <div className="profile">👤</div>
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

              <tr
                className="row-alt"
                onClick={() => navigate("/RiwayatPemeliharaan")}
                style={{ cursor: "pointer" }}
              >
                <td className="asset">d45k Komputer</td>
                <td>Komputer Tidak Berfungsi</td>
                <td>Sedang</td>
                <td>17 Okt 2025</td>
                <td></td>
              </tr>

              <tr
                onClick={() => navigate("/RiwayatPemeliharaan")}
                style={{ cursor: "pointer" }}
              >
                <td className="asset">c12d Data Cloud</td>
                <td>Kebocoran Data</td>
                <td>Tinggi</td>
                <td>10 Okt 2025</td>
                <td></td>
              </tr>

              <tr
                className="row-alt"
                onClick={() => navigate("/RiwayatPemeliharaan")}
                style={{ cursor: "pointer" }}
              >
                <td className="asset">v52w Microsoft Word</td>
                <td>File Word mengandung malware</td>
                <td>Tinggi</td>
                <td>7 Okt 2025</td>
                <td></td>
              </tr>

              <tr
                onClick={() => navigate("/RiwayatPemeliharaan")}
                style={{ cursor: "pointer" }}
              >
                <td className="asset">k990 Server</td>
                <td>Downtime</td>
                <td>Sedang</td>
                <td>4 Okt 2025</td>
                <td></td>
              </tr>

              <tr
                className="row-alt"
                onClick={() => navigate("/RiwayatPemeliharaan")}
                style={{ cursor: "pointer" }}
              >
                <td className="asset">p171 Printer</td>
                <td>Overheating</td>
                <td>Sedang</td>
                <td>30 Sept 2025</td>
                <td></td>
              </tr>

              <tr
                onClick={() => navigate("/RiwayatPemeliharaan")}
                style={{ cursor: "pointer" }}
              >
                <td className="asset">f82j Printer</td>
                <td>Kerusakan Hardware</td>
                <td>Tinggi</td>
                <td>26 Sept 2025</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
