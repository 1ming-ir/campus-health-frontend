<template>
  <div class="page-head"><h1>涓汉涓績</h1><p>缁存姢鍩虹璧勬枡銆佽繃鏁忓彶鍜屾棦寰€鐥呭彶锛屼究浜庡尰鐢熶簡瑙ｆ儏鍐点€?/p></div>
  <div class="card">
    <div class="form-grid"><div><label>濮撳悕</label><input v-model="form.realName"></div><div><label>鎵嬫満鍙?/label><input v-model="form.phone"></div></div>
    <div class="form-grid"><div><label>瀛﹂櫌</label><input v-model="form.college"></div><div><label>鐝骇</label><input v-model="form.className"></div></div>
    <div class="form-grid"><div><label>鎬у埆</label><input v-model="form.gender"></div><div><label>骞撮緞</label><input v-model.number="form.age" type="number"></div></div>
    <label>杩囨晱鍙?/label><input v-model="form.allergyHistory" placeholder="渚嬪锛氶潚闇夌礌杩囨晱锛屾棤鍒欏～鏃?>
    <label>鏃㈠線鐥呭彶</label><input v-model="form.medicalHistory" placeholder="渚嬪锛氬摦鍠橈紝鏃犲垯濉棤">
    <label>绱ф€ヨ仈绯讳汉</label><input v-model="form.emergencyContact" placeholder="濮撳悕鍜岃仈绯荤數璇?>
    <button class="btn" @click="save">淇濆瓨璧勬枡</button>
    <p class="success" v-if="msg">{{ msg }}</p>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getMe, updateProfile } from '../api';
import { currentUser } from '../utils';
const user = currentUser();
const msg = ref('');
const form = reactive({ id: user.id, username: user.username, realName: '', phone: '', college: '', className: '', gender: '', age: '', allergyHistory: '', medicalHistory: '', emergencyContact: '' });
onMounted(async () => { const res = await getMe(user.username); Object.assign(form, res.data || {}); });
async function save() { await updateProfile(form); msg.value = '璧勬枡宸蹭繚瀛?; }
</script>