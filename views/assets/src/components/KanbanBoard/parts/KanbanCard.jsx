import { __ } from '@wordpress/i18n';
import React from "react";
import { useConfirm } from "@hooks/useConfirm";
import { usePermissions } from "@hooks/usePermissions";
import { UserAvatar } from '@components/common/UserAvatar';
import TaskLabelBadges from "@components/tasks/TaskLabelBadges";
import { Calendar, MessageSquare, Minus, Github, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtDate, isOverdue } from "../utils";
import { taskPriority } from "@lib/pm-utils";

export default function KanbanCard({ task, boardId, onRemove }) {
  const [ConfirmDialog, confirm] = useConfirm();
  const { canManage } = usePermissions();
  const currentUserId =
    PM_Vars?.current_user?.ID ?? PM_Vars?.current_user?.data?.ID ?? null;
  const creatorId = task?.creator?.data?.id ?? task?.created_by ?? null;
  const canEdit =
    canManage ||
    (currentUserId && creatorId && String(currentUserId) === String(creatorId));
  const assignees = task.assignees?.data;
  const assigneeArr = !assignees
    ? []
    : Array.isArray(assignees)
    ? assignees
    : Object.values(assignees);
  const dueDate = fmtDate(task.due_date);
  const overdue =
    isOverdue(task.due_date) && task.status !== 1 && task.status !== "complete";
  const commentCount = task.meta?.total_comment || task.comments_count || 0;
  const subtaskCount = parseInt(task.meta?.total_sub_task ?? 0, 10) || 0;

  const descText = (task.description?.content || task.description?.html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const prioritySlug = taskPriority(task.priority);
  const priority = prioritySlug === "high"
    ? { label: __("High", 'wedevs-project-manager'), cls: "bg-red-100 text-red-700", dot: "bg-red-500" }
    : prioritySlug === "medium"
      ? { label: __("Medium", 'wedevs-project-manager'), cls: "bg-amber-100 text-amber-700", dot: "bg-amber-500" }
      : prioritySlug === "low"
        ? { label: __("Low", 'wedevs-project-manager'), cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" }
        : null;

  const hasFooter = assigneeArr.length > 0 || commentCount > 0 || subtaskCount > 0 || !!dueDate;

  const handleRemove = async (e) => {
    e.stopPropagation();
    const ok = await confirm(
      __("Remove this task from the board?", 'wedevs-project-manager'),
      __("Remove Task", 'wedevs-project-manager'),
    );
    if (!ok) return;
    onRemove(task.id);
  };

  return (
    <div className="relative bg-pm-surface rounded-md p-3 group shadow-sm hover:shadow-md transition-shadow duration-200 border border-pm-border/40 hover:border-pm-border">
      <ConfirmDialog />

      {canEdit && (
        <button
          onClick={handleRemove}
          onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation() }}
          onMouseDown={(e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation() }}
          onPointerUp={(e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation() }}
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-pm-text-muted hover:text-red-500 transition-all border-none outline-none shadow-none bg-transparent"
          title={__("Remove", 'wedevs-project-manager')}
        >
          <Minus className="h-4 w-4" />
        </button>
      )}

      {/* Top pills — collapses to nothing when the task has no meta */}
      <div className="flex items-center gap-1.5 flex-wrap pr-6 mb-2 empty:hidden">
        {task.type?.title && (
          <span className="inline-flex items-center rounded-md border border-pm-border px-2 py-0.5 text-[11px] font-normal text-pm-text-muted">
            {task.type.title}
          </span>
        )}
        {priority && (
          <span className={cn("inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[12px] font-medium", priority.cls)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", priority.dot)} />
            {priority.label}
          </span>
        )}
        {task.github_issue && (
          <span title={`${task.github_issue.source}${task.github_issue.issue_number ? ` #${task.github_issue.issue_number}` : ''}`} className="shrink-0">
            <Github className="h-4 w-4 text-pm-text-muted" />
          </span>
        )}
        <TaskLabelBadges task={task} variant="full" />
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-pm-text-primary leading-snug line-clamp-2 pr-6" title={task.title}>
        {task.title}
      </h4>

      {/* Description snippet */}
      {descText && (
        <p className="mt-1 text-[12px] text-pm-text-muted line-clamp-1">{descText}</p>
      )}

      {/* Footer: avatars + due / counts */}
      {hasFooter && (
        <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-pm-border/40">
          <div className="flex -space-x-1.5">
            {assigneeArr.slice(0, 4).map((u) => (
              <UserAvatar key={u.id} user={u} size="md" className="rounded-md ring-2 ring-white" fallbackClassName="rounded-md" />
            ))}
          </div>
          {assigneeArr.length > 4 && (
            <span className="text-[11px] text-pm-text-muted ml-1">+{assigneeArr.length - 4}</span>
          )}
          <div className="inline-flex items-center gap-2.5 ml-auto">
            {dueDate && (
              <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium", overdue ? "text-red-500" : "text-pm-text-muted")}>
                <Calendar className="h-4 w-4" />
                {dueDate}
              </span>
            )}
            {subtaskCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-pm-text-muted">
                <Layers className="h-4 w-4" />
                {subtaskCount}
              </span>
            )}
            {commentCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-pm-text-muted">
                <MessageSquare className="h-4 w-4" />
                {commentCount}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
