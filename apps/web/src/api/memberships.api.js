import apiClient from './axios.js';

const membershipsApi = {
  getOverview: () =>
    apiClient.get('/memberships/overview').then((r) => r.data),
  getByClient: (clientId) =>
    apiClient.get(`/memberships/client/${clientId}`).then((r) => r.data),
  assign: (data) =>
    apiClient.post('/memberships/assign', data).then((r) => r.data),
  getPaymentsByClient: (clientId) =>
    apiClient.get(`/payments/client/${clientId}`).then((r) => r.data),
  registerPayment: (data) =>
    apiClient.post('/payments', data).then((r) => r.data),
};

export default membershipsApi;
