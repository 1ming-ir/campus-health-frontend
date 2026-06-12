<template>
  <div>
    <div class="page-head">
      <h1>健康科普</h1>
      <p>
        查看校园常见健康问题的预防和护理知识。
      </p>
    </div>

    <p class="error" v-if="error">
      {{ error }}
    </p>

    <div class="grid">
      <div
        class="card"
        v-for="a in articles"
        :key="a.id || a.title"
      >
        <span class="tag">
          {{ a.category }}
        </span>

        <h3>{{ a.title }}</h3>

        <p class="muted">
          {{ a.summary }}
        </p>

        <p>
          {{ a.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { listArticles } from '../api'

const articles = ref([])
const error = ref('')

onMounted(async () => {
  try {
    articles.value = (await listArticles()).data || []
  } catch {
    error.value = '科普服务暂时不可用。'
  }
})
</script>
