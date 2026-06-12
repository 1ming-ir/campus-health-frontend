<template>
  <div class="page-head"><h1>鏍″尰淇℃伅</h1><p>鏌ョ湅鏍″尰璧勬枡銆佹搮闀挎柟鍚戝拰鍧愯瘖鏃堕棿锛屽啀閫夋嫨鍚堥€傚尰鐢熼绾︺€?/p></div>
  <div class="grid">
    <div class="card" v-for="doctor in doctors" :key="doctor.id">
      <span class="tag">{{ doctor.department }}</span>
      <h3>{{ doctor.realName }}</h3>
      <p class="muted">{{ doctor.title }}锛泏{ doctor.specialty }}</p>
      <p>{{ doctor.scheduleText }}</p>
      <RouterLink class="btn" to="/appointment">棰勭害璇ュ尰鐢?/RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { listDoctors } from '../api';
const doctors = ref([]);
onMounted(async () => { doctors.value = (await listDoctors()).data || []; });
</script>