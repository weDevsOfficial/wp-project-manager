import { __ } from '@wordpress/i18n'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { Card } from '@components/ui/card'
import { Calendar } from '@components/ui/calendar'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@components/ui/tooltip'
import { cn } from '@lib/utils'
import { CardHead } from './CardShell'

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

  // Custom day button: number on top, load dot on its own row underneath, so
  // the dot never lands on the digits the way an overlaid dot did.
  const DayButton = ({ day, modifiers, className, children, ...rest }) => {
    const ds = format(day.date, 'yyyy-MM-dd')
    const info = dayMap.get(ds)

    const btn = (
      <button
        {...rest}
        className={cn(
          className,
          'flex h-full w-full flex-col items-center justify-center gap-[3px] rounded-lg text-[13px] leading-none',
        )}
      >
        <span className="leading-none">{format(day.date, 'd')}</span>
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            !info ? 'bg-transparent'
              : modifiers?.selected ? 'bg-pm-surface'
              : info.overdue ? 'bg-rose-500' : 'bg-pm-accent',
          )}
        />
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
    <Card className="rounded-xl p-5 border-pm-border flex flex-col">
      <CardHead
        icon={CalendarDays}
        title={__('Calendar', 'wedevs-project-manager')}
        action={
        <div className="flex items-center gap-3 text-[11px] text-pm-text-muted shrink-0 pt-1">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-pm-accent" />{__('Due', 'wedevs-project-manager')}</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{__('Overdue', 'wedevs-project-manager')}</span>
        </div>
        }
      />

      <TooltipProvider delayDuration={100}>
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          modifiers={{ due: dueDates, overdue: overdueDates }}
          onSelect={(d) => { if (d) navigate('/my-tasks') }}
          components={{ DayButton }}
          className="w-full p-0"
          classNames={{
            root: 'w-full',
            months: 'relative flex w-full flex-col',
            month: 'flex w-full flex-col gap-2',
            month_caption: 'flex h-8 w-full items-center justify-center',
            caption_label: 'select-none text-[13px] font-semibold text-pm-text-primary',
            nav: 'absolute inset-x-0 top-0 flex h-8 items-center justify-between',
            button_previous: 'h-7 w-7 inline-flex items-center justify-center rounded-md text-pm-text-muted hover:bg-pm-hover hover:text-pm-text-primary transition-colors aria-disabled:opacity-40',
            button_next: 'h-7 w-7 inline-flex items-center justify-center rounded-md text-pm-text-muted hover:bg-pm-hover hover:text-pm-text-primary transition-colors aria-disabled:opacity-40',
            month_grid: 'w-full border-collapse',
            weekdays: 'flex w-full',
            weekday: 'flex-1 select-none text-center text-[11px] font-medium text-pm-text-muted',
            week: 'mt-1 flex w-full',
            day: 'group/day relative h-10 flex-1 p-0 text-center',
            today: 'rounded-lg bg-pm-accent-light font-semibold text-pm-accent',
            outside: 'text-pm-text-muted/40',
          }}
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
