<template>
  <div class="app" :class="{ 'is-login': isPublic }">
    <aside v-if="!isPublic" class="sidebar">
      <div class="brand">
        <div class="brand-mark">校</div>

        <div>
          <h2>校园健康</h2>
          <p>{{ roleName }}工作台</p>
        </div>
      </div>

      <nav>
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <button class="logout" @click="logout">
        退出登录
      </button>
    </aside>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isPublic = computed(() => route.meta.public)

const user = computed(() =>
  JSON.parse(localStorage.getItem('user') || '{}')
)

const role = computed(() =>
  user.value.role ||
  localStorage.getItem('role') ||
  'STUDENT'
)

const roleName = computed(() => ({
  STUDENT: '学生',
  DOCTOR: '医生',
  ADMIN: '管理员'
}[role.value] || '学生'))

const menus = {
  STUDENT: [
    { path: '/student', label: '学生首页' },
    { path: '/consult', label: 'AI问诊' },
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
}

const navLinks = computed(
  () => menus[role.value] || menus.STUDENT
)

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('role')
  router.push('/')
}
</script>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #1e293b;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 6px;
}

nav a.router-link-active {
  background: #3b82f6;
}

.logout {
  margin-top: auto;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

main {
  flex: 1;
  padding: 20px;
}

.is-login {
  display: block;
}
</style>
