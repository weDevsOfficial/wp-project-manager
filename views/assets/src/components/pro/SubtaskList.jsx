import React, { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchSubtasks, createSubtask, updateSubtask, deleteSubtask, promoteSubtaskToTask } from '@store/pro/subtasksSlice'
import { useI18n } from '@hooks/useI18n'
import { useApi } from '@hooks/useApi'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Checkbox } from '@components/ui/checkbox'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash2, ArrowUpRight, GripVertical, Clock, UserPlus, Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ── SubtaskItem ────────────────────────────────────────
function SubtaskItem({ subtask, taskId, projectId, boardId, onToggle }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(subtask.title || '')

  const isComplete = subtask.status === 1 || subtask.status === 'complete'

  const handleSave = () => {
    if (title.trim() && title !== subtask.title) {
      dispatch(updateSubtask({ taskId, subtaskId: subtask.id, projectId, boardId, payload: { title: title.trim() } }))
    }
    setEditing(false)
  }

  const handleDelete = () => {
    dispatch(deleteSubtask({ taskId, subtaskId: subtask.id }))
    toast.success(__('Subtask deleted'))
  }

  const handlePromote = () => {
    dispatch(promoteSubtaskToTask({ taskId, subtaskId: subtask.id }))
    toast.success(__('Subtask promoted to task'))
  }

  return (
    <div className="flex items-center gap-2 py-1.5 px-1 rounded hover:bg-muted/50 group">
      <GripVertical className="h-3 w-3 text-pm-text-muted/30 opacity-0 group-hover:opacity-100 cursor-grab shrink-0" />
      <Checkbox
        checked={isComplete}
        onCheckedChange={() => onToggle(subtask)}
        className="h-4 w-4 shrink-0"
      />
      {editing ? (
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
          className="h-7 text-sm flex-1"
          autoFocus
        />
      ) : (
        <span
          className={cn('text-sm flex-1 cursor-pointer min-w-0 truncate', isComplete && 'line-through text-pm-text-muted')}
          onClick={() => setEditing(true)}
        >
          {subtask.title}
        </span>
      )}

      {/* Metadata badges */}
      {subtask.assignees?.data?.[0] && (
        <Avatar className="h-4 w-4 shrink-0" title={subtask.assignees.data[0].display_name}>
          <AvatarImage src={subtask.assignees.data[0].avatar_url} />
          <AvatarFallback className="text-[7px]">{(subtask.assignees.data[0].display_name || 'U')[0]}</AvatarFallback>
        </Avatar>
      )}
      {subtask.due_date?.date && (
        <span className="text-[9px] text-pm-text-muted bg-muted px-1 py-0.5 rounded shrink-0">{subtask.due_date.date}</span>
      )}
      {subtask.estimation > 0 && (
        <span className="text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded font-medium shrink-0">{subtask.estimation}m</span>
      )}
      {subtask.type?.title && (
        <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded font-medium shrink-0">{subtask.type.title}</span>
      )}

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted shrink-0">
            <MoreHorizontal className="h-3.5 w-3.5 text-pm-text-muted" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5 mr-2" />{__('Edit')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePromote}>
            <ArrowUpRight className="h-3.5 w-3.5 mr-2" />{__('Make Task')}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5 mr-2" />{__('Delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ── SubtaskForm (matches Vue: title + estimation + assignee + date + type) ──
function SubtaskForm({ onClose, onSubmit }) {
  const { __ } = useI18n()
  const api = useApi()
  const [title, setTitle] = useState('')
  const [estimation, setEstimation] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [assignee, setAssignee] = useState(null)
  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState([])
  const [showMeta, setShowMeta] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const searchUsers = async (q) => {
    setUserSearch(q)
    if (q.length < 2) { setUserResults([]); return }
    try {
      const res = await api.get('users', { search: q })
      setUserResults(res.data ?? [])
    } catch { setUserResults([]) }
  }

  const handleSubmit = () => {
    if (!title.trim() || submitting) return
    setSubmitting(true)
    const payload = { title: title.trim() }
    if (estimation) payload.estimation = parseInt(estimation) || 0
    if (dueDate) payload.due_date = dueDate
    if (startDate) payload.start_at = startDate
    if (assignee) payload.assignees = [assignee.id]
    onSubmit(payload)
    // Reset
    setTitle('')
    setEstimation('')
    setDueDate('')
    setStartDate('')
    setAssignee(null)
    setShowMeta(false)
    setSubmitting(false)
  }

  return (
    <div className="rounded-lg border border-pm-border bg-white overflow-hidden">
      {/* Title input */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={__('Add new subtask (max 200 chars)')}
        maxLength={200}
        className="w-full px-3 py-2 text-sm border-0 outline-none bg-transparent"
        autoFocus
        onFocus={() => setShowMeta(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit()
          if (e.key === 'Escape') onClose()
        }}
      />

      {/* Meta row — estimation, assignee, date, type */}
      {showMeta && (
        <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/30 border-t border-pm-border/50 justify-end flex-wrap">
          {/* Estimation */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 rounded hover:bg-muted text-pm-text-muted/50 hover:text-pm-text-muted" title={__('Estimation')}>
                <Clock className="h-3.5 w-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-2" align="end">
              <label className="text-[10px] font-medium text-pm-text-muted">{__('Estimation (minutes)')}</label>
              <Input type="number" min={0} value={estimation} onChange={e => setEstimation(e.target.value)} className="h-7 text-xs mt-1" placeholder="0" />
            </PopoverContent>
          </Popover>

          {/* Assign user */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 rounded hover:bg-muted text-pm-text-muted/50 hover:text-pm-text-muted flex items-center gap-1" title={__('Assign user')}>
                {assignee ? (
                  <>
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={assignee.avatar_url} />
                      <AvatarFallback className="text-[7px]">{(assignee.display_name || 'U')[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] text-pm-text max-w-[60px] truncate">{assignee.display_name}</span>
                  </>
                ) : (
                  <UserPlus className="h-3.5 w-3.5" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-2" align="end">
              {/* Show selected user */}
              {assignee && (
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-pm-border/30">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={assignee.avatar_url} />
                      <AvatarFallback className="text-[8px]">{(assignee.display_name || 'U')[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{assignee.display_name}</span>
                  </div>
                  <button className="text-[10px] text-destructive hover:underline" onClick={() => setAssignee(null)}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <Input
                value={userSearch}
                onChange={e => searchUsers(e.target.value)}
                placeholder={__('Search user...')}
                className="h-7 text-xs mb-1.5"
              />
              {userResults.map(u => (
                <button
                  key={u.id}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-muted/50"
                  onClick={() => { setAssignee(u); setUserSearch(''); setUserResults([]) }}
                >
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={u.avatar_url} />
                    <AvatarFallback className="text-[7px]">{(u.display_name || 'U')[0]}</AvatarFallback>
                  </Avatar>
                  {u.display_name}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Date */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 rounded hover:bg-muted text-pm-text-muted/50 hover:text-pm-text-muted" title={__('Set date')}>
                <Calendar className="h-3.5 w-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-2" align="end">
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-medium text-pm-text-muted">{__('Start Date')}</label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-7 text-xs mt-0.5" />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-pm-text-muted">{__('Due Date')}</label>
                  <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-7 text-xs mt-0.5" />
                </div>
                {(startDate || dueDate) && (
                  <button className="text-[10px] text-destructive" onClick={() => { setStartDate(''); setDueDate('') }}>
                    {__('Clear dates')}
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Submit row */}
      {showMeta && (
        <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-pm-border/50">
          <button onClick={onClose} className="text-pm-text-muted hover:text-pm-text">
            <X className="h-4 w-4" />
          </button>
          <Button size="sm" className="h-7 text-xs" disabled={!title.trim() || submitting} onClick={handleSubmit}>
            {__('Add New')}
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Main SubtaskList ───────────────────────────────────
export default function SubtaskList({ taskId, projectId, boardId }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { subtasks } = useAppSelector(s => s.subtasks)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (taskId) dispatch(fetchSubtasks({ taskId }))
  }, [taskId, dispatch])

  const incomplete = subtasks.filter(s => s.status !== 1 && s.status !== 'complete')
  const complete = subtasks.filter(s => s.status === 1 || s.status === 'complete')

  const handleAdd = useCallback((payload) => {
    dispatch(createSubtask({
      taskId, projectId, boardId, payload,
    })).then((action) => {
      if (!action.error) {
        toast.success(__('Subtask added'))
      } else {
        toast.error(action.payload || __('Failed to add subtask'))
      }
    })
  }, [dispatch, taskId, projectId, boardId, __])

  const handleToggle = useCallback((subtask) => {
    const newStatus = (subtask.status === 1 || subtask.status === 'complete') ? 0 : 1
    dispatch(updateSubtask({
      taskId, subtaskId: subtask.id, projectId, boardId,
      payload: { title: subtask.title, status: newStatus },
    }))
  }, [dispatch, taskId, projectId, boardId])

  return (
    <div className="space-y-2">
      {/* Incomplete subtasks */}
      {incomplete.map(sub => (
        <SubtaskItem key={sub.id} subtask={sub} taskId={taskId} projectId={projectId} boardId={boardId} onToggle={handleToggle} />
      ))}

      {/* Add new subtask — full form matching Vue */}
      {adding ? (
        <SubtaskForm
          onClose={() => setAdding(false)}
          onSubmit={handleAdd}
        />
      ) : (
        <button
          className="text-xs text-pm-accent hover:underline flex items-center gap-1 py-1"
          onClick={() => setAdding(true)}
        >
          <Plus className="h-3 w-3" />{__('Add Subtask')}
        </button>
      )}

      {/* Completed subtasks */}
      {complete.length > 0 && (
        <div className="pt-2 border-t border-pm-border/50">
          <p className="text-[10px] font-medium uppercase text-pm-text-muted/60 mb-1">{__('Completed')} ({complete.length})</p>
          {complete.map(sub => (
            <SubtaskItem key={sub.id} subtask={sub} taskId={taskId} projectId={projectId} boardId={boardId} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  )
}
