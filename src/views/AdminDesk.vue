<template>
  <h1>管理员后台</h1>
  <div class="grid">
    <div class="card">
      <h3>用户管理</h3>
      <p class="muted">当前用户数：{{ users.length }}</p>
      <div class="list-item" v-for="u in users" :key="u.id">
        <strong>{{ u.realName || u.username }}</strong>
        <p class="muted">{{ u.username }} / {{ u.role }} / {{ u.status }}</p>
      </div>
    </div>
    <div class="card">
      <h3>医生管理</h3>
      <p class="muted">维护科室、职称、专长与排班。</p>
      <div class="list-item" v-for="d in doctors" :key="d.id">
        <strong>{{ d.realName || '医生' }} - {{ d.department }}</strong>
        <p class="muted">{{ d.title }}；{{ d.specialty }}；{{ d.scheduleText }}</p>
      </div>
    </div>
    <div class="card">
      <h3>科普管理</h3>
      <p class="muted">当前文章数：{{ articles.length }}</p>
      <div class="list-item" v-for="a in articles" :key="a.id">
        <strong>{{ a.title }}</strong>
        <p class="muted">{{ a.category }} / {{ a.status }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { listAdminArticles, listAdminDoctors, listAdminUsers } from '../api';

const users = ref([]);
const doctors = ref([]);
const articles = ref([]);

onMounted(async () => {
  try {
    users.value = (await listAdminUsers()).data || [];
    doctors.value = (await listAdminDoctors()).data || [];
    articles.value = (await listAdminArticles()).data || [];
  } catch (e) {
    users.value = [{ id: 1, username: 'student', role: 'STUDENT', status: 'ENABLED' }];
    doctors.value = [{ id: 1, realName: '李医生', department: '全科门诊', title: '主治医师', specialty: '常见轻症', scheduleText: '周一至周五' }];
    articles.value = [{ id: 1, title: '普通感冒护理', category: '呼吸道', status: 'PUBLISHED' }];
  }
});
</script>
