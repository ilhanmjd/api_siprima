import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./notifikasi-diskominfo.css";

function NotifikasiDiskominfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deletions, setDeletions] = useState([]);
  const [selectedDeletion, setSelectedDeletion] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAcceptedDeletions();
  }, []);

  const fetchAcceptedDeletions = async () => {
    try {
      setLoading(true);
      const response = await api.getAssetDeletions({ status: 'accepted' });
      setDeletions(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch deletions:', error);
      alert('Gagal mengambil data penghapusan asset');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard-diskominfo");
  };

  const handleDeleteAsset = async (deletion) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus asset "${deletion.asset?.nama}"? Tindakan ini tidak dapat dibatalkan!`)) {
      return;
    }

    try {
      setIsDeleting(true);
      
      // Delete the actual asset
      await api.deleteAsset(deletion.asset_id);
      
      // Optionally delete the deletion request record
      await api.deleteAssetDeletion(deletion.id);
      
      alert('Asset berhasil dihapus dari sistem!');
      
      // Refresh the list
      fetchAcceptedDeletions();
      setSelectedDeletion(null);
    } catch (error) {
      console.error('Failed to delete asset:', error);
      alert('Gagal menghapus asset. Silakan coba lagi.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDetail = (deletion) => {
    setSelectedDeletion(deletion);
  };

  const handleCloseDetail = () => {
    setSelectedDeletion(null);
  };

  if (loading) {
    return (
      <div className="asset-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="asset-container">
      <button className="back-btn" onClick={handleBack}>
        <img src="/kembali.png" alt="Kembali" width="26" height="52" />
      </button>

      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Asset Deletion Management</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Daftar asset yang sudah disetujui untuk dihapus. Klik "Delete Asset" untuk menghapus asset dari sistem.
        </p>

        {deletions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px' 
          }}>
            <p>Tidak ada asset yang menunggu untuk dihapus.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {deletions.map((deletion) => (
              <div
                key={deletion.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '10px', color: '#333' }}>
                      {deletion.asset?.nama || `Asset ID: ${deletion.asset_id}`}
                    </h3>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Alasan Penghapusan:</strong>
                      <p style={{ marginTop: '5px', color: '#666' }}>
                        {deletion.alasan_penghapusan}
                      </p>
                    </div>
                    {deletion.asset && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Kondisi:</strong> 
                        <span style={{ 
                          marginLeft: '10px',
                          padding: '3px 10px',
                          backgroundColor: '#ffebee',
                          color: '#c62828',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}>
                          {deletion.asset.kondisi}
                        </span>
                      </div>
                    )}
                    <div style={{ fontSize: '0.9rem', color: '#999' }}>
                      Diajukan: {new Date(deletion.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                    <button
                      onClick={() => handleViewDetail(deletion)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      View Detail
                    </button>
                    <button
                      onClick={() => handleDeleteAsset(deletion)}
                      disabled={isDeleting}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: isDeleting ? '#ccc' : '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isDeleting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Asset'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDeletion && (
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
            <h2 style={{ marginBottom: '20px' }}>Detail Asset Deletion</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Asset Name:</strong>
              <p>{selectedDeletion.asset?.nama || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Asset ID:</strong>
              <p>{selectedDeletion.asset_id}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Kondisi:</strong>
              <p>{selectedDeletion.asset?.kondisi || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Lokasi:</strong>
              <p>{selectedDeletion.asset?.lokasi?.nama || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Alasan Penghapusan:</strong>
              <p>{selectedDeletion.alasan_penghapusan}</p>
            </div>

            {selectedDeletion.lampiran && (
              <div style={{ marginBottom: '15px' }}>
                <strong>Lampiran:</strong>
                <p>{selectedDeletion.lampiran}</p>
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <strong>Status:</strong>
              <span style={{
                marginLeft: '10px',
                padding: '5px 15px',
                backgroundColor: '#4caf50',
                color: 'white',
                borderRadius: '4px'
              }}>
                {selectedDeletion.status}
              </span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Tanggal Pengajuan:</strong>
              <p>{new Date(selectedDeletion.created_at).toLocaleString('id-ID')}</p>
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
              <button
                onClick={() => {
                  handleCloseDetail();
                  handleDeleteAsset(selectedDeletion);
                }}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: isDeleting ? '#ccc' : '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete Asset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotifikasiDiskominfo;
