import axios from "axios";

// const API_BASE_URL = "https://api.siprima.digitaltech.my.id";
const API_BASE_URL = "http://127.0.0.1:8000";
// const API_BASE_URL = "https://46d083476aee.ngrok-free.app";

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
  
  // hapus kalau server udah kembali
  headers: {
     "ngrok-skip-browser-warning": "true",
  },
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
    return Promise.reject(error);
  }
);

export default {
  // ========== AUTH ==========
  login: (email, password) =>
    api.post("/api/login", { email, password }),

  logout: (config = {}) => api.post("/api/logout", null, config),

  getUser: (config = {}) => api.get("/api/user", config),


  // ========== DATA MASTER ==========
  getKategori: () => api.get("/api/data-master/kategori"),
  getSubKategori: (kategori_id = null) =>
    api.get("/api/data-master/sub-kategori", {
      params: kategori_id ? { kategori_id } : {},
    }),
  getLokasi: () => api.get("/api/data-master/lokasi"),
  getPenanggungJawab: () => api.get("/api/data-master/penanggung-jawab"),


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
};
