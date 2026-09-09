import { __ } from '@wordpress/i18n';
import React, { useCallback, useState } from 'react'
import { useAppDispatch } from '@store/index'
import { changeTaskStatus, deleteTask, duplicateTask, openTaskSheet } from '@store/tasksSlice'
import { toggleTaskInList, removeTaskFromList, addTaskToList, updateTaskPrivacy } from '@store/taskListsSlice'
import { cn } from '@lib/utils'
import { isPrivate as checkPrivate } from '@lib/pm-utils'
import { useToast } from '@hooks/useToast'
import { useApi } from '@hooks/useApi'
import { usePermissions } from '@hooks/usePermissions'
import { useCurrentProject } from '@hooks/useCurrentProject'
import { Button } from '@components/ui/button'
import { Avatar, AvatarFallback } from '@components/ui/avatar'
import { UserAvatar } from '@components/common/UserAvatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { Badge } from '@components/ui/badge'
import { Progress } from '@components/ui/progress'
import TaskLabelBadges from '@components/tasks/TaskLabelBadges'
import TaskStatusCircle from '@components/common/TaskStatusCircle'
import { Calendar, MessageSquare, MoreHorizontal, Lock, Copy, Trash2, Flag, ArrowRightLeft, GripVertical, Pencil, Lock as LockIcon, Unlock, Crown, Github, Layers } from 'lucide-react'
import MoveTaskDialog from './MoveTaskDialog'
import {
  isTaskComplete,
  formatPmDate,
  dueDateColorClass,
  isOverdue,
  taskPriority,
} from '@lib/pm-utils'

// Shared column grid template — header row (TaskListSection) + task rows must match.
// Task | Type | Labels | Description | Assignee | Due | Priority | Progress | Actions
export const TASK_GRID = 'grid-cols-[minmax(200px,1.8fr)_100px_minmax(120px,1.2fr)_minmax(150px,1.4fr)_120px_150px_120px_minmax(110px,0.9fr)_44px]'

// ── Component ────────────────────────────────────────

