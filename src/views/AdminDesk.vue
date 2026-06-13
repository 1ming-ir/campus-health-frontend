<template>
  <div class="page-head"><h1>{{ title }}</h1><p>维护用户、医生、问诊、预约、科普、药品、公告和统计数据。</p></div>
  <div class="stats">
    <div class="stat"><strong>{{ overview.users || users.length }}</strong><span>系统用户</span></div>
    <div class="stat"><strong>{{ overview.doctors || doctors.length }}</strong><span>医生档案</span></div>
    <div class="stat"><strong>{{ overview.consultations || consultations.length }}</strong><span>问诊记录</span></div>
    <div class="stat"><strong>{{ overview.appointments || appointments.length }}</strong><span>预约记录</span></div>
  </div>
  <div v-if="view === 'home'" class="grid four">
    <button class="card action-card text-left" @click="openUser()"><h3>新增用户</h3><p class="muted">创建学生、医生或管理员账号。</p></button>
    <button class="card action-card text-left" @click="openDoctor()"><h3>新增医生档案</h3><p class="muted">维护医生展示资料和排班。</p></button>
    <button class="card action-card text-left" @click="openArticle()"><h3>发布科普</h3><p class="muted">新增健康科普内容。</p></button>
    <button class="card action-card text-left" @click="openAnnouncement()"><h3>发布公告</h3><p class="muted">发布门诊通知或健康提醒。</p></button>
  </div>
  <div v-if="view === 'home' || view === 'stats'" class="card"><h3>数据统计</h3><div class="chart-row"><div v-for="item in statItems" :key="item.label" class="bar"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></div></div></div>

  <div v-if="view === 'users'" class="card">
    <div class="toolbar"><h3>用户管理</h3><button class="btn" @click="openUser()">新增用户</button></div>
    <div class="filters"><select v-model="filters.role"><option value="">全部角色</option><option value="STUDENT">学生</option><option value="DOCTOR">医生</option><option value="ADMIN">管理员</option></select><select v-model="filters.status"><option value="">全部状态</option><option value="ENABLED">启用</option><option value="DISABLED">禁用</option></select></div>
    <table class="table"><thead><tr><th>姓名</th><th>账号</th><th>角色</th><th>学院</th><th>班级</th><th>电话</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="u in filteredUsers" :key="u.id"><td>{{ u.realName }}</td><td>{{ u.username }}</td><td>{{ roleLabel(u.role) }}</td><td>{{ u.college || '-' }}</td><td>{{ u.className || '-' }}</td><td>{{ u.phone || '-' }}</td><td>{{ statusLabel(u.status) }}</td><td><button class="btn ghost" @click="detail = u">详情</button><button class="btn ghost" @click="openUser(u)">编辑</button><button class="btn secondary" @click="toggleUser(u)">{{ u.status === 'ENABLED' ? '禁用' : '启用' }}</button></td></tr></tbody></table>
  </div>

  <div v-if="view === 'doctors'" class="card">
    <div class="toolbar"><h3>医生管理</h3><button class="btn" @click="openDoctor()">新增医生档案</button></div>
    <table class="table"><thead><tr><th>医生</th><th>科室</th><th>职称</th><th>专长</th><th>排班</th><th>电话</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="d in doctors" :key="d.id"><td>{{ d.realName }}</td><td>{{ d.department }}</td><td>{{ d.title }}</td><td>{{ d.specialty }}</td><td>{{ d.scheduleText }}</td><td>{{ d.phone || '-' }}</td><td>{{ statusLabel(d.status) }}</td><td><button class="btn ghost" @click="detail = d">详情</button><button class="btn ghost" @click="openDoctor(d)">编辑</button></td></tr></tbody></table>
  </div>

  <div v-if="view === 'consultations'" class="card">
    <div class="toolbar"><h3>问诊管理</h3><select v-model="filters.consultation"><option value="">全部</option><option value="WAITING">待回复</option><option value="REPLIED">已回复</option></select></div>
    <article class="list-item" v-for="c in filteredConsultations" :key="c.id"><div class="toolbar"><strong>{{ c.studentName }} - {{ c.symptom }}</strong><span class="tag">{{ c.doctorReply ? '已回复' : '待回复' }}</span></div><p class="muted">{{ c.severity }} · {{ c.duration }} · {{ c.createdAt || '' }}</p><button class="btn ghost" @click="detail = c">查看详情</button></article>
  </div>

  <div v-if="view === 'appointments'" class="card">
    <div class="toolbar"><h3>预约管理</h3><select v-model="filters.appointment"><option value="">全部</option><option v-for="s in appointmentStatuses" :key="s" :value="s">{{ statusLabel(s) }}</option></select></div>
    <article class="list-item" v-for="a in filteredAppointments" :key="a.id"><div class="toolbar"><strong>{{ a.studentName }} 预约 {{ a.doctorName }}</strong><span class="tag">{{ statusLabel(a.status) }}</span></div><p class="muted">{{ a.appointmentDate }} {{ a.timeSlot }}；原因：{{ a.reason }}</p><select :value="a.status" @change="adminSetAppointment(a.id, $event.target.value)"><option v-for="s in appointmentStatuses" :key="s" :value="s">{{ statusLabel(s) }}</option></select><button class="btn ghost" @click="detail = a">详情</button></article>
  </div>

  <div v-if="view === 'articles'" class="card"><div class="toolbar"><h3>科普管理</h3><button class="btn" @click="openArticle()">新增科普</button></div><article class="list-item" v-for="a in articles" :key="a.id"><div class="toolbar"><strong>{{ a.title }}</strong><span class="tag">{{ statusLabel(a.status) }}</span></div><p class="muted">{{ a.category }} · {{ a.summary }}</p><button class="btn ghost" @click="detail = a">详情</button><button class="btn ghost" @click="openArticle(a)">编辑</button><button class="btn secondary" @click="toggleArticle(a)">{{ a.status === 'PUBLISHED' ? '下架' : '发布' }}</button></article></div>
  <div v-if="view === 'medicines'" class="card"><div class="toolbar"><h3>药品管理</h3><button class="btn" @click="openMedicine()">新增药品</button></div><article class="list-item" v-for="m in medicines" :key="m.id"><div class="toolbar"><strong>{{ m.name }}</strong><span class="tag">{{ statusLabel(m.status) }}</span></div><p class="muted">{{ m.category }} · {{ m.prescriptionRequired }}</p><button class="btn ghost" @click="detail = m">详情</button><button class="btn ghost" @click="openMedicine(m)">编辑</button><button class="btn secondary" @click="toggleMedicine(m)">{{ m.status === 'PUBLISHED' ? '下架' : '发布' }}</button></article></div>
  <div v-if="view === 'announcements'" class="card"><div class="toolbar"><h3>公告管理</h3><button class="btn" @click="openAnnouncement()">新增公告</button></div><article class="list-item" v-for="a in announcements" :key="a.id"><div class="toolbar"><strong>{{ a.title }}</strong><span class="tag">{{ statusLabel(a.status) }}</span></div><p class="muted">{{ a.type }} · {{ a.content }}</p><button class="btn ghost" @click="detail = a">详情</button><button class="btn ghost" @click="openAnnouncement(a)">编辑</button><button class="btn secondary" @click="toggleAnnouncement(a)">{{ a.status === 'PUBLISHED' ? '下架' : '发布' }}</button></article></div>

  <div v-if="modal.type" class="modal-mask" @click.self="closeModal"><form class="modal wide" @submit.prevent="saveModal"><div class="toolbar"><h3>{{ modal.title }}</h3><button type="button" class="btn ghost" @click="closeModal">关闭</button></div>
    <template v-if="modal.type === 'user'"><div class="form-row"><div><label>账号</label><input v-model.trim="modal.data.username" :disabled="Boolean(modal.data.id)"></div><div><label>初始密码</label><input v-model="modal.data.password" type="password" :placeholder="modal.data.id ? '留空不修改' : '必填'"></div></div><div class="form-row"><div><label>姓名</label><input v-model.trim="modal.data.realName"></div><div><label>角色</label><select v-model="modal.data.role"><option value="STUDENT">学生</option><option value="DOCTOR">医生</option><option value="ADMIN">管理员</option></select></div></div><div class="form-row"><div><label>学院</label><input v-model.trim="modal.data.college"></div><div><label>班级</label><input v-model.trim="modal.data.className"></div></div><div class="form-row"><div><label>电话</label><input v-model.trim="modal.data.phone"></div><div><label>状态</label><select v-model="modal.data.status"><option value="ENABLED">启用</option><option value="DISABLED">禁用</option></select></div></div></template>
    <template v-if="modal.type === 'doctor'"><label>选择医生账号</label><select v-model="modal.data.userId" :disabled="Boolean(modal.data.id)"><option value="">请选择</option><option v-for="u in doctorUsers" :key="u.id" :value="u.id">{{ u.realName }} / {{ u.username }}</option></select><div class="form-row"><div><label>科室</label><input v-model.trim="modal.data.department"></div><div><label>职称</label><input v-model.trim="modal.data.title"></div></div><label>擅长方向</label><input v-model.trim="modal.data.specialty"><label>坐诊时间</label><input v-model.trim="modal.data.scheduleText"><div class="form-row"><div><label>电话</label><input v-model.trim="modal.data.phone"></div><div><label>状态</label><select v-model="modal.data.status"><option value="ENABLED">启用</option><option value="DISABLED">停用</option></select></div></div><label>简介</label><textarea v-model.trim="modal.data.introduction" rows="4"></textarea></template>
    <template v-if="modal.type === 'article'"><label>标题</label><input v-model.trim="modal.data.title"><label>分类</label><input v-model.trim="modal.data.category"><label>摘要</label><input v-model.trim="modal.data.summary"><label>正文</label><textarea v-model.trim="modal.data.content" rows="8"></textarea><label>状态</label><select v-model="modal.data.status"><option value="PUBLISHED">已发布</option><option value="OFFLINE">已下架</option><option value="DRAFT">草稿</option></select></template>
    <template v-if="modal.type === 'medicine'"><label>药品名称</label><input v-model.trim="modal.data.name"><label>分类</label><input v-model.trim="modal.data.category"><label>用法说明</label><textarea v-model.trim="modal.data.usageInfo" rows="4"></textarea><label>注意事项</label><textarea v-model.trim="modal.data.caution" rows="4"></textarea><div class="form-row"><div><label>是否处方药</label><select v-model="modal.data.prescriptionRequired"><option>处方药</option><option>非处方药</option></select></div><div><label>状态</label><select v-model="modal.data.status"><option value="PUBLISHED">已发布</option><option value="OFFLINE">已下架</option><option value="DRAFT">草稿</option></select></div></div></template>
    <template v-if="modal.type === 'announcement'"><label>标题</label><input v-model.trim="modal.data.title"><label>类型</label><select v-model="modal.data.type"><option>门诊通知</option><option>健康提醒</option><option>系统公告</option></select><label>内容</label><textarea v-model.trim="modal.data.content" rows="8"></textarea><label>状态</label><select v-model="modal.data.status"><option value="PUBLISHED">已发布</option><option value="OFFLINE">已下架</option><option value="DRAFT">草稿</option></select></template>
    <p class="error" v-if="modal.error">{{ modal.error }}</p><button class="btn">保存</button>
  </form></div>
  <div v-if="detail" class="modal-mask" @click.self="detail = null"><div class="modal wide"><div class="toolbar"><h3>详情</h3><button class="btn ghost" @click="detail = null">关闭</button></div><pre class="detail-pre">{{ JSON.stringify(detail, null, 2) }}</pre></div></div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { adminOverview, createAdminAnnouncement, createAdminArticle, createAdminDoctor, createAdminMedicine, createAdminUser, listAdminAnnouncements, listAdminAppointments, listAdminArticles, listAdminConsultations, listAdminDoctors, listAdminMedicines, listAdminUsers, updateAdminAnnouncement, updateAdminAnnouncementStatus, updateAdminAppointmentStatus, updateAdminArticle, updateAdminArticleStatus, updateAdminDoctor, updateAdminMedicine, updateAdminMedicineStatus, updateAdminUser, updateAdminUserStatus } from '../api';
