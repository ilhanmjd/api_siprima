import axios from "axios";

const API_BASE_URL = "https://api.siprima.digitaltech.my.id";
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

  getUser: () => api.get("/api/user"),


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
  updateDinas: (id, data) => api.put(`/api/dinas/${id}`, data),
  deleteDinas: (id) => api.delete(`/api/dinas/${id}`),
};
