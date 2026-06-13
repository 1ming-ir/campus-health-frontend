<template>
  <div class="app" :class="{ 'is-login': isPublic }">
    <aside v-if="!isPublic" class="sidebar">
      <div class="brand">
        <div class="brand-mark">校</div>
        <div>
          <h2>校园健康</h2>
          <p>{{ workbenchName }}</p>
        </div>
      </div>
      <nav>
        <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path">{{ link.label }}</RouterLink>
      </nav>
      <button class="logout" @click="logout">退出登录</button>
    </aside>
    <main><RouterView /></main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { clearCurrentUser, currentUser } from './utils';

const route = useRoute();
const router = useRouter();
const user = ref(currentUser());
const isPublic = computed(() => Boolean(route.meta.public));
const role = computed(() => user.value.role || 'STUDENT');
const workbenchName = computed(() => ({
  STUDENT: '学生工作台',
  DOCTOR: '医生工作台',
  ADMIN: '管理员后台'
}[role.value] || '学生工作台'));

const menus = {
  STUDENT: [
    { path: '/student', label: '学生首页' },
    { path: '/consult', label: 'AI 问诊' },
    { path: '/consultations', label: '我的问诊记录' },
    { path: '/doctors', label: '校医信息' },
    { path: '/appointment', label: '校医院预约' },
    { path: '/my-appointments', label: '我的预约' },
    { path: '/articles', label: '健康科普' },
    { path: '/medicines', label: '药品信息' },
    { path: '/profile', label: '个人中心' }
  ],
  DOCTOR: [
    { path: '/doctor', label: '医生首页' },
    { path: '/doctor/appointments', label: '预约处理' },
    { path: '/doctor/consultations', label: '问诊复核' },
    { path: '/doctor/replies', label: '回复记录' },
    { path: '/articles', label: '健康科普' },
    { path: '/profile', label: '个人中心' }
  ],
  ADMIN: [
    { path: '/admin', label: '管理首页' },
    { path: '/admin/users', label: '用户管理' },
    { path: '/admin/doctors', label: '医生管理' },
    { path: '/admin/consultations', label: '问诊管理' },
    { path: '/admin/appointments', label: '预约管理' },
    { path: '/admin/articles', label: '科普管理' },
    { path: '/admin/medicines', label: '药品管理' },
    { path: '/admin/announcements', label: '公告管理' },
    { path: '/admin/stats', label: '数据统计' }
  ]
};
const navLinks = computed(() => menus[role.value] || menus.STUDENT);
function syncUser() { user.value = currentUser(); }
function logout() { clearCurrentUser(); router.push('/'); }
onMounted(() => window.addEventListener('campus-user-change', syncUser));
onUnmounted(() => window.removeEventListener('campus-user-change', syncUser));
</script>