<template>
  <div class="page-head"><h1>鍋ュ悍绉戞櫘</h1><p>鏌ョ湅鏍″洯甯歌鍋ュ悍闂鐨勯闃插拰鎶ょ悊鐭ヨ瘑銆?/p></div>
  <p class="error" v-if="error">{{ error }}</p>
  <div class="grid">
    <div class="card" v-for="a in articles" :key="a.id || a.title">
      <span class="tag">{{ a.category }}</span><h3>{{ a.title }}</h3><p class="muted">{{ a.summary }}</p><p>{{ a.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { listArticles } from '../api';
const articles = ref([]);
const error = ref('');
onMounted(async () => {
  try { articles.value = (await listArticles()).data || []; } catch { error.value = '绉戞櫘鏈嶅姟鏆傛椂涓嶅彲鐢ㄣ€?; }
});
</script>