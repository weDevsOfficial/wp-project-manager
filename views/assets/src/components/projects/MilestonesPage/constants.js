import {
  CheckCircle, Clock, AlertCircle, AlertTriangle,
} from "lucide-react";

export const healthConfig = {
  "on-track":  { label: "On Track",  icon: CheckCircle,   className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "at-risk":   { label: "At Risk",   icon: AlertTriangle, className: "bg-amber-50 text-amber-700 border-amber-200" },
  overdue:     { label: "Overdue",   icon: AlertCircle,   className: "bg-red-50 text-red-700 border-red-200" },
  completed:   { label: "Completed", icon: CheckCircle,   className: "bg-blue-50 text-blue-700 border-blue-200" },
  "no-date":   { label: "No Date",   icon: Clock,         className: "bg-gray-50 text-gray-500 border-gray-200" },
};

export const filterTabs = [
  { key: "all",       label: "All",       color: "#6b7280" },
  { key: "upcoming",  label: "Upcoming",  color: "#3b82f6" },
  { key: "at-risk",   label: "At Risk",   color: "#f59e0b" },
  { key: "overdue",   label: "Overdue",   color: "#ef4444" },
  { key: "completed", label: "Completed", color: "#10b981" },
  { key: "no-date",   label: "No Date",   color: "#9ca3af" },
];

export const sortOptions = [
  { value: "date",     label: "Target Date" },
  { value: "progress", label: "Progress" },
  { value: "title",    label: "Title" },
];

export const groupConfig = {
  upcoming:  { icon: Clock,         color: "text-blue-500" },
  "at-risk": { icon: AlertTriangle, color: "text-amber-500" },
  overdue:   { icon: AlertCircle,   color: "text-red-500" },
  completed: { icon: CheckCircle,   color: "text-emerald-500" },
  "no-date": { icon: Clock,         color: "text-gray-400" },
};
