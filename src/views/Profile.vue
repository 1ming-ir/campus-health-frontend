<template>
  <div class="page-head"><h1>个人中心</h1><p>维护基本联系信息和健康档案，医生资料会用于学生端展示。</p></div>
  <form class="card form-card" @submit.prevent="save">
    <div class="form-row"><div><label>姓名</label><input v-model.trim="form.realName"></div><div><label>手机号</label><input v-model.trim="form.phone"></div></div>
    <template v-if="user.role === 'STUDENT'">
      <div class="form-row"><div><label>学院</label><input v-model.trim="form.college"></div><div><label>班级</label><input v-model.trim="form.className"></div></div>
      <div class="form-row"><div><label>性别</label><input v-model.trim="form.gender"></div><div><label>年龄</label><input v-model.number="form.age" type="number"></div></div>
      <label>过敏史</label><input v-model.trim="form.allergyHistory">
      <label>既往病史</label><input v-model.trim="form.medicalHistory">
      <label>紧急联系人</label><input v-model.trim="form.emergencyContact">
    </template>
    <p class="muted" v-if="user.role !== 'STUDENT'">医生科室、职称、专长和排班请由管理员在医生管理中维护。</p>
    <button class="btn" :disabled="loading">{{ loading ? '保存中...' : '保存信息' }}</button>
    <p class="error" v-if="message">{{ message }}</p>
  </form>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getMe, updateProfile } from '../api';
import { currentUser, setCurrentUser } from '../utils';
const user = currentUser();
const loading = ref(false);
const message = ref('');
const form = reactive({ id: user.id, realName: '', phone: '', college: '', className: '', gender: '', age: null, allergyHistory: '', medicalHistory: '', emergencyContact: '' });
onMounted(async () => { const res = await getMe(user.username); Object.assign(form, res.data || {}); });
async function save() {
  message.value = ''; loading.value = true;
  try {
    const res = await updateProfile(form);
    if (res.code !== 0) { message.value = res.message || '保存失败'; return; }
    setCurrentUser({ ...user, realName: res.data.realName });
    message.value = '保存成功';
  } catch (e) { message.value = '保存失败，请稍后重试'; } finally { loading.value = false; }
}
</script>