<template>
  <div class="page-head">
    <h1>疾病科普</h1>
    <p>查看校园常见健康问题的预防和护理知识。</p>
  </div>
  <p class="error" v-if="error">{{ error }}</p>
  <div class="grid">
    <div class="card" v-for="a in articles" :key="a.id || a.title">
      <span class="tag">{{ a.category }}</span>
      <h3>{{ a.title }}</h3>
      <p class="muted">{{ a.summary }}</p>
      <p>{{ a.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listArticles } from '../api';

const fallbackArticles = [
  { id: 1, category: '呼吸道', title: '普通感冒护理', summary: '休息、补水、观察体温。', content: '如持续高热、胸闷或症状明显加重，请及时线下就医。' }
];
const articles = ref(fallbackArticles);
const error = ref('');

onMounted(async () => {
  try {
    const res = await listArticles();
    if (res.code !== 0) {
      error.value = res.message || '科普内容加载失败。';
      return;
    }
    articles.value = res.data?.length ? res.data : fallbackArticles;
  } catch (e) {
    error.value = '科普服务暂时不可用，当前展示本地备用内容。';
  }
});
</script>