export default function TaskRow({ task, projectId, listId, draggable: isDraggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragOver, showLabels }) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const api = useApi()
  const project = useCurrentProject(projectId)
  const { isPro, canEditTask, canCompleteTask } = usePermissions(project)
  const mayEdit = canEditTask(task)
  const mayComplete = canCompleteTask(task)
  const [toggling, setToggling] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)

  const isComplete = isTaskComplete(task.status)
  const assignees = Array.isArray(task.assignees)
    ? task.assignees
    : (task.assignees?.data) ?? []
  const visibleAssignees = assignees.slice(0, 3)
  const overflow = assignees.length - 3
  const dueDateStr = formatPmDate(task.due_date)

  const handleToggle = useCallback(async () => {
    if (toggling || !mayComplete) return
    setToggling(true)
    const newStatus = isComplete ? 0 : 1
    dispatch(toggleTaskInList({ listId, taskId: task.id, newStatus }))
    try {
      await dispatch(changeTaskStatus({ projectId, taskId: task.id, status: newStatus })).unwrap()
      toast.success(newStatus === 1 ? __('Task completed', 'wedevs-project-manager') : __('Task reopened', 'wedevs-project-manager'))
    } catch {
      dispatch(toggleTaskInList({ listId, taskId: task.id, newStatus: isComplete ? 1 : 0 }))
      toast.error(__('Failed to update task status', 'wedevs-project-manager'))
    }
    setToggling(false)
  }, [dispatch, projectId, task.id, listId, isComplete, toggling, toast, __, mayComplete])

  const handleOpen = useCallback(() => {
    dispatch(openTaskSheet(task))
  }, [dispatch, task])

  const handleDelete = useCallback(async () => {
    dispatch(removeTaskFromList({ listId, taskId: task.id }))
    try {
      await dispatch(deleteTask({ projectId, taskId: task.id })).unwrap()
      toast.success(__('Task deleted', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to delete task', 'wedevs-project-manager'))
    }
  }, [dispatch, projectId, task.id, listId, toast, __])

  const handleDuplicate = useCallback(async () => {
    try {
      const result = await dispatch(duplicateTask(task.id)).unwrap()
      if (result?.task) {
        dispatch(addTaskToList({ listId: result.listId ?? listId, task: result.task }))
        toast.success(__('Task duplicated', 'wedevs-project-manager'))
      }
    } catch {
      toast.error(__('Failed to duplicate task', 'wedevs-project-manager'))
    }
  }, [dispatch, task.id, listId, toast, __])

  const taskIsPrivate = checkPrivate(task.meta?.privacy)

  const handleTogglePrivacy = useCallback(async () => {
    const newPrivacy = taskIsPrivate ? 0 : 1
    dispatch(updateTaskPrivacy({ taskId: task.id, privacy: newPrivacy }))
    try {
      await api.post(`projects/${projectId}/tasks/privacy/${task.id}`, { is_private: newPrivacy })
      toast.success(newPrivacy ? __('Set to private', 'wedevs-project-manager') : __('Set to public', 'wedevs-project-manager'))
    } catch {
      dispatch(updateTaskPrivacy({ taskId: task.id, privacy: taskIsPrivate ? 1 : 0 }))
      toast.error(__('Failed to update privacy', 'wedevs-project-manager'))
    }
  }, [api, projectId, task.id, taskIsPrivate, dispatch, toast, __])

  const handleMoved = useCallback((taskId, fromListId, toListId) => {
    dispatch(removeTaskFromList({ listId: fromListId, taskId }))
  }, [dispatch])

  const priority = taskPriority(task.priority)
  const priorityPill = priority === 'high'
    ? 'bg-red-100 text-red-700'
    : priority === 'medium'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-emerald-100 text-emerald-700'
  const priorityLabel = priority === 'high'
    ? __('High', 'wedevs-project-manager')
    : priority === 'medium'
      ? __('Medium', 'wedevs-project-manager')
      : __('Low', 'wedevs-project-manager')

  const descText = (task.description?.content || task.description?.html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const progressPct = isComplete ? 100 : 0

  return (
    <div
      className={cn(
        'group grid items-center gap-2 px-4 py-3.5 border-b border-border/40 last:border-b-0',
        TASK_GRID,
        'hover:bg-muted/20 transition-colors',
        isComplete && 'opacity-60',
        isDragOver && 'border-t-2 border-t-pm-accent',
      )}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {/* Col 1 — Task name + inline meta */}
      <div className="flex items-center gap-2 min-w-0">
        {isDraggable && (
          <GripVertical className="h-4 w-4 text-pm-text-muted/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />
        )}
        <button
          type="button"
          onClick={handleToggle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="shrink-0 focus:outline-none"
          disabled={toggling}
        >
          <TaskStatusCircle complete={isComplete} hovered={hovered} />
        </button>
        <button
          type="button"
          className={cn(
            'min-w-0 text-left text-sm text-pm-text-primary truncate hover:text-pm-accent transition-colors',
            isComplete && 'line-through text-pm-text-muted',
          )}
          onClick={handleOpen}
        >
          {task.title}
        </button>
        {task.github_issue && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="shrink-0">
                  <Github className="h-4 w-4 text-pm-text-muted" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{task.github_issue.source}{task.github_issue.issue_number ? ` #${task.github_issue.issue_number}` : ''}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {(task.meta?.total_sub_task ?? 0) > 0 && (
          <span className="flex items-center gap-0.5 text-[12px] text-pm-text-muted shrink-0">
            <Layers className="h-4 w-4" />
            {task.meta.total_sub_task}
          </span>
        )}
        {(task.meta?.total_comment ?? 0) > 0 && (
          <span className="flex items-center gap-0.5 text-[12px] text-pm-text-muted shrink-0">
            <MessageSquare className="h-4 w-4" />
            {task.meta?.total_comment}
          </span>
        )}
        {taskIsPrivate && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Lock className="h-4 w-4 text-amber-500 shrink-0" />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[12px]">
                {__('Private task', 'wedevs-project-manager')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Col 2 — Type */}
      <div className="min-w-0">
        {task.type?.title ? (
          <Badge variant="outline" className="max-w-full truncate text-[11px] px-2 py-0.5 h-auto font-normal text-muted-foreground">
            {task.type.title}
          </Badge>
        ) : (
          <span className="text-[13px] text-pm-text-muted">—</span>
        )}
      </div>

      {/* Col 3 — Labels */}
      <div className="flex items-center gap-1 flex-wrap min-w-0 overflow-hidden">
        {showLabels && <TaskLabelBadges task={task} variant="full" />}
      </div>

      {/* Col 4 — Description */}
      <div className="min-w-0 text-[13px] text-pm-text-muted truncate">
        {descText || '—'}
      </div>

      {/* Col 5 — Assignee */}
      <div className="flex items-center -space-x-1.5 min-w-0">
        {visibleAssignees.length > 0 ? (
          <>
            {visibleAssignees.map((user) => (
              <UserAvatar key={user.id} user={user} size="md" className="border-2 border-background" />
            ))}
            {overflow > 0 && (
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-[11px] bg-muted">+{overflow}</AvatarFallback>
              </Avatar>
            )}
          </>
        ) : (
          <span className="text-[13px] text-pm-text-muted">—</span>
        )}
      </div>

      {/* Col 6 — Due date */}
      <div className={cn('flex items-center gap-1 text-[13px] min-w-0', dueDateColorClass(task.due_date))}>
        {dueDateStr ? (
          <>
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {formatPmDate(task.start_at) && !isComplete
                ? `${formatPmDate(task.start_at)} → ${dueDateStr}`
                : dueDateStr}
            </span>
            {isOverdue(task.due_date, task.status) && (
              <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4 shrink-0">
                {__('Overdue', 'wedevs-project-manager')}
              </Badge>
            )}
          </>
        ) : (
          <span className="text-pm-text-muted">—</span>
        )}
      </div>

      {/* Col 7 — Priority */}
      <div className="min-w-0">
        {priority ? (
          <span className={cn('inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[12px] font-medium', priorityPill)}>
            <Flag className="h-4 w-4" />
            {priorityLabel}
          </span>
        ) : (
          <span className="text-[13px] text-pm-text-muted">—</span>
        )}
      </div>

      {/* Col 8 — Progress */}
      <div className="flex items-center gap-2 min-w-0">
        <Progress value={progressPct} className="h-1 flex-1" />
        <span className="text-[11px] font-medium text-pm-text-muted tabular-nums w-8 text-right">{progressPct}%</span>
      </div>

      {/* Col 9 — Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity justify-self-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label={__('Task actions', 'wedevs-project-manager')} variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpen}>
              <Pencil className="h-4 w-4 mr-2" />
              {__('Edit', 'wedevs-project-manager')}
            </DropdownMenuItem>
            {mayEdit && (
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                {__('Duplicate', 'wedevs-project-manager')}
              </DropdownMenuItem>
            )}
            {mayEdit && (
              <DropdownMenuItem onClick={() => setMoveDialogOpen(true)}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                {__('Move', 'wedevs-project-manager')}
              </DropdownMenuItem>
            )}
            {mayEdit && (
              <DropdownMenuItem onClick={() => isPro && handleTogglePrivacy()} disabled={!isPro}>
                {taskIsPrivate ? (
                  <><Unlock className="h-4 w-4 mr-2" />{__('Make Public', 'wedevs-project-manager')}</>
                ) : (
                  <><LockIcon className="h-4 w-4 mr-2" />{__('Make Private', 'wedevs-project-manager')}</>
                )}
                {!isPro && <Crown className="h-4 w-4 ml-auto text-pm-accent" />}
              </DropdownMenuItem>
            )}
            {mayEdit && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {__('Delete', 'wedevs-project-manager')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <MoveTaskDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        task={task}
        projectId={projectId}
        currentListId={listId}
        onMoved={handleMoved}
      />
    </div>
  )
}
