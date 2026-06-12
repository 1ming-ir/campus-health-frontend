<template>
  <div>
    <div class="page-head">
      <h1>药品信息</h1>
      <p>
        药品内容仅作健康科普，不作为诊断或开药依据。
      </p>
    </div>

    <div class="grid">
      <div
        class="card"
        v-for="m in medicines"
        :key="m.id"
      >
        <span class="tag">{{ m.category }}</span>
        <h3>{{ m.name }}</h3>
        <p>{{ m.usageInfo }}</p>
        <p class="muted">
          用药提醒：{{ m.caution }}
        </p>
        <p class="muted">
          处方药：{{ m.prescriptionRequired }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { listMedicines } from '../api'

const medicines = ref([])

onMounted(async () => {
  medicines.value = (await listMedicines()).data || []
})
</script>
