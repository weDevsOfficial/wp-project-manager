import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@store/index'
import {
  fetchBoards, fetchBoardTasks, createBoard, updateBoard, deleteBoard,
  addTaskToBoard, removeTaskFromBoard, setBoardColor, importTasks,
  saveAutomation,
} from '@store/pro/kanbanSlice'
import { useI18n } from '@hooks/useI18n'
import { useApi } from '@hooks/useApi'
import { useProApi } from '@hooks/useProApi'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Badge } from '@components/ui/badge'
import { Checkbox } from '@components/ui/checkbox'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { ScrollArea } from '@components/ui/scroll-area'
import { Skeleton } from '@components/ui/skeleton'
import {
  Plus, MoreVertical, Trash2, Palette, Calendar, MessageSquare,
  GripVertical, Settings, Import, Maximize, Minimize, Filter,
  Search, Minus, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const api = useApi()
const proApi = useProApi()

const COLOR_SWATCHES = [
  '#EB5A46', '#F5DD29', '#FFAF3F', '#61BD4F', '#0079BF',
  '#C377E0', '#FF80CE', '#00C2E0', '#51E898', '#344563',
  '#B6BBBF', '#6C63FF', '#F77726', '#4BC0C0', '#E74C3C',
  '#3498DB', '#2ECC71', '#9B59B6', '#1ABC9C', '#E67E22',
]

function ColorPickerDialog({ open, onOpenChange, currentColor, onSelect }) {
  const { __ } = useI18n()
  const [custom, setCustom] = useState(currentColor || '')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[280px]" data-pm-dialog>
        <DialogHeader><DialogTitle>{__('Background Color')}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-5 gap-2">
          {COLOR_SWATCHES.map(color => (
            <button
              key={color}
              className={cn(
                'w-10 h-10 rounded-lg border-2 transition-all hover:scale-110',
                currentColor === color ? 'border-pm-text-primary ring-2 ring-pm-accent' : 'border-transparent'
              )}
              style={{ backgroundColor: color }}
              onClick={() => { onSelect(color); onOpenChange(false) }}
              title={color}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="#hex"
            className="h-8 text-sm font-mono flex-1"
          />
          <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: custom || 'transparent' }} />
          <Button size="sm" className="h-8" onClick={() => { if (custom) { onSelect(custom); onOpenChange(false) } }}>{__('Set')}</Button>
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-1 text-xs text-pm-text-muted" onClick={() => { onSelect(''); onOpenChange(false) }}>
          {__('Remove Color')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function fmtDate(val) {
  if (!val) return ''
  if (typeof val === 'object') return (val.date || '').substring(0, 10)
  return String(val).substring(0, 10)
}

function isOverdue(dateStr) {
  if (!dateStr) return false
  const d = fmtDate(dateStr)
  return d && d < new Date().toISOString().substring(0, 10)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IMPORT TASK MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ImportTaskModal({ open, onOpenChange, projectId, boardId, onImport }) {
  const { __ } = useI18n()
  const [taskLists, setTaskLists] = useState([])
  const [selectedList, setSelectedList] = useState('')
  const [tasks, setTasks] = useState([])
  const [selectedTasks, setSelectedTasks] = useState([])
  const [tab, setTab] = useState('all')
  const [loadingLists, setLoadingLists] = useState(false)
  const [loadingTasks, setLoadingTasks] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoadingLists(true)
    api.get(`projects/${projectId}/task-lists`, { per_page: -1 })
      .then(res => {
        const d = res?.data ?? res
        setTaskLists(Array.isArray(d) ? d : Object.values(d || {}))
      })
      .catch(() => setTaskLists([]))
      .finally(() => setLoadingLists(false))
  }, [open, projectId])

  useEffect(() => {
    if (!selectedList) { setTasks([]); return }
    setLoadingTasks(true)
    setSelectedTasks([])
    api.get('tasks', { project_id: projectId, task_list_id: [selectedList], per_page: -1 })
      .then(res => {
        const d = res?.data ?? res
        setTasks(Array.isArray(d) ? d : Object.values(d || {}))
      })
      .catch(() => setTasks([]))
      .finally(() => setLoadingTasks(false))
  }, [selectedList, projectId])

  const filtered = useMemo(() => {
    if (tab === 'complete') return tasks.filter(t => t.status === 1 || t.status === 'complete')
    if (tab === 'incomplete') return tasks.filter(t => t.status === 0 || t.status === 'incomplete')
    return tasks
  }, [tasks, tab])

  const toggleTask = (id) => setSelectedTasks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const selectAll = () => setSelectedTasks(filtered.length === selectedTasks.length ? [] : filtered.map(t => t.id))

  const handleImport = () => {
    if (selectedTasks.length === 0) return
    onImport(selectedTasks, boardId)
    onOpenChange(false)
    setSelectedTasks([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-pm-dialog>
        <DialogHeader><DialogTitle>{__('Import Task')}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {loadingLists ? <p className="text-xs text-pm-text-muted">{__('Loading...')}</p> : (
            <div className="space-y-1.5">
              <Label>{__('Task List')}</Label>
              <Select value={selectedList || 'none'} onValueChange={v => setSelectedList(v === 'none' ? '' : v)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder={__('Select Task List')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{__('Select Task List')}</SelectItem>
                  {taskLists.map(l => <SelectItem key={l.id} value={String(l.id)}>{l.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

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
                <Checkbox id="kan-sel-all" checked={filtered.length > 0 && selectedTasks.length === filtered.length} onCheckedChange={selectAll} />
                <label htmlFor="kan-sel-all" className="text-xs font-medium cursor-pointer">{__('Select All')}</label>
              </div>
              <ScrollArea className="h-48 border rounded-md">
                {loadingTasks ? <div className="p-4 text-xs text-center text-pm-text-muted">{__('Loading...')}</div> :
                  filtered.length === 0 ? <div className="p-4 text-xs text-center text-pm-text-muted">{__('No tasks found')}</div> : (
                    <div className="p-2 space-y-1">
                      {filtered.map(t => (
                        <div key={t.id} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-muted/30">
                          <Checkbox id={`kt-${t.id}`} checked={selectedTasks.includes(t.id)} onCheckedChange={() => toggleTask(t.id)} />
                          <label htmlFor={`kt-${t.id}`} className="text-sm cursor-pointer flex-1 truncate">{t.title}</label>
                          {tab === 'all' && (
                            <Badge variant={t.status === 1 || t.status === 'complete' ? 'default' : 'secondary'} className="text-[9px] px-1.5">
                              {t.status === 1 || t.status === 'complete' ? __('Completed') : __('Incomplete')}
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
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>{__('Cancel')}</Button>
          <Button size="sm" onClick={handleImport} disabled={selectedTasks.length === 0}>
            <Import className="h-3.5 w-3.5 mr-1" />{__('Import')} {selectedTasks.length > 0 && `(${selectedTasks.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTOMATION MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AutomationModal({ open, onOpenChange, projectId, board, users, taskLists, onSave }) {
  const { __ } = useI18n()

  // Load existing automation from board meta
  const existing = board?.automation || {}
  const [moveType, setMoveType] = useState(existing.type || '0')
  const [todoSection, setTodoSection] = useState(existing.todo?.section || '')
  const [todoLists, setTodoLists] = useState(existing.todo?.lists || [])
  const [inProgressReOpened, setInProgressReOpened] = useState(existing.inProgress?.reOpened === 'yes')
  const [doneCompleted, setDoneCompleted] = useState(existing.done?.completed === 'yes')
  const [assignedUsers, setAssignedUsers] = useState(existing.users || [])
  const [taskStatus, setTaskStatus] = useState(existing.taskStatus || 'none')
  const [saving, setSaving] = useState(false)
  const [lists, setLists] = useState(taskLists || [])

  // Fetch task lists for the "Task lists" option
  useEffect(() => {
    if (!open || lists.length > 0) return
    api.get(`projects/${projectId}/task-lists`, { per_page: -1 })
      .then(res => {
        const d = res?.data ?? res
        setLists(Array.isArray(d) ? d : Object.values(d || {}))
      })
      .catch(() => {})
  }, [open, projectId])

  const toggleUser = (user) => {
    setAssignedUsers(prev => {
      const exists = prev.find(u => (u.id || u.user_id) === (user.id || user.user_id))
      return exists ? prev.filter(u => (u.id || u.user_id) !== (user.id || user.user_id)) : [...prev, user]
    })
  }

  const toggleList = (list) => {
    setTodoLists(prev => {
      const exists = prev.find(l => l.id === list.id)
      return exists ? prev.filter(l => l.id !== list.id) : [...prev, list]
    })
  }

  const handleSave = async () => {
    setSaving(true)
    const actions = {
      type: moveType,
      todo: { section: todoSection, lists: todoLists },
      inProgress: { reOpened: inProgressReOpened ? 'yes' : '' },
      done: { completed: doneCompleted ? 'yes' : '' },
      users: assignedUsers,
      taskStatus,
    }
    try {
      await onSave(board.id, actions)
      toast.success(__('Automation updated'))
      onOpenChange(false)
    } catch { toast.error(__('Failed to save')) }
    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-pm-dialog>
        <DialogHeader><DialogTitle>{__('Manage Automation')}</DialogTitle></DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-5 pr-3">
            {/* ── Move Tasks ── */}
            <div className="space-y-2">
              <p className="text-xs text-pm-text-muted">{__('Choose a preset to automate your kanbanboard and sync with Task Lists')}</p>
              <Label className="text-sm font-semibold">{__('Move Tasks')}</Label>
              <Select value={moveType} onValueChange={setMoveType}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{__('Select Type')}</SelectItem>
                  <SelectItem value="none">{__('None')}</SelectItem>
                  <SelectItem value="todo">{__('To Do')}</SelectItem>
                  <SelectItem value="in_progress">{__('In Progress')}</SelectItem>
                  <SelectItem value="done">{__('Done')}</SelectItem>
                </SelectContent>
              </Select>

              {moveType === 'none' && (
                <p className="text-xs text-pm-text-muted italic">{__('This column will not be automated')}</p>
              )}

              {/* To Do options */}
              {moveType === 'todo' && (
                <div className="space-y-3 pl-1">
                  <Label className="text-xs font-medium">{__('Move task here when...')}</Label>
                  <RadioGroup value={todoSection} onValueChange={setTodoSection} className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="newlyadded" id="todo-new" />
                        <Label htmlFor="todo-new" className="text-sm cursor-pointer font-medium">{__('Newly added')}</Label>
                      </div>
                      <p className="text-[11px] text-pm-text-muted pl-6">{__('Tasks added recently on any task lists will be automatically moved here.')}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="lists" id="todo-lists" />
                        <Label htmlFor="todo-lists" className="text-sm cursor-pointer font-medium">{__('Task lists')}</Label>
                      </div>
                      <p className="text-[11px] text-pm-text-muted pl-6">{__('Tasks added only in the selected task lists will be automatically moved here.')}</p>
                    </div>
                  </RadioGroup>
                  {todoSection === 'lists' && (
                    <div className="pl-6 space-y-1">
                      <ScrollArea className="h-28 border rounded-md p-2">
                        {lists.map(l => (
                          <div key={l.id} className="flex items-center gap-2 py-1">
                            <Checkbox id={`tl-${l.id}`} checked={todoLists.some(tl => tl.id === l.id)} onCheckedChange={() => toggleList(l)} />
                            <label htmlFor={`tl-${l.id}`} className="text-sm cursor-pointer">{l.title}</label>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}

              {/* In Progress options */}
              {moveType === 'in_progress' && (
                <div className="space-y-2 pl-1">
                  <div className="flex items-center gap-2">
                    <Checkbox id="ip-reopen" checked={inProgressReOpened} onCheckedChange={setInProgressReOpened} />
                    <Label htmlFor="ip-reopen" className="text-sm cursor-pointer font-medium">{__('Reopened tasks')}</Label>
                  </div>
                  <p className="text-[11px] text-pm-text-muted pl-6">{__('If a closed task in this project reopens, it will automatically move here.')}</p>
                </div>
              )}

              {/* Done options */}
              {moveType === 'done' && (
                <div className="space-y-2 pl-1">
                  <Label className="text-xs font-medium">{__('Move issue here when...')}</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox id="done-complete" checked={doneCompleted} onCheckedChange={setDoneCompleted} />
                    <Label htmlFor="done-complete" className="text-sm cursor-pointer font-medium">{__('Completed tasks')}</Label>
                  </div>
                  <p className="text-[11px] text-pm-text-muted pl-6">{__('Issues will automatically move here when marked as complete.')}</p>
                </div>
              )}
            </div>

            {/* ── Assign User ── */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">{__('Assign User')}</Label>
              <p className="text-[11px] text-pm-text-muted">{__('Select team members to be assigned automatically when a task dropped in this column.')}</p>
              {users && users.length > 0 && (
                <ScrollArea className="h-28 border rounded-md p-2">
                  {users.map(u => {
                    const uid = u.id || u.user_id
                    const isSelected = assignedUsers.some(au => (au.id || au.user_id) === uid)
                    return (
                      <div key={uid} className="flex items-center gap-2 py-1">
                        <Checkbox id={`au-${uid}`} checked={isSelected} onCheckedChange={() => toggleUser(u)} />
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={u.avatar_url} />
                          <AvatarFallback className="text-[8px]">{(u.display_name || 'U')[0]}</AvatarFallback>
                        </Avatar>
                        <label htmlFor={`au-${uid}`} className="text-sm cursor-pointer">{u.display_name}</label>
                      </div>
                    )
                  })}
                </ScrollArea>
              )}
            </div>

            {/* ── Change Task Status ── */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">{__('Change task status')}</Label>
              <RadioGroup value={taskStatus} onValueChange={setTaskStatus} className="space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="none" id="ts-none" />
                    <Label htmlFor="ts-none" className="text-sm cursor-pointer font-medium">{__('None')}</Label>
                  </div>
                  <p className="text-[11px] text-pm-text-muted pl-6">{__('Dropping task here has no progress status')}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="completed" id="ts-complete" />
                    <Label htmlFor="ts-complete" className="text-sm cursor-pointer font-medium">{__('Completed task')}</Label>
                  </div>
                  <p className="text-[11px] text-pm-text-muted pl-6">{__('Dropping task here will automatically mark the task as complete.')}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="incomplete" id="ts-incomplete" />
                    <Label htmlFor="ts-incomplete" className="text-sm cursor-pointer font-medium">{__('Incompleted task')}</Label>
                  </div>
                  <p className="text-[11px] text-pm-text-muted pl-6">{__('Dropping task here will automatically mark the task as incomplete.')}</p>
                </div>
              </RadioGroup>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>{__('Cancel')}</Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? __('Saving...') : __('Update Automation')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILTER PANEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function FilterPanel({ open, onClose, projectId, users, onFilter, onClear }) {
  const { __ } = useI18n()
  const [title, setTitle] = useState('')
  const [userId, setUserId] = useState('')
  const [status, setStatus] = useState('')

  // Legacy sends: { users, title, status, filterTask: 'active' }
  const handleApply = () => onFilter({ users: userId, title, status })

  if (!open) return null
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border mb-3">
      <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={__('Search by title...')} className="h-8 text-sm w-44"
        onKeyDown={e => e.key === 'Enter' && handleApply()} />
      <Select value={userId || 'all'} onValueChange={v => setUserId(v === 'all' ? '' : v)}>
        <SelectTrigger className="h-8 text-sm w-40"><SelectValue placeholder={__('All Users')} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{__('All Users')}</SelectItem>
          {users.map(u => <SelectItem key={u.id || u.user_id} value={String(u.id || u.user_id)}>{u.display_name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={status || 'all'} onValueChange={v => setStatus(v === 'all' ? '' : v)}>
        <SelectTrigger className="h-8 text-sm w-36"><SelectValue placeholder={__('All Status')} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{__('All')}</SelectItem>
          <SelectItem value="incomplete">{__('Incomplete')}</SelectItem>
          <SelectItem value="complete">{__('Complete')}</SelectItem>
        </SelectContent>
      </Select>
      <Button size="sm" className="h-8" onClick={handleApply}><Filter className="h-3.5 w-3.5 mr-1" />{__('Apply')}</Button>
      <Button size="sm" variant="ghost" className="h-8" onClick={() => { setTitle(''); setUserId(''); setStatus(''); onClear(); }}>
        <X className="h-3.5 w-3.5 mr-1" />{__('Clear')}
      </Button>
      <Button size="sm" variant="ghost" className="h-8 ml-auto" onClick={onClose}><X className="h-3.5 w-3.5" /></Button>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEARCH & ADD EXISTING TASK (+ button)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SearchAddTask({ projectId, boardId, onAdd }) {
  const { __ } = useI18n()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (query.length < 3) { setResults([]); return }
    setSearching(true)
    const timer = setTimeout(() => {
      api.get(`projects/${projectId}/tasks`, { title: query, per_page: 10 })
        .then(res => setResults(res?.data ?? []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false))
    }, 500)
    return () => clearTimeout(timer)
  }, [query, projectId])

  const handleAdd = (taskId) => {
    onAdd(taskId, boardId)
    setOpen(false)
    setQuery('')
    setResults([])
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="p-1 rounded hover:bg-black/10 transition-colors" title={__('Add existing task')}>
        <Plus className="h-4 w-4 text-pm-text-muted" />
      </button>
    )
  }

  return (
    <div className="relative">
      <Input value={query} onChange={e => setQuery(e.target.value)} placeholder={__('Search task...')} className="h-7 text-xs w-40" autoFocus
        onBlur={() => setTimeout(() => setOpen(false), 200)} />
      {(results.length > 0 || searching) && (
        <div className="absolute top-8 left-0 w-56 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {searching ? <div className="p-2 text-xs text-pm-text-muted">{__('Searching...')}</div> :
            results.map(t => (
              <button key={t.id} className="w-full text-left px-3 py-2 text-sm hover:bg-muted/30 truncate" onMouseDown={() => handleAdd(t.id)}>
                {t.title}
              </button>
            ))
          }
        </div>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KANBAN CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function KanbanCard({ task, boardId, onRemove }) {
  const { __ } = useI18n()
  const assignees = task.assignees?.data
  const assigneeArr = !assignees ? [] : Array.isArray(assignees) ? assignees : Object.values(assignees)
  const dueDate = fmtDate(task.due_date)
  const overdue = isOverdue(task.due_date) && task.status !== 1 && task.status !== 'complete'
  const commentCount = task.meta?.total_comment || task.comments_count || 0

  return (
    <div
      className="bg-white rounded-lg border border-pm-border p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: task.id, fromBoardId: boardId }))
        e.dataTransfer.effectAllowed = 'move'
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <GripVertical className="h-3.5 w-3.5 text-pm-text-muted/30 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100" />
          <h4 className="text-sm font-medium text-pm-text-primary leading-snug flex-1">{task.title}</h4>
        </div>
        <button onClick={() => onRemove(task.id)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50 text-pm-text-muted hover:text-red-500 transition-all shrink-0" title={__('Remove')}>
          <Minus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-pm-text-muted">
        {dueDate && (
          <span className={cn('flex items-center gap-1', overdue && 'text-red-500')}>
            <Calendar className="h-3 w-3" />{dueDate}
          </span>
        )}
        {commentCount > 0 && (
          <span className="flex items-center gap-1 ml-auto">
            <MessageSquare className="h-3 w-3" />{commentCount}
          </span>
        )}
      </div>
      {assigneeArr.length > 0 && (
        <div className="flex items-center gap-1 mt-2">
          {assigneeArr.slice(0, 4).map(u => (
            <Avatar key={u.id} className="h-5 w-5" title={u.display_name}>
              <AvatarImage src={u.avatar_url} />
              <AvatarFallback className="text-[8px]">{(u.display_name || 'U')[0]}</AvatarFallback>
            </Avatar>
          ))}
          {assigneeArr.length > 4 && <span className="text-[10px] text-pm-text-muted">+{assigneeArr.length - 4}</span>}
        </div>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KANBAN COLUMN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function KanbanColumn({ board, projectId, users, defaultListId, onUpdate, onDelete, onColorChange, onRefresh, onMoveTask, onAddExistingTask, onImportTasks, onSaveAutomation }) {
  const { __ } = useI18n()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(board.title || '')
  const [addingTask, setAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [creating, setCreating] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [automationOpen, setAutomationOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)

  const rawTasks = board.tasks
  const tasks = Array.isArray(rawTasks) ? rawTasks : (rawTasks?.data ?? [])

  useEffect(() => { setTitle(board.title || '') }, [board.title])

  const handleTitleSave = () => {
    if (title.trim() && title !== board.title) onUpdate(board.id, { title: title.trim() })
    setEditing(false)
  }

  const handleRemoveTask = (taskId) => onMoveTask(taskId, board.id, null)

  const handleCreateTask = async () => {
    const taskTitle = newTaskTitle.trim()
    if (!taskTitle || creating) return
    setCreating(true)
    setNewTaskTitle('')
    try {
      // board_id = task list ID (every task needs a list), kan_board_id = kanban column ID
      await api.post(`projects/${projectId}/tasks`, {
        title: taskTitle,
        project_id: projectId,
        board_id: defaultListId || '',
        kan_board_id: board.id,
      })
      setAddingTask(false)
      toast.success(__('Task created'))
      onRefresh?.()
    } catch (e) { toast.error(e?.message || __('Failed')) }
    setCreating(false)
  }

  // Text color based on background
  const headerBg = board.header_background
  const headerTextStyle = headerBg ? { color: '#fff' } : {}

  return (
    <>
      <div
        className={cn(
          'flex flex-col min-w-[280px] max-w-[320px] rounded-xl border transition-colors',
          dragOver ? 'border-pm-accent border-2 bg-pm-accent/5' : 'border-pm-border/50 bg-muted/20'
        )}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false)
          try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'))
            if (data.taskId && data.fromBoardId !== board.id) onMoveTask(data.taskId, data.fromBoardId, board.id)
          } catch {}
        }}
      >
        {/* Header */}
        <div className="px-3 py-2.5 rounded-t-xl flex items-center justify-between gap-1" style={{ backgroundColor: headerBg || 'transparent' }}>
          {editing ? (
            <Input value={title} onChange={e => setTitle(e.target.value)} onBlur={handleTitleSave}
              onKeyDown={e => e.key === 'Enter' && handleTitleSave()} className="h-7 text-sm font-semibold" autoFocus />
          ) : (
            <button className="text-sm font-semibold truncate text-left flex-1" style={headerTextStyle} onClick={() => setEditing(true)}>
              {board.title}
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">{tasks.length}</Badge>
            </button>
          )}
          <div className="flex items-center gap-0.5 shrink-0">
            <SearchAddTask projectId={projectId} boardId={board.id} onAdd={onAddExistingTask} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-black/10"><MoreVertical className="h-4 w-4 text-pm-text-muted" /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setAutomationOpen(true)}>
                  <Settings className="h-3.5 w-3.5 mr-2" />{__('Manage Automation')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setImportOpen(true)}>
                  <Import className="h-3.5 w-3.5 mr-2" />{__('Import Task')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorOpen(true)}>
                  <Palette className="h-3.5 w-3.5 mr-2" />{__('Background Color')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(board.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-2" />{__('Delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Cards */}
        <ScrollArea className="flex-1 px-2 py-2 max-h-[calc(100vh-240px)]">
          <div className="space-y-2 min-h-[40px]">
            {tasks.map(task => (
              <KanbanCard key={task.id} task={task} boardId={board.id} onRemove={handleRemoveTask} />
            ))}
            {tasks.length === 0 && dragOver && (
              <div className="h-16 rounded-lg border-2 border-dashed border-pm-accent/40 flex items-center justify-center text-xs text-pm-accent">{__('Drop here')}</div>
            )}
          </div>
        </ScrollArea>

        {/* Add New Task */}
        <div className="px-2 pb-2">
          {addingTask ? (
            <div className="space-y-2">
              <Input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder={__('Add New Task')} className="h-8 text-sm" autoFocus
                onKeyDown={e => { if (e.key === 'Enter') handleCreateTask(); if (e.key === 'Escape') setAddingTask(false) }} />
              <div className="flex gap-1">
                <Button size="sm" className="h-7 text-xs" disabled={creating} onClick={handleCreateTask}>{creating ? __('Adding...') : __('Add')}</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setAddingTask(false)}>{__('Cancel')}</Button>
              </div>
            </div>
          ) : (
            <button className="w-full text-left text-sm text-pm-text-muted hover:text-pm-accent p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-1.5"
              onClick={() => setAddingTask(true)}>
              <Plus className="h-3.5 w-3.5" />{__('Add New Task')}
            </button>
          )}
        </div>
      </div>

      {/* Import Modal */}
      <ImportTaskModal open={importOpen} onOpenChange={setImportOpen} projectId={projectId} boardId={board.id} onImport={onImportTasks} />

      {/* Automation Modal */}
      <AutomationModal open={automationOpen} onOpenChange={setAutomationOpen} projectId={projectId} board={board} users={users} onSave={onSaveAutomation} />

      {/* Color Picker */}
      <ColorPickerDialog
        open={colorOpen}
        onOpenChange={setColorOpen}
        currentColor={board.header_background || ''}
        onSelect={(color) => onColorChange(board.id, color)}
      />
    </>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KANBAN BOARD PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function KanbanBoard() {
  const { projectId } = useParams()
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { boards, loading } = useAppSelector(s => s.kanban)
  const [newColTitle, setNewColTitle] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [defaultListId, setDefaultListId] = useState('')

  const loadAllBoards = useCallback(() => {
    if (!projectId) return
    dispatch(fetchBoards({ projectId })).then((action) => {
      const arr = Array.isArray(action.payload) ? action.payload : action.payload?.data ?? []
      arr.forEach(board => dispatch(fetchBoardTasks({ projectId, boardId: board.id })))
    })
  }, [projectId, dispatch])

  useEffect(() => { loadAllBoards() }, [loadAllBoards])

  // Load project users for automation
  useEffect(() => {
    if (!projectId) return
    api.get(`projects/${projectId}/users`).then(res => {
      const d = res?.data ?? res
      setUsers(Array.isArray(d) ? d : Object.values(d || {}))
    }).catch(() => {})
  }, [projectId])

  // Load first task list ID (needed for creating tasks — every task needs a list)
  useEffect(() => {
    if (!projectId) return
    api.get(`projects/${projectId}/task-lists`, { per_page: 1 }).then(res => {
      const d = res?.data ?? res
      const arr = Array.isArray(d) ? d : Object.values(d || {})
      if (arr.length > 0) setDefaultListId(String(arr[0].id))
    }).catch(() => {})
  }, [projectId])

  const handleCreateBoard = () => {
    if (!newColTitle.trim()) return
    dispatch(createBoard({ projectId, title: newColTitle.trim() })).then(() => loadAllBoards())
    setNewColTitle('')
  }

  const handleUpdateBoard = (boardId, payload) => dispatch(updateBoard({ projectId, boardId, payload }))
  const handleDeleteBoard = (boardId) => { if (window.confirm(__('Delete this column?'))) dispatch(deleteBoard({ projectId, boardId })) }

  const handleColorChange = (boardId, color) => {
    dispatch(setBoardColor({ projectId, boardId, color: color || '' }))
  }

  const handleMoveTask = useCallback(async (taskId, fromBoardId, toBoardId) => {
    if (!toBoardId) {
      dispatch(removeTaskFromBoard({ projectId, boardId: fromBoardId, taskId })).then(() => loadAllBoards())
      return
    }
    try {
      await dispatch(removeTaskFromBoard({ projectId, boardId: fromBoardId, taskId })).unwrap()
      await dispatch(addTaskToBoard({ projectId, boardId: toBoardId, taskId })).unwrap()
      loadAllBoards()
    } catch { loadAllBoards() }
  }, [dispatch, projectId, loadAllBoards])

  const handleAddExistingTask = useCallback((taskId, boardId) => {
    dispatch(addTaskToBoard({ projectId, boardId, taskId })).then(() => {
      toast.success(__('Task added'))
      loadAllBoards()
    })
  }, [dispatch, projectId, loadAllBoards, __])

  const handleImportTasks = useCallback((taskIds, boardId) => {
    dispatch(importTasks({ projectId, taskIds, boardId })).then(() => {
      toast.success(__('Tasks imported'))
      loadAllBoards()
    })
  }, [dispatch, projectId, loadAllBoards, __])

  const handleSaveAutomation = useCallback(async (boardId, actions) => {
    // Legacy sends: { board_id, data: actions } to pm-pro/v2/projects/{pid}/boards/{bid}/automation
    await dispatch(saveAutomation({ projectId, boardId, automation: { board_id: boardId, data: actions } })).unwrap()
  }, [dispatch, projectId])

  const handleFilter = useCallback(async (filters) => {
    try {
      const res = await proApi.post(`projects/${projectId}/kanboard/filter`, {
        ...filters,
        filterTask: 'active',
      })
      // Response returns boards with filtered tasks already resolved
      const filteredBoards = res?.data ?? res
      if (Array.isArray(filteredBoards)) {
        // Update each board's tasks in Redux with filtered results
        filteredBoards.forEach(fb => {
          const tasks = fb.tasks || []
          dispatch({ type: 'kanban/fetchBoardTasks/fulfilled', payload: { boardId: fb.id, tasks } })
        })
      }
    } catch {
      toast.error(__('Filter failed'))
    }
  }, [projectId, dispatch, proApi, __])

  const toggleFullscreen = () => {
    const el = document.getElementById('kanban-container')
    if (!fullscreen) {
      el?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setFullscreen(!fullscreen)
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="min-w-[280px]">
              <Skeleton className="h-10 w-full rounded-t-xl mb-2" />
              <Skeleton className="h-24 w-full mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div id="kanban-container" className={cn('max-w-[1400px] mx-auto p-6 h-full', fullscreen && 'bg-[#f1f1f1]')}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-pm-text-primary">{__('Kanban Board')}</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={toggleFullscreen}>
            {fullscreen ? <Minimize className="h-3.5 w-3.5 mr-1" /> : <Maximize className="h-3.5 w-3.5 mr-1" />}
            {fullscreen ? __('Exit Fullscreen') : __('Fullscreen')}
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setFilterOpen(!filterOpen)}>
            <Filter className="h-3.5 w-3.5 mr-1" />{__('Filter')}
          </Button>
        </div>
      </div>

      {/* Filter panel */}
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} projectId={projectId} users={users} onFilter={handleFilter} onClear={loadAllBoards} />

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
        {boards.map(board => (
          <KanbanColumn
            key={board.id}
            board={board}
            projectId={projectId}
            users={users}
            defaultListId={defaultListId}
            onUpdate={handleUpdateBoard}
            onDelete={handleDeleteBoard}
            onColorChange={handleColorChange}
            onRefresh={loadAllBoards}
            onMoveTask={handleMoveTask}
            onAddExistingTask={handleAddExistingTask}
            onImportTasks={handleImportTasks}
            onSaveAutomation={handleSaveAutomation}
          />
        ))}

        {/* Add new section */}
        <div className="min-w-[280px] max-w-[320px] shrink-0">
          <Input
            value={newColTitle}
            onChange={e => setNewColTitle(e.target.value)}
            placeholder={__('Add new section')}
            className="h-10 text-sm bg-white border-pm-border/50"
            onKeyDown={e => { if (e.key === 'Enter') handleCreateBoard(); if (e.key === 'Escape') setNewColTitle('') }}
          />
        </div>
      </div>
    </div>
  )
}
