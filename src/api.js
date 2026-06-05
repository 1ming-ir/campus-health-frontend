import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export async function login(payload) {
  return (await api.post('/api/auth/login', payload)).data;
}

export async function createConsultation(payload) {
  return (await api.post('/api/consultations', payload)).data;
}

export async function listMyConsultations(studentId = 1) {
  return (await api.get('/api/consultations/my', { params: { studentId } })).data;
}

export async function listConsultations() {
  return (await api.get('/api/consultations')).data;
}

export async function replyConsultation(id, doctorReply) {
  return (await api.put(`/api/consultations/${id}/reply`, { doctorReply })).data;
}

export async function createAppointment(payload) {
  return (await api.post('/api/appointments', payload)).data;
}

export async function listMyAppointments(studentId = 1) {
  return (await api.get('/api/appointments/my', { params: { studentId } })).data;
}

export async function listDoctorAppointments(doctorId = 1) {
  return (await api.get('/api/appointments/doctor', { params: { doctorId } })).data;
}

export async function updateAppointmentStatus(id, status) {
  return (await api.put(`/api/appointments/${id}/status`, { status })).data;
}

export async function listArticles() {
  return (await api.get('/api/articles')).data;
}

export async function listAdminUsers() {
  return (await api.get('/api/admin/users')).data;
}

export async function listAdminDoctors() {
  return (await api.get('/api/admin/doctors')).data;
}

export async function listAdminArticles() {
  return (await api.get('/api/admin/articles')).data;
}

export async function updateAdminUserStatus(id, status) {
  return (await api.put(`/api/admin/users/${id}/status`, { status })).data;
}

export async function updateAdminArticleStatus(id, status) {
  return (await api.put(`/api/admin/articles/${id}/status`, { status })).data;
}