import { roleLabel, statusLabel } from '../utils';
const route = useRoute();
const view = computed(() => route.meta.view || 'home');
const titles = { home: '管理首页', users: '用户管理', doctors: '医生管理', consultations: '问诊管理', appointments: '预约管理', articles: '科普管理', medicines: '药品管理', announcements: '公告管理', stats: '数据统计' };
const title = computed(() => titles[view.value] || '管理员后台');
const overview = ref({});
const users = ref([]); const doctors = ref([]); const articles = ref([]); const appointments = ref([]); const consultations = ref([]); const medicines = ref([]); const announcements = ref([]);
const filters = reactive({ role: '', status: '', consultation: '', appointment: '' });
const detail = ref(null);
const modal = reactive({ type: '', title: '', data: {}, error: '' });
const appointmentStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'FINISHED', 'CANCELLED'];
const statItems = computed(() => [
  { label: '用户', value: overview.value.users || users.value.length },
  { label: '学生', value: overview.value.students || users.value.filter((u) => u.role === 'STUDENT').length },
  { label: '医生', value: overview.value.doctors || doctors.value.length },
  { label: '问诊', value: overview.value.consultations || consultations.value.length },
  { label: '预约', value: overview.value.appointments || appointments.value.length },
  { label: '科普', value: overview.value.articles || articles.value.length },
  { label: '药品', value: overview.value.medicines || medicines.value.length },
  { label: '公告', value: overview.value.announcements || announcements.value.length }
]);
const doctorUsers = computed(() => users.value.filter((u) => u.role === 'DOCTOR'));
const filteredUsers = computed(() => users.value.filter((u) => (!filters.role || u.role === filters.role) && (!filters.status || u.status === filters.status)));
const filteredConsultations = computed(() => consultations.value.filter((c) => filters.consultation === 'WAITING' ? !c.doctorReply : filters.consultation === 'REPLIED' ? Boolean(c.doctorReply) : true));
const filteredAppointments = computed(() => appointments.value.filter((a) => !filters.appointment || a.status === filters.appointment));
async function load() {
  try { overview.value = (await adminOverview()).data || {}; } catch {}
  try { users.value = (await listAdminUsers()).data || []; } catch {}
  try { doctors.value = (await listAdminDoctors()).data || []; } catch {}
  try { articles.value = (await listAdminArticles()).data || []; } catch {}
  try { appointments.value = (await listAdminAppointments()).data || []; } catch {}
  try { consultations.value = (await listAdminConsultations()).data || []; } catch {}
  try { medicines.value = (await listAdminMedicines()).data || []; } catch {}
  try { announcements.value = (await listAdminAnnouncements()).data || []; } catch {}
}
function closeModal() { modal.type = ''; modal.title = ''; modal.data = {}; modal.error = ''; }
function openUser(item = null) { modal.type = 'user'; modal.title = item ? '编辑用户' : '新增用户'; modal.data = item ? { ...item, password: '' } : { username: '', password: '', realName: '', role: 'STUDENT', phone: '', college: '', className: '', status: 'ENABLED' }; }
function openDoctor(item = null) { modal.type = 'doctor'; modal.title = item ? '编辑医生档案' : '新增医生档案'; modal.data = item ? { ...item } : { userId: '', department: '', title: '', specialty: '', scheduleText: '', phone: '', introduction: '', status: 'ENABLED' }; }
function openArticle(item = null) { modal.type = 'article'; modal.title = item ? '编辑科普' : '新增科普'; modal.data = item ? { ...item } : { title: '', category: '', summary: '', content: '', status: 'PUBLISHED' }; }
function openMedicine(item = null) { modal.type = 'medicine'; modal.title = item ? '编辑药品' : '新增药品'; modal.data = item ? { ...item } : { name: '', category: '', usageInfo: '', caution: '', prescriptionRequired: '非处方药', status: 'PUBLISHED' }; }
function openAnnouncement(item = null) { modal.type = 'announcement'; modal.title = item ? '编辑公告' : '新增公告'; modal.data = item ? { ...item } : { title: '', type: '门诊通知', content: '', status: 'PUBLISHED' }; }
async function saveModal() {
  modal.error = '';
  try {
    if (modal.type === 'user') modal.data.id ? await updateAdminUser(modal.data.id, modal.data) : await createAdminUser(modal.data);
    if (modal.type === 'doctor') modal.data.id ? await updateAdminDoctor(modal.data.id, modal.data) : await createAdminDoctor(modal.data);
    if (modal.type === 'article') modal.data.id ? await updateAdminArticle(modal.data.id, modal.data) : await createAdminArticle(modal.data);
    if (modal.type === 'medicine') modal.data.id ? await updateAdminMedicine(modal.data.id, modal.data) : await createAdminMedicine(modal.data);
    if (modal.type === 'announcement') modal.data.id ? await updateAdminAnnouncement(modal.data.id, modal.data) : await createAdminAnnouncement(modal.data);
    closeModal(); await load();
  } catch (e) { modal.error = '保存失败，请检查填写内容'; }
}
async function toggleUser(user) { await updateAdminUserStatus(user.id, user.status === 'ENABLED' ? 'DISABLED' : 'ENABLED'); await load(); }
async function toggleArticle(item) { await updateAdminArticleStatus(item.id, item.status === 'PUBLISHED' ? 'OFFLINE' : 'PUBLISHED'); await load(); }
async function toggleMedicine(item) { await updateAdminMedicineStatus(item.id, item.status === 'PUBLISHED' ? 'OFFLINE' : 'PUBLISHED'); await load(); }
async function toggleAnnouncement(item) { await updateAdminAnnouncementStatus(item.id, item.status === 'PUBLISHED' ? 'OFFLINE' : 'PUBLISHED'); await load(); }
async function adminSetAppointment(id, status) { await updateAdminAppointmentStatus(id, status); await load(); }
watch(() => route.path, load);
onMounted(load);
</script>