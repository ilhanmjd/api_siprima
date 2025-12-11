import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JadwalPemeliharaan.css";
import api from "../../../api";

export default function JadwalPemeliharaan() {
  const navigate = useNavigate();
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchMaintenances = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getMaintenances();
        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];

        const acceptedMaintenances = data.filter(
          (item) => item.status_review === "accepted"
        );

        if (!cancelled) {
          setMaintenances(acceptedMaintenances);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Gagal memuat jadwal pemeliharaan.");
          setMaintenances([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMaintenances();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page-bg">
      {/* Navbar */}
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

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span
          className="breadcrumb-link"
          onClick={() => navigate("/Dashboard")}
        >
          Dashboard
        </span>{" "}
        {">"} Jadwal Pemeliharaan
      </div>

      {/* Title */}
      <div className="title-container">
        <h1 className="title">Jadwal Pemeliharaan</h1>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-card">
          <div className="table-header-actions">
            <button className="btn-laporan" onClick={() => navigate("/Riwayatpemeliharaan")}>
              Laporan <i className="fas fa-plus-circle"></i>
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Id - Nama Aset</th>
                <th>Risiko</th>
                <th>Level</th>
                <th>Jadwal</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5">{error}</td>
                </tr>
              ) : maintenances.length === 0 ? (
                <tr>
                  <td colSpan="5">Tidak ada jadwal pemeliharaan.</td>
                </tr>
              ) : (
                maintenances.map((item, index) => (
                  <tr>
                    <td className="asset">
                      {(item.asset_id ?? "") +
                        " - " +
                        (item.asset?.nama ?? "")}
                    </td>
                    <td>{item.risk?.judul ?? ""}</td>
                    <td>{item.risk?.kriteria ?? ""}</td>
                    <td>
                      {item.target_tanggal
                        ? new Date(item.target_tanggal).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : ""}
                    </td>
                    <td>{item.status_pemeliharaan ?? ""}</td>
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
