<template>
  <div class="page-head">
    <h1>管理员后台</h1>
    <p>集中维护用户权限、医生资源和科普内容，让学生端和医生端可持续运行。</p>
  </div>

  <div class="stats">
    <div class="stat"><strong>{{ users.length }}</strong><span>系统用户</span></div>
    <div class="stat"><strong>{{ enabledUsers }}</strong><span>启用账号</span></div>
    <div class="stat"><strong>{{ doctors.length }}</strong><span>医生档案</span></div>
    <div class="stat"><strong>{{ publishedCount }}</strong><span>已发布科普</span></div>
  </div>

  <div class="grid two">
    <div class="card">
      <div class="toolbar"><h3>用户管理</h3><span class="tag">可启用 / 禁用</span></div>
      <table class="table">
        <thead><tr><th>姓名</th><th>账号</th><th>角色</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.realName || '-' }}</td>
            <td>{{ u.username }}</td>
            <td>{{ roleLabel(u.role) }}</td>
            <td><span class="status">{{ u.status }}</span></td>
            <td><button class="btn ghost" @click="toggleUser(u)">{{ u.status === 'ENABLED' ? '禁用' : '启用' }}</button></td>
          </tr>
        </tbody>
      </table>
      <p class="empty" v-if="users.length === 0">暂无用户数据。</p>
    </div>

    <div class="card">
      <div class="toolbar"><h3>运营概览</h3><span class="tag warn">管理职责</span></div>
      <div class="reason-card">
        <p><strong>管理员不参与诊断</strong></p>
        <p class="muted">后台负责账号、医生资源和科普内容治理，避免学生端、医生端长期依赖硬编码数据。</p>
      </div>
      <div class="reason-card">
        <p><strong>上线治理能力</strong></p>
        <p class="muted">账号可禁用，科普可下架，后续可扩展文章审核、预约量统计、异常问诊预警和操作日志。</p>
      </div>
      <p class="muted" v-if="message">{{ message }}</p>
    </div>
  </div>

  <div class="grid two">
    <div class="card">
      <div class="toolbar"><h3>医生资源</h3><span class="muted">{{ doctors.length }} 位</span></div>
      <table class="table">
        <thead><tr><th>医生</th><th>科室</th><th>职称</th><th>专长 / 排班</th></tr></thead>
        <tbody>
          <tr v-for="d in doctors" :key="d.id">
            <td>{{ d.realName || '医生' }}</td>
            <td>{{ d.department }}</td>
            <td>{{ d.title }}</td>
            <td>{{ d.specialty }}<br><span class="muted">{{ d.scheduleText }}</span></td>
          </tr>
        </tbody>
      </table>
      <p class="empty" v-if="doctors.length === 0">暂无医生数据。</p>
    </div>

    <div class="card">
      <div class="toolbar"><h3>科普内容</h3><span class="muted">{{ articles.length }} 篇</span></div>
      <table class="table">
        <thead><tr><th>标题</th><th>分类</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="a in articles" :key="a.id">
            <td>{{ a.title }}</td>
            <td>{{ a.category }}</td>
            <td><span class="status">{{ a.status }}</span></td>
            <td><button class="btn ghost" @click="toggleArticle(a)">{{ a.status === 'PUBLISHED' ? '下架' : '发布' }}</button></td>
          </tr>
        </tbody>
      </table>
      <p class="empty" v-if="articles.length === 0">暂无科普文章。</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { listAdminArticles, listAdminDoctors, listAdminUsers, updateAdminArticleStatus, updateAdminUserStatus } from '../api';

const users = ref([]);
const doctors = ref([]);
const articles = ref([]);
const message = ref('');
const enabledUsers = computed(() => users.value.filter((u) => u.status === 'ENABLED').length);
const publishedCount = computed(() => articles.value.filter((a) => a.status === 'PUBLISHED').length);

function roleLabel(role) {
  return { STUDENT: '学生', DOCTOR: '医生', ADMIN: '管理员' }[role] || role;
}

async function load() {
  users.value = (await listAdminUsers()).data || [];
  doctors.value = (await listAdminDoctors()).data || [];
  articles.value = (await listAdminArticles()).data || [];
}

async function toggleUser(user) {
  const status = user.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
  const res = await updateAdminUserStatus(user.id, status);
  message.value = res.message || '用户状态已更新';
  await load();
}

async function toggleArticle(article) {
  const status = article.status === 'PUBLISHED' ? 'OFFLINE' : 'PUBLISHED';
  const res = await updateAdminArticleStatus(article.id, status);
  message.value = res.message || '科普文章状态已更新';
  await load();
}

onMounted(async () => {
  try {
    await load();
  } catch (e) {
    users.value = [];
    doctors.value = [];
    articles.value = [];
    message.value = '管理端数据加载失败，请检查后端服务。';
  }
});
</script>
