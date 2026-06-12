import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './styles.css';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import StudentHome from './views/StudentHome.vue';
import Consultation from './views/Consultation.vue';
import ConsultationRecords from './views/ConsultationRecords.vue';
import Appointment from './views/Appointment.vue';
import MyAppointments from './views/MyAppointments.vue';
import Articles from './views/Articles.vue';
import Doctors from './views/Doctors.vue';
import Medicines from './views/Medicines.vue';
import Profile from './views/Profile.vue';
import DoctorDesk from './views/DoctorDesk.vue';
import AdminDesk from './views/AdminDesk.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Login, meta: { public: true } },
    { path: '/register', component: Register, meta: { public: true } },
    { path: '/student', component: StudentHome, meta: { roles: ['STUDENT'] } },
    { path: '/consult', component: Consultation, meta: { roles: ['STUDENT'] } },
    { path: '/consultations', component: ConsultationRecords, meta: { roles: ['STUDENT'] } },
    { path: '/doctors', component: Doctors, meta: { roles: ['STUDENT'] } },
    { path: '/appointment', component: Appointment, meta: { roles: ['STUDENT'] } },
    { path: '/my-appointments', component: MyAppointments, meta: { roles: ['STUDENT'] } },
    { path: '/articles', component: Articles, meta: { roles: ['STUDENT', 'DOCTOR'] } },
    { path: '/medicines', component: Medicines, meta: { roles: ['STUDENT'] } },
    { path: '/profile', component: Profile, meta: { roles: ['STUDENT', 'DOCTOR'] } },
    { path: '/doctor', component: DoctorDesk, meta: { roles: ['DOCTOR'], view: 'home' } },
    { path: '/doctor/appointments', component: DoctorDesk, meta: { roles: ['DOCTOR'], view: 'appointments' } },
    { path: '/doctor/consultations', component: DoctorDesk, meta: { roles: ['DOCTOR'], view: 'consultations' } },
    { path: '/doctor/replies', component: DoctorDesk, meta: { roles: ['DOCTOR'], view: 'replies' } },
    { path: '/admin', component: AdminDesk, meta: { roles: ['ADMIN'], view: 'home' } },
    { path: '/admin/users', component: AdminDesk, meta: { roles: ['ADMIN'], view: 'users' } },
    { path: '/admin/doctors', component: AdminDesk, meta: { roles: ['ADMIN'], view: 'doctors' } },
    { path: '/admin/consultations', component: AdminDesk, meta: { roles: ['ADMIN'], view: 'consultations' } },
    { path: '/admin/appointments', component: AdminDesk, meta: { roles: ['ADMIN'], view: 'appointments' } },
    { path: '/admin/articles', component: AdminDesk, meta: { roles: ['ADMIN'], view: 'articles' } },
    { path: '/admin/medicines', component: AdminDesk, meta: { roles: ['ADMIN'], view: 'medicines' } },
    { path: '/admin/announcements', component: AdminDesk, meta: { roles: ['ADMIN'], view: 'announcements' } },
    { path: '/admin/stats', component: AdminDesk, meta: { roles: ['ADMIN'], view: 'stats' } }
  ]
});

router.beforeEach((to) => {
  if (to.meta.public) return true;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.role) return '/';
  if (to.meta.roles && !to.meta.roles.includes(user.role)) {
    return user.role === 'DOCTOR' ? '/doctor' : user.role === 'ADMIN' ? '/admin' : '/student';
  }
  return true;
});

createApp(App).use(router).mount('#app');