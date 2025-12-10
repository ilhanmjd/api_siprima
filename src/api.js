import axios from "axios";

// Prefer env override so local/remote API targets can be switched without code edits
// Use Vite dev proxy (/api) during development to avoid CORS.
const API_BASE_URL = (() => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const envUrl = import.meta.env.VITE_URL_API;
    // In dev, prefer explicit URL if provided; otherwise same-origin (proxied) without duplicating /api
    if (import.meta.env.DEV) return envUrl || "";
    if (envUrl) return envUrl;
  }
  return "http://127.0.0.1:8000";
})();

// AbortController presence to enable cancellation support
const noopAbortController = new AbortController();
const isDebugLoggingEnabled =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  (import.meta.env.DEV || import.meta.env.VITE_DEBUG_LOGS === "true");

// Ambil token dari localStorage
const getToken = () => localStorage.getItem("token");

// Setup instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  
//   // hapus kalau server udah kembali
//   headers: {
//      "ngrok-skip-browser-warning": "true",
//   },
});

// Inject Authorization token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle error respons
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika token tidak valid / unauthorized, arahkan ke halaman login
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location = "/";
      return; // stop promise chain
    }
    return Promise.reject(error);
  }
);

export default {
  // ========== AUTH ==========
  login: (email, password) =>
    api.post("/api/login", { email, password }),

  logout: (config = {}) => api.post("/api/logout", null, config),

  getUser: (config = {}) => api.get("/api/user", config),

  // ========== SUB KATEGORIS ==========
  getSubKategoris: (params = {}) => api.get("/api/sub-kategoris", { params }),
  createSubKategori: (data) => api.post("/api/sub-kategoris", data),
  getSubKategoriById: (id, config = {}) =>
    api.get(`/api/sub-kategoris/${id}`, config),
  updateSubKategori: (id, data) => api.put(`/api/sub-kategoris/${id}`, data),
  deleteSubKategori: (id) => api.delete(`/api/sub-kategoris/${id}`),


  // ========== ASSETS ==========
  getAssets: (params = {}) => {
    const { signal, ...rest } = params || {};
    return api.get("/api/assets", { params: rest, signal });
  },
  getAssetById: (id, config = {}) => api.get(`/api/assets/${id}`, config),
  createAsset: (data) => api.post("/api/assets", data),
  updateAsset: (id, data) => api.put(`/api/assets/${id}`, data),
  deleteAsset: (id) => api.delete(`/api/assets/${id}`),


  // ========== DINAS ==========
  getDinas: () => api.get("/api/dinas"),
  createDinas: (data) => api.post("/api/dinas", data),
  getDinasById: (id, config = {}) => api.get(`/api/dinas/${id}`, config),
  updateDinas: (id, data) => api.put(`/api/dinas/${id}`, data),
  deleteDinas: (id) => api.delete(`/api/dinas/${id}`),

  // ========== LOKASI ==========
  getLokasis: (params = {}) => api.get("/api/lokasis", { params }),
  createLokasi: (data) => api.post("/api/lokasis", data),
  getLokasiById: (id, config = {}) => api.get(`/api/lokasis/${id}`, config),
  updateLokasi: (id, data) => api.put(`/api/lokasis/${id}`, data),
  deleteLokasi: (id) => api.delete(`/api/lokasis/${id}`),

  // ========== PENANGGUNG JAWAB ==========
  getPenanggungjawabs: (params = {}) =>
    api.get("/api/penanggungjawabs", { params }),
  createPenanggungjawab: (data) => api.post("/api/penanggungjawabs", data),
  getPenanggungjawabById: (id, config = {}) =>
    api.get(`/api/penanggungjawabs/${id}`, config),
  updatePenanggungjawab: (id, data) =>
    api.put(`/api/penanggungjawabs/${id}`, data),
  deletePenanggungjawab: (id) => api.delete(`/api/penanggungjawabs/${id}`),

  
  // ========== RISK ==========
  getRisks: (params = {}) => {
    const { signal, ...rest } = params || {};
    return api.get("/api/risks", { params: rest, signal });
  },
  createRisk: (data) => api.post("/api/risks", data),
  getRiskById: (id, config = {}) => api.get(`/api/risks/${id}`, config),
  approveRisk: (id, data = {}) => api.post(`/api/risks/${id}/approve`, data),
  rejectRisk: (id, data = {}) => api.post(`/api/risks/${id}/reject`, data),

  // ========== RISK TREATMENTS ==========
  getRiskTreatments: (params = {}) => {
    const { signal, ...rest } = params || {};
    return api.get("/api/risk-treatments", { params: rest, signal });
  },
  createRiskTreatment: (data) => api.post("/api/risk-treatments", data),
  getRiskTreatmentById: (id, config = {}) =>
    api.get(`/api/risk-treatments/${id}`, config),
  rejectRiskTreatment: (id, data = {}) =>
    api.post(`/api/risk-treatments/${id}/reject`, data),
  approveRiskTreatment: (id, data = {}) =>
    api.post(`/api/risk-treatments/${id}/approve`, data),

  // ========== MAINTENANCES ==========
  getMaintenances: (params = {}) => api.get("/api/maintenances", { params }),
  createMaintenance: (data) => api.post("/api/maintenances", data),
  getMaintenanceById: (id, config = {}) =>
    api.get(`/api/maintenances/${id}`, config),
  updateMaintenance: (id, data) => api.put(`/api/maintenances/${id}`, data),
};
