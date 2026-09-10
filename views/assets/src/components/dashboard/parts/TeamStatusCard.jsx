import { __, sprintf, _n } from '@wordpress/i18n'
import { useMemo } from 'react'
import { Users } from 'lucide-react'
import { Card } from '@components/ui/card'
import { UserAvatar } from '@components/common/UserAvatar'
import { CardHead, EmptyState } from './CardShell'
import { cn } from '@lib/utils'

export default function TeamStatusCard({ team, range = 7, scope }) {
  const members = team?.members ?? (Array.isArray(team) ? team : [])
  const total = team?.total ?? members.length

  // Bars are relative to the busiest person, so the comparison is between
  // people rather than against an arbitrary ceiling.
  const peak = useMemo(
    () => Math.max(1, ...members.map(m => m.burden ?? 0)),
    [members],
  )

  const hidden = Math.max(0, total - members.length)

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col h-full">
      <CardHead
        icon={Users}
        title={__('Team workload', 'wedevs-project-manager')}
        subtitle={
          scope === 'organisation'
            ? sprintf( /* translators: %d is the number of people on the team. */ _n( '%d person across all projects', '%d people across all projects', total, 'wedevs-project-manager' ), total )
            : sprintf( /* translators: %d is the number of people on the team. */ _n( '%d person in your projects', '%d people in your projects', total, 'wedevs-project-manager' ), total )
        }
      />

      {members.length === 0 ? (
        <EmptyState icon={Users}>
          {__('No one has open tasks. Assign work to see workload here.', 'wedevs-project-manager')}
        </EmptyState>
      ) : (
        <div className="flex-1 min-h-0 max-h-[340px] overflow-y-auto pm-sidebar-scroll pr-1 space-y-3">
          {members.map(m => {
            const burden = m.burden ?? 0
            const overdue = m.overdue ?? 0
            const dueSoon = m.due_soon ?? 0
            const width = (n) => `${Math.round((n / peak) * 100)}%`

            return (
              <div key={m.id} className="flex items-center gap-3">
                <UserAvatar
                  user={{ id: m.id, display_name: m.name, avatar_url: m.avatar_url }}
                  size="md"
                  className="w-8 h-8 shrink-0"
                  fallbackClassName="text-[12px]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-pm-text-primary truncate">{m.name}</span>
                    <span className={cn(
                      'text-[12px] shrink-0 tabular-nums',
                      burden === 0 ? 'text-pm-text-muted' : 'text-pm-text-primary font-medium',
                    )}>
                      {burden === 0
                        ? __('Free', 'wedevs-project-manager')
                        : sprintf( /* translators: %d is the number of tasks the person is carrying. */ _n( '%d task', '%d tasks', burden, 'wedevs-project-manager' ), burden )}
                    </span>
                  </div>

                  {/* Overdue first so the debt reads before the upcoming load. */}
                  <div className="flex h-1.5 rounded-full bg-pm-surface-muted mt-1 overflow-hidden">
                    {overdue > 0 && <div className="h-full bg-rose-500" style={{ width: width(overdue) }} />}
                    {dueSoon > 0 && <div className="h-full bg-pm-accent" style={{ width: width(dueSoon) }} />}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-pm-text-muted">
                    {overdue > 0 && (
                      <span className="text-rose-500 font-medium tabular-nums">
                        {sprintf( /* translators: %d is the number of overdue tasks for that person. */ _n( '%d overdue', '%d overdue', overdue, 'wedevs-project-manager' ), overdue )}
                      </span>
                    )}
                    <span className="tabular-nums">
                      {sprintf( /* translators: %1$d is the number of tasks due, %2$d is the number of days in the range. */ __( '%1$d due in %2$d days', 'wedevs-project-manager' ), dueSoon, range )}
                    </span>
                    <span className="ml-auto tabular-nums">
                      {sprintf( /* translators: %d is the number of tasks the person completed. */ __( '%d done', 'wedevs-project-manager' ), m.completed ?? 0 )}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {hidden > 0 && (
        <p className="mt-3 shrink-0 text-[11px] text-pm-text-muted">
          {sprintf( /* translators: %1$d is how many people are listed, %2$d is the team size. */ __( 'Showing the %1$d most loaded of %2$d', 'wedevs-project-manager' ), members.length, total )}
        </p>
      )}
    </Card>
  )
}
