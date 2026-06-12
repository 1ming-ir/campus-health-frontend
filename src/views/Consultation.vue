<template>
  <div>
    <div class="page-head page-head-row">
      <div>
        <h1>AI 健康问诊</h1>
        <p>
          填写完整症状信息后生成初步健康建议，结果会保留为问诊记录。
        </p>
      </div>

      <RouterLink class="btn ghost" to="/appointment">
        去预约
      </RouterLink>
    </div>

    <div class="grid two">
      <div class="card">
        <h3>症状信息</h3>

        <label>症状描述 <span class="required">*</span></label>
        <textarea
          v-model="form.symptom"
          rows="6"
          placeholder="例如：咽痛、咳嗽两天，体温 37.8℃，无明显胸闷"
        ></textarea>

        <div class="form-grid">
          <div>
            <label>持续时间 <span class="required">*</span></label>
            <input v-model.trim="form.duration" placeholder="例如：2天" />
          </div>

          <div>
            <label>严重程度 <span class="required">*</span></label>
            <select v-model="form.severity">
              <option value="">请选择</option>
              <option>轻度</option>
              <option>中度</option>
              <option>重度</option>
            </select>
          </div>
        </div>

        <label>是否用药 <span class="required">*</span></label>
        <select v-model="form.medicineUsed">
          <option value="">请选择</option>
          <option>未用药</option>
          <option>已用药</option>
          <option>不确定</option>
        </select>

        <template v-if="form.medicineUsed === '已用药'">
          <label>药品名称 <span class="required">*</span></label>
          <input
            v-model.trim="form.medicineName"
            placeholder="请填写已使用药品名称"
          />
        </template>

        <p class="muted">
          AI 建议仅供健康咨询参考，不能替代医生诊断。
        </p>

        <button class="btn block" :disabled="loading" @click="submit">
          {{ loading ? '生成中...' : '生成建议并保存记录' }}
        </button>

        <p class="error" v-if="error">
          {{ error }}
        </p>
      </div>

      <div class="card">
        <h3>服务边界</h3>

        <ul class="check-list">
          <li>
            问诊结果会进入记录，便于预约和医生接续处理。
          </li>
          <li>
            如出现呼吸困难、意识异常、剧烈疼痛等情况，应立即线下就医。
          </li>
          <li>
            医生补充建议会在问诊记录中展示。
          </li>
        </ul>
      </div>
    </div>

    <div class="card result-card" v-if="advice">
      <div class="toolbar">
        <h3>AI 初步建议</h3>
        <span class="tag warn">仅供健康咨询参考</span>
      </div>

      <div class="advice-box structured">
        <p v-for="(line, index) in lines" :key="index">
          {{ line }}
        </p>
      </div>

      <RouterLink class="btn" to="/appointment">
        需要医生进一步评估，去预约校医院
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { createConsultation } from '../api'
import { adviceLines, currentUser } from '../utils'

const user = currentUser()

const form = reactive({
  studentId: user.id || 1,
  symptom: '',
  duration: '',
  severity: '',
  medicineUsed: '',
  medicineName: ''
})

const advice = ref('')
const loading = ref(false)
const error = ref('')

const lines = computed(() => adviceLines(advice.value))

function validate() {
  if (!form.symptom.trim() || form.symptom.trim().length < 5) {
    return '症状描述不能为空，且不少于 5 个字。'
  }

  if (!form.duration.trim()) {
    return '请填写持续时间。'
  }

  if (!form.severity) {
    return '请选择严重程度。'
  }

  if (!form.medicineUsed) {
    return '请选择是否用药。'
  }

  if (form.medicineUsed === '已用药' && !form.medicineName.trim()) {
    return '请填写药品名称。'
  }

  return ''
}

async function submit() {
  error.value = validate()

  if (error.value) return

  loading.value = true

  try {
    const res = await createConsultation(form)

    if (res.code !== 0) {
      error.value = res.message || '问诊提交失败'
      return
    }

    advice.value = res.data.aiAdvice || ''
  } catch {
    error.value = '问诊服务暂时不可用，请联系管理员检查后端服务。'
  } finally {
    loading.value = false
  }
}
</script>
