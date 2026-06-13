<template>
  <section class="login-page">
    <div class="login-hero">
      <span class="eyebrow">校医院线上服务</span>
      <h1>校园健康问诊与咨询系统</h1>
      <p>学生、医生、管理员统一登录，按身份进入对应工作台。</p>
      <div class="login-status">
        <div><strong>学生端</strong><span>AI 问诊、预约、记录、科普</span></div>
        <div><strong>医生端</strong><span>预约处理、问诊复核、补充建议</span></div>
        <div><strong>管理端</strong><span>账号、医生、科普、药品、公告维护</span></div>
      </div>
    </div>
    <form class="login-panel" @submit.prevent="go">
      <h2>登录工作台</h2>
      <p class="muted">请选择身份并输入本人账号密码。</p>
      <div class="role-picker">
        <button v-for="item in roles" :key="item.value" type="button" :class="['role-card', { active: role === item.value }]" @click="role = item.value">
          <strong>{{ item.label }}</strong><span>{{ item.desc }}</span>
        </button>
      </div>
      <label>账号</label>
      <input v-model.trim="username" autocomplete="username" :placeholder="placeholder">
      <label>密码</label>
      <input v-model="password" type="password" autocomplete="current-password" placeholder="请输入密码">
      <button class="btn block" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
      <p class="error" v-if="message">{{ message }}</p>
      <RouterLink class="muted link" to="/register">学生还没有账号？去注册</RouterLink>
    </form>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api';
import { clearCurrentUser, homePath, setCurrentUser } from '../utils';

const roles = [
  { value: 'STUDENT', label: '学生端', desc: '问诊、预约、查看科普', placeholder: '请输入学号或学生账号' },
  { value: 'DOCTOR', label: '医生端', desc: '处理预约和补充建议', placeholder: '请输入医生账号' },
  { value: 'ADMIN', label: '管理端', desc: '维护用户和内容', placeholder: '请输入管理员账号' }
];
const username = ref('');
const password = ref('');
const role = ref('STUDENT');
const message = ref('');
const loading = ref(false);
const router = useRouter();
const placeholder = computed(() => roles.find((item) => item.value === role.value)?.placeholder || '请输入账号');

async function go() {
  message.value = '';
  if (!username.value || !password.value) {
    message.value = '请输入账号和密码';
    return;
  }
  loading.value = true;
  clearCurrentUser();
  try {
    const res = await login({ username: username.value, password: password.value, role: role.value });
    if (res.code !== 0) {
      message.value = res.message || '登录失败';
      return;
    }
    setCurrentUser(res.data);
    router.push(homePath(res.data.role));
  } catch (e) {
    message.value = '无法连接后端服务，请稍后重试';
  } finally {
    loading.value = false;
  }
}
</script>