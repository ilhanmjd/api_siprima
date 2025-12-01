import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardRisk.css";

export default function DashboardRisk() {
  const navigate = useNavigate();
  const items = [
    { name: "Aset Laptop" },
    { name: "Aset Komputer" },
    { name: "Data Cloud" },
    { name: "Server" },
  ];

  return (
    <div className="dashboard-risk-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span className="active" onClick={() => navigate("/Dashboard")}>Dashboard</span>

          <span onClick={() => navigate("/service-desk")}>Requests</span>
          <span onClick={() => navigate("/faq")}>FAQ</span>
        </div>
        <div className="navbar-right">
          <div
            className="icon"
            onClick={() =>
              navigate("/notifikasi-user-dinas")
            }
          >
            🔔
          </div>
        </div>
      </nav>

      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate("/Dashboard")}>
          Dashboard
        </span>{" "}
        {">"} Asset
      </div>

      <div className="content-box">
        <h2 className="content-title">Active Asset List</h2>
        <div className="risk-list">
          {items.map((item, index) => (
            <div className="risk-item" key={index}>
              <span className="risk-name">{item.name}</span>
              <button
                className="risk-button"
                onClick={() => navigate("/InputRisiko1")}
              >
                Risiko
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
