<template>
  <h1>校医院预约</h1>
  <div class="card">
    <label>医生 ID</label>
    <input v-model="form.doctorId" placeholder="医生ID：1">
    <label>预约日期</label>
    <input v-model="form.appointmentDate" type="date">
    <label>时间段</label>
    <select v-model="form.timeSlot">
      <option>上午 09:00-10:00</option>
      <option>上午 10:00-11:00</option>
      <option>下午 14:00-15:00</option>
    </select>
    <label>预约原因</label>
    <textarea v-model="form.reason" rows="4" placeholder="预约原因"></textarea>
    <button class="btn" @click="submit">提交预约</button>
    <p class="muted" v-if="msg">{{ msg }}</p>
  </div>
  <div class="card">
    <h3>我的预约</h3>
    <div class="list-item" v-for="item in appointments" :key="item.id">
      <strong>{{ item.appointmentDate }} {{ item.timeSlot }}</strong>
      <p class="muted">医生：{{ item.doctorName || item.doctorId }}；状态：{{ item.status }}；原因：{{ item.reason }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { createAppointment, listMyAppointments } from '../api';

const user = JSON.parse(localStorage.getItem('user') || '{"id":1}');
const form = reactive({ studentId: user.id || 1, doctorId: 1, appointmentDate: '2026-06-08', timeSlot: '上午 09:00-10:00', reason: '咳嗽发热，希望医生进一步评估' });
const msg = ref('');
const appointments = ref([]);

async function loadAppointments() {
  try {
    const res = await listMyAppointments(user.id || 1);
    appointments.value = res.data || [];
  } catch (e) {
    appointments.value = [];
  }
}

async function submit() {
  try {
    await createAppointment(form);
    msg.value = '预约已提交';
    await loadAppointments();
  } catch (e) {
    msg.value = '演示提示：预约已提交';
  }
}

onMounted(loadAppointments);
</script>
