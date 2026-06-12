<template>
  <div class="page-head page-head-row">
    <div>
      <h1>AI 健康问诊</h1>
      <p>填写症状信息后生成初步健康建议；系统会保留记录，便于后续预约和医生补充意见。</p>
    </div>
    <RouterLink class="btn ghost" to="/appointment">去预约</RouterLink>
  </div>

  <div class="consult-layout">
    <div class="card consult-form-card">
      <h3>症状信息</h3>
      <label>症状描述 <span class="required">*</span></label>
      <textarea v-model="form.symptom" rows="6" placeholder="例如：咽痛、咳嗽两天，体温 37.8℃，无明显胸闷"></textarea>
      <div class="form-grid">
        <div>
          <label>持续时间</label>
          <input v-model="form.duration" placeholder="例如：2天">
        </div>
        <div>
          <label>严重程度</label>
          <select v-model="form.severity">
            <option>轻度</option>
            <option>中度</option>
            <option>重度</option>
          </select>
        </div>
      </div>
      <label>是否用药</label>
      <input v-model="form.medicineUsed" placeholder="例如：未用药，或已服用退烧药">
      <button class="btn block" :disabled="loading" @click="submit">{{ loading ? '生成中...' : '生成建议并保存记录' }}</button>
      <p class="error" v-if="error">{{ error }}</p>
    </div>

    <aside class="side-panel">
      <div class="card compact-card">
        <h3>服务边界</h3>
        <ul class="check-list">
          <li>AI 建议只用于健康咨询，不替代医生诊断。</li>
          <li>结果会进入记录，便于预约和医生接续处理。</li>
          <li>出现呼吸困难、意识异常、剧烈疼痛等情况应立即线下就医。</li>
        </ul>
      </div>
      <div class="card compact-card">
        <h3>为什么不直接问通用 AI？</h3>
        <p class="muted">通用 AI 只回答一次；本系统把症状、风险提示、预约、医生补充建议和科普内容串成校园健康服务流程。</p>
      </div>
    </aside>
  </div>

  <div class="card result-card" v-if="advice">
    <div class="toolbar">
      <h3>AI 初步建议</h3>
      <span class="tag warn">仅供健康咨询参考</span>
    </div>
    <div class="advice-box structured">
      <p v-for="(line, index) in adviceLines" :key="index">{{ line }}</p>
    </div>
    <div class="action-row">
      <RouterLink class="btn" to="/appointment">需要医生进一步评估，去预约校医院</RouterLink>
    </div>
  </div>

  <div class="card">
    <div class="toolbar">
      <h3>我的问诊记录</h3>
      <span class="muted">{{ records.length }} 条</span>
    </div>
    <p class="empty" v-if="records.length === 0">暂无问诊记录。</p>
    <div class="record-grid" v-else>
      <article class="record-card" v-for="item in records" :key="item.id">
        <div class="record-title">
          <strong>{{ item.symptom || '未填写症状' }}</strong>
          <span class="tag">{{ item.severity || '未分级' }}</span>
        </div>
        <p class="muted clamp">{{ item.aiAdvice || '暂无 AI 建议' }}</p>
        <p class="doctor-reply" v-if="item.doctorReply"><strong>医生补充：</strong>{{ item.doctorReply }}</p>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { createConsultation, listMyConsultations } from '../api';

const user = JSON.parse(localStorage.getItem('user') || '{}');
const form = reactive({ studentId: user.id || 1, symptom: '', duration: '', severity: '轻度', medicineUsed: '' });
const advice = ref('');
const records = ref([]);
const loading = ref(false);
const error = ref('');
const adviceLines = computed(() => splitAdvice(advice.value));

function splitAdvice(text) {
  if (!text) return [];
  const normalized = text.replace(/\r/g, '').split('\n').map((line) => line.trim()).filter(Boolean);
  if (normalized.length > 1) return normalized;
  return text
    .replace(/([。！？；])/g, '$1\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

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
    advice.value = res.data.aiAdvice || '';
    await loadRecords();
  } catch (e) {
    error.value = '问诊服务暂时不可用，请联系管理员检查后端服务。';
  } finally {
    loading.value = false;
  }
}

onMounted(loadRecords);
</script>
