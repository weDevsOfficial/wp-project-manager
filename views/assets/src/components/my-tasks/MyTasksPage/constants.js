import {
  CheckSquare, AlertTriangle, CheckCircle, Activity,
  MessageSquare, PieChart as PieChartIcon, Plus,
  BarChart3, Edit3, Trash2, FolderKanban, FileText, Milestone,
  ArrowUpDown,
} from "lucide-react";

export const ACTIVITY_ICON_MAP = {
  create_project: FolderKanban, update_project: Edit3, delete_project: Trash2,
  create_task: CheckSquare, update_task: Edit3, delete_task: Trash2,
  update_task_title: Edit3, update_task_description: Edit3, update_task_status: ArrowUpDown,
  update_task_start_at: Edit3, update_task_due_date: Edit3, update_task_estimation: Edit3,
  complete_task: CheckSquare, incomplete_task: CheckSquare,
  create_task_list: Plus, delete_task_list: Trash2,
  create_milestone: Milestone, delete_milestone: Trash2,
  create_discussion_board: MessageSquare, comment_on_task: MessageSquare,
  comment_on_discussion_board: MessageSquare, upload_file: FileText,
};

export const ACTIVITY_COLOR_MAP = { create: 'bg-emerald-500', update: 'bg-blue-500', delete: 'bg-red-500' };
export const ACTIVITY_LABELS = { create: 'Created', update: 'Updated', delete: 'Deleted' };

export const ACTIVITY_FALLBACKS = {
  create_project: 'created a project', create_task: 'created a task', delete_task: 'deleted a task',
  update_task_title: 'updated task title', update_task_status: 'updated task status',
  update_task_start_at: 'updated task start date', update_task_due_date: 'updated task due date',
  create_task_list: 'created a task list', create_milestone: 'created a milestone',
  create_discussion_board: 'created a discussion', comment_on_task: 'commented on a task',
};

export const isPro = typeof PM_Vars !== "undefined" && !!PM_Vars.is_pro;

export const TABS = [
  { key: "current",     label: "Current Tasks", icon: CheckSquare,    taskType: "current" },
  { key: "outstanding", label: "Outstanding",   icon: AlertTriangle,  taskType: "outstanding" },
  { key: "complete",    label: "Completed",     icon: CheckCircle,    taskType: "complete" },
  { key: "overview",    label: "Overview",      icon: PieChartIcon },
  { key: "activities",  label: "Activities",    icon: Activity },
  { key: "reports",     label: "Reports",       icon: BarChart3, pro: true },
];

export const PIE_COLORS = ["#61BD4F", "#EB5A46", "#0090D9"];
