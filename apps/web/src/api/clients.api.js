import apiClient from './axios.js';

const clientsApi = {
  getAll: (params) => apiClient.get('/clients', { params }).then((r) => r.data),
  getById: (id) => apiClient.get(`/clients/${id}`).then((r) => r.data),
  create: (data) => apiClient.post('/clients', data).then((r) => r.data),
  update: (id, data) => apiClient.put(`/clients/${id}`, data).then((r) => r.data),
  deactivate: (id) => apiClient.delete(`/clients/${id}`).then((r) => r.data),
};

export default clientsApi;
