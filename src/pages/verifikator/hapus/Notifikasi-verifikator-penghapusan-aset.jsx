import React from "react";
import { useNavigate } from "react-router-dom";
import "./Notifikasi-verifikator-penghapusan-aset.css";

export default function NotifikasiVerifikatorPenghapusanAset() {
  const navigate = useNavigate();

  const items = [
    {
      id: 2101,
      waktu: "12 mins ago",
      teks: "Pengajuan penghapusan Printer Epson L3250 karena kondisi rusak berat dan tidak bisa diperbaiki.",
    },
    {
      id: 2102,
      waktu: "30 mins ago",
      teks: "Laptop ASUS lama diajukan untuk penghapusan karena performa tidak lagi memadai.",
    },
    {
      id: 2103,
      waktu: "1 hour ago",
      teks: "Meja kerja kayu rusak pada bagian kaki dan diajukan untuk penghapusan.",
    },
    {
      id: 2104,
      waktu: "2 hours ago",
      teks: "Kursi staf rusak pada bagian sandaran dan tidak layak digunakan, diajukan untuk penghapusan.",
    },
    {
      id: 2105,
      waktu: "3 hours ago",
      teks: "Proyektor lama diajukan untuk penghapusan karena kualitas gambar sudah tidak layak.",
    },
  ];

  return (
    <div className="notifikasi-verifikator-penghapusan-page">
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
          <div className="icon">🔔</div>
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
        {">"} Notifikasi Penghapusan Aset
      </div>

      <div className="content-box">
        {items.map((item) => (
          <div
            key={item.id}
            className="notif-card"
            onClick={() => navigate("/verifikator-penghapusan-aset")}
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
