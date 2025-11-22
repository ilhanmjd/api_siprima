import React from "react";
import { useNavigate } from "react-router-dom";
import "./VerifikasiAcceptMaintenance.css";

export default function VerifikasiAcceptMaintenance() {
  const navigate = useNavigate();

  const maintenanceData = [
    {
      id: "r14a",
      name: "Laptop",
      risk: "LCD Pecah",
      level: "Sedang",
      schedule: "20 Okt 2025",
      status: "",
    },
    {
      id: "d45k",
      name: "Komputer",
      risk: "Komputer Tidak Berfungsi",
      level: "Sedang",
      schedule: "17 Okt 2025",
      status: "",
    },
    {
      id: "c12d",
      name: "Data Cloud",
      risk: "Kebocoran Data",
      level: "Tinggi",
      schedule: "10 Okt 2025",
      status: "",
    },
    {
      id: "v52w",
      name: "Microsoft Word",
      risk: "File Word mengandung malware",
      level: "Tinggi",
      schedule: "7 Okt 2025",
      status: "",
    },
    {
      id: "k990",
      name: "Server",
      risk: "Downtime",
      level: "Sedang",
      schedule: "4 Okt 2025",
      status: "",
    },
    {
      id: "p171",
      name: "Printer",
      risk: "Overheating",
      level: "Sedang",
      schedule: "30 Sept 2025",
      status: "",
    },
    {
      id: "f82j",
      name: "Printer",
      risk: "Kerusakan Hardware",
      level: "Tinggi",
      schedule: "26 Sept 2025",
      status: "",
    },
  ];

  const handleRowClick = (assetId) => {
    // Navigasi ke halaman riwayat pemeliharaan
    // navigate(`/RiwayatPemeliharaan`);
  };

  return (
    <div className="page-bg">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span
            onClick={() => navigate("/Dashboard-verifikator")}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </span>
          <span
            onClick={() => navigate("/notifikasi-verifikator-maintenance")}
            className="active"
            style={{ cursor: "pointer" }}
          >
            Maintenance
          </span>
        </div>
        <div className="navbar-right">
          <div className="icon">🔔</div>
          <div className="profile">👤</div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span
          className="breadcrumb-link"
          onClick={() => navigate("/Dashboard-verifikator")}
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
              {maintenanceData.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 1 ? "row-alt" : ""}
                  onClick={() => handleRowClick(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="asset">
                    {item.id} {item.name}
                  </td>
                  <td>{item.risk}</td>
                  <td>{item.level}</td>
                  <td>{item.schedule}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
