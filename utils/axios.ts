import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://lotteworld-backend-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  timeout: 15000,
});

api.interceptors.response.use(
  res => res,
  err => {
    console.log('[API ERROR]', {
      method: err?.config?.method,
      url: err?.config?.url,
      baseURL: API_BASE,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    return Promise.reject(err);
  }
);

export default api;