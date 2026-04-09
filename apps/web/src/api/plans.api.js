import apiClient from './axios.js';

const plansApi = {
  getByClient: (clientId) =>
    apiClient.get(`/clients/${clientId}/training-plans`).then((r) => r.data),
  create: (data) =>
    apiClient.post('/training-plans', data).then((r) => r.data),
  update: (id, data) =>
    apiClient.put(`/training-plans/${id}`, data).then((r) => r.data),
  remove: (id) =>
    apiClient.delete(`/training-plans/${id}`).then((r) => r.data),
  addExercise: (planId, data) =>
    apiClient.post(`/training-plans/${planId}/exercises`, data).then((r) => r.data),
  removeExercise: (planId, exerciseId) =>
    apiClient.delete(`/training-plans/${planId}/exercises/${exerciseId}`).then((r) => r.data),
};

export default plansApi;
