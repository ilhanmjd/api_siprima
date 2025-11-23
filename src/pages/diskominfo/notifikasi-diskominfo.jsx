import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../contexts/AssetContext";
import "./notifikasi-diskominfo.css"; // Anda mungkin perlu membuat file CSS ini

function NotifikasiDiskominfo() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = () => {
    // Logika untuk submit data dari Diskominfo
    console.log("Data dari Diskominfo:", assetData);
    // Navigasi ke halaman konfirmasi atau halaman selanjutnya
    // navigate("/konfirmasi-diskominfo");
  };

  const handleBack = () => {
    // Kembali ke dashboard Diskominfo
    navigate("/dashboard-diskominfo");
  };
  const handleReject = () => {
    // Logika untuk menolak, sesuaikan navigasi jika perlu
    // navigate("/reject-diskominfo");
    alert("Fungsi Reject belum diimplementasikan");
  };

  const handleVerify = () => {
    if (allFilled) {
      // Logika untuk verifikasi, sesuaikan navigasi jika perlu
      // navigate("/accept-diskominfo");
      alert("Fungsi Verifikasi belum diimplementasikan");
    } else {
      alert("Harap isi semua field");
    }
  };

  // Logika untuk progress bar, sesuaikan dengan field yang relevan
  const step1Active = assetData.idAset;
  const connectorActive = assetData.idAset && assetData.alasanPenghapusan;
  const step2Active =
    assetData.idAset && assetData.alasanPenghapusan && assetData.lampiran;

  const allFilled =
    assetData.idAset && assetData.alasanPenghapusan && assetData.lampiran;

  return (
    <div className="asset-container">
      <button className="back-btn" onClick={handleBack}>
        <img src="/kembali.png" alt="Kembali" width="26" height="52" />
      </button>
      {/* === PROGRESS BAR === */}
      <div className="progress-wrapper">
        {/* Step 1 */}
        <div className="step-wrapper">
          <div
            className={`icon-box ${step1Active ? "active-bg" : "inactive-bg"}`}
          >
            <img
              src="/identitas aset.png"
              alt="Identitas Aset"
              width="30"
              height="23"
            />
          </div>
          <p>Identitas Aset</p>
        </div>

        {/* Connector 1 */}
        <div
          className={`connector ${
            connectorActive ? "active-connector" : "inactive-connector"
          }`}
        ></div>

        {/* Step 2 */}
        <div className="step-wrapper">
          <div
            className={`icon-box ${step2Active ? "active-bg" : "inactive-bg"}`}
          >
            <img
              src="/Penghapusan_Aset.png"
              alt="Detail Notifikasi"
              width="30"
              height="30"
            />
          </div>
          <p>Detail Notifikasi</p>
        </div>
      </div>

      {/* === FORM === */}
      <form
        className="asset-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label>ID Aset</label>
        <input
          type="text"
          name="idAset"
          value={assetData.idAset || ""}
          onChange={handleChange}
          required
        />

        <label>Alasan Penghapusan</label>
        <input
          type="text"
          name="alasanPenghapusan"
          value={assetData.alasanPenghapusan || ""}
          onChange={handleChange}
          required
        />

        <label>Lampiran</label>
        <input
          type="file"
          name="lampiran"
          onChange={handleFileChange}
          required
        />

        <div className="button-group">
          <button
            type="button"
            className="next-btn"
            style={{
              backgroundColor: "#FF0004",
            }}
            onClick={handleReject}
          >
            REJECT
          </button>
          <button
            type="button"
            className={`next-btn ${allFilled ? "active" : "disabled"}`}
            disabled={!allFilled}
            onClick={handleVerify}
            style={{ backgroundColor: allFilled ? "#29AE08" : undefined }}
          >
            VERIFIKASI
          </button>
        </div>
      </form>
    </div>
  );
}

export default NotifikasiDiskominfo;
