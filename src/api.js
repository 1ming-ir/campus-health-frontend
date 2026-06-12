import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://campus-health-backend-production.up.railway.app'
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

const data = (promise) => promise.then((res) => res.data);

export const login = (payload) => data(api.post('/api/auth/login', payload));
export const registerStudent = (payload) => data(api.post('/api/auth/register', payload));
export const updateProfile = (payload) => data(api.put('/api/auth/profile', payload));
export const getMe = (username) => data(api.get('/api/auth/me', { params: { username } }));

export const createConsultation = (payload) => data(api.post('/api/consultations', payload));
export const listMyConsultations = (studentId = 1) => data(api.get('/api/consultations/my', { params: { studentId } }));
export const listConsultations = () => data(api.get('/api/consultations'));
export const replyConsultation = (id, doctorReply, doctorId = 1) => data(api.put(`/api/consultations/${id}/reply`, { doctorReply, doctorId }));
export const deleteConsultation = (id, studentId = 1) => data(api.delete(`/api/consultations/${id}`, { params: { studentId } }));
export const archiveConsultation = (id, studentId = 1) => data(api.put(`/api/consultations/${id}/archive`, { studentId }));

export const createAppointment = (payload) => data(api.post('/api/appointments', payload));
export const listMyAppointments = (studentId = 1) => data(api.get('/api/appointments/my', { params: { studentId } }));
export const listDoctorAppointments = (doctorId = 1) => data(api.get('/api/appointments/doctor', { params: { doctorId } }));
export const listAllAppointments = () => data(api.get('/api/appointments'));
export const updateAppointmentStatus = (id, status) => data(api.put(`/api/appointments/${id}/status`, { status }));

export const listArticles = () => data(api.get('/api/articles'));
export const listDoctors = () => data(api.get('/api/doctors'));
export const listMedicines = () => data(api.get('/api/medicines'));
export const listAnnouncements = () => data(api.get('/api/announcements'));

export const adminOverview = () => data(api.get('/api/admin/overview'));
export const listAdminUsers = () => data(api.get('/api/admin/users'));
export const listAdminDoctors = () => data(api.get('/api/admin/doctors'));
export const listAdminArticles = () => data(api.get('/api/admin/articles'));
export const listAdminAppointments = () => data(api.get('/api/admin/appointments'));
export const listAdminConsultations = () => data(api.get('/api/admin/consultations'));
export const listAdminMedicines = () => data(api.get('/api/admin/medicines'));
export const listAdminAnnouncements = () => data(api.get('/api/admin/announcements'));
export const updateAdminUserStatus = (id, status) => data(api.put(`/api/admin/users/${id}/status`, { status }));
export const updateAdminArticleStatus = (id, status) => data(api.put(`/api/admin/articles/${id}/status`, { status }));