<template>
  <div class="app" :class="{ 'is-login': isPublic }">
    <aside v-if="!isPublic" class="sidebar">
      <div class="brand">
        <div class="brand-mark">鏍?/div>
        <div>
          <h2>鏍″洯鍋ュ悍</h2>
          <p>{{ roleName }}宸ヤ綔鍙?/p>
        </div>
      </div>
      <nav>
        <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path">{{ link.label }}</RouterLink>
      </nav>
      <button class="logout" @click="logout">閫€鍑虹櫥褰?/button>
    </aside>
    <main><RouterView /></main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isPublic = computed(() => route.meta.public);
const user = computed(() => JSON.parse(localStorage.getItem('user') || '{}'));
const role = computed(() => user.value.role || localStorage.getItem('role') || 'STUDENT');
const roleName = computed(() => ({ STUDENT: '瀛︾敓', DOCTOR: '鍖荤敓', ADMIN: '绠＄悊鍛? }[role.value] || '瀛︾敓'));
const menus = {
  STUDENT: [
    { path: '/student', label: '瀛︾敓棣栭〉' },
    { path: '/consult', label: 'AI 闂瘖' },
    { path: '/consultations', label: '鎴戠殑闂瘖璁板綍' },
    { path: '/doctors', label: '鏍″尰淇℃伅' },
    { path: '/appointment', label: '鏍″尰闄㈤绾? },
    { path: '/my-appointments', label: '鎴戠殑棰勭害' },
    { path: '/articles', label: '鍋ュ悍绉戞櫘' },
    { path: '/medicines', label: '鑽搧淇℃伅' },
    { path: '/profile', label: '涓汉涓績' }
  ],
  DOCTOR: [
    { path: '/doctor', label: '鍖荤敓棣栭〉' },
    { path: '/doctor/appointments', label: '棰勭害澶勭悊' },
    { path: '/doctor/consultations', label: '闂瘖澶嶆牳' },
    { path: '/doctor/replies', label: '鍥炲璁板綍' },
    { path: '/articles', label: '鍋ュ悍绉戞櫘' },
    { path: '/profile', label: '涓汉涓績' }
  ],
  ADMIN: [
    { path: '/admin', label: '绠＄悊棣栭〉' },
    { path: '/admin/users', label: '鐢ㄦ埛绠＄悊' },
    { path: '/admin/doctors', label: '鍖荤敓绠＄悊' },
    { path: '/admin/consultations', label: '闂瘖绠＄悊' },
    { path: '/admin/appointments', label: '棰勭害绠＄悊' },
    { path: '/admin/articles', label: '绉戞櫘绠＄悊' },
    { path: '/admin/medicines', label: '鑽搧绠＄悊' },
    { path: '/admin/announcements', label: '鍏憡绠＄悊' },
    { path: '/admin/stats', label: '鏁版嵁缁熻' }
  ]
};
const navLinks = computed(() => menus[role.value] || menus.STUDENT);

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  router.push('/');
}
</script>