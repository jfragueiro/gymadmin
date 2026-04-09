import apiClient from './axios.js';

const authApi = {
  login: (credentials) =>
    apiClient.post('/auth/login', credentials).then((r) => r.data),
  logout: () => apiClient.post('/auth/logout').then((r) => r.data),
};

export default authApi;
