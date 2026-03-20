import React, { useEffect, useCallback, useState } from 'react'
import { Slot, useSlotFills } from '@hooks/useSlot'
import { useAppDispatch, useAppSelector } from '@store/index'
import { closeTaskSheet, fetchTask, updateTask, changeTaskStatus, addTaskComment, deleteTask } from '@store/tasksSlice'
import { toggleTaskInList, removeTaskFromList } from '@store/taskListsSlice'
import { useApi } from '@hooks/useApi'
import { cn } from '@lib/utils'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import ProGate from '@components/common/ProGate'
import ProBadge from '@components/common/ProBadge'
import { usePermissions } from '@hooks/usePermissions'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@components/ui/sheet'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import RichTextEditor from '@components/common/RichTextEditor'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Separator } from '@components/ui/separator'
import { Skeleton } from '@components/ui/skeleton'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Paperclip,
  Flag,
  Check,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Trash2,
  Link2,
  ListTodo,
  User,
  Activity,
  X,
  Plus,
  Shield,
  Eye,
  EyeOff,
  Layers,
  Tag,
  Repeat,
} from 'lucide-react'
import {
  isTaskComplete,
  isPrivate,
  formatPmDate,
  formatPmDateTime,
  formatEstimation,
  userInitials,
  extractDateStr,
} from '@lib/pm-utils'

/**
 * Parse activity message — replaces {{actor.data.display_name}}, {{meta.task_title}}, etc.
 * with actual values from the activity object.
 */
function parseActivityMessage(activity) {
  let msg = activity.message || ''
  if (!msg) return ''

  // Replace {{path.to.value}} with actual data
  msg = msg.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const keys = path.trim().split('.')
    let val = activity
    for (const key of keys) {
      if (val && typeof val === 'object' && key in val) {
        val = val[key]
      } else {
        return '' // placeholder not found
      }
    }
    return val != null ? String(val) : ''
  })

  return msg
}

/**
 * TaskPrivacyField — toggleable when Pro, ProGate upsell when free.
 * Vue: POST pm/v2/projects/{pid}/tasks/privacy/{tid} with { is_private: 0/1 }
 */
function TaskPrivacyField({ task, projectId, dispatch, api }) {
  const { __ } = useI18n()
  const { isPro } = usePermissions()
  const taskPrivate = isPrivate(task?.meta?.privacy)
  const [toggling, setToggling] = useState(false)

  const handleToggle = useCallback(() => {
    if (toggling) return
    setToggling(true)
    const newPrivacy = taskPrivate ? 0 : 1
    api.post(`projects/${projectId}/tasks/privacy/${task.id}`, {
      is_private: newPrivacy,
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }))
    }).catch(() => {})
    .finally(() => setToggling(false))
  }, [taskPrivate, task, projectId, api, dispatch, toggling])

  if (!isPro) {
    return (
      <ProGate feature={__('Privacy')}>
        <div className="flex items-center h-7">
          <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
            <Shield className="h-3.5 w-3.5" /><span className="text-xs">{__('Privacy')}</span>
          </div>
        </div>
      </ProGate>
    )
  }

  return (
    <div className="flex items-center h-7">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <Shield className="h-3.5 w-3.5" /><span className="text-xs">{__('Privacy')}</span>
      </div>
      <button
        className={cn(
          'flex items-center gap-1.5 text-xs px-2 py-0.5 rounded transition-colors',
          taskPrivate
            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
          toggling && 'opacity-50'
        )}
        onClick={handleToggle}
        disabled={toggling}
        title={taskPrivate ? __('Click to make public') : __('Click to make private')}
      >
        {taskPrivate ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        {taskPrivate ? __('Private') : __('Public')}
      </button>
    </div>
  )
}

/**
 * TaskEstimationField — Editable estimation with hh:mm popover.
 *
 * API response (Helper/Task format):
 *   estimation            — task's own estimation in SECONDS (DB minutes * 60)
 *   comparable_estimation — minutes: task est (if type=task) OR sum of subtask est (if type=subtask)
 *   formated_com_est      — { hour, minute, second, total_second }
 *
 * PM_Vars.estimationType:
 *   'task'    → editable, uses task's own estimation
 *   'subtask' → read-only, shows comparable_estimation (sum of subtasks)
 */
