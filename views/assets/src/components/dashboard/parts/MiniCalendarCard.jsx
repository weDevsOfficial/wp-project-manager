import { __ } from '@wordpress/i18n'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { Card } from '@components/ui/card'
import { Calendar } from '@components/ui/calendar'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@components/ui/tooltip'
import { cn } from '@lib/utils'

export default function MiniCalendarCard({ calendar }) {
  const navigate = useNavigate()

  const baseMonth = calendar?.month ? parseISO(calendar.month + '-01') : new Date()
  const [month, setMonth] = useState(baseMonth)

  // Lookup: 'yyyy-MM-dd' -> { total, overdue }
  const dayMap = useMemo(() => {
    const m = new Map()
    for (const d of calendar?.days || []) m.set(d.date, d)
    return m
  }, [calendar])

  const { dueDates, overdueDates } = useMemo(() => {
    const due = [], over = []
    for (const d of calendar?.days || []) {
      const date = parseISO(d.date)
      if (d.overdue) over.push(date)
      else due.push(date)
    }
    return { dueDates: due, overdueDates: over }
  }, [calendar])

  const monthTotal = useMemo(
    () => (calendar?.days || []).reduce((s, d) => s + d.total, 0),
    [calendar],
  )

  // Flagged days, soonest first — fills the card below the grid.
  const dueList = useMemo(() => {
    return [...(calendar?.days || [])].sort((a, b) => a.date.localeCompare(b.date))
  }, [calendar])

  // Custom day button: default number + a load dot (rose = overdue, accent = upcoming).
  const DayButton = ({ day, modifiers, className, children, ...rest }) => {
    const ds = format(day.date, 'yyyy-MM-dd')
    const info = dayMap.get(ds)

    const btn = (
      <button {...rest} className={cn(className, 'relative')}>
        <span>{format(day.date, 'd')}</span>
        {info && (
          <span
            className={cn(
              'absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full',
              modifiers?.selected ? 'bg-white' : info.overdue ? 'bg-rose-500' : 'bg-pm-accent',
            )}
          />
        )}
      </button>
    )

    if (!info) return btn

    return (
      <Tooltip>
        <TooltipTrigger asChild>{btn}</TooltipTrigger>
        <TooltipContent side="top" className="text-[12px]">
          <span className="font-medium">{format(day.date, 'MMM d')}</span>
          {' · '}
          {info.total} {__('task(s) due', 'wedevs-project-manager')}
          {info.overdue && <span className="text-rose-300"> ({__('overdue', 'wedevs-project-manager')})</span>}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Card className="p-5 border-pm-border flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[15px] font-semibold text-pm-text-primary flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-pm-text-muted" />
          {__('Calendar', 'wedevs-project-manager')}
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-pm-text-muted">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-pm-accent" />{__('Due', 'wedevs-project-manager')}</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{__('Overdue', 'wedevs-project-manager')}</span>
        </div>
      </div>

      <TooltipProvider delayDuration={100}>
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          modifiers={{ due: dueDates, overdue: overdueDates }}
          onSelect={(d) => { if (d) navigate('/my-tasks') }}
          components={{ DayButton }}
          className="p-0 [&_.rdp-month_caption]:justify-start [&_.rdp-nav]:justify-end"
        />
      </TooltipProvider>

      {/* Due-days list — fills the space below the grid */}
      {dueList.length > 0 && (
        <div className="flex-1 mt-3 pt-3 border-t border-pm-border min-h-0">
          <div className="text-[11px] font-medium text-pm-text-muted uppercase tracking-wider mb-1.5">
            {__('Due this month', 'wedevs-project-manager')}
          </div>
          <div className="space-y-0.5 overflow-y-auto pm-sidebar-scroll max-h-[150px] pr-1">
            {dueList.map(d => (
              <button
                key={d.date}
                onClick={() => navigate('/my-tasks')}
                className="w-full flex items-center gap-2 rounded-md px-2 py-1 hover:bg-pm-hover transition-colors text-left"
              >
                <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', d.overdue ? 'bg-rose-500' : 'bg-pm-accent')} />
                <span className="text-[13px] text-pm-text-primary flex-1">{format(parseISO(d.date), 'EEE, MMM d')}</span>
                <span className="text-[12px] font-medium text-pm-text-muted">
                  {d.total} {__('task(s)', 'wedevs-project-manager')}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-pm-border text-[12px]">
        <span className="text-pm-text-muted">
          {monthTotal} {__('tasks due this month', 'wedevs-project-manager')}
        </span>
        <button className="text-pm-accent hover:underline font-medium" onClick={() => navigate('/calendar')}>
          {__('Full calendar', 'wedevs-project-manager')}
        </button>
      </div>
    </Card>
  )
}
