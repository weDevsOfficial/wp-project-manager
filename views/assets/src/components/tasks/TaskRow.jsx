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
import TaskLabelBadges from '@components/tasks/TaskLabelBadges'
import {
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Copy,
  Trash2,
  Flag,
  Check,
  ArrowRightLeft,
  GripVertical,
  Pencil,
  Lock as LockIcon,
  Unlock,
  Crown,
  Github,
} from 'lucide-react'
import MoveTaskDialog from './MoveTaskDialog'
import {
  isTaskComplete,
  formatPmDate,
  isOverdue,
} from '@lib/pm-utils'

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

  const handleToggle = useCallback(async (e) => {
    e.stopPropagation()
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

  const priorityColor = task.priority >= 3 ? 'text-rose-500' : task.priority === 2 ? 'text-amber-500' : task.priority === 1 ? 'text-sky-500' : 'text-pm-text-muted'

  return (
    <div
      className={cn(
        'group flex items-center gap-4 px-6 py-3.5 transition-all duration-200 border-b border-pm-border last:border-b-0',
        'hover:bg-pm-accent/[0.02] dark:hover:bg-pm-accent/[0.05]',
        isComplete && 'opacity-60',
        isDragOver && 'bg-pm-accent/5 ring-1 ring-pm-accent ring-inset',
      )}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onClick={handleOpen}
    >
      {/* Drag handle */}
      {isDraggable && (
        <GripVertical className="h-4 w-4 text-pm-text-muted/20 group-hover:text-pm-text-muted/50 transition-colors cursor-grab shrink-0 -ml-2" />
      )}

      {/* Checkbox */}
      <button
        type="button"
        onClick={handleToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative shrink-0 focus:outline-none z-10"
        disabled={toggling}
      >
        <div className={cn(
          "flex items-center justify-center h-5 w-5 rounded-full border-2 transition-all duration-300",
          isComplete 
            ? "bg-pm-accent border-pm-accent scale-100" 
            : hovered 
              ? "border-pm-accent bg-pm-accent/5 scale-110" 
              : "border-pm-text-muted/30 scale-100"
        )}>
          {isComplete ? (
            <Check className="h-3 w-3 text-white" strokeWidth={4} />
          ) : hovered ? (
            <Check className="h-3 w-3 text-pm-accent opacity-50" strokeWidth={4} />
          ) : null}
        </div>
      </button>

      {/* Title & Info */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-[15px] font-medium transition-all truncate',
            isComplete ? 'text-pm-text-muted line-through' : 'text-pm-text-primary group-hover:text-pm-accent'
          )}>
            {task.title}
          </span>
          {task.meta?.privacy === 1 && <LockIcon className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
        </div>
        
        <div className="flex items-center gap-3 text-xs text-pm-text-muted">
           {/* Task type */}
          {task.type?.title && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pm-accent/40" />
              {task.type.title}
            </span>
          )}

          {/* GitHub info */}
          {task.github_issue && (
            <span className="flex items-center gap-1">
              <Github className="h-3 w-3" />
              {task.github_issue.issue_number ? `#${task.github_issue.issue_number}` : task.github_issue.source}
            </span>
          )}
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="hidden lg:flex items-center gap-1.5">
          <TaskLabelBadges task={task} variant="compact" />
        </div>
      )}

      {/* Right Actions / Info */}
      <div className="flex items-center gap-6 shrink-0">
        {/* Priority */}
        {task.priority > 0 && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn('p-1.5 rounded-lg bg-current/5', priorityColor)}>
                  <Flag className="h-4 w-4" fill="currentColor" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-semibold">{task.priority >= 3 ? __('Urgent', 'wedevs-project-manager') : task.priority === 2 ? __('High', 'wedevs-project-manager') : __('Normal', 'wedevs-project-manager')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Due date */}
        {dueDateStr && (
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-xl text-[13px] font-semibold border transition-colors',
            isOverdue(task.due_date, task.status)
              ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/50"
              : "bg-pm-surface border-pm-border text-pm-text-muted"
          )}>
            <Calendar className="h-3.5 w-3.5" />
            {dueDateStr}
          </div>
        )}

        {/* Comment count */}
        <span className="flex items-center gap-[5px] text-xs text-pm-text-muted bg-[#f1e8ff] rounded-[4px] px-[6px] py-[6px]">
          <MessageSquare className="h-3.5 w-3.5 text-pm-accent" />
          {task.meta?.total_comment ?? 0}
        </span>

        {/* Assignees */}
        {visibleAssignees.length > 0 && (
          <div className="flex items-center -space-x-2">
            {visibleAssignees.map((user) => (
              <div key={user.id} className="relative transition-transform hover:scale-110 hover:z-20">
                <UserAvatar user={user} size="sm" className="ring-2 ring-white dark:ring-slate-900" />
              </div>
            ))}
            {overflow > 0 && (
              <div className="h-7 w-7 rounded-full bg-pm-surface border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-pm-text-muted">
                +{overflow}
              </div>
            )}
          </div>
        )}

        {/* Menu */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-pm-accent/10 hover:text-pm-accent"
                onClick={e => e.stopPropagation()}
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-pm-border">
              <DropdownMenuItem onClick={handleOpen} className="rounded-lg">
                <Pencil className="h-4 w-4 mr-2" />
                {__('Edit Task', 'wedevs-project-manager')}
              </DropdownMenuItem>
              {mayEdit && (
                <DropdownMenuItem onClick={handleDuplicate} className="rounded-lg">
                  <Copy className="h-4 w-4 mr-2" />
                  {__('Duplicate', 'wedevs-project-manager')}
                </DropdownMenuItem>
              )}
              {mayEdit && (
                <DropdownMenuItem onClick={() => setMoveDialogOpen(true)} className="rounded-lg">
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  {__('Move Task', 'wedevs-project-manager')}
                </DropdownMenuItem>
              )}
              {mayEdit && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); isPro && handleTogglePrivacy() }} disabled={!isPro} className="rounded-lg">
                  {taskIsPrivate ? (
                    <><Unlock className="h-4 w-4 mr-2" />{__('Make Public', 'wedevs-project-manager')}</>
                  ) : (
                    <><LockIcon className="h-4 w-4 mr-2" />{__('Make Private', 'wedevs-project-manager')}</>
                  )}
                  {!isPro && <Crown className="h-3.5 w-3.5 ml-auto text-pm-accent" />}
                </DropdownMenuItem>
              )}
              {mayEdit && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/5 rounded-lg"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {__('Delete Task', 'wedevs-project-manager')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
