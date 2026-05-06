import apiClient from './axios.js';

const financesApi = {
  getSummary: (year) =>
    apiClient.get('/finances/summary', { params: { year } }).then((r) => r.data),
  getCategoryEntries: (categoryId, month) =>
    apiClient.get(`/finances/categories/${categoryId}/entries`, { params: { month } }).then((r) => r.data),
  addCategory: (name) =>
    apiClient.post('/finances/categories', { name }).then((r) => r.data),
  addEntry: (categoryId, data) =>
    apiClient.post(`/finances/categories/${categoryId}/entries`, data).then((r) => r.data),
  deleteEntry: (entryId) =>
    apiClient.delete(`/finances/entries/${entryId}`),
};

export default financesApi;
