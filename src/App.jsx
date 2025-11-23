// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { AssetProvider } from "./contexts/AssetContext";
import Login from "./components/Login"; // perhatikan huruf besar L
import Dashboard from "./pages/dinas/Dashboard/Dashboard";
import DashboardVerifikator from "./pages/verifikator/Dashboard/Dashboard-verifikator";
import DashboardAuditor from "./pages/auditor/DashboardAuditor";
import DashboardDiskominfo from "./pages/diskominfo/dashboard-diskominfo";
import NotifikasiDiskominfo from "./pages/diskominfo/notifikasi-diskominfo";
import NotifikasiVerifikatorAset from "./pages/verifikator/asset/notifikasi-verifikator-aset";
import AsetInput1 from "./pages/dinas/asset/AsetInput1";
import AsetInput2 from "./pages/dinas/asset/AsetInput2";
import AsetInput3 from "./pages/dinas/asset/AsetInput3";
import KonfirmasiInputAset from "./pages/dinas/asset/konfirmasi-input-aset";
import NotifikasiUserDinasRisikoDariVerifikator from "./pages/dinas/notifikasi/notifikasi-user-dinas";
import DashboardRisk from "./pages/dinas/risiko/DashboardRisk";
import InputRisiko1 from "./pages/dinas/risiko/InputRisiko1";
import InputRisiko2 from "./pages/dinas/risiko/InputRisiko2";
import KonfirmasiInputRisiko from "./pages/dinas/risiko/konfirmasi-input-risiko";
import KonfirmasiInputRiskTreatment from "./pages/dinas/risiko/konfirmasi-input-risk-treatment";
import KonfirmasiInputMaintenance from "./pages/dinas/risiko/konfirmasi-input-maintenance";
import RiskTreatment1 from "./pages/dinas/risiko/RiskTreatment1";
import RiskTreatment2 from "./pages/dinas/risiko/RiskTreatment2";
import Maintenance1 from "./pages/dinas/risiko/Maintenance1";
import JadwalPemeliharaan from "./pages/dinas/risiko/JadwalPemeliharaan";
import RiwayatPemeliharaan from "./pages/dinas/risiko/RiwayatPemeliharaan";
import NotifRejectAset from "./pages/dinas/notifikasi/notif-reject-aset";
import NotifRejectMaintenance from "./pages/dinas/notifikasi/notif-reject-maintenance";
import NotifAcceptAset from "./pages/dinas/notifikasi/notif-accept-aset";
import NotifAcceptPenghapusanAset from "./pages/dinas/notifikasi/NotifAcceptPenghapusanAset";
import NotifRejectPenghapusanAset from "./pages/dinas/notifikasi/NotifRejectPenghapusanAset";
import NotifAcceptRisk from "./pages/dinas/notifikasi/notif-accept-risk";
import NotifRejectRisk from "./pages/dinas/notifikasi/notif-reject-risk";
import NotifAcceptRiskTreatment from "./pages/dinas/notifikasi/notif-accept-risk-treatment";
import NotifRejectRiskTreatment from "./pages/dinas/notifikasi/notif-reject-risk-treatment";
import PenghapusanAset from "./pages/dinas/hapus/PenghapusanAset";
import KonfirmasiPenghapusanAset from "./pages/dinas/hapus/konfirmasi-penghapusan-aset";
import VerifikasiAset1 from "./pages/verifikator/asset/VerifikasiAset1";
import VerifikasiAset2 from "./pages/verifikator/asset/VerifikasiAset2";
import VerifikasiAset3 from "./pages/verifikator/asset/VerifikasiAset3";
import VerifikasiRejectAsset from "./pages/verifikator/asset/VerifikasiRejectAsset";
import VerifikasiAcceptAsset from "./pages/verifikator/asset/VerifikasiAcceptAsset";
import NotifikasiVerifikatorRisiko from "./pages/verifikator/risiko/notifikasi-verifikator-risiko";
import VerifikasiRisiko1 from "./pages/verifikator/risiko/VerifikasiRisiko1";
import VerifikasiRisiko2 from "./pages/verifikator/risiko/VerifikasiRisiko2";
import VerifikasiRejectRisiko from "./pages/verifikator/risiko/VerifikasiRejectRisiko";
import VerifikasiAcceptRisiko from "./pages/verifikator/risiko/VerifikasiAcceptRisiko";
import NotifikasiVerifikatorRiskTreatment from "./pages/verifikator/risk-treatment/notifikasi-verifikator-risk-treatment";
import VerifikasiRiskTreatment1 from "./pages/verifikator/risk-treatment/VerifikasiRiskTreatment1";
import VerifikasiRiskTreatment2 from "./pages/verifikator/risk-treatment/VerifikasiRiskTreatment2";
import VerifikasiRejectRiskTreatment from "./pages/verifikator/risk-treatment/VerifikasiRejectRiskTreatment";
import VerifikasiAcceptRiskTreatment from "./pages/verifikator/risk-treatment/VerifikasiAcceptRiskTreatment";
import NotifikasiVerifikatorMaintenance from "./pages/verifikator/maintenance/notifikasi-verifikator-maintenance";
import VerifikasiMaintenance1 from "./pages/verifikator/maintenance/VerifikasiMaintenance1";
import VerifikasiRejectMaintenance from "./pages/verifikator/maintenance/VerifikasiRejectMaintenance";
import VerifikasiAcceptMaintenance from "./pages/verifikator/maintenance/VerifikasiAcceptMaintenance";
import NotifikasiVerifikatorPenghapusanAset from "./pages/verifikator/hapus/Notifikasi-verifikator-penghapusan-aset";
import VerifikatorPenghapusanAset from "./pages/verifikator/hapus/VerifikatorPenghapusanAset";
import VerifikasiRejectPenghapusanAset from "./pages/verifikator/hapus/VerifikasiRejectPenghapusanAset";
import VerifikasiAcceptPenghapusanAset from "./pages/verifikator/hapus/VerifikasiAcceptPenghapusanAset";
import ServiceDesk from "./pages/dinas/Dashboard/service-desk";
import FAQ from "./pages/dinas/Dashboard/FAQ";

