import { __ } from '@wordpress/i18n';
import { unwrapData } from "@lib/pm-utils";
import { LayoutGrid, CircleDot, CheckCircle2, Star } from "lucide-react";

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

export function statusKey(p) {
  if (isComplete(p)) return 'complete';
  if (p.status === 'archived' || p.status === '2' || p.status === 2) return 'archived';
  if (p.status === 'pending' || p.status === '3' || p.status === 3) return 'pending';
  return 'active';
}

// Solid accent per status (dots, spines). Active = brand.
const STATUS_COLORS = {
  active:   '#6F56A3',
  pending:  '#F59E0B',
  complete: '#10B981',
  archived: '#6B7280',
};

// Soft pastel pill pairs (bg + text) — the grouped-list / card status chips.
const STATUS_PILLS = {
  active:   { bg: '#EDE9F4', text: '#6F56A3' },
  pending:  { bg: '#FEF3C7', text: '#B45309' },
  complete: { bg: '#DCFCE7', text: '#15803D' },
  archived: { bg: '#F1F1F2', text: '#52525B' },
};

export function statusColor(p) {
  return STATUS_COLORS[statusKey(p)];
}

export function statusPill(p) {
  return STATUS_PILLS[statusKey(p)];
}

export function statusLabel(p) {
  switch (statusKey(p)) {
    case 'complete': return __('Completed', 'wedevs-project-manager');
    case 'archived': return __('Archived', 'wedevs-project-manager');
    case 'pending':  return __('Pending', 'wedevs-project-manager');
    default:         return __('Active', 'wedevs-project-manager');
  }
}

// Ordered status buckets for the grouped list view (empty groups dropped).
export function groupByStatus(projects) {
  const order = ['active', 'pending', 'complete', 'archived'];
  const labels = {
    active:   __('Active', 'wedevs-project-manager'),
    pending:  __('Pending', 'wedevs-project-manager'),
    complete: __('Completed', 'wedevs-project-manager'),
    archived: __('Archived', 'wedevs-project-manager'),
  };
  const buckets = {};
  for (const p of projects) {
    const k = statusKey(p);
    (buckets[k] ||= []).push(p);
  }
  return order
    .filter((k) => buckets[k]?.length)
    .map((k) => ({ key: k, label: labels[k], color: STATUS_COLORS[k], pill: STATUS_PILLS[k], items: buckets[k] }));
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
  { key: "all",        label: __("All",       'wedevs-project-manager'), icon: LayoutGrid,   color: "#6b7280" },
  { key: "incomplete", label: __("Active",    'wedevs-project-manager'), icon: CircleDot, countKey: "total_incomplete", color: "#6F56A3" },
  { key: "complete",   label: __("Completed", 'wedevs-project-manager'), icon: CheckCircle2, countKey: "total_complete",   color: "#10b981" },
  { key: "favourite",  label: __("Favourite", 'wedevs-project-manager'), icon: Star,         countKey: "total_favourite",  color: "#f59e0b" },
];
