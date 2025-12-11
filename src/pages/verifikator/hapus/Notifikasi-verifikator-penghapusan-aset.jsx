import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api.js";
import "./Notifikasi-verifikator-penghapusan-aset.css";

export default function NotifikasiVerifikatorPenghapusanAset() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getRelativeTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  useEffect(() => {
    const fetchDeletions = async () => {
      try {
        const response = await api.getAssetDeletions();
        const data = response.data.data || response.data;
        const filteredData = data.filter((item) => item.status === "pending");
        const sortedData = filteredData.sort((a, b) => a.id - b.id);
        const mappedItems = sortedData.map((item) => ({
          id: item.id,
          waktu: getRelativeTime(item.updated_at),
          teks: item.alasan_penghapusan,
        }));

        setItems(mappedItems);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDeletions();
  }, []);

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
          {/* <div className="icon">🔔</div> */}
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
        {loading && <div></div>}
        {error && <div>Error: {error}</div>}
        {!loading &&
          !error &&
          items.map((item) => (
            <div
              key={item.id}
              className="notif-card"
              onClick={() =>
                navigate("/verifikator-penghapusan-aset", {
                  state: { id: item.id },
                })
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
