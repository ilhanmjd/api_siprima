import React from "react";
import { useNavigate } from "react-router-dom";
import "./service-desk.css";

export default function ServiceDesk() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>

        <div className="navbar-center">
          <span onClick={() => navigate("/Dashboard")}>Dashboard</span>
          <span className="active" onClick={() => navigate("/service-desk")}>Requests</span>
          <span onClick={() => navigate("/laporan")}>Laporan</span>
          <span onClick={() => navigate("/faq")}>FAQ</span>
        </div>

        <div className="navbar-right">
          <div
            className="icon"
            onClick={() => navigate("/notifikasi-user-dinas")}
          >
            🔔
          </div>
          
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <span
          className="breadcrumb-link"
          onClick={() => navigate("/Dashboard")}
        >
          Dashboard
        </span>{" "}
        &gt; Service Desk
      </div>

      {/* MAIN CARD */}
      <div className="service-card">
        <div className="service-card-header">
          <img
            src="/logo.png"
            alt="SIPRIMA logo"
            className="service-card-logo"
          />
          <h2 className="service-title">SIPRIMA</h2>
        </div>

        <h1 className="section-title">Asset and Risk</h1>

        <p className="section-description">
          Your service request link has been generated
        </p>

        <button className="generate-link-btn">Generate Link</button>

        {/* Decorative Shapes */}
        <div className="shape-orange"></div>
        <div className="shape-pink"></div>
      </div>
    </div>
  );
}
