import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../../contexts/AssetContext";
import api from "../../../../api";
import "./Dashboard.css";
// AbortController presence for logout flow
const dinasAbortController = new AbortController();

const MONTH_NAMES_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function AssetsLineChart({ data, width = 420, height = 220 }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>Tidak ada aset aktif yang diterima.</p>;
  }

  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getX = (index) => {
    if (data.length === 1) {
      return margin.left + innerWidth / 2;
    }
    const ratio = index / (data.length - 1);
    return margin.left + ratio * innerWidth;
  };

  const getY = (count) => {
    const ratio = count / maxCount;
    return margin.top + innerHeight - ratio * innerHeight;
  };

  const points = data
    .map((d, index) => `${getX(index)},${getY(d.count)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="assets-line-chart"
      role="img"
      aria-label="Trend aset aktif yang diterima per bulan"
    >
      <line
        x1={margin.left}
        y1={margin.top + innerHeight}
        x2={margin.left + innerWidth}
        y2={margin.top + innerHeight}
        stroke="#ccc"
        strokeWidth="1"
      />

      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={margin.top + innerHeight}
        stroke="#ccc"
        strokeWidth="1"
      />

      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        points={points}
      />

      {data.map((d, index) => {
        const x = getX(index);
        const y = getY(d.count);
        return (
          <g key={`${d.year}-${d.month}`}>
            <circle cx={x} cy={y} r={3} fill="#1d4ed8" />
            <text
              x={x}
              y={y - 6}
              textAnchor="middle"
              fontSize="8"
              fill="#111"
            >
              {d.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MaintenancePieChart({ greenCount, redCount, size = 160 }) {
  const total = greenCount + redCount;

  if (!total) {
    return <p>Tidak ada data pemeliharaan.</p>;
  }

  const radius = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;

  const polarToCartesian = (centerX, centerY, r, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      cx,
      cy,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const greenFraction = greenCount / total;

  const greenAngle = greenFraction * 360;

  const slices = [];

  if (greenCount > 0 && redCount > 0) {
    // Green slice (from 0 to greenAngle)
    slices.push({
      d: describeArc(0, greenAngle),
      fill: "#4ade80",
    });
    // Red slice (remaining)
    slices.push({
      d: describeArc(greenAngle, 360),
      fill: "#ef4444",
    });
  } else if (greenCount > 0) {
    // Only green
    slices.push({
      d: describeArc(0, 359.999),
      fill: "#4ade80",
    });
  } else {
    // Only red
    slices.push({
      d: describeArc(0, 359.999),
      fill: "#ef4444",
    });
  }

  const greenPercent = Math.round((greenCount / total) * 100);
  const redPercent = Math.round((redCount / total) * 100);

  return (
    <div className="maintenance-chart-wrapper">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="maintenance-pie-chart"
        role="img"
        aria-label="Distribusi status pemeliharaan"
      >
        {slices.map((slice, index) => (
          <path key={index} d={slice.d} fill={slice.fill} />
        ))}
      </svg>
      <div className="maintenance-legend">
        <div className="maintenance-total">Total: {total}</div>
        <div className="legend-row">
          <span className="legend-color legend-green" />
          <span>{greenPercent} % selesai</span>
        </div>
        <div className="legend-row">
          <span className="legend-color legend-red" />
          <span>{redPercent} % penanganan dan pending</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { resetAssetData, loading, error, assets, risks, fetchAssetsOnce } =
    useAssetContext();
  const resetAssetDataRef = useRef(resetAssetData);
  const fetchAssetsOnceRef = useRef(fetchAssetsOnce);
  const [chartData, setChartData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [maintenanceCounts, setMaintenanceCounts] = useState({
    green: 0,
    red: 0,
  });
  const [maintenanceList, setMaintenanceList] = useState([]);

  useEffect(() => {
    resetAssetDataRef.current = resetAssetData;
  }, [resetAssetData]);

  useEffect(() => {
    fetchAssetsOnceRef.current = fetchAssetsOnce;
  }, [fetchAssetsOnce]);

  useEffect(() => {
    resetAssetDataRef.current();
    fetchAssetsOnceRef.current();
  }, []);

  useEffect(() => {
    if (!Array.isArray(assets) || assets.length === 0) {
      setChartData([]);
      setAvailableYears([]);
      setSelectedYear(null);
      return;
    }

    const yearsSet = new Set();
    const points = [];

    assets.forEach((asset) => {
      const status = String(asset?.status || "").toLowerCase();
      const usage = String(asset?.is_usage || "").toLowerCase();
      const isStatusAllowed =
        status === "diterima" || status === "pemeliharaan";
      if (!isStatusAllowed || usage !== "active") return;

      const updatedRaw = asset?.tgl_perolehan || asset?.updatedAt;
      if (!updatedRaw) return;

      const date = new Date(updatedRaw);
      if (Number.isNaN(date.getTime())) return;

      const month = date.getMonth();
      const year = date.getFullYear();
      yearsSet.add(year);
      points.push({ year, month });
    });

    const years = Array.from(yearsSet).sort((a, b) => a - b);
    setAvailableYears(years);

    if (!years.length) {
      setChartData([]);
      setSelectedYear(null);
      return;
    }

    let yearToUse = selectedYear;
    if (!yearToUse || !years.includes(yearToUse)) {
      yearToUse = years[years.length - 1];
    }
    if (yearToUse !== selectedYear) {
      setSelectedYear(yearToUse);
    }

    const countsByMonth = Array(12).fill(0);
    points.forEach((p) => {
      if (p.year === yearToUse) {
        countsByMonth[p.month] += 1;
      }
    });

    const fullYearData = MONTH_NAMES_ID.map((_, monthIndex) => ({
      year: yearToUse,
      month: monthIndex,
      count: countsByMonth[monthIndex] || 0,
    }));

    setChartData(fullYearData);
  }, [assets, selectedYear]);

  useEffect(() => {
    let cancelled = false;

    const fetchMaintenances = async () => {
      try {
        const res = await api.getMaintenances();
        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];

        const accepted = data.filter(
          (item) => String(item?.status_review || "") === "accepted"
        );

        let green = 0;
        let red = 0;

        accepted.forEach((item) => {
          const status = String(item?.status_pemeliharaan || "").toLowerCase();
          if (status === "selesai") {
            green += 1;
          } else if (status === "penanganan" || status === "pending") {
            red += 1;
          }
        });

        if (!cancelled) {
          setMaintenanceCounts({ green, red });
          setMaintenanceList(accepted);
        }
      } catch {
        if (!cancelled) {
          setMaintenanceCounts({ green: 0, red: 0 });
          setMaintenanceList([]);
        }
      }
    };

    fetchMaintenances();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputClick = (title, btn) => {
    if (title === "ASSET") {
      if (btn === "Input") {
        navigate("/AsetInput1");
      } else if (btn === "Hapus") {
        navigate("/PenghapusanAset");
      }
    } else if (title === "RISK") {
      navigate("/DashboardRisk");
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    } catch (err) {
      // Still clear localStorage and navigate even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate("/");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar-dashboard">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span className="active" onClick={() => navigate("/Dashboard")}>Dashboard</span>
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
          <div
            className="icon"
            onClick={handleLogout}
          >
            <img src="/logout.png" alt="Logout" className="logo" />
          </div>
          
        </div>
      </nav>

      {/* Content */}
      <div className="content">
        <h1 className="title">Dashboard</h1>

        {/* Top Cards */}
        <div className="card-row">
          {[
            { title: "ASSET", buttons: ["Input", "Hapus"] },
            { title: "RISK", buttons: ["Input"] },
            // { title: "STATUS", buttons: ["Check"] },
          ].map((item, i) => (
            <div className="main-card" key={i}>
              <h2>{item.title}</h2>
              <div className="button-row">
                {item.buttons.map((btn, j) => (
                  <button
                    className="yellow-btn"
                    key={j}
                    onClick={() => handleInputClick(item.title, btn)}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

       

        {/* Charts Section */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Line Chart</h3>
            <div className="chart-header">
              <div className="chart-month-labels">
                {MONTH_NAMES_ID.map((name, index) => (
                  <span key={index}>{name}</span>
                ))}
              </div>
              {availableYears.length > 0 && (
                <select
                  className="chart-year-select"
                  value={selectedYear ?? ""}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="chart-placeholder">
              <AssetsLineChart data={chartData} />
            </div>
          </div>
          <div className="chart-card">
            <h3>Maintenance</h3>
            <div className="chart-placeholder">
              <MaintenancePieChart
                greenCount={maintenanceCounts.green}
                redCount={maintenanceCounts.red}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Risiko Prioritas</h3>
            <div className="chart-placeholder">
              📊<p>Risiko Prioritas (Kosong)</p>
            </div>
          </div>

          <div className="chart-card">
            <h3>Penanganan Risiko</h3>
            <div className="risk-list-Penanganan-Risiko">
              {maintenanceList.slice(0, 5).map((item) => {
                const statusRaw = item?.status_pemeliharaan || "";
                const statusLower = String(statusRaw).toLowerCase();
                const isDone = statusLower === "selesai";
                const assetName =
                  item?.asset?.nama || item?.asset_nama || "Tanpa nama aset";
                return (
                  <div className="risk-item" key={item.id ?? assetName}>
                    <span>
                      <img
                        src="/logo kalender.png"
                        alt="Kalender"
                        className="calendar-icon"
                      />{" "}
                      {assetName}
                    </span>
                    <button
                      className={`status-btn ${
                        isDone ? "done" : "process"
                      }`}
                    >
                      {statusRaw || "-"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
