import { __, _n, sprintf } from '@wordpress/i18n'
import { Flag } from 'lucide-react'
import { Card } from '@components/ui/card'
import { Progress } from '@components/ui/progress'
import { CardHead, EmptyState } from './CardShell'

function MilestoneRow({ m }) {
  const late = m.days_overdue > 0
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[14px] font-medium text-pm-text-primary truncate flex-1">{m.title}</span>
        {late ? (
          <span className="text-[12px] font-medium text-rose-600 whitespace-nowrap shrink-0">
            {sprintf( /* translators: %d is how many days the milestone is past its due date. */ _n( '%d day overdue', '%d days overdue', m.days_overdue, 'wedevs-project-manager' ), m.days_overdue )}
          </span>
        ) : m.due_date && (
          <span className="text-[12px] text-pm-text-muted whitespace-nowrap shrink-0">{m.due_date}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Progress value={m.progress} className="h-1.5 flex-1" />
        <span className="text-[12px] font-medium text-pm-text-muted w-9 text-right">{m.progress}%</span>
      </div>
      {m.project && <div className="text-[11px] text-pm-text-muted mt-1 truncate">{m.project}{late && m.due_date ? ` \u00b7 ${m.due_date}` : ''}</div>}
    </div>
  )
}

function GroupLabel({ children, tone }) {
  return <div className={`text-[11px] font-semibold uppercase tracking-wide ${tone}`}>{children}</div>
}

export default function MilestonesCard({ milestones, overdue }) {
  const list = milestones || []
  const late = overdue || []

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col h-full">
      <CardHead icon={Flag} title={__('Milestones', 'wedevs-project-manager')} />

      {list.length === 0 && late.length === 0 ? (
        <EmptyState icon={Flag} title={__('No milestones due', 'wedevs-project-manager')}>{__('Add one to a project to track a delivery date.', 'wedevs-project-manager')}</EmptyState>
      ) : (
        // Scrolls inside the height its row already has, so a long list never
        // stretches the row and leaves a gap under Active Projects.
        <div className="relative flex-1 min-h-[300px]">
        <div className="absolute inset-0 space-y-3 overflow-y-auto pm-sidebar-scroll pr-1">
          {late.length > 0 && (
            <GroupLabel tone="text-rose-600">{__('Overdue', 'wedevs-project-manager')}</GroupLabel>
          )}
          {late.map(m => <MilestoneRow key={`late-${m.id}`} m={m} />)}
          {late.length > 0 && list.length > 0 && (
            <GroupLabel tone="text-pm-text-muted">{__('Upcoming', 'wedevs-project-manager')}</GroupLabel>
          )}
          {list.map(m => <MilestoneRow key={m.id} m={m} />)}
        </div>
        </div>
      )}
    </Card>
  )
}
