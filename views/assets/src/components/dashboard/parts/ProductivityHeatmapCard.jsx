import { __, sprintf } from '@wordpress/i18n'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { parseISO, format, getDay } from 'date-fns'
import { Flame } from 'lucide-react'
import { useApi } from '@hooks/useApi'
import { Card } from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@components/ui/tooltip'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@components/ui/select'
import { cn } from '@lib/utils'
import { CardHead } from './CardShell'

const WEEKDAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const ROLLING = 'rolling'

// Accent ramp: opacity steps of the theme accent, so the heatmap follows the
// palette (and dark mode). Steps come from the viewer's own busy days
// (quartiles), so a light contributor's map is not left pale.
function levelClass(count, steps) {
  if (count <= 0) return 'bg-pm-surface-muted border border-pm-border/70'
  if (count > steps[2]) return 'bg-pm-accent'
  if (count > steps[1]) return 'bg-pm-accent/75'
  if (count > steps[0]) return 'bg-pm-accent/50'
  return 'bg-pm-accent/25'
}

export default function ProductivityHeatmapCard() {
  const api = useApi()
  const [data, setData] = useState(null)
  const [year, setYear] = useState(ROLLING)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (y) => {
    setLoading(true)
    try {
      const params = y && y !== ROLLING ? { year: y } : {}
      const res = await api.get('dashboard/heatmap', params)
      setData(res?.data ?? res)
    } catch { /* heatmap is best-effort */ }
    finally { setLoading(false) }
  }, [api])

  useEffect(() => { load(ROLLING) }, [load])

  const onYearChange = (v) => { setYear(v); load(v) }

  const days = data?.days || []
  const activeDays = data?.active_days ?? 0
  const years = data?.years || []

  const steps = useMemo(() => {
    const counts = days.map(d => d.count).filter(c => c > 0).sort((a, b) => a - b)
    if (!counts.length) return [1, 2, 3]
    const at = (p) => counts[Math.min(counts.length - 1, Math.floor(p * (counts.length - 1)))]
    return [at(0.25), at(0.5), at(0.75)]
  }, [days])

  const weeks = useMemo(() => {
    if (!days.length) return []
    const lead = getDay(parseISO(days[0].date)) // 0=Sun → leading pad
    const cells = [...Array.from({ length: lead }, () => null), ...days]
    while (cells.length % 7 !== 0) cells.push(null) // trailing pad → full rectangle
    const out = []
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7))
    return out
  }, [days])

  const monthLabels = useMemo(() => {
    let prev = null
    return weeks.map((week) => {
      const first = week.find(Boolean)
      if (!first) return ''
      const m = format(parseISO(first.date), 'MMM')
      if (m !== prev) { prev = m; return m }
      return ''
    })
  }, [weeks])

  // Clients get no map (#521); the server says so explicitly.
  if (data && data.visible === false) return null

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col">
      <CardHead
        icon={Flame}
        title={__('Activity', 'wedevs-project-manager')}
        subtitle={data?.scope === 'self'
          ? __('Your contributions: tasks you created or completed, and your comments', 'wedevs-project-manager')
          : __('Tasks created, tasks completed and comments per day', 'wedevs-project-manager')}
        action={
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[12px] text-pm-text-muted hidden sm:inline">
            {sprintf( /* translators: %d is the number of days with recorded activity. */ __( '%d active days', 'wedevs-project-manager' ), activeDays )}
          </span>
          <Select value={year} onValueChange={onYearChange}>
            <SelectTrigger className="h-8 w-[150px] text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ROLLING}>{__('Last 12 months', 'wedevs-project-manager')}</SelectItem>
              {years.map(y => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        }
      />

      {loading ? (
        <Skeleton className="h-[120px] w-full" />
      ) : (
        <TooltipProvider delayDuration={80}>
          <div className="pb-1">
            {/* Month labels row — flex columns fill full width */}
            <div className="flex gap-[3px] pl-9 mb-1">
              {monthLabels.map((m, wi) => (
                <span key={wi} className="flex-1 text-[10px] text-pm-text-muted whitespace-nowrap overflow-visible">{m}</span>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {/* Weekday labels column */}
              <div className="flex flex-col gap-[3px] w-7 shrink-0 justify-between">
                {WEEKDAYS.map((w, i) => (
                  <span key={i} className="flex-1 text-[9px] text-pm-text-muted flex items-center">{w}</span>
                ))}
              </div>

              {weeks.map((week, wi) => (
                <div key={wi} className="flex-1 flex flex-col gap-[3px] min-w-[10px]">
                  {Array.from({ length: 7 }).map((_, di) => {
                    const d = week[di]
                    if (!d) return <div key={di} className="aspect-square w-full rounded-[3px] bg-pm-surface-muted/60 border border-pm-border/40" />
                    return (
                      <Tooltip key={di}>
                        <TooltipTrigger asChild>
                          <div className={cn('aspect-square w-full rounded-[3px]', levelClass(d.count, steps))} />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-[12px]">
                          <span className="font-medium">{format(parseISO(d.date), 'EEE, MMM d')}</span>
                          {' · '}
                          {d.created === undefined
                            ? sprintf( /* translators: %d is the number of activities recorded on that day. */ __( '%d activities', 'wedevs-project-manager' ), d.count )
                            : sprintf( /* translators: 1: tasks created, 2: tasks completed, 3: comments, all on that day. */ __( '%1$d created, %2$d completed, %3$d comments', 'wedevs-project-manager' ), d.created, d.completed, d.comments )}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </TooltipProvider>
      )}

      <div className="flex items-center justify-end gap-1.5 mt-3 text-[11px] text-pm-text-muted">
        {__('Less', 'wedevs-project-manager')}
        <span className="w-[13px] h-[13px] rounded-[3px] bg-pm-surface-muted border border-pm-border/70" />
        <span className="w-[13px] h-[13px] rounded-[3px] bg-pm-accent/25" />
        <span className="w-[13px] h-[13px] rounded-[3px] bg-pm-accent/50" />
        <span className="w-[13px] h-[13px] rounded-[3px] bg-pm-accent/75" />
        <span className="w-[13px] h-[13px] rounded-[3px] bg-pm-accent" />
        {__('More', 'wedevs-project-manager')}
      </div>
    </Card>
  )
}
