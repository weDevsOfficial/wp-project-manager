import React, { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { startTimer, stopTimer, addCustomTime, deleteTimeLog, fetchOthersTime, setRunningTimer } from '@store/pro/timeTrackerSlice'
import { useI18n } from '@hooks/useI18n'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Play, Square, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function Timer({ projectId, taskId, listId }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { runningTimer } = useAppSelector(s => s.timeTracker)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  // Check if this task's timer is running
  const isRunning = !!(runningTimer && runningTimer.running)

  useEffect(() => {
    if (isRunning) {
      // Increment every second
      const tick = () => setElapsed(prev => prev + 1)
      intervalRef.current = setInterval(tick, 1000)
      return () => clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const handleToggle = () => {
    if (isRunning) {
      dispatch(stopTimer({ projectId, taskId, listId }))
        .then((action) => {
          if (!action.error) {
            setElapsed(0)
            toast.success(__('Timer stopped'))
          } else {
            toast.error(action.payload || __('Failed to stop timer'))
          }
        })
    } else {
      dispatch(startTimer({ projectId, taskId, listId }))
        .then((action) => {
          if (!action.error) {
            setElapsed(0)
            toast.success(__('Timer started'))
          } else {
            toast.error(action.payload || __('Failed to start timer'))
          }
        })
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        className={cn(
          'h-9 w-9 rounded-full flex items-center justify-center transition-colors',
          isRunning
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-pm-accent hover:bg-pm-accent/90 text-white'
        )}
      >
        {isRunning ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
      </button>
      <span className={cn('font-mono text-lg tabular-nums', isRunning ? 'text-pm-text-primary' : 'text-pm-text-muted')}>
        {formatTime(elapsed)}
      </span>
    </div>
  )
}

function CustomTimeForm({ projectId, taskId, onClose }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const [start, setStart] = useState('')
  const [stop, setStop] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!start || !stop) return
    dispatch(addCustomTime({ projectId, taskId, start, stop })).then(() => {
      toast.success(__('Time logged'))
      onClose()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs font-medium text-pm-text-muted">{__('Start')}</label>
        <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="h-8 text-sm" />
      </div>
      <div>
        <label className="text-xs font-medium text-pm-text-muted">{__('Stop')}</label>
        <Input type="datetime-local" value={stop} onChange={(e) => setStop(e.target.value)} className="h-8 text-sm" />
      </div>
      <div className="flex gap-1.5">
        <Button type="submit" size="sm" className="h-7 text-xs">{__('Add')}</Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 text-xs" onClick={onClose}>{__('Cancel')}</Button>
      </div>
    </form>
  )
}

function fmtTotal(total) {
  if (!total) return '—'
  if (typeof total === 'object') {
    return `${String(total.hour || 0).padStart(2,'0')}:${String(total.minute || 0).padStart(2,'0')}:${String(total.second || 0).padStart(2,'0')}`
  }
  return String(total)
}

function fmtDate(dateObj) {
  if (!dateObj) return '—'
  if (typeof dateObj === 'object' && dateObj.date) {
    const d = new Date(dateObj.date + ' ' + (dateObj.time || ''))
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }
  return String(dateObj)
}

function secondsToHMS(totalSec) {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

/**
 * TimeLogTable — matches Vue time-log.vue table structure:
 * grouped by user, collapsible, per-user total, net total
 */
function TimeLogTable({ timeLogs, onDelete }) {
  const { __ } = useI18n()
  const [expandedUsers, setExpandedUsers] = useState(new Set())

  if (!timeLogs.length) return null

  // Group logs by user
  const grouped = {}
  timeLogs.forEach(log => {
    const userId = log.creator?.data?.id || log.user?.data?.id || 'unknown'
    if (!grouped[userId]) {
      grouped[userId] = {
        user: log.creator?.data || log.user?.data || { display_name: 'User', avatar_url: '' },
        logs: [],
        totalSeconds: 0,
      }
    }
    grouped[userId].logs.push(log)
    grouped[userId].totalSeconds += parseInt(log.total?.total_second || 0)
  })

  const userGroups = Object.entries(grouped)
  const netTotalSeconds = userGroups.reduce((sum, [, g]) => sum + g.totalSeconds, 0)

  const toggleUser = (userId) => {
    setExpandedUsers(prev => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
  }

  return (
    <div className="rounded-lg border border-pm-border overflow-hidden bg-muted/20 mt-3">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-muted/40">
            <th className="text-left px-3 py-2 font-medium text-pm-text-muted">{__('User')}</th>
            <th className="text-left px-3 py-2 font-medium text-pm-text-muted">{__('Start')}</th>
            <th className="text-left px-3 py-2 font-medium text-pm-text-muted">{__('End')}</th>
            <th className="text-right px-3 py-2 font-medium text-pm-text-muted">{__('Total')}</th>
          </tr>
        </thead>
        <tbody>
          {userGroups.map(([userId, group]) => {
            const isExpanded = expandedUsers.has(userId)
            const hasMultiple = group.logs.length > 1

            return group.logs.map((log, idx) => {
              // First row: show user info + expand toggle
              if (idx === 0) {
                return (
                  <tr key={log.id} className="border-t border-pm-border/50 hover:bg-muted/30">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        {hasMultiple && (
                          <button onClick={() => toggleUser(userId)} className="text-pm-text-muted hover:text-pm-text">
                            {isExpanded ? '▾' : '▸'}
                          </button>
                        )}
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={group.user.avatar_url} />
                          <AvatarFallback className="text-[7px]">{(group.user.display_name || 'U')[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-pm-text truncate">{group.user.display_name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-pm-text-muted">{fmtDate(log.start)}</td>
                    <td className="px-3 py-2 text-pm-text-muted">{fmtDate(log.stop)}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-mono">{fmtTotal(log.total)}</span>
                        <button className="text-destructive/50 hover:text-destructive" onClick={() => onDelete(log.id)}>
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }

              // Child rows: only visible when expanded
              if (!isExpanded) return null
              return (
                <tr key={log.id} className="border-t border-pm-border/30 hover:bg-muted/20">
                  <td className="px-3 py-1.5 pl-10">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={group.user.avatar_url} />
                        <AvatarFallback className="text-[6px]">{(group.user.display_name || 'U')[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-pm-text-muted">{group.user.display_name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-1.5 text-pm-text-muted">{fmtDate(log.start)}</td>
                  <td className="px-3 py-1.5 text-pm-text-muted">{fmtDate(log.stop)}</td>
                  <td className="px-3 py-1.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-mono">{fmtTotal(log.total)}</span>
                      <button className="text-destructive/50 hover:text-destructive" onClick={() => onDelete(log.id)}>
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
          })}

          {/* Per-user totals (when multiple users) */}
          {userGroups.length > 0 && userGroups.some(([, g]) => g.logs.length > 0) && (
            userGroups.map(([userId, group]) => {
              if (group.logs.length <= 1 && userGroups.length <= 1) return null
              return (
                <tr key={`total-${userId}`} className="border-t border-pm-border/50 bg-muted/10">
                  <td colSpan={3} className="px-3 py-1.5 text-right text-pm-text-muted font-medium">
                    {group.user.display_name} {__('Total')}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono font-semibold">
                    {secondsToHMS(group.totalSeconds)}
                  </td>
                </tr>
              )
            })
          )}

          {/* Net Total */}
          <tr className="border-t border-pm-border bg-muted/30">
            <td colSpan={3} className="px-3 py-2 text-right font-medium text-pm-text">
              {__('Net Total')}
            </td>
            <td className="px-3 py-2 text-right font-mono font-bold text-pm-text">
              {secondsToHMS(netTotalSeconds)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default function TimeTrackerWidget({ projectId, taskId, listId, taskTimeData }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { timeLogs, runningTimer } = useAppSelector(s => s.timeTracker)
  const [showCustom, setShowCustom] = useState(false)

  // Initialize running state from task data (persists across refresh)
  useEffect(() => {
    if (taskTimeData?.meta?.running && !runningTimer) {
      dispatch(setRunningTimer({
        task_id: taskId,
        running: true,
      }))
    }
  }, [taskTimeData, taskId, runningTimer, dispatch])

  // Fetch others' time logs on mount
  useEffect(() => {
    if (taskId) {
      dispatch(fetchOthersTime({ task_id: taskId, project_id: projectId }))
    }
  }, [taskId, projectId, dispatch])

  // Merge: task.time.data (current user from task API) + timeLogs (others from Redux)
  const allLogs = React.useMemo(() => {
    const taskLogs = Array.isArray(taskTimeData?.data) ? taskTimeData.data : []
    const otherLogs = Array.isArray(timeLogs) ? timeLogs : []
    // Deduplicate by id
    const seen = new Set()
    const merged = []
    ;[...taskLogs, ...otherLogs].forEach(log => {
      if (log?.id && !seen.has(log.id)) {
        seen.add(log.id)
        merged.push(log)
      }
    })
    return merged
  }, [taskTimeData, timeLogs])

  const handleDeleteLog = (timeId) => {
    dispatch(deleteTimeLog({ timeId }))
  }

  return (
    <div className="space-y-3">
      {/* Timer controls */}
      <Timer projectId={projectId} taskId={taskId} listId={listId} />

      {/* Time logs table */}
      <TimeLogTable timeLogs={allLogs} onDelete={handleDeleteLog} />

      {/* Add custom time */}
      <Popover open={showCustom} onOpenChange={setShowCustom}>
        <PopoverTrigger asChild>
          <button className="text-xs text-pm-accent hover:underline flex items-center gap-1">
            <Plus className="h-3 w-3" />{__('Add custom time')}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <CustomTimeForm projectId={projectId} taskId={taskId} onClose={() => setShowCustom(false)} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
