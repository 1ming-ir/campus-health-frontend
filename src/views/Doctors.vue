<template>
  <div>
    <div class="page-head">
      <h1>校医信息</h1>
      <p>
        查看校医资料、擅长方向和坐诊时间，再选择合适医生预约。
      </p>
    </div>

    <div class="grid">
      <div
        class="card"
        v-for="doctor in doctors"
        :key="doctor.id"
      >
        <span class="tag">{{ doctor.department }}</span>
        <h3>{{ doctor.realName }}</h3>
        <p class="muted">
          {{ doctor.title }}：{{ doctor.specialty }}
        </p>
        <p>{{ doctor.scheduleText }}</p>
        <RouterLink class="btn" to="/appointment">
          预约该医生
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { listDoctors } from '../api'

const doctors = ref([])

onMounted(async () => {
  doctors.value = (await listDoctors()).data || []
})
</script>
