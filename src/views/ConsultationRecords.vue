<template>
  <div class="page-head"><h1>我的问诊记录</h1><p>查看历史 AI 问诊和医生补充建议。填错且未回复的记录可以删除，已回复记录可归档隐藏。</p></div>
  <div class="card">
    <p class="empty" v-if="records.length === 0">暂无问诊记录。</p>
    <article class="record-card" v-for="item in records" :key="item.id">
      <div class="toolbar"><strong>{{ item.symptom }}</strong><span class="tag">{{ statusLabel(item.status) }}</span></div>
      <p class="muted">持续时间：{{ item.duration }}；严重程度：{{ item.severity }}；用药情况：{{ item.medicineUsed }} {{ item.medicineName || '' }}</p>
      <div class="advice-box compact"><p v-for="(line, idx) in adviceLines(item.aiAdvice)" :key="idx">{{ line }}</p></div>
      <p v-if="item.doctorReply" class="doctor-reply"><strong>医生补充建议：</strong>{{ item.doctorReply }}</p>
      <div class="actions">
        <button class="btn ghost" @click="selected = item">查看详情</button>
        <button v-if="!item.doctorReply" class="btn danger" @click="remove(item)">删除</button>
        <button v-else class="btn secondary" @click="archive(item)">归档</button>
      </div>
    </article>
  </div>
  <div v-if="selected" class="modal-mask" @click.self="selected = null">
    <div class="modal"><div class="toolbar"><h3>问诊详情</h3><button class="btn ghost" @click="selected = null">关闭</button></div>
      <p><strong>症状：</strong>{{ selected.symptom }}</p><p><strong>持续时间：</strong>{{ selected.duration }}</p><p><strong>严重程度：</strong>{{ selected.severity }}</p><p><strong>用药情况：</strong>{{ selected.medicineUsed }} {{ selected.medicineName || '' }}</p>
      <h4>AI 初步建议</h4><div class="advice-box compact"><p v-for="(line, idx) in adviceLines(selected.aiAdvice)" :key="idx">{{ line }}</p></div>
      <h4>医生补充建议</h4><p class="preline">{{ selected.doctorReply || '医生暂未回复。' }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { archiveConsultation, deleteConsultation, listMyConsultations } from '../api';
import { adviceLines, currentUser, statusLabel } from '../utils';

const user = currentUser();
const records = ref([]);
const selected = ref(null);
async function load() { records.value = (await listMyConsultations(user.id)).data || []; }
async function remove(item) {
  if (!confirm('确认删除这条未回复问诊记录？删除后医生端和管理员端也不可见。')) return;
  await deleteConsultation(item.id, user.id);
  await load();
}
async function archive(item) {
  await archiveConsultation(item.id, user.id);
  await load();
}
onMounted(load);
</script>