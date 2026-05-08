import apiClient from './axios.js';

const kioscoApi = {
  requestQR: (documentNumber) =>
    apiClient.post('/kiosco/request', { documentNumber }).then((r) => r.data),

  getStatus: (token) =>
    apiClient.get(`/kiosco/status/${token}`).then((r) => r.data),

  validateQR: (token) =>
    apiClient.get(`/kiosco/validate/${token}`).then((r) => r.data),
};

export default kioscoApi;