function TaskEstimationField({ task, projectId, dispatch, api }) {
  const { __ } = useI18n()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Vue conditions from single-task-estimation-form.vue:
  // 1. hasSubTasks → show read-only "according subtasks" with formated_com_est
  // 2. isActiveTaskEstimatedTime → only if NO subtasks AND exactly 1 assignee
  // 3. Otherwise → show "Please Choose one user"
  //
  // In Vue, task.sub_tasks comes from the Sub_Tasks module store, not from API.
  // In React, subtasks are in Redux state.subtasks.subtasks (loaded by pro SubtaskList).
  // We also check the store for subtasks since API doesn't include them.
  const assignees = task?.assignees?.data || task?.assignees || []
  // Subtasks are in pro's Redux slice (state.subtasks.subtasks).
  // Safe fallback: if pro not loaded or Sub_Tasks module off, returns empty array.
  const proSubtasks = useAppSelector(s => s.subtasks?.subtasks || [])
  const hasSubTasks = proSubtasks.length > 0
  const hasOneAssignee = assignees.length === 1
  const canEditEstimation = !hasSubTasks && hasOneAssignee

  // Helper/Task format always returns estimation = DB_minutes * 60 (seconds)
  // fetchTask goes through Helper, so always divide by 60
  const rawEstimation = parseInt(task?.estimation) || 0
  const estMinutes = Math.floor(rawEstimation / 60)

  const comparableMinutes = parseInt(task?.comparable_estimation) || 0

  // What to display
  const displayMinutes = hasSubTasks ? comparableMinutes : estMinutes

  const displayStr = displayMinutes > 0
    ? `${Math.floor(displayMinutes / 60)} Hour ${displayMinutes % 60} Minute`
    : __('None')

  // Single input value "hh:mm" — matches Vue's estimation-form
  const minutesToHHMM = (m) => {
    const h = Math.floor(m / 60)
    const mm = m % 60
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
  }

  const [timeInput, setTimeInput] = useState(() => estMinutes > 0 ? minutesToHHMM(estMinutes) : '')

  useEffect(() => {
    setTimeInput(estMinutes > 0 ? minutesToHHMM(estMinutes) : '')
  }, [estMinutes])

  const handleSave = useCallback(() => {
    setSaving(true)
    // Vue sends estimation as "hh:mm" STRING — PHP parses it
    api.post(`projects/${projectId}/tasks/${task.id}/update`, {
      title: task.title,
      estimation: timeInput || '00:00',
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }))
      setOpen(false)
    }).catch(() => {})
    .finally(() => setSaving(false))
  }, [timeInput, task, projectId, api, dispatch])

  const handleClear = useCallback(() => {
    setSaving(true)
    api.post(`projects/${projectId}/tasks/${task.id}/update`, {
      title: task.title,
      estimation: '00:00',
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }))
      setTimeInput('')
      setOpen(false)
    }).catch(() => {})
    .finally(() => setSaving(false))
  }, [task, projectId, api, dispatch])

  const handleInputChange = (e) => {
    let val = e.target.value.replace(/[^0-9:]/g, '')
    // Only allow one colon
    const parts = val.split(':')
    if (parts.length > 2) val = parts[0] + ':' + parts.slice(1).join('')
    // Limit minutes to 59
    if (parts.length === 2 && parts[1].length >= 2) {
      const m = parseInt(parts[1])
      if (m > 59) val = parts[0] + ':59'
    }
    setTimeInput(val)
  }

  return (
    <div className="flex items-center h-7">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <Clock className="h-3.5 w-3.5" /><span className="text-xs">{__('Estimate')}</span>
      </div>
      {hasSubTasks ? (
        // Has subtasks: read-only, shows formated_com_est (according subtasks)
        <span className="text-xs text-pm-text-primary tabular-nums">
          {displayStr}
          <span className="text-[10px] text-pm-text-muted ml-1 italic">({__('according subtasks')})</span>
        </span>
      ) : canEditEstimation ? (
        // No subtasks + exactly 1 assignee: editable via popover
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="text-xs text-pm-text-primary tabular-nums hover:text-pm-accent transition-colors">
              {displayStr}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <label className="text-[10px] font-medium text-pm-text-muted block mb-2">{__('Estimation (hh:mm)')}</label>
            <input
              type="text"
              value={timeInput}
              onChange={handleInputChange}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
              className="w-full h-8 text-sm font-mono px-2 rounded border border-pm-border"
              placeholder="hh:mm"
              autoFocus
            />
            <div className="flex items-center justify-between mt-2">
              <button className="text-xs text-pm-text-muted hover:text-pm-text" onClick={handleClear} disabled={saving}>{__('Clear')}</button>
              <button className="text-xs bg-pm-accent text-white px-3 py-1 rounded hover:bg-pm-accent-hover disabled:opacity-50" onClick={handleSave} disabled={saving}>{__('Save')}</button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        // No subtasks + 0 or 2+ assignees: show "Please Choose one user"
        <span className="text-xs text-pm-text-muted bg-muted/50 px-2 py-0.5 rounded">
          {__('Please choose one user')}
        </span>
      )}
    </div>
  )
}

