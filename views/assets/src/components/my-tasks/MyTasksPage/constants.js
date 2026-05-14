import { __ } from '@wordpress/i18n';
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

export const getActivityLabels = () => ({
  create: __('Created', 'wedevs-project-manager'),
  update: __('Updated', 'wedevs-project-manager'),
  delete: __('Deleted', 'wedevs-project-manager'),
});

export const getActivityFallbacks = () => ({
  create_project:          __('created a project', 'wedevs-project-manager'),
  create_task:             __('created a task', 'wedevs-project-manager'),
  delete_task:             __('deleted a task', 'wedevs-project-manager'),
  update_task_title:       __('updated task title', 'wedevs-project-manager'),
  update_task_status:      __('updated task status', 'wedevs-project-manager'),
  update_task_start_at:    __('updated task start date', 'wedevs-project-manager'),
  update_task_due_date:    __('updated task due date', 'wedevs-project-manager'),
  create_task_list:        __('created a task list', 'wedevs-project-manager'),
  create_milestone:        __('created a milestone', 'wedevs-project-manager'),
  create_discussion_board: __('created a discussion', 'wedevs-project-manager'),
  comment_on_task:         __('commented on a task', 'wedevs-project-manager'),
});

export const isPro = typeof PM_Vars !== "undefined" && !!PM_Vars.is_pro;

export const getTabs = () => [
  { key: "current",     label: __('Current Tasks', 'wedevs-project-manager'), icon: CheckSquare,    taskType: "current" },
  { key: "outstanding", label: __('Outstanding',   'wedevs-project-manager'), icon: AlertTriangle,  taskType: "outstanding" },
  { key: "complete",    label: __('Completed',     'wedevs-project-manager'), icon: CheckCircle,    taskType: "complete" },
  { key: "overview",    label: __('Overview',      'wedevs-project-manager'), icon: PieChartIcon },
  { key: "activities",  label: __('Activities',    'wedevs-project-manager'), icon: Activity },
  { key: "reports",     label: __('Reports',       'wedevs-project-manager'), icon: BarChart3, pro: true },
];

export const PIE_COLORS = ["#61BD4F", "#EB5A46", "#0090D9"];
