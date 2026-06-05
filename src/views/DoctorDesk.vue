<template>
  <h1>医生工作台</h1>
  <div class="card">
    <h3>预约处理</h3>
    <div class="list-item" v-for="item in appointments" :key="item.id">
      <strong>{{ item.studentName || '学生' }} - {{ item.reason }}</strong>
      <p class="muted">{{ item.appointmentDate }} {{ item.timeSlot }}；状态：{{ item.status }}</p>
      <button class="btn secondary" @click="finishAppointment(item.id)">标记已处理</button>
    </div>
  </div>
  <div class="card">
    <h3>学生问诊记录</h3>
    <div class="list-item" v-for="item in consultations" :key="item.id">
      <strong>{{ item.studentName || '学生' }}：{{ item.symptom }}</strong>
      <p class="muted">AI 建议：{{ item.aiAdvice }}</p>
      <input v-model="replyText[item.id]" placeholder="填写医生补充建议">
      <button class="btn secondary" @click="saveReply(item.id)">保存建议</button>
      <p v-if="item.doctorReply">已有医生建议：{{ item.doctorReply }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { listConsultations, listDoctorAppointments, replyConsultation, updateAppointmentStatus } from '../api';

const appointments = ref([]);
const consultations = ref([]);
const replyText = reactive({});

async function load() {
  try {
    appointments.value = (await listDoctorAppointments(1)).data || [];
    consultations.value = (await listConsultations()).data || [];
  } catch (e) {
    appointments.value = [{ id: 1, studentName: '张同学', reason: '咳嗽发热', appointmentDate: '2026-06-08', timeSlot: '上午 09:00-10:00', status: 'PENDING' }];
    consultations.value = [];
  }
}

async function finishAppointment(id) {
  await updateAppointmentStatus(id, 'FINISHED');
  await load();
}

async function saveReply(id) {
  await replyConsultation(id, replyText[id] || '建议到校医院进一步检查，必要时复诊。');
  await load();
}

onMounted(load);
</script>
