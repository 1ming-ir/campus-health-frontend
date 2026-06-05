# campus-health-frontend

校园健康问诊与咨询系统前端，采用 Vue 3 + Vite + Vue Router + Axios 实现学生、医生、管理员三类角色页面。

## 页面功能

- 登录页：选择学生、医生或管理员角色登录。
- 学生首页：进入 AI 问诊、校医院预约、疾病科普。
- AI 问诊页：提交症状并展示 AI 初步建议和历史记录。
- 预约页：提交预约并查看个人预约。
- 医生工作台：查看预约，处理状态，填写医生补充建议。
- 管理员后台：查看用户、医生和科普文章数据。
- 疾病科普页：展示校园常见健康知识。

## 本地运行

需要 Node.js。

```powershell
cd D:\实训\项目源码\campus-health-frontend
npm install
npm run dev
```

如果后端不是 `http://localhost:8080`，请配置 `.env`：

```env
VITE_API_BASE_URL=https://campus-health-backend-production.up.railway.app
```

## 构建

```powershell
npm run build
```

本项目已在当前环境使用 Vite build 验证通过。

## 演示账号

- 学生：student / 123456
- 医生：doctor / 123456
- 管理员：admin / 123456


## Vercel 路由配置

项目包含 `vercel.json`，会将所有前端子路由重写到 `index.html`，避免直接刷新 `/student`、`/doctor`、`/admin` 时出现 404。
