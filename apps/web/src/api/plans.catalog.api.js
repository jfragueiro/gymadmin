import apiClient from './axios.js';

const plansCatalogApi = {
  getAll: () => apiClient.get('/plans').then((r) => r.data),
};

export default plansCatalogApi;
