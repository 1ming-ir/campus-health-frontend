<template>
  <div class="page-head"><h1>{{ title }}</h1><p>缁存姢鐢ㄦ埛銆佸尰鐢熴€侀棶璇娿€侀绾︺€佺鏅€佽嵂鍝併€佸叕鍛婂拰缁熻鏁版嵁銆?/p></div>
  <div class="stats">
    <div class="stat"><strong>{{ overview.users || users.length }}</strong><span>绯荤粺鐢ㄦ埛</span></div>
    <div class="stat"><strong>{{ overview.doctors || doctors.length }}</strong><span>鍖荤敓妗ｆ</span></div>
    <div class="stat"><strong>{{ overview.consultations || consultations.length }}</strong><span>闂瘖璁板綍</span></div>
    <div class="stat"><strong>{{ overview.appointments || appointments.length }}</strong><span>棰勭害璁板綍</span></div>
  </div>
  <div class="card" v-if="view === 'home' || view === 'stats'"><h3>鏁版嵁缁熻</h3><div class="chart-row"><div v-for="item in statItems" :key="item.label" class="bar"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></div></div></div>
  <div class="card" v-if="view === 'users'"><div class="toolbar"><h3>鐢ㄦ埛绠＄悊</h3><span class="tag">鍚敤 / 绂佺敤</span></div><table class="table"><thead><tr><th>濮撳悕</th><th>璐﹀彿</th><th>瑙掕壊</th><th>瀛﹂櫌</th><th>鐘舵€?/th><th>鎿嶄綔</th></tr></thead><tbody><tr v-for="u in users" :key="u.id"><td>{{ u.realName }}</td><td>{{ u.username }}</td><td>{{ roleLabel(u.role) }}</td><td>{{ u.college || '-' }}</td><td>{{ statusLabel(u.status) }}</td><td><button class="btn ghost" @click="toggleUser(u)">{{ u.status === 'ENABLED' ? '绂佺敤' : '鍚敤' }}</button></td></tr></tbody></table></div>
  <div class="card" v-if="view === 'doctors'"><h3>鍖荤敓绠＄悊</h3><table class="table"><thead><tr><th>鍖荤敓</th><th>绉戝</th><th>鑱岀О</th><th>涓撻暱</th><th>鎺掔彮</th><th>鐘舵€?/th></tr></thead><tbody><tr v-for="d in doctors" :key="d.id"><td>{{ d.realName }}</td><td>{{ d.department }}</td><td>{{ d.title }}</td><td>{{ d.specialty }}</td><td>{{ d.scheduleText }}</td><td>{{ statusLabel(d.status) }}</td></tr></tbody></table></div>
  <div class="card" v-if="view === 'consultations'"><h3>闂瘖绠＄悊</h3><div class="list-item" v-for="c in consultations" :key="c.id"><strong>{{ c.studentName }}锛歿{ c.symptom }}</strong><p class="muted">鐘舵€侊細{{ statusLabel(c.status) }}锛涘尰鐢熷洖澶嶏細{{ c.doctorReply || '鏆傛棤' }}</p></div></div>
  <div class="card" v-if="view === 'appointments'"><h3>棰勭害绠＄悊</h3><div class="list-item" v-for="a in appointments" :key="a.id"><strong>{{ a.studentName }} 棰勭害 {{ a.doctorName }}</strong><p class="muted">{{ a.appointmentDate }} {{ a.timeSlot }}锛涚姸鎬侊細{{ statusLabel(a.status) }}锛涘師鍥狅細{{ a.reason }}</p></div></div>
  <div class="card" v-if="view === 'articles'"><h3>绉戞櫘绠＄悊</h3><div class="list-item" v-for="a in articles" :key="a.id"><strong>{{ a.title }}</strong><p class="muted">{{ a.category }}锛涚姸鎬侊細{{ statusLabel(a.status) }}</p><button class="btn ghost" @click="toggleArticle(a)">{{ a.status === 'PUBLISHED' ? '涓嬫灦' : '鍙戝竷' }}</button></div></div>
  <div class="card" v-if="view === 'medicines'"><h3>鑽搧绠＄悊</h3><div class="list-item" v-for="m in medicines" :key="m.id"><strong>{{ m.name }}</strong><p class="muted">{{ m.category }}锛泏{ m.caution }}</p></div></div>
  <div class="card" v-if="view === 'announcements'"><h3>鍏憡绠＄悊</h3><div class="list-item" v-for="a in announcements" :key="a.id"><strong>{{ a.title }}</strong><p class="muted">{{ a.type }}锛泏{ a.content }}</p></div></div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { adminOverview, listAdminAnnouncements, listAdminAppointments, listAdminArticles, listAdminConsultations, listAdminDoctors, listAdminMedicines, listAdminUsers, updateAdminArticleStatus, updateAdminUserStatus } from '../api';
import { statusLabel } from '../utils';
const route = useRoute();
const view = computed(() => route.meta.view || 'home');
const titles = { home: '绠＄悊棣栭〉', users: '鐢ㄦ埛绠＄悊', doctors: '鍖荤敓绠＄悊', consultations: '闂瘖绠＄悊', appointments: '棰勭害绠＄悊', articles: '绉戞櫘绠＄悊', medicines: '鑽搧绠＄悊', announcements: '鍏憡绠＄悊', stats: '鏁版嵁缁熻' };
const title = computed(() => titles[view.value] || '绠＄悊鍛樺悗鍙?);
const overview = ref({});
const users = ref([]); const doctors = ref([]); const articles = ref([]); const appointments = ref([]); const consultations = ref([]); const medicines = ref([]); const announcements = ref([]);
const statItems = computed(() => [
  { label: '鐢ㄦ埛', value: overview.value.users || users.value.length },
  { label: '鍖荤敓', value: overview.value.doctors || doctors.value.length },
  { label: '闂瘖', value: overview.value.consultations || consultations.value.length },
  { label: '棰勭害', value: overview.value.appointments || appointments.value.length },
  { label: '绉戞櫘', value: overview.value.articles || articles.value.length }
]);
function roleLabel(role) { return { STUDENT: '瀛︾敓', DOCTOR: '鍖荤敓', ADMIN: '绠＄悊鍛? }[role] || role; }
async function load() {
  try { overview.value = (await adminOverview()).data || {}; } catch {}
  try { users.value = (await listAdminUsers()).data || []; } catch {}
  try { doctors.value = (await listAdminDoctors()).data || []; } catch {}
  try { articles.value = (await listAdminArticles()).data || []; } catch {}
  try { appointments.value = (await listAdminAppointments()).data || []; } catch {}
  try { consultations.value = (await listAdminConsultations()).data || []; } catch {}
  try { medicines.value = (await listAdminMedicines()).data || []; } catch {}
  try { announcements.value = (await listAdminAnnouncements()).data || []; } catch {}
}
async function toggleUser(user) { await updateAdminUserStatus(user.id, user.status === 'ENABLED' ? 'DISABLED' : 'ENABLED'); await load(); }
async function toggleArticle(article) { await updateAdminArticleStatus(article.id, article.status === 'PUBLISHED' ? 'OFFLINE' : 'PUBLISHED'); await load(); }
watch(() => route.path, load);
onMounted(load);
</script>