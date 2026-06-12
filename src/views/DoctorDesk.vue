<template>
  <div>
    <div class="page-head">
      <h1>{{ title }}</h1>
      <p>
        处理学生预约，查看 AI 初步建议，并填写医生补充意见。
      </p>
    </div>

    <div class="stats">
      <div class="stat">
        <strong>{{ appointments.length }}</strong>
        <span>预约记录</span>
      </div>
      <div class="stat">
        <strong>{{ pendingAppointments }}</strong>
        <span>待处理预约</span>
      </div>
      <div class="stat">
        <strong>{{ consultations.length }}</strong>
        <span>问诊记录</span>
      </div>
      <div class="stat">
        <strong>{{ waitingReply }}</strong>
        <span>待补充建议</span>
      </div>
    </div>

    <div v-if="view === 'home'" class="grid">
      <div class="card">
        <h3>预约处理</h3>
        <p class="muted">审核学生线上预约。</p>
        <RouterLink class="btn" to="/doctor/appointments">
          进入处理
        </RouterLink>
      </div>

      <div class="card">
        <h3>问诊复核</h3>
        <p class="muted">
          基于学生症状和 AI 建议填写医生补充意见。
        </p>
        <RouterLink class="btn" to="/doctor/consultations">
          进入复核
        </RouterLink>
      </div>
    </div>

    <div v-if="view === 'appointments'" class="card">
      <div class="toolbar">
        <h3>预约处理</h3>
        <select v-model="appointmentFilter">
          <option value="ALL">全部预约</option>
          <option value="PENDING">待审核</option>
          <option value="APPROVED">已通过</option>
          <option value="FINISHED">已完成</option>
        </select>
      </div>

      <div
        class="list-item"
        v-for="item in filteredAppointments"
        :key="item.id"
      >
        <strong>{{ item.studentName || '学生' }} - {{ item.reason }}</strong>
        <p class="muted">
          {{ item.appointmentDate }} {{ item.timeSlot }}；状态：{{ statusLabel(item.status) }}
        </p>

        <button class="btn secondary" @click="setAppointment(item.id, 'APPROVED')">
          通过
        </button>
        <button class="btn danger" @click="setAppointment(item.id, 'REJECTED')">
          拒绝
        </button>
        <button class="btn ghost" @click="setAppointment(item.id, 'FINISHED')">
          完成
        </button>
      </div>
    </div>

    <div v-if="view === 'consultations' || view === 'replies'" class="card">
      <div class="toolbar">
        <h3>{{ view === 'replies' ? '回复记录' : '问诊复核' }}</h3>
        <select v-model="consultationFilter">
          <option value="ALL">全部问诊</option>
          <option value="WAITING">待医生建议</option>
          <option value="REPLIED">已补充建议</option>
        </select>
      </div>

      <div
        class="list-item"
        v-for="item in filteredConsultations"
        :key="item.id"
      >
        <strong>{{ item.studentName || '学生' }}：{{ item.symptom }}</strong>

        <p class="muted">
          持续时间：{{ item.duration }}；严重程度：{{ item.severity }}；用药：{{ item.medicineUsed }} {{ item.medicineName || '' }}
        </p>

        <div class="advice-box compact">
          <p
            v-for="(line, idx) in adviceLines(item.aiAdvice)"
            :key="idx"
          >
            {{ line }}
          </p>
        </div>

        <textarea
          v-if="!item.doctorReply"
          v-model="replyText[item.id]"
          rows="3"
          placeholder="请填写医生补充建议，不能为空"
        ></textarea>

        <button
          v-if="!item.doctorReply"
          class="btn secondary"
          @click="saveReply(item.id)"
        >
          保存医生建议
        </button>

        <p class="error" v-if="replyError[item.id]">
          {{ replyError[item.id] }}
        </p>

        <p v-if="item.doctorReply" class="doctor-reply">
          <strong>已有医生建议：</strong>{{ item.doctorReply }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  listConsultations,
  listDoctorAppointments,
  replyConsultation,
  updateAppointmentStatus
} from '../api'
import { adviceLines, statusLabel } from '../utils'

const route = useRoute()

const view = computed(() => route.meta.view || 'home')

const title = computed(() =>
  view.value === 'appointments'
    ? '预约处理'
    : view.value === 'consultations'
      ? '问诊复核'
      : view.value === 'replies'
        ? '回复记录'
        : '医生工作台'
)

const appointments = ref([])
const consultations = ref([])
const appointmentFilter = ref('ALL')
const consultationFilter = ref('ALL')
const replyText = reactive({})
const replyError = reactive({})

const pendingAppointments = computed(() =>
  appointments.value.filter((item) => item.status === 'PENDING').length
)

const waitingReply = computed(() =>
  consultations.value.filter((item) => !item.doctorReply).length
)

const filteredAppointments = computed(() =>
  appointments.value.filter(
    (item) =>
      appointmentFilter.value === 'ALL' ||
      item.status === appointmentFilter.value
  )
)

const filteredConsultations = computed(() =>
  consultations.value.filter((item) => {
    if (view.value === 'replies') return Boolean(item.doctorReply)
    if (consultationFilter.value === 'WAITING') return !item.doctorReply
    if (consultationFilter.value === 'REPLIED') return Boolean(item.doctorReply)
    return true
  })
)

async function load() {
  appointments.value = (await listDoctorAppointments(1)).data || []
  consultations.value = (await listConsultations()).data || []
}

async function setAppointment(id, status) {
  await updateAppointmentStatus(id, status)
  await load()
}

async function saveReply(id) {
  replyError[id] = ''

  const text = (replyText[id] || '').trim()

  if (!text) {
    replyError[id] = '请填写医生补充建议后再保存。'
    return
  }

  const res = await replyConsultation(id, text, 1)

  if (res.code !== 0) {
    replyError[id] = res.message || '保存失败'
    return
  }

  replyText[id] = ''
  await load()
}

onMounted(load)
</script>