// Komponen wrapper untuk halaman yang memerlukan autentikasi
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate("/");
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/Dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/RiwayatPemeliharaan",
    element: (
      <ProtectedRoute>
        <RiwayatPemeliharaan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-accept-Penghapusan-Aset",
    element: (
      <ProtectedRoute>
        <NotifAcceptPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-Penghapusan-Aset",
    element: (
      <ProtectedRoute>
        <NotifRejectPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAset1",
    element: (
      <ProtectedRoute>
        <VerifikasiAset1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAset2",
    element: (
      <ProtectedRoute>
        <VerifikasiAset2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAset3",
    element: (
      <ProtectedRoute>
        <VerifikasiAset3 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRejectAsset",
    element: (
      <ProtectedRoute>
        <VerifikasiRejectAsset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAcceptAsset",
    element: (
      <ProtectedRoute>
        <VerifikasiAcceptAsset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-verifikator-risiko",
    element: (
      <ProtectedRoute>
        <NotifikasiVerifikatorRisiko />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRisiko1",
    element: (
      <ProtectedRoute>
        <VerifikasiRisiko1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRisiko2",
    element: (
      <ProtectedRoute>
        <VerifikasiRisiko2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRejectRisiko",
    element: (
      <ProtectedRoute>
        <VerifikasiRejectRisiko />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAcceptRisiko",
    element: (
      <ProtectedRoute>
        <VerifikasiAcceptRisiko />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-verifikator-risk-treatment",
    element: (
      <ProtectedRoute>
        <NotifikasiVerifikatorRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRiskTreatment1",
    element: (
      <ProtectedRoute>
        <VerifikasiRiskTreatment1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRiskTreatment2",
    element: (
      <ProtectedRoute>
        <VerifikasiRiskTreatment2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRejectRiskTreatment",
    element: (
      <ProtectedRoute>
        <VerifikasiRejectRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAcceptRiskTreatment",
    element: (
      <ProtectedRoute>
        <VerifikasiAcceptRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-verifikator-maintenance",
    element: (
      <ProtectedRoute>
        <NotifikasiVerifikatorMaintenance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiMaintenance1",
    element: (
      <ProtectedRoute>
        <VerifikasiMaintenance1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRejectMaintenance",
    element: (
      <ProtectedRoute>
        <VerifikasiRejectMaintenance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAcceptMaintenance",
    element: (
      <ProtectedRoute>
        <VerifikasiAcceptMaintenance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-verifikator-penghapusan-aset",
    element: (
      <ProtectedRoute>
        <NotifikasiVerifikatorPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verifikator-penghapusan-aset",
    element: (
      <ProtectedRoute>
        <VerifikatorPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verifikasi-reject-penghapusan-aset",
    element: (
      <ProtectedRoute>
        <VerifikasiRejectPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verifikasi-accept-penghapusan-aset",
    element: (
      <ProtectedRoute>
        <VerifikasiAcceptPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/service-desk",
    element: (
      <ProtectedRoute>
        <ServiceDesk />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faq",
    element: (
      <ProtectedRoute>
        <FAQ />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Dashboard-verifikator",
    element: (
      <ProtectedRoute>
        <DashboardVerifikator />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-verifikator-aset",
    element: (
      <ProtectedRoute>
        <NotifikasiVerifikatorAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/AsetInput1",
    element: (
      <ProtectedRoute>
        <AsetInput1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/AsetInput2",
    element: (
      <ProtectedRoute>
        <AsetInput2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/AsetInput3",
    element: (
      <ProtectedRoute>
        <AsetInput3 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/konfirmasi-input-aset",
    element: (
      <ProtectedRoute>
        <KonfirmasiInputAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-user-dinas",
    element: (
      <ProtectedRoute>
        <NotifikasiUserDinasRisikoDariVerifikator />
      </ProtectedRoute>
    ),
  },
  {
    path: "/DashboardRisk",
    element: (
      <ProtectedRoute>
        <DashboardRisk />
      </ProtectedRoute>
    ),
  },
  {
    path: "/InputRisiko1",
    element: (
      <ProtectedRoute>
        <InputRisiko1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/InputRisiko2",
    element: (
      <ProtectedRoute>
        <InputRisiko2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/konfirmasi-input-risiko",
    element: (
      <ProtectedRoute>
        <KonfirmasiInputRisiko />
      </ProtectedRoute>
    ),
  },
  {
    path: "/konfirmasi-input-risk-treatment",
    element: (
      <ProtectedRoute>
        <KonfirmasiInputRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/konfirmasi-input-maintenance",
    element: (
      <ProtectedRoute>
        <KonfirmasiInputMaintenance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/RiskTreatment1",
    element: (
      <ProtectedRoute>
        <RiskTreatment1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/RiskTreatment2",
    element: (
      <ProtectedRoute>
        <RiskTreatment2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Maintenance1",
    element: (
      <ProtectedRoute>
        <Maintenance1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-accept-aset",
    element: (
      <ProtectedRoute>
        <NotifAcceptAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-aset",
    element: (
      <ProtectedRoute>
        <NotifRejectAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-aset",
    element: (
      <ProtectedRoute>
        <NotifRejectAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-accept-risk",
    element: (
      <ProtectedRoute>
        <NotifAcceptRisk />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-risk",
    element: (
      <ProtectedRoute>
        <NotifRejectRisk />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-accept-risk-treatment",
    element: (
      <ProtectedRoute>
        <NotifAcceptRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-risk-treatment",
    element: (
      <ProtectedRoute>
        <NotifRejectRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-maintenance",
    element: (
      <ProtectedRoute>
        <NotifRejectMaintenance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/PenghapusanAset",
    element: (
      <ProtectedRoute>
        <PenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Konfirmasi-Penghapusan-Aset",
    element: (
      <ProtectedRoute>
        <KonfirmasiPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/JadwalPemeliharaan",
    element: (
      <ProtectedRoute>
        <JadwalPemeliharaan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard-auditor",
    element: (
      <ProtectedRoute>
        <DashboardAuditor />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard-diskominfo",
    element: (
      <ProtectedRoute>
        <DashboardDiskominfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-diskominfo",
    element: (
      <ProtectedRoute>
        <NotifikasiDiskominfo />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <AssetProvider>
      <RouterProvider router={router} />
    </AssetProvider>
  );
}

export default App;
