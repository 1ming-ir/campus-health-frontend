<template>
  <div>
    <div class="page-head">
      <h1>个人中心</h1>
      <p>
        维护基础资料、过敏史和既往病史，便于医生了解情况。
      </p>
    </div>

    <div class="card">
      <div class="form-grid">
        <div>
          <label>姓名</label>
          <input v-model="form.realName" />
        </div>

        <div>
          <label>手机号</label>
          <input v-model="form.phone" />
        </div>
      </div>

      <div class="form-grid">
        <div>
          <label>学院</label>
          <input v-model="form.college" />
        </div>

        <div>
          <label>班级</label>
          <input v-model="form.className" />
        </div>
      </div>

      <div class="form-grid">
        <div>
          <label>性别</label>
          <input v-model="form.gender" />
        </div>

        <div>
          <label>年龄</label>
          <input v-model.number="form.age" type="number" />
        </div>
      </div>

      <label>过敏史</label>
      <input
        v-model="form.allergyHistory"
        placeholder="例如：青霉素过敏，无则填无"
      />

      <label>既往病史</label>
      <input
        v-model="form.medicalHistory"
        placeholder="例如：哮喘，无则填无"
      />

      <label>紧急联系人</label>
      <input
        v-model="form.emergencyContact"
        placeholder="姓名和联系电话"
      />

      <button class="btn" @click="save">
        保存资料
      </button>

      <p class="success" v-if="msg">
        {{ msg }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getMe, updateProfile } from '../api'
import { currentUser } from '../utils'

const user = currentUser()

const msg = ref('')

const form = reactive({
  id: user.id,
  username: user.username,
  realName: '',
  phone: '',
  college: '',
  className: '',
  gender: '',
  age: '',
  allergyHistory: '',
  medicalHistory: '',
  emergencyContact: ''
})

onMounted(async () => {
  const res = await getMe(user.username)
  Object.assign(form, res.data || {})
})

async function save() {
  await updateProfile(form)
  msg.value = '资料已保存'
}
</script>
