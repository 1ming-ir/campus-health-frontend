<template>
  <div class="page-head">
    <h1>AI 健康问诊</h1>
    <p>先整理症状，再给出风险提示和预约建议；结果会进入问诊记录，医生端可继续补充意见。</p>
  </div>

  <div class="grid two">
    <div class="card">
      <h3>症状信息</h3>
      <label>症状描述</label>
      <textarea v-model="form.symptom" rows="5" placeholder="例如：咽痛、咳嗽两天，轻微发热"></textarea>
      <label>持续时间</label>
      <input v-model="form.duration" placeholder="例如：2天">
      <label>严重程度</label>
      <select v-model="form.severity">
        <option>轻度</option>
        <option>中度</option>
        <option>重度</option>
      </select>
      <label>是否用药</label>
      <input v-model="form.medicineUsed" placeholder="例如：未用药，或已服用退烧药">
      <button class="btn block" :disabled="loading" @click="submit">{{ loading ? '生成中...' : '生成建议并保存记录' }}</button>
      <p class="error" v-if="error">{{ error }}</p>
    </div>

    <div class="card">
      <h3>为什么不直接问通用 AI？</h3>
      <div class="reason-card">
        <p><strong>本系统不是单次聊天，而是校园就医流程入口。</strong></p>
        <p class="muted">它会把症状、AI 建议、预约记录、医生补充意见和科普文章保存在同一条校园健康服务链路里，方便学生复查，也方便医生接手。</p>
      </div>
      <div class="reason-card">
        <p><strong>系统回答有边界。</strong></p>
        <p class="muted">问诊结果固定包含风险提示和线下就医提醒，不把 AI 包装成诊断结论。</p>
      </div>
    </div>
  </div>

  <div class="card" v-if="advice">
    <div class="toolbar">
      <h3>AI 初步建议</h3>
      <span class="tag warn">仅供健康咨询参考</span>
    </div>
    <div class="advice-box">{{ advice }}</div>
    <RouterLink class="btn ghost" to="/appointment">需要医生进一步评估，去预约校医院</RouterLink>
  </div>

  <div class="card">
    <div class="toolbar">
      <h3>我的问诊记录</h3>
      <span class="muted">{{ records.length }} 条</span>
    </div>
    <p class="empty" v-if="records.length === 0">暂无问诊记录。</p>
    <div class="list-item" v-for="item in records" :key="item.id">
      <strong>{{ item.symptom || '未填写症状' }}</strong>
      <p class="muted">AI 建议：{{ item.aiAdvice }}</p>
      <p v-if="item.doctorReply">医生补充：{{ item.doctorReply }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { createConsultation, listMyConsultations } from '../api';

const user = JSON.parse(localStorage.getItem('user') || '{"id":1}');
const form = reactive({ studentId: user.id || 1, symptom: '', duration: '', severity: '轻度', medicineUsed: '' });
const advice = ref('');
const records = ref([]);
const loading = ref(false);
const error = ref('');

async function loadRecords() {
  try {
    const res = await listMyConsultations(user.id || 1);
    records.value = res.data || [];
  } catch (e) {
    records.value = [];
  }
}

async function submit() {
  error.value = '';
  if (!form.symptom.trim()) {
    error.value = '请先填写症状描述，避免系统生成没有依据的建议。';
    return;
  }
  loading.value = true;
  try {
    const res = await createConsultation(form);
    if (res.code !== 0) {
      error.value = res.message || '问诊提交失败';
      return;
    }
    advice.value = res.data.aiAdvice;
    await loadRecords();
  } catch (e) {
    error.value = '问诊服务暂时不可用，请稍后重试。';
  } finally {
    loading.value = false;
  }
}

onMounted(loadRecords);
</script>
