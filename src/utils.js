export const statusMap = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
  FINISHED: '已完成',
  CANCELLED: '已取消',
  CREATED: '待回复',
  REPLIED: '已回复',
  ARCHIVED: '已归档',
  DELETED: '已删除',
  ENABLED: '启用',
  DISABLED: '禁用',
  PUBLISHED: '已发布',
  OFFLINE: '已下架',
  DRAFT: '草稿'
}

export function statusLabel(status) {
  return statusMap[status] || status || '-'
}

export function cleanAdvice(text = '') {
  return text
    .replace(/```/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*/g, '')
    .replace(/---+/g, '')
    .replace(/\r/g, '')
    .trim()
}

export function adviceLines(text = '') {
  return cleanAdvice(text)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function currentUser() {
  return JSON.parse(localStorage.getItem('user') || '{}')
}
