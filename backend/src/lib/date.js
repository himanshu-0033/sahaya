export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function isYesterday(dateStr, today) {
  const d = new Date(dateStr);
  const t = new Date(today);
  const diffDays = Math.round((t - d) / 86400000);
  return diffDays === 1;
}
