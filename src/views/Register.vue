<template>
  <section class="login-page">
    <div class="login-hero">
      <span class="eyebrow">学生注册</span>

      <h1>创建学生账号</h1>

      <p>
        注册入口仅面向学生。医生和管理员账号由管理员统一维护，避免权限风险。
      </p>
    </div>

    <form class="login-panel" @submit.prevent="submit">
      <h2>学生注册</h2>

      <label>学号</label>
      <input v-model.trim="form.username" placeholder="请输入学号" />

      <label>姓名</label>
      <input v-model.trim="form.realName" placeholder="请输入姓名" />

      <label>学院</label>
      <input v-model.trim="form.college" placeholder="请输入学院" />

      <label>班级</label>
      <input v-model.trim="form.className" placeholder="请输入班级" />

      <label>手机号</label>
      <input v-model.trim="form.phone" placeholder="请输入手机号" />

      <label>密码</label>
      <input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
      />

      <label>确认密码</label>
      <input
        v-model="form.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
      />

      <button class="btn block" :disabled="loading">
        {{ loading ? '注册中...' : '注册并登录' }}
      </button>

      <p class="error" v-if="message">
        {{ message }}
      </p>

      <RouterLink class="muted link" to="/">
        已有账号？返回登录
      </RouterLink>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerStudent } from '../api'

const router = useRouter()
const loading = ref(false)
const message = ref('')

const form = reactive({
  username: '',
  realName: '',
  college: '',
  className: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

async function submit() {
  message.value = ''

  if (
    !form.username ||
    !form.realName ||
    !form.password ||
    !form.confirmPassword
  ) {
    message.value = '请填写学号、姓名、密码和确认密码。'
    return
  }

  if (form.password !== form.confirmPassword) {
    message.value = '两次输入的密码不一致。'
    return
  }

  loading.value = true

  try {
    const res = await registerStudent(form)

    if (res.code !== 0) {
      message.value = res.message || '注册失败'
      return
    }

    localStorage.setItem('user', JSON.stringify(res.data))
    localStorage.setItem('role', res.data.role)

    router.push('/student')
  } catch (e) {
    message.value = '注册服务暂时不可用，请稍后重试。'
  } finally {
    loading.value = false
  }
}
</script>
