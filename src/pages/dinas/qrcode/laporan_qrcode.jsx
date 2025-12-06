import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api.js";
import "./laporan_qrcode.css";

export default function Laporan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get("id_asset");

  // State untuk menampung data dari API
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = ["ID Asset", "Nama Aset", "Dinas", "Tanggal", "Status", "Download"];
  const rows = asset ? [asset] : [];

  const handleDownloadAsset = (asset) => {
    if (asset?.lampiran_url) {
      window.open(asset.lampiran_url, "_blank");
    } else {
      alert("Lampiran tidak tersedia untuk aset ini.");
    }
  };

  // Fetch API berdasarkan id_asset
  useEffect(() => {
    if (!assetId) return;

    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getAssetById(assetId, {
          signal: controller.signal,
        });

        // Hasil API memiliki field: id (id asli asset)
        if (!controller.signal.aborted) {
          setAsset(response.data?.data || null);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setError("Gagal memuat data aset. Silakan coba lagi.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

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
                  <tr key={item?.id}>
                    <td>{item?.id || "-"}</td>
                    <td>{item?.nama || "-"}</td>
                    <td>{item?.lokasi?.nama || "-"}</td>
                    <td>
                      {item?.tgl_perolehan
                        ? new Date(item.tgl_perolehan).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="status-tag">{item?.is_usage || "-"}</td>
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
