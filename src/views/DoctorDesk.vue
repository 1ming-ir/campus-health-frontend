<template>
  <div class="page-head"><h1>{{ title }}</h1><p>处理学生预约，查看 AI 初步建议，并填写医生补充意见。</p></div>
  <div class="stats">
    <div class="stat"><strong>{{ pendingAppointments }}</strong><span>待处理预约</span></div>
    <div class="stat"><strong>{{ todayAppointments }}</strong><span>今日预约</span></div>
    <div class="stat"><strong>{{ waitingReply }}</strong><span>待回复问诊</span></div>
    <div class="stat"><strong>{{ repliedCount }}</strong><span>已回复问诊</span></div>
  </div>
  <div v-if="view === 'home'" class="grid">
    <div class="card action-card"><h3>预约处理</h3><p class="muted">优先处理待审核预约，必要时标记完成。</p><RouterLink class="btn" to="/doctor/appointments">进入预约处理</RouterLink></div>
    <div class="card action-card"><h3>问诊复核</h3><p class="muted">查看 AI 建议，对学生问诊补充医生意见。</p><RouterLink class="btn" to="/doctor/consultations">进入问诊复核</RouterLink></div>
    <div class="card action-card"><h3>回复记录</h3><p class="muted">查看已完成回复的问诊记录。</p><RouterLink class="btn" to="/doctor/replies">查看回复记录</RouterLink></div>
  </div>
  <div v-if="view === 'appointments'" class="card">
    <div class="toolbar"><h3>预约处理</h3><select v-model="appointmentFilter"><option value="ALL">全部</option><option v-for="s in appointmentStatuses" :key="s" :value="s">{{ statusLabel(s) }}</option></select></div>
    <p class="empty" v-if="filteredAppointments.length === 0">暂无预约记录。</p>
    <article class="list-item" v-for="item in filteredAppointments" :key="item.id">
      <div class="toolbar"><strong>{{ item.studentName || '学生' }} - {{ item.reason }}</strong><span class="tag">{{ statusLabel(item.status) }}</span></div>
      <p class="muted">{{ item.appointmentDate }} {{ item.timeSlot }}</p>
      <div class="actions">
        <button class="btn ghost" @click="detail = item">查看详情</button>
        <button v-if="item.status === 'PENDING'" class="btn secondary" @click="setAppointment(item.id, 'APPROVED')">通过</button>
        <button v-if="item.status === 'PENDING'" class="btn danger" @click="setAppointment(item.id, 'REJECTED')">拒绝</button>
        <button v-if="item.status === 'APPROVED'" class="btn" @click="setAppointment(item.id, 'FINISHED')">标记完成</button>
      </div>
    </article>
  </div>
  <div v-if="view === 'consultations' || view === 'replies'" class="card">
    <div class="toolbar"><h3>{{ view === 'replies' ? '回复记录' : '问诊复核' }}</h3><select v-model="consultationFilter"><option value="ALL">全部</option><option value="WAITING">待回复</option><option value="REPLIED">已回复</option></select></div>
    <p class="empty" v-if="filteredConsultations.length === 0">暂无问诊记录。</p>
    <article class="record-card" v-for="item in filteredConsultations" :key="item.id">
      <div class="toolbar"><strong>{{ item.studentName || '学生' }} - {{ item.symptom }}</strong><span class="tag">{{ statusLabel(item.status) }}</span></div>
      <p class="muted">持续时间：{{ item.duration }}；严重程度：{{ item.severity }}；用药情况：{{ item.medicineUsed }} {{ item.medicineName || '' }}</p>
      <div class="advice-box compact"><p v-for="(line, idx) in adviceLines(item.aiAdvice)" :key="idx">{{ line }}</p></div>
      <template v-if="!item.doctorReply && view !== 'replies'">
        <textarea v-model="replyText[item.id]" rows="3" placeholder="请输入医生补充建议，至少 5 个字"></textarea>
        <button class="btn secondary" @click="saveReply(item.id)">保存医生补充建议</button>
        <p class="error" v-if="replyError[item.id]">{{ replyError[item.id] }}</p>
      </template>
      <p v-if="item.doctorReply" class="doctor-reply"><strong>医生补充建议：</strong>{{ item.doctorReply }}</p>
      <button class="btn ghost" @click="detail = item">查看详情</button>
    </article>
  </div>
  <div v-if="detail" class="modal-mask" @click.self="detail = null">
    <div class="modal wide"><div class="toolbar"><h3>详情</h3><button class="btn ghost" @click="detail = null">关闭</button></div><pre class="detail-pre">{{ detailText }}</pre></div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { listConsultations, listDoctorAppointments, replyConsultation, updateAppointmentStatus } from '../api';
import { adviceLines, currentUser, statusLabel } from '../utils';
const route = useRoute();
const user = currentUser();
const view = computed(() => route.meta.view || 'home');
const title = computed(() => ({ home: '医生首页', appointments: '预约处理', consultations: '问诊复核', replies: '回复记录' }[view.value] || '医生工作台'));
const appointments = ref([]);
const consultations = ref([]);
const appointmentFilter = ref('ALL');
const consultationFilter = ref('ALL');
const replyText = reactive({});
const replyError = reactive({});
const detail = ref(null);
const appointmentStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'FINISHED', 'CANCELLED'];
const pendingAppointments = computed(() => appointments.value.filter((item) => item.status === 'PENDING').length);
const todayAppointments = computed(() => appointments.value.filter((item) => item.appointmentDate === new Date().toISOString().slice(0, 10)).length);
const waitingReply = computed(() => consultations.value.filter((item) => !item.doctorReply).length);
const repliedCount = computed(() => consultations.value.filter((item) => item.doctorReply).length);
const filteredAppointments = computed(() => appointments.value.filter((item) => appointmentFilter.value === 'ALL' || item.status === appointmentFilter.value));
const filteredConsultations = computed(() => consultations.value.filter((item) => {
  if (view.value === 'replies') return Boolean(item.doctorReply);
  if (consultationFilter.value === 'WAITING') return !item.doctorReply;
  if (consultationFilter.value === 'REPLIED') return Boolean(item.doctorReply);
  return true;
}));
const detailText = computed(() => JSON.stringify(detail.value, null, 2));
async function load() {
  appointments.value = (await listDoctorAppointments(user.doctorId || 1)).data || [];
  consultations.value = (await listConsultations()).data || [];
}
async function setAppointment(id, status) { await updateAppointmentStatus(id, status); await load(); }
async function saveReply(id) {
  replyError[id] = '';
  const text = (replyText[id] || '').trim();
  if (text.length < 5) { replyError[id] = '医生补充建议至少 5 个字'; return; }
  const res = await replyConsultation(id, text, user.doctorId || 1);
  if (res.code !== 0) { replyError[id] = res.message || '保存失败'; return; }
  replyText[id] = '';
  await load();
}
watch(() => route.path, load);
onMounted(load);
</script>