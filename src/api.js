import axios from "axios";

const API_BASE_URL = "https://api.siprima.digitaltech.my.id";

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
    if (error.response?.status === 401) {
      console.warn("Unauthorized, redirect to login.");
    }
    return Promise.reject(error);
  }
);

export default {
  // ========== AUTH ==========
  login: (email, password) =>
    api.post("/api/login", { email, password }),

  logout: () => api.post("/api/logout"),

  getUser: () => api.get("/api/user"),


  // ========== DATA MASTER ==========
  getKategori: () => api.get("/api/data-master/kategori"),
  getSubKategori: (kategori_id = null) =>
    api.get("/api/data-master/sub-kategori", {
      params: kategori_id ? { kategori_id } : {},
    }),
  getLokasi: () => api.get("/api/data-master/lokasi"),
  getPenanggungJawab: () => api.get("/api/data-master/penanggungjawab"),


  // ========== ASSETS ==========
  getAssets: (params = {}) => api.get("/api/assets", { params }),
  getAssetById: (id) => api.get(`/api/assets/${id}`),
  createAsset: (data) => api.post("/api/assets", data),
  updateAsset: (id, data) => api.put(`/api/assets/${id}`, data),
  deleteAsset: (id) => api.delete(`/api/assets/${id}`),


  // ========== DINAS ==========
  getDinas: () => api.get("/api/dinas"),
  createDinas: (data) => api.post("/api/dinas", data),
  updateDinas: (id, data) => api.put(`/api/dinas/${id}`, data),
  deleteDinas: (id) => api.delete(`/api/dinas/${id}`),
};
