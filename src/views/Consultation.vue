<template>
  <div class="page-head page-head-row">
    <div><h1>AI 鍋ュ悍闂瘖</h1><p>濉啓瀹屾暣鐥囩姸淇℃伅鍚庣敓鎴愬垵姝ュ仴搴峰缓璁紝缁撴灉浼氫繚鐣欎负闂瘖璁板綍銆?/p></div>
    <RouterLink class="btn ghost" to="/appointment">鍘婚绾?/RouterLink>
  </div>
  <div class="grid two">
    <div class="card">
      <h3>鐥囩姸淇℃伅</h3>
      <label>鐥囩姸鎻忚堪 <span class="required">*</span></label>
      <textarea v-model="form.symptom" rows="6" placeholder="渚嬪锛氬捊鐥涖€佸挸鍡戒袱澶╋紝浣撴俯 37.8鈩冿紝鏃犳槑鏄捐兏闂?></textarea>
      <div class="form-grid">
        <div><label>鎸佺画鏃堕棿 <span class="required">*</span></label><input v-model.trim="form.duration" placeholder="渚嬪锛?澶?></div>
        <div><label>涓ラ噸绋嬪害 <span class="required">*</span></label><select v-model="form.severity"><option value="">璇烽€夋嫨</option><option>杞诲害</option><option>涓害</option><option>閲嶅害</option></select></div>
      </div>
      <label>鏄惁鐢ㄨ嵂 <span class="required">*</span></label>
      <select v-model="form.medicineUsed"><option value="">璇烽€夋嫨</option><option>鏈敤鑽?/option><option>宸茬敤鑽?/option><option>涓嶇‘瀹?/option></select>
      <template v-if="form.medicineUsed === '宸茬敤鑽?">
        <label>鑽搧鍚嶇О <span class="required">*</span></label>
        <input v-model.trim="form.medicineName" placeholder="璇峰～鍐欏凡浣跨敤鑽搧鍚嶇О">
      </template>
      <p class="muted">AI 寤鸿浠呬緵鍋ュ悍鍜ㄨ鍙傝€冿紝涓嶈兘鏇夸唬鍖荤敓璇婃柇銆?/p>
      <button class="btn block" :disabled="loading" @click="submit">{{ loading ? '鐢熸垚涓?..' : '鐢熸垚寤鸿骞朵繚瀛樿褰? }}</button>
      <p class="error" v-if="error">{{ error }}</p>
    </div>
    <div class="card">
      <h3>鏈嶅姟杈圭晫</h3>
      <ul class="check-list">
        <li>闂瘖缁撴灉浼氳繘鍏ヨ褰曪紝渚夸簬棰勭害鍜屽尰鐢熸帴缁鐞嗐€?/li>
        <li>濡傚嚭鐜板懠鍚稿洶闅俱€佹剰璇嗗紓甯搞€佸墽鐑堢柤鐥涚瓑鎯呭喌锛屽簲绔嬪嵆绾夸笅灏卞尰銆?/li>
        <li>鍖荤敓琛ュ厖寤鸿浼氬湪闂瘖璁板綍涓睍绀恒€?/li>
      </ul>
    </div>
  </div>
  <div class="card result-card" v-if="advice">
    <div class="toolbar"><h3>AI 鍒濇寤鸿</h3><span class="tag warn">浠呬緵鍋ュ悍鍜ㄨ鍙傝€?/span></div>
    <div class="advice-box structured"><p v-for="(line, index) in lines" :key="index">{{ line }}</p></div>
    <RouterLink class="btn" to="/appointment">闇€瑕佸尰鐢熻繘涓€姝ヨ瘎浼帮紝鍘婚绾︽牎鍖婚櫌</RouterLink>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { createConsultation } from '../api';
import { adviceLines, currentUser } from '../utils';

const user = currentUser();
const form = reactive({ studentId: user.id || 1, symptom: '', duration: '', severity: '', medicineUsed: '', medicineName: '' });
const advice = ref('');
const loading = ref(false);
const error = ref('');
const lines = computed(() => adviceLines(advice.value));

function validate() {
  if (!form.symptom.trim() || form.symptom.trim().length < 5) return '鐥囩姸鎻忚堪涓嶈兘涓虹┖锛屼笖涓嶅皯浜?5 涓瓧銆?;
  if (!form.duration.trim()) return '璇峰～鍐欐寔缁椂闂淬€?;
  if (!form.severity) return '璇烽€夋嫨涓ラ噸绋嬪害銆?;
  if (!form.medicineUsed) return '璇烽€夋嫨鏄惁鐢ㄨ嵂銆?;
  if (form.medicineUsed === '宸茬敤鑽? && !form.medicineName.trim()) return '璇峰～鍐欒嵂鍝佸悕绉般€?;
  return '';
}

async function submit() {
  error.value = validate();
  if (error.value) return;
  loading.value = true;
  try {
    const res = await createConsultation(form);
    if (res.code !== 0) {
      error.value = res.message || '闂瘖鎻愪氦澶辫触';
      return;
    }
    advice.value = res.data.aiAdvice || '';
  } catch {
    error.value = '闂瘖鏈嶅姟鏆傛椂涓嶅彲鐢紝璇疯仈绯荤鐞嗗憳妫€鏌ュ悗绔湇鍔°€?;
  } finally {
    loading.value = false;
  }
}
</script>