import { __ } from '@wordpress/i18n'
import { Flag } from 'lucide-react'
import { Card } from '@components/ui/card'
import { Progress } from '@components/ui/progress'

export default function MilestonesCard({ milestones }) {
  const list = milestones || []

  return (
    <Card className="p-5 border-pm-border flex flex-col">
      <h3 className="text-[15px] font-semibold text-pm-text-primary flex items-center gap-2 mb-3">
        <Flag className="w-4 h-4 text-pm-text-muted" />
        {__('Upcoming Milestones', 'wedevs-project-manager')}
      </h3>

      {list.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <Flag className="w-8 h-8 text-pm-text-muted/40 mb-2" />
          <p className="text-[13px] text-pm-text-muted">{__('No upcoming milestones.', 'wedevs-project-manager')}</p>
        </div>
      ) : (
        <div className="space-y-3">
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
