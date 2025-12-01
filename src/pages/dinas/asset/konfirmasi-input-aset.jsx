import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";

import "./konfirmasi-input-aset.css";

export default function KonfirmasiInputAset() {
  const navigate = useNavigate();
  const { assetData, resetAssetData } = useAssetContext();
  const [isLoading, setIsLoading] = useState(false);

  const isDataComplete = () =>
    assetData.kategori &&
    assetData.nama &&
    assetData.sub_kategori &&
    assetData.kondisi &&
    assetData.tanggal_perolehan &&
    assetData.lokasi &&
    assetData.nilai_perolehan &&
    assetData.deskripsi_aset &&
    assetData.status &&
    assetData.penanggung_jawab;

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!isDataComplete()) {
      alert("Semua data wajib harus diisi sebelum konfirmasi.");
      return;
    }
    setIsLoading(true);
    const newAsset = {
      kategori: assetData.kategori,
      sub_kategori: assetData.sub_kategori,
      nama: assetData.nama,
      lokasi: assetData.lokasi,
      penanggung_jawab: assetData.penanggung_jawab,
      tanggal_perolehan: assetData.tanggal_perolehan,
      nilai_perolehan: parseInt(assetData.nilai_perolehan),
      kondisi: assetData.kondisi,
      status: assetData.status,
      deskripsi_aset: assetData.deskripsi_aset,
      lampiran: assetData.doc ? assetData.doc : null,
    };
    try {
      // API call removed as per plan
      resetAssetData();
      navigate("/notifikasi-user-dinas");
    } catch (error) {
      alert("Gagal menambahkan asset. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>
        <div className="navbar-center">
          <span className="active" onClick={() => navigate("/Dashboard")}>
            Dashboard
          </span>

          <span onClick={() => navigate("/service-desk")}>Requests</span>
          <span onClick={() => navigate("/faq")}>FAQ</span>
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
      <div className="breadcrumb">
        <span onClick={() => navigate("/Dashboard")}>Dashboard</span> {">"}{" "}
        Input Asset
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div
          className="form-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <img src="/logo.png" alt="icon" className="form-icon" />
          <h1>Input Asset</h1>
        </div>
        <form className="form-grid" onSubmit={handleConfirm}>
          <div>
            <label>Kategori Asset</label>
            <input type="text" value={assetData.kategori} readOnly />
          </div>
          <div>
            <label>Nama Asset</label>
            <input type="text" value={assetData.nama} readOnly />
          </div>
          <div>
            <label>Sub Kategori</label>
            <input type="text" value={assetData.sub_kategori} readOnly />
          </div>
          <div>
            <label>Kondisi Asset</label>
            <input type="text" value={assetData.kondisi} readOnly />
          </div>
          <div>
            <label>Tanggal Perolehan Asset</label>
            <input type="date" value={assetData.tanggal_perolehan} readOnly />
          </div>
          <div>
            <label>Lokasi</label>
            <input type="text" value={assetData.lokasi} readOnly />
          </div>
          <div>
            <label>Nilai Perolehan Asset</label>
            <input type="number" value={assetData.nilai_perolehan} readOnly />
          </div>
          {assetData.doc && (
            <div>
              <label>Lampiran Bukti</label>
              <input
                type="text"
                value={assetData.doc.name || "File terlampir"}
                readOnly
              />
            </div>
          )}
          <div className="col-span">
            <label>Deskripsi Asset</label>
            <input type="text" value={assetData.deskripsi_aset} readOnly />
          </div>
          <div className="col-span">
            <label>Status</label>
            <input type="text" value={assetData.status} readOnly />
          </div>
          <div className="col-span">
            <label>Penanggung Jawab</label>
            <input type="text" value={assetData.penanggung_jawab} readOnly />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/AsetInput3")}
            >
              Batal
            </button>
            <button type="submit" className="btn-confirm" disabled={isLoading}>
              {isLoading ? "Loading..." : "Konfirmasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
