import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchSubtasks, createSubtask, updateSubtask, deleteSubtask, promoteSubtaskToTask, reorderSubtasks } from '@store/pro/subtasksSlice'
import { useI18n } from '@hooks/useI18n'
import { useApi } from '@hooks/useApi'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Checkbox } from '@components/ui/checkbox'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash2, ArrowUpRight, GripVertical, Clock, UserPlus, Calendar, X, Copy, ClipboardCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COPY TO TASK MODAL (select target task list)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function CopyToTaskModal({ open, onOpenChange, subtask, projectId, taskId }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const api = useApi()
  const [saving, setSaving] = useState(false)

  const handleCopy = async () => {
    setSaving(true)
    try {
      await dispatch(promoteSubtaskToTask({ taskId, subtaskId: subtask.id })).unwrap()
      toast.success(__('Subtask copied as task'))
      onOpenChange(false)
    } catch (e) {
      toast.error(e || __('Failed to copy'))
    }
    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" data-pm-dialog>
        <DialogHeader><DialogTitle>{__('Copy Subtask to Task')}</DialogTitle></DialogHeader>
        <p className="text-sm text-pm-text-muted">
          {__('This will convert')} "<span className="font-medium text-pm-text">{subtask?.title}</span>" {__('into a standalone task.')}
        </p>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>{__('Cancel')}</Button>
          <Button size="sm" onClick={handleCopy} disabled={saving}>
            <Copy className="h-3.5 w-3.5 mr-1" />{saving ? __('Copying...') : __('Copy to Task')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED META ICON BAR (estimation hh:mm, assignee, date range, type)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SubtaskMetaBar({ estimation, setEstimation, assignee, setAssignee, startDate, setStartDate, dueDate, setDueDate, subtaskType, setSubtaskType, projectId }) {
  const { __ } = useI18n()
  const api = useApi()
  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState([])
  const [estHour, setEstHour] = useState(() => { const m = parseInt(estimation) || 0; return String(Math.floor(m / 60)).padStart(2, '0') })
  const [estMin, setEstMin] = useState(() => { const m = parseInt(estimation) || 0; return String(m % 60).padStart(2, '0') })
  const [taskTypes, setTaskTypes] = useState([])

  // Load task types
  useEffect(() => {
    if (!projectId) return
    api.get('task-types').then(res => {
      const d = res?.data ?? res
      setTaskTypes(Array.isArray(d) ? d : Object.values(d || {}))
    }).catch(() => {})
  }, [projectId])

  const searchUsers = async (q) => {
    setUserSearch(q)
    if (q.length < 2) { setUserResults([]); return }
    try {
      const res = await api.get('users', { search: q })
      setUserResults(res.data ?? [])
    } catch { setUserResults([]) }
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/30 border-t border-pm-border/50 justify-end flex-wrap">
      {/* Estimation hh:mm */}
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn('p-1.5 rounded hover:bg-muted transition-colors', estimation ? 'text-blue-600' : 'text-pm-text-muted/50 hover:text-pm-text-muted')} title={__('Estimation')}>
            <Clock className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="end">
          <label className="text-[10px] font-medium text-pm-text-muted block mb-2">{__('Estimation')}</label>
          <Input
            value={`${estHour}:${estMin}`}
            onChange={(e) => {
              const parts = e.target.value.split(':')
              const h = parts[0] || '00'
              const m = parts[1] || '00'
              setEstHour(h)
              setEstMin(m)
            }}
            className="h-8 text-sm font-mono"
            placeholder="hh:mm"
          />
          <div className="flex items-center justify-between mt-2">
            <button className="text-xs text-pm-text-muted hover:text-pm-text" onClick={() => { setEstHour('00'); setEstMin('00'); setEstimation(0) }}>{__('Clear')}</button>
            <Button size="sm" className="h-7 text-xs" onClick={() => {
              const total = (parseInt(estHour) || 0) * 60 + (parseInt(estMin) || 0)
              setEstimation(total)
            }}>{__('Set')}</Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Assign user */}
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn('p-1.5 rounded hover:bg-muted flex items-center gap-1 transition-colors', assignee ? 'text-pm-text' : 'text-pm-text-muted/50 hover:text-pm-text-muted')} title={__('Assign user')}>
            {assignee ? (
              <>
                <Avatar className="h-4 w-4"><AvatarImage src={assignee.avatar_url} /><AvatarFallback className="text-[7px]">{(assignee.display_name || 'U')[0]}</AvatarFallback></Avatar>
                <span className="text-[10px] max-w-[60px] truncate">{assignee.display_name}</span>
              </>
            ) : <UserPlus className="h-3.5 w-3.5" />}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-2" align="end">
          {assignee && (
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-pm-border/30">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5"><AvatarImage src={assignee.avatar_url} /><AvatarFallback className="text-[8px]">{(assignee.display_name || 'U')[0]}</AvatarFallback></Avatar>
                <span className="text-xs font-medium">{assignee.display_name}</span>
              </div>
              <button className="text-destructive" onClick={() => setAssignee(null)}><X className="h-3 w-3" /></button>
            </div>
          )}
          <Input value={userSearch} onChange={e => searchUsers(e.target.value)} placeholder={__('Search user...')} className="h-7 text-xs mb-1.5" />
          {userResults.map(u => (
            <button key={u.id} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-muted/50"
              onClick={() => { setAssignee(u); setUserSearch(''); setUserResults([]) }}>
              <Avatar className="h-4 w-4"><AvatarImage src={u.avatar_url} /><AvatarFallback className="text-[7px]">{(u.display_name || 'U')[0]}</AvatarFallback></Avatar>
              {u.display_name}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Date range */}
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn('p-1.5 rounded hover:bg-muted transition-colors', (startDate || dueDate) ? 'text-amber-600' : 'text-pm-text-muted/50 hover:text-pm-text-muted')} title={__('Set date')}>
            <Calendar className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-3" align="end">
          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-medium text-pm-text-muted">{__('Start Date')}</label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-7 text-xs mt-0.5" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-pm-text-muted">{__('Due Date')}</label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-7 text-xs mt-0.5" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <button className="text-xs text-pm-text-muted hover:text-pm-text" onClick={() => { setStartDate(''); setDueDate('') }}>{__('Clear')}</button>
              {(startDate || dueDate) && <span className="text-[9px] text-pm-text-muted">{startDate} – {dueDate}</span>}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Subtask Type */}
      {taskTypes.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button className={cn('p-1.5 rounded hover:bg-muted flex items-center gap-1 transition-colors', subtaskType ? 'text-emerald-600' : 'text-pm-text-muted/50 hover:text-pm-text-muted')} title={__('Subtask Type')}>
              <ClipboardCheck className="h-3.5 w-3.5" />
              {subtaskType && <span className="text-[10px] max-w-[60px] truncate">{subtaskType.title}</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <label className="text-[10px] font-medium text-pm-text-muted block mb-1.5">{__('Subtask Type')}</label>
            {subtaskType && (
              <button className="w-full text-left px-2 py-1 text-xs text-destructive hover:bg-muted/50 rounded mb-1"
                onClick={() => setSubtaskType(null)}>
                {__('Clear type')}
              </button>
            )}
            {taskTypes.map(t => (
              <button key={t.id} className={cn('w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted/50', subtaskType?.id === t.id && 'bg-pm-accent/10 text-pm-accent font-medium')}
                onClick={() => setSubtaskType(t)}>
                {t.title}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUBTASK INLINE EDIT FORM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SubtaskEditForm({ subtask, projectId, onSave, onCancel }) {
  const { __ } = useI18n()
  const fmtD = (v) => { if (!v) return ''; if (typeof v === 'object') return (v.date || '').substring(0, 10); return String(v).substring(0, 10) }
  const [title, setTitle] = useState(subtask.title || '')
  const [estimation, setEstimation] = useState(subtask.estimation || 0)
  const [startDate, setStartDate] = useState(fmtD(subtask.start_at))
  const [dueDate, setDueDate] = useState(fmtD(subtask.due_date))
  const [assignee, setAssignee] = useState(subtask.assignees?.data?.[0] || null)
  const [subtaskType, setSubtaskType] = useState(subtask.type || null)

  const handleSave = () => {
    if (!title.trim()) return
    // Send ALL fields matching legacy Vue format
    onSave({
      title: title.trim(),
      description: subtask.description?.content || subtask.description || '',
      estimation: parseInt(estimation) || 0,
      start_at: startDate || '',
      due_date: dueDate || '',
      assignees: assignee ? [assignee.id] : '',
      type_id: subtaskType?.id || '',
      task_privacy: false,
      parent_id: subtask.parent_id,
    })
  }

  return (
    <div className="rounded-lg border border-pm-border bg-white overflow-hidden">
      <input value={title} onChange={e => setTitle(e.target.value)}
        className="w-full px-3 py-2 text-sm border-0 outline-none bg-transparent" autoFocus maxLength={200}
        placeholder={__('Subtask title')}
        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel() }} />

      <SubtaskMetaBar
        estimation={estimation} setEstimation={setEstimation}
        assignee={assignee} setAssignee={setAssignee}
        startDate={startDate} setStartDate={setStartDate}
        dueDate={dueDate} setDueDate={setDueDate}
        subtaskType={subtaskType} setSubtaskType={setSubtaskType}
        projectId={projectId}
      />

      <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-pm-border/50">
        <button onClick={onCancel} className="text-pm-text-muted hover:text-pm-text"><X className="h-4 w-4" /></button>
        <Button size="sm" className="h-7 text-xs" disabled={!title.trim()} onClick={handleSave}>{__('Update')}</Button>
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUBTASK ITEM (draggable)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SubtaskItem({ subtask, taskId, projectId, boardId, index, onToggle, onDragStart, onDragOver, onDrop }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const [editMode, setEditMode] = useState(false)
  const [copyOpen, setCopyOpen] = useState(false)
  const isComplete = subtask.status === 1 || subtask.status === 'complete'

  const handleEdit = (payload) => {
    dispatch(updateSubtask({ taskId, subtaskId: subtask.id, projectId, boardId, payload }))
      .then((action) => {
        if (!action.error) {
          toast.success(__('Subtask updated'))
          // Refetch to get fresh data with proper format
          dispatch(fetchSubtasks({ taskId }))
        } else {
          toast.error(action.payload || __('Update failed'))
        }
      })
    setEditMode(false)
  }

  const handleDelete = () => {
    if (!window.confirm(__('Delete this subtask?'))) return
    dispatch(deleteSubtask({ taskId, subtaskId: subtask.id }))
    toast.success(__('Subtask deleted'))
  }

  const fmtDate = (val) => {
    if (!val) return ''
    if (typeof val === 'object') return (val.date || '').substring(0, 10)
    return String(val).substring(0, 10)
  }

  if (editMode) {
    return <SubtaskEditForm subtask={subtask} projectId={projectId} onSave={handleEdit} onCancel={() => setEditMode(false)} />
  }

  return (
    <>
      <div
        className="flex items-center gap-2 py-1.5 px-1 rounded hover:bg-muted/50 group"
        draggable
        onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; onDragStart?.(index) }}
        onDragOver={(e) => { e.preventDefault(); onDragOver?.(index) }}
        onDrop={(e) => { e.preventDefault(); onDrop?.(index) }}
      >
        <GripVertical className="h-3 w-3 text-pm-text-muted/30 opacity-0 group-hover:opacity-100 cursor-grab shrink-0" />
        <Checkbox checked={isComplete} onCheckedChange={() => onToggle(subtask)} className="h-4 w-4 shrink-0" />
        <span
          className={cn('text-sm flex-1 cursor-pointer min-w-0 truncate', isComplete && 'line-through text-pm-text-muted')}
          onClick={() => !isComplete && setEditMode(true)}
        >
          {subtask.title}
        </span>

        {/* Meta badges */}
        {subtask.assignees?.data?.[0] && (
          <Avatar className="h-4 w-4 shrink-0" title={subtask.assignees.data[0].display_name}>
            <AvatarImage src={subtask.assignees.data[0].avatar_url} />
            <AvatarFallback className="text-[7px]">{(subtask.assignees.data[0].display_name || 'U')[0]}</AvatarFallback>
          </Avatar>
        )}
        {fmtDate(subtask.start_at || subtask.due_date) && (
          <span className="text-[9px] text-pm-text-muted bg-muted px-1 py-0.5 rounded shrink-0">
            {fmtDate(subtask.start_at)}{fmtDate(subtask.due_date) ? ` – ${fmtDate(subtask.due_date)}` : ''}
          </span>
        )}
        {subtask.estimation > 0 && (
          <span className="text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded font-medium shrink-0" title={`${subtask.estimation} minutes`}>
            {`${String(Math.floor(subtask.estimation / 60)).padStart(2, '0')}:${String(subtask.estimation % 60).padStart(2, '0')}`}
          </span>
        )}
        {subtask.type?.title && (
          <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded font-medium shrink-0">{subtask.type.title}</span>
        )}

        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted shrink-0">
              <MoreHorizontal className="h-3.5 w-3.5 text-pm-text-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {!isComplete && (
              <DropdownMenuItem onClick={() => setEditMode(true)}>
                <Pencil className="h-3.5 w-3.5 mr-2" />{__('Edit')}
              </DropdownMenuItem>
            )}
            {!isComplete && (
              <DropdownMenuItem onClick={() => setCopyOpen(true)}>
                <Copy className="h-3.5 w-3.5 mr-2" />{__('Copy to Task')}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
              <Trash2 className="h-3.5 w-3.5 mr-2" />{__('Delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CopyToTaskModal open={copyOpen} onOpenChange={setCopyOpen} subtask={subtask} projectId={projectId} taskId={taskId} />
    </>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUBTASK CREATE FORM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SubtaskForm({ projectId, onClose, onSubmit }) {
  const { __ } = useI18n()
  const [title, setTitle] = useState('')
  const [estimation, setEstimation] = useState(0)
  const [dueDate, setDueDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [assignee, setAssignee] = useState(null)
  const [subtaskType, setSubtaskType] = useState(null)
  const [showMeta, setShowMeta] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!title.trim() || submitting) return
    setSubmitting(true)
    const payload = { title: title.trim() }
    if (estimation) payload.estimation = parseInt(estimation) || 0
    if (dueDate) payload.due_date = dueDate
    if (startDate) payload.start_at = startDate
    if (assignee) payload.assignees = [assignee.id]
    if (subtaskType) payload.type_id = subtaskType.id
    onSubmit(payload)
    setTitle('')
    setEstimation(0)
    setDueDate('')
    setStartDate('')
    setAssignee(null)
    setSubtaskType(null)
    setShowMeta(false)
    setSubmitting(false)
  }

  return (
    <div className="rounded-lg border border-pm-border bg-white overflow-hidden">
      <input value={title} onChange={e => setTitle(e.target.value)}
        placeholder={__('Add new subtask (character limit 200)')} maxLength={200}
        className="w-full px-3 py-2 text-sm border-0 outline-none bg-transparent" autoFocus
        onFocus={() => setShowMeta(true)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') onClose() }} />

      {showMeta && (
        <SubtaskMetaBar
          estimation={estimation} setEstimation={setEstimation}
          assignee={assignee} setAssignee={setAssignee}
          startDate={startDate} setStartDate={setStartDate}
          dueDate={dueDate} setDueDate={setDueDate}
          subtaskType={subtaskType} setSubtaskType={setSubtaskType}
          projectId={projectId}
        />
      )}

      {showMeta && (
        <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-pm-border/50">
          <button onClick={onClose} className="text-pm-text-muted hover:text-pm-text"><X className="h-4 w-4" /></button>
          <Button size="sm" className="h-7 text-xs" disabled={!title.trim() || submitting} onClick={handleSubmit}>{__('Add New')}</Button>
        </div>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN SUBTASK LIST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function SubtaskList({ taskId, projectId, boardId }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { subtasks } = useAppSelector(s => s.subtasks)
  const [adding, setAdding] = useState(false)
  const dragIdx = useRef(null)

  useEffect(() => {
    if (taskId) dispatch(fetchSubtasks({ taskId }))
  }, [taskId, dispatch])

  const incomplete = subtasks.filter(s => s.status !== 1 && s.status !== 'complete')
  const complete = subtasks.filter(s => s.status === 1 || s.status === 'complete')

  const handleAdd = useCallback((payload) => {
    dispatch(createSubtask({ taskId, projectId, boardId, payload })).then((action) => {
      if (!action.error) toast.success(__('Subtask added'))
      else toast.error(action.payload || __('Failed to add subtask'))
    })
  }, [dispatch, taskId, projectId, boardId, __])

  const handleToggle = useCallback((subtask) => {
    const newStatus = (subtask.status === 1 || subtask.status === 'complete') ? 0 : 1
    dispatch(updateSubtask({
      taskId, subtaskId: subtask.id, projectId, boardId,
      payload: { title: subtask.title, status: newStatus },
    }))
  }, [dispatch, taskId, projectId, boardId])

  // Drag & drop reorder
  const handleDragStart = useCallback((idx) => { dragIdx.current = idx }, [])
  const handleDragOver = useCallback(() => {}, [])
  const handleDrop = useCallback((dropIdx) => {
    const fromIdx = dragIdx.current
    if (fromIdx === null || fromIdx === dropIdx) return
    dragIdx.current = null

    // Reorder locally
    const reordered = [...incomplete]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(dropIdx, 0, moved)

    // Build orders array for API
    const orders = reordered.map((s, i) => ({ id: s.id, order: i }))
    dispatch(reorderSubtasks({ orders }))
    // Refetch to sync
    setTimeout(() => dispatch(fetchSubtasks({ taskId })), 300)
  }, [incomplete, dispatch, taskId])

  return (
    <div className="space-y-2">
      {/* Incomplete subtasks */}
      {incomplete.map((sub, idx) => (
        <SubtaskItem
          key={sub.id}
          subtask={sub}
          taskId={taskId}
          projectId={projectId}
          boardId={boardId}
          index={idx}
          onToggle={handleToggle}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}

      {/* Add new subtask */}
      {adding ? (
        <SubtaskForm projectId={projectId} onClose={() => setAdding(false)} onSubmit={handleAdd} />
      ) : (
        <button className="text-xs text-pm-accent hover:underline flex items-center gap-1 py-1" onClick={() => setAdding(true)}>
          <Plus className="h-3 w-3" />{__('Add Subtask')}
        </button>
      )}

      {/* Completed subtasks */}
      {complete.length > 0 && (
        <div className="pt-2 border-t border-pm-border/50">
          <p className="text-[10px] font-medium uppercase text-pm-text-muted/60 mb-1">{__('Completed')} ({complete.length})</p>
          {complete.map((sub, idx) => (
            <SubtaskItem
              key={sub.id}
              subtask={sub}
              taskId={taskId}
              projectId={projectId}
              boardId={boardId}
              index={idx}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
