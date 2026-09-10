import { __, sprintf } from '@wordpress/i18n'
import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card } from '@components/ui/card'
import { CardHead } from './CardShell'

const COLORS = {
  completed:   'hsl(var(--primary))',
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
    <Card className="rounded-xl p-5 border-pm-border flex flex-col h-full">
      <CardHead
        title={__('Task status', 'wedevs-project-manager')}
        subtitle={sprintf( /* translators: %d is the total number of tasks. */ __( '%d tasks in total', 'wedevs-project-manager' ), total )}
      />

      <div className="relative w-full flex-1 min-h-[170px] max-h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.length ? data : [{ key: 'empty', value: 1 }]}
              dataKey="value"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={data.length > 1 ? 3 : 0}
              strokeWidth={0}
              isAnimationActive={false}
              startAngle={90}
              endAngle={-270}
            >
              {(data.length ? data : [{ key: 'empty' }]).map(seg => (
                <Cell key={seg.key} fill={COLORS[seg.key] || 'hsl(var(--muted))'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-pm-text-primary leading-none tabular-nums">{pct}%</span>
          <span className="text-[11px] text-pm-text-muted mt-1">{__('Done', 'wedevs-project-manager')}</span>
        </div>
      </div>

      {/* Per-status breakdown — the share bar makes the split readable without
          reading the ring, and gives the space below the donut a job. */}
      <div className="mt-4 space-y-2.5">
        {segments.map(seg => {
          const share = total > 0 ? Math.round((seg.value / total) * 100) : 0
          return (
            <div key={seg.key}>
              <div className="flex items-center gap-2 text-[13px] mb-1">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[seg.key] }} />
                <span className="text-pm-text-muted flex-1 truncate">{seg.label}</span>
                <span className="font-semibold text-pm-text-primary tabular-nums">{seg.value}</span>
                <span className="text-[12px] text-pm-text-muted tabular-nums w-9 text-right">{share}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-pm-surface-muted overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: COLORS[seg.key] }} />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
