<template>
  <div class="page-head">
    <h1>瀛︾敓棣栭〉</h1>
    <p>瀹屾垚鍋ュ悍鍜ㄨ銆佹牎鍖婚櫌棰勭害銆佸尰鐢熷鏍稿拰绉戞櫘瀛︿範鐨勬牎鍥仴搴锋湇鍔￠棴鐜€?/p>
  </div>
  <div class="stats">
    <div class="stat"><strong>{{ consultations.length }}</strong><span>闂瘖璁板綍</span></div>
    <div class="stat"><strong>{{ appointments.length }}</strong><span>棰勭害璁板綍</span></div>
    <div class="stat"><strong>{{ doctors.length }}</strong><span>鍙绾︽牎鍖?/span></div>
    <div class="stat"><strong>{{ announcements.length }}</strong><span>鍋ュ悍鍏憡</span></div>
  </div>
  <div class="grid">
    <div class="card"><span class="tag">绗竴姝?/span><h3>AI 闂瘖</h3><p class="muted">濉啓瀹屾暣鐥囩姸淇℃伅锛岃幏鍙栧垵姝ュ仴搴峰缓璁€?/p><RouterLink class="btn" to="/consult">寮€濮嬮棶璇?/RouterLink></div>
    <div class="card"><span class="tag">绗簩姝?/span><h3>鏍″尰闄㈤绾?/h3><p class="muted">閫夋嫨鏍″尰鍜屾椂闂存锛屾彁浜ら绾﹀師鍥犮€?/p><RouterLink class="btn" to="/appointment">鎻愪氦棰勭害</RouterLink></div>
    <div class="card"><span class="tag">鏃ュ父鏀寔</span><h3>鍋ュ悍绉戞櫘</h3><p class="muted">鏌ョ湅鏍″洯甯歌鍋ュ悍闂鍜岀敤鑽鏅€?/p><RouterLink class="btn" to="/articles">鏌ョ湅绉戞櫘</RouterLink></div>
  </div>
  <div class="card">
    <div class="toolbar"><h3>鏈€鏂板叕鍛?/h3><RouterLink class="btn ghost" to="/articles">鏌ョ湅绉戞櫘</RouterLink></div>
    <p class="empty" v-if="announcements.length === 0">鏆傛棤鍏憡銆?/p>
    <div class="list-item" v-for="item in announcements.slice(0, 3)" :key="item.id">
      <strong>{{ item.title }}</strong><p class="muted">{{ item.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { listAnnouncements, listDoctors, listMyAppointments, listMyConsultations } from '../api';
import { currentUser } from '../utils';

const user = currentUser();
const consultations = ref([]);
const appointments = ref([]);
const doctors = ref([]);
const announcements = ref([]);

onMounted(async () => {
  try { consultations.value = (await listMyConsultations(user.id || 1)).data || []; } catch {}
  try { appointments.value = (await listMyAppointments(user.id || 1)).data || []; } catch {}
  try { doctors.value = (await listDoctors()).data || []; } catch {}
  try { announcements.value = (await listAnnouncements()).data || []; } catch {}
});
</script>