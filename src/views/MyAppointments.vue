<template>
  <div class="page-head"><h1>我的预约</h1><p>查看校医院预约审核进度和处理结果。</p></div>
  <div class="card">
    <p class="empty" v-if="items.length === 0">暂无预约记录。</p>
    <article class="list-item" v-for="item in items" :key="item.id">
      <div class="toolbar"><strong>{{ item.appointmentDate }} {{ item.timeSlot }}</strong><span class="tag">{{ statusLabel(item.status) }}</span></div>
      <p class="muted">医生：{{ item.doctorName || '-' }}；原因：{{ item.reason }}</p>
      <div class="actions"><button class="btn ghost" @click="selected = item">查看详情</button><button v-if="['PENDING','APPROVED'].includes(item.status)" class="btn danger" @click="cancel(item)">取消预约</button></div>
    </article>
  </div>
  <div v-if="selected" class="modal-mask" @click.self="selected = null"><div class="modal"><div class="toolbar"><h3>预约详情</h3><button class="btn ghost" @click="selected = null">关闭</button></div><p><strong>医生：</strong>{{ selected.doctorName }}</p><p><strong>时间：</strong>{{ selected.appointmentDate }} {{ selected.timeSlot }}</p><p><strong>原因：</strong>{{ selected.reason }}</p><p><strong>状态：</strong>{{ statusLabel(selected.status) }}</p></div></div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { cancelAppointment, listMyAppointments } from '../api';
import { currentUser, statusLabel } from '../utils';
const user = currentUser();
const items = ref([]);
const selected = ref(null);
async function load() { items.value = (await listMyAppointments(user.id)).data || []; }
async function cancel(item) { await cancelAppointment(item.id, user.id); await load(); }
onMounted(load);
</script>