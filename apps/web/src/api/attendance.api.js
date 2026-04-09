import apiClient from './axios.js';

const attendanceApi = {
  getByClient: (clientId) =>
    apiClient.get(`/attendance/client/${clientId}`).then((r) => r.data),
  checkIn: (data) =>
    apiClient.post('/attendance/checkin', data).then((r) => r.data),
  getDaily: (date) =>
    apiClient.get('/attendance/daily', { params: date ? { date } : {} }).then((r) => r.data),
};

export default attendanceApi;
