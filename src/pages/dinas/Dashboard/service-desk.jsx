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
          <a href="/Dashboard" onClick={(e) => handleNav(e, "/Dashboard")}>
            Dashboard
          </a>

          <a
            href="/service-desk"
            className="active"
            onClick={(e) => handleNav(e, "/service-desk")}
          >
            Requests
          </a>

          <a href="/faq" onClick={(e) => handleNav(e, "/faq")}>
            FAQ
          </a>
        </div>

        <div className="navbar-right">
          <div
            className="icon"
            onClick={() => navigate("/notifikasi-user-dinas")}
          >
            🔔
          </div>
          <div className="profile">👤</div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="breadcrumb">Request &gt; Service Desk</div>

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
