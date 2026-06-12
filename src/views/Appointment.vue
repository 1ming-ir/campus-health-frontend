<template>
  <div class="page-head"><h1>鏍″尰闄㈤绾?/h1><p>閫夋嫨鏍″尰銆佹棩鏈熷拰鏃堕棿娈碉紝鎻愪氦棰勭害鍘熷洜銆?/p></div>
  <div class="grid two">
    <div class="card">
      <label>棰勭害鍖荤敓</label>
      <select v-model="form.doctorId"><option value="">璇烽€夋嫨鍖荤敓</option><option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.realName }} - {{ d.department }}</option></select>
      <label>棰勭害鏃ユ湡</label><input v-model="form.appointmentDate" type="date" :min="today">
      <label>鏃堕棿娈?/label><select v-model="form.timeSlot"><option>涓婂崍 09:00-10:00</option><option>涓婂崍 10:00-11:00</option><option>涓嬪崍 14:00-15:00</option></select>
      <label>棰勭害鍘熷洜</label><textarea v-model="form.reason" rows="4" placeholder="璇风畝瑕佽鏄庣棁鐘躲€佹寔缁椂闂村拰棰勭害鐩殑"></textarea>
      <button class="btn block" :disabled="loading" @click="submit">{{ loading ? '鎻愪氦涓?..' : '鎻愪氦棰勭害' }}</button>
      <p class="error" v-if="error">{{ error }}</p><p class="success" v-if="msg">{{ msg }}</p>
    </div>
    <div class="card"><h3>绱ф€ユ儏鍐垫€庝箞鍔烇紵</h3><p class="muted">鑻ュ嚭鐜板懠鍚稿洶闅俱€佹剰璇嗗紓甯搞€佸墽鐑堢柤鐥涚瓑鎯呭喌锛屽簲鐩存帴绾夸笅灏卞尰鎴栨嫧鎵撴€ユ晳鐢佃瘽锛屼笉绛夊緟绾夸笂棰勭害銆?/p></div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { createAppointment, listDoctors } from '../api';
import { currentUser } from '../utils';
const user = currentUser();
const today = new Date().toISOString().slice(0, 10);
const doctors = ref([]);
const loading = ref(false);
const error = ref('');
const msg = ref('');
const form = reactive({ studentId: user.id || 1, doctorId: '', appointmentDate: today, timeSlot: '涓婂崍 09:00-10:00', reason: '' });
async function submit() {
  error.value = ''; msg.value = '';
  if (!form.doctorId) return error.value = '璇烽€夋嫨鍖荤敓銆?;
  if (!form.appointmentDate || form.appointmentDate < today) return error.value = '璇烽€夋嫨浠婂ぉ鎴栦箣鍚庣殑棰勭害鏃ユ湡銆?;
  if (!form.reason.trim()) return error.value = '璇峰～鍐欓绾﹀師鍥犮€?;
  loading.value = true;
  try {
    const res = await createAppointment(form);
    if (res.code !== 0) return error.value = res.message || '棰勭害鎻愪氦澶辫触';
    msg.value = '棰勭害宸叉彁浜わ紝璇风瓑寰呭尰鐢熷鏍搞€?;
    form.reason = '';
  } catch { error.value = '棰勭害鏈嶅姟鏆傛椂涓嶅彲鐢ㄣ€?; } finally { loading.value = false; }
}
onMounted(async () => { doctors.value = (await listDoctors()).data || []; });
</script>