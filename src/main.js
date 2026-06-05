import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './styles.css';
import Login from './views/Login.vue';
import StudentHome from './views/StudentHome.vue';
import Consultation from './views/Consultation.vue';
import Appointment from './views/Appointment.vue';
import Articles from './views/Articles.vue';
import DoctorDesk from './views/DoctorDesk.vue';
import AdminDesk from './views/AdminDesk.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Login, meta: { public: true } },
    { path: '/student', component: StudentHome, meta: { roles: ['STUDENT'] } },
    { path: '/consult', component: Consultation, meta: { roles: ['STUDENT'] } },
    { path: '/appointment', component: Appointment, meta: { roles: ['STUDENT'] } },
    { path: '/articles', component: Articles, meta: { roles: ['STUDENT', 'DOCTOR', 'ADMIN'] } },
    { path: '/doctor', component: DoctorDesk, meta: { roles: ['DOCTOR'] } },
    { path: '/admin', component: AdminDesk, meta: { roles: ['ADMIN'] } }
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
