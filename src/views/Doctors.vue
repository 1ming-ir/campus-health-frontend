<template>
  <div class="page-head"><h1>校医信息</h1><p>查看可预约校医的科室、职称、擅长方向和坐诊时间。</p></div>
  <div class="grid">
    <article class="card" v-for="doctor in enabledDoctors" :key="doctor.id">
      <div class="toolbar"><h3>{{ doctor.realName }}</h3><span class="tag">{{ statusLabel(doctor.status) }}</span></div>
      <p class="muted">{{ doctor.department }} · {{ doctor.title }}</p>
      <p><strong>擅长：</strong>{{ doctor.specialty }}</p>
      <p><strong>坐诊：</strong>{{ doctor.scheduleText }}</p>
      <p><strong>电话：</strong>{{ doctor.phone || '-' }}</p>
      <div class="actions"><button class="btn ghost" @click="selected = doctor">查看详情</button><RouterLink class="btn" to="/appointment">去预约</RouterLink></div>
    </article>
  </div>
  <p class="empty" v-if="enabledDoctors.length === 0">暂无可预约校医。</p>
  <div v-if="selected" class="modal-mask" @click.self="selected = null"><div class="modal"><div class="toolbar"><h3>{{ selected.realName }}</h3><button class="btn ghost" @click="selected = null">关闭</button></div><p>{{ selected.introduction || '暂无简介。' }}</p><p><strong>擅长方向：</strong>{{ selected.specialty }}</p><p><strong>排班说明：</strong>{{ selected.scheduleText }}</p><p><strong>可预约状态：</strong>{{ statusLabel(selected.status) }}</p></div></div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { listDoctors } from '../api';
import { statusLabel } from '../utils';
const doctors = ref([]);
const selected = ref(null);
const enabledDoctors = computed(() => doctors.value.filter((item) => item.status === 'ENABLED'));
onMounted(async () => { doctors.value = (await listDoctors()).data || []; });
</script>