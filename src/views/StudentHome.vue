<template>
  <div>
    <div class="page-head">
      <h1>学生首页</h1>

      <p>
        完成健康咨询、校医院预约、医生复核和科普学习的校园健康服务闭环。
      </p>
    </div>

    <div class="stats">
      <div class="stat">
        <strong>{{ consultations.length }}</strong>
        <span>问诊记录</span>
      </div>

      <div class="stat">
        <strong>{{ appointments.length }}</strong>
        <span>预约记录</span>
      </div>

      <div class="stat">
        <strong>{{ doctors.length }}</strong>
        <span>可预约校医</span>
      </div>

      <div class="stat">
        <strong>{{ announcements.length }}</strong>
        <span>健康公告</span>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <span class="tag">第一步</span>
        <h3>AI 问诊</h3>
        <p class="muted">
          填写完整症状信息，获取初步健康建议。
        </p>
        <RouterLink class="btn" to="/consult">
          开始问诊
        </RouterLink>
      </div>

      <div class="card">
        <span class="tag">第二步</span>
        <h3>校医院预约</h3>
        <p class="muted">
          选择校医和时间段，提交预约原因。
        </p>
        <RouterLink class="btn" to="/appointment">
          提交预约
        </RouterLink>
      </div>

      <div class="card">
        <span class="tag">日常支持</span>
        <h3>健康科普</h3>
        <p class="muted">
          查看校园常见健康问题和用药科普。
        </p>
        <RouterLink class="btn" to="/articles">
          查看科普
        </RouterLink>
      </div>
    </div>

    <div class="card">
      <div class="toolbar">
        <h3>最新公告</h3>

        <RouterLink class="btn ghost" to="/articles">
          查看科普
        </RouterLink>
      </div>

      <p class="empty" v-if="announcements.length === 0">
        暂无公告。
      </p>

      <div
        class="list-item"
        v-for="item in announcements.slice(0, 3)"
        :key="item.id"
      >
        <strong>{{ item.title }}</strong>

        <p class="muted">
          {{ item.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  listAnnouncements,
  listDoctors,
  listMyAppointments,
  listMyConsultations
} from '../api'
import { currentUser } from '../utils'

const user = currentUser()

const consultations = ref([])
const appointments = ref([])
const doctors = ref([])
const announcements = ref([])

onMounted(async () => {
  try {
    consultations.value =
      (await listMyConsultations(user.id || 1)).data || []
  } catch {}

  try {
    appointments.value =
      (await listMyAppointments(user.id || 1)).data || []
  } catch {}

  try {
    doctors.value =
      (await listDoctors()).data || []
  } catch {}

  try {
    announcements.value =
      (await listAnnouncements()).data || []
  } catch {}
})
</script>
