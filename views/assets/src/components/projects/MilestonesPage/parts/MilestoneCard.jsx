import { __ } from '@wordpress/i18n';
import React, { useCallback } from "react";
import { sanitizeHtml } from "@lib/sanitize";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/index";
import {
  fetchMilestones,
  updateMilestone,
  deleteMilestone,
  toggleMilestonePrivacy,
  removeTaskFromMilestone,
} from "@store/milestonesSlice";
import { openTaskSheet, fetchTask } from "@store/tasksSlice";
import { useApi } from "@hooks/useApi";
import { useToast } from "@hooks/useToast";
import { useConfirm } from "@hooks/useConfirm";
import { usePermissions } from "@hooks/usePermissions";
import { useCurrentProject } from "@hooks/useCurrentProject";
import { cn } from "@lib/utils";
import { formatPmDateTime, isOverdue, isPrivate as checkPrivate, dueDateColorClass, taskPriority } from "@lib/pm-utils";
import TaskLabelBadges from "@components/tasks/TaskLabelBadges";
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
  ListChecks, ChevronDown, Calendar, Timer, Flag, Layers,
} from "lucide-react";
import TaskCheckbox from "./TaskCheckbox";
import MilestoneHealthBadge from "./MilestoneHealthBadge";
import MilestoneProgress from "./MilestoneProgress";
import { TASK_GRID } from "@components/tasks/TaskRow";
import { Progress } from "@components/ui/progress";
import { AlignLeft, Users as UsersIcon, BarChart3, Tag, Paperclip } from "lucide-react";

