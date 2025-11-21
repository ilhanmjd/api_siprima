// Fungsi untuk login
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', response.data); // Debug: lihat struktur response
    const token = response.data.token || response.data.access_token || response.data.data?.token;
    const refreshToken = response.data.refresh_token || response.data.refreshToken || response.data.data?.refresh_token;
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage:', token); // Debug: konfirmasi penyimpanan
    }
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
      console.log('Refresh token saved to localStorage:', refreshToken);
    } else {
      console.warn('No refresh token found in response');
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
import axios from 'axios';

const API_BASE_URL = 'https://siprima.digitaltech.my.id/api/v1'; // URL API backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke header jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk response, handle 401 dengan refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refreshToken();
        // Retry request asli
        return api.request(error.config);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Jika refresh gagal, hapus token dan redirect ke login
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Fungsi login telah dihapus

// Fungsi untuk refresh token
export const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem('refresh_token');
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }
    const response = await api.post('/auth/refresh', { refresh_token: refreshTokenValue });
    console.log('Refresh token response:', response.data);
    const token = response.data.token || response.data.access_token || response.data.data?.token;
    const newRefreshToken = response.data.refresh_token || response.data.refreshToken || response.data.data?.refresh_token;
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token refreshed and saved to localStorage:', token);
    }
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
      console.log('Refresh token updated:', newRefreshToken);
    } else {
      console.warn('No new refresh token in response');
    }
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan data pengguna saat ini
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan assets
export const getAssets = async () => {
  try {
    const response = await api.get('/assets');
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

// Fungsi untuk menambahkan asset
export const addAsset = async (assetData) => {
  try {
    let dataToSend = assetData;
    let headers = {};

    // Jika ada file lampiran, gunakan FormData
    if (assetData.lampiran && assetData.lampiran instanceof File) {
      const formData = new FormData();
      Object.keys(assetData).forEach(key => {
        if (key === 'lampiran') {
          formData.append('lampiran', assetData.lampiran);
        } else {
          formData.append(key, assetData[key]);
        }
      });
      dataToSend = formData;
      headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await api.post('/assets', dataToSend, { headers });
    return response.data;
  } catch (error) {
    console.error('Error adding asset:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan risks
export const getRisks = async () => {
  try {
    const response = await api.get('/risks');
    return response.data;
  } catch (error) {
    console.error('Error fetching risks:', error);
    throw error;
  }
};

// Fungsi untuk menambahkan risk
export const addRisk = async (riskData) => {
  try {
    const response = await api.post('/risks', riskData);
    return response.data;
  } catch (error) {
    console.error('Error adding risk:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan maintenances
export const getMaintenances = async () => {
  try {
    const response = await api.get('/maintenance');
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenances:', error);
    throw error;
  }
};
