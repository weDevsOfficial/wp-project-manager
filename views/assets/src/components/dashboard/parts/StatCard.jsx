import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { cn } from '@lib/utils'

/**
 * A single KPI stat tile — number, label, optional trend delta and sub-line.
 * `accent` renders the filled (primary) variant used for the lead metric.
 */
export default function StatCard({ icon: Icon, label, value, sub, trend, accent = false, onClick }) {
  const TrendIcon = trend?.direction === 'up' ? ArrowUpRight
    : trend?.direction === 'down' ? ArrowDownRight : Minus

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg border p-3 flex flex-col gap-1.5 transition-shadow',
        onClick && 'cursor-pointer hover:shadow-md',
        accent
          ? 'bg-pm-accent text-white border-transparent'
          : 'bg-card border-pm-border',
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn('text-[12px] font-medium', accent ? 'text-white/90' : 'text-pm-text-muted')}>
          {label}
        </span>
        <span className={cn(
          'flex items-center justify-center w-6 h-6 rounded-full shrink-0',
          accent ? 'bg-white/20' : 'bg-pm-surface-muted',
        )}>
          {Icon && <Icon className={cn('w-3.5 h-3.5', accent ? 'text-white' : 'text-pm-text-muted')} />}
        </span>
      </div>

      <div className={cn('text-2xl font-bold leading-none', accent ? 'text-white' : 'text-pm-text-primary')}>
        {value}
      </div>

      <div className="flex items-center gap-1.5 text-[11px]">
        {trend && (
          <span className={cn(
            'inline-flex items-center gap-0.5 font-medium',
            accent ? 'text-white' : trend.direction === 'down' ? 'text-rose-500' : 'text-emerald-500',
          )}>
            <TrendIcon className="w-3.5 h-3.5" />
            {trend.percent}%
          </span>
        )}
        {sub && <span className={cn(accent ? 'text-white/80' : 'text-pm-text-muted')}>{sub}</span>}
      </div>
    </div>
  )
}
