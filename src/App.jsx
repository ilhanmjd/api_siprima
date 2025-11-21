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
import ServiceDesk from "./pages/dinas/Dashboard/service-desk";
import FAQ from "./pages/dinas/Dashboard/faq";
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
import NotifRejectAset from "./pages/dinas/notifikasi/notif-reject-aset";
import NotifRejectMaintenance from "./pages/dinas/notifikasi/notif-reject-maintenance";
import NotifAcceptAset from "./pages/dinas/notifikasi/notif-accept-aset";
import NotifAcceptRisk from "./pages/dinas/notifikasi/notif-accept-risk";
import NotifRejectRisk from "./pages/dinas/notifikasi/notif-reject-risk";
import NotifAcceptRiskTreatment from "./pages/dinas/notifikasi/notif-accept-risk-treatment";
import NotifRejectRiskTreatment from "./pages/dinas/notifikasi/notif-reject-risk-treatment";
import PenghapusanAset from "./pages/dinas/hapus/PenghapusanAset";
import KonfirmasiPenghapusanAset from "./pages/dinas/hapus/konfirmasi-penghapusan-aset";

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
]);

function App() {
  return (
    <AssetProvider>
      <RouterProvider router={router} />
    </AssetProvider>
  );
}

export default App;
