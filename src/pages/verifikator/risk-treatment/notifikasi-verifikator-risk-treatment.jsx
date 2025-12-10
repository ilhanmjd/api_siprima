import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api.js";
import "./notifikasi-verifikator-risk-treatment.css";

export default function NotifikasiVerifikatorRiskTreatment() {
  const navigate = useNavigate();
  const [riskTreatments, setRiskTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to convert timestamp to relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const updatedAt = new Date(timestamp);
    const diffInMs = now - updatedAt;
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
    const fetchRiskTreatments = async () => {
      try {
        const response = await api.getRiskTreatments();
        const allTreatments = response?.data?.data || response?.data || [];
        // Filter hanya yang status "pending"
        const pendingTreatments = allTreatments.filter(
          (treatment) => treatment.status === "pending"
        );
        setRiskTreatments(pendingTreatments);
      } catch (err) {
        console.error("Error fetching risk treatments:", err);
        setError("Gagal memuat data risk treatment");
      } finally {
        setLoading(false);
      }
    };

    fetchRiskTreatments();
  }, []);

  return (
    <div className="notifikasi-verifikator-risk-treatment-page">
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
        {">"} Notifikasi Verifikator Risk Treatment
      </div>

      {/* Content Box dengan daftar notifikasi */}
      <div className="content-box">
        {loading ? (
          <div className="loading">Memuat data risk treatment...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : riskTreatments.length === 0 ? (
          <div className="no-data">Tidak ada data risk treatment</div>
        ) : (
          riskTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="notif-card"
              onClick={() =>
                navigate("/VerifikasiRiskTreatment1", {
                  state: { id: treatment.id },
                })
              }
              style={{ cursor: "pointer" }}
            >
              <div className="notif-header-row">
                <div className="notif-header-left">
                  <span className="notif-title">Dinas</span>
                  <span className="notif-id">| {treatment.id}</span>
                </div>
                <span className="notif-time">
                  {treatment.updated_at
                    ? getRelativeTime(treatment.updated_at)
                    : "Waktu tidak tersedia"}
                </span>
              </div>
              <div className="notif-text">
                {treatment.pengendalian || "Deskripsi tidak tersedia"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
