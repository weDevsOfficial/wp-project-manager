import { __ } from '@wordpress/i18n';
import {
  Activity, CheckSquare, FolderKanban, MessageSquare,
  FileText, Milestone, Trash2, Edit3, ArrowUpDown, Plus,
} from 'lucide-react';

export const ACTION_ICON_MAP = {
  create_project: FolderKanban,
  update_project: Edit3,
  update_project_title: Edit3,
  delete_project: Trash2,
  create_task: CheckSquare,
  update_task: Edit3,
  update_task_title: Edit3,
  update_task_description: Edit3,
  update_task_status: ArrowUpDown,
  update_task_start_at: Edit3,
  update_task_start_at_date: Edit3,
  update_task_due_date: Edit3,
  update_task_estimation: Edit3,
  update_task_priority: Edit3,
  delete_task: Trash2,
  complete_task: CheckSquare,
  incomplete_task: CheckSquare,
  create_task_list: Plus,
  update_task_list_title: Edit3,
  delete_task_list: Trash2,
  create_milestone: Milestone,
  update_milestone_title: Edit3,
  delete_milestone: Trash2,
  create_discussion_board: MessageSquare,
  update_discussion_board_title: Edit3,
  delete_discussion_board: Trash2,
  comment_on_task: MessageSquare,
  comment_on_discussion_board: MessageSquare,
  comment_on_project: MessageSquare,
  reply_comment_on_task: MessageSquare,
  update_comment_on_task: Edit3,
  delete_comment_on_task: Trash2,
  upload_file: FileText,
  create_file: FileText,
  delete_file: Trash2,
};

export const ACTION_COLOR_MAP = {
  create: 'bg-emerald-500',
  update: 'bg-blue-500',
  delete: 'bg-red-500',
};

export const ACTION_LABELS = {
  create: __('Created', 'wedevs-project-manager'),
  update: __('Updated', 'wedevs-project-manager'),
  delete: __('Deleted', 'wedevs-project-manager'),
};

export const ACTION_FALLBACKS = {
  create_project: __('created a project', 'wedevs-project-manager'),
  update_project_title: __('updated project title', 'wedevs-project-manager'),
  create_task: __('created a task', 'wedevs-project-manager'),
  delete_task: __('deleted a task', 'wedevs-project-manager'),
  update_task_title: __('updated task title', 'wedevs-project-manager'),
  update_task_description: __('updated task description', 'wedevs-project-manager'),
  update_task_status: __('updated task status', 'wedevs-project-manager'),
  update_task_start_at: __('updated task start date', 'wedevs-project-manager'),
  update_task_start_at_date: __('updated task start date', 'wedevs-project-manager'),
  update_task_due_date: __('updated task due date', 'wedevs-project-manager'),
  update_task_estimation: __('updated task estimation', 'wedevs-project-manager'),
  update_task_priority: __('updated task priority', 'wedevs-project-manager'),
  create_task_list: __('created a task list', 'wedevs-project-manager'),
  delete_task_list: __('deleted a task list', 'wedevs-project-manager'),
  update_task_list_title: __('updated task list title', 'wedevs-project-manager'),
  create_milestone: __('created a milestone', 'wedevs-project-manager'),
  delete_milestone: __('deleted a milestone', 'wedevs-project-manager'),
  create_discussion_board: __('created a discussion', 'wedevs-project-manager'),
  comment_on_task: __('commented on a task', 'wedevs-project-manager'),
  comment_on_discussion_board: __('commented on a discussion', 'wedevs-project-manager'),
  comment_on_project: __('commented on a project', 'wedevs-project-manager'),
  reply_comment_on_task: __('replied to a comment', 'wedevs-project-manager'),
};

export { Activity };
