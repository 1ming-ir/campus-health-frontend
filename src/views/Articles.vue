<template>
  <div class="page-head"><h1>健康科普</h1><p>查看校园常见健康知识、疾病预防、日常护理和用药常识。</p></div>
  <div class="grid">
    <article class="card clickable" v-for="item in articles" :key="item.id" @click="selected = item">
      <span class="tag">{{ item.category }}</span><h3>{{ item.title }}</h3><p class="muted">{{ item.summary }}</p>
    </article>
  </div>
  <p class="empty" v-if="articles.length === 0">暂无健康科普。</p>
  <div v-if="selected" class="modal-mask" @click.self="selected = null"><div class="modal wide"><div class="toolbar"><h3>{{ selected.title }}</h3><button class="btn ghost" @click="selected = null">关闭</button></div><p class="muted">{{ selected.category }}</p><p class="preline">{{ selected.content }}</p></div></div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { listArticles } from '../api';
const articles = ref([]);
const selected = ref(null);
onMounted(async () => { articles.value = (await listArticles()).data || []; });
</script>