/**
 * ProInlineProperties — Time Tracker, Labels, Recurrence, Custom Fields.
 * When pro is active, pro plugin fills the 'task.detail.inline-properties' slot.
 * When pro is NOT active, shows ProGate upsell placeholders.
 */
function ProInlineProperties({ taskId, projectId, currentTask, dispatch, api }) {
  const { __ } = useI18n()
  const { isPro } = usePermissions()
  const fills = useSlotFills('task.detail.inline-properties')

  // Pro plugin registered a fill — render it
  if (fills.length > 0) {
    return (
      <Slot
        name="task.detail.inline-properties"
        taskId={taskId}
        projectId={projectId}
        currentTask={currentTask}
        dispatch={dispatch}
        api={api}
      />
    )
  }

  // Free fallback — ProGate upsell placeholders
  if (!isPro) {
    return (
      <div className="space-y-1 pt-1">
        <ProGate feature={__('Time Tracker')}>
          <div className="flex items-center h-7">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Clock className="h-3.5 w-3.5" /><span className="text-xs">{__('Track Time')}</span>
            </div>
          </div>
        </ProGate>
        <ProGate feature={__('Labels')}>
          <div className="flex items-center h-7">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Tag className="h-3.5 w-3.5" /><span className="text-xs">{__('Label')}</span>
            </div>
          </div>
        </ProGate>
        <ProGate feature={__('Recurrence')}>
          <div className="flex items-center h-7">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Repeat className="h-3.5 w-3.5" /><span className="text-xs">{__('Recurring')}</span>
            </div>
          </div>
        </ProGate>
      </div>
    )
  }

  return null
}

/**
 * ProSubtasksSection — Subtasks list below Description.
 * When pro is active, pro plugin fills the 'task.detail.subtasks' slot.
 * When pro is NOT active, shows ProGate upsell placeholder.
 */
function ProSubtasksSection({ taskId, projectId, currentTask }) {
  const { __ } = useI18n()
  const { isPro } = usePermissions()
  const fills = useSlotFills('task.detail.subtasks')

  // Pro plugin registered a fill — render it
  if (fills.length > 0) {
    return (
      <Slot
        name="task.detail.subtasks"
        taskId={taskId}
        projectId={projectId}
        currentTask={currentTask}
      />
    )
  }

  // Free fallback — ProGate upsell
  if (!isPro) {
    return (
      <div className="px-6 py-3">
        <ProGate feature={__('Subtasks')}>
          <div className="flex items-center gap-2 text-sm text-pm-text-muted py-1">
            <Layers className="h-3.5 w-3.5" />
            <span className="text-xs">{__('Subtasks')}</span>
          </div>
        </ProGate>
      </div>
    )
  }

  return null
}

