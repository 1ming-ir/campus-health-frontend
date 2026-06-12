<template>
  <div class="page-head"><h1>鑽搧淇℃伅</h1><p>鑽搧鍐呭浠呬綔鍋ュ悍绉戞櫘锛屼笉浣滀负璇婃柇鎴栧紑鑽緷鎹€?/p></div>
  <div class="grid">
    <div class="card" v-for="m in medicines" :key="m.id">
      <span class="tag">{{ m.category }}</span><h3>{{ m.name }}</h3>
      <p>{{ m.usageInfo }}</p><p class="muted">鐢ㄨ嵂鎻愰啋锛歿{ m.caution }}</p><p class="muted">澶勬柟鑽細{{ m.prescriptionRequired }}</p>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { listMedicines } from '../api';
const medicines = ref([]);
onMounted(async () => { medicines.value = (await listMedicines()).data || []; });
</script>