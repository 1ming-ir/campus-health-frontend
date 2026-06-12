<template>
  <div>
    <div class="page-head">
      <h1>我的问诊记录</h1>
      <p>
        未回复记录可删除；医生已回复记录可归档隐藏，保留服务链路可追溯。
      </p>
    </div>

    <div class="card">
      <p class="empty" v-if="records.length === 0">
        暂无问诊记录。
      </p>

      <article
        class="record-card"
        v-for="item in records"
        :key="item.id"
      >
        <div class="toolbar">
          <strong>{{ item.symptom }}</strong>
          <span class="tag">{{ statusLabel(item.status) }}</span>
        </div>

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

        <p v-if="item.doctorReply" class="doctor-reply">
          <strong>医生补充：</strong>{{ item.doctorReply }}
        </p>

        <button
          v-if="!item.doctorReply"
          class="btn danger"
          @click="remove(item)"
        >
          删除误提交
        </button>

        <button
          v-else
          class="btn ghost"
          @click="archive(item)"
        >
          归档记录
        </button>
      </article>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  archiveConsultation,
  deleteConsultation,
  listMyConsultations
} from '../api'
import {
  adviceLines,
  currentUser,
  statusLabel
} from '../utils'

const user = currentUser()
const records = ref([])

async function load() {
  records.value = (await listMyConsultations(user.id || 1)).data || []
}

async function remove(item) {
  const ok = confirm(
    '确认删除这条未回复问诊记录吗？删除后医生端也不可见。'
  )

  if (!ok) return

  await deleteConsultation(item.id, user.id || 1)
  await load()
}

async function archive(item) {
  await archiveConsultation(item.id, user.id || 1)
  await load()
}

onMounted(load)
</script>
