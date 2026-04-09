import apiClient from './axios.js';

const metricsApi = {
  getByClient: (clientId) =>
    apiClient.get(`/clients/${clientId}/metrics`).then((r) => r.data),
  create: (clientId, data) =>
    apiClient.post(`/clients/${clientId}/metrics`, data).then((r) => r.data),
};

export default metricsApi;
