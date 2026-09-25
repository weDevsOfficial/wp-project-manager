import { __, sprintf } from '@wordpress/i18n'
import { Bar, BarChart, XAxis, CartesianGrid } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card } from '@components/ui/card'
import { CardHead, EmptyState } from './CardShell'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@components/ui/chart'

// Which pair of series to draw, by who is looking (#508). The server picks the mode.
function seriesFor(mode) {
  const completed = { key: 'completed', label: __('Completed', 'wedevs-project-manager'), color: 'hsl(var(--primary))' }
  if (mode === 'team') {
    return [{ key: 'assigned', label: __('Assigned to team', 'wedevs-project-manager'), color: 'hsl(152 60% 52%)' }, completed]
  }
  if (mode === 'self') {
    return [completed, { key: 'assigned', label: __('Assigned to me', 'wedevs-project-manager'), color: 'hsl(152 60% 52%)' }]
  }
  return [completed, { key: 'created', label: __('Created', 'wedevs-project-manager'), color: 'hsl(152 60% 52%)' }]
}

function subtitleFor(mode, range) {
  if (mode === 'team') {
    /* translators: %d is the number of days in the selected range. */
    return sprintf(__('Assigned to your team vs completed, last %d days', 'wedevs-project-manager'), range)
  }
  if (mode === 'self') {
    /* translators: %d is the number of days in the selected range. */
    return sprintf(__('Completed vs assigned to you, last %d days', 'wedevs-project-manager'), range)
  }
  /* translators: %d is the number of days in the selected range. */
  return sprintf(__('Created vs completed, last %d days', 'wedevs-project-manager'), range)
}

export default function TaskPerformanceCard({ performance, range = 7, mode = 'created' }) {
  const data = performance || []
  const series = seriesFor(mode)

  const isEmpty = data.every(d => series.every(s => !d[s.key]))

  const chartConfig = Object.fromEntries(series.map(s => [s.key, { label: s.label, color: s.color }]))

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col">
      <CardHead
        title={__('Task Performance', 'wedevs-project-manager')}
        subtitle={subtitleFor(mode, range)}
      />

      {isEmpty ? (
        <div className="h-[220px] flex">
          <EmptyState icon={BarChart3} title={__('No task activity yet', 'wedevs-project-manager')}>
            {mode === 'created'
              ? __('No tasks created or completed in this period.', 'wedevs-project-manager')
              : __('No tasks assigned or completed in this period.', 'wedevs-project-manager')}
          </EmptyState>
        </div>
      ) : (
      <ChartContainer config={chartConfig} className="h-[220px] w-full mt-2">
        <BarChart data={data} barGap={4}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {series.map(s => (
            <Bar key={s.key} dataKey={s.key} fill={`var(--color-${s.key})`} radius={[4, 4, 0, 0]} maxBarSize={26} />
          ))}
        </BarChart>
      </ChartContainer>
      )}
    </Card>
  )
}
