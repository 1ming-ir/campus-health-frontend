<template>
  <div class="page-head"><h1>校医院预约</h1><p>选择校医和时间段，提交预约原因，等待医生审核。</p></div>
  <div class="two-col">
    <form class="card" @submit.prevent="submit">
      <h3>预约信息</h3>
      <label>选择医生 *</label><select v-model="form.doctorId"><option value="">请选择医生</option><option v-for="d in enabledDoctors" :key="d.id" :value="d.id">{{ d.realName }} - {{ d.department }} - {{ d.title }}</option></select>
      <label>预约日期 *</label><input v-model="form.appointmentDate" type="date">
      <label>时间段 *</label><select v-model="form.timeSlot"><option value="">请选择时间段</option><option v-for="slot in slots" :key="slot">{{ slot }}</option></select>
      <label>预约原因 *</label><textarea v-model.trim="form.reason" rows="5" placeholder="请简要说明症状、持续时间和预约目的"></textarea>
      <button class="btn block" :disabled="loading">{{ loading ? '提交中...' : '提交预约' }}</button>
      <p class="error" v-if="message">{{ message }}</p>
    </form>
    <aside class="stack"><div class="card"><h3>预约提示</h3><ul><li>普通症状可先线上咨询。</li><li>紧急情况应直接线下就医。</li><li>预约提交后等待医生审核。</li></ul></div></aside>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createAppointment, listDoctors } from '../api';
import { currentUser } from '../utils';
const router = useRouter();
const user = currentUser();
const loading = ref(false);
const message = ref('');
const doctors = ref([]);
const enabledDoctors = computed(() => doctors.value.filter((item) => item.status === 'ENABLED'));
const slots = ['上午 09:00-10:00', '上午 10:00-11:00', '下午 14:00-15:00', '下午 15:00-16:00', '下午 16:00-17:00'];
const form = reactive({ doctorId: '', appointmentDate: '', timeSlot: '', reason: '' });
async function submit() {
  message.value = '';
  if (!form.doctorId || !form.appointmentDate || !form.timeSlot || !form.reason || form.reason.length < 5) {
    message.value = '请完整填写医生、日期、时间段和至少 5 个字的预约原因';
    return;
  }
  loading.value = true;
  try {
    const res = await createAppointment({ ...form, doctorId: Number(form.doctorId), studentId: user.id });
    if (res.code !== 0) { message.value = res.message || '预约提交失败'; return; }
    router.push('/my-appointments');
  } catch (e) { message.value = '预约提交失败，请稍后重试'; } finally { loading.value = false; }
}
onMounted(async () => { doctors.value = (await listDoctors()).data || []; });
</script>