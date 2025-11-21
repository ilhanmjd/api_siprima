import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./faq.css";

export default function FAQ() {
  const navigate = useNavigate();

  const [openIndex, setOpenIndex] = useState(-1);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  const faqData = [
    {
      q: "Bagaimana cara menambahkan aset?",
      a: "Masuk menu Inventarisasi › Input Aset, isi form wizard sampai selesai. Setelah dikonfirmasi, form akan dikirim kepada verifikator",
    },
    { q: "Siapa yang boleh menginput Risiko?", a: "" },
    { q: "Bagaimana cara melakukan Risk Treatment?", a: "" },
    { q: "Apakah pemeliharaan otomatis tersambung ke Service Desk?", a: "" },
  ];

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
            onClick={(e) => handleNav(e, "/service-desk")}
          >
            Requests
          </a>

          <a
            href="/faq"
            className="active"
            onClick={(e) => handleNav(e, "/faq")}
          >
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

      {/* Breadcrumb */}
      <div className="breadcrumb">Dashboard &gt; FAQ</div>

      {/* FAQ CONTAINER */}
      <div className="faq-wrapper">
        <h2 className="faq-title">Frequently Asked Questions</h2>

        <div className="faq-box">
          {faqData.map((item, i) => (
            <div key={i} className="faq-item">
              <div className="faq-question" onClick={() => toggle(i)}>
                <span>{item.q}</span>
                <span className="arrow">{openIndex === i ? "▾" : "▸"}</span>
              </div>

              {openIndex === i && (
                <div className="faq-answer">{item.a || "—"}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
