import { __, _n, sprintf } from '@wordpress/i18n'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { Card } from '@components/ui/card'

const COLORS = {
  on_track:  'hsl(152 60% 45%)',
  at_risk:   'hsl(0 72% 60%)',
  completed: 'hsl(262 80% 57%)',
  archived:  'hsl(220 9% 60%)',
}

export default function ProjectStatusCard({ status }) {
  const navigate = useNavigate()
  const s = status || {}

  const segments = useMemo(() => ([
    { key: 'on_track',  label: __('On Track', 'wedevs-project-manager'),  value: s.on_track ?? 0 },
    { key: 'at_risk',   label: __('At Risk', 'wedevs-project-manager'),   value: s.at_risk ?? 0 },
    { key: 'completed', label: __('Completed', 'wedevs-project-manager'), value: s.completed ?? 0 },
    { key: 'archived',  label: __('Archived', 'wedevs-project-manager'),  value: s.archived ?? 0 },
  ]), [s])

  const total = s.total ?? 0
  const data = segments.filter(seg => seg.value > 0)
  const active = (s.on_track ?? 0) + (s.at_risk ?? 0)
  const onTrackPct = active > 0 ? Math.round(((s.on_track ?? 0) / active) * 100) : 0

  return (
    <Card className="p-5 border-pm-border flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[15px] font-semibold text-pm-text-primary">
          {__('Projects', 'wedevs-project-manager')}
        </h3>
        <button
          className="text-[12px] text-pm-accent hover:underline"
          onClick={() => navigate('/projects')}
        >
          {__('View all', 'wedevs-project-manager')}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-[120px] h-[120px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.length ? data : [{ key: 'empty', value: 1 }]}
                dataKey="value"
                innerRadius={42}
                outerRadius={58}
                paddingAngle={data.length > 1 ? 3 : 0}
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {(data.length ? data : [{ key: 'empty' }]).map(seg => (
                  <Cell key={seg.key} fill={COLORS[seg.key] || 'hsl(220 13% 91%)'} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-pm-text-primary leading-none">{total}</span>
            <span className="text-[11px] text-pm-text-muted">{__('Total', 'wedevs-project-manager')}</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {segments.map(seg => (
            <div key={seg.key} className="flex items-center gap-2 text-[13px]">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[seg.key] }} />
              <span className="text-pm-text-muted flex-1 truncate">{seg.label}</span>
              <span className="font-semibold text-pm-text-primary">{seg.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health footer — fills the space + surfaces risk */}
      <div className="flex-1 flex flex-col justify-end mt-4 pt-4 border-t border-pm-border">
        <div className="flex items-center justify-between text-[12px] mb-1.5">
          <span className="text-pm-text-muted">{__('On-track ratio', 'wedevs-project-manager')}</span>
          <span className="font-semibold text-pm-text-primary">{onTrackPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-pm-surface-muted overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${onTrackPct}%` }} />
        </div>
        {(s.at_risk ?? 0) > 0 ? (
          <button
            onClick={() => navigate('/projects')}
            className="mt-3 flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2 text-left hover:bg-rose-100 transition-colors"
          >
            <span className="text-[13px] text-rose-600 font-medium">
              {sprintf( _n( '%d project needs attention', '%d projects need attention', s.at_risk, 'wedevs-project-manager' ), s.at_risk )}
            </span>
            <ChevronRight className="w-4 h-4 text-rose-500 shrink-0" />
          </button>
        ) : (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-[13px] text-emerald-600 font-medium">{__('All projects on track', 'wedevs-project-manager')}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
