<template>
  <div class="page-head"><h1>AI 健康问诊</h1><p>填写症状信息后生成初步健康建议，系统会保留记录，便于预约和医生补充意见。</p></div>
  <div class="two-col">
    <form class="card" @submit.prevent="submit">
      <h3>症状信息</h3>
      <label>症状描述 *</label>
      <textarea v-model.trim="form.symptom" rows="7" placeholder="例如：咽痛、咳嗽两天，体温 37.8℃，无明显胸闷"></textarea>
      <p class="error" v-if="errors.symptom">{{ errors.symptom }}</p>
      <div class="form-row">
        <div><label>持续时间 *</label><input v-model.trim="form.duration" placeholder="例如：2天"></div>
        <div><label>严重程度 *</label><select v-model="form.severity"><option value="">请选择</option><option>轻度</option><option>中度</option><option>重度</option></select></div>
      </div>
      <p class="error" v-if="errors.duration">{{ errors.duration }}</p>
      <p class="error" v-if="errors.severity">{{ errors.severity }}</p>
      <label>是否用药 *</label>
      <select v-model="form.medicineUsed"><option value="">请选择</option><option>未用药</option><option>已用药</option></select>
      <p class="error" v-if="errors.medicineUsed">{{ errors.medicineUsed }}</p>
      <label v-if="form.medicineUsed === '已用药'">药品名称 *</label>
      <input v-if="form.medicineUsed === '已用药'" v-model.trim="form.medicineName" placeholder="例如：退烧药、感冒药">
      <p class="error" v-if="errors.medicineName">{{ errors.medicineName }}</p>
      <button class="btn block" :disabled="loading">{{ loading ? '生成中...' : '生成建议并保存记录' }}</button>
      <p class="error" v-if="message">{{ message }}</p>
    </form>
    <aside class="stack">
      <div class="card"><h3>服务边界</h3><ul><li>AI 建议仅供健康咨询参考，不替代医生诊断。</li><li>结果会进入记录，便于预约和医生接续处理。</li></ul></div>
      <div class="card"><h3>紧急情况怎么办？</h3><p class="muted">若出现呼吸困难、胸痛、意识异常、剧烈疼痛、高热不退等情况，应直接线下就医或拨打急救电话。</p></div>
    </aside>
  </div>
  <div class="card result-card" v-if="advice">
    <div class="toolbar"><h3>AI 初步建议</h3><span class="tag warn">仅供健康咨询参考</span></div>
    <div class="advice-box"><p v-for="(line, idx) in adviceLines(advice)" :key="idx">{{ line }}</p></div>
    <div class="actions"><RouterLink class="btn" to="/appointment">去预约</RouterLink><RouterLink class="btn ghost" to="/consultations">查看问诊记录</RouterLink></div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { createConsultation } from '../api';
import { adviceLines, currentUser } from '../utils';

const user = currentUser();
const loading = ref(false);
const message = ref('');
const advice = ref('');
const form = reactive({ symptom: '', duration: '', severity: '', medicineUsed: '', medicineName: '' });
const errors = reactive({});

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key]);
  if (!form.symptom || form.symptom.length < 5) errors.symptom = '症状描述至少填写 5 个字';
  if (!form.duration) errors.duration = '请填写持续时间';
  if (!form.severity) errors.severity = '请选择严重程度';
  if (!form.medicineUsed) errors.medicineUsed = '请选择是否用药';
  if (form.medicineUsed === '已用药' && !form.medicineName) errors.medicineName = '请填写药品名称';
  return Object.keys(errors).length === 0;
}

async function submit() {
  message.value = '';
  if (!validate()) return;
  loading.value = true;
  try {
    const res = await createConsultation({ ...form, studentId: user.id });
    if (res.code !== 0) {
      message.value = res.message || '问诊提交失败';
      return;
    }
    advice.value = res.data.aiAdvice;
  } catch (e) {
    message.value = '问诊提交失败，请稍后重试';
  } finally {
    loading.value = false;
  }
}
</script>