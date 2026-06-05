<template>
  <div class="page-head">
    <h1>医生工作台</h1>
    <p>处理学生预约，查看 AI 初步建议，并填写医生补充意见。</p>
  </div>

  <div class="stats">
    <div class="stat"><strong>{{ appointments.length }}</strong><span>预约记录</span></div>
    <div class="stat"><strong>{{ pendingAppointments }}</strong><span>待处理预约</span></div>
    <div class="stat"><strong>{{ consultations.length }}</strong><span>问诊记录</span></div>
    <div class="stat"><strong>{{ waitingReply }}</strong><span>待补充建议</span></div>
  </div>

  <div class="grid two">
    <div class="card">
      <div class="toolbar">
        <h3>预约处理</h3>
        <select v-model="appointmentFilter">
          <option value="ALL">全部预约</option>
          <option value="PENDING">待处理</option>
          <option value="FINISHED">已处理</option>
        </select>
      </div>
      <p class="empty" v-if="filteredAppointments.length === 0">暂无符合条件的预约。</p>
      <div class="list-item" v-for="item in filteredAppointments" :key="item.id">
        <strong>{{ item.studentName || '学生' }} - {{ item.reason || '未填写预约原因' }}</strong>
        <p class="muted">{{ item.appointmentDate }} {{ item.timeSlot }}；状态：<span class="status">{{ item.status }}</span></p>
        <button class="btn secondary" :disabled="item.status === 'FINISHED'" @click="finishAppointment(item.id)">标记已处理</button>
      </div>
    </div>

    <div class="card">
      <div class="toolbar">
        <h3>问诊复核</h3>
        <select v-model="consultationFilter">
          <option value="ALL">全部问诊</option>
          <option value="WAITING">待医生建议</option>
          <option value="REPLIED">已补充建议</option>
        </select>
      </div>
      <p class="empty" v-if="filteredConsultations.length === 0">暂无符合条件的问诊记录。</p>
      <div class="list-item" v-for="item in filteredConsultations" :key="item.id">
        <strong>{{ item.studentName || '学生' }}：{{ item.symptom || '未填写症状' }}</strong>
        <p class="muted">AI 建议：{{ item.aiAdvice }}</p>
        <textarea v-model="replyText[item.id]" rows="3" placeholder="请基于问诊记录填写医生补充建议，不能为空"></textarea>
        <button class="btn secondary" @click="saveReply(item.id)">保存医生建议</button>
        <p class="error" v-if="replyError[item.id]">{{ replyError[item.id] }}</p>
        <p v-if="item.doctorReply"><strong>已有医生建议：</strong>{{ item.doctorReply }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { listConsultations, listDoctorAppointments, replyConsultation, updateAppointmentStatus } from '../api';

const appointments = ref([]);
const consultations = ref([]);
const appointmentFilter = ref('ALL');
const consultationFilter = ref('ALL');
const replyText = reactive({});
const replyError = reactive({});
const pendingAppointments = computed(() => appointments.value.filter((item) => item.status !== 'FINISHED').length);
const waitingReply = computed(() => consultations.value.filter((item) => !item.doctorReply).length);
const filteredAppointments = computed(() => appointments.value.filter((item) => appointmentFilter.value === 'ALL' || item.status === appointmentFilter.value));
const filteredConsultations = computed(() => consultations.value.filter((item) => {
  if (consultationFilter.value === 'WAITING') return !item.doctorReply;
  if (consultationFilter.value === 'REPLIED') return Boolean(item.doctorReply);
  return true;
}));

async function load() {
  appointments.value = (await listDoctorAppointments(1)).data || [];
  consultations.value = (await listConsultations()).data || [];
}

async function finishAppointment(id) {
  await updateAppointmentStatus(id, 'FINISHED');
  await load();
}

async function saveReply(id) {
  replyError[id] = '';
  const text = (replyText[id] || '').trim();
  if (!text) {
    replyError[id] = '请填写医生补充建议后再保存。';
    return;
  }
  const res = await replyConsultation(id, text);
  if (res.code !== 0) {
    replyError[id] = res.message || '保存失败';
    return;
  }
  replyText[id] = '';
  await load();
}

onMounted(async () => {
  try {
    await load();
  } catch (e) {
    appointments.value = [];
    consultations.value = [];
  }
});
</script>
