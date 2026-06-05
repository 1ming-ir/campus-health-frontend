<template>
  <h1>疾病科普</h1>
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

const articles = ref([
  { id: 1, category: '呼吸道', title: '普通感冒护理', summary: '休息、补水、观察体温。', content: '如持续高热请及时就医。' }
]);

onMounted(async () => {
  try {
    const res = await listArticles();
    articles.value = res.data || articles.value;
  } catch (e) {}
});
</script>
