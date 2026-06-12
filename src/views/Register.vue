<template>
  <section class="login-page">
    <div class="login-hero">
      <span class="eyebrow">瀛︾敓娉ㄥ唽</span>
      <h1>鍒涘缓瀛︾敓璐﹀彿</h1>
      <p>娉ㄥ唽鍏ュ彛浠呴潰鍚戝鐢熴€傚尰鐢熷拰绠＄悊鍛樿处鍙风敱绠＄悊鍛樼粺涓€缁存姢锛岄伩鍏嶆潈闄愰闄┿€?/p>
    </div>
    <form class="login-panel" @submit.prevent="submit">
      <h2>瀛︾敓娉ㄥ唽</h2>
      <label>瀛﹀彿</label><input v-model.trim="form.username" placeholder="璇疯緭鍏ュ鍙?>
      <label>濮撳悕</label><input v-model.trim="form.realName" placeholder="璇疯緭鍏ュ鍚?>
      <label>瀛﹂櫌</label><input v-model.trim="form.college" placeholder="璇疯緭鍏ュ闄?>
      <label>鐝骇</label><input v-model.trim="form.className" placeholder="璇疯緭鍏ョ彮绾?>
      <label>鎵嬫満鍙?/label><input v-model.trim="form.phone" placeholder="璇疯緭鍏ユ墜鏈哄彿">
      <label>瀵嗙爜</label><input v-model="form.password" type="password" placeholder="璇疯緭鍏ュ瘑鐮?>
      <label>纭瀵嗙爜</label><input v-model="form.confirmPassword" type="password" placeholder="璇峰啀娆¤緭鍏ュ瘑鐮?>
      <button class="btn block" :disabled="loading">{{ loading ? '娉ㄥ唽涓?..' : '娉ㄥ唽骞剁櫥褰? }}</button>
      <p class="error" v-if="message">{{ message }}</p>
      <RouterLink class="muted link" to="/">宸叉湁璐﹀彿锛熻繑鍥炵櫥褰?/RouterLink>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerStudent } from '../api';

const router = useRouter();
const loading = ref(false);
const message = ref('');
const form = reactive({ username: '', realName: '', college: '', className: '', phone: '', password: '', confirmPassword: '' });

async function submit() {
  message.value = '';
  if (!form.username || !form.realName || !form.password || !form.confirmPassword) {
    message.value = '璇峰～鍐欏鍙枫€佸鍚嶃€佸瘑鐮佸拰纭瀵嗙爜銆?;
    return;
  }
  if (form.password !== form.confirmPassword) {
    message.value = '涓ゆ杈撳叆鐨勫瘑鐮佷笉涓€鑷淬€?;
    return;
  }
  loading.value = true;
  try {
    const res = await registerStudent(form);
    if (res.code !== 0) {
      message.value = res.message || '娉ㄥ唽澶辫触';
      return;
    }
    localStorage.setItem('user', JSON.stringify(res.data));
    localStorage.setItem('role', res.data.role);
    router.push('/student');
  } catch (e) {
    message.value = '娉ㄥ唽鏈嶅姟鏆傛椂涓嶅彲鐢紝璇风◢鍚庨噸璇曘€?;
  } finally {
    loading.value = false;
  }
}
</script>