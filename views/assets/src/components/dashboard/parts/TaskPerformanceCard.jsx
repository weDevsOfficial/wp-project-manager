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

export default function TaskPerformanceCard({ performance, range = 7 }) {
  const data = performance || []

  const isEmpty = data.every(d => !d.created && !d.completed)

  const chartConfig = {
    completed: { label: __('Completed', 'wedevs-project-manager'), color: 'hsl(var(--primary))' },
    created:   { label: __('Created', 'wedevs-project-manager'),   color: 'hsl(152 60% 52%)' },
  }

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col">
      <CardHead
        title={__('Task Performance', 'wedevs-project-manager')}
        subtitle={sprintf( /* translators: %d is the number of days in the selected range. */ __( 'Created vs completed, last %d days', 'wedevs-project-manager' ), range )}
      />

      {isEmpty ? (
        <div className="h-[220px] flex">
          <EmptyState icon={BarChart3}>
            {__('No tasks created or completed in this period.', 'wedevs-project-manager')}
          </EmptyState>
        </div>
      ) : (
      <ChartContainer config={chartConfig} className="h-[220px] w-full mt-2">
        <BarChart data={data} barGap={4}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} maxBarSize={26} />
          <Bar dataKey="created" fill="var(--color-created)" radius={[4, 4, 0, 0]} maxBarSize={26} />
        </BarChart>
      </ChartContainer>
      )}
    </Card>
  )
}
