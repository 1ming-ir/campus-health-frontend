export const statusMap = {
  PENDING: '寰呭鏍?,
  APPROVED: '宸查€氳繃',
  REJECTED: '宸叉嫆缁?,
  FINISHED: '宸插畬鎴?,
  CANCELLED: '宸插彇娑?,
  CREATED: '寰呭洖澶?,
  REPLIED: '宸插洖澶?,
  ARCHIVED: '宸插綊妗?,
  DELETED: '宸插垹闄?,
  ENABLED: '鍚敤',
  DISABLED: '绂佺敤',
  PUBLISHED: '宸插彂甯?,
  OFFLINE: '宸蹭笅鏋?,
  DRAFT: '鑽夌'
};

export function statusLabel(status) {
  return statusMap[status] || status || '-';
}

export function cleanAdvice(text = '') {
  return text
    .replace(/```/g, '')
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