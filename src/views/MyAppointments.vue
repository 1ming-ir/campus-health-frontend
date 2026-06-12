<template>
  <div class="page-head"><h1>鎴戠殑棰勭害</h1><p>鏌ョ湅鏍″尰闄㈤绾︾姸鎬侊紝鏈鐞嗛绾﹀彲鍙栨秷銆?/p></div>
  <div class="card">
    <p class="empty" v-if="appointments.length === 0">鏆傛棤棰勭害璁板綍銆?/p>
    <div class="list-item" v-for="item in appointments" :key="item.id">
      <strong>{{ item.appointmentDate }} {{ item.timeSlot }}</strong>
      <p class="muted">鍖荤敓锛歿{ item.doctorName || item.doctorId }}锛涚姸鎬侊細{{ statusLabel(item.status) }}锛涘師鍥狅細{{ item.reason }}</p>
      <button v-if="item.status === 'PENDING' || item.status === 'APPROVED'" class="btn ghost" @click="cancel(item.id)">鍙栨秷棰勭害</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { listMyAppointments, updateAppointmentStatus } from '../api';
import { currentUser, statusLabel } from '../utils';
const user = currentUser();
const appointments = ref([]);
async function load() { appointments.value = (await listMyAppointments(user.id || 1)).data || []; }
async function cancel(id) { await updateAppointmentStatus(id, 'CANCELLED'); await load(); }
onMounted(load);
</script>