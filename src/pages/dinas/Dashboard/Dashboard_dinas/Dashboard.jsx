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

function MaintenancePieChart({ statusCounts, size = 160 }) {
  console.log("Pie Chart statusCounts:", statusCounts);
  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  console.log("Pie Chart total:", total);

  if (!total) {
    return <p>Tidak ada data pemeliharaan.</p>;
  }

  const radius = 70;
  const cx = size / 2;
  const cy = size / 2;

  // Define colors for each status
  const statusColors = {
    selesai: "#4ade80",      // green
    penanganan: "#facc15",   // yellow
    pending: "#f97316",      // orange
    ditolak: "#ef4444",      // red
  };

  const slices = [];
  let cumulativePercent = 0;

  // Create slices for each status
  Object.entries(statusCounts).forEach(([status, count]) => {
    if (count > 0) {
      const percent = count / total;
      slices.push({
        status,
        count,
        percent: Math.round(percent * 100),
        color: statusColors[status] || "#9ca3af",
        offset: cumulativePercent,
      });
      cumulativePercent += percent;
    }
  });

  return (
    <div className="maintenance-chart-wrapper">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="maintenance-pie-chart"
        role="img"
        aria-label="Distribusi status pemeliharaan"
      >
        {slices.map((slice, index) => {
          const strokeDasharray = `${slice.percent} ${100 - slice.percent}`;
          const strokeDashoffset = -slice.offset * 100;
          const rotation = -90; // Start from top

          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth={radius * 2}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(${rotation} ${cx} ${cy})`}
              style={{
                transition: "stroke-dashoffset 0.3s ease",
              }}
            />
          );
        })}
      </svg>
      <div className="maintenance-legend">
        <div className="maintenance-total">Total: {total}</div>
        {slices.map((slice) => (
          <div className="legend-row" key={slice.status}>
            <span 
              className="legend-color" 
              style={{ backgroundColor: slice.color }}
            />
            <span>{slice.percent}% {slice.status} ({slice.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskPriorityBarChart({ data, width = 420, height = 220 }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>Tidak ada data risiko untuk tahun ini.</p>;
  }

  const margin = { top: 20, right: 20, bottom: 30, left: 120 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const barGap = 10;
  const barHeight = 20;

  const colorForPriority = (priority) => {
    const value = String(priority || "").toLowerCase();
    if (value === "high") return "#ef4444";
    if (value === "medium") return "#facc15";
    return "#4ade80";
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="risk-priority-bar-chart"
      role="img"
      aria-label="Risiko prioritas per sub kategori"
    >
      {data.map((item, index) => {
        const y = margin.top + index * (barHeight + barGap);
        const barWidth = (item.count / maxCount) * innerWidth;
        const color = colorForPriority(item.priority);

        return (
          <g key={item.subName}>
            <text
              x={margin.left - 8}
              y={y + barHeight / 2}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize="9"
              fill="#374151"
            >
              {item.subName}
            </text>
            <rect
              x={margin.left}
              y={y}
              width={barWidth || 2}
              height={barHeight}
              fill={color}
              rx={3}
              ry={3}
            />
            <text
              x={margin.left + barWidth + 4}
              y={y + barHeight / 2}
              alignmentBaseline="middle"
              fontSize="9"
              fill="#111827"
            >
              {item.count}
            </text>
          </g>
        );
      })}
    </svg>
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
    selesai: 0,
    penanganan: 0,
    pending: 0,
    ditolak: 0,
  });
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [riskRawData, setRiskRawData] = useState([]);
  const [riskBarData, setRiskBarData] = useState([]);
  const [riskYears, setRiskYears] = useState([]);
  const [selectedRiskYear, setSelectedRiskYear] = useState(null);
  const [riskTreatmentList, setRiskTreatmentList] = useState([]);

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

    let effectiveYear = selectedYear;
    if (effectiveYear !== null && !years.includes(effectiveYear)) {
      effectiveYear = years[years.length - 1];
    }
    if (effectiveYear !== selectedYear) {
      setSelectedYear(effectiveYear);
    }

    const countsByMonth = Array(12).fill(0);
    points.forEach((p) => {
      if (effectiveYear === null || p.year === effectiveYear) {
        countsByMonth[p.month] += 1;
      }
    });

    const fullYearData = MONTH_NAMES_ID.map((_, monthIndex) => ({
      year: effectiveYear,
      month: monthIndex,
      count: countsByMonth[monthIndex] || 0,
    }));

    setChartData(fullYearData);
  }, [assets, selectedYear]);

  useEffect(() => {
    let cancelled = false;

    const fetchRisks = async () => {
      try {
        const res = await api.getRisks();
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];

        const yearsSet = new Set();
        const normalized = [];
        const subCache = {};

        for (const risk of list) {
          if (!risk || typeof risk !== "object") continue;

          const status = String(risk?.status || "").toLowerCase();
          if (status === "pending" || status === "rejected") continue;

          const updatedRaw =
            risk?.updated_at || risk?.updatedAt || risk?.created_at;
          if (!updatedRaw) continue;

          const date = new Date(updatedRaw);
          if (Number.isNaN(date.getTime())) continue;

          const year = date.getFullYear();
          yearsSet.add(year);

          let subName =
            risk?.asset?.subkategori?.nama ||
            risk?.asset?.subkategori_nama ||
            risk?.asset?.sub_kategori ||
            "";

          let subId =
            risk?.asset?.subkategori?.id ||
            risk?.asset?.subkategori_id ||
            risk?.asset?.subkategoriId ||
            risk?.asset?.sub_kategori_id ||
            null;

          if (!subName && subId) {
            if (subCache[subId]) {
              subName = subCache[subId];
            } else {
              try {
                const subRes = await api.getSubKategoriById(subId);
                const subData = subRes?.data?.data ?? subRes?.data;
                const name =
                  subData?.nama ||
                  subData?.name ||
                  subData?.subkategori ||
                  `Subkategori ${subId}`;
                subCache[subId] = name;
                subName = name;
              } catch {
                subName = `Subkategori ${subId}`;
              }
            }
          }

          if (!subName) {
            subName = "Tidak diketahui";
          }

          const priority = String(risk?.prioritas || "").toLowerCase();

          normalized.push({
            year,
            subName,
            priority,
          });
        }

        if (cancelled) return;

        const years = Array.from(yearsSet).sort((a, b) => a - b);
        setRiskYears(years);
        setRiskRawData(normalized);

        if (!years.length) {
          setSelectedRiskYear(null);
        } else if (
          selectedRiskYear !== null &&
          !years.includes(selectedRiskYear)
        ) {
          setSelectedRiskYear(years[years.length - 1]);
        }
      } catch {
        if (!cancelled) {
          setRiskYears([]);
          setRiskRawData([]);
          setSelectedRiskYear(null);
        }
      }
    };

    fetchRisks();

    return () => {
      cancelled = true;
    };
  }, [selectedRiskYear]);

  useEffect(() => {
    if (!Array.isArray(riskRawData) || !riskRawData.length) {
      setRiskBarData([]);
      return;
    }

    const rankPriority = (p) => {
      const value = String(p || "").toLowerCase();
      if (value === "high") return 3;
      if (value === "medium") return 2;
      return 1;
    };

    const subMap = new Map();

    riskRawData.forEach((item) => {
      if (!item) return;
      if (selectedRiskYear !== null && item.year !== selectedRiskYear) return;
      const key = item.subName;
      const existing =
        subMap.get(key) || { subName: key, count: 0, priority: "low" };

      existing.count += 1;

      if (rankPriority(item.priority) > rankPriority(existing.priority)) {
        existing.priority = item.priority;
      }

      subMap.set(key, existing);
    });

    const aggregated = Array.from(subMap.values()).sort(
      (a, b) => b.count - a.count
    );

    setRiskBarData(aggregated);
  }, [riskRawData, selectedRiskYear]);

  useEffect(() => {
    let cancelled = false;

    const fetchMaintenances = async () => {
      try {
        const res = await api.getMaintenances();
        console.log("Maintenance API Response:", res);
        
        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];

        console.log("Maintenance Data:", data);

        if (cancelled) return;

        // Tampilkan semua data maintenance tanpa filter status_review
        console.log("All Maintenance:", data);

        const counts = {
          selesai: 0,
          penanganan: 0,
          pending: 0,
          ditolak: 0,
        };

        data.forEach((item) => {
          console.log("Item:", item);
          // Cek berbagai kemungkinan field status
          const status = String(
            item?.status_pemeliharaan || 
            item?.status || 
            item?.statusPemeliharaan ||
            ""
          ).toLowerCase();
          console.log("Status pemeliharaan:", status);
          
          // Tambahkan ke counts jika status cocok
          if (counts.hasOwnProperty(status)) {
            counts[status] += 1;
          } else if (status) {
            // Jika ada status tapi tidak ada di object counts, tambahkan
            counts[status] = (counts[status] || 0) + 1;
          }
        });

        console.log("Maintenance Counts:", counts);

        if (!cancelled) {
          setMaintenanceCounts(counts);
          setMaintenanceList(data);
        }
      } catch (err) {
        console.error("Error fetching maintenances:", err);
        if (!cancelled) {
          setMaintenanceCounts({
            selesai: 0,
            penanganan: 0,
            pending: 0,
            ditolak: 0,
          });
          setMaintenanceList([]);
        }
      }
    };

    fetchMaintenances();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchRiskTreatments = async () => {
      try {
        const res = await api.getRiskTreatments();
        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];

        if (cancelled) return;

        // Filter hanya yang sudah diterima
        const accepted = data.filter(
          (item) => String(item?.status || "").toLowerCase() === "accepted"
        );

        if (!cancelled) {
          setRiskTreatmentList(accepted);
        }
      } catch (err) {
        console.error("Error fetching risk treatments:", err);
        if (!cancelled) {
          setRiskTreatmentList([]);
        }
      }
    };

    fetchRiskTreatments();

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
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedYear(value === "" ? null : Number(value));
                  }}
                >
                  <option value="">Semua Tahun</option>
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
                statusCounts={maintenanceCounts}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Risiko Prioritas</h3>
            <div className="chart-header">
              {riskYears.length > 0 && (
                <select
                  className="chart-year-select"
                  value={selectedRiskYear ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedRiskYear(value === "" ? null : Number(value));
                  }}
                >
                  <option value="">Semua Tahun</option>
                  {riskYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="chart-placeholder">
              <RiskPriorityBarChart data={riskBarData} />
            </div>
          </div>


          <div className="chart-card">
            <h3>Penanganan Risiko</h3>
            <div className="risk-list-Penanganan-Risiko">
              {riskTreatmentList.length === 0 ? (
                <p>Tidak ada data penanganan risiko.</p>
              ) : (
                riskTreatmentList.slice(0, 5).map((item) => {
                  const targetDate = item?.target_tanggal || "";
                  const strategi = item?.strategi || "";
                  const riskTitle = item?.risk?.judul || "Tanpa judul risiko";
                  const penanggungJawab = item?.penanggungjawab?.nama || 
                                         item?.penanggung_jawab?.nama || 
                                         "Tanpa PJ";
                  
                  return (
                    <div className="risk-item" key={item.id ?? riskTitle}>
                      <span>
                        <img
                          src="/logo kalender.png"
                          alt="Kalender"
                          className="calendar-icon"
                        />{" "}
                        {riskTitle} ({strategi})
                      </span>
                      <button
                        className="status-btn process"
                      >
                        {targetDate ? new Date(targetDate).toLocaleDateString('id-ID') : "-"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
