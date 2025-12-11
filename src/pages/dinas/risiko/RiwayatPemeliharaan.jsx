import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RiwayatPemeliharaan.css";
import api from "../../../api";

export default function RiwayatPemeliharaan() {
  const navigate = useNavigate();
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

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
          if (acceptedMaintenances.length > 0) {
            setSelectedMaintenance(acceptedMaintenances[0]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError("Gagal memuat riwayat pemeliharaan.");
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

  const getMonthYearLabel = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  const monthYearOptions = Array.from(
    new Set(
      maintenances
        .map((m) => m.risk_treatment?.target_tanggal)
        .filter(Boolean)
        .map((v) => getMonthYearLabel(v))
        .filter(Boolean)
    )
  );

  const statusOptions = Array.from(
    new Set(
      maintenances
        .map((m) => m.status_pemeliharaan)
        .filter((v) => v && String(v).trim() !== "")
    )
  );

  const levelOptions = Array.from(
    new Set(
      maintenances
        .map((m) => m.risk?.kriteria)
        .filter((v) => v && String(v).trim() !== "")
    )
  );

  const filteredMaintenances = maintenances.filter((item) => {
    const itemMonthYear = getMonthYearLabel(
      item.risk_treatment?.target_tanggal
    );
    if (selectedMonthYear && itemMonthYear !== selectedMonthYear) {
      return false;
    }

    const itemStatus = item.status_pemeliharaan ?? "";
    if (selectedStatus && itemStatus !== selectedStatus) {
      return false;
    }

    const itemLevel = item.risk?.kriteria ?? "";
    if (selectedLevel && itemLevel !== selectedLevel) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    if (loading || error) return;
    if (filteredMaintenances.length === 0) {
      setSelectedMaintenance(null);
      return;
    }

    if (
      !selectedMaintenance ||
      !filteredMaintenances.some((m) => m.id === selectedMaintenance.id)
    ) {
      setSelectedMaintenance(filteredMaintenances[0]);
    }
  }, [loading, error, filteredMaintenances, selectedMaintenance]);

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
        {">"} Riwayat Pemeliharaan
      </div>

      {/* Title */}
      <div className="title-container">
        <h1 className="title">Laporan Pemeliharaan Aset</h1>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <select
          className="filter-select"
          value={selectedMonthYear}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
        >
          <option value="">Pilih Bulan dan Tahun</option>
          {monthYearOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Pilih Status</option>
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="">Pilih Level</option>
          {levelOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <button className="btn-search">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {/* Table */}
      <div className="riwayat-table-container">
        <table className="riwayat-table">
          <thead>
            <tr>
              <th>Id - Nama Aset</th>
              <th>Risiko	</th>
              <th>Level	</th>
              <th>Jadwal	</th>
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
            ) : filteredMaintenances.length === 0 ? (
              <tr>
                <td colSpan="5">Tidak ada jadwal pemeliharaan.</td>
              </tr>
            ) : (
              filteredMaintenances.map((item, index) => (
                <tr
                  key={item.id ?? index}
                  className={
                    "row-clickable" +
                    (selectedMaintenance && selectedMaintenance.id === item.id
                      ? " row-selected"
                      : "")
                  }
                  onClick={() => setSelectedMaintenance(item)}
                >
                  <td className="asset">
                    {(item.asset_id ?? "") + " - " + (item.asset?.nama ?? "")}
                  </td>
                  <td>{item.risk?.judul ?? ""}</td>
                  <td>{item.risk?.kriteria ?? ""}</td>
                  <td>
                    {item.risk_treatment?.target_tanggal
                      ? new Date(
                          item.risk_treatment?.target_tanggal
                        ).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </td>
                  <td>{item.status_pemeliharaan ?? ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Box */}
      <div className="detail-box">
        <h2 className="detail-title">Laporan Pemeliharaan Aset</h2>

        <div className="detail-content">
          <p>
            <strong>ID Aset</strong> :{" "}
            {selectedMaintenance
              ? selectedMaintenance.asset?.id ?? selectedMaintenance.asset_id
              : ""}
          </p>
          <p>
            <strong>Nama</strong> :{" "}
            {selectedMaintenance ? selectedMaintenance.asset?.nama ?? "" : ""}
          </p>
          <p>
            <strong>Tanggal</strong> :{" "}
            {selectedMaintenance && selectedMaintenance.risk_treatment
              ? new Date(
                  selectedMaintenance.risk_treatment.target_tanggal
                ).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </p>
          <p>
            <strong>Pelaksana</strong> :{" "}
            {selectedMaintenance
              ? selectedMaintenance.risk_treatment?.penanggung_jawab_id ?? ""
              : ""}
          </p>
          <p>
            <strong>Deskripsi</strong> :{" "}
            {selectedMaintenance ? selectedMaintenance.risk?.deskripsi ?? "" : ""}
          </p>
          <p>
            <strong>Status</strong> :{" "}
            {selectedMaintenance
              ? selectedMaintenance.status_pemeliharaan ??
                selectedMaintenance.risk_treatment?.status_pemeliharaan ??
                ""
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
