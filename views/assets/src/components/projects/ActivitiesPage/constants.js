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
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
};

export const ACTION_FALLBACKS = {
  create_project: 'created a project',
  update_project_title: 'updated project title',
  create_task: 'created a task',
  delete_task: 'deleted a task',
  update_task_title: 'updated task title',
  update_task_description: 'updated task description',
  update_task_status: 'updated task status',
  update_task_start_at: 'updated task start date',
  update_task_start_at_date: 'updated task start date',
  update_task_due_date: 'updated task due date',
  update_task_estimation: 'updated task estimation',
  update_task_priority: 'updated task priority',
  create_task_list: 'created a task list',
  delete_task_list: 'deleted a task list',
  update_task_list_title: 'updated task list title',
  create_milestone: 'created a milestone',
  delete_milestone: 'deleted a milestone',
  create_discussion_board: 'created a discussion',
  comment_on_task: 'commented on a task',
  comment_on_discussion_board: 'commented on a discussion',
  comment_on_project: 'commented on a project',
  reply_comment_on_task: 'replied to a comment',
};

export { Activity };
