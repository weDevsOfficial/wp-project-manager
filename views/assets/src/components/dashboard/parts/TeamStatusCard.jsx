import { __, sprintf, _n } from '@wordpress/i18n'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { Card } from '@components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@components/ui/tooltip'
import { UserAvatar } from '@components/common/UserAvatar'
import { usePermissions } from '@hooks/usePermissions'
import { CardHead, EmptyState } from './CardShell'
import { cn } from '@lib/utils'

function Segment({ value, peak, className, tip }) {
  if (value <= 0) return null
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn('h-full', className)} style={{ width: `${(value / peak) * 100}%` }} />
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[12px]">{tip}</TooltipContent>
    </Tooltip>
  )
}

export default function TeamStatusCard({ team, range = 7, scope }) {
  const navigate = useNavigate()
  // Only a PM manager may open someone else's tasks (users/{id} routes).
  const { canManage } = usePermissions()
  const members = team?.members ?? (Array.isArray(team) ? team : [])
  const total = team?.total ?? members.length
  const summary = team?.summary

  // Bars are relative to the busiest person, so the comparison is between
  // people rather than against an arbitrary ceiling.
  const peak = useMemo(
    () => Math.max(1, ...members.map(m => m.open ?? 0)),
    [members],
  )

  const hidden = Math.max(0, total - members.length)

  const openPerson = (m) => navigate(`/my-tasks?user=${m.id}`)

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

      {summary && members.length > 0 && (
        <p className="-mt-1 mb-3 text-[12px] text-pm-text-muted tabular-nums">
          {sprintf( /* translators: %d is the number of open tasks across the team, each counted once. */ __( '%d open', 'wedevs-project-manager' ), summary.open ?? 0 )}
          {' · '}
          <span className={cn((summary.overdue ?? 0) > 0 && 'text-rose-500 font-medium')}>
            {sprintf( /* translators: %d is the number of overdue tasks across the team. */ _n( '%d overdue', '%d overdue', summary.overdue ?? 0, 'wedevs-project-manager' ), summary.overdue ?? 0 )}
          </span>
          {' · '}
          {sprintf( /* translators: %1$d is the number of tasks the team completed, %2$d is the number of days in the range. */ __( '%1$d done in %2$d days', 'wedevs-project-manager' ), summary.completed ?? 0, range )}
        </p>
      )}

      {members.length === 0 ? (
        <EmptyState icon={Users}>
          {__('No one has open tasks. Assign work to see workload here.', 'wedevs-project-manager')}
        </EmptyState>
      ) : (
        // The list fills whatever height the row gives the card (set by its taller
        // neighbour) instead of a fixed 340px that left an empty band below it.
        <TooltipProvider delayDuration={80}>
        <div className="relative flex-1 min-h-[300px]">
        <div className="absolute inset-0 overflow-y-auto pm-sidebar-scroll pr-1 space-y-1">
          {members.map(m => {
            const open = m.open ?? 0
            const overdue = m.overdue ?? 0
            const dueSoon = m.due_soon ?? 0
            const later = m.later ?? Math.max(0, open - overdue - dueSoon)
            const onKeyDown = canManage ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openPerson(m)
              }
            } : undefined

            return (
              <div
                key={m.id}
                role={canManage ? 'button' : undefined}
                tabIndex={canManage ? 0 : undefined}
                onClick={canManage ? () => openPerson(m) : undefined}
                onKeyDown={onKeyDown}
                aria-label={canManage ? sprintf( /* translators: %s is a person's name. */ __( 'Open %s\'s tasks', 'wedevs-project-manager' ), m.name ) : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-2 py-1.5',
                  canManage && 'cursor-pointer transition-colors hover:bg-pm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40',
                )}
              >
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
                      open === 0 ? 'text-pm-text-muted' : 'text-pm-text-primary font-medium',
                    )}>
                      {open === 0
                        ? __('Free', 'wedevs-project-manager')
                        : sprintf( /* translators: %d is the number of open tasks and subtasks assigned to the person. */ _n( '%d open task', '%d open tasks', open, 'wedevs-project-manager' ), open )}
                    </span>
                  </div>

                  {/* Overdue first so the debt reads before the upcoming load. */}
                  <div className="flex h-2 rounded-full bg-pm-surface-muted mt-1 overflow-hidden">
                    <Segment value={overdue} peak={peak} className="bg-rose-500"
                      tip={sprintf( /* translators: %d is a number of tasks. */ _n( '%d overdue task', '%d overdue tasks', overdue, 'wedevs-project-manager' ), overdue )} />
                    <Segment value={dueSoon} peak={peak} className="bg-amber-500"
                      tip={sprintf( /* translators: %1$d is a number of tasks, %2$d is the number of days in the range. */ _n( '%1$d task due in the next %2$d days', '%1$d tasks due in the next %2$d days', dueSoon, 'wedevs-project-manager' ), dueSoon, range )} />
                    <Segment value={later} peak={peak} className="bg-pm-accent/50"
                      tip={sprintf( /* translators: %d is a number of tasks. */ _n( '%d task due later or with no due date', '%d tasks due later or with no due date', later, 'wedevs-project-manager' ), later )} />
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
        </div>
        </TooltipProvider>
      )}

      {hidden > 0 && (
        <p className="mt-3 shrink-0 text-[11px] text-pm-text-muted">
          {sprintf( /* translators: %1$d is how many people are listed, %2$d is the team size. */ __( 'Showing the %1$d most loaded of %2$d', 'wedevs-project-manager' ), members.length, total )}
        </p>
      )}
    </Card>
  )
}
