<template>
  <div>
    <div class="page-head">
      <h1>我的预约</h1>
      <p>
        查看校医院预约状态，未处理预约可取消。
      </p>
    </div>

    <div class="card">
      <p class="empty" v-if="appointments.length === 0">
        暂无预约记录。
      </p>

      <div
        class="list-item"
        v-for="item in appointments"
        :key="item.id"
      >
        <strong>{{ item.appointmentDate }} {{ item.timeSlot }}</strong>

        <p class="muted">
          医生：{{ item.doctorName || item.doctorId }}；状态：{{ statusLabel(item.status) }}；原因：{{ item.reason }}
        </p>

        <button
          v-if="item.status === 'PENDING' || item.status === 'APPROVED'"
          class="btn ghost"
          @click="cancel(item.id)"
        >
          取消预约
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { listMyAppointments, updateAppointmentStatus } from '../api'
import { currentUser, statusLabel } from '../utils'

const user = currentUser()
const appointments = ref([])

async function load() {
  appointments.value = (await listMyAppointments(user.id || 1)).data || []
}

async function cancel(id) {
  await updateAppointmentStatus(id, 'CANCELLED')
  await load()
}

onMounted(load)
</script>
