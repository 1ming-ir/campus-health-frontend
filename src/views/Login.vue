<template>
  <section class="login-page">
    <div class="login-hero">
      <span class="eyebrow">鏍″尰闄㈢嚎涓婃湇鍔?/span>
      <h1>鏍″洯鍋ュ悍闂瘖涓庡挩璇㈢郴缁?/h1>
      <p>瀛︾敓銆佸尰鐢熷拰绠＄悊鍛樼粺涓€浠庤繖閲岀櫥褰曘€傝閫夋嫨韬唤骞惰緭鍏ユ湰浜鸿处鍙峰瘑鐮併€?/p>
      <div class="login-status">
        <div><strong>瀛︾敓绔?/strong><span>闂瘖銆侀绾︺€佹煡鐪嬬鏅?/span></div>
        <div><strong>鍖荤敓绔?/strong><span>澶勭悊棰勭害銆佽ˉ鍏呭缓璁?/span></div>
        <div><strong>绠＄悊绔?/strong><span>缁存姢璐﹀彿銆佸尰鐢熷拰绉戞櫘鍐呭</span></div>
      </div>
    </div>
    <form class="login-panel" @submit.prevent="go">
      <h2>鐧诲綍宸ヤ綔鍙?/h2>
      <p class="muted">绯荤粺浼氭牴鎹墍閫夎韩浠借繘鍏ュ搴斿伐浣滃彴锛屽苟闅愯棌鏃犲叧鍔熻兘銆?/p>
      <div class="role-picker">
        <button v-for="item in roles" :key="item.value" type="button" :class="['role-card', { active: role === item.value }]" @click="role = item.value">
          <strong>{{ item.label }}</strong><span>{{ item.desc }}</span>
        </button>
      </div>
      <label>璐﹀彿</label>
      <input v-model.trim="username" autocomplete="username" :placeholder="placeholder">
      <label>瀵嗙爜</label>
      <input v-model="password" type="password" autocomplete="current-password" placeholder="璇疯緭鍏ュ瘑鐮?>
      <button class="btn block" :disabled="loading">{{ loading ? '鐧诲綍涓?..' : '鐧诲綍' }}</button>
      <p class="error" v-if="message">{{ message }}</p>
      <RouterLink class="muted link" to="/register">瀛︾敓杩樻病鏈夎处鍙凤紵鍘绘敞鍐?/RouterLink>
    </form>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api';

const roles = [
  { value: 'STUDENT', label: '瀛︾敓绔?, desc: '闂瘖銆侀绾︺€佺鏅?, placeholder: '璇疯緭鍏ュ鍙锋垨瀛︾敓璐﹀彿' },
  { value: 'DOCTOR', label: '鍖荤敓绔?, desc: '澶勭悊棰勭害鍜岃ˉ鍏呭缓璁?, placeholder: '璇疯緭鍏ュ尰鐢熻处鍙? },
  { value: 'ADMIN', label: '绠＄悊绔?, desc: '鐢ㄦ埛銆佸尰鐢熴€佺鏅鐞?, placeholder: '璇疯緭鍏ョ鐞嗗憳璐﹀彿' }
];
const username = ref('');
const password = ref('');
const role = ref('STUDENT');
const message = ref('');
const loading = ref(false);
const router = useRouter();
const placeholder = computed(() => roles.find((item) => item.value === role.value)?.placeholder || '璇疯緭鍏ヨ处鍙?);

async function go() {
  message.value = '';
  if (!username.value || !password.value) {
    message.value = '璇疯緭鍏ヨ处鍙峰拰瀵嗙爜銆?;
    return;
  }
  loading.value = true;
  try {
    const res = await login({ username: username.value, password: password.value, role: role.value });
    if (res.code !== 0) {
      message.value = res.message || '鐧诲綍澶辫触';
      return;
    }
    localStorage.setItem('user', JSON.stringify(res.data));
    localStorage.setItem('role', res.data.role);
    router.push(res.data.role === 'STUDENT' ? '/student' : res.data.role === 'DOCTOR' ? '/doctor' : '/admin');
  } catch (e) {
    message.value = '鍚庣鏈嶅姟鏆傛椂涓嶅彲鐢紝璇疯仈绯荤鐞嗗憳妫€鏌ユ湇鍔＄姸鎬併€?;
  } finally {
    loading.value = false;
  }
}
</script>