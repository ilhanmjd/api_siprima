// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";


import { AssetProvider } from "./contexts/AssetContext";
import Login from "./components/Login";
import Dashboard from "./pages/dinas/Dashboard/Dashboard";
import DashboardVerifikator from "./pages/verifikator/Dashboard/Dashboard-verifikator";
import DashboardAuditor from "./pages/auditor/DashboardAuditor";
import DashboardDiskominfo from "./pages/diskominfo/Dashboard-diskominfo";
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
import LaporanAset from "./pages/dinas/Laporan/laporan";

// Komponen wrapper untuk halaman yang memerlukan autentikasi dan role-based access
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/");
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(true);

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      // Redirect to role-specific dashboard
      switch (role) {
        case 'user_dinas':
          navigate("/Dashboard");
          break;
        case 'verifikator':
          navigate("/Dashboard-verifikator");
          break;
        case 'admin_dinas':
          navigate("/dashboard-diskominfo");
          break;
        case 'auditor':
          navigate("/dashboard-auditor");
          break;
        default:
          navigate("/");
      }
      setIsLoading(false);
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [navigate, allowedRoles]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && isAuthorized ? children : null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/Dashboard",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/RiwayatPemeliharaan",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <RiwayatPemeliharaan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/laporan",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <LaporanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-accept-Penghapusan-Aset",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <NotifAcceptPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-Penghapusan-Aset",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <NotifRejectPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAset1",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiAset1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAset2",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiAset2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAset3",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiAset3 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRejectAsset",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiRejectAsset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAcceptAsset",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiAcceptAsset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-verifikator-risiko",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <NotifikasiVerifikatorRisiko />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRisiko1",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiRisiko1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRisiko2",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiRisiko2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRejectRisiko",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiRejectRisiko />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAcceptRisiko",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiAcceptRisiko />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-verifikator-risk-treatment",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <NotifikasiVerifikatorRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRiskTreatment1",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiRiskTreatment1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRiskTreatment2",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiRiskTreatment2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRejectRiskTreatment",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiRejectRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAcceptRiskTreatment",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiAcceptRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-verifikator-maintenance",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <NotifikasiVerifikatorMaintenance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiMaintenance1",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiMaintenance1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiRejectMaintenance",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiRejectMaintenance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/VerifikasiAcceptMaintenance",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiAcceptMaintenance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-verifikator-penghapusan-aset",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <NotifikasiVerifikatorPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verifikator-penghapusan-aset",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikatorPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verifikasi-reject-penghapusan-aset",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiRejectPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verifikasi-accept-penghapusan-aset",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <VerifikasiAcceptPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/service-desk",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <ServiceDesk />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faq",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <FAQ />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Dashboard-verifikator",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <DashboardVerifikator />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-verifikator-aset",
    element: (
      <ProtectedRoute allowedRoles={['Verifikator']}>
        <NotifikasiVerifikatorAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/AsetInput1",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <AsetInput1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/AsetInput2",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <AsetInput2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/AsetInput3",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <AsetInput3 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/konfirmasi-input-aset",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <KonfirmasiInputAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-user-dinas",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <NotifikasiUserDinasRisikoDariVerifikator />
      </ProtectedRoute>
    ),
  },
  {
    path: "/DashboardRisk",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <DashboardRisk />
      </ProtectedRoute>
    ),
  },
  {
    path: "/InputRisiko1",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <InputRisiko1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/InputRisiko2",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <InputRisiko2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/konfirmasi-input-risiko",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <KonfirmasiInputRisiko />
      </ProtectedRoute>
    ),
  },
  {
    path: "/konfirmasi-input-risk-treatment",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <KonfirmasiInputRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/konfirmasi-input-maintenance",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <KonfirmasiInputMaintenance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/RiskTreatment1",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <RiskTreatment1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/RiskTreatment2",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <RiskTreatment2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Maintenance1",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <Maintenance1 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-accept-aset",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <NotifAcceptAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-aset",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <NotifRejectAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-accept-risk",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <NotifAcceptRisk />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-risk",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <NotifRejectRisk />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-accept-risk-treatment",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <NotifAcceptRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-risk-treatment",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <NotifRejectRiskTreatment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notif-reject-maintenance",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <NotifRejectMaintenance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/PenghapusanAset",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <PenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Konfirmasi-Penghapusan-Aset",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <KonfirmasiPenghapusanAset />
      </ProtectedRoute>
    ),
  },
  {
    path: "/JadwalPemeliharaan",
    element: (
      <ProtectedRoute allowedRoles={['User Dinas']}>
        <JadwalPemeliharaan />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard-auditor",
    element: (
      <ProtectedRoute allowedRoles={['Auditor']}>
        <DashboardAuditor />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard-diskominfo",
    element: (
      <ProtectedRoute allowedRoles={['Diskominfo']}>
        <DashboardDiskominfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifikasi-diskominfo",
    element: (
      <ProtectedRoute allowedRoles={['Diskominfo']}>
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
