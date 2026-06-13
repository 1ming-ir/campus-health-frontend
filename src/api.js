import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://campus-health-backend-production.up.railway.app'
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

const data = (promise) => promise.then((res) => res.data);

export const login = (payload) => data(api.post('/api/auth/login', payload));
export const registerStudent = (payload) => data(api.post('/api/auth/register', payload));
export const updateProfile = (payload) => data(api.put('/api/auth/profile', payload));
export const getMe = (username) => data(api.get('/api/auth/me', { params: { username } }));

export const createConsultation = (payload) => data(api.post('/api/consultations', payload));
export const listMyConsultations = (studentId) => data(api.get('/api/consultations/my', { params: { studentId } }));
export const listConsultations = () => data(api.get('/api/consultations'));
export const replyConsultation = (id, doctorReply, doctorId) => data(api.put(`/api/consultations/${id}/reply`, { doctorReply, doctorId }));
export const deleteConsultation = (id, studentId) => data(api.delete(`/api/consultations/${id}`, { params: { studentId } }));
export const archiveConsultation = (id, studentId) => data(api.put(`/api/consultations/${id}/archive`, { studentId }));

export const createAppointment = (payload) => data(api.post('/api/appointments', payload));
export const listMyAppointments = (studentId) => data(api.get('/api/appointments/my', { params: { studentId } }));
export const listDoctorAppointments = (doctorId) => data(api.get('/api/appointments/doctor', { params: { doctorId } }));
export const listAllAppointments = () => data(api.get('/api/appointments'));
export const updateAppointmentStatus = (id, status) => data(api.put(`/api/appointments/${id}/status`, { status }));
export const cancelAppointment = (id, studentId) => data(api.put(`/api/appointments/${id}/cancel`, { studentId }));

export const listArticles = () => data(api.get('/api/articles'));
export const listDoctors = () => data(api.get('/api/doctors'));
export const listMedicines = () => data(api.get('/api/medicines'));
export const listAnnouncements = () => data(api.get('/api/announcements'));

export const adminOverview = () => data(api.get('/api/admin/overview'));
export const listAdminUsers = () => data(api.get('/api/admin/users'));
export const createAdminUser = (payload) => data(api.post('/api/admin/users', payload));
export const updateAdminUser = (id, payload) => data(api.put(`/api/admin/users/${id}`, payload));
export const updateAdminUserStatus = (id, status) => data(api.put(`/api/admin/users/${id}/status`, { status }));

export const listAdminDoctors = () => data(api.get('/api/admin/doctors'));
export const createAdminDoctor = (payload) => data(api.post('/api/admin/doctors', payload));
export const updateAdminDoctor = (id, payload) => data(api.put(`/api/admin/doctors/${id}`, payload));

export const listAdminArticles = () => data(api.get('/api/admin/articles'));
export const createAdminArticle = (payload) => data(api.post('/api/admin/articles', payload));
export const updateAdminArticle = (id, payload) => data(api.put(`/api/admin/articles/${id}`, payload));
export const updateAdminArticleStatus = (id, status) => data(api.put(`/api/admin/articles/${id}/status`, { status }));

export const listAdminAppointments = () => data(api.get('/api/admin/appointments'));
export const updateAdminAppointmentStatus = (id, status) => data(api.put(`/api/admin/appointments/${id}/status`, { status }));
export const listAdminConsultations = () => data(api.get('/api/admin/consultations'));

export const listAdminMedicines = () => data(api.get('/api/admin/medicines'));
export const createAdminMedicine = (payload) => data(api.post('/api/admin/medicines', payload));
export const updateAdminMedicine = (id, payload) => data(api.put(`/api/admin/medicines/${id}`, payload));
export const updateAdminMedicineStatus = (id, status) => data(api.put(`/api/admin/medicines/${id}/status`, { status }));

export const listAdminAnnouncements = () => data(api.get('/api/admin/announcements'));
export const createAdminAnnouncement = (payload) => data(api.post('/api/admin/announcements', payload));
export const updateAdminAnnouncement = (id, payload) => data(api.put(`/api/admin/announcements/${id}`, payload));
export const updateAdminAnnouncementStatus = (id, status) => data(api.put(`/api/admin/announcements/${id}/status`, { status }));