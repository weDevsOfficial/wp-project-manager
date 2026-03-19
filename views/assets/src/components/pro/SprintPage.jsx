import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import {
  fetchSprints, createSprint, updateSprint, updateSprintStatus,
  deleteSprint, fetchSprintTasks, addTaskToSprint, removeTaskFromSprint,
  moveTaskBetweenSprints,
} from '@store/pro/sprintSlice'
import { useApi } from '@hooks/useApi'
import { useProApi } from '@hooks/useProApi'
import { useI18n } from '@hooks/useI18n'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Textarea } from '@components/ui/textarea'
import { Badge } from '@components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs'
import { Checkbox } from '@components/ui/checkbox'
import { Progress } from '@components/ui/progress'
import { Skeleton } from '@components/ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { Separator } from '@components/ui/separator'
import { ScrollArea } from '@components/ui/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@components/ui/dropdown-menu'
import {
  Plus, ChevronDown, ChevronRight, ChevronLeft, MoreHorizontal,
  Pencil, Trash2, CheckCircle2, RotateCcw, Calendar, Import,
  Clock, Timer, TrendingUp, X, ArrowRightLeft, Minus, ListTodo,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const api = useApi()
const proApi = useProApi()

// ── Helpers ─────────────────────────────────────────────
function minutesToTime(min) {
  if (!min && min !== 0) return '0:00'
  const m = parseInt(min) || 0
  const totalSec = m * 60
  const h = Math.floor(totalSec / 3600)
  const mm = Math.floor((totalSec % 3600) / 60)
  return `${h}:${String(mm).padStart(2, '0')}`
}

function formatSprintDate(val) {
  if (!val) return ''
  if (typeof val === 'string') return val.substring(0, 10)
  if (typeof val === 'object' && val.date) return val.date.substring(0, 10)
  return ''
}

function relativeDate(dateStr) {
  if (!dateStr) return ''
  const d = typeof dateStr === 'string' ? dateStr.substring(0, 10) : dateStr?.date?.substring(0, 10) || ''
  if (!d) return ''
  const target = new Date(d)
  const now = new Date()
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Today'
  if (diff === 1) return '1d left'
  return `${diff}d left`
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRINT FORM (Create / Edit)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SprintForm({ sprint, projects, onSubmit, onCancel }) {
  const { __ } = useI18n()
  const [title, setTitle] = useState(sprint?.title || '')
  const [description, setDescription] = useState(sprint?.description || '')
  const [startDate, setStartDate] = useState(formatSprintDate(sprint?.start_at || sprint?.start_date) || '')
  const [dueDate, setDueDate] = useState(formatSprintDate(sprint?.due_date) || '')
  const [selectedProjects, setSelectedProjects] = useState(() => {
    const sp = sprint?.projects?.data
    if (!sp) return []
    const arr = Array.isArray(sp) ? sp : Object.values(sp)
    return arr.map(p => Number(p.id || p.project_id)).filter(Boolean)
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description,
      start_at: startDate,
      due_date: dueDate,
      project_ids: selectedProjects,
    })
  }

  const toggleProject = (id) => {
    const numId = Number(id)
    setSelectedProjects(prev =>
      prev.includes(numId) ? prev.filter(p => p !== numId) : [...prev, numId]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>{__('Sprint Title')}</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={__('e.g. Sprint 1')} autoFocus />
      </div>
      <div className="space-y-1.5">
        <Label>{__('Description')}</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>{__('Start Date')}</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>{__('Due Date')}</Label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>
      {projects && projects.length > 0 && (
        <div className="space-y-1.5">
          <Label>{__('Projects')}</Label>
          <ScrollArea className="h-32 border rounded-md p-2">
            {projects.map(p => (
              <div key={p.id} className="flex items-center gap-2 py-1">
                <Checkbox
                  id={`proj-${p.id}`}
                  checked={selectedProjects.includes(Number(p.id))}
                  onCheckedChange={() => toggleProject(p.id)}
                />
                <label htmlFor={`proj-${p.id}`} className="text-sm cursor-pointer">{p.title}</label>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>{__('Cancel')}</Button>
        <Button type="submit">{sprint ? __('Update') : __('Create Sprint')}</Button>
      </DialogFooter>
    </form>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IMPORT TASK MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ImportTaskModal({ open, onOpenChange, sprint, onImport, allProjects }) {
  const { __ } = useI18n()
  // Use sprint's linked projects if available, otherwise fall back to all projects
  const projects = useMemo(() => {
    const sp = sprint?.projects?.data
    if (sp) {
      const arr = Array.isArray(sp) ? sp : Object.values(sp)
      if (arr.length > 0) return arr
    }
    return allProjects || []
  }, [sprint?.projects?.data, allProjects])

  const [selectedProject, setSelectedProject] = useState('')
  const [taskLists, setTaskLists] = useState([])
  const [selectedList, setSelectedList] = useState('')
  const [tasks, setTasks] = useState([])
  const [selectedTasks, setSelectedTasks] = useState([])
  const [tab, setTab] = useState('all')
  const [loadingLists, setLoadingLists] = useState(false)
  const [loadingTasks, setLoadingTasks] = useState(false)

  // Fetch task lists when project changes
  useEffect(() => {
    if (!selectedProject) { setTaskLists([]); setTasks([]); return }
    setLoadingLists(true)
    setSelectedList('')
    setTasks([])
    setSelectedTasks([])
    api.get(`projects/${selectedProject}/task-lists`, { per_page: -1 })
      .then(res => {
        const data = res?.data ?? res
        setTaskLists(Array.isArray(data) ? data : Object.values(data || {}))
      })
      .catch(() => setTaskLists([]))
      .finally(() => setLoadingLists(false))
  }, [selectedProject])

  // Fetch tasks when list changes
  useEffect(() => {
    if (!selectedProject || !selectedList) { setTasks([]); return }
    setLoadingTasks(true)
    setSelectedTasks([])
    const params = { project_id: selectedProject, task_list_id: [selectedList], per_page: -1 }
    api.get('tasks', params)
      .then(res => {
        const data = res?.data ?? res
        setTasks(Array.isArray(data) ? data : Object.values(data || {}))
      })
      .catch(() => setTasks([]))
      .finally(() => setLoadingTasks(false))
  }, [selectedProject, selectedList])

  const filteredTasks = useMemo(() => {
    if (tab === 'complete') return tasks.filter(t => t.status === 1 || t.status === 'complete')
    if (tab === 'incomplete') return tasks.filter(t => t.status === 0 || t.status === 'incomplete')
    return tasks
  }, [tasks, tab])

  const toggleTask = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    )
  }

  const selectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(filteredTasks.map(t => t.id))
    }
  }

  const handleImport = () => {
    if (selectedTasks.length === 0) return
    onImport(selectedTasks, selectedProject, selectedList)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-pm-dialog>
        <DialogHeader>
          <DialogTitle>{__('Task Import')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Project select */}
          <div className="space-y-1.5">
            <Label>{__('Project')}</Label>
            <Select value={selectedProject || 'none'} onValueChange={(v) => setSelectedProject(v === 'none' ? '' : v)}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder={__('Select Project')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{__('Select Project')}</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p.id || p.project_id} value={String(p.id || p.project_id)}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task list select */}
          {loadingLists && <div className="text-xs text-pm-text-muted">{__('Loading task lists...')}</div>}
          {selectedProject && !loadingLists && (
            <div className="space-y-1.5">
              <Label>{__('Task List')}</Label>
              <Select value={selectedList || 'none'} onValueChange={(v) => setSelectedList(v === 'none' ? '' : v)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder={__('Select Task List')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{__('Select Task List')}</SelectItem>
                  {taskLists.map(l => (
                    <SelectItem key={l.id} value={String(l.id)}>{l.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Task list with tabs */}
          {selectedList && (
            <>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs px-3 h-6">{__('All')}</TabsTrigger>
                  <TabsTrigger value="complete" className="text-xs px-3 h-6">{__('Completed')}</TabsTrigger>
                  <TabsTrigger value="incomplete" className="text-xs px-3 h-6">{__('Incomplete')}</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2 border-b pb-2">
                <Checkbox
                  id="select-all"
                  checked={filteredTasks.length > 0 && selectedTasks.length === filteredTasks.length}
                  onCheckedChange={selectAll}
                />
                <label htmlFor="select-all" className="text-xs font-medium cursor-pointer">{__('Select All')}</label>
              </div>

              <ScrollArea className="h-48 border rounded-md">
                {loadingTasks ? (
                  <div className="p-4 text-xs text-pm-text-muted text-center">{__('Loading tasks...')}</div>
                ) : filteredTasks.length === 0 ? (
                  <div className="p-4 text-xs text-pm-text-muted text-center">{__('No Task Found!')}</div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-muted/30">
                        <Checkbox
                          id={`import-${task.id}`}
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <label htmlFor={`import-${task.id}`} className="text-sm cursor-pointer flex-1">
                          {task.title}
                        </label>
                        {tab === 'all' && (
                          <Badge variant={task.status === 1 || task.status === 'complete' ? 'default' : 'secondary'} className="text-[9px] px-1.5">
                            {task.status === 1 || task.status === 'complete' ? __('Completed') : __('Incomplete')}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{__('Cancel')}</Button>
          <Button onClick={handleImport} disabled={selectedTasks.length === 0}>
            <Import className="h-3.5 w-3.5 mr-1" />{__('Import')} {selectedTasks.length > 0 && `(${selectedTasks.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRINT TASK ITEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SprintTaskItem({ task, sprint, allSprints, onToggle, onRemove, onMove, isCompleted }) {
  const { __ } = useI18n()
  const [toggling, setToggling] = useState(false)

  const assignees = useMemo(() => {
    const a = task?.assignees?.data
    if (!a) return []
    return Array.isArray(a) ? a : Object.values(a)
  }, [task])

  const handleToggle = async () => {
    setToggling(true)
    await onToggle(task)
    setToggling(false)
  }

  const estTime = task?.formated_com_est
    ? `${task.formated_com_est.hour}:${String(task.formated_com_est.minute).padStart(2, '0')}`
    : '0:00'

  const startDate = formatSprintDate(task?.start_at)
  const dueDate = formatSprintDate(task?.due_date)

  return (
    <div className={cn(
      'flex items-center gap-2 py-2 px-3 rounded group hover:bg-muted/30',
      isCompleted && 'opacity-60'
    )}>
      {/* Checkbox */}
      <div className="shrink-0">
        {toggling ? (
          <span className="w-4 h-4 rounded-full border-2 border-pm-accent border-t-transparent animate-spin inline-block" />
        ) : (
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleToggle}
            disabled={task?.meta?.can_complete_task === false}
          />
        )}
      </div>

      {/* Title */}
      <span className={cn('text-sm flex-1 min-w-0 truncate', isCompleted && 'line-through text-pm-text-muted')}>
        {task.title}
      </span>

      {/* Meta: assignees */}
      {assignees.length > 0 && (
        <div className="flex -space-x-1.5 shrink-0">
          {assignees.slice(0, 3).map(u => (
            <Avatar key={u.id} className="h-5 w-5 border border-white">
              <AvatarImage src={u.avatar_url} />
              <AvatarFallback className="text-[8px]">{(u.display_name || 'U')[0]}</AvatarFallback>
            </Avatar>
          ))}
          {assignees.length > 3 && <span className="text-[9px] text-pm-text-muted ml-1">+{assignees.length - 3}</span>}
        </div>
      )}

      {/* Type badge */}
      {task.type && (
        <Badge variant="outline" className="text-[9px] px-1.5 py-0 shrink-0">{task.type.title}</Badge>
      )}

      {/* Dates */}
      {(startDate || dueDate) && (
        <div className="flex items-center gap-1 text-[10px] text-pm-text-muted shrink-0">
          <Calendar className="h-3 w-3" />
          <span>{startDate}</span>
          {dueDate && <><span>–</span><span>{dueDate}</span></>}
        </div>
      )}

      {/* Estimated time */}
      <div className="text-[10px] text-pm-text-muted shrink-0 flex items-center gap-0.5">
        <Timer className="h-3 w-3" />
        <span>{estTime}</span>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity">
            <MoreHorizontal className="h-3.5 w-3.5 text-pm-text-muted" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {allSprints && allSprints.length > 1 && (
            <>
              {allSprints.filter(s => s.id !== sprint.id).map(s => (
                <DropdownMenuItem key={s.id} onClick={() => onMove(task, s.id)}>
                  <ArrowRightLeft className="h-3.5 w-3.5 mr-2" />{__('Move to')} {s.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => onRemove(task)}>
            <Minus className="h-3.5 w-3.5 mr-2" />{__('Remove from sprint')}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={() => onRemove(task, true)}>
            <Trash2 className="h-3.5 w-3.5 mr-2" />{__('Delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRINT ITEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SprintItem({ sprint, allSprints, allProjects, isCompletedTab, onRefresh }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [importing, setImporting] = useState(false)
  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(false)

  const meta = sprint.meta || {}
  const progress = meta.progress ?? 0
  const users = useMemo(() => {
    if (!meta.users) return []
    return (Array.isArray(meta.users) ? meta.users : Object.values(meta.users))
      .filter(u => u.total_estimated_time)
  }, [meta.users])

  const incompleteTasks = useMemo(() => tasks.filter(t => t.status === 0 || t.status === 'incomplete'), [tasks])
  const completeTasks = useMemo(() => tasks.filter(t => t.status === 1 || t.status === 'complete'), [tasks])

  // Initialize tasks from sprint's embedded data if available
  useEffect(() => {
    const incomplete = sprint?.incomplete_tasks?.data
    const complete = sprint?.complete_tasks?.data
    if (incomplete || complete) {
      const iArr = !incomplete ? [] : Array.isArray(incomplete) ? incomplete : Object.values(incomplete)
      const cArr = !complete ? [] : Array.isArray(complete) ? complete : Object.values(complete)
      setTasks([...iArr, ...cArr])
    }
  }, [sprint?.incomplete_tasks?.data, sprint?.complete_tasks?.data])

  const loadTasks = useCallback(async () => {
    setTasksLoading(true)
    try {
      const res = await proApi.get(`sprints/${sprint.id}/tasks`)
      // Response could be { data: [...] } or flat array or { incomplete_tasks: {...}, complete_tasks: {...} }
      let taskArr = []
      const payload = res?.data ?? res
      if (Array.isArray(payload)) {
        taskArr = payload
      } else if (payload && typeof payload === 'object') {
        // Could be sprint object with embedded tasks
        const it = payload.incomplete_tasks?.data
        const ct = payload.complete_tasks?.data
        if (it || ct) {
          const iArr = !it ? [] : Array.isArray(it) ? it : Object.values(it)
          const cArr = !ct ? [] : Array.isArray(ct) ? ct : Object.values(ct)
          taskArr = [...iArr, ...cArr]
        } else {
          taskArr = Object.values(payload)
        }
      }
      setTasks(taskArr)
    } catch { setTasks([]) }
    setTasksLoading(false)
  }, [sprint.id])

  const handleExpand = () => {
    const next = !expanded
    setExpanded(next)
    if (next) loadTasks()
  }

  const handleStatusToggle = () => {
    dispatch(updateSprintStatus({ sprintId: sprint.id, status: sprint.status === 1 ? 0 : 1 }))
      .then(() => onRefresh?.())
  }

  const handleDelete = () => {
    if (window.confirm(__('Delete this sprint?'))) {
      dispatch(deleteSprint({ sprintId: sprint.id }))
    }
  }

  const handleUpdate = (payload) => {
    dispatch(updateSprint({ sprintId: sprint.id, payload }))
    setEditing(false)
    toast.success(__('Sprint updated'))
  }

  const handleImportTasks = async (taskIds, projectId, listId) => {
    try {
      const res = await proApi.post(`sprints/${sprint.id}/add-task`, {
        task_id: taskIds,
        project_id: projectId,
        list_id: listId,
      })
      toast.success(__('Tasks imported'))
      // The API returns the updated sprint — extract tasks from it
      const updatedSprint = res?.data?.sprint?.data || res?.data?.sprint || res?.data
      if (updatedSprint) {
        const it = updatedSprint.incomplete_tasks?.data
        const ct = updatedSprint.complete_tasks?.data
        if (it || ct) {
          const iArr = !it ? [] : Array.isArray(it) ? it : Object.values(it)
          const cArr = !ct ? [] : Array.isArray(ct) ? ct : Object.values(ct)
          setTasks([...iArr, ...cArr])
        } else {
          loadTasks()
        }
      } else {
        loadTasks()
      }
      onRefresh?.()
    } catch (e) {
      toast.error(e.message || __('Failed to import tasks'))
    }
  }

  const handleToggleTask = async (task) => {
    const newStatus = (task.status === 0 || task.status === 'incomplete') ? 1 : 0
    try {
      await api.post(`tasks/${task.id}/change-status`, { status: newStatus })
      loadTasks()
      onRefresh?.()
    } catch { /* ignore */ }
  }

  const handleRemoveTask = async (task, permanent = false) => {
    if (permanent) {
      if (!window.confirm(__('Permanently delete this task?'))) return
      try {
        await api.del(`tasks/${task.id}`)
        toast.success(__('Task deleted'))
      } catch { /* ignore */ }
    } else {
      dispatch(removeTaskFromSprint({ sprintId: sprint.id, taskId: task.id }))
        .then(() => toast.success(__('Task removed from sprint')))
    }
    loadTasks()
    onRefresh?.()
  }

  const handleMoveTask = async (task, targetSprintId) => {
    dispatch(moveTaskBetweenSprints({ sprintId: sprint.id, taskId: task.id, targetSprintId }))
      .then(() => {
        toast.success(__('Task moved'))
        loadTasks()
        onRefresh?.()
      })
  }

  const startDate = formatSprintDate(sprint.start_at)
  const dueDate = formatSprintDate(sprint.due_date)
  const relative = relativeDate(sprint.due_date)

  return (
    <Card className="mb-3">
      {/* Header row */}
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-3">
          <button onClick={handleExpand} className="text-pm-text-muted hover:text-pm-text-primary transition-colors shrink-0">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium">{sprint.title}</CardTitle>
            {(startDate || dueDate) && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-pm-text-muted">
                <Calendar className="h-3 w-3" />
                <span>{startDate}</span><span>–</span><span>{dueDate}</span>
                {relative && <span className={cn('ml-1 font-medium', relative.includes('overdue') ? 'text-red-500' : 'text-green-600')}>({relative})</span>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-20"><Progress value={progress} className="h-1.5" /></div>
            <span className="text-xs text-pm-text-muted w-8 text-right">{progress}%</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4 text-pm-text-muted" /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {!isCompletedTab && (
                  <DropdownMenuItem onClick={() => setImporting(true)}>
                    <Import className="h-3.5 w-3.5 mr-2" />{__('Import task')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleStatusToggle}>
                  {sprint.status === 1
                    ? <><RotateCcw className="h-3.5 w-3.5 mr-2" />{__('Restore')}</>
                    : <><CheckCircle2 className="h-3.5 w-3.5 mr-2" />{__('Complete')}</>
                  }
                </DropdownMenuItem>
                {!isCompletedTab && (
                  <DropdownMenuItem onClick={() => setEditing(true)}>
                    <Pencil className="h-3.5 w-3.5 mr-2" />{__('Edit')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-3.5 w-3.5 mr-2" />{__('Delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Meta row — always visible */}
      <div className="px-4 pb-2 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-pm-text-muted">{__('Estimated')}</span>
          <span className="font-semibold text-blue-600">{minutesToTime(meta.total_estimated_time)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          <span className="text-pm-text-muted">{__('Completed')}</span>
          <span className="font-semibold text-green-600">{minutesToTime(meta.total_completed_time)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Timer className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-pm-text-muted">{__('Due')}</span>
          <span className="font-semibold text-amber-600">
            {minutesToTime((parseInt(meta.total_estimated_time) || 0) - (parseInt(meta.total_completed_time) || 0))}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-pm-accent" />
          <span className="text-pm-text-muted">{__('Progress')}</span>
          <span className="font-semibold text-pm-accent">{progress}%</span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <CardContent className="pt-0 px-4 pb-4">
          {/* Description */}
          {sprint.description && (
            <div className="text-sm text-pm-text-muted mb-3" dangerouslySetInnerHTML={{ __html: sprint.description }} />
          )}

          {/* User progress avatars */}
          {users.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-4 p-3 bg-muted/20 rounded-lg">
              {users.map(user => {
                const userProgress = user.progress || 0
                return (
                  <div key={user.id} className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="text-xs">{(user.display_name || 'U')[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full px-1 text-[8px] font-bold text-pm-accent border">
                        {userProgress}%
                      </div>
                    </div>
                    <div className="text-xs">
                      <div className="font-medium text-pm-text">{user.display_name}</div>
                      <div className="text-pm-text-muted">
                        {__('Est.')} {minutesToTime(user.total_estimated_time)},
                        {' '}{__('Done')} {minutesToTime(user.total_completed_time)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Tasks */}
          {tasksLoading ? (
            <div className="space-y-2">{[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : (
            <>
              {/* Incomplete tasks */}
              {incompleteTasks.length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] font-semibold uppercase text-pm-text-muted mb-1">{__('Incomplete')} ({incompleteTasks.length})</div>
                  {incompleteTasks.map(task => (
                    <SprintTaskItem
                      key={task.id}
                      task={task}
                      sprint={sprint}
                      allSprints={allSprints}
                      isCompleted={false}
                      onToggle={handleToggleTask}
                      onRemove={handleRemoveTask}
                      onMove={handleMoveTask}
                    />
                  ))}
                </div>
              )}

              {/* Complete tasks */}
              {completeTasks.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase text-pm-text-muted mb-1">{__('Completed')} ({completeTasks.length})</div>
                  {completeTasks.map(task => (
                    <SprintTaskItem
                      key={task.id}
                      task={task}
                      sprint={sprint}
                      allSprints={allSprints}
                      isCompleted
                      onToggle={handleToggleTask}
                      onRemove={handleRemoveTask}
                      onMove={handleMoveTask}
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {incompleteTasks.length === 0 && completeTasks.length === 0 && !tasksLoading && (
                <div className="text-center py-6 text-sm text-pm-text-muted">
                  <ListTodo className="h-8 w-8 mx-auto mb-2 text-pm-text-muted/30" />
                  {__('No Task Found!')}
                  {!isCompletedTab && (
                    <Button variant="link" size="sm" className="ml-1 text-pm-accent" onClick={() => setImporting(true)}>
                      {__('Import tasks')}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      )}

      {/* Edit dialog */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent data-pm-dialog>
          <DialogHeader><DialogTitle>{__('Edit Sprint')}</DialogTitle></DialogHeader>
          <SprintForm sprint={sprint} projects={allProjects} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
        </DialogContent>
      </Dialog>

      {/* Import task modal */}
      <ImportTaskModal
        open={importing}
        onOpenChange={setImporting}
        sprint={sprint}
        allProjects={allProjects}
        onImport={handleImportTasks}
      />
    </Card>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRINT PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function SprintPage() {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { sprints, pagination, loading } = useAppSelector(s => s.sprint)
  const [creating, setCreating] = useState(false)
  const [tab, setTab] = useState('active') // 'active' | 'completed'
  const [allProjects, setAllProjects] = useState([])
  const [filterProject, setFilterProject] = useState('')
  const [page, setPage] = useState(1)

  const fetchData = useCallback(() => {
    const params = { status: tab === 'completed' ? 1 : 0, page, per_page: 10 }
    if (filterProject) params.project_id = filterProject
    dispatch(fetchSprints(params))
  }, [dispatch, tab, page, filterProject])

  useEffect(() => { fetchData() }, [fetchData])

  // Load projects for filter
  useEffect(() => {
    api.get('projects', { per_page: -1 })
      .then(res => {
        const data = res?.data ?? res
        setAllProjects(Array.isArray(data) ? data : Object.values(data || {}))
      })
      .catch(() => {})
  }, [])

  const handleCreate = (payload) => {
    dispatch(createSprint(payload)).then(() => {
      setCreating(false)
      toast.success(__('Sprint created'))
      fetchData()
    })
  }

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setPage(1)
  }

  const totalPages = pagination?.total_page || pagination?.pagination?.total_pages || 1

  if (loading && sprints.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 space-y-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-pm-text-primary">{__('Sprints')}</h2>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-1" />{__('New Sprint')}
        </Button>
      </div>

      {/* Tabs + Filter */}
      <div className="flex items-center justify-between mb-4">
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="h-9">
            <TabsTrigger value="active" className="text-sm px-4">{__('Sprints')}</TabsTrigger>
            <TabsTrigger value="completed" className="text-sm px-4">{__('Completed Sprints')}</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={filterProject || 'all'} onValueChange={(v) => { setFilterProject(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="h-8 text-sm w-48">
            <SelectValue placeholder={__('All Projects')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{__('All Projects')}</SelectItem>
            {allProjects.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Sprint list */}
      {sprints.length === 0 ? (
        <div className="text-center py-16">
          <ListTodo className="h-12 w-12 text-pm-text-muted/20 mx-auto mb-3" />
          <p className="text-sm text-pm-text-muted">
            {tab === 'completed'
              ? __('No completed sprints.')
              : __('No sprints yet. Create your first sprint to get started.')}
          </p>
        </div>
      ) : (
        sprints.map(sprint => (
          <SprintItem
            key={sprint.id}
            sprint={sprint}
            allSprints={sprints}
            allProjects={allProjects}
            isCompletedTab={tab === 'completed'}
            onRefresh={fetchData}
          />
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-pm-text-muted">{__('Page')} {page} {__('of')} {totalPages}</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-7" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="outline" className="h-7" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent data-pm-dialog>
          <DialogHeader><DialogTitle>{__('Create Sprint')}</DialogTitle></DialogHeader>
          <SprintForm projects={allProjects} onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