export default function MilestoneCard({ milestone, projectId, onEdit, onImportTasks, expanded, onToggleExpanded, onTaskOpen }) {
  const api = useApi();
  const toast = useToast();
  const [ConfirmDialog, confirm] = useConfirm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager, currentUserId } = usePermissions(project);
  // No edit_milestone/delete_milestone capability exists — milestone edit/delete
  // is manager-or-creator (Vue can_edit_milestone parity). The bogus userCan keys
  // always returned false.
  const creatorId = milestone?.creator?.data?.id ?? milestone?.created_by ?? milestone?.creator?.id;
  const canEditMilestone =
    isManager ||
    (currentUserId && creatorId && String(currentUserId) === String(creatorId));
  const canDeleteMilestone = canEditMilestone;

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
      dispatch(openTaskSheet({ ...task, project_id: pid }));
    },
    [dispatch, projectId, onTaskOpen, milestone.id],
  );

  const handleUnlinkTask = useCallback(
    async (task) => {
      const ok = await confirm(__("Remove this task from the milestone?", 'wedevs-project-manager'), __("Unlink Task", 'wedevs-project-manager'));
      if (!ok) return;
      dispatch(removeTaskFromMilestone({ milestoneId: milestone.id, taskId: task.id }));
      try {
        await api.post(`projects/${projectId}/milestones/${milestone.id}/detach-task/${task.id}`);
        toast.success(__("Task unlinked", 'wedevs-project-manager'));
      } catch {
        dispatch(fetchMilestones({ projectId }));
        toast.error(__("Failed to unlink task", 'wedevs-project-manager'));
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
        toast.success(newStatus === 1 ? __("Task completed", 'wedevs-project-manager') : __("Task reopened", 'wedevs-project-manager'));
      } catch {
        toast.error(__("Failed to update task status", 'wedevs-project-manager'));
      }
    },
    [projectId, api, toast, __, dispatch],
  );

  const handleDelete = useCallback(async () => {
    const ok = await confirm(__("Are you sure?", 'wedevs-project-manager'), __("Delete Milestone", 'wedevs-project-manager'));
    if (!ok) return;
    try {
      await dispatch(
        deleteMilestone({ projectId, milestoneId: milestone.id }),
      ).unwrap();
      toast.success(__("Milestone deleted", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Failed to delete", 'wedevs-project-manager'));
    }
  }, [dispatch, projectId, milestone.id, toast, __]);

  const handleToggleStatus = useCallback(async () => {
    if (!canEditMilestone) return;
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
          ? __("Milestone marked as complete", 'wedevs-project-manager')
          : __("Milestone marked as incomplete", 'wedevs-project-manager'),
      );
    } catch {
      toast.error(__("Failed to update status", 'wedevs-project-manager'));
    }
  }, [dispatch, projectId, milestone, isComplete, toast, __, canEditMilestone]);

  const handleTogglePrivacy = useCallback(async () => {
    const newPrivacy = checkPrivate(milestone.meta?.privacy) ? 0 : 1;
    try {
      await dispatch(
        toggleMilestonePrivacy({
          projectId,
          milestoneId: milestone.id,
          isPrivate: newPrivacy,
        }),
      ).unwrap();
      toast.success(newPrivacy ? __("Milestone set to private", 'wedevs-project-manager') : __("Milestone set to public", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Failed to update", 'wedevs-project-manager'));
    }
  }, [dispatch, projectId, milestone, toast, __]);

  return (
    <>
    <ConfirmDialog />
    <Card className="overflow-hidden rounded-xl hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={!canEditMilestone}
            className={cn("shrink-0 mt-0.5", !canEditMilestone && "cursor-default")}
            title={isComplete ? __("Mark Incomplete", 'wedevs-project-manager') : __("Mark Complete", 'wedevs-project-manager')}
          >
            <CheckCircle
              className={cn(
                "h-4 w-4 transition-colors",
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
                  "text-sm font-medium",
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
              {checkPrivate(milestone.meta?.privacy) ? (
                <Lock className="h-4 w-4 text-pm-text-muted" />
              ) : null}
            </div>

            {(typeof milestone.description === 'string' ? milestone.description : milestone.description?.content) && (
              <p className="text-sm text-foreground mt-1 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(typeof milestone.description === 'string' ? milestone.description : milestone.description.content) }}
              />
            )}

            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <MilestoneProgress
                progress={milestone.progress ?? 0}
                taskCount={milestone.task_count}
              />
              {milestone.achieve_date && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-0.5 text-[13px] text-pm-text-muted">
                  <Clock className="h-4 w-4" />
                  {formatPmDateTime(milestone.achieve_date)}
                </span>
              )}
              {directTasks.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-0.5 text-[13px] text-pm-text-muted">
                  <ListChecks className="h-4 w-4" />
                  {directTasks.length} {__("tasks", 'wedevs-project-manager')}
                </span>
              )}
              {discussions.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-0.5 text-[13px] text-pm-text-muted">
                  <MessageSquare className="h-4 w-4" />
                  {discussions.length} {__("discussions", 'wedevs-project-manager')}
                </span>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label={__("More actions", 'wedevs-project-manager')}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEditMilestone && (
                <DropdownMenuItem onClick={() => onEdit(milestone)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  {__("Edit", 'wedevs-project-manager')}
                </DropdownMenuItem>
              )}
              {canEditMilestone && (
                <DropdownMenuItem onClick={() => onImportTasks(milestone)}>
                  <ListChecks className="h-4 w-4 mr-2" />
                  {__("Link Tasks", 'wedevs-project-manager')}
                </DropdownMenuItem>
              )}
              {canEditMilestone && (
                <DropdownMenuItem onClick={handleToggleStatus}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isComplete ? __("Mark Incomplete", 'wedevs-project-manager') : __("Mark Complete", 'wedevs-project-manager')}
                </DropdownMenuItem>
              )}
              {canEditMilestone && userCan('view_private_milestone') && (
                <DropdownMenuItem
                  onClick={() => isPro && handleTogglePrivacy()}
                  disabled={!isPro}
                >
                  {checkPrivate(milestone.meta?.privacy) ? (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      {__("Make Public", 'wedevs-project-manager')}
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      {__("Make Private", 'wedevs-project-manager')}
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
                  {__("Delete", 'wedevs-project-manager')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      {hasDetails && (
        <>
          <Separator />
          <div className="bg-muted/10 px-4 py-3 space-y-4">
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
                const commentCount = parseInt(task.meta?.total_comment ?? task.comments_count ?? 0, 10) || 0;
                const subtaskCount = parseInt(task.meta?.total_sub_task ?? 0, 10) || 0;
                const taskIsPrivate = checkPrivate(task.meta?.privacy);
                const overdueTask = isOverdue(task.due_date, task.status);
                const descText = (task.description?.content || task.description?.html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                const prioSlug = taskPriority(task.priority);
                const prio = prioSlug === 'high'
                  ? { label: __('High', 'wedevs-project-manager'), cls: 'bg-red-100 text-red-700' }
                  : prioSlug === 'medium'
                    ? { label: __('Medium', 'wedevs-project-manager'), cls: 'bg-amber-100 text-amber-700' }
                    : prioSlug === 'low'
                      ? { label: __('Low', 'wedevs-project-manager'), cls: 'bg-emerald-100 text-emerald-700' }
                      : null;
                const progressPct = taskComplete ? 100 : 0;
                return (
                  <div key={task.id} className={cn("group grid items-center gap-2 px-4 py-3 border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors", TASK_GRID, taskComplete && "opacity-60")}>
                    {/* Task */}
                    <div className="flex items-center gap-2 min-w-0">
                      <TaskCheckbox complete={taskComplete} onClick={() => handleToggleTaskStatus(task)} />
                      <button
                        type="button"
                        onClick={() => handleOpenTask(task)}
                        className={cn("min-w-0 text-left text-sm truncate hover:text-pm-accent transition-colors", taskComplete ? "line-through text-pm-text-muted" : "text-pm-text-primary")}
                      >
                        {task.title}
                      </button>
                      {subtaskCount > 0 && (
                        <span className="flex items-center gap-0.5 text-[11px] text-pm-text-muted shrink-0"><Layers className="h-4 w-4" />{subtaskCount}</span>
                      )}
                      {commentCount > 0 && (
                        <span className="flex items-center gap-0.5 text-[11px] text-pm-text-muted shrink-0"><MessageSquare className="h-4 w-4" />{commentCount}</span>
                      )}
                      {taskIsPrivate && <Lock className="h-4 w-4 text-amber-500 shrink-0" />}
                    </div>
                    {/* Type */}
                    <div className="min-w-0">
                      {task.type?.title ? (
                        <Badge variant="outline" className="max-w-full truncate text-[11px] px-2 py-0.5 h-auto font-normal text-muted-foreground">{task.type.title}</Badge>
                      ) : (<span className="text-[13px] text-pm-text-muted">—</span>)}
                    </div>
                    {/* Labels */}
                    <div className="flex items-center gap-1 flex-wrap min-w-0 overflow-hidden"><TaskLabelBadges task={task} variant="full" /></div>
                    {/* Description */}
                    <div className="min-w-0 text-[13px] text-pm-text-muted truncate">{descText || '—'}</div>
                    {/* Assignee */}
                    <div className="flex items-center -space-x-1.5 min-w-0">
                      {assignees.length > 0 ? assignees.slice(0, 3).map((u) => (
                        <UserAvatar key={u.id} user={u} size="md" className="border-2 border-background" />
                      )) : (<span className="text-[13px] text-pm-text-muted">—</span>)}
                    </div>
                    {/* Due */}
                    <div className={cn("flex items-center gap-1 text-[13px] min-w-0", dueDateColorClass(task.due_date))}>
                      {dueDate ? (
                        <>
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span className="truncate">{startDate && !taskComplete ? `${startDate} → ${dueDate}` : dueDate}</span>
                          {overdueTask && <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4 shrink-0">{__("Overdue", 'wedevs-project-manager')}</Badge>}
                        </>
                      ) : (<span className="text-pm-text-muted">—</span>)}
                    </div>
                    {/* Priority */}
                    <div className="min-w-0">
                      {prio ? (
                        <span className={cn("inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[12px] font-medium", prio.cls)}><Flag className="h-4 w-4" />{prio.label}</span>
                      ) : (<span className="text-[13px] text-pm-text-muted">—</span>)}
                    </div>
                    {/* Progress */}
                    <div className="flex items-center gap-2 min-w-0">
                      <Progress value={progressPct} className="h-1 flex-1" />
                      <span className="text-[11px] font-medium text-pm-text-muted tabular-nums w-8 text-right">{progressPct}%</span>
                    </div>
                    {/* Actions — unlink */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity justify-self-end">
                      <button
                        type="button"
                        className="h-6 w-6 rounded flex items-center justify-center text-pm-text-muted/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                        onClick={() => handleUnlinkTask(task)}
                        title={__("Unlink from milestone", 'wedevs-project-manager')}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              };
              const gridHeader = (
                <div className={cn("grid gap-2 px-4 py-2 border-b bg-muted/20 text-[12px] font-medium uppercase tracking-wide text-muted-foreground/70", TASK_GRID)}>
                  <div className="flex items-center gap-1.5"><ListChecks className="h-4 w-4" />{__("Task", 'wedevs-project-manager')}</div>
                  <div className="flex items-center gap-1.5"><Tag className="h-4 w-4" />{__("Type", 'wedevs-project-manager')}</div>
                  <div className="flex items-center gap-1.5"><Tag className="h-4 w-4" />{__("Labels", 'wedevs-project-manager')}</div>
                  <div className="flex items-center gap-1.5"><AlignLeft className="h-4 w-4" />{__("Description", 'wedevs-project-manager')}</div>
                  <div className="flex items-center gap-1.5"><UsersIcon className="h-4 w-4" />{__("Assignee", 'wedevs-project-manager')}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{__("Due Date", 'wedevs-project-manager')}</div>
                  <div className="flex items-center gap-1.5"><Flag className="h-4 w-4" />{__("Priority", 'wedevs-project-manager')}</div>
                  <div className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4" />{__("Progress", 'wedevs-project-manager')}</div>
                  <div></div>
                </div>
              );
              return (
                <div>
                  <button
                    type="button"
                    onClick={setTasksExpanded}
                    className="flex items-center gap-1 mb-2 w-full text-left"
                  >
                    <ChevronDown className={cn("h-4 w-4 text-pm-text-muted/70 transition-transform", !tasksExpanded && "-rotate-90")} />
                    <h5 className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground/70 flex items-center gap-1">
                      <ListChecks className="h-4 w-4" />
                      {__("Tasks", 'wedevs-project-manager')}
                      <span className="text-[10px] font-normal">({directTasks.length})</span>
                    </h5>
                  </button>
                  {tasksExpanded && (
                    <div className="space-y-3">
                      {incompleteTasks.length > 0 && (
                        <div>
                          <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 text-amber-700 px-2.5 py-0.5 text-[12px] font-medium uppercase tracking-wide mb-1.5"><Clock className="h-4 w-4" />{__("Pending", 'wedevs-project-manager')} ({incompleteTasks.length})</div>
                          <div className="rounded-lg border bg-card overflow-hidden">
                            <div className="overflow-x-auto"><div className="min-w-[1120px]">
                              {gridHeader}
                              {incompleteTasks.map((task) => renderTask(task, false))}
                            </div></div>
                          </div>
                        </div>
                      )}
                      {completedTasks.length > 0 && (
                        <div>
                          <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-[12px] font-medium uppercase tracking-wide mb-1.5"><CheckCircle className="h-4 w-4" />{__("Completed", 'wedevs-project-manager')} ({completedTasks.length})</div>
                          <div className="rounded-lg border bg-card overflow-hidden">
                            <div className="overflow-x-auto"><div className="min-w-[1120px]">
                              {gridHeader}
                              {completedTasks.map((task) => renderTask(task, true))}
                            </div></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {discussions.length > 0 && (
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-100 text-blue-700 px-2.5 py-0.5 text-[12px] font-medium uppercase tracking-wide mb-1.5">
                  <MessageSquare className="h-4 w-4" />
                  {__("Discussions", 'wedevs-project-manager')} ({discussions.length})
                </div>
                <div className="rounded-lg border bg-card overflow-hidden divide-y divide-border/40">
                  {discussions.map((disc) => {
                    const commentCount = disc.meta?.total_comments ?? disc.meta?.total_comment ?? 0;
                    const discCreator = disc.creator?.data;
                    const discDate = disc.created_at;
                    const fileCount = disc.meta?.total_files ?? 0;
                    return (
                      <button
                        key={disc.id}
                        type="button"
                        className="group w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
                        onClick={() => navigate(`/projects/${projectId}/discussions/${disc.id}`)}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-500 shrink-0">
                          <MessageSquare className="h-4 w-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-pm-text-primary truncate group-hover:text-pm-accent transition-colors">
                            {disc.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5 text-[12px] text-pm-text-muted">
                            {discCreator && (
                              <span className="inline-flex items-center gap-1.5 min-w-0">
                                <UserAvatar user={discCreator} size="xs" />
                                <span className="truncate">{discCreator.display_name}</span>
                              </span>
                            )}
                            {discDate && (
                              <span className="inline-flex items-center gap-1 shrink-0"><Calendar className="h-4 w-4" />{formatPmDateTime(discDate)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {fileCount > 0 && (
                            <span className="flex items-center gap-1 text-[13px] text-pm-text-muted"><Paperclip className="h-4 w-4" />{fileCount}</span>
                          )}
                          {commentCount > 0 && (
                            <span className="flex items-center gap-1 text-[13px] text-pm-text-muted"><MessageSquare className="h-4 w-4" />{commentCount}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
    </>
  );
}
