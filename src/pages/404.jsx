import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  // ambil role dari localStorage
  const role = localStorage.getItem("role");

  const handleBack = () => {
    // jika role tidak ditemukan → hapus credential → ke login
    if (!role) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      // kalau ada data lain tambahkan juga di sini

      navigate("/"); // halaman login
      return;
    }

    // jika role ada → arahkan ke dashboard sesuai role
    switch (role) {
      case "staff":
        navigate("/Dashboard");
        break;

      case "kepala_seksi":
        navigate("/Dashboard-verifikator");
        break;

      case "admin_kota":
        navigate("/dashboard-diskominfo");
        break;

      case "auditor":
        navigate("/dashboard-auditor");
        break;

      default:
        // fallback kalau role tidak dikenali
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        navigate("/");
        break;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Halaman Tidak Ditemukan</h2>
      <p style={styles.desc}>
        Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
      </p>

      <button style={styles.button} onClick={handleBack}>
        Kembali ke Dashboard
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f5f7fb",
    color: "#1f2937",
  },
  code: {
    fontSize: "90px",
    fontWeight: "700",
    color: "#1d4ed8",
    margin: "0",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  desc: {
    fontSize: "14px",
    maxWidth: "400px",
    marginBottom: "30px",
    opacity: 0.7,
  },
  button: {
    backgroundColor: "#1d4ed8",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
};
