import React, { useCallback, useState } from 'react'
import { useAppDispatch } from '@store/index'
import { changeTaskStatus, deleteTask, duplicateTask, openTaskSheet } from '@store/tasksSlice'
import { toggleTaskInList, removeTaskFromList, addTaskToList, updateTaskPrivacy } from '@store/taskListsSlice'
import { cn } from '@lib/utils'
import { isPrivate as checkPrivate } from '@lib/pm-utils'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { useApi } from '@hooks/useApi'
import { usePermissions } from '@hooks/usePermissions'
import { Button } from '@components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
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
import TaskLabelBadges from '@components/tasks/TaskLabelBadges'
import {
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Lock,
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
  dueDateColorClass,
  userInitials,
  isOverdue,
} from '@lib/pm-utils'

// ── Component ────────────────────────────────────────

export default function TaskRow({ task, projectId, listId, draggable: isDraggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragOver, showLabels }) {
  const dispatch = useAppDispatch()
  const { __ } = useI18n()
  const toast = useToast()
  const api = useApi()
  const { isPro } = usePermissions()
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
    if (toggling) return
    setToggling(true)
    const newStatus = isComplete ? 0 : 1
    dispatch(toggleTaskInList({ listId, taskId: task.id, newStatus }))
    try {
      await dispatch(changeTaskStatus({ projectId, taskId: task.id, status: newStatus })).unwrap()
      toast.success(newStatus === 1 ? __('Task completed') : __('Task reopened'))
    } catch {
      dispatch(toggleTaskInList({ listId, taskId: task.id, newStatus: isComplete ? 1 : 0 }))
      toast.error(__('Failed to update task status'))
    }
    setToggling(false)
  }, [dispatch, projectId, task.id, listId, isComplete, toggling, toast, __])

  const handleOpen = useCallback(() => {
    dispatch(openTaskSheet(task))
  }, [dispatch, task])

  const handleDelete = useCallback(async () => {
    dispatch(removeTaskFromList({ listId, taskId: task.id }))
    try {
      await dispatch(deleteTask({ projectId, taskId: task.id })).unwrap()
      toast.success(__('Task deleted'))
    } catch {
      toast.error(__('Failed to delete task'))
    }
  }, [dispatch, projectId, task.id, listId, toast, __])

  const handleDuplicate = useCallback(async () => {
    try {
      const result = await dispatch(duplicateTask(task.id)).unwrap()
      if (result?.task) {
        dispatch(addTaskToList({ listId: result.listId ?? listId, task: result.task }))
        toast.success(__('Task duplicated'))
      }
    } catch {
      toast.error(__('Failed to duplicate task'))
    }
  }, [dispatch, task.id, listId, toast, __])

  const taskIsPrivate = checkPrivate(task.meta?.privacy)

  const handleTogglePrivacy = useCallback(async () => {
    const newPrivacy = taskIsPrivate ? 0 : 1
    dispatch(updateTaskPrivacy({ taskId: task.id, privacy: newPrivacy }))
    try {
      await api.post(`projects/${projectId}/tasks/privacy/${task.id}`, { is_private: newPrivacy })
      toast.success(newPrivacy ? __('Set to private') : __('Set to public'))
    } catch {
      dispatch(updateTaskPrivacy({ taskId: task.id, privacy: taskIsPrivate ? 1 : 0 }))
      toast.error(__('Failed to update privacy'))
    }
  }, [api, projectId, task.id, taskIsPrivate, dispatch, toast, __])

  const handleMoved = useCallback((taskId, fromListId, toListId) => {
    dispatch(removeTaskFromList({ listId: fromListId, taskId }))
  }, [dispatch])

  const priorityColor = task.priority >= 3 ? 'text-red-500' : task.priority === 2 ? 'text-amber-500' : task.priority === 1 ? 'text-blue-500' : ''

  return (
    <div
      className={cn(
        'group flex items-center gap-2.5 px-3 py-2 border-b border-border/40 last:border-b-0',
        'hover:bg-muted/20 transition-colors',
        isComplete && 'opacity-50',
        isDragOver && 'border-t-2 border-t-pm-accent',
      )}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {/* Drag handle */}
      {isDraggable && (
        <GripVertical className="h-4 w-4 text-pm-text-muted/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />
      )}

      {/* ClickUp-style circle checkbox */}
      <button
        type="button"
        onClick={handleToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="shrink-0 focus:outline-none"
        disabled={toggling}
      >
        {isComplete ? (
          /* Filled circle with check — uses brand color */
          <span className="flex items-center justify-center h-[18px] w-[18px] rounded-full bg-pm-accent text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        ) : hovered ? (
          /* Solid border on hover */
          <span className="flex items-center justify-center h-[18px] w-[18px] rounded-full border-2 border-pm-accent text-pm-accent">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        ) : (
          /* Dashed border — pending state */
          <span className="h-[18px] w-[18px] rounded-full border-[1.5px] border-dashed border-pm-text-muted/40 block" />
        )}
      </button>

      {/* Title */}
      <button
        type="button"
        className={cn(
          'flex-1 text-left text-sm text-pm-text-primary truncate hover:text-pm-accent transition-colors',
          isComplete && 'line-through text-pm-text-muted',
        )}
        onClick={handleOpen}
      >
        {task.title}
      </button>

      {/* Task type pill */}
      {task.type?.title && (
        <Badge variant="outline" className="text-[14px] px-1.5 py-0 h-4 shrink-0 font-normal text-muted-foreground">
          {task.type.title}
        </Badge>
      )}

      {/* GitHub/Bitbucket sync indicator */}
      {task.github_issue && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="shrink-0">
                <Github className="h-3.5 w-3.5 text-pm-text-muted" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{task.github_issue.source}{task.github_issue.issue_number ? ` #${task.github_issue.issue_number}` : ''}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Labels (when "Show Labels in Tasks List" is enabled in project settings) */}
      {showLabels && <TaskLabelBadges task={task} variant="full" />}

      {/* Priority flag */}
      {task.priority > 0 && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="shrink-0">
                <Flag className={cn('h-4 w-4', priorityColor)} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{task.priority >= 3 ? __('Urgent') : task.priority === 2 ? __('High') : __('Normal')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Assignees */}
      {visibleAssignees.length > 0 && (
        <div className="flex items-center -space-x-1.5 shrink-0">
          {visibleAssignees.map((user) => (
            <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
              <AvatarImage src={user.avatar_url} alt={user.display_name} />
              <AvatarFallback className="text-[11px]">
                {userInitials(user.display_name)}
              </AvatarFallback>
            </Avatar>
          ))}
          {overflow > 0 && (
            <Avatar className="h-6 w-6 border-2 border-background">
              <AvatarFallback className="text-[11px] bg-muted">+{overflow}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      {/* Due date + overdue badge */}
      {dueDateStr && (
        <span className={cn('flex items-center gap-1 text-[15px] shrink-0', dueDateColorClass(task.due_date))}>
          <Calendar className="h-3.5 w-3.5" />
          {formatPmDate(task.start_at) && !isComplete
            ? `${formatPmDate(task.start_at)} → ${dueDateStr}`
            : dueDateStr}
        </span>
      )}
      {isOverdue(task.due_date, task.status) && (
        <Badge variant="destructive" className="text-[11px] px-1.5 py-0 h-4 shrink-0">
          Overdue
        </Badge>
      )}

      {/* Comment count */}
      {(task.meta?.total_comment ?? 0) > 0 && (
        <span className="flex items-center gap-0.5 text-[15px] text-pm-text-muted shrink-0">
          <MessageSquare className="h-3.5 w-3.5" />
          {task.meta?.total_comment}
        </span>
      )}

      {/* Privacy */}
      {taskIsPrivate && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Lock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[14px]">
              {__('Private task')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpen}>
              <Pencil className="h-4 w-4 mr-2" />
              {__('Edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              {__('Duplicate')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMoveDialogOpen(true)}>
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              {__('Move')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => isPro && handleTogglePrivacy()} disabled={!isPro}>
              {taskIsPrivate ? (
                <><Unlock className="h-4 w-4 mr-2" />{__('Make Public')}</>
              ) : (
                <><LockIcon className="h-4 w-4 mr-2" />{__('Make Private')}</>
              )}
              {!isPro && <Crown className="h-3.5 w-3.5 ml-auto text-pm-accent" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {__('Delete')}
            </DropdownMenuItem>
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
