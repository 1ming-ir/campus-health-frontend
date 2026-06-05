<template>
  <h1>AI 问诊</h1>
  <div class="card">
    <label>症状描述</label>
    <textarea v-model="form.symptom" rows="5" placeholder="请描述症状"></textarea>
    <label>持续时间</label>
    <input v-model="form.duration" placeholder="例如：2天">
    <label>严重程度</label>
    <select v-model="form.severity">
      <option>轻度</option>
      <option>中度</option>
      <option>重度</option>
    </select>
    <label>是否用药</label>
    <input v-model="form.medicineUsed" placeholder="例如：未用药">
    <button class="btn" @click="submit">生成建议并保存记录</button>
  </div>
  <div class="card" v-if="advice">
    <h3>AI 初步建议</h3>
    <p>{{ advice }}</p>
  </div>
  <div class="card">
    <h3>我的问诊记录</h3>
    <div class="list-item" v-for="item in records" :key="item.id">
      <strong>{{ item.symptom }}</strong>
      <p class="muted">{{ item.aiAdvice }}</p>
      <p v-if="item.doctorReply">医生补充：{{ item.doctorReply }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { createConsultation, listMyConsultations } from '../api';

const user = JSON.parse(localStorage.getItem('user') || '{"id":1}');
const form = reactive({ studentId: user.id || 1, symptom: '咽痛、咳嗽两天，轻微发热', duration: '2天', severity: '轻度', medicineUsed: '未用药' });
const advice = ref('');
const records = ref([]);

async function loadRecords() {
  try {
    const res = await listMyConsultations(user.id || 1);
    records.value = res.data || [];
  } catch (e) {
    records.value = [];
  }
}

async function submit() {
  try {
    const res = await createConsultation(form);
    advice.value = res.data.aiAdvice;
    await loadRecords();
  } catch (e) {
    advice.value = '演示建议：注意休息和补水。如症状加重，请及时前往校医院就诊。本建议仅供健康咨询参考。';
  }
}

onMounted(loadRecords);
</script>
