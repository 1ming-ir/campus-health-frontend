<template>
  <div class="page-head"><h1>{{ title }}</h1><p>澶勭悊瀛︾敓棰勭害锛屾煡鐪?AI 鍒濇寤鸿锛屽苟濉啓鍖荤敓琛ュ厖鎰忚銆?/p></div>
  <div class="stats">
    <div class="stat"><strong>{{ appointments.length }}</strong><span>棰勭害璁板綍</span></div>
    <div class="stat"><strong>{{ pendingAppointments }}</strong><span>寰呭鐞嗛绾?/span></div>
    <div class="stat"><strong>{{ consultations.length }}</strong><span>闂瘖璁板綍</span></div>
    <div class="stat"><strong>{{ waitingReply }}</strong><span>寰呰ˉ鍏呭缓璁?/span></div>
  </div>
  <div v-if="view === 'home'" class="grid"><div class="card"><h3>棰勭害澶勭悊</h3><p class="muted">瀹℃牳瀛︾敓绾夸笂棰勭害銆?/p><RouterLink class="btn" to="/doctor/appointments">杩涘叆澶勭悊</RouterLink></div><div class="card"><h3>闂瘖澶嶆牳</h3><p class="muted">鍩轰簬瀛︾敓鐥囩姸鍜?AI 寤鸿濉啓鍖荤敓琛ュ厖鎰忚銆?/p><RouterLink class="btn" to="/doctor/consultations">杩涘叆澶嶆牳</RouterLink></div></div>
  <div v-if="view === 'appointments'" class="card">
    <div class="toolbar"><h3>棰勭害澶勭悊</h3><select v-model="appointmentFilter"><option value="ALL">鍏ㄩ儴棰勭害</option><option value="PENDING">寰呭鏍?/option><option value="APPROVED">宸查€氳繃</option><option value="FINISHED">宸插畬鎴?/option></select></div>
    <div class="list-item" v-for="item in filteredAppointments" :key="item.id">
      <strong>{{ item.studentName || '瀛︾敓' }} - {{ item.reason }}</strong><p class="muted">{{ item.appointmentDate }} {{ item.timeSlot }}锛涚姸鎬侊細{{ statusLabel(item.status) }}</p>
      <button class="btn secondary" @click="setAppointment(item.id, 'APPROVED')">閫氳繃</button>
      <button class="btn danger" @click="setAppointment(item.id, 'REJECTED')">鎷掔粷</button>
      <button class="btn ghost" @click="setAppointment(item.id, 'FINISHED')">瀹屾垚</button>
    </div>
  </div>
  <div v-if="view === 'consultations' || view === 'replies'" class="card">
    <div class="toolbar"><h3>{{ view === 'replies' ? '鍥炲璁板綍' : '闂瘖澶嶆牳' }}</h3><select v-model="consultationFilter"><option value="ALL">鍏ㄩ儴闂瘖</option><option value="WAITING">寰呭尰鐢熷缓璁?/option><option value="REPLIED">宸茶ˉ鍏呭缓璁?/option></select></div>
    <div class="list-item" v-for="item in filteredConsultations" :key="item.id">
      <strong>{{ item.studentName || '瀛︾敓' }}锛歿{ item.symptom }}</strong>
      <p class="muted">鎸佺画鏃堕棿锛歿{ item.duration }}锛涗弗閲嶇▼搴︼細{{ item.severity }}锛涚敤鑽細{{ item.medicineUsed }} {{ item.medicineName || '' }}</p>
      <div class="advice-box compact"><p v-for="(line, idx) in adviceLines(item.aiAdvice)" :key="idx">{{ line }}</p></div>
      <textarea v-if="!item.doctorReply" v-model="replyText[item.id]" rows="3" placeholder="璇峰～鍐欏尰鐢熻ˉ鍏呭缓璁紝涓嶈兘涓虹┖"></textarea>
      <button v-if="!item.doctorReply" class="btn secondary" @click="saveReply(item.id)">淇濆瓨鍖荤敓寤鸿</button>
      <p class="error" v-if="replyError[item.id]">{{ replyError[item.id] }}</p>
      <p v-if="item.doctorReply" class="doctor-reply"><strong>宸叉湁鍖荤敓寤鸿锛?/strong>{{ item.doctorReply }}</p>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { listConsultations, listDoctorAppointments, replyConsultation, updateAppointmentStatus } from '../api';
import { adviceLines, statusLabel } from '../utils';
const route = useRoute();
const view = computed(() => route.meta.view || 'home');
const title = computed(() => view.value === 'appointments' ? '棰勭害澶勭悊' : view.value === 'consultations' ? '闂瘖澶嶆牳' : view.value === 'replies' ? '鍥炲璁板綍' : '鍖荤敓宸ヤ綔鍙?);
const appointments = ref([]);
const consultations = ref([]);
const appointmentFilter = ref('ALL');
const consultationFilter = ref('ALL');
const replyText = reactive({});
const replyError = reactive({});
const pendingAppointments = computed(() => appointments.value.filter((item) => item.status === 'PENDING').length);
const waitingReply = computed(() => consultations.value.filter((item) => !item.doctorReply).length);
const filteredAppointments = computed(() => appointments.value.filter((item) => appointmentFilter.value === 'ALL' || item.status === appointmentFilter.value));
const filteredConsultations = computed(() => consultations.value.filter((item) => {
  if (view.value === 'replies') return Boolean(item.doctorReply);
  if (consultationFilter.value === 'WAITING') return !item.doctorReply;
  if (consultationFilter.value === 'REPLIED') return Boolean(item.doctorReply);
  return true;
}));
async function load() { appointments.value = (await listDoctorAppointments(1)).data || []; consultations.value = (await listConsultations()).data || []; }
async function setAppointment(id, status) { await updateAppointmentStatus(id, status); await load(); }
async function saveReply(id) {
  replyError[id] = '';
  const text = (replyText[id] || '').trim();
  if (!text) return replyError[id] = '璇峰～鍐欏尰鐢熻ˉ鍏呭缓璁悗鍐嶄繚瀛樸€?;
  const res = await replyConsultation(id, text, 1);
  if (res.code !== 0) return replyError[id] = res.message || '淇濆瓨澶辫触';
  replyText[id] = '';
  await load();
}
onMounted(load);
</script>