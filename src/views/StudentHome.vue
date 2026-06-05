<template>
  <div class="page-head">
    <h1>学生首页</h1>
    <p>面向校园常见轻症：先问诊、再预约、最后由医生补充建议，保留完整记录。</p>
  </div>
  <div class="stats">
    <div class="stat"><strong>1</strong><span>描述症状</span></div>
    <div class="stat"><strong>2</strong><span>获取风险提示</span></div>
    <div class="stat"><strong>3</strong><span>预约校医院</span></div>
    <div class="stat"><strong>4</strong><span>医生复核</span></div>
  </div>
  <div class="grid">
    <div class="card">
      <span class="tag">第一步</span>
      <h3>AI 问诊</h3>
      <p class="muted">提交症状、持续时间、严重程度和用药情况，系统生成初步建议并保存记录。</p>
      <RouterLink class="btn" to="/consult">开始问诊</RouterLink>
    </div>
    <div class="card">
      <span class="tag">第二步</span>
      <h3>校医院预约</h3>
      <p class="muted">如果 AI 提示需要线下评估，可以直接提交预约，减少现场排队和重复描述。</p>
      <RouterLink class="btn" to="/appointment">提交预约</RouterLink>
    </div>
    <div class="card">
      <span class="tag">日常支持</span>
      <h3>健康科普</h3>
      <p class="muted">查看呼吸道、肠胃、心理压力等校园常见健康知识，提升自我照护能力。</p>
      <RouterLink class="btn" to="/articles">查看科普</RouterLink>
    </div>
  </div>
</template>
