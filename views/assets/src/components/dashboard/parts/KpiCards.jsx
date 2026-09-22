import { __, sprintf } from '@wordpress/i18n'
import { ListChecks, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from './StatCard'

// Completed (all time) + Open + Overdue = Total, so no card is a subset of the one next to it.
export default function KpiCards({ kpis, range = 7, tier = 'member' }) {
  const navigate = useNavigate()
  const k = kpis || {}
  const open = k.open ?? Math.max(0, (k.in_progress ?? 0) - (k.overdue ?? 0))

  const scope = tier === 'admin'
    ? __('Counts every task in the workspace.', 'wedevs-project-manager')
    : tier === 'manager'
      ? __('Counts every task in the projects you manage, plus your own.', 'wedevs-project-manager')
      : __('Counts the tasks assigned to you.', 'wedevs-project-manager')

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        accent
        icon={CheckCircle2}
        label={__('Completed', 'wedevs-project-manager')}
        value={k.completed_in_range ?? k.completed ?? 0}
        trend={k.completed_trend}
        sub={sprintf( /* translators: %d is the number of days in the selected range. */ __( 'vs previous %d days', 'wedevs-project-manager' ), range )}
        tip={`${sprintf( /* translators: %d is the number of days in the selected range. */ __( 'Tasks completed in the last %1$d days, compared with the %1$d days before.', 'wedevs-project-manager' ), range )} ${scope}`}
        onClick={() => navigate('/my-tasks/complete')}
      />
      <StatCard
        icon={Activity}
        label={__('Open', 'wedevs-project-manager')}
        value={open}
        sub={__('not past due', 'wedevs-project-manager')}
        tip={`${__('Tasks that are not done and not past their due date, including tasks without a due date.', 'wedevs-project-manager')} ${scope}`}
        onClick={() => navigate('/my-tasks')}
      />
      <StatCard
        icon={AlertTriangle}
        label={__('Overdue', 'wedevs-project-manager')}
        value={k.overdue ?? 0}
        sub={__('past due, as of today', 'wedevs-project-manager')}
        tip={`${__('Tasks that are not done and whose due date has passed.', 'wedevs-project-manager')} ${scope}`}
        onClick={() => navigate('/my-tasks/outstanding')}
      />
      <StatCard
        icon={ListChecks}
        label={__('Total Tasks', 'wedevs-project-manager')}
        value={k.total_tasks ?? 0}
        sub={sprintf( /* translators: %d is the share of all tasks that are complete. */ __( 'all time, %d%% complete', 'wedevs-project-manager' ), k.completion_rate ?? 0 )}
        tip={`${__('All tasks: completed (at any time), open and overdue.', 'wedevs-project-manager')} ${scope}`}
        onClick={() => navigate('/my-tasks')}
      />
    </div>
  )
}
