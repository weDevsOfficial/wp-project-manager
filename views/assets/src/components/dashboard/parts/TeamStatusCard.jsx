import { __, sprintf, _n } from '@wordpress/i18n'
import { Users } from 'lucide-react'
import { Card } from '@components/ui/card'
import { UserAvatar } from '@components/common/UserAvatar'

export default function TeamStatusCard({ team }) {
  const list = team || []

  return (
    <Card className="p-5 border-pm-border flex flex-col">
      <h3 className="text-[15px] font-semibold text-pm-text-primary flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-pm-text-muted" />
        {__('Team Workload', 'wedevs-project-manager')}
      </h3>

      {list.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <Users className="w-8 h-8 text-pm-text-muted/40 mb-2" />
          <p className="text-[13px] text-pm-text-muted">
            {__('No active team members yet.', 'wedevs-project-manager')}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {list.map(m => {
            const totalAssigned = m.active + m.completed
            const pct = totalAssigned > 0 ? Math.round((m.completed / totalAssigned) * 100) : 0
            return (
              <div key={m.id} className="flex items-center gap-3">
                <UserAvatar user={{ id: m.id, display_name: m.name, avatar_url: m.avatar_url }} size="md" className="w-8 h-8 shrink-0" fallbackClassName="text-[12px]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-pm-text-primary truncate">{m.name}</span>
                    <span className="text-[12px] text-pm-text-muted shrink-0">
                      {sprintf( _n( '%d active', '%d active', m.active, 'wedevs-project-manager' ), m.active )}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-pm-surface-muted mt-1 overflow-hidden">
                    <div className="h-full rounded-full bg-pm-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
