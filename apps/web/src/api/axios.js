import axios from 'axios';
import useAuthStore from '../store/authStore.js';

const apiClient = axios.create({
  baseURL: '/api/v1',
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginEndpoint) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
