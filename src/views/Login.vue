<template>
  <section class="card login">
    <h1>校园健康问诊与咨询系统</h1>
    <p class="muted">学生、医生、管理员三类角色演示入口</p>
    <input class="input" v-model="username" placeholder="账号">
    <input class="input" v-model="password" type="password" placeholder="密码">
    <select v-model="role">
      <option value="STUDENT">学生</option>
      <option value="DOCTOR">医生</option>
      <option value="ADMIN">管理员</option>
    </select>
    <button class="btn" @click="go">登录</button>
    <p class="muted" v-if="message">{{ message }}</p>
    <p class="hint">演示账号：student / doctor / admin，密码均为 123456。</p>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api';

const username = ref('student');
const password = ref('123456');
const role = ref('STUDENT');
const message = ref('');
const router = useRouter();

async function go() {
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
    localStorage.setItem('user', JSON.stringify({ id: 1, username: username.value, role: role.value, realName: '演示用户' }));
    router.push(role.value === 'STUDENT' ? '/student' : role.value === 'DOCTOR' ? '/doctor' : '/admin');
  }
}
</script>

<style scoped>
.login { max-width: 430px; margin: 10vh auto; }
.hint { font-size: 13px; color: #64748b; }
</style>
