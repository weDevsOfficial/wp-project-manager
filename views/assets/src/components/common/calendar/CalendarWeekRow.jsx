import { __, sprintf } from '@wordpress/i18n'
import React, { useMemo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { cn } from '@lib/utils'
import { formatPmDate } from '@lib/pm-utils'
import { CalendarEvent } from './CalendarEvent'
import { getEventDates } from './eventDates'

// Cut each event to the part that falls in this week and stack the parts in
// lanes, so a task running Mon–Thu is one bar across four columns instead of
// four separate chips. Same layout as the Pro calendar.
function layoutWeek(dates, events) {
  const segments = []
  events.forEach((event) => {
    const { start, end } = getEventDates(event)
    if (!start) return
    let startCol = -1
    let endCol = -1
    dates.forEach((date, col) => {
      if (date && date >= start && date <= end) {
        if (startCol < 0) startCol = col
        endCol = col
      }
    })
    if (startCol < 0) return
    segments.push({
      event,
      startCol,
      endCol,
      continuesBefore: start < dates[startCol],
      continuesAfter: end > dates[endCol],
    })
  })

  // Longer bars first, then by start column, so multi-day tasks keep the top
  // lanes and single days fill in underneath.
  segments.sort((a, b) =>
    (b.endCol - b.startCol) - (a.endCol - a.startCol)
    || a.startCol - b.startCol
    || String(a.event.title || '').localeCompare(String(b.event.title || '')))

  const lanes = []
  segments.forEach((segment) => {
    let lane = lanes.findIndex((used) => !used.slice(segment.startCol, segment.endCol + 1).some(Boolean))
    if (lane < 0) {
      lane = lanes.length
      lanes.push(Array(7).fill(false))
    }
    for (let col = segment.startCol; col <= segment.endCol; col++) lanes[lane][col] = true
    segment.lane = lane
  })

  return { segments, laneCount: lanes.length }
}

/**
 * One week of a month grid. `dates` holds seven YYYY-MM-DD strings, with null
 * for padding days outside the month.
 */
export function CalendarWeekRow({ dates, events, eventsByDate, todayStr, maxLanes = Infinity, className, onEventClick, showAssignees }) {
  const { segments, laneCount } = useMemo(() => layoutWeek(dates, events), [dates, events])
  const visibleLanes = Math.min(laneCount, maxLanes)

  const hiddenByCol = dates.map((date, col) => (date
    ? segments.filter((s) => s.lane >= visibleLanes && col >= s.startCol && col <= s.endCol).length
    : 0))
  const hasMoreRow = hiddenByCol.some((n) => n > 0)

  return (
    <div className="relative">
      {/* Day cells: borders and the today tint. */}
      <div className="absolute inset-0 grid grid-cols-7">
        {dates.map((date, col) => (
          <div
            key={date || `blank-${col}`}
            className={cn(
              'border-b border-r border-pm-border/60 [&:nth-child(7n)]:border-r-0',
              !date && 'bg-pm-surface-muted/40',
              date && date === todayStr && 'bg-pm-accent-light/50',
            )}
          />
        ))}
      </div>

      {/* Day numbers and event bars, laid over the cells. */}
      <div
        className={cn('relative grid grid-cols-7 content-start gap-y-1 pb-1.5', className)}
        style={{ gridTemplateRows: `auto repeat(${visibleLanes + (hasMoreRow ? 1 : 0)}, auto)` }}
      >
        {dates.map((date, col) => {
          if (!date) return null
          const count = eventsByDate[date]?.length || 0
          const isToday = date === todayStr
          return (
            <div key={`head-${date}`} className="flex items-center justify-between px-1.5 pt-1.5" style={{ gridColumn: col + 1, gridRow: 1 }}>
              <span className={cn(
                'inline-flex items-center justify-center w-6 h-6 rounded-full text-[13px] tabular-nums',
                isToday ? 'bg-pm-accent text-white font-semibold' : 'text-pm-text-muted font-medium',
              )}>
                {Number(date.slice(8, 10))}
              </span>
              {count > 0 && <span className="text-[11px] font-medium text-pm-text-muted tabular-nums">{count}</span>}
            </div>
          )
        })}

        {segments.filter((s) => s.lane < visibleLanes).map((segment) => (
          <div
            key={`${segment.event.type || 'task'}-${segment.event.id}-${segment.startCol}`}
            className={cn('min-w-0 px-1.5', segment.continuesBefore && 'pl-0', segment.continuesAfter && 'pr-0')}
            style={{ gridColumn: `${segment.startCol + 1} / ${segment.endCol + 2}`, gridRow: segment.lane + 2 }}
          >
            <CalendarEvent
              event={segment.event}
              continuesBefore={segment.continuesBefore}
              continuesAfter={segment.continuesAfter}
              onClick={onEventClick}
              showAssignees={showAssignees}
            />
          </div>
        ))}

        {hasMoreRow && dates.map((date, col) => (date && hiddenByCol[col] > 0 ? (
          <div key={`more-${date}`} className="px-1.5" style={{ gridColumn: col + 1, gridRow: visibleLanes + 2 }}>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="px-2 py-0.5 rounded text-[13px] font-medium text-pm-accent hover:bg-pm-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40"
                >
                  {/* translators: %d: number of tasks not shown on this day */}
                  {sprintf(__('+%d more', 'wedevs-project-manager'), hiddenByCol[col])}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" side="right" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                <div className="text-[13px] font-semibold text-pm-text-primary px-1 mb-2">
                  {formatPmDate(date, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="max-h-56 overflow-y-auto pm-sidebar-scroll space-y-1 pr-1">
                  {(eventsByDate[date] || []).map((evt, i) => (
                    <CalendarEvent key={evt.id || i} event={evt} onClick={onEventClick} showAssignees={showAssignees} />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : null))}
      </div>
    </div>
  )
}

export default CalendarWeekRow
