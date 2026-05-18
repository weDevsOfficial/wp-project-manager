import { __ } from '@wordpress/i18n';
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
  if (isComplete(p)) return __('Completed', 'wedevs-project-manager');
  if (p.status === 'archived' || p.status === '2' || p.status === 2) return __('Archived', 'wedevs-project-manager');
  if (p.status === 'pending' || p.status === '3' || p.status === 3) return __('Pending', 'wedevs-project-manager');
  return __('Active', 'wedevs-project-manager');
}

export function userInitials(name) {
  return name
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export function getDescriptionSnippet(project) {
  const desc = project.description;
  if (!desc) return "";
  if (typeof desc === "string") return stripHtml(desc).trim();
  const raw = desc.content || desc.html || "";
  return raw ? stripHtml(raw).trim() : "";
}

export const getFilterTabs = () => [
  { key: "incomplete", label: __("Active",    'wedevs-project-manager'), countKey: "total_incomplete", color: "#6366f1" },
  { key: "complete",   label: __("Completed", 'wedevs-project-manager'), countKey: "total_complete",   color: "#10b981" },
  { key: "favourite",  label: __("Favourite", 'wedevs-project-manager'), countKey: "total_favourite",  color: "#f59e0b" },
  { key: "all",        label: __("All",       'wedevs-project-manager'),                               color: "#6b7280" },
];
