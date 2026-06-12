<template>
  <div class="page-head">
    <h1>校医院预约</h1>
    <p>将问诊后的就医需求转成预约记录，方便医生提前了解学生情况。</p>
  </div>
  <div class="grid two">
    <div class="card">
      <h3>提交预约</h3>
      <label>医生 ID</label>
      <input v-model="form.doctorId" type="number" min="1" placeholder="请输入医生 ID，例如 1">
      <label>预约日期</label>
      <input v-model="form.appointmentDate" type="date" :min="today">
      <label>时间段</label>
      <select v-model="form.timeSlot">
        <option>上午 09:00-10:00</option>
        <option>上午 10:00-11:00</option>
        <option>下午 14:00-15:00</option>
      </select>
      <label>预约原因</label>
      <textarea v-model="form.reason" rows="4" placeholder="请简要说明症状、持续时间和预约目的"></textarea>
      <button class="btn block" :disabled="submitting" @click="submit">{{ submitting ? '提交中...' : '提交预约' }}</button>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="msg">{{ msg }}</p>
    </div>
    <div class="card">
      <h3>预约说明</h3>
      <div class="reason-card">
        <p><strong>为什么要预约？</strong></p>
        <p class="muted">预约记录会把学生就医原因结构化，医生端可以提前看到，减少现场重复沟通。</p>
      </div>
      <div class="reason-card">
        <p><strong>紧急情况怎么办？</strong></p>
        <p class="muted">若出现呼吸困难、意识异常、剧烈疼痛等情况，应直接线下就医或拨打急救电话，不等待线上预约。</p>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="toolbar"><h3>我的预约</h3><span class="muted">{{ appointments.length }} 条</span></div>
    <p class="empty" v-if="appointments.length === 0">暂无预约记录。</p>
    <div class="list-item" v-for="item in appointments" :key="item.id">
      <strong>{{ item.appointmentDate }} {{ item.timeSlot }}</strong>
      <p class="muted">医生：{{ item.doctorName || item.doctorId }}；状态：{{ item.status }}；原因：{{ item.reason }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { createAppointment, listMyAppointments } from '../api';

const user = JSON.parse(localStorage.getItem('user') || '{}');
const today = new Date().toISOString().slice(0, 10);
const form = reactive({ studentId: user.id || 1, doctorId: 1, appointmentDate: today, timeSlot: '上午 09:00-10:00', reason: '' });
const msg = ref('');
const error = ref('');
const submitting = ref(false);
const appointments = ref([]);

async function loadAppointments() {
  const res = await listMyAppointments(user.id || 1);
  appointments.value = res.data || [];
}

async function submit() {
  error.value = '';
  msg.value = '';
  if (!form.doctorId) {
    error.value = '请填写医生 ID。';
    return;
  }
  if (!form.appointmentDate || form.appointmentDate < today) {
    error.value = '请选择今天或之后的预约日期。';
    return;
  }
  if (!form.reason.trim()) {
    error.value = '请填写预约原因，方便医生提前判断。';
    return;
  }
  submitting.value = true;
  try {
    const res = await createAppointment(form);
    if (res.code !== 0) {
      error.value = res.message || '预约提交失败';
      return;
    }
    msg.value = '预约已提交';
    form.reason = '';
    await loadAppointments();
  } catch (e) {
    error.value = '预约服务暂时不可用，请联系管理员检查后端服务。';
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  try { await loadAppointments(); } catch (e) { appointments.value = []; }
});
</script>
