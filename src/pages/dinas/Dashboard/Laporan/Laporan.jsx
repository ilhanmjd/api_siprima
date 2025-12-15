import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRPopup from "./QRPopup";
import { useAssetContext } from "../../../../contexts/AssetContext";
import api from "../../../../api";
import "./Laporan.css";

const REPORT_OPTIONS = [
  { label: "Asset", value: "asset" },
  { label: "Risiko", value: "risk" },
];

const STATUS_OPTIONS = [
  { label: "Semua Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" }
];

export default function Laporan() {
  const navigate = useNavigate();
  const { assets, loadingAssets, assetsError, fetchAssetsOnce } =
    useAssetContext();
  const fetchAssetsOnceRef = useRef(fetchAssetsOnce);

  const [showQR, setShowQR] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [reportType, setReportType] = useState("asset");
  const [risks, setRisks] = useState([]);
  const [loadingRisks, setLoadingRisks] = useState(false);
  const [risksError, setRisksError] = useState(null);
  const [dinasMap, setDinasMap] = useState({});

  // keep latest fetch fn without adding function to dependency arrays
  fetchAssetsOnceRef.current = fetchAssetsOnce;

  useEffect(() => {
    fetchAssetsOnceRef.current();
  }, []);
  useEffect(() => {
    if (reportType !== "risk") return;

    const controller = new AbortController();
    let isActive = true;

    const fetchRisks = async () => {
      try {
        setLoadingRisks(true);
        setRisksError(null);
        const response = await api.getRisks({ signal: controller.signal });
        if (!isActive) return;
        const list = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        setRisks(list);
      } catch (err) {
        if (!isActive || controller.signal.aborted) return;
        setRisksError(err?.message || "Gagal memuat risiko");
      } finally {
        if (isActive) {
          setLoadingRisks(false);
        }
      }
    };

    fetchRisks();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [reportType]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [kriteriaFilter, setKriteriaFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredAssets = useMemo(() => {
    return (Array.isArray(assets) ? assets : [])
      .filter((asset) => asset.status !== "pending" && asset.status !== "ditolak")
      .filter((asset) => {
      const status = String(asset?.is_usage || "").toLowerCase();
      if (statusFilter && status !== statusFilter.toLowerCase()) {
        return false;
      }
      if (search) {
        const term = search.toLowerCase();
        const name = (asset?.nama || asset?.nama_aset || "").toLowerCase();
        const dinas = (asset?.dinas?.name || asset?.dinas || "").toLowerCase();
        if (
          !name.includes(term) &&
          !dinas.includes(term) &&
          !`${asset?.asset_id ?? asset?.id ?? ""}`.includes(term) &&  
          !`${asset?.dinas ?? dinas?.id ?? ""}`.includes(term)
        ) {
          return false;
        }
      }
      const acquisition = asset?.tgl_perolehan;
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
    return (Array.isArray(risks) ? risks : [])
      .filter((risk) => {
        const status = String(risk?.status || "").toLowerCase();
        return status !== "pending" && status !== "rejected";
      })
      .filter((risk) => {
        if (search) {
          const term = search.toLowerCase();
          const title = (risk?.judul || "").toLowerCase();
          const assetName = (risk?.asset?.nama || risk?.asset_nama || "").toLowerCase();
          const dinas = (risk?.dinas?.name || risk?.dinas || "").toLowerCase();
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

  useEffect(() => {
    if (reportType !== "risk") return;
    const list = Array.isArray(risks) ? risks : [];
    const ids = Array.from(
      new Set(
        list
          .map((risk) => risk?.asset?.dinas_id)
          .filter((id) => id !== null && id !== undefined)
      )
    );
    if (!ids.length) return;

    let cancelled = false;

    const fetchDinasForIds = async () => {
      try {
        const entries = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await api.getDinasById(id);
              const data = res?.data?.data ?? res?.data ?? {};
              const name = data?.nama || data?.name || data?.dinas || null;
              return [id, name];
            } catch {
              return [id, null];
            }
          })
        );

        if (cancelled) return;

        setDinasMap((prev) => {
          const next = { ...prev };
          entries.forEach(([id, name]) => {
            if (name) next[id] = name;
          });
          return next;
        });
      } catch {
        // ignore errors; fallback ke data yang sudah ada di risk/asset
      }
    };

    fetchDinasForIds();

    return () => {
      cancelled = true;
    };
  }, [reportType, risks]);

  const handleDownloadAsset = (asset) => {
    if (asset?.lampiran_url) {
      window.open(asset.lampiran_url, "_blank");
    } else {
      alert("Lampiran tidak tersedia untuk aset ini.");
    }
  };

  const handleDownloadRisk = (risk) => {
    if (risk?.lampiran_url) {
      window.open(risk.lampiran_url, "_blank");
    } else {
      alert("Lampiran tidak tersedia untuk risiko ini.");
    }
  };

  const isAssetReport = reportType === "asset";
  const rows = isAssetReport ? filteredAssets : filteredRisks;
  const loading = isAssetReport ? loadingAssets : loadingRisks;
  const error = isAssetReport ? assetsError : risksError;
  const headers = isAssetReport
    ? ["Nama Aset", "Dinas", "Tanggal", "Status", "QR Code", "Download"]
    : ["Nama Risiko", "Nama Aset", "Dinas", "Kriteria", "Status", "Tanggal", "Download"];

  return (
    <>
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
                        <td>{item?.dinas?.name || item?.dinas || "-"}</td>
                        <td>
                          {item?.tgl_perolehan
                            ? new Date(item.tgl_perolehan).toLocaleDateString("id-ID")
                            : "-"}
                        </td>
                        <td className="status-tag">{item?.is_usage || "-"}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAsset(item);
                              setShowQR(true);
                            }}
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
                  const dinasName =
                    dinasMap[item?.asset?.dinas_id] ||
                    item?.dinas?.name ||
                    item?.dinas ||
                    item?.asset?.dinas?.name ||
                    item?.asset?.dinas ||
                    "-";
                  return (
                    <tr key={`risk-${riskId}`}>
                      <td>{item?.judul || "-l"}</td>
                      <td>{item?.asset?.nama || "-"}</td>
                      <td>{dinasName}</td>
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
                          disabled={!item?.lampiran_url}
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

    {showQR && (
      <QRPopup
        isOpen={showQR}
        asset={selectedAsset}
        onClose={() => setShowQR(false)}
      />
    )}
  </>
  );
}
