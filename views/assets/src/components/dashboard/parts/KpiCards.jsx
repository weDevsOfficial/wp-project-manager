import { __ } from '@wordpress/i18n'
import { ListChecks, Loader2, Clock3, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from './StatCard'

export default function KpiCards({ kpis }) {
  const navigate = useNavigate()
  const k = kpis || {}

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatCard
        accent
        icon={CheckCircle2}
        label={__('Completed', 'wedevs-project-manager')}
        value={k.completed ?? 0}
        trend={k.completed_trend}
        sub={__('vs last week', 'wedevs-project-manager')}
        onClick={() => navigate('/my-tasks')}
      />
      <StatCard
        icon={Loader2}
        label={__('In Progress', 'wedevs-project-manager')}
        value={k.in_progress ?? 0}
        sub={__('currently active', 'wedevs-project-manager')}
        onClick={() => navigate('/my-tasks')}
      />
      <StatCard
        icon={Clock3}
        label={__('Pending', 'wedevs-project-manager')}
        value={k.pending ?? 0}
        sub={__('awaiting start', 'wedevs-project-manager')}
      />
      <StatCard
        icon={AlertTriangle}
        label={__('Overdue', 'wedevs-project-manager')}
        value={k.overdue ?? 0}
        sub={__('past due date', 'wedevs-project-manager')}
      />
      <StatCard
        icon={ListChecks}
        label={__('Total Tasks', 'wedevs-project-manager')}
        value={k.total_tasks ?? 0}
        sub={`${k.completion_rate ?? 0}% ${__('complete', 'wedevs-project-manager')}`}
      />
    </div>
  )
}
