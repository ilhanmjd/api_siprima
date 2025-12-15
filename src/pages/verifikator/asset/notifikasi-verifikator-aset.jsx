import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import api from "../../../api.js";
import "./notifikasi-verifikator-aset.css";

export default function NotifikasiVerifikatorAset() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.getAssets();
        const mappedItems = (response.data.data || response.data)
          .filter((asset) => asset.status === "pending")
          .map((asset) => ({
            id: asset.id,
            waktu: formatDistanceToNow(new Date(asset.updated_at), {
              addSuffix: true,
            }),
            teks: asset.deskripsi,
          }));

        setItems(mappedItems);
      } catch (err) {
        console.error("Error fetching assets:", err);
      }
    };
    fetchAssets();
  }, []);

  return (
    <div className="notifikasi-verifikator-aset-page">
      {/* Navbar */}
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
            onClick={() => navigate("/notifikasi-verifikator")}
          >
            🔔
          </div> */}
        </div>
      </nav>

      <div className="breadcrumb">
        <span
          className="breadcrumb-link"
          onClick={() => navigate("/Dashboard-verifikator")}
          style={{
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Dashboard
        </span>{" "}
        {">"} Notifikasi Verifikator Aset
      </div>

      {/* Content Box dengan daftar notifikasi */}
      <div className="content-box">
        {items.map((item) => (
          <div
            key={item.id}
            className="notif-card"
            onClick={() =>
              navigate("/VerifikasiAset1", { state: { id: item.id } })
            }
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
