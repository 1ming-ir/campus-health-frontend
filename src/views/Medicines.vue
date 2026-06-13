<template>
  <div class="page-head"><h1>药品信息</h1><p>展示校医院常见药品信息，仅作科普，不提供自行诊断和自行用药建议。</p></div>
  <div class="grid">
    <article class="card clickable" v-for="item in medicines" :key="item.id" @click="selected = item">
      <div class="toolbar"><h3>{{ item.name }}</h3><span class="tag">{{ item.prescriptionRequired }}</span></div>
      <p class="muted">{{ item.category }}</p><p>{{ shortText(item.usageInfo, 100) }}</p>
    </article>
  </div>
  <p class="empty" v-if="medicines.length === 0">暂无药品信息。</p>
  <div v-if="selected" class="modal-mask" @click.self="selected = null"><div class="modal"><div class="toolbar"><h3>{{ selected.name }}</h3><button class="btn ghost" @click="selected = null">关闭</button></div><p><strong>分类：</strong>{{ selected.category }}</p><p><strong>用法说明：</strong>{{ selected.usageInfo }}</p><p><strong>注意事项：</strong>{{ selected.caution }}</p><p><strong>是否处方药：</strong>{{ selected.prescriptionRequired }}</p></div></div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { listMedicines } from '../api';
import { shortText } from '../utils';
const medicines = ref([]);
const selected = ref(null);
onMounted(async () => { medicines.value = (await listMedicines()).data || []; });
</script>