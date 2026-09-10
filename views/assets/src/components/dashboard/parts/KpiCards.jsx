import { __, sprintf } from '@wordpress/i18n'
import { ListChecks, Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from './StatCard'

export default function KpiCards({ kpis, range = 7 }) {
  const navigate = useNavigate()
  const k = kpis || {}

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard
        accent
        icon={CheckCircle2}
        label={__('Completed', 'wedevs-project-manager')}
        value={k.completed ?? 0}
        trend={k.completed_trend}
        sub={sprintf( /* translators: %d is the number of days in the selected range. */ __( 'vs previous %d days', 'wedevs-project-manager' ), range )}
        onClick={() => navigate('/my-tasks')}
      />
      <StatCard
        icon={Activity}
        label={__('In Progress', 'wedevs-project-manager')}
        value={k.in_progress ?? 0}
        sub={__('currently active', 'wedevs-project-manager')}
        onClick={() => navigate('/my-tasks')}
      />
      <StatCard
        icon={Clock}
        label={__('Pending', 'wedevs-project-manager')}
        value={k.pending ?? 0}
        sub={__('awaiting start', 'wedevs-project-manager')}
        onClick={() => navigate('/my-tasks')}
      />
      <StatCard
        icon={AlertTriangle}
        label={__('Overdue', 'wedevs-project-manager')}
        value={k.overdue ?? 0}
        sub={__('past due date', 'wedevs-project-manager')}
        onClick={() => navigate('/my-tasks')}
      />
      <StatCard
        icon={ListChecks}
        label={__('Total Tasks', 'wedevs-project-manager')}
        value={k.total_tasks ?? 0}
        sub={`${k.completion_rate ?? 0}% ${__('complete', 'wedevs-project-manager')}`}
        onClick={() => navigate('/my-tasks')}
      />
    </div>
  )
}