export default function TaskDetailSheet() {
  const dispatch = useAppDispatch()
  const api = useApi()
  const { __ } = useI18n()
  const toast = useToast()
  const { currentTask, taskSheetOpen, loading } = useAppSelector(s => s.tasks)
  const projectId = useAppSelector(s => s.taskLists.projectId)

  // ── State ──────────────────────────────────────────
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [description, setDescription] = useState('')
  const [savingDesc, setSavingDesc] = useState(false)

  // Date editing
  const [editingDates, setEditingDates] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')

  // Assignee management
  const [showAssigneeSearch, setShowAssigneeSearch] = useState(false)
  const [assigneeQuery, setAssigneeQuery] = useState('')
  const [assigneeResults, setAssigneeResults] = useState([])

  // Comment form
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  // Activity
  const [activities, setActivities] = useState([])
  const [showActivities, setShowActivities] = useState(false)
  const [loadingActivities, setLoadingActivities] = useState(false)

  // ── Effects ────────────────────────────────────────
  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title)
      setDescription(currentTask.description?.content ?? '')
      setStartDate(extractDateStr(currentTask.start_at) || '')
      setDueDate(extractDateStr(currentTask.due_date) || '')
    }
  }, [currentTask])

  useEffect(() => {
    if (taskSheetOpen && currentTask && projectId) {
      dispatch(fetchTask({ projectId, taskId: currentTask.id }))
    }
  }, [taskSheetOpen, currentTask?.id, projectId, dispatch])


  // ── Derived (must be before handlers that use them) ──
  const assignees = currentTask
    ? (Array.isArray(currentTask.assignees) ? currentTask.assignees : (currentTask.assignees?.data) ?? [])
    : []
  const comments = useAppSelector(s => s.tasks.taskComments)
  const complete = currentTask ? isTaskComplete(currentTask.status) : false

  // ── Handlers ───────────────────────────────────────
  const handleClose = useCallback((open) => {
    if (!open) {
      dispatch(closeTaskSheet())
      setFullscreen(false)
      setEditingDates(false)
      setShowAssigneeSearch(false)
      setShowActivities(false)
      setNewComment('')
    }
  }, [dispatch])

  const handleTitleSave = useCallback(async () => {
    if (!currentTask || !projectId || title === currentTask.title) {
      setEditingTitle(false)
      return
    }
    try {
      await dispatch(updateTask({ projectId, taskId: currentTask.id, data: { title } })).unwrap()
    } catch {
      toast.error(__('Failed to update title'))
      setTitle(currentTask.title)
    }
    setEditingTitle(false)
  }, [dispatch, projectId, currentTask, title, toast, __])

  const handleDescSave = useCallback(async () => {
    if (!currentTask || !projectId) return
    setSavingDesc(true)
    try {
      await dispatch(updateTask({ projectId, taskId: currentTask.id, data: { description } })).unwrap()
      toast.success(__('Description updated'))
      setEditingDesc(false)
    } catch {
      toast.error(__('Failed to update description'))
    }
    setSavingDesc(false)
  }, [dispatch, projectId, currentTask, description, toast, __])

  const handleDescCancel = useCallback(() => {
    setDescription(currentTask?.description?.html || currentTask?.description?.content || '')
    setEditingDesc(false)
  }, [currentTask])

  const handleToggleStatus = useCallback(async () => {
    if (!currentTask || !projectId) return
    const newStatus = isTaskComplete(currentTask.status) ? 0 : 1
    dispatch(toggleTaskInList({ listId: currentTask.task_list_id, taskId: currentTask.id, newStatus }))
    try {
      await dispatch(changeTaskStatus({ projectId, taskId: currentTask.id, status: newStatus })).unwrap()
    } catch {
      toast.error(__('Failed to update status'))
    }
  }, [dispatch, projectId, currentTask, toast, __])

  // Date save
  const handleDateSave = useCallback(async () => {
    if (!currentTask || !projectId) return
    try {
      await dispatch(updateTask({
        projectId, taskId: currentTask.id,
        data: { start_at: startDate || undefined, due_date: dueDate || undefined },
      })).unwrap()
      toast.success(__('Dates updated'))
      setEditingDates(false)
    } catch {
      toast.error(__('Failed to update dates'))
    }
  }, [dispatch, projectId, currentTask, startDate, dueDate, toast, __])

  // Assignee search
  const handleAssigneeSearch = useCallback(async (q) => {
    setAssigneeQuery(q)
    if (q.length < 2) { setAssigneeResults([]); return }
    try {
      const res = await api.get('users', { search: q })
      setAssigneeResults(res.data ?? [])
    } catch { setAssigneeResults([]) }
  }, [api])

  // Add assignee — send full assignees array via updateTask (like Vue 2)
  const handleAddAssignee = useCallback(async (user) => {
    if (!currentTask || !projectId) return
    const existingIds = assignees.map(a => a.assigned_to ?? a.id)
    if (existingIds.includes(user.id)) return
    const newAssignees = [...existingIds, user.id]
    try {
      await dispatch(updateTask({
        projectId, taskId: currentTask.id,
        data: { assignees: newAssignees },
      })).unwrap()
      dispatch(fetchTask({ projectId, taskId: currentTask.id }))
      toast.success(__('Assignee added'))
    } catch {
      toast.error(__('Failed to add assignee'))
    }
    setAssigneeQuery('')
    setAssigneeResults([])
    setShowAssigneeSearch(false)
  }, [dispatch, projectId, currentTask, assignees, toast, __])

  // Remove assignee — send remaining assignees array via updateTask
  const handleRemoveAssignee = useCallback(async (userId) => {
    if (!currentTask || !projectId) return
    const remainingIds = assignees.map(a => a.assigned_to ?? a.id).filter(id => id !== userId)
    try {
      await dispatch(updateTask({
        projectId, taskId: currentTask.id,
        data: { assignees: remainingIds },
      })).unwrap()
      dispatch(fetchTask({ projectId, taskId: currentTask.id }))
      toast.success(__('Assignee removed'))
    } catch {
      toast.error(__('Failed to remove assignee'))
    }
  }, [dispatch, projectId, currentTask, assignees, toast, __])

  // Submit comment
  const handleSubmitComment = useCallback(async () => {
    if (!currentTask || !projectId || !newComment.trim()) return
    setSubmittingComment(true)
    try {
      await dispatch(addTaskComment({ projectId, taskId: currentTask.id, content: newComment })).unwrap()
      setNewComment('')
      toast.success(__('Comment added'))
    } catch {
      toast.error(__('Failed to add comment'))
    }
    setSubmittingComment(false)
  }, [dispatch, projectId, currentTask, newComment, toast, __])

  // Fetch activities
  const handleLoadActivities = useCallback(async () => {
    if (!currentTask || !projectId) return
    setShowActivities(true)
    setLoadingActivities(true)
    try {
      const res = await api.post(`projects/${projectId}/tasks/${currentTask.id}/activity`, { per_page: 20 })
      setActivities(res.data ?? [])
    } catch { setActivities([]) }
    setLoadingActivities(false)
  }, [api, projectId, currentTask])

  // Delete task
  const handleDelete = useCallback(async () => {
    if (!currentTask || !projectId) return
    if (!confirm(__('Are you sure you want to delete this task?'))) return
    dispatch(removeTaskFromList({ listId: currentTask.task_list_id, taskId: currentTask.id }))
    dispatch(closeTaskSheet())
    try {
      await dispatch(deleteTask({ projectId, taskId: currentTask.id })).unwrap()
      toast.success(__('Task deleted'))
    } catch {
      toast.error(__('Failed to delete task'))
    }
  }, [dispatch, projectId, currentTask, toast, __])

  // Copy link
  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#/projects/${projectId}/task-lists/${currentTask?.task_list_id}/tasks/${currentTask?.id}`
    navigator.clipboard.writeText(url)
    toast.success(__('Link copied'))
  }, [projectId, currentTask, toast, __])

  // ── Render ─────────────────────────────────────────
  return (
    <Sheet open={taskSheetOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className={cn(
          'overflow-y-auto p-0 transition-all duration-300',
          fullscreen ? 'w-full sm:max-w-full' : 'w-full sm:max-w-[560px]',
        )}
      >
        {loading && !currentTask ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : currentTask ? (
          <div className={cn('flex flex-col h-full', fullscreen && 'max-w-4xl mx-auto')}>

            {/* ── Top toolbar ── */}
            <div className="flex items-center gap-1 px-4 pt-3 pb-1">
              <button
                type="button"
                onClick={() => setFullscreen(v => !v)}
                className="p-1.5 rounded-md hover:bg-muted text-pm-text-muted hover:text-pm-text-primary transition-colors"
                title={fullscreen ? __('Exit full screen') : __('Full screen')}
              >
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-md hover:bg-muted text-pm-text-muted hover:text-pm-text-primary transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Link2 className="h-3.5 w-3.5 mr-2" />{__('Copy Link')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                    <Trash2 className="h-3.5 w-3.5 mr-2" />{__('Delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ── Header: status + title + meta ── */}
            <div className="px-6 pt-6 pb-4 space-y-4">
              <SheetHeader className="space-y-0">
                <SheetDescription className="sr-only">{__('Task details')}</SheetDescription>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={handleToggleStatus} className="shrink-0 group/status">
                    {complete ? (
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500 text-white">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center h-6 w-6 rounded-full border-[1.5px] border-dashed border-pm-text-muted/40 group-hover/status:border-solid group-hover/status:border-pm-accent group-hover/status:text-pm-accent transition-all">
                        <Check className="h-3.5 w-3.5 opacity-0 group-hover/status:opacity-100 transition-opacity" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                  {editingTitle ? (
                    <Input autoFocus value={title} onChange={e => setTitle(e.target.value)} onBlur={handleTitleSave}
                      onKeyDown={e => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') { setTitle(currentTask.title); setEditingTitle(false) } }}
                      className="text-lg font-semibold h-auto py-0.5 border-none shadow-none focus-visible:ring-1 flex-1"
                    />
                  ) : (
                    <SheetTitle className={cn('text-lg cursor-pointer hover:text-pm-accent transition-colors leading-snug', complete && 'line-through text-pm-text-muted')}
                      onClick={() => setEditingTitle(true)}>
                      {currentTask.title}
                    </SheetTitle>
                  )}
                </div>
              </SheetHeader>

              {/* Created by */}
              {currentTask.creator?.data && (
                <p className="text-[11px] text-pm-text-muted flex items-center gap-1.5 pl-9">
                  <User className="h-3 w-3" />
                  {__('Created by')} <span className="font-medium text-pm-text-primary">{currentTask.creator.data.display_name}</span>
                  {currentTask.created_at && <span>· {formatPmDateTime(currentTask.created_at)}</span>}
                </p>
              )}

              {/* ── Properties grid ── */}
              <div className="space-y-2">
                {/* Status */}
                <div className="flex items-center h-7">
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                    <Check className="h-3.5 w-3.5" /><span className="text-xs">{__('Status')}</span>
                  </div>
                  <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full',
                    complete ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', complete ? 'bg-emerald-500' : 'bg-amber-500')} />
                    {complete ? __('Done') : __('Active')}
                  </span>
                </div>

                {/* Priority */}
                <div className="flex items-center h-7">
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                    <Flag className="h-3.5 w-3.5" /><span className="text-xs">{__('Priority')}</span>
                  </div>
                  <span className="text-xs text-pm-text-primary">
                    {currentTask.priority >= 3 ? __('Urgent') : currentTask.priority === 2 ? __('High') : currentTask.priority === 1 ? __('Normal') : __('None')}
                  </span>
                </div>

                {/* Dates — editable */}
                <div className="flex items-center min-h-[28px]">
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                    <Calendar className="h-3.5 w-3.5" /><span className="text-xs">{__('Dates')}</span>
                  </div>
                  {editingDates ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 font-normal min-w-[120px] justify-start">
                            <Calendar className="h-3 w-3" />
                            {startDate || __('Start')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="start">
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-pm-text-muted">{__('Start Date')}</p>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            {startDate && <Button variant="ghost" size="sm" className="h-6 text-[10px] w-full" onClick={() => setStartDate('')}>{__('Clear')}</Button>}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <span className="text-xs text-pm-text-muted">→</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 font-normal min-w-[120px] justify-start">
                            <Calendar className="h-3 w-3" />
                            {dueDate || __('Due')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="start">
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-pm-text-muted">{__('Due Date')}</p>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            {dueDate && <Button variant="ghost" size="sm" className="h-6 text-[10px] w-full" onClick={() => setDueDate('')}>{__('Clear')}</Button>}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button size="sm" className="h-6 text-[11px] px-2" onClick={handleDateSave}>{__('Save')}</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2" onClick={() => setEditingDates(false)}>{__('Cancel')}</Button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setEditingDates(true)} className="text-xs text-pm-text-primary hover:text-pm-accent transition-colors">
                      {extractDateStr(currentTask.start_at) && extractDateStr(currentTask.due_date)
                        ? `${formatPmDate(currentTask.start_at)} → ${formatPmDate(currentTask.due_date)}`
                        : extractDateStr(currentTask.due_date)
                          ? formatPmDate(currentTask.due_date)
                          : __('Set dates')}
                    </button>
                  )}
                </div>

                {/* Assignees — interactive (before Estimation so user is assigned first) */}
                <div className="flex items-start min-h-[28px]">
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0 pt-1">
                    <Users className="h-3.5 w-3.5" /><span className="text-xs">{__('Assignees')}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {assignees.map(user => (
                        <span key={user.id || user.assigned_to} className="inline-flex items-center gap-1 text-xs bg-muted/50 rounded-full pl-0.5 pr-2 py-0.5">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="text-[8px]">{userInitials(user.display_name || '')}</AvatarFallback>
                          </Avatar>
                          {user.display_name}
                          <button type="button" className="ml-0.5 text-pm-text-muted hover:text-destructive" onClick={() => handleRemoveAssignee(user.assigned_to ?? user.id)}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <button type="button" onClick={() => setShowAssigneeSearch(v => !v)}
                        className="inline-flex items-center gap-1 text-[11px] text-pm-accent hover:text-pm-accent/80 transition-colors">
                        <Plus className="h-3 w-3" />{__('Add')}
                      </button>
                    </div>
                    {showAssigneeSearch && (
                      <div className="relative mt-1.5">
                        <Input autoFocus value={assigneeQuery} onChange={e => handleAssigneeSearch(e.target.value)}
                          placeholder={__('Search users...')} className="h-7 text-xs"
                          onKeyDown={e => { if (e.key === 'Escape') { setShowAssigneeSearch(false); setAssigneeQuery(''); setAssigneeResults([]) } }}
                        />
                        {assigneeResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-36 overflow-y-auto">
                            {assigneeResults.map(u => (
                              <button key={u.id} type="button" className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted/50 text-left" onClick={() => handleAddAssignee(u)}>
                                <Avatar className="h-5 w-5"><AvatarImage src={u.avatar_url} /><AvatarFallback className="text-[8px]">{userInitials(u.display_name)}</AvatarFallback></Avatar>
                                {u.display_name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Estimation — editable, depends on assignees */}
                <TaskEstimationField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} api={api} />

                {/* Privacy — toggleable when Pro, ProGate upsell when free */}
                <TaskPrivacyField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} api={api} />

                {/* Task type */}
                {currentTask.type && (
                  <div className="flex items-center h-7">
                    <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                      <ListTodo className="h-3.5 w-3.5" /><span className="text-xs">{__('Type')}</span>
                    </div>
                    <span className="text-xs text-pm-text-primary bg-muted/50 px-2 py-0.5 rounded">
                      {currentTask.type.title}
                    </span>
                  </div>
                )}
              </div>

              {/* ── Pro inline properties (Time Tracker, Labels, Recurrence, Custom Fields) ── */}
              <ProInlineProperties
                taskId={currentTask?.id}
                projectId={currentTask?.project_id}
                currentTask={currentTask}
                dispatch={dispatch}
                api={api}
              />
            </div>

            <Separator />

            {/* ── Description ── */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-pm-text-muted/70">{__('Description')}</h4>
                {!editingDesc && (
                  <button type="button" className="text-[11px] font-medium text-pm-accent hover:text-pm-accent/80 transition-colors"
                    onClick={() => { setDescription(currentTask.description?.html || currentTask.description?.content || ''); setEditingDesc(true) }}>
                    {currentTask.description?.content ? __('Edit') : __('Add')}
                  </button>
                )}
              </div>
              {editingDesc ? (
                <div className="space-y-3">
                  <RichTextEditor content={description} placeholder={__('Write a description...')} onChange={html => setDescription(html)} autofocus minHeight="100px" />
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="h-7 text-xs" onClick={handleDescSave} disabled={savingDesc}>{savingDesc ? __('Saving...') : __('Save')}</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleDescCancel}>{__('Cancel')}</Button>
                  </div>
                </div>
              ) : (
                <div className={cn('rounded-lg p-3 min-h-[48px] transition-colors', currentTask.description?.html ? 'bg-muted/20' : 'bg-muted/10 border border-dashed border-border/60')}>
                  {currentTask.description?.html ? (
                    <div className="prose prose-sm max-w-none text-sm text-pm-text-primary/80 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: currentTask.description.html }} />
                  ) : (
                    <p className="text-xs text-pm-text-muted italic">{__('No description yet. Click "Add" to write one.')}</p>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* ── Pro: Subtasks (below description, above comments) ── */}
            <ProSubtasksSection
              taskId={currentTask?.id}
              projectId={currentTask?.project_id}
              currentTask={currentTask}
            />

            <Separator />

            {/* ── Comments ── */}
            <div className="px-6 py-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-pm-text-muted/70 mb-3 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />{__('Comments')}
                {comments.length > 0 && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums">{comments.length}</span>}
              </h4>

              {/* Comment list */}
              {comments.length > 0 && (
                <div className="space-y-3 mb-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex gap-2.5">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={comment.creator?.data?.avatar_url} />
                        <AvatarFallback className="text-[9px]">{userInitials(comment.creator?.data?.display_name ?? '?')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium text-pm-text-primary">{comment.creator?.data?.display_name}</span>
                          <span className="text-[10px] text-pm-text-muted">{formatPmDateTime(comment.created_at)}</span>
                        </div>
                        <div className="text-xs text-pm-text-primary/80 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: comment.content }} />
                        {/* Comment files */}
                        {comment.files?.data?.length > 0 && (
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {comment.files.data.map(f => (
                              <a key={f.id} href={f.url} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-pm-accent bg-pm-accent/5 px-2 py-0.5 rounded hover:bg-pm-accent/10 transition-colors">
                                <Paperclip className="h-2.5 w-2.5" />{f.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment form — rich text editor */}
              <div className="space-y-2">
                <RichTextEditor
                  content={newComment}
                  placeholder={__('Write a comment...')}
                  onChange={(html) => setNewComment(html)}
                  minHeight="60px"
                />
                <Button size="sm" className="h-7 text-xs" onClick={handleSubmitComment} disabled={!newComment.trim() || submittingComment}>
                  {submittingComment ? __('Sending...') : __('Add Comment')}
                </Button>
              </div>
            </div>

            <Separator />

            {/* ── Activity Log ── */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-pm-text-muted/70 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />{__('Activity')}
                </h4>
                <button
                  type="button"
                  onClick={showActivities ? () => setShowActivities(false) : handleLoadActivities}
                  className="p-1 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent transition-colors"
                  title={showActivities ? __('Hide activity') : __('Show activity')}
                >
                  {showActivities
                    ? <Eye className="h-3.5 w-3.5" />
                    : <EyeOff className="h-3.5 w-3.5" />
                  }
                </button>
              </div>
              {showActivities && (
                <div className="mt-3 space-y-2">
                  {loadingActivities ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : activities.length > 0 ? (
                    activities.map((act, i) => (
                      <div key={act.id || i} className="flex gap-2 text-xs text-pm-text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-pm-text-muted/30 mt-1.5 shrink-0" />
                        <div>
                          {parseActivityMessage(act) || act.action}
                          {act.committed_at && <span className="ml-1.5 text-[10px]">· {formatPmDateTime(act.committed_at)}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-pm-text-muted italic">{__('No activity yet')}</p>
                  )}
                </div>
              )}
            </div>

          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
