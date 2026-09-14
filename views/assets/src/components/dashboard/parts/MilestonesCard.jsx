import { __ } from '@wordpress/i18n'
import { Flag } from 'lucide-react'
import { Card } from '@components/ui/card'
import { Progress } from '@components/ui/progress'
import { CardHead, EmptyState } from './CardShell'

export default function MilestonesCard({ milestones }) {
  const list = milestones || []

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col h-full">
      <CardHead icon={Flag} title={__('Upcoming Milestones', 'wedevs-project-manager')} />

      {list.length === 0 ? (
        <EmptyState icon={Flag}>{__('No milestones due. Add one to a project to track a delivery date.', 'wedevs-project-manager')}</EmptyState>
      ) : (
        <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pm-sidebar-scroll pr-1">
          {list.map(m => (
            <div key={m.id}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[14px] font-medium text-pm-text-primary truncate flex-1">{m.title}</span>
                {m.due_date && (
                  <span className="text-[12px] text-pm-text-muted whitespace-nowrap shrink-0">{m.due_date}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={m.progress} className="h-1.5 flex-1" />
                <span className="text-[12px] font-medium text-pm-text-muted w-9 text-right">{m.progress}%</span>
              </div>
              {m.project && <div className="text-[11px] text-pm-text-muted mt-1 truncate">{m.project}</div>}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
