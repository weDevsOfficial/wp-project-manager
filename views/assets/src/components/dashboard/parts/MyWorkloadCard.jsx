import { __, sprintf, _n } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { ListChecks, AlertTriangle, CalendarDays, CheckCircle2 } from 'lucide-react'
import { Card } from '@components/ui/card'
import { CardHead } from './CardShell'
import { cn } from '@lib/utils'

/**
 * A member does not get the team card, so this gives them the same read on
 * their own load: what is late, what lands next, what they cleared.
 */
export default function MyWorkloadCard({ workload, range = 7 }) {
  const navigate = useNavigate()
  const w = workload || {}
  const open = w.open ?? 0
  const overdue = w.overdue ?? 0
  const dueSoon = w.due_soon ?? 0
  const completed = w.completed ?? 0

  const rows = [
    { key: 'overdue', icon: AlertTriangle, label: __('Overdue', 'wedevs-project-manager'), value: overdue, tone: 'text-rose-500 bg-rose-50' },
    { key: 'due',     icon: CalendarDays,  label: sprintf( /* translators: %d is the number of days in the selected range. */ __( 'Due in %d days', 'wedevs-project-manager' ), range ), value: dueSoon, tone: 'text-pm-accent bg-pm-accent-light' },
    { key: 'open',    icon: ListChecks,    label: __('Open tasks', 'wedevs-project-manager'), value: open, tone: 'text-pm-text-muted bg-pm-surface-muted' },
    { key: 'done',    icon: CheckCircle2,  label: sprintf( /* translators: %d is the number of days in the selected range. */ __( 'Completed in %d days', 'wedevs-project-manager' ), range ), value: completed, tone: 'text-emerald-500 bg-emerald-50' },
  ]

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col h-full">
      <CardHead
        icon={ListChecks}
        title={__('My workload', 'wedevs-project-manager')}
        subtitle={
          overdue > 0
            ? sprintf( /* translators: %d is the number of overdue tasks. */ _n( '%d task needs attention', '%d tasks need attention', overdue, 'wedevs-project-manager' ), overdue )
            : __('Nothing late right now', 'wedevs-project-manager')
        }
      />

      <div className="flex-1 space-y-2">
        {rows.map(r => (
          <button
            key={r.key}
            type="button"
            onClick={() => navigate('/my-tasks')}
            className="w-full flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-pm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40"
          >
            <span className={cn('flex items-center justify-center w-8 h-8 rounded-lg shrink-0', r.tone)}>
              <r.icon className="w-4 h-4" />
            </span>
            <span className="flex-1 text-[13px] text-pm-text-muted truncate">{r.label}</span>
            <span className="text-[18px] font-bold text-pm-text-primary tabular-nums">{r.value}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}
