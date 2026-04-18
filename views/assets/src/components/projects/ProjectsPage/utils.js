import { unwrapData } from "@lib/pm-utils";

export function getMeta(p) {
  return unwrapData(p.meta);
}

export function projectProgress(p) {
  const meta = getMeta(p);
  const total = meta?.total_tasks ?? 0;
  const complete = meta?.total_complete_tasks ?? 0;
  if (total === 0) return 0;
  return Math.round((complete / total) * 100);
}

export function isComplete(p) {
  return p.status === "complete" || p.status === "1" || p.status === 1;
}

export function statusColor(p) {
  if (isComplete(p)) return '#10b981';
  if (p.status === 'archived' || p.status === '2' || p.status === 2) return '#6b7280';
  if (p.status === 'pending' || p.status === '3' || p.status === 3) return '#f59e0b';
  return '#6366f1';
}

export function statusLabel(p) {
  if (isComplete(p)) return 'Completed';
  if (p.status === 'archived' || p.status === '2' || p.status === 2) return 'Archived';
  if (p.status === 'pending' || p.status === '3' || p.status === 3) return 'Pending';
  return 'Active';
}

export function userInitials(name) {
  return name
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function getDescriptionSnippet(project) {
  const desc = project.description;
  if (!desc || typeof desc === "string") return "";
  const raw = desc.content || desc.html || "";
  return raw ? stripHtml(raw).trim() : "";
}

export const FILTER_TABS = [
  { key: "incomplete", label: "Active",    countKey: "total_incomplete", color: "#6366f1" },
  { key: "complete",   label: "Completed", countKey: "total_complete",   color: "#10b981" },
  { key: "favourite",  label: "Favourite", countKey: "total_favourite",  color: "#f59e0b" },
  { key: "all",        label: "All",                                     color: "#6b7280" },
];
