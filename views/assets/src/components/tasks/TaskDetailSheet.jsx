import React, { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Slot, useSlotFills } from '@hooks/useSlot'
import { useAppDispatch, useAppSelector } from '@store/index'
import { closeTaskSheet, fetchTask, updateTask, changeTaskStatus, addTaskComment, updateTaskComment, deleteTaskComment, deleteTask } from '@store/tasksSlice'
import { toggleTaskInList, removeTaskFromList, updateTaskPrivacy } from '@store/taskListsSlice'
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
import GitHubPreviewContainer from '@components/common/GitHubPreviewContainer'
import NotionPreviewContainer from '@components/common/NotionPreviewContainer'
import LoomPreviewContainer from '@components/common/LoomPreviewContainer'
import { stripAllPreviewUrls } from '@/lib/url-strippers'
import FileUploadArea from '@components/common/FileUploadArea'
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
  Zap,
  Pencil,
  FileText,
  Sparkles,
  Milestone as MilestoneIcon,
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
  const taskLoading = useAppSelector(s => s.tasks.loading)
  const taskPrivate = isPrivate(task?.meta?.privacy)
  const [toggling, setToggling] = useState(false)

  const handleToggle = useCallback(() => {
    if (toggling) return
    setToggling(true)
    const newPrivacy = taskPrivate ? 0 : 1
    // Optimistic update in lists (TaskRow lock icon updates immediately)
    dispatch(updateTaskPrivacy({ taskId: task.id, privacy: newPrivacy }))
    api.post(`projects/${projectId}/tasks/privacy/${task.id}`, {
      is_private: newPrivacy,
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }))
    }).catch(() => {
      // Revert on failure
      dispatch(updateTaskPrivacy({ taskId: task.id, privacy: taskPrivate ? 1 : 0 }))
    })
    .finally(() => setToggling(false))
  }, [taskPrivate, task, projectId, api, dispatch, toggling])

  if (!isPro) {
    return (
      <ProGate feature={__('Privacy')}>
        <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
            <Shield className="h-4 w-4" /><span className="text-sm">{__('Privacy')}</span>
          </div>
          <ProBadge />
        </div>
      </ProGate>
    )
  }

  return (
    <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <Shield className="h-4 w-4" /><span className="text-sm">{__('Privacy')}</span>
      </div>
      {taskLoading ? (
        <span className="text-sm text-pm-text-muted">...</span>
      ) : (
        <button
          className={cn(
            'flex items-center gap-1.5 text-sm px-2 py-0.5 rounded transition-colors',
            taskPrivate
              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
            toggling && 'opacity-50'
          )}
          onClick={handleToggle}
          disabled={toggling}
          title={taskPrivate ? __('Click to make public') : __('Click to make private')}
        >
          {taskPrivate ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {taskPrivate ? __('Private') : __('Public')}
        </button>
      )}
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
    // Vue sends estimation as MINUTES (number) — convert hh:mm to minutes
    const parts = (timeInput || '00:00').split(':')
    const hours = parseInt(parts[0]) || 0
    const mins = parseInt(parts[1]) || 0
    const totalMinutes = hours * 60 + mins
    api.post(`projects/${projectId}/tasks/${task.id}/update`, {
      title: task.title,
      estimation: totalMinutes,
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
    <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <Clock className="h-4 w-4" /><span className="text-sm">{__('Estimate')}</span>
      </div>
      {hasSubTasks ? (
        // Has subtasks: read-only, shows formated_com_est (according subtasks)
        <span className="text-sm text-pm-text-primary tabular-nums">
          {displayStr}
          <span className="text-[13px] text-pm-text-muted ml-1 italic">({__('according subtasks')})</span>
        </span>
      ) : canEditEstimation ? (
        // No subtasks + exactly 1 assignee: editable via popover
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="text-sm text-pm-text-primary tabular-nums hover:text-pm-accent transition-colors">
              {displayStr}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <label className="text-[14px] font-medium text-pm-text-muted block mb-2">{__('Estimation (hh:mm)')}</label>
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
              <button className="text-sm text-pm-text-muted hover:text-pm-text" onClick={handleClear} disabled={saving}>{__('Clear')}</button>
              <button className="text-sm bg-pm-accent text-white px-3 py-1 rounded hover:bg-pm-accent-hover disabled:opacity-50" onClick={handleSave} disabled={saving}>{__('Save')}</button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        // No subtasks + 0 or 2+ assignees: show "Please Choose one user"
        <span className="text-sm text-pm-text-muted bg-muted/50 px-2 py-0.5 rounded">
          {__('Please choose one user')}
        </span>
      )}
    </div>
  )
}

/**
 * TaskTypeField — Editable task type with dropdown.
 * Vue: single-task-type.vue — pm-task-type-dropdown with popover.
 * API: GET settings/task-types, POST projects/{pid}/tasks/{tid}/update with { type_id }
 */
function TaskTypeField({ task, projectId, dispatch, api }) {
  const { __ } = useI18n()
  const [open, setOpen] = useState(false)
  const [types, setTypes] = useState([])
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [saving, setSaving] = useState(false)

  const currentType = task?.type

  const loadTypes = useCallback(() => {
    if (types.length > 0) return
    setLoadingTypes(true)
    api.get('settings/task-types', { type: 'task' })
      .then(res => {
        const items = res?.data ?? res ?? []
        setTypes(Array.isArray(items) ? items : [])
      })
      .catch(() => {})
      .finally(() => setLoadingTypes(false))
  }, [api, types.length])

  const handleSelect = useCallback((type) => {
    if (saving) return
    setSaving(true)
    const typeId = type?.id === currentType?.id ? false : type?.id
    api.post(`projects/${projectId}/tasks/${task.id}/update`, {
      title: task.title,
      type_id: typeId,
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }))
      setOpen(false)
    }).catch(() => {})
    .finally(() => setSaving(false))
  }, [saving, currentType, task, projectId, api, dispatch])

  const handleClear = useCallback(() => {
    if (saving) return
    setSaving(true)
    api.post(`projects/${projectId}/tasks/${task.id}/update`, {
      title: task.title,
      type_id: false,
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }))
      setOpen(false)
    }).catch(() => {})
    .finally(() => setSaving(false))
  }, [saving, task, projectId, api, dispatch])

  return (
    <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <ListTodo className="h-4 w-4" /><span className="text-sm">{__('Type')}</span>
      </div>
      <Popover open={open} onOpenChange={(v) => { setOpen(v); if (v) loadTypes() }}>
        <PopoverTrigger asChild>
          <button className={cn(
            'text-sm transition-colors',
            currentType
              ? 'text-pm-text-primary bg-muted/50 px-2 py-0.5 rounded hover:bg-muted'
              : 'text-pm-text-muted hover:text-pm-accent'
          )}>
            {currentType ? currentType.title : __('Add type')}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-2" align="start">
          {loadingTypes ? (
            <p className="text-sm text-pm-text-muted py-2 text-center">{__('Loading...')}</p>
          ) : types.length === 0 ? (
            <p className="text-sm text-pm-text-muted py-2 text-center">{__('No task types found')}</p>
          ) : (
            <div className="space-y-0.5">
              {types.map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={cn(
                    'w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted/50 transition-colors flex items-center justify-between',
                    currentType?.id === t.id && 'bg-primary/5 text-primary font-medium'
                  )}
                  onClick={() => handleSelect(t)}
                  disabled={saving}
                >
                  {t.title}
                  {currentType?.id === t.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
              {currentType && (
                <>
                  <div className="border-t border-border my-1" />
                  <button
                    type="button"
                    className="w-full text-left text-sm px-2 py-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={handleClear}
                    disabled={saving}
                  >
                    {__('Remove type')}
                  </button>
                </>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

/**
 * MilestoneField — Read-only display of the task's milestone.
 *
 * Milestones link to task_lists (not tasks) via pm_boardables.
 * Fetches milestones once to find which one contains this task's parent list.
 */
function MilestoneField({ task, projectId, api }) {
  const { __ } = useI18n()
  const [milestoneName, setMilestoneName] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const taskListId = task?.task_list_id || task?.task_lists?.data?.[0]?.id

  // Fetch milestones once to find the one linked to this task's list
  useEffect(() => {
    if (loaded || !projectId || !taskListId) return
    setLoaded(true)
    api.get(`projects/${projectId}/milestones`, { with: 'task_lists', per_page: 50 })
      .then(res => {
        const items = res?.data ?? []
        const match = items.find(m =>
          (m?.task_lists?.data ?? []).some(l => l.id === taskListId)
        )
        if (match) setMilestoneName(match.title)
      })
      .catch(() => {})
  }, [api, projectId, taskListId, loaded])

  return (
    <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <MilestoneIcon className="h-4 w-4" /><span className="text-sm">{__('Milestone')}</span>
      </div>
      <span className={cn(
        'text-sm',
        milestoneName ? 'text-pm-text-primary' : 'text-pm-text-muted'
      )}>
        {milestoneName || __('None')}
      </span>
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
      <>
        <ProGate feature={__('Time Tracker')}>
          <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Clock className="h-4 w-4" /><span className="text-sm">{__('Track Time')}</span>
            </div>
            <ProBadge />
          </div>
        </ProGate>
        <ProGate feature={__('Labels')}>
          <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Tag className="h-4 w-4" /><span className="text-sm">{__('Label')}</span>
            </div>
            <ProBadge />
          </div>
        </ProGate>
        <ProGate feature={__('Recurrence')}>
          <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Repeat className="h-4 w-4" /><span className="text-sm">{__('Recurring')}</span>
            </div>
            <ProBadge />
          </div>
        </ProGate>
        <ProGate feature={__('Sprint')}>
          <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Zap className="h-4 w-4" /><span className="text-sm">{__('Sprint')}</span>
            </div>
            <ProBadge />
          </div>
        </ProGate>
      </>
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

  // Free fallback — ProGate upsell with AI button teaser
  if (!isPro) {
    return (
      <div className="px-6 py-3">
        <ProGate feature={__('Subtasks')}>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-sm text-pm-text-muted">
              <Layers className="h-4 w-4" />
              <span className="text-sm">{__('Subtasks')}</span>
              <ProBadge />
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center gap-1 text-[15px] text-white bg-pm-accent/60 rounded px-2 py-1 cursor-not-allowed opacity-60"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {__('Generate with AI')}
              <span className="bg-white/25 text-white text-[11px] px-1 py-0.5 rounded font-semibold">{__('Pro')}</span>
            </button>
          </div>
        </ProGate>
      </div>
    )
  }

  return null
}

export default function TaskDetailSheet() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
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
  const [commentFiles, setCommentFiles] = useState([])
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState('')

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
      toast.success(newStatus === 1 ? __('Task completed') : __('Task reopened'))
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
    const remainingIds = assignees.map(a => a.assigned_to ?? a.id).filter(id => parseInt(id) !== parseInt(userId))
    try {
      // jQuery omits empty arrays in form-urlencoded, so send [-1] as sentinel for "clear all"
      // PHP: empty([-1]) is false, intval(-1) gives -1 which won't match any user → effectively clears
      const assigneePayload = remainingIds.length > 0 ? remainingIds : [-1]
      await dispatch(updateTask({
        projectId, taskId: currentTask.id,
        data: { assignees: assigneePayload },
      })).unwrap()
      dispatch(fetchTask({ projectId, taskId: currentTask.id }))
      toast.success(__('Assignee removed'))
    } catch {
      toast.error(__('Failed to remove assignee'))
    }
  }, [dispatch, projectId, currentTask, assignees, toast, __])

  // Submit comment (with optional file attachments)
  const handleSubmitComment = useCallback(async () => {
    if (!currentTask || !projectId || !newComment.trim()) return
    setSubmittingComment(true)
    try {
      if (commentFiles.length > 0) {
        const formData = new FormData()
        formData.append('content', newComment)
        formData.append('commentable_id', currentTask.id)
        formData.append('commentable_type', 'task')
        formData.append('mentioned_users', '')
        formData.append('notify_users', '')
        formData.append('project_id', projectId)
        commentFiles.forEach(f => formData.append('files[]', f))
        await api.upload(`projects/${projectId}/comments`, formData)
        dispatch(fetchTask({ projectId, taskId: currentTask.id }))
      } else {
        await dispatch(addTaskComment({ projectId, taskId: currentTask.id, content: newComment })).unwrap()
      }
      setNewComment('')
      setCommentFiles([])
      toast.success(__('Comment added'))
    } catch {
      toast.error(__('Failed to add comment'))
    }
    setSubmittingComment(false)
  }, [dispatch, projectId, currentTask, newComment, commentFiles, api, toast, __])

  // Edit comment
  const startEditComment = useCallback((c) => {
    setEditingCommentId(c.id)
    setEditCommentText(c.content || '')
  }, [])

  const cancelEditComment = useCallback(() => {
    setEditingCommentId(null)
    setEditCommentText('')
  }, [])

  const handleUpdateComment = useCallback(async () => {
    if (!editCommentText.trim() || !editingCommentId || !projectId) return
    try {
      await dispatch(updateTaskComment({ projectId, commentId: editingCommentId, content: editCommentText.trim() })).unwrap()
      cancelEditComment()
      toast.success(__('Comment updated'))
    } catch {
      toast.error(__('Failed to update comment'))
    }
  }, [dispatch, projectId, editingCommentId, editCommentText, toast, __, cancelEditComment])

  // Delete comment
  const handleDeleteComment = useCallback(async (commentId) => {
    if (!projectId) return
    try {
      await dispatch(deleteTaskComment({ projectId, commentId })).unwrap()
      toast.success(__('Comment deleted'))
    } catch {
      toast.error(__('Failed to delete comment'))
    }
  }, [dispatch, projectId, toast, __])

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
                {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-md hover:bg-muted text-pm-text-muted hover:text-pm-text-primary transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Link2 className="h-4 w-4 mr-2" />{__('Copy Link')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />{__('Delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator />

            {/* ── Header: status + title + meta ── */}
            <div className="px-6 pt-6 pb-4 space-y-4">
              <SheetHeader className="space-y-1.5">
                <SheetDescription asChild>
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground min-w-0">
                    {(currentTask.project?.data?.title || currentTask.project?.title) && (
                      <button
                        type="button"
                        onClick={() => {
                          const pid = currentTask.project?.data?.id || currentTask.project?.id || projectId
                          dispatch(closeTaskSheet())
                          navigate(`/projects/${pid}/task-lists`)
                        }}
                        className="inline-flex items-center gap-1 font-medium text-pm-accent hover:text-pm-accent/80 transition-colors truncate min-w-0"
                        title={currentTask.project?.data?.title || currentTask.project?.title}
                      >
                        <Layers className="h-3 w-3 shrink-0" />
                        {currentTask.project?.data?.title || currentTask.project?.title}
                      </button>
                    )}
                    <span className="text-muted-foreground/40">|</span>
                    <span className="font-mono text-[12px] text-muted-foreground/70">#{currentTask.id}</span>
                    {currentTask.creator?.data && (
                      <>
                        <span className="text-muted-foreground/40">·</span>
                        <div className="inline-flex items-center gap-1 shrink-0">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={currentTask.creator.data.avatar_url} />
                            <AvatarFallback className="text-[6px]">{userInitials(currentTask.creator.data.display_name || '')}</AvatarFallback>
                          </Avatar>
                          <span>{currentTask.creator.data.display_name}</span>
                        </div>
                      </>
                    )}
                    {currentTask.created_at && (
                      <>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="inline-flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" />{formatPmDateTime(currentTask.created_at)}</span>
                      </>
                    )}
                  </div>
                </SheetDescription>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={handleToggleStatus} className="shrink-0 group/status">
                    {complete ? (
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pm-accent text-white">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center h-6 w-6 rounded-full border-[1.5px] border-dashed border-pm-text-muted/40 group-hover/status:border-solid group-hover/status:border-pm-accent group-hover/status:text-pm-accent transition-all">
                        <Check className="h-4 w-4 opacity-0 group-hover/status:opacity-100 transition-opacity" strokeWidth={3} />
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

              {/* ── Properties grid ── */}
              <div className="space-y-0.5 bg-muted/20 rounded-lg px-2 pb-2">
                {/* Status */}
                <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors cursor-pointer" onClick={handleToggleStatus}>
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                    <Check className="h-4 w-4" /><span className="text-sm">{__('Status')}</span>
                  </div>
                  <span className={cn('inline-flex items-center gap-1.5 text-[15px] font-medium px-2.5 py-0.5 rounded-full',
                    complete ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', complete ? 'bg-emerald-500' : 'bg-amber-500')} />
                    {complete ? __('Done') : __('Active')}
                  </span>
                </div>

                {/* Dates — editable */}
                <div className="flex items-center min-h-[32px] px-2 rounded-md hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                    <Calendar className="h-4 w-4" /><span className="text-sm">{__('Dates')}</span>
                  </div>
                  {editingDates ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-sm gap-1.5 font-normal min-w-[120px] justify-start">
                            <Calendar className="h-3.5 w-3.5" />
                            {startDate || __('Start')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="start">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-pm-text-muted">{__('Start Date')}</p>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            {startDate && <Button variant="ghost" size="sm" className="h-6 text-[14px] w-full" onClick={() => setStartDate('')}>{__('Clear')}</Button>}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <span className="text-sm text-pm-text-muted">→</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-sm gap-1.5 font-normal min-w-[120px] justify-start">
                            <Calendar className="h-3.5 w-3.5" />
                            {dueDate || __('Due')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="start">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-pm-text-muted">{__('Due Date')}</p>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            {dueDate && <Button variant="ghost" size="sm" className="h-6 text-[14px] w-full" onClick={() => setDueDate('')}>{__('Clear')}</Button>}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button size="sm" className="h-6 text-[15px] px-2" onClick={handleDateSave}>{__('Save')}</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[15px] px-2" onClick={() => setEditingDates(false)}>{__('Cancel')}</Button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setEditingDates(true)} className="text-sm text-pm-text-primary hover:text-pm-accent transition-colors">
                      {extractDateStr(currentTask.start_at) && extractDateStr(currentTask.due_date)
                        ? `${formatPmDate(currentTask.start_at)} → ${formatPmDate(currentTask.due_date)}`
                        : extractDateStr(currentTask.due_date)
                          ? formatPmDate(currentTask.due_date)
                          : __('Set dates')}
                    </button>
                  )}
                </div>

                {/* Assignees — interactive (before Estimation so user is assigned first) */}
                <div className="flex items-start min-h-[32px] px-2 rounded-md hover:bg-muted/40 transition-colors py-1">
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0 pt-0.5">
                    <Users className="h-4 w-4" /><span className="text-sm">{__('Assignees')}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {assignees.map(user => (
                        <span key={user.id || user.assigned_to} className="inline-flex items-center gap-1 text-sm bg-muted/50 rounded-full pl-0.5 pr-2 py-0.5">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="text-[8px]">{userInitials(user.display_name || '')}</AvatarFallback>
                          </Avatar>
                          {user.display_name}
                          <button type="button" className="ml-0.5 text-pm-text-muted hover:text-destructive" onClick={() => handleRemoveAssignee(user.assigned_to ?? user.id)}>
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                      <button type="button" onClick={() => setShowAssigneeSearch(v => !v)}
                        className="inline-flex items-center gap-1 text-[15px] text-pm-accent hover:text-pm-accent/80 transition-colors">
                        <Plus className="h-3.5 w-3.5" />{__('Add')}
                      </button>
                    </div>
                    {showAssigneeSearch && (
                      <div className="relative mt-1.5">
                        <Input autoFocus value={assigneeQuery} onChange={e => handleAssigneeSearch(e.target.value)}
                          placeholder={__('Search users...')} className="h-7 text-sm"
                          onKeyDown={e => { if (e.key === 'Escape') { setShowAssigneeSearch(false); setAssigneeQuery(''); setAssigneeResults([]) } }}
                        />
                        {assigneeResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-36 overflow-y-auto">
                            {assigneeResults.map(u => {
                              const isAssigned = assignees.some(a => parseInt(a.id || a.assigned_to) === parseInt(u.id))
                              return (
                                <button key={u.id} type="button"
                                  className={cn("w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left", isAssigned ? "bg-pm-accent/5 text-pm-accent" : "hover:bg-muted/50")}
                                  onClick={() => isAssigned ? handleRemoveAssignee(u.id) : handleAddAssignee(u)}
                                >
                                  <Avatar className="h-5 w-5"><AvatarImage src={u.avatar_url} /><AvatarFallback className="text-[8px]">{userInitials(u.display_name)}</AvatarFallback></Avatar>
                                  <span className="flex-1">{u.display_name}</span>
                                  {isAssigned && <Check className="h-4 w-4 text-pm-accent shrink-0" />}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Estimation — editable, depends on assignees */}
                <TaskEstimationField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} api={api} />

                {/* Task type — editable dropdown (task types only) */}
                <TaskTypeField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} api={api} />

                {/* Milestone — assign task to a milestone */}
                <MilestoneField task={currentTask} projectId={currentTask?.project_id} api={api} />

                {/* Privacy — toggleable when Pro, ProGate upsell when free */}
                <TaskPrivacyField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} api={api} />

                {/* ── Pro inline properties (Time Tracker, Labels, Recurrence, Custom Fields) ── */}
                <ProInlineProperties
                  taskId={currentTask?.id}
                  projectId={currentTask?.project_id}
                  currentTask={currentTask}
                  dispatch={dispatch}
                  api={api}
                />
              </div>
            </div>

            <Separator />

            {/* ── Description ── */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-pm-text-muted/70"><FileText className="h-4 w-4" />{__('Description')}</h4>
                {!editingDesc && (
                  <button type="button" className="text-[15px] font-medium text-pm-accent hover:text-pm-accent/80 transition-colors"
                    onClick={() => { setDescription(currentTask.description?.html || currentTask.description?.content || ''); setEditingDesc(true) }}>
                    {currentTask.description?.content ? __('Edit') : __('Add')}
                  </button>
                )}
              </div>
              {editingDesc ? (
                <div className="space-y-3">
                  <RichTextEditor content={description} placeholder={__('Write a description...')} onChange={html => setDescription(html)} autofocus minHeight="100px" />
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="h-7 text-sm" onClick={handleDescSave} disabled={savingDesc}>{savingDesc ? __('Saving...') : __('Save')}</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-sm" onClick={handleDescCancel}>{__('Cancel')}</Button>
                  </div>
                </div>
              ) : (
                <div className={cn('rounded-lg p-3 min-h-[48px] transition-colors', currentTask.description?.html ? 'bg-muted/20' : 'bg-muted/10 border border-dashed border-border/60')}>
                  {currentTask.description?.html ? (
                    <>
                      <div className="prose prose-sm max-w-none text-sm text-pm-text-primary/80 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: stripAllPreviewUrls(currentTask.description.html) }} />
                      <GitHubPreviewContainer content={currentTask.description.html} />
                      <NotionPreviewContainer content={currentTask.description.html} />
                      <LoomPreviewContainer content={currentTask.description.html} />
                    </>
                  ) : (
                    <p className="text-sm text-pm-text-muted italic">{__('No description yet. Click "Add" to write one.')}</p>
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
              <h4 className="text-sm font-semibold uppercase tracking-wider text-pm-text-muted/70 mb-3 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />{__('Comments')}
                {comments.length > 0 && <span className="text-[14px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums">{comments.length}</span>}
              </h4>

              {/* Comment list */}
              {comments.length > 0 && (
                <div className="space-y-3 mb-4">
                  {comments.map(comment => {
                    const isOwn = comment.creator?.data?.id === (typeof PM_Vars !== 'undefined' ? PM_Vars.current_user?.ID : null)
                    const isEditing = editingCommentId === comment.id
                    return (
                      <div key={comment.id} className="flex gap-2.5 group/comment">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarImage src={comment.creator?.data?.avatar_url} />
                          <AvatarFallback className="text-[11px]">{userInitials(comment.creator?.data?.display_name ?? '?')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-pm-text-primary">{comment.creator?.data?.display_name}</span>
                            <span className="text-[13px] text-pm-text-muted">{formatPmDateTime(comment.created_at)}</span>
                            {isOwn && !isEditing && (
                              <span className="opacity-0 group-hover/comment:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
                                <button type="button" onClick={() => startEditComment(comment)} className="p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent" title={__('Edit')}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button type="button" onClick={() => handleDeleteComment(comment.id)} className="p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-destructive" title={__('Delete')}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </span>
                            )}
                          </div>
                          {isEditing ? (
                            <div className="space-y-2">
                              <RichTextEditor content={editCommentText} onChange={setEditCommentText} minHeight="60px" autofocus />
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="h-6 text-[15px]" onClick={handleUpdateComment}>{__('Save')}</Button>
                                <Button size="sm" variant="ghost" className="h-6 text-[15px]" onClick={cancelEditComment}>{__('Cancel')}</Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-sm text-pm-text-primary/80 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: stripAllPreviewUrls(comment.content) }} />
                              <GitHubPreviewContainer content={comment.content || ''} />
                              <NotionPreviewContainer content={comment.content || ''} />
                              <LoomPreviewContainer content={comment.content || ''} />
                            </>
                          )}
                          {/* Comment files */}
                          {comment.files?.data?.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {comment.files.data.some(f => (f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url)) && (
                                <div className="flex gap-2 flex-wrap">
                                  {comment.files.data.filter(f => (f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url)).map(f => (
                                    <a key={f.id} href={f.url} target="_blank" rel="noreferrer"
                                      className="group relative block overflow-hidden rounded-xl border border-border/50 hover:border-pm-accent/40 transition-all hover:shadow-md">
                                      <img src={f.thumb || f.url} alt={f.name} className="h-24 w-24 object-cover transition-transform group-hover:scale-105" />
                                    </a>
                                  ))}
                                </div>
                              )}
                              {comment.files.data.some(f => !((f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url))) && (
                                <div className="flex gap-2 flex-wrap">
                                  {comment.files.data.filter(f => !((f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url))).map(f => (
                                    <a key={f.id} href={f.url} target="_blank" rel="noreferrer"
                                      className="inline-flex items-center gap-2 text-sm border border-border/50 rounded-xl px-3 py-2 hover:bg-muted/40 hover:border-pm-accent/30 transition-all group">
                                      <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                                        <Paperclip className="h-3.5 w-3.5 text-pm-text-muted group-hover:text-pm-accent transition-colors" />
                                      </div>
                                      <span className="text-pm-text-primary truncate max-w-[150px] text-[13px] font-medium">{f.name}</span>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
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
                <FileUploadArea files={commentFiles} onFilesChange={setCommentFiles} compact />
                <Button size="sm" className="h-7 text-sm" onClick={handleSubmitComment} disabled={!newComment.trim() || submittingComment}>
                  {submittingComment ? __('Sending...') : __('Add Comment')}
                </Button>
              </div>
            </div>

            <Separator />

            {/* ── Activity Log ── */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-pm-text-muted/70 flex items-center gap-1.5">
                  <Activity className="h-4 w-4" />{__('Activity')}
                </h4>
                <button
                  type="button"
                  onClick={showActivities ? () => setShowActivities(false) : handleLoadActivities}
                  className="p-1 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent transition-colors"
                  title={showActivities ? __('Hide activity') : __('Show activity')}
                >
                  {showActivities
                    ? <Eye className="h-4 w-4" />
                    : <EyeOff className="h-4 w-4" />
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
                      <div key={act.id || i} className="flex gap-2 text-sm text-pm-text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-pm-text-muted/30 mt-1.5 shrink-0" />
                        <div>
                          {parseActivityMessage(act) || act.action}
                          {act.committed_at && <span className="ml-1.5 text-[14px]">· {formatPmDateTime(act.committed_at)}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-pm-text-muted italic">{__('No activity yet')}</p>
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
