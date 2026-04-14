import apiClient from './axios.js';

const usersApi = {
  getAll: (params) => apiClient.get('/users', { params }).then((r) => r.data),
  create: (data) => apiClient.post('/users', data).then((r) => r.data),
  update: (id, data) => apiClient.put(`/users/${id}`, data).then((r) => r.data),
  toggleStatus: (id, isActive) => apiClient.patch(`/users/${id}/status`, { isActive }).then((r) => r.data),
  getMe: () => apiClient.get('/users/me').then((r) => r.data),
  updateMe: (data) => apiClient.put('/users/me', data).then((r) => r.data),
};

export default usersApi;
