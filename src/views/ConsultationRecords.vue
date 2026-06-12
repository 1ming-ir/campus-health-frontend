<template>
  <div class="page-head"><h1>鎴戠殑闂瘖璁板綍</h1><p>鏈洖澶嶈褰曞彲鍒犻櫎锛涘尰鐢熷凡鍥炲璁板綍鍙綊妗ｉ殣钘忥紝淇濈暀鏈嶅姟閾捐矾鍙拷婧€?/p></div>
  <div class="card">
    <p class="empty" v-if="records.length === 0">鏆傛棤闂瘖璁板綍銆?/p>
    <article class="record-card" v-for="item in records" :key="item.id">
      <div class="toolbar"><strong>{{ item.symptom }}</strong><span class="tag">{{ statusLabel(item.status) }}</span></div>
      <p class="muted">鎸佺画鏃堕棿锛歿{ item.duration }}锛涗弗閲嶇▼搴︼細{{ item.severity }}锛涚敤鑽細{{ item.medicineUsed }} {{ item.medicineName || '' }}</p>
      <div class="advice-box compact"><p v-for="(line, idx) in adviceLines(item.aiAdvice)" :key="idx">{{ line }}</p></div>
      <p v-if="item.doctorReply" class="doctor-reply"><strong>鍖荤敓琛ュ厖锛?/strong>{{ item.doctorReply }}</p>
      <button v-if="!item.doctorReply" class="btn danger" @click="remove(item)">鍒犻櫎璇彁浜?/button>
      <button v-else class="btn ghost" @click="archive(item)">褰掓。璁板綍</button>
    </article>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { archiveConsultation, deleteConsultation, listMyConsultations } from '../api';
import { adviceLines, currentUser, statusLabel } from '../utils';

const user = currentUser();
const records = ref([]);
async function load() {
  records.value = (await listMyConsultations(user.id || 1)).data || [];
}
async function remove(item) {
  if (!confirm('纭鍒犻櫎杩欐潯鏈洖澶嶉棶璇婅褰曞悧锛熷垹闄ゅ悗鍖荤敓绔篃涓嶅彲瑙併€?)) return;
  await deleteConsultation(item.id, user.id || 1);
  await load();
}
async function archive(item) {
  await archiveConsultation(item.id, user.id || 1);
  await load();
}
onMounted(load);
</script>