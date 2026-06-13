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
};

export const roleMap = {
  STUDENT: '学生',
  DOCTOR: '医生',
  ADMIN: '管理员'
};

export function statusLabel(status) {
  return statusMap[status] || status || '-';
}

export function roleLabel(role) {
  return roleMap[role] || role || '-';
}

export function cleanAdvice(text = '') {
  return String(text || '')
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, ''))
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*/g, '')
    .replace(/---+/g, '')
    .replace(/\r/g, '')
    .trim();
}

export function adviceLines(text = '') {
  return cleanAdvice(text)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function currentUser() {
  return JSON.parse(localStorage.getItem('user') || '{}');
}

export function setCurrentUser(user) {
  localStorage.removeItem('role');
  localStorage.setItem('user', JSON.stringify(user || {}));
  window.dispatchEvent(new Event('campus-user-change'));
}

export function clearCurrentUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  window.dispatchEvent(new Event('campus-user-change'));
}

export function homePath(role) {
  if (role === 'DOCTOR') return '/doctor';
  if (role === 'ADMIN') return '/admin';
  return '/student';
}

export function shortText(text, length = 80) {
  const value = String(text || '').trim();
  return value.length > length ? `${value.slice(0, length)}...` : value;
}