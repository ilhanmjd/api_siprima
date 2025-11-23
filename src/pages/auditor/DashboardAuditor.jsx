import React from "react";
import "./DashboardAuditor.css";


export default function DashboardAuditor() {
  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span className="active" onClick={() => navigate("/Dashboard")}>Dashboard</span>
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

      {/* Content */}
      <div className="content">
        <h1 className="title">Dashboard</h1>

        {/* TOP WIDGETS */}
        <div className="top-grid">
          <div className="card total-aset">
            <div className="total-aset-container" style={{display: "flex", justifyContent: "space-between"}}>
              <div className="total-aset-section" style={{flex: "1", marginRight: "10px"}}>
                <h4>Total Seluruh Aset</h4>
                <div className="value">128</div>
              </div>
              <div className="risiko-teridentifikasi-section" style={{flex: "1", marginLeft: "10px"}}>
                <h4>Risiko Teridentifikasi</h4>
                <div className="risk-list">
                  <div>🟦 Low: 45</div>
                  <div>🟧 Medium: 50</div>
                  <div>🟥 High: 33</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card risiko merah">
            <span>Risiko Tinggi</span>
            <h1>4</h1>
          </div>

          <div className="card risiko kuning">
            <span>Risiko Sedang</span>
            <h1>2</h1>
          </div>

          <div className="card risiko biru">
            <span>Risiko Rendah</span>
            <h1>1</h1>
          </div>
        </div>

        {/* CHART + HEATMAP */}
        <div className="mid-grid">
          <div className="card chart" style={{display: "flex", flexDirection: "column"}}>
            <div className="chart-title">
              <h3>Jumlah Insiden</h3>
            </div>
            <div className="chart-content" style={{flexGrow: 1}}>
              {/* Kolom untuk menampilkan chart */}
              Dummy Chart
            </div>
          </div>
          <div className="card mitigasi" style={{display: "flex", flexDirection: "column"}}>
            <div className="mitigasi-title" style={{flexShrink: 0}}>
              <h3>Penurunan Risiko sesudah Mitigasi</h3>
            </div>
            <div className="mitigasi-content" style={{flexGrow: 1}}>
              Dummy Mitigasi Chart
            </div>
          </div>
          <div className="card heatmap" style={{display: "flex", flexDirection: "column"}}>
            <div className="heatmap-title" style={{flexShrink: 0}}>
              <h3>Heatmap Risiko (Matrix PxD)</h3>
            </div>
            <div className="heatmap-content" style={{flexGrow: 1}}>
              <div className="grid-heatmap">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="heatbox"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LIST + VERIFIKASI + PENGHAPUSAN */}
        <div className="bottom-grid">

          <div className="card jadwal" style={{display: "flex", flexDirection: "column"}}>
            <div className="jadwal-title" style={{flexShrink: 0}}>
              <h3>Jadwal Pemeliharaan</h3>
            </div>
            <div className="jadwal-content" style={{flexGrow: 1}}>
              {[
                { name: "Asset laptop", status: "Ditangani" },
                { name: "Asset Komputer", status: "Proses" },
                { name: "Data Cloud", status: "Proses" },
                { name: "Router", status: "Ditangani" },
                { name: "Microsoft Office", status: "Ditangani" },
              ].map((item) => (
                <div className="row" key={item.name}>
                  <span>{item.name}</span>
                  <button className={item.status.toLowerCase()}>{item.status}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card verifikasi" style={{display: "flex", flexDirection: "column"}}>
            <div className="verifikasi-title" style={{flexShrink: 0}}>
              <h3>Verifikasi Dinas</h3>
            </div>
            <div className="verifikasi-content" style={{flexGrow: 1}}>
              <div>Dinas PUPR belum update data aset <span>85%</span></div>
              <div>Risiko tinggi di Dinas Kesehatan belum ditangani <span>75%</span></div>
              <div>Aset kritis di Dinas Pendidikan rusak <span>80%</span></div>
              <div>Audit log user terbaru tersedia <span>70%</span></div>
            </div>
          </div>

          <div className="card notifver" style={{display: "flex", flexDirection: "column"}}>
            <div className="notifver-title" style={{flexShrink: 0}}>
              <h3>Notifikasi Verifikasi</h3>
            </div>
            <div className="notifver-content" style={{flexGrow: 1}}>
              {[
                ["Dinas Pendidikan", 2],
                ["Dinas Kesehatan", 3],
                ["Dinas PUPR", 1],
                ["Dinas Perhubungan", 4],
              ].map(([name, count]) => (
                <div className="notif-row" key={name}>
                  <span>{name}</span>
                  <span className="badge">{count}</span>
                  <button className="lihat">Lihat</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card hapus" style={{display: "flex", flexDirection: "column"}}>
            <div className="hapus-title" style={{flexShrink: 0}}>
              <h3>Penghapusan Aset</h3>
            </div>
            <div className="hapus-content" style={{flexGrow: 1}}>
              {["Dinas Pendidikan", "Dinas Kesehatan", "Dinas PUPR", "Dinas Perhubungan"].map(
                (name) => (
                  <div className="hapus-row" key={name}>
                    <span>{name}</span>
                    <button className="detail">Detail</button>
                  </div>
                )
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
