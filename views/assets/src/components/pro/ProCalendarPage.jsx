import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchCalendarEvents, fetchCalendarProjects } from '@store/pro/calendarSlice'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { Card, CardContent } from '@components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Badge } from '@components/ui/badge'
import { Skeleton } from '@components/ui/skeleton'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { ScrollArea } from '@components/ui/scroll-area'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock, Milestone as MilestoneIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const pmApi = useApi()

// ── Helpers ─────────────────────────────────────────────
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay() }

function extractDate(val) {
  if (!val) return ''
  if (typeof val === 'string') return val.substring(0, 10)
  if (typeof val === 'object' && val.date) return String(val.date).substring(0, 10)
  return ''
}

function isOverdue(event) {
  const due = extractDate(event.due_date || event.end)
  if (!due) return false
  const status = event.status
  if (status === 1 || status === 'complete' || status === 'completed') return false
  return new Date(due) < new Date(new Date().toISOString().substring(0, 10))
}

function isComplete(event) {
  return event.status === 1 || event.status === 'complete' || event.status === 'completed'
}

function isMilestone(event) {
  return event.type === 'milestone'
}

// Event colors matching legacy
function getEventColor(event) {
  if (isMilestone(event)) return { bg: 'bg-cyan-100', text: 'text-cyan-800', dot: 'bg-cyan-500' }
  if (isComplete(event)) return { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' }
  if (isOverdue(event)) return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' }
  return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' } // incomplete/running
}

function getEventDates(event) {
  const start = extractDate(event.start_date || event.start || event.start_at)
  const end = extractDate(event.due_date || event.end || event.achieve_date)
  return { start, end: end || start }
}

function getAllDatesBetween(startStr, endStr) {
  if (!startStr) return []
  const dates = []
  const start = new Date(startStr)
  const end = endStr ? new Date(endStr) : start
  const current = new Date(start)
  while (current <= end) {
    dates.push(current.toISOString().substring(0, 10))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COLOR LEGEND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ColorLegend() {
  const { __ } = useI18n()
  const items = [
    { color: 'bg-green-500', label: __('Incomplete Task') },
    { color: 'bg-blue-500', label: __('Complete Task') },
    { color: 'bg-red-500', label: __('Outstanding Task') },
    { color: 'bg-cyan-500', label: __('Milestone') },
  ]
  return (
    <div className="flex items-center gap-4 text-xs text-pm-text-muted">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={cn('w-2.5 h-2.5 rounded-full', item.color)} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT ITEM (rendered inside day cell)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function CalendarEvent({ event, onClick }) {
  const colors = getEventColor(event)
  const assignees = useMemo(() => {
    const a = event.assignees?.data
    if (!a) return []
    return Array.isArray(a) ? a : Object.values(a)
  }, [event])

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn('text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer flex items-center gap-1', colors.bg, colors.text)}
            onClick={(e) => { e.stopPropagation(); onClick(event) }}
          >
            {/* Assignee avatars */}
            {assignees.length > 0 && (
              <div className="flex -space-x-1 shrink-0">
                {assignees.slice(0, 2).map(u => (
                  <Avatar key={u.id} className="h-3.5 w-3.5 border border-white">
                    <AvatarImage src={u.avatar_url} />
                    <AvatarFallback className="text-[6px]">{(u.display_name || 'U')[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
            {isMilestone(event) && <MilestoneIcon className="h-3 w-3 shrink-0" />}
            <span className="truncate">{event.title}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[250px]">
          <div className="text-xs">
            <div className="font-semibold mb-1">{event.title}</div>
            <div className="text-muted-foreground">
              {isMilestone(event) ? 'Milestone' : 'Task'}
              {isComplete(event) && ' — Completed'}
              {isOverdue(event) && ' — Overdue'}
            </div>
            {assignees.length > 0 && (
              <div className="text-muted-foreground mt-1">
                {assignees.map(u => u.display_name).join(', ')}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DAY EVENTS POPOVER (for +N more)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function DayEventsPopover({ date, events, onEventClick }) {
  const { __ } = useI18n()
  return (
    <PopoverContent className="w-64 p-2" side="right">
      <div className="text-xs font-semibold text-pm-text mb-2">{date}</div>
      <ScrollArea className="max-h-48">
        <div className="space-y-1">
          {events.map((evt, i) => (
            <CalendarEvent key={evt.id || i} event={evt} onClick={onEventClick} />
          ))}
        </div>
      </ScrollArea>
    </PopoverContent>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TASK DETAIL DIALOG (on event click)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TaskDetailDialog({ event, open, onOpenChange }) {
  const { __ } = useI18n()
  if (!event) return null

  const { start, end } = getEventDates(event)
  const colors = getEventColor(event)
  const assignees = event.assignees?.data
  const assigneeList = !assignees ? [] : Array.isArray(assignees) ? assignees : Object.values(assignees)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" data-pm-dialog>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={cn('w-3 h-3 rounded-full shrink-0', colors.dot)} />
            {event.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-pm-text-muted">
            <Badge variant="outline" className="text-xs">
              {isMilestone(event) ? __('Milestone') : __('Task')}
            </Badge>
            {isComplete(event) && <Badge className="text-xs bg-blue-500">{__('Completed')}</Badge>}
            {isOverdue(event) && <Badge variant="destructive" className="text-xs">{__('Overdue')}</Badge>}
          </div>

          {(start || end) && (
            <div className="flex items-center gap-2 text-pm-text-muted">
              <CalendarIcon className="h-4 w-4" />
              <span>{start}{end && end !== start ? ` — ${end}` : ''}</span>
            </div>
          )}

          {assigneeList.length > 0 && (
            <div>
              <Label className="text-xs text-pm-text-muted mb-1 block">{__('Assignees')}</Label>
              <div className="flex flex-wrap gap-2">
                {assigneeList.map(u => (
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

          {event.project_id && (
            <div className="text-xs text-pm-text-muted">
              {__('Project ID')}: {event.project_id}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>{__('Close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CREATE TASK FROM CALENDAR DIALOG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function CreateTaskDialog({ open, onOpenChange, defaultDate, projects, onCreated }) {
  const { __ } = useI18n()
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState('')
  const [startDate, setStartDate] = useState(defaultDate || '')
  const [dueDate, setDueDate] = useState(defaultDate || '')
  const [saving, setSaving] = useState(false)
  const [taskLists, setTaskLists] = useState([])
  const [listId, setListId] = useState('')

  // Load task lists when project changes
  useEffect(() => {
    if (!projectId) { setTaskLists([]); return }
    pmApi.get(`projects/${projectId}/task-lists`, { per_page: -1 })
      .then(res => {
        const data = res?.data ?? res
        const arr = Array.isArray(data) ? data : Object.values(data || {})
        setTaskLists(arr)
        if (arr.length > 0) setListId(String(arr[0].id))
      })
      .catch(() => setTaskLists([]))
  }, [projectId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !projectId || !listId) return
    setSaving(true)
    try {
      await pmApi.post(`projects/${projectId}/tasks`, {
        title: title.trim(),
        board_id: listId,
        start_at: startDate,
        due_date: dueDate,
      })
      toast.success(__('Task created'))
      onCreated?.()
      onOpenChange(false)
      setTitle('')
    } catch (err) {
      toast.error(err.message || __('Failed to create task'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" data-pm-dialog>
        <DialogHeader>
          <DialogTitle>{__('New Task')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>{__('Title')}</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={__('Task title')} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>{__('Project')}</Label>
            <Select value={projectId || 'none'} onValueChange={v => setProjectId(v === 'none' ? '' : v)}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder={__('Select Project')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{__('Select Project')}</SelectItem>
                {projects.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {taskLists.length > 0 && (
            <div className="space-y-1.5">
              <Label>{__('Task List')}</Label>
              <Select value={listId || 'none'} onValueChange={v => setListId(v === 'none' ? '' : v)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder={__('Select List')} /></SelectTrigger>
                <SelectContent>
                  {taskLists.map(l => <SelectItem key={l.id} value={String(l.id)}>{l.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{__('Start Date')}</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{__('Due Date')}</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>{__('Cancel')}</Button>
            <Button type="submit" size="sm" disabled={saving || !title.trim() || !projectId}>
              {saving ? __('Creating...') : __('Create Task')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WEEK VIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function WeekView({ weekStart, eventsByDate, todayStr, onEventClick, onDayClick }) {
  const days = useMemo(() => {
    const result = []
    const d = new Date(weekStart)
    for (let i = 0; i < 7; i++) {
      result.push(new Date(d))
      d.setDate(d.getDate() + 1)
    }
    return result
  }, [weekStart])

  return (
    <div className="grid grid-cols-7">
      {days.map(day => {
        const dateStr = day.toISOString().substring(0, 10)
        const dayEvents = eventsByDate[dateStr] || []
        const isToday = dateStr === todayStr

        return (
          <div
            key={dateStr}
            className={cn('min-h-[300px] border-b border-r border-pm-border/30 p-1.5 cursor-pointer', isToday && 'bg-pm-accent/5')}
            onClick={() => onDayClick(dateStr)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                'text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full',
                isToday ? 'bg-pm-accent text-white' : 'text-pm-text-muted'
              )}>
                {day.getDate()}
              </span>
              <span className="text-[9px] text-pm-text-muted">{DAYS[day.getDay()]}</span>
            </div>
            <div className="space-y-1">
              {dayEvents.map((evt, i) => (
                <CalendarEvent key={evt.id || i} event={evt} onClick={onEventClick} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN CALENDAR PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ProCalendarPage() {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { events, projects, users: calendarUsers, loading } = useAppSelector(s => s.calendar)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedUser, setSelectedUser] = useState('all')
  const [view, setView] = useState('month') // 'month' | 'week'

  // Task detail dialog
  const [detailEvent, setDetailEvent] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Create task dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createDate, setCreateDate] = useState('')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  // Week view start
  const weekStart = useMemo(() => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - d.getDay()) // Sunday
    return d.toISOString().substring(0, 10)
  }, [currentDate])

  // Compute fetch date range based on view
  const fetchRange = useMemo(() => {
    if (view === 'week') {
      const ws = new Date(weekStart)
      const we = new Date(ws)
      we.setDate(we.getDate() + 6)
      return {
        start: ws.toISOString().substring(0, 10),
        end: we.toISOString().substring(0, 10),
      }
    }
    return {
      start: `${year}-${String(month + 1).padStart(2, '0')}-01`,
      end: `${year}-${String(month + 1).padStart(2, '0')}-${daysInMonth}`,
    }
  }, [view, year, month, daysInMonth, weekStart])

  useEffect(() => {
    const params = { ...fetchRange }
    if (selectedProject !== 'all') params.project_id = selectedProject
    if (selectedUser !== 'all') params.users = selectedUser
    dispatch(fetchCalendarEvents(params))
  }, [fetchRange, selectedProject, selectedUser, dispatch])

  useEffect(() => {
    dispatch(fetchCalendarProjects())
  }, [dispatch])

  const users = calendarUsers

  // Navigation
  const prevPeriod = () => {
    if (view === 'week') {
      setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n })
    } else {
      setCurrentDate(new Date(year, month - 1, 1))
    }
  }
  const nextPeriod = () => {
    if (view === 'week') {
      setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n })
    } else {
      setCurrentDate(new Date(year, month + 1, 1))
    }
  }
  const goToday = () => setCurrentDate(new Date())

  // Group events by date (multi-day events appear on each date)
  const eventsByDate = useMemo(() => {
    const map = {}
    events.forEach(event => {
      const { start, end } = getEventDates(event)
      const dates = getAllDatesBetween(start, end)
      dates.forEach(d => {
        if (!map[d]) map[d] = []
        map[d].push(event)
      })
    })
    return map
  }, [events])

  const todayStr = new Date().toISOString().substring(0, 10)

  const handleEventClick = (event) => {
    setDetailEvent(event)
    setDetailOpen(true)
  }

  const handleDayClick = (dateStr) => {
    setCreateDate(dateStr)
    setCreateOpen(true)
  }

  const handleTaskCreated = () => {
    const params = { ...fetchRange }
    if (selectedProject !== 'all') params.project_id = selectedProject
    if (selectedUser !== 'all') params.users = selectedUser
    dispatch(fetchCalendarEvents(params))
  }

  // Header title
  const headerTitle = view === 'week'
    ? (() => {
        const ws = new Date(weekStart)
        const we = new Date(ws); we.setDate(we.getDate() + 6)
        return `${MONTHS[ws.getMonth()]} ${ws.getDate()} – ${we.getMonth() !== ws.getMonth() ? MONTHS[we.getMonth()] + ' ' : ''}${we.getDate()}, ${we.getFullYear()}`
      })()
    : `${MONTHS[month]} ${year}`

  if (loading && events.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-pm-accent" />
          <h2 className="text-lg font-semibold text-pm-text-primary">{__('Calendar')}</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* User filter */}
          {users.length > 0 && (
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-40 h-8 text-sm">
                <SelectValue placeholder={__('All Users')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{__('All Users')}</SelectItem>
                {users.map(u => (
                  <SelectItem key={u.id || u.user_id} value={String(u.id || u.user_id)}>{u.display_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {/* Project filter */}
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-44 h-8 text-sm">
              <SelectValue placeholder={__('All Projects')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{__('All Projects')}</SelectItem>
              {projects.map(p => (
                <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Color legend */}
      <div className="mb-3">
        <ColorLegend />
      </div>

      <Card>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-pm-border">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={goToday}>
              {__('Today')}
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={prevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={nextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h3 className="text-sm font-semibold ml-2">{headerTitle}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={view} onValueChange={setView}>
              <TabsList className="h-7">
                <TabsTrigger value="month" className="text-xs px-3 h-5">{__('Month')}</TabsTrigger>
                <TabsTrigger value="week" className="text-xs px-3 h-5">{__('Week')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <CardContent className="p-0">
          {view === 'week' ? (
            <>
              {/* Week day headers */}
              <div className="grid grid-cols-7 border-b border-pm-border">
                {DAYS.map(day => (
                  <div key={day} className="text-center py-2 text-[10px] font-semibold uppercase text-pm-text-muted">{day}</div>
                ))}
              </div>
              <WeekView
                weekStart={weekStart}
                eventsByDate={eventsByDate}
                todayStr={todayStr}
                onEventClick={handleEventClick}
                onDayClick={handleDayClick}
              />
            </>
          ) : (
            <>
              {/* Month day headers */}
              <div className="grid grid-cols-7 border-b border-pm-border">
                {DAYS.map(day => (
                  <div key={day} className="text-center py-2 text-[10px] font-semibold uppercase text-pm-text-muted">{day}</div>
                ))}
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-7">
                {/* Empty cells */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-pm-border/30 bg-muted/20" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const dayEvents = eventsByDate[dateStr] || []
                  const isToday = dateStr === todayStr
                  const maxShow = 3

                  return (
                    <div
                      key={day}
                      className={cn('min-h-[100px] border-b border-r border-pm-border/30 p-1 cursor-pointer', isToday && 'bg-pm-accent/5')}
                      onClick={() => handleDayClick(dateStr)}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          'text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full',
                          isToday ? 'bg-pm-accent text-white' : 'text-pm-text-muted'
                        )}>
                          {day}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-[9px] text-pm-text-muted">{dayEvents.length}</span>
                        )}
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, maxShow).map((evt, j) => (
                          <CalendarEvent key={evt.id || j} event={evt} onClick={handleEventClick} />
                        ))}
                        {dayEvents.length > maxShow && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                className="text-[9px] text-pm-accent font-medium px-1.5 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                +{dayEvents.length - maxShow} {__('more')}
                              </button>
                            </PopoverTrigger>
                            <DayEventsPopover date={dateStr} events={dayEvents} onEventClick={handleEventClick} />
                          </Popover>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Task detail dialog */}
      <TaskDetailDialog event={detailEvent} open={detailOpen} onOpenChange={setDetailOpen} />

      {/* Create task dialog */}
      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultDate={createDate}
        projects={projects}
        onCreated={handleTaskCreated}
      />
    </div>
  )
}
