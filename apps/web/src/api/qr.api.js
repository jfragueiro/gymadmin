import apiClient from './axios.js';

const qrApi = {
  getClientQR: (clientId) =>
    apiClient.get(`/clients/${clientId}/qr`).then((r) => r.data),
  regenerate: (clientId) =>
    apiClient.post(`/clients/${clientId}/regenerate-qr`).then((r) => r.data),
  publicCheckIn: (token) =>
    apiClient.get(`/check-in/${token}`).then((r) => r.data),
};

export default qrApi;
