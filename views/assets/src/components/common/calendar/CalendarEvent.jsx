import { __ } from '@wordpress/i18n'
import React, { useMemo } from 'react'
import { Milestone as MilestoneIcon } from 'lucide-react'
import { UserAvatar } from '@components/common/UserAvatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { cn } from '@lib/utils'
import { getEventTone, isEventComplete, isEventOverdue } from './eventDates'

export function CalendarEvent({ event, onClick, continuesBefore = false, continuesAfter = false, showAssignees = true }) {
  const tone = getEventTone(event)
  const milestone = event.type === 'milestone'
  const assignees = useMemo(() => {
    const a = event.assignees?.data
    if (!showAssignees || !a) return []
    return Array.isArray(a) ? a : Object.values(a)
  }, [event, showAssignees])

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              'w-full min-w-0 min-h-[32px] flex items-center gap-1.5 px-2 py-0.5 rounded text-sm font-medium text-left cursor-pointer transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40',
              // A bar that carries on into the previous or next week keeps a square edge there.
              continuesBefore && 'rounded-l-none',
              continuesAfter && 'rounded-r-none',
              tone.chip,
            )}
            onClick={(e) => { e.stopPropagation(); onClick?.(event) }}
          >
            {assignees.length > 0 && (
              <span className="flex -space-x-1.5 shrink-0">
                {assignees.slice(0, 2).map((u) => (
                  <UserAvatar key={u.id} user={u} size="xs" className="h-6 w-6 border-2 border-pm-surface" fallbackClassName="text-[10px]" />
                ))}
              </span>
            )}
            {milestone && <MilestoneIcon className="h-3.5 w-3.5 shrink-0" />}
            <span className="truncate">{event.title}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[250px]">
          <div className="text-[13px]">
            <div className="font-medium mb-0.5">{event.title}</div>
            <div className="text-pm-text-muted">
              {milestone ? __('Milestone', 'wedevs-project-manager') : __('Task', 'wedevs-project-manager')}
              {isEventComplete(event) && ` · ${__('Completed', 'wedevs-project-manager')}`}
              {isEventOverdue(event) && ` · ${__('Overdue', 'wedevs-project-manager')}`}
            </div>
            {assignees.length > 0 && (
              <div className="text-pm-text-muted mt-0.5">{assignees.map((u) => u.display_name).join(', ')}</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CalendarEvent
