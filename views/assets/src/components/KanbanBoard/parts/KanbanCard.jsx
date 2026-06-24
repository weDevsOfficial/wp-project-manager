import { __ } from '@wordpress/i18n';
import React from "react";
import { useConfirm } from "@hooks/useConfirm";
import { usePermissions } from "@hooks/usePermissions";
import { UserAvatar } from '@components/common/UserAvatar';
import { Calendar, MessageSquare, GripVertical, Minus, Github, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtDate, isOverdue } from "../utils";

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
    <div className="bg-pm-surface rounded-xl p-3 group shadow-sm hover:shadow-md transition-shadow duration-200 border border-pm-border/40 hover:border-pm-border">
      <ConfirmDialog />
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <GripVertical className="h-4 w-4 text-pm-border mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
          <h4 className="text-[13px] font-medium text-pm-text-primary leading-snug flex-1 line-clamp-2" title={task.title}>
            {task.title}
          </h4>
          {task.github_issue && (
            <span title={`${task.github_issue.source}${task.github_issue.issue_number ? ` #${task.github_issue.issue_number}` : ''}`} className="shrink-0">
              <Github className="h-3.5 w-3.5 text-pm-text-muted" />
            </span>
          )}
        </div>
        {canEdit && (
          <button
            onClick={handleRemove}
            onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation() }}
            onMouseDown={(e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation() }}
            onPointerUp={(e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation() }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-pm-text-muted hover:text-red-500 transition-all shrink-0 border-none outline-none shadow-none bg-transparent"
            title={__("Remove", 'wedevs-project-manager')}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {dueDate && (
        <div className="flex items-center gap-2 mt-2.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md",
              overdue
                ? "bg-red-50 text-red-500"
                : "bg-pm-hover text-pm-text-muted"
            )}
          >
            <Calendar className="h-3 w-3" />
            {dueDate}
          </span>
        </div>
      )}

      {(assigneeArr.length > 0 || commentCount > 0 || subtaskCount > 0) && (
        <div className="flex items-center gap-1 mt-2.5 pt-2.5 border-t border-pm-border/40">
          <div className="flex -space-x-1.5">
            {assigneeArr.slice(0, 4).map((u) => (
              <UserAvatar key={u.id} user={u} size="md" className="ring-2 ring-white" fallbackClassName="bg-pm-accent/10 text-pm-accent" />
            ))}
          </div>
          {assigneeArr.length > 4 && (
            <span className="text-[11px] text-pm-text-muted ml-1">
              +{assigneeArr.length - 4}
            </span>
          )}
          <div className="inline-flex items-center gap-2 ml-auto">
            {subtaskCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-pm-text-muted">
                <Layers className="h-3 w-3" />
                {subtaskCount}
              </span>
            )}
            {commentCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-pm-text-muted">
                <MessageSquare className="h-3 w-3" />
                {commentCount}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
