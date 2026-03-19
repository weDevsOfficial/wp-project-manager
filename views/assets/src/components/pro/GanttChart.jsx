import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useI18n } from '@hooks/useI18n'
import { useApi } from '@hooks/useApi'
import { Skeleton } from '@components/ui/skeleton'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { Input } from '@components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import {
  ChevronDown, ChevronRight as ChevronRightIcon,
  Calendar, CheckCircle2, Maximize2, Plus, MoreHorizontal,
  Trash2, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ── Helpers ────────────────────────────────────────────
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d }
function diffDays(a, b) { return Math.max(Math.ceil((new Date(b) - new Date(a)) / 86400000), 0) }
function fmtShort(d) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
function toStr(d) { return new Date(d).toISOString().split('T')[0] }
function extractDate(v) {
  if (!v) return null
  if (typeof v === 'string' && v.length >= 10) return v.substring(0, 10)
  if (typeof v === 'object' && v.date) return String(v.date).substring(0, 10)
  return null
}
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const DAY_W = 48
const ROW_H = 40

// Inline color styles (Tailwind gradient stops don't work with CSS vars)
const BAR_STYLE = {
  project: { background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#fff' },
  list:    { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff' },
  task:    { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' },
}

const DOT_BG = { project: '#7c3aed', list: '#3b82f6', task: '#10b981' }

// ── Component ──────────────────────────────────────────
export default function GanttChart() {
  const { projectId } = useParams()
  const { __ } = useI18n()
  const api = useApi()


  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [collapsed, setCollapsed] = useState(new Set())
  const [hoveredId, setHoveredId] = useState(null)
  const [detailItem, setDetailItem] = useState(null)
  const [addingTo, setAddingTo] = useState(null) // { parentId, type: 'list'|'task' }
  const [addTitle, setAddTitle] = useState('')
  const timelineRef = useRef(null)

  // Drag-to-resize state
  const [resizing, setResizing] = useState(null) // { id, edge: 'left'|'right', startX }

  // ── Load data ──────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!projectId) return
    try {
      const res = await api.get(`projects/${projectId}/task-lists`, { with: 'tasks', per_page: -1 })
      const lists = res?.data ?? []
      const rows = []

      rows.push({
        id: `p-${projectId}`, text: __('Project'), type: 'project',
        level: 0, parent: null, start: toStr(new Date()), dur: 30, progress: 0,
        rawId: projectId,
      })

      lists.forEach(list => {
        const tasks = list.tasks?.data ?? []
        let minD = null, maxD = null, done = 0
        tasks.forEach(t => {
          const s = extractDate(t.start_at) || extractDate(t.created_at)
          const e = extractDate(t.due_date)
          if (s && (!minD || s < minD)) minD = s
          if (e && (!maxD || e > maxD)) maxD = e
          if (t.status === 'complete' || t.status === 1) done++
        })

        rows.push({
          id: `l-${list.id}`, text: list.title, type: 'list', level: 1,
          parent: `p-${projectId}`,
          start: minD || toStr(new Date()), end: maxD,
          dur: minD && maxD ? Math.max(diffDays(minD, maxD), 1) : 7,
          progress: tasks.length ? done / tasks.length : 0,
          count: tasks.length, rawId: list.id,
          description: list.description || '',
        })

        tasks.forEach(t => {
          const s = extractDate(t.start_at) || extractDate(t.created_at) || toStr(new Date())
          const e = extractDate(t.due_date)
          rows.push({
            id: `t-${t.id}`, text: t.title, type: 'task', level: 2,
            parent: `l-${list.id}`, start: s, end: e,
            dur: e ? Math.max(diffDays(s, e), 1) : 3,
            progress: (t.status === 'complete' || t.status === 1) ? 1 : 0,
            assignees: t.assignees?.data || [],
            rawId: t.id, description: t.description?.content || t.description || '',
            status: t.status,
          })
        })
      })

      setItems(rows)
    } catch {} finally { setLoading(false) }
  }, [projectId, api, __])

  useEffect(() => { loadData() }, [loadData])

  // ── Actions ────────────────────────────────────────
  const toggle = useCallback((id) => {
    setCollapsed(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }, [])

  const handleAddItem = useCallback(async () => {
    if (!addTitle.trim() || !addingTo) return
    try {
      if (addingTo.type === 'list') {
        await api.post(`projects/${projectId}/task-lists`, {
          title: addTitle.trim(),
          project_id: projectId,
        })
      } else {
        await api.post(`projects/${projectId}/tasks`, {
          title: addTitle.trim(),
          board_id: addingTo.listId,
          project_id: projectId,
        })
      }
      setAddTitle('')
      setAddingTo(null)
      toast.success(addingTo.type === 'list' ? __('List created') : __('Task created'))
      loadData()
    } catch (e) {
      console.error('[Gantt] Create failed:', e)
      toast.error(e?.message || __('Failed to create'))
    }
  }, [addTitle, addingTo, api, projectId, __, loadData])

  const handleDeleteItem = useCallback(async (item) => {
    if (!confirm(__('Delete this item?'))) return
    try {
      if (item.type === 'list') {
        await api.post(`projects/${projectId}/task-lists/${item.rawId}/delete`)
      } else if (item.type === 'task') {
        await api.post(`projects/${projectId}/tasks/${item.rawId}/delete`)
      }
      toast.success(__('Deleted'))
      loadData()
    } catch (e) {
      console.error('[Gantt] Delete failed:', e)
      toast.error(e?.message || __('Failed to delete'))
    }
  }, [api, projectId, __, loadData])

  const handleToggleStatus = useCallback(async (item) => {
    if (item.type !== 'task') return
    try {
      const newStatus = item.progress >= 1 ? 0 : 1
      await api.post(`projects/${projectId}/tasks/${item.rawId}/change-status`, { status: newStatus })
      toast.success(newStatus ? __('Completed') : __('Reopened'))
      loadData()
    } catch (e) {
      console.error('[Gantt] Status change failed:', e)
      toast.error(e?.message || __('Failed'))
    }
  }, [api, projectId, __, loadData])

  // ── Drag to resize bar ─────────────────────────────
  const handleResizeStart = useCallback((e, id, edge) => {
    e.preventDefault()
    e.stopPropagation()
    setResizing({ id, edge, startX: e.clientX })
  }, [])

  useEffect(() => {
    if (!resizing) return
    const handleMove = (e) => {
      const dx = e.clientX - resizing.startX
      const daysDelta = Math.round(dx / DAY_W)
      if (daysDelta === 0) return
      setItems(prev => prev.map(it => {
        if (it.id !== resizing.id) return it
        if (resizing.edge === 'right') {
          return { ...it, dur: Math.max(it.dur + daysDelta, 1) }
        }
        // left edge
        return {
          ...it,
          start: toStr(addDays(it.start, daysDelta)),
          dur: Math.max(it.dur - daysDelta, 1),
        }
      }))
      setResizing(prev => ({ ...prev, startX: e.clientX }))
    }
    const handleUp = async () => {
      // Save new dates to API
      const item = items.find(i => i.id === resizing.id)
      if (item && item.type === 'task') {
        const endDate = toStr(addDays(item.start, item.dur))
        try {
          await api.post(`projects/${projectId}/tasks/${item.rawId}`, {
            start_at: item.start, due_date: endDate,
          })
        } catch {}
      }
      setResizing(null)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [resizing, items, api, projectId])

  // ── Computed ───────────────────────────────────────
  const visible = useMemo(() => {
    const hidden = new Set()
    return items.filter(it => {
      if (hidden.has(it.parent)) { hidden.add(it.id); return false }
      if (collapsed.has(it.id)) hidden.add(it.id)
      return true
    })
  }, [items, collapsed])

  const range = useMemo(() => {
    let lo = null, hi = null
    items.forEach(it => {
      if (it.start) { const d = new Date(it.start); if (!lo || d < lo) lo = d }
      const e = it.end ? new Date(it.end) : it.start ? addDays(it.start, it.dur || 1) : null
      if (e && (!hi || e > hi)) hi = e
    })
    lo = lo ? addDays(lo, -3) : addDays(new Date(), -3)
    hi = hi ? addDays(hi, 7) : addDays(lo, 35)
    return { start: lo, count: Math.max(diffDays(lo, hi), 21) }
  }, [items])

  const days = useMemo(() => {
    return Array.from({ length: range.count }, (_, i) => addDays(range.start, i))
  }, [range])

  const todayPx = diffDays(range.start, new Date()) * DAY_W
  const totalW = range.count * DAY_W

  const scrollToToday = () => {
    if (timelineRef.current) timelineRef.current.scrollLeft = Math.max(todayPx - 200, 0)
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-pm-text-primary">{__('Gantt Chart')}</h2>
          <div className="flex items-center gap-4 mt-1 text-[11px] text-pm-text-muted">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#7c3aed' }} />{__('Project')}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#3b82f6' }} />{__('Task List')}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#10b981' }} />{__('Task')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={scrollToToday}>
            <Calendar className="h-3 w-3 mr-1" />{__('Today')}
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setCollapsed(new Set())}>
            <Maximize2 className="h-3 w-3 mr-1" />{__('Expand All')}
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 rounded-xl border border-pm-border bg-card overflow-hidden flex min-h-0">

        {/* ── Left panel ── */}
        <div className="w-[300px] shrink-0 border-r border-pm-border flex flex-col">
          <div className="h-10 border-b border-pm-border px-3 flex items-center bg-muted/30 gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-pm-text-muted flex-1">{__('Name')}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-pm-text-muted w-10 text-center">{__('Action')}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {visible.map(it => {
              const hasKids = items.some(i => i.parent === it.id)
              const open = !collapsed.has(it.id)
              const hl = hoveredId === it.id

              return (
                <div
                  key={it.id}
                  className={cn('flex items-center gap-1 border-b border-pm-border/20 pr-1 transition-colors', hl && 'bg-blue-50/50')}
                  style={{ height: ROW_H, paddingLeft: 8 + it.level * 16 }}
                  onMouseEnter={() => setHoveredId(it.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {hasKids ? (
                    <button onClick={() => toggle(it.id)} className="p-0.5 rounded hover:bg-muted shrink-0">
                      {open ? <ChevronDown className="h-3 w-3 text-pm-text-muted" /> : <ChevronRightIcon className="h-3 w-3 text-pm-text-muted" />}
                    </button>
                  ) : <span className="w-4 shrink-0" />}

                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: DOT_BG[it.type] }} />

                  <span className={cn(
                    'text-[11px] truncate flex-1',
                    it.type === 'project' && 'font-semibold',
                    it.type === 'list' && 'font-medium',
                    it.progress >= 1 && 'line-through opacity-50',
                  )}>
                    {it.text}
                  </span>

                  {it.count > 0 && (
                    <Badge variant="secondary" className="text-[8px] px-1 py-0 h-3.5 shrink-0">{it.count}</Badge>
                  )}

                  {/* Action: Add + Menu */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {(it.type === 'project' || it.type === 'list') && (
                      <button
                        className="p-0.5 rounded hover:bg-muted text-pm-text-muted/50 hover:text-pm-accent"
                        onClick={() => setAddingTo({
                          parentId: it.id,
                          type: it.type === 'project' ? 'list' : 'task',
                          listId: it.rawId,
                        })}
                        title={it.type === 'project' ? __('Add List') : __('Add Task')}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    )}
                    {it.type !== 'project' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-0.5 rounded hover:bg-muted text-pm-text-muted/40 hover:text-pm-text-muted">
                            <MoreHorizontal className="h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem onClick={() => setDetailItem(it)}>
                            <Eye className="h-3 w-3 mr-2" />{__('View')}
                          </DropdownMenuItem>
                          {it.type === 'task' && (
                            <DropdownMenuItem onClick={() => handleToggleStatus(it)}>
                              <CheckCircle2 className="h-3 w-3 mr-2" />
                              {it.progress >= 1 ? __('Reopen') : __('Complete')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteItem(it)}>
                            <Trash2 className="h-3 w-3 mr-2" />{__('Delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right: timeline ── */}
        <div className="flex-1 overflow-auto" ref={timelineRef}>
          <div style={{ width: totalW, minHeight: '100%' }}>
            {/* Day headers */}
            <div className="sticky top-0 z-20 flex border-b border-pm-border" style={{ height: 40, background: '#fafbfc' }}>
              {days.map((d, i) => {
                const isToday = toStr(d) === toStr(new Date())
                const isWe = d.getDay() === 0 || d.getDay() === 6
                const isFirst = i === 0 || d.getDate() === 1

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center border-r shrink-0"
                    style={{
                      width: DAY_W,
                      borderColor: 'rgba(0,0,0,0.06)',
                      background: isToday ? 'rgba(124,58,237,0.08)' : isWe ? 'rgba(0,0,0,0.02)' : 'transparent',
                    }}
                  >
                    {isFirst && (
                      <span className="text-[8px] font-bold uppercase text-pm-text-muted/50 leading-none">
                        {d.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    )}
                    <span className={cn('text-[10px] leading-none mt-0.5 font-medium', isWe && 'opacity-40')}>
                      {isToday ? (
                        <span className="bg-pm-accent text-white w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold">{d.getDate()}</span>
                      ) : (
                        <span>{d.getDate()}, {DAY_NAMES[d.getDay()]}</span>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Bars */}
            <div className="relative">
              {/* Today line */}
              <div
                className="absolute top-0 w-0.5 z-10 pointer-events-none rounded-full"
                style={{ left: todayPx, height: visible.length * ROW_H, background: '#7c3aed' }}
              />

              {/* Weekend stripes */}
              {days.map((d, i) => (
                (d.getDay() === 0 || d.getDay() === 6) ? (
                  <div
                    key={`w${i}`}
                    className="absolute top-0 pointer-events-none"
                    style={{ left: i * DAY_W, width: DAY_W, height: visible.length * ROW_H, background: 'rgba(0,0,0,0.015)' }}
                  />
                ) : null
              ))}

              {/* Grid lines (vertical) */}
              {days.map((_, i) => (
                <div
                  key={`g${i}`}
                  className="absolute top-0 pointer-events-none"
                  style={{ left: i * DAY_W, width: 1, height: visible.length * ROW_H, background: 'rgba(0,0,0,0.04)' }}
                />
              ))}

              {/* Row bars */}
              {visible.map(it => {
                const left = diffDays(range.start, it.start) * DAY_W
                const width = Math.max(it.dur * DAY_W - 4, 20)
                const hl = hoveredId === it.id
                const style = BAR_STYLE[it.type]

                return (
                  <div
                    key={it.id}
                    className={cn('relative border-b', hl && 'bg-blue-50/30')}
                    style={{ height: ROW_H, borderColor: 'rgba(0,0,0,0.04)' }}
                    onMouseEnter={() => setHoveredId(it.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Bar */}
                    <div
                      className={cn(
                        'absolute top-[6px] rounded-md flex items-center px-2 cursor-pointer transition-shadow select-none',
                        hl && 'shadow-lg ring-2 ring-white/50',
                        it.progress >= 1 && 'opacity-50',
                      )}
                      style={{
                        left: left + 2,
                        width,
                        height: ROW_H - 12,
                        ...style,
                      }}
                      onClick={() => setDetailItem(it)}
                      title={`${it.text}\n${it.start ? fmtShort(it.start) : ''}${it.end ? ' → ' + fmtShort(it.end) : ''}`}
                    >
                      {/* Progress overlay */}
                      {it.progress > 0 && it.progress < 1 && (
                        <div
                          className="absolute inset-y-0 left-0 rounded-l-md"
                          style={{ width: `${it.progress * 100}%`, background: 'rgba(255,255,255,0.25)' }}
                        />
                      )}
                      {it.progress >= 1 && <CheckCircle2 className="h-3 w-3 mr-1 shrink-0 opacity-80" style={{ color: '#fff' }} />}
                      <span className="text-[10px] font-medium truncate relative z-10" style={{ color: '#fff' }}>
                        {it.text}
                      </span>

                      {/* Resize handles */}
                      {it.type === 'task' && (
                        <>
                          <div
                            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-w-resize hover:bg-white/30 rounded-l-md"
                            onMouseDown={(e) => handleResizeStart(e, it.id, 'left')}
                          />
                          <div
                            className="absolute right-0 top-0 bottom-0 w-1.5 cursor-e-resize hover:bg-white/30 rounded-r-md"
                            onMouseDown={(e) => handleResizeStart(e, it.id, 'right')}
                          />
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Add item dialog ── */}
      {addingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setAddingTo(null)}>
          <div className="bg-card rounded-xl shadow-xl border border-pm-border p-5 w-80 space-y-3" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold">
              {addingTo.type === 'list' ? __('Add Task List') : __('Add Task')}
            </h3>
            <Input
              value={addTitle}
              onChange={e => setAddTitle(e.target.value)}
              placeholder={addingTo.type === 'list' ? __('List title...') : __('Task title...')}
              className="h-8 text-sm"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleAddItem(); if (e.key === 'Escape') setAddingTo(null) }}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setAddingTo(null)}>{__('Cancel')}</Button>
              <Button size="sm" className="h-7 text-xs" onClick={handleAddItem}>{__('Create')}</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail dialog ── */}
      <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: DOT_BG[detailItem?.type] || '#666' }} />
              {detailItem?.text}
            </DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-pm-text-muted">{__('Type')}:</span> <span className="capitalize font-medium">{detailItem.type}</span></div>
                <div><span className="text-pm-text-muted">{__('Progress')}:</span> <span className="font-medium">{Math.round((detailItem.progress || 0) * 100)}%</span></div>
                <div><span className="text-pm-text-muted">{__('Start')}:</span> <span className="font-medium">{detailItem.start ? fmtShort(detailItem.start) : '—'}</span></div>
                <div><span className="text-pm-text-muted">{__('End')}:</span> <span className="font-medium">{detailItem.end ? fmtShort(detailItem.end) : '—'}</span></div>
                <div><span className="text-pm-text-muted">{__('Duration')}:</span> <span className="font-medium">{detailItem.dur} {__('days')}</span></div>
              </div>
              {detailItem.description && (
                <div className="pt-2 border-t border-pm-border/50">
                  <p className="text-xs text-pm-text-muted mb-1 font-medium">{__('Description')}</p>
                  <div className="text-xs text-pm-text prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: detailItem.description }} />
                </div>
              )}
              {detailItem.assignees?.length > 0 && (
                <div className="pt-2 border-t border-pm-border/50">
                  <p className="text-xs text-pm-text-muted mb-1.5 font-medium">{__('Assignees')}</p>
                  <div className="flex gap-2">
                    {detailItem.assignees.map(u => (
                      <div key={u.id} className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={u.avatar_url} />
                          <AvatarFallback className="text-[8px]">{(u.display_name || 'U')[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{u.display_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
