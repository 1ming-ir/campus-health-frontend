<template>
  <div class="app" :class="{ 'is-login': isLogin }">
    <aside v-if="!isLogin" class="sidebar">
      <div class="brand">
        <div class="brand-mark">校</div>
        <div>
          <h2>校园健康</h2>
          <p>{{ roleName }}工作台</p>
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
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isLogin = computed(() => route.path === '/');
const user = computed(() => JSON.parse(localStorage.getItem('user') || '{}'));
const role = computed(() => user.value.role || localStorage.getItem('role') || 'STUDENT');
const roleName = computed(() => ({ STUDENT: '学生', DOCTOR: '医生', ADMIN: '管理员' }[role.value] || '学生'));
const navLinks = computed(() => {
  if (role.value === 'DOCTOR') {
    return [{ path: '/doctor', label: '医生工作台' }, { path: '/articles', label: '健康科普' }];
  }
  if (role.value === 'ADMIN') {
    return [{ path: '/admin', label: '管理后台' }, { path: '/articles', label: '科普预览' }];
  }
  return [
    { path: '/student', label: '学生首页' },
    { path: '/consult', label: 'AI 问诊' },
    { path: '/appointment', label: '校医院预约' },
    { path: '/articles', label: '健康科普' }
  ];
});

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  router.push('/');
}
</script>
