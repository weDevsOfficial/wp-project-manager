import { __ } from '@wordpress/i18n'
import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card } from '@components/ui/card'

const COLORS = {
  completed:   'hsl(262 80% 57%)',
  in_progress: 'hsl(152 60% 45%)',
  pending:     'hsl(38 92% 55%)',
}

export default function TaskDistributionCard({ distribution }) {
  const d = distribution || {}

  const segments = useMemo(() => ([
    { key: 'completed',   label: __('Completed', 'wedevs-project-manager'),   value: d.completed ?? 0 },
    { key: 'in_progress', label: __('In Progress', 'wedevs-project-manager'), value: d.in_progress ?? 0 },
    { key: 'pending',     label: __('Pending', 'wedevs-project-manager'),     value: d.pending ?? 0 },
  ]), [d])

  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const pct = total > 0 ? Math.round(((d.completed ?? 0) / total) * 100) : 0
  const data = segments.filter(s => s.value > 0)

  return (
    <Card className="p-5 border-pm-border flex flex-col">
      <h3 className="text-[15px] font-semibold text-pm-text-primary mb-2">
        {__('Task Distribution', 'wedevs-project-manager')}
      </h3>

      <div className="relative w-full h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.length ? data : [{ key: 'empty', value: 1 }]}
              dataKey="value"
              innerRadius={48}
              outerRadius={66}
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
          <span className="text-2xl font-bold text-pm-text-primary leading-none">{pct}%</span>
          <span className="text-[11px] text-pm-text-muted">{__('Done', 'wedevs-project-manager')}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
        {segments.map(seg => (
          <div key={seg.key} className="flex items-center gap-1.5 text-[12px]">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[seg.key] }} />
            <span className="text-pm-text-muted">{seg.label}</span>
            <span className="font-semibold text-pm-text-primary">{seg.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
