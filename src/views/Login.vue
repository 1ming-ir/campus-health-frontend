<template>
  <section class="login-page">
    <div class="login-hero">
      <span class="eyebrow">校医院线上服务</span>
      <h1>校园健康问诊与咨询系统</h1>
      <p>把症状整理、风险提示、校医院预约和医生补充建议放到同一个闭环里，适合学生先咨询、再决定是否线下就医。</p>
      <div class="hero-points">
        <span>AI 初步建议</span>
        <span>校医院预约</span>
        <span>医生复核</span>
      </div>
    </div>

    <div class="login-panel">
      <h2>登录工作台</h2>
      <p class="muted">请选择身份后进入对应端口，系统会隐藏无关功能。</p>
      <div class="role-picker">
        <button v-for="item in roles" :key="item.value" :class="['role-card', { active: role === item.value }]" @click="selectRole(item)">
          <strong>{{ item.label }}</strong>
          <span>{{ item.desc }}</span>
        </button>
      </div>
      <label>账号</label>
      <input class="input" v-model="username" placeholder="请输入账号">
      <label>密码</label>
      <input class="input" v-model="password" type="password" placeholder="请输入密码">
      <button class="btn block" :disabled="loading" @click="go">{{ loading ? '登录中...' : '登录' }}</button>
      <p class="error" v-if="message">{{ message }}</p>
      <p class="hint">演示账号：student / doctor / admin，密码均为 123456。</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api';

const roles = [
  { value: 'STUDENT', label: '学生端', desc: '问诊、预约、科普', account: 'student' },
  { value: 'DOCTOR', label: '医生端', desc: '处理预约和补充建议', account: 'doctor' },
  { value: 'ADMIN', label: '管理端', desc: '用户、医生、科普管理', account: 'admin' }
];
const username = ref('student');
const password = ref('123456');
const role = ref('STUDENT');
const message = ref('');
const loading = ref(false);
const router = useRouter();

function selectRole(item) {
  role.value = item.value;
  username.value = item.account;
  message.value = '';
}

async function go() {
  message.value = '';
  loading.value = true;
  try {
    const res = await login({ username: username.value, password: password.value, role: role.value });
    if (res.code !== 0) {
      message.value = res.message || '登录失败';
      return;
    }
    localStorage.setItem('user', JSON.stringify(res.data));
    localStorage.setItem('role', res.data.role);
    router.push(res.data.role === 'STUDENT' ? '/student' : res.data.role === 'DOCTOR' ? '/doctor' : '/admin');
  } catch (e) {
    message.value = '后端服务暂时不可用，请检查 Railway 服务和 Vercel 环境变量。';
  } finally {
    loading.value = false;
  }
}
</script>
