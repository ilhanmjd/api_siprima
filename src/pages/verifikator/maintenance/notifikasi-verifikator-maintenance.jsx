import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api.js";
import "./notifikasi-verifikator-maintenance.css";

export default function NotifikasiVerifikatorMaintenance() {
  const navigate = useNavigate();
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to convert timestamp to relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now - time;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const response = await api.getMaintenances();
        const maintenanceData = response.data.data || response.data;
        setMaintenances(Array.isArray(maintenanceData) ? maintenanceData : []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching maintenances:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenances();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="notifikasi-verifikator-maintenance-page">
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
          {/* <div
            className="icon"
            // onClick={() => navigate("/notifikasi-verifikator")}
          >
            🔔
          </div> */}
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
        {maintenances.map((maintenance) => (
          <div
            key={maintenance.id}
            className="notif-card"
            onClick={() =>
              navigate("/VerifikasiMaintenance1", {
                state: { id: maintenance.id },
              })
            } // Passing maintenance id
            style={{ cursor: "pointer" }}
          >
            <div className="notif-header-row">
              <div className="notif-header-left">
                <span className="notif-title">Dinas</span>
                <span className="notif-id">| {maintenance.id}</span>
              </div>
              <span className="notif-time">
                {getRelativeTime(maintenance.updated_at)}
              </span>
            </div>
            <div className="notif-text">
              {maintenance.alasan_pemeliharaan || "Tidak ada alasan"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
