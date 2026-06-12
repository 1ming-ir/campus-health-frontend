<template>
  <div>
    <div class="page-head">
      <h1>{{ title }}</h1>
      <p>
        维护用户、医生、问诊、预约、科普、药品、公告和统计数据。
      </p>
    </div>

    <div class="stats">
      <div class="stat">
        <strong>{{ overview.users || users.length }}</strong>
        <span>系统用户</span>
      </div>
      <div class="stat">
        <strong>{{ overview.doctors || doctors.length }}</strong>
        <span>医生档案</span>
      </div>
      <div class="stat">
        <strong>{{ overview.consultations || consultations.length }}</strong>
        <span>问诊记录</span>
      </div>
      <div class="stat">
        <strong>{{ overview.appointments || appointments.length }}</strong>
        <span>预约记录</span>
      </div>
    </div>

    <div class="card" v-if="view === 'home' || view === 'stats'">
      <h3>数据统计</h3>
      <div class="chart-row">
        <div
          v-for="item in statItems"
          :key="item.label"
          class="bar"
        >
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </div>

    <div class="card" v-if="view === 'users'">
      <div class="toolbar">
        <h3>用户管理</h3>
        <span class="tag">启用 / 禁用</span>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>账号</th>
            <th>角色</th>
            <th>学院</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.realName }}</td>
            <td>{{ u.username }}</td>
            <td>{{ roleLabel(u.role) }}</td>
            <td>{{ u.college || '-' }}</td>
            <td>{{ statusLabel(u.status) }}</td>
            <td>
              <button class="btn ghost" @click="toggleUser(u)">
                {{ u.status === 'ENABLED' ? '禁用' : '启用' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" v-if="view === 'doctors'">
      <h3>医生管理</h3>

      <table class="table">
        <thead>
          <tr>
            <th>医生</th>
            <th>科室</th>
            <th>职称</th>
            <th>专长</th>
            <th>排班</th>
            <th>状态</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="d in doctors" :key="d.id">
            <td>{{ d.realName }}</td>
            <td>{{ d.department }}</td>
            <td>{{ d.title }}</td>
            <td>{{ d.specialty }}</td>
            <td>{{ d.scheduleText }}</td>
            <td>{{ statusLabel(d.status) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" v-if="view === 'consultations'">
      <h3>问诊管理</h3>

      <div
        class="list-item"
        v-for="c in consultations"
        :key="c.id"
      >
        <strong>{{ c.studentName }}：{{ c.symptom }}</strong>
        <p class="muted">
          状态：{{ statusLabel(c.status) }}；医生回复：{{ c.doctorReply || '暂无' }}
        </p>
      </div>
    </div>

    <div class="card" v-if="view === 'appointments'">
      <h3>预约管理</h3>

      <div
        class="list-item"
        v-for="a in appointments"
        :key="a.id"
      >
        <strong>{{ a.studentName }} 预约 {{ a.doctorName }}</strong>
        <p class="muted">
          {{ a.appointmentDate }} {{ a.timeSlot }}；状态：{{ statusLabel(a.status) }}；原因：{{ a.reason }}
        </p>
      </div>
    </div>

    <div class="card" v-if="view === 'articles'">
      <h3>科普管理</h3>

      <div
        class="list-item"
        v-for="a in articles"
        :key="a.id"
      >
        <strong>{{ a.title }}</strong>
        <p class="muted">
          {{ a.category }}；状态：{{ statusLabel(a.status) }}
        </p>
        <button class="btn ghost" @click="toggleArticle(a)">
          {{ a.status === 'PUBLISHED' ? '下架' : '发布' }}
        </button>
      </div>
    </div>

    <div class="card" v-if="view === 'medicines'">
      <h3>药品管理</h3>

      <div
        class="list-item"
        v-for="m in medicines"
        :key="m.id"
      >
        <strong>{{ m.name }}</strong>
        <p class="muted">
          {{ m.category }}：{{ m.caution }}
        </p>
      </div>
    </div>

    <div class="card" v-if="view === 'announcements'">
      <h3>公告管理</h3>

      <div
        class="list-item"
        v-for="a in announcements"
        :key="a.id"
      >
        <strong>{{ a.title }}</strong>
        <p class="muted">
          {{ a.type }}：{{ a.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  adminOverview,
  listAdminAnnouncements,
  listAdminAppointments,
  listAdminArticles,
  listAdminConsultations,
  listAdminDoctors,
  listAdminMedicines,
  listAdminUsers,
  updateAdminArticleStatus,
  updateAdminUserStatus
} from '../api'
import { statusLabel } from '../utils'

const route = useRoute()

const view = computed(() => route.meta.view || 'home')

const titles = {
  home: '管理首页',
  users: '用户管理',
  doctors: '医生管理',
  consultations: '问诊管理',
  appointments: '预约管理',
  articles: '科普管理',
  medicines: '药品管理',
  announcements: '公告管理',
  stats: '数据统计'
}

const title = computed(() => titles[view.value] || '管理员后台')

const overview = ref({})
const users = ref([])
const doctors = ref([])
const articles = ref([])
const appointments = ref([])
const consultations = ref([])
const medicines = ref([])
const announcements = ref([])

const statItems = computed(() => [
  {
    label: '用户',
    value: overview.value.users || users.value.length
  },
  {
    label: '医生',
    value: overview.value.doctors || doctors.value.length
  },
  {
    label: '问诊',
    value: overview.value.consultations || consultations.value.length
  },
  {
    label: '预约',
    value: overview.value.appointments || appointments.value.length
  },
  {
    label: '科普',
    value: overview.value.articles || articles.value.length
  }
])

function roleLabel(role) {
  return {
    STUDENT: '学生',
    DOCTOR: '医生',
    ADMIN: '管理员'
  }[role] || role
}

async function load() {
  try {
    overview.value = (await adminOverview()).data || {}
  } catch {}

  try {
    users.value = (await listAdminUsers()).data || []
  } catch {}

  try {
    doctors.value = (await listAdminDoctors()).data || []
  } catch {}

  try {
    articles.value = (await listAdminArticles()).data || []
  } catch {}

  try {
    appointments.value = (await listAdminAppointments()).data || []
  } catch {}

  try {
    consultations.value = (await listAdminConsultations()).data || []
  } catch {}

  try {
    medicines.value = (await listAdminMedicines()).data || []
  } catch {}

  try {
    announcements.value = (await listAdminAnnouncements()).data || []
  } catch {}
}

async function toggleUser(user) {
  await updateAdminUserStatus(
    user.id,
    user.status === 'ENABLED' ? 'DISABLED' : 'ENABLED'
  )
  await load()
}

async function toggleArticle(article) {
  await updateAdminArticleStatus(
    article.id,
    article.status === 'PUBLISHED' ? 'OFFLINE' : 'PUBLISHED'
  )
  await load()
}

watch(() => route.path, load)

onMounted(load)
</script>
