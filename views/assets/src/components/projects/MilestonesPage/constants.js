import { __ } from '@wordpress/i18n';
import {
  CheckCircle, Clock, AlertCircle, AlertTriangle,
} from "lucide-react";

export const getHealthConfig = () => ({
  "on-track":  { label: __("On Track",  'wedevs-project-manager'), icon: CheckCircle,   className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "at-risk":   { label: __("At Risk",   'wedevs-project-manager'), icon: AlertTriangle, className: "bg-amber-50 text-amber-700 border-amber-200" },
  overdue:     { label: __("Overdue",   'wedevs-project-manager'), icon: AlertCircle,   className: "bg-red-50 text-red-700 border-red-200" },
  completed:   { label: __("Completed", 'wedevs-project-manager'), icon: CheckCircle,   className: "bg-blue-50 text-blue-700 border-blue-200" },
  "no-date":   { label: __("No Date",   'wedevs-project-manager'), icon: Clock,         className: "bg-gray-50 text-gray-500 border-gray-200" },
});

export const getFilterTabs = () => [
  { key: "all",       label: __("All",       'wedevs-project-manager'), color: "#6b7280" },
  { key: "upcoming",  label: __("Upcoming",  'wedevs-project-manager'), color: "#3b82f6" },
  { key: "at-risk",   label: __("At Risk",   'wedevs-project-manager'), color: "#f59e0b" },
  { key: "overdue",   label: __("Overdue",   'wedevs-project-manager'), color: "#ef4444" },
  { key: "completed", label: __("Completed", 'wedevs-project-manager'), color: "#10b981" },
  { key: "no-date",   label: __("No Date",   'wedevs-project-manager'), color: "#9ca3af" },
];

export const getSortOptions = () => [
  { value: "date",     label: __("Target Date", 'wedevs-project-manager') },
  { value: "progress", label: __("Progress",    'wedevs-project-manager') },
  { value: "title",    label: __("Title",       'wedevs-project-manager') },
];

export const groupConfig = {
  upcoming:  { icon: Clock,         color: "text-blue-500" },
  "at-risk": { icon: AlertTriangle, color: "text-amber-500" },
  overdue:   { icon: AlertCircle,   color: "text-red-500" },
  completed: { icon: CheckCircle,   color: "text-emerald-500" },
  "no-date": { icon: Clock,         color: "text-gray-400" },
};
