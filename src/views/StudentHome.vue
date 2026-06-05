<template>
  <h1>学生首页</h1>
  <p class="muted">围绕轻症咨询、校医院预约和健康科普构建的一站式学生端。</p>
  <div class="grid">
    <div class="card">
      <h3>AI 问诊</h3>
      <p class="muted">描述症状，系统生成初步健康建议和就医提醒。</p>
      <RouterLink class="btn" to="/consult">开始问诊</RouterLink>
    </div>
    <div class="card">
      <h3>校医院预约</h3>
      <p class="muted">提交预约原因，选择医生和时间段。</p>
      <RouterLink class="btn" to="/appointment">提交预约</RouterLink>
    </div>
    <div class="card">
      <h3>疾病科普</h3>
      <p class="muted">查看呼吸道、肠胃、心理健康等校园常见问题。</p>
      <RouterLink class="btn" to="/articles">查看科普</RouterLink>
    </div>
  </div>
</template>
