import React from "react";
import { useNavigate } from "react-router-dom";
import "./notifikasi-verifikator-maintenance.css";

export default function NotifikasiVerifikatorMaintenance() {
  const navigate = useNavigate();

  // 5 item sesuai contoh gambar
  const items = [
    {
      id: 1579,
      waktu: "10 mins ago",
      teks: "Printer Epson L3250 perangkat multifungsi (print, scan, copy) yang digunakan untuk mendukung kegiatan administrasi dan dokumentasi di Dinas Kesehatan.",
    },
    {
      id: 1580,
      waktu: "25 mins ago",
      teks: "Laptop Lenovo ThinkPad untuk mendukung staf dalam kegiatan operasional sehari-hari.",
    },
    {
      id: 1581,
      waktu: "40 mins ago",
      teks: "Meja kerja kayu ukuran besar digunakan untuk ruang Kepala Bidang.",
    },
    {
      id: 1582,
      waktu: "1 hour ago",
      teks: "Kursi ergonomis baru untuk meningkatkan kenyamanan pegawai.",
    },
    {
      id: 1583,
      waktu: "2 hours ago",
      teks: "Proyektor Epson digunakan untuk presentasi di ruang rapat.",
    },
    {
      id: 1579,
      waktu: "10 mins ago",
      teks: "Printer Epson L3250 perangkat multifungsi (print, scan, copy) yang digunakan untuk mendukung kegiatan administrasi dan dokumentasi di Dinas Kesehatan.",
    },
  ];

  return (
    <div className="notifikasi-verifikator-maintenance-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>

        <div className="navbar-center">
          <a href="/Dashboard-verifikator" className="active">
            Dashboard
          </a>
          <a href="/Dashboard-verifikator">Maintenance</a>
        </div>

        <div className="navbar-right">
          <div
            className="icon"
            // onClick={() => navigate("/notifikasi-verifikator")}
          >
            🔔
          </div>
          <div className="profile">👤</div>
        </div>
      </nav>

      <div className="breadcrumb">
        <span
          className="breadcrumb-link"
          onClick={() => navigate("/Dashboard-verifikator")}
        >
          Dashboard
        </span>{" "}
        {">"} Notifikasi Verifikator Maintenance
      </div>

      {/* Content Box dengan daftar notifikasi */}
      <div className="content-box">
        {items.map((item) => (
          <div
            key={item.id}
            className="notif-card"
            onClick={() => navigate("/VerifikasiMaintenance1")} // Assuming a maintenance verification page
            style={{ cursor: "pointer" }}
          >
            <div className="notif-header-row">
              <div className="notif-header-left">
                <span className="notif-title">Dinas</span>
                <span className="notif-id">| {item.id}</span>
              </div>
              <span className="notif-time">{item.waktu}</span>
            </div>
            <div className="notif-text">{item.teks}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
