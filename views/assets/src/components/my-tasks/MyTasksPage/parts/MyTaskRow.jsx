import { __ } from '@wordpress/i18n';
import React, { useState } from "react";
import { Badge } from "@components/ui/badge";
import { UserAvatar } from '@components/common/UserAvatar';
import TaskLabelBadges from "@components/tasks/TaskLabelBadges";
import { Check, MessageSquare, Lock, Layers } from "lucide-react";
import {
  isTaskComplete,
  formatPmDate,
  isOverdue,
} from "@lib/pm-utils";

export default function MyTaskRow({ task, projectTitle, onToggle, onOpen }) {
  const complete = isTaskComplete(task.status);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    await onToggle(task);
    setToggling(false);
  };

  const assignees = Array.isArray(task.assignees)
    ? task.assignees
    : task.assignees?.data ?? [];

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 last:border-b-0 hover:bg-muted/20 transition-colors group">
      <button
        type="button"
        onClick={handleToggle}
        disabled={toggling}
        className="shrink-0"
      >
        {complete ? (
          <span className="flex items-center justify-center h-[18px] w-[18px] rounded-full bg-pm-accent text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        ) : (
          <span className="h-[18px] w-[18px] rounded-full border-[1.5px] border-dashed border-pm-text-muted/40 block" />
        )}
      </button>

      <button
        type="button"
        className={`flex-1 text-sm truncate text-left hover:text-pm-accent transition-colors ${
          complete ? "line-through text-pm-text-muted" : "text-pm-text-primary"
        }`}
        onClick={() => onOpen && onOpen(task)}
      >
        {task.title}
      </button>

      {assignees.length > 0 && (
        <div className="flex -space-x-1.5 shrink-0">
          {assignees.slice(0, 3).map((u) => (
            <UserAvatar key={u.id || u.ID} user={u} size="sm" className="border border-background" />
          ))}
        </div>
      )}

      <TaskLabelBadges task={task} variant="full" />

      {projectTitle && (
        <span className="text-[15px] text-pm-text-muted bg-muted/50 px-2 py-0.5 rounded truncate max-w-[120px] shrink-0">
          {projectTitle}
        </span>
      )}

      {task.task_list?.data?.title && (
        <span className="text-[15px] text-pm-text-muted truncate max-w-[100px] shrink-0 hidden md:block">
          {task.task_list.data.title}
        </span>
      )}

      <span
        className={`text-[15px] shrink-0 tabular-nums ${
          isOverdue(task.due_date, task.status)
            ? "text-red-500"
            : "text-pm-text-muted"
        }`}
      >
        {formatPmDate(task.due_date) || "—"}
      </span>
      {isOverdue(task.due_date, task.status) && (
        <Badge variant="destructive" className="text-[11px] px-1.5 py-0 h-4 shrink-0">
          {__('Overdue', 'wedevs-project-manager')}
        </Badge>
      )}

      {(task.meta?.total_sub_task ?? 0) > 0 && (
        <span className="flex items-center gap-0.5 text-[15px] text-pm-text-muted shrink-0">
          <Layers className="h-3.5 w-3.5" />
          {task.meta.total_sub_task}
        </span>
      )}

      {(task.meta?.total_comment ?? 0) > 0 && (
        <span className="flex items-center gap-0.5 text-[15px] text-pm-text-muted shrink-0">
          <MessageSquare className="h-3.5 w-3.5" />
          {task.meta.total_comment}
        </span>
      )}

      {task.meta?.privacy === 1 && (
        <Lock className="h-3.5 w-3.5 text-pm-text-muted shrink-0" />
      )}
    </div>
  );
}
