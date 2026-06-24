export function fmtDate(val) {
  if (!val) return "";
  if (typeof val === "object") return (val.date || "").substring(0, 10);
  return String(val).substring(0, 10);
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  const d = fmtDate(dateStr);
  return d && d < new Date().toISOString().substring(0, 10);
}

export function isDarkHexBg(headerBg) {
  if (!headerBg) return false;
  const hex = headerBg.replace("#", "");
  if (hex.length < 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}
