import React, { useCallback } from "react";
import { sanitizeHtml } from "@lib/sanitize";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/index";
import {
  fetchMilestones,
  updateMilestone,
  deleteMilestone,
  toggleMilestonePrivacy,
} from "@store/milestonesSlice";
import { openTaskSheet, fetchTask } from "@store/tasksSlice";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { usePermissions } from "@hooks/usePermissions";
import { useCurrentProject } from "@hooks/useCurrentProject";
import { cn } from "@lib/utils";
import { formatPmDateTime } from "@lib/pm-utils";
import { Button } from "@components/ui/button";
import { UserAvatar } from '@components/common/UserAvatar';
import { Badge } from "@components/ui/badge";
import { Card, CardContent } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@components/ui/dropdown-menu";
import ProBadge from "@components/common/ProBadge";
import {
  Trash2, MoreHorizontal, CheckCircle, Clock,
  Lock, Unlock, Pencil, MessageSquare, Minus,
  ListChecks, ChevronDown, Calendar, Timer,
} from "lucide-react";
import TaskCheckbox from "./TaskCheckbox";
import MilestoneHealthBadge from "./MilestoneHealthBadge";
import MilestoneProgress from "./MilestoneProgress";

export default function MilestoneCard({ milestone, projectId, onEdit, onImportTasks, expanded, onToggleExpanded, onTaskOpen }) {
  const { __ } = useI18n();
  const api = useApi();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager, currentUserId } = usePermissions(project);
  const creatorId = milestone?.creator?.data?.id ?? milestone?.created_by;
  const canEditMilestone =
    isManager ||
    userCan('edit_milestone') ||
    (currentUserId && creatorId && String(currentUserId) === String(creatorId));
  const canDeleteMilestone = isManager || userCan('delete_milestone') || canEditMilestone;

  const isComplete =
    milestone.status === "complete" || milestone.status === 1 || milestone.status === "1";
  const directTasks = milestone.tasks?.data ?? [];
  const discussions = milestone.discussion_boards?.data ?? [];
  const hasDetails = directTasks.length > 0 || discussions.length > 0;
  const tasksExpanded = !!expanded;
  const setTasksExpanded = useCallback(() => onToggleExpanded?.(milestone.id), [onToggleExpanded, milestone.id]);

  const handleOpenTask = useCallback(
    (task) => {
      onTaskOpen?.(milestone.id);
      const pid = task.project_id ?? projectId;
      dispatch(fetchTask({ projectId: pid, taskId: task.id })).then((action) => {
        if (action.payload) dispatch(openTaskSheet(action.payload));
      });
    },
    [dispatch, projectId, onTaskOpen, milestone.id],
  );

  const handleUnlinkTask = useCallback(
    async (task) => {
      if (!confirm(__("Remove this task from the milestone?"))) return;
      try {
        await api.post(`projects/${projectId}/milestones/${milestone.id}/detach-task/${task.id}`);
        toast.success(__("Task unlinked"));
        dispatch(fetchMilestones({ projectId }));
      } catch {
        toast.error(__("Failed to unlink task"));
      }
    },
    [projectId, milestone.id, api, toast, __, dispatch],
  );

  const handleToggleTaskStatus = useCallback(
    async (task) => {
      const isDone = task.status === 1 || task.status === "1" || task.status === "complete";
      const newStatus = isDone ? 0 : 1;
      try {
        await api.post(`projects/${projectId}/tasks/${task.id}/change-status`, { status: newStatus });
        dispatch(fetchMilestones({ projectId }));
      } catch {
        toast.error(__("Failed to update task status"));
      }
    },
    [projectId, api, toast, __, dispatch],
  );

  const handleDelete = useCallback(async () => {
    if (!confirm(__("Are you sure?"))) return;
    try {
      await dispatch(
        deleteMilestone({ projectId, milestoneId: milestone.id }),
      ).unwrap();
      toast.success(__("Milestone deleted"));
    } catch {
      toast.error(__("Failed to delete"));
    }
  }, [dispatch, projectId, milestone.id, toast, __]);

  const handleToggleStatus = useCallback(async () => {
    const newStatus = isComplete ? "incomplete" : "complete";
    try {
      await dispatch(
        updateMilestone({
          projectId,
          milestoneId: milestone.id,
          data: { title: milestone.title, status: newStatus },
        }),
      ).unwrap();
      dispatch(fetchMilestones({ projectId }));
      toast.success(
        newStatus === "complete"
          ? __("Milestone marked as complete")
          : __("Milestone marked as incomplete"),
      );
    } catch {
      toast.error(__("Failed to update status"));
    }
  }, [dispatch, projectId, milestone, isComplete, toast, __]);

  const handleTogglePrivacy = useCallback(async () => {
    const newPrivacy = milestone.meta?.privacy ? 0 : 1;
    try {
      await dispatch(
        toggleMilestonePrivacy({
          projectId,
          milestoneId: milestone.id,
          isPrivate: newPrivacy,
        }),
      ).unwrap();
    } catch {
      toast.error(__("Failed to update"));
    }
  }, [dispatch, projectId, milestone, toast, __]);

  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleToggleStatus}
            className="shrink-0 mt-0.5"
            title={isComplete ? __("Mark Incomplete") : __("Mark Complete")}
          >
            <CheckCircle
              className={cn(
                "h-5 w-5 transition-colors",
                isComplete
                  ? "text-emerald-500"
                  : "text-pm-text-muted/30 hover:text-emerald-400",
              )}
            />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={cn(
                  "text-sm font-semibold",
                  isComplete
                    ? "text-pm-text-muted line-through"
                    : "text-pm-text-primary",
                )}
              >
                {milestone.title}
              </h4>
              <MilestoneHealthBadge
                health={
                  milestone.health ?? (isComplete ? "completed" : "no-date")
                }
              />
              {milestone.meta?.privacy ? (
                <Lock className="h-3.5 w-3.5 text-pm-text-muted" />
              ) : null}
            </div>

            {(typeof milestone.description === 'string' ? milestone.description : milestone.description?.content) && (
              <p className="text-sm text-pm-text-muted mt-1 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(typeof milestone.description === 'string' ? milestone.description : milestone.description.content) }}
              />
            )}

            <div className="flex items-center gap-4 mt-2.5 flex-wrap">
              <MilestoneProgress
                progress={milestone.progress ?? 0}
                taskCount={milestone.task_count}
              />
              {milestone.achieve_date && (
                <span className="text-sm text-pm-text-muted flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatPmDateTime(milestone.achieve_date)}
                </span>
              )}
              {directTasks.length > 0 && (
                <span className="text-sm text-pm-text-muted flex items-center gap-1">
                  <ListChecks className="h-3.5 w-3.5" />
                  {directTasks.length} {__("tasks")}
                </span>
              )}
              {discussions.length > 0 && (
                <span className="text-sm text-pm-text-muted flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {discussions.length} {__("discussions")}
                </span>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label={__("More actions")}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEditMilestone && (
                <DropdownMenuItem onClick={() => onEdit(milestone)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  {__("Edit")}
                </DropdownMenuItem>
              )}
              {canEditMilestone && (
                <DropdownMenuItem onClick={() => onImportTasks(milestone)}>
                  <ListChecks className="h-4 w-4 mr-2" />
                  {__("Link Tasks")}
                </DropdownMenuItem>
              )}
              {canEditMilestone && (
                <DropdownMenuItem onClick={handleToggleStatus}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isComplete ? __("Mark Incomplete") : __("Mark Complete")}
                </DropdownMenuItem>
              )}
              {canEditMilestone && userCan('view_private_milestone') && (
                <DropdownMenuItem
                  onClick={() => isPro && handleTogglePrivacy()}
                  disabled={!isPro}
                >
                  {milestone.meta?.privacy ? (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      {__("Make Public")}
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      {__("Make Private")}
                    </>
                  )}
                  {!isPro && <ProBadge className="ml-auto" />}
                </DropdownMenuItem>
              )}
              {canDeleteMilestone && <DropdownMenuSeparator />}
              {canDeleteMilestone && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {__("Delete")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      {hasDetails && (
        <>
          <Separator />
          <div className={cn(
            "bg-muted/10 px-4 py-3 grid gap-4",
            directTasks.length > 0 && discussions.length > 0
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1",
          )}>
            {directTasks.length > 0 && (() => {
              const incompleteTasks = directTasks.filter((t) => t.status !== 1 && t.status !== "1" && t.status !== "complete");
              const completedTasks = directTasks.filter((t) => t.status === 1 || t.status === "1" || t.status === "complete");
              const taskAssignees = (task) => task.assignees?.data ?? [];
              const taskDateStr = (val) => {
                if (!val) return "";
                if (typeof val === "string") return val.substring(0, 10);
                if (typeof val === "object" && val.date) return val.date.substring(0, 10);
                return "";
              };
              const taskEstTime = (task) => {
                const m = parseInt(task.estimation) || 0;
                if (!m) return null;
                const h = Math.floor(m / 60);
                const mm = m % 60;
                return `${h}:${String(mm).padStart(2, "0")}`;
              };
              const renderTask = (task, taskComplete) => {
                const assignees = taskAssignees(task);
                const startDate = taskDateStr(task.start_at);
                const dueDate = taskDateStr(task.due_date);
                const est = taskEstTime(task);
                return (
                  <li key={task.id} className={cn("group flex items-center gap-2 py-2 px-3 rounded hover:bg-muted/30", taskComplete && "opacity-60")}>
                    <TaskCheckbox complete={taskComplete} onClick={() => handleToggleTaskStatus(task)} />
                    <button
                      type="button"
                      onClick={() => handleOpenTask(task)}
                      className={cn("text-sm truncate flex-1 text-left hover:text-pm-accent transition-colors", taskComplete && "line-through text-pm-text-muted")}
                    >
                      {task.title}
                    </button>
                    {assignees.length > 0 && (
                      <div className="flex -space-x-1.5 shrink-0">
                        {assignees.slice(0, 3).map((u) => (
                          <UserAvatar key={u.id} user={u} size="sm" className="border border-white" />
                        ))}
                        {assignees.length > 3 && <span className="text-[11px] text-pm-text-muted ml-1">+{assignees.length - 3}</span>}
                      </div>
                    )}
                    {task.type && (
                      <Badge variant="outline" className="text-[11px] px-1.5 py-0 shrink-0">{task.type.title}</Badge>
                    )}
                    {(startDate || dueDate) && (
                      <div className="hidden sm:flex items-center gap-1 text-[13px] text-pm-text-muted shrink-0">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{startDate || dueDate}</span>
                        {startDate && dueDate && <><span>–</span><span>{dueDate}</span></>}
                      </div>
                    )}
                    {est && (
                      <div className="hidden sm:flex items-center gap-0.5 text-[13px] text-pm-text-muted shrink-0">
                        <Timer className="h-3.5 w-3.5" />
                        <span>{est}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="h-5 w-5 rounded flex items-center justify-center text-pm-text-muted/30 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      onClick={() => handleUnlinkTask(task)}
                      title={__("Unlink from milestone")}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </li>
                );
              };
              return (
                <div>
                  <button
                    type="button"
                    onClick={setTasksExpanded}
                    className="flex items-center gap-1 mb-2 w-full text-left"
                  >
                    <ChevronDown className={cn("h-3.5 w-3.5 text-pm-text-muted/70 transition-transform", !tasksExpanded && "-rotate-90")} />
                    <h5 className="text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70 flex items-center gap-1">
                      <ListChecks className="h-3 w-3" />
                      {__("Tasks")}
                      <span className="text-[10px] font-normal">({directTasks.length})</span>
                    </h5>
                  </button>
                  {tasksExpanded && (
                    <>
                      {incompleteTasks.length > 0 && (
                        <div className="mb-3">
                          <div className="text-[14px] font-semibold uppercase text-pm-text-muted mb-1">{__("Incomplete")} ({incompleteTasks.length})</div>
                          <ul className="space-y-0.5">
                            {incompleteTasks.map((task) => renderTask(task, false))}
                          </ul>
                        </div>
                      )}
                      {completedTasks.length > 0 && (
                        <div>
                          <div className="text-[14px] font-semibold uppercase text-pm-text-muted mb-1">{__("Completed")} ({completedTasks.length})</div>
                          <ul className="space-y-0.5">
                            {completedTasks.map((task) => renderTask(task, true))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })()}

            {discussions.length > 0 && (
              <div>
                <h5 className="text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70 mb-2 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {__("Discussions")}
                </h5>
                <ul className="space-y-1.5">
                  {discussions.map((disc) => {
                    const commentCount = disc.meta?.total_comments ?? 0;
                    return (
                      <li key={disc.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-sm text-pm-accent hover:underline truncate text-left flex-1 min-w-0"
                          onClick={() =>
                            navigate(`/projects/${projectId}/discussions/${disc.id}`)
                          }
                        >
                          {disc.title}
                        </button>
                        {commentCount > 0 && (
                          <span className="flex items-center gap-0.5 text-[12px] text-pm-text-muted shrink-0">
                            <MessageSquare className="h-3 w-3" />
                            {commentCount}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
