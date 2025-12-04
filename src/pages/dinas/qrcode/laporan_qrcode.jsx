import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./laporan_qrcode.css";



export default function Laporan() {
  const navigate = useNavigate();
  const [assets] = useState([
    {
      id: 1,
      nama: 'Komputer Kantor',
      dinas: { nama: 'Dinas Komunikasi dan Informatika' },
      tanggal_perolehan: '2023-01-15',
      status: 'active',
      lampiran_url: 'http://example.com/lampiran1.pdf'
    },
  ]);

  const handleDownloadAsset = (asset) => {
    if (asset?.lampiran_url) {
      window.open(asset.lampiran_url, "_blank");
    } else {
      alert("Lampiran tidak tersedia untuk aset ini.");
    }
  };

  const rows = assets;
  const loading = false;
  const error = null;
  const headers = ["Nama Aset", "Dinas", "Tanggal", "Status", "Download"];

  return (
    <div className="laporan-page">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span onClick={() => navigate("/Dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/service-desk")}>Requests</span>
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

      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard")} className="breadcrumb-link">
          Dashboard
        </span>{" "}
        {">"} Laporan
      </div>

      <div className="laporan-card">
        <div className="laporan-header">
          <h2>Laporan Aset</h2>
          <p>Laporan data aset.</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <div className="laporan-table">
          <table>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={headers.length} className="laporan-placeholder">
                    Memuat data aset...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="laporan-placeholder">
                    Tidak ada data aset.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item?.asset_id ?? item?.id}>
                    <td>{item?.nama || item?.nama_aset || "-"}</td>
                    <td>{item?.dinas?.nama || item?.dinas || "-"}</td>
                    <td>
                      {item?.tanggal_perolehan
                        ? new Date(item.tanggal_perolehan).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="status-tag">{item?.status || "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="download-btn"
                        onClick={() => handleDownloadAsset(item)}
                        disabled={!item?.lampiran_url}
                        style={{ borderRadius: '10px' }}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
