import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import api from "../../../api.js";
import "./notifikasi-verifikator-risiko.css";

export default function NotifikasiVerifikatorRisiko() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const res = await api.getRisks();
        const risks = res?.data?.data ?? res?.data ?? [];
        const filteredRisks = risks.filter((risk) => risk.status === "pending");
        const mappedItems = filteredRisks.map((risk) => ({
          id: risk.id,
          waktu: formatDistanceToNow(new Date(risk.updated_at), {
            addSuffix: true,
          }),
          teks: risk.deskripsi,
        }));
        setItems(mappedItems);
      } catch (error) {
        console.error("Error fetching risks:", error);
      }
    };

    fetchRisks();
  }, []);

  return (
    <div className="notifikasi-verifikator-risiko-page">
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
        {">"} Notifikasi Verifikator Risiko
      </div>

      {/* Content Box dengan daftar notifikasi */}
      <div className="content-box">
        {items.map((item) => (
          <div
            key={item.id}
            className="notif-card"
            onClick={() =>
              navigate("/VerifikasiRisiko1", { state: { id: item.id } })
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
