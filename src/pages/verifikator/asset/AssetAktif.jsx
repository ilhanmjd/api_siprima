import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import "./AssetAktif.css";

export default function AssetAktif() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    fetchActiveAssets();
  }, []);

  const fetchActiveAssets = async () => {
    try {
      setLoading(true);
      const response = await api.getAssets({ status: 'diterima' });
      setAssets(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch active assets:', error);
      alert('Gagal mengambil data asset aktif');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/Dashboard-verifikator");
  };

  const handleViewDetail = (asset) => {
    setSelectedAsset(asset);
  };

  const handleCloseDetail = () => {
    setSelectedAsset(null);
  };

  if (loading) {
    return (
      <div className="asset-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="asset-aktif-page">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="brand">SIPRIMA</span>
        </div>

        <div className="navbar-center">
          <span
            onClick={() => navigate("/Dashboard-verifikator")}
            className="active"
          >
            Dashboard
          </span>
          <span onClick={() => navigate("/notifikasi-verifikator-maintenance")}>
            Maintenance
          </span>
        </div>

        <div className="navbar-right">
          {/* <div className="icon">🔔</div> */}
        </div>
      </nav>

      <div className="breadcrumb">
        <span
          className="breadcrumb-link"
          onClick={() => navigate("/Dashboard-verifikator")}
        >
          Dashboard
        </span>{" "}
        {">"} Asset Aktif
      </div>

      <div className="content-box">
        {loading && <div className="loading-text">Loading...</div>}
        {!loading && assets.length === 0 && (
          <div className="empty-text">Tidak ada asset aktif.</div>
        )}
        {!loading &&
          assets.map((asset) => (
            <div
              key={asset.id}
              className="asset-card"
              onClick={() => handleViewDetail(asset)}
            >
              <div className="asset-header-row">
                <div className="asset-header-left">
                  <span className="asset-title">{asset.nama}</span>
                  <span className="asset-id">| {asset.kode_bmd}</span>
                </div>
                <span className="asset-kondisi">
                  {asset.kondisi}
                </span>
              </div>
              <div className="asset-text">
                {asset.deskripsi || 'Tidak ada deskripsi'}
              </div>
            </div>
          ))}
      </div>

      {/* Detail Modal */}
      {selectedAsset && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseDetail}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '20px' }}>Detail Asset Aktif</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Asset Name:</strong>
              <p>{selectedAsset.nama}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Kode BMD:</strong>
              <p>{selectedAsset.kode_bmd}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Deskripsi:</strong>
              <p>{selectedAsset.deskripsi || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Kategori:</strong>
              <p>{selectedAsset.kategori?.nama || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Sub Kategori:</strong>
              <p>{selectedAsset.subkategori?.nama || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Kondisi:</strong>
              <p>{selectedAsset.kondisi || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Lokasi:</strong>
              <p>{selectedAsset.lokasi?.nama || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Alamat Lokasi:</strong>
              <p>{selectedAsset.lokasi?.alamat || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Penanggung Jawab:</strong>
              <p>{selectedAsset.penanggungjawab?.nama || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Jabatan Penanggung Jawab:</strong>
              <p>{selectedAsset.penanggungjawab?.jabatan || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Nilai Perolehan:</strong>
              <p>Rp {selectedAsset.nilai_perolehan?.toLocaleString('id-ID') || 0}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Tanggal Perolehan:</strong>
              <p>{new Date(selectedAsset.tgl_perolehan).toLocaleDateString('id-ID')}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Status Penggunaan:</strong>
              <span style={{
                marginLeft: '10px',
                padding: '5px 15px',
                backgroundColor: selectedAsset.is_usage === 'active' ? '#4caf50' : '#ff9800',
                color: 'white',
                borderRadius: '4px'
              }}>
                {selectedAsset.is_usage === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Status Verifikasi:</strong>
              <span style={{
                marginLeft: '10px',
                padding: '5px 15px',
                backgroundColor: '#4caf50',
                color: 'white',
                borderRadius: '4px'
              }}>
                {selectedAsset.status}
              </span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Dinas:</strong>
              <p>{selectedAsset.dinas?.name || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Tanggal Input:</strong>
              <p>{new Date(selectedAsset.created_at).toLocaleString('id-ID')}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Terakhir Update:</strong>
              <p>{new Date(selectedAsset.updated_at).toLocaleString('id-ID')}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleCloseDetail}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#757575',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
