<template>
  <div>
    <div class="page-head">
      <h1>校医院预约</h1>
      <p>
        选择校医、日期和时间段，提交预约原因。
      </p>
    </div>

    <div class="grid two">
      <div class="card">
        <label>预约医生</label>
        <select v-model="form.doctorId">
          <option value="">请选择医生</option>
          <option
            v-for="d in doctors"
            :key="d.id"
            :value="d.id"
          >
            {{ d.realName }} - {{ d.department }}
          </option>
        </select>

        <label>预约日期</label>
        <input
          v-model="form.appointmentDate"
          type="date"
          :min="today"
        />

        <label>时间段</label>
        <select v-model="form.timeSlot">
          <option>上午 09:00-10:00</option>
          <option>上午 10:00-11:00</option>
          <option>下午 14:00-15:00</option>
        </select>

        <label>预约原因</label>
        <textarea
          v-model="form.reason"
          rows="4"
          placeholder="请简要说明症状、持续时间和预约目的"
        ></textarea>

        <button class="btn block" :disabled="loading" @click="submit">
          {{ loading ? '提交中...' : '提交预约' }}
        </button>

        <p class="error" v-if="error">
          {{ error }}
        </p>

        <p class="success" v-if="msg">
          {{ msg }}
        </p>
      </div>

      <div class="card">
        <h3>紧急情况怎么办？</h3>
        <p class="muted">
          若出现呼吸困难、意识异常、剧烈疼痛等情况，应直接线下就医或拨打急救电话，不等待线上预约。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { createAppointment, listDoctors } from '../api'
import { currentUser } from '../utils'

const user = currentUser()
const today = new Date().toISOString().slice(0, 10)

const doctors = ref([])
const loading = ref(false)
const error = ref('')
const msg = ref('')

const form = reactive({
  studentId: user.id || 1,
  doctorId: '',
  appointmentDate: today,
  timeSlot: '上午 09:00-10:00',
  reason: ''
})

async function submit() {
  error.value = ''
  msg.value = ''

  if (!form.doctorId) {
    error.value = '请选择医生。'
    return
  }

  if (!form.appointmentDate || form.appointmentDate < today) {
    error.value = '请选择今天或之后的预约日期。'
    return
  }

  if (!form.reason.trim()) {
    error.value = '请填写预约原因。'
    return
  }

  loading.value = true

  try {
    const res = await createAppointment(form)

    if (res.code !== 0) {
      error.value = res.message || '预约提交失败'
      return
    }

    msg.value = '预约已提交，请等待医生审核。'
    form.reason = ''
  } catch {
    error.value = '预约服务暂时不可用。'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  doctors.value = (await listDoctors()).data || []
})
</script>
