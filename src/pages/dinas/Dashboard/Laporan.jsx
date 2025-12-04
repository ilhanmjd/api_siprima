import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Laporan.css";

const REPORT_OPTIONS = [
  { label: "Asset", value: "asset" },
  { label: "Risiko", value: "risk" },
];

const STATUS_OPTIONS = [
  { label: "Semua Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Retired", value: "retired" },
  { label: "Decommission", value: "decommission" },
];

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
    {
      id: 2,
      nama: 'Mobil Dinas',
      dinas: { nama: 'Dinas Perhubungan' },
      tanggal_perolehan: '2022-05-20',
      status: 'maintenance',
      lampiran_url: 'http://example.com/lampiran2.pdf'
    },
    {
      id: 3,
      nama: 'Server Utama',
      dinas: { nama: 'Dinas Komunikasi dan Informatika' },
      tanggal_perolehan: '2021-10-10',
      status: 'active',
      lampiran_url: 'http://example.com/lampiran3.pdf'
    },
    {
      id: 4,
      nama: 'Printer Multifungsi',
      dinas: { nama: 'Dinas Pendidikan' },
      tanggal_perolehan: '2023-03-05',
      status: 'inactive',
      lampiran_url: 'http://example.com/lampiran4.pdf'
    },
    {
      id: 5,
      nama: 'Proyektor',
      dinas: { nama: 'Dinas Kesehatan' },
      tanggal_perolehan: '2022-12-01',
      status: 'retired',
      lampiran_url: 'http://example.com/lampiran5.pdf'
    }
  ]);
  const [risks] = useState([
    {
      id: 1,
      judul: 'Risiko Keamanan Data',
      asset: { nama: 'Server Utama' },
      dinas: { nama: 'Dinas Komunikasi dan Informatika' },
      kriteria: 'Tinggi',
      status: 'active',
      created_at: '2023-02-10'
    },
    {
      id: 2,
      judul: 'Risiko Kerusakan Perangkat',
      asset: { nama: 'Komputer Kantor' },
      dinas: { nama: 'Dinas Komunikasi dan Informatika' },
      kriteria: 'Sedang',
      status: 'maintenance',
      created_at: '2023-04-15'
    },
    {
      id: 3,
      judul: 'Risiko Kebocoran Informasi',
      asset: { nama: 'Mobil Dinas' },
      dinas: { nama: 'Dinas Perhubungan' },
      kriteria: 'Tinggi',
      status: 'active',
      created_at: '2023-01-20'
    },
    {
      id: 4,
      judul: 'Risiko Kegagalan Sistem',
      asset: { nama: 'Printer Multifungsi' },
      dinas: { nama: 'Dinas Pendidikan' },
      kriteria: 'Rendah',
      status: 'inactive',
      created_at: '2023-05-30'
    },
    {
      id: 5,
      judul: 'Risiko Pencurian Aset',
      asset: { nama: 'Proyektor' },
      dinas: { nama: 'Dinas Kesehatan' },
      kriteria: 'Sedang',
      status: 'retired',
      created_at: '2022-11-25'
    }
  ]);
  const [reportType, setReportType] = useState("asset");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [kriteriaFilter, setKriteriaFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredAssets = useMemo(() => {
    return (Array.isArray(assets) ? assets : []).filter((asset) => {
      const status = String(asset?.status || "").toLowerCase();
      if (statusFilter && status !== statusFilter.toLowerCase()) {
        return false;
      }
      if (search) {
        const term = search.toLowerCase();
        const name = (asset?.nama || asset?.nama_aset || "").toLowerCase();
        const dinas = (asset?.dinas?.nama || asset?.dinas || "").toLowerCase();
        if (
          !name.includes(term) &&
          !dinas.includes(term) &&
          !`${asset?.asset_id ?? asset?.id ?? ""}`.includes(term)
        ) {
          return false;
        }
      }
      const acquisition = asset?.tanggal_perolehan;
      if ((dateFrom || dateTo) && acquisition) {
        const assetDate = new Date(acquisition);
        if (dateFrom && assetDate < new Date(dateFrom)) {
          return false;
        }
        if (dateTo && assetDate > new Date(dateTo)) {
          return false;
        }
      }
      return true;
    });
  }, [assets, search, statusFilter, dateFrom, dateTo]);

  const filteredRisks = useMemo(() => {
    return (Array.isArray(risks) ? risks : []).filter((risk) => {
      if (search) {
        const term = search.toLowerCase();
        const title = (risk?.judul || "").toLowerCase();
        const assetName = (risk?.asset?.nama || risk?.asset_nama || "").toLowerCase();
        const dinas = (risk?.dinas?.nama || risk?.dinas || "").toLowerCase();
        if (
          !title.includes(term) &&
          !assetName.includes(term) &&
          !dinas.includes(term) &&
          !`${risk?.id ?? risk?.risk_id ?? ""}`.includes(term)
        ) {
          return false;
        }
      }
      if (kriteriaFilter) {
        const kriteria = String(risk?.kriteria || "").toLowerCase();
        if (!kriteria.includes(kriteriaFilter.toLowerCase())) {
          return false;
        }
      }
      const created = risk?.created_at;
      if ((dateFrom || dateTo) && created) {
        const createdDate = new Date(created);
        if (dateFrom && createdDate < new Date(dateFrom)) {
          return false;
        }
        if (dateTo && createdDate > new Date(dateTo)) {
          return false;
        }
      }
      return true;
    });
  }, [risks, search, kriteriaFilter, dateFrom, dateTo]);

  const handleDownloadAsset = (asset) => {
    if (asset?.lampiran_url) {
      window.open(asset.lampiran_url, "_blank");
    } else {
      alert("Lampiran tidak tersedia untuk aset ini.");
    }
  };

  const handleDownloadRisk = (risk) => {
    const identifier = risk?.id ?? risk?.risk_id ?? "risk";
    const blob = new Blob([JSON.stringify(risk ?? {}, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `risk-${identifier}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isAssetReport = reportType === "asset";
  const rows = isAssetReport ? filteredAssets : filteredRisks;
  const loading = false;
  const error = null;
  const headers = isAssetReport
    ? ["Nama Aset", "Dinas", "Tanggal", "Status", "QR Code", "Download"]
    : ["Nama Risiko", "Nama Aset", "Dinas", "Kriteria", "Status", "Tanggal", "Download"];

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
          <span className="active" onClick={() => navigate("/laporan")}>Laporan</span>
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
          <h2>Laporan {isAssetReport ? "Aset" : "Risiko"}</h2>
          <p>Pilih kategori laporan dan rentang tanggal untuk mengunduh data.</p>
        </div>

        <div className="laporan-filters">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            {REPORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {isAssetReport && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {!isAssetReport && (
            <input
              type="text"
              placeholder="Semua kriteria"
              value={kriteriaFilter}
              onChange={(e) => setKriteriaFilter(e.target.value)}
            />
          )}

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="separator">-</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <input
            type="text"
            placeholder={
              isAssetReport
                ? "Cari nama aset atau dinas"
                : "Cari judul risiko atau dinas"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                    Memuat data {isAssetReport ? "aset" : "risiko"}...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="laporan-placeholder">
                    Tidak ada data {isAssetReport ? "aset" : "risiko"} dengan filter saat ini.
                  </td>
                </tr>
              ) : (
                rows.map((item) => {
                  if (isAssetReport) {
                    return (
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
                            style={{
                              backgroundColor: '#2582ff',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '999px',
                              cursor: 'pointer'
                            }}
                          >
                            QR Code
                          </button>
                        </td>
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
                    );
                  }
                  const riskId = item?.id ?? item?.risk_id;
                  return (
                    <tr key={`risk-${riskId}`}>
                      <td>{item?.judul || "Risiko tanpa judul"}</td>
                      <td>{item?.asset?.nama || item?.asset_nama || "-"}</td>
                      <td>{item?.dinas?.nama || item?.dinas || "-"}</td>
                      <td>{item?.kriteria || "-"}</td>
                      <td className="status-tag">{item?.status || "-"}</td>
                      <td>
                        {item?.created_at
                          ? new Date(item.created_at).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="download-btn"
                          onClick={() => handleDownloadRisk(item)}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
