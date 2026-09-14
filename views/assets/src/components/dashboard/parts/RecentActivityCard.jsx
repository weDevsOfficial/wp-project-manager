import { __, sprintf } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { Card } from '@components/ui/card'
import { UserAvatar } from '@components/common/UserAvatar'
import { CardHead, EmptyState } from './CardShell'

export default function RecentActivityCard({ activity, range = 7 }) {
  const navigate = useNavigate()
  const list = activity || []

  // Deep-link to the task the activity is about, else the project's task list —
  // same destination as the Active Projects ("progress") card.
  const goActivity = (a) => {
    if (!a.project_id) return
    if (a.task_id) navigate(`/projects/${a.project_id}/task-lists/tasks/${a.task_id}`)
    else navigate(`/projects/${a.project_id}/task-lists`)
  }
  const goProject = (a) => {
    if (a.project_id) navigate(`/projects/${a.project_id}/task-lists`)
  }

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col h-full">
      <CardHead
        icon={Activity}
        title={__('Recent Activity', 'wedevs-project-manager')}
        subtitle={sprintf( /* translators: %d is the number of days in the selected range. */ __( 'Last %d days', 'wedevs-project-manager' ), range )}
      />

      {list.length === 0 ? (
        <EmptyState icon={Activity}>{__('No activity in this period. Changes your team makes will show up here.', 'wedevs-project-manager')}</EmptyState>
      ) : (
        <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pm-sidebar-scroll pr-1">
          {list.map(a => (
            <div key={a.id} className="flex items-start gap-2.5">
              <UserAvatar
                user={{ display_name: a.actor, avatar_url: a.avatar_url }}
                size="md"
                className="w-8 h-8 shrink-0 mt-0.5"
                fallbackClassName="text-[12px]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-pm-text-primary leading-snug">
                  {a.project_id ? (
                    <button type="button" onClick={() => goActivity(a)} className="text-left align-baseline font-medium hover:text-pm-accent hover:underline">{a.actor}</button>
                  ) : (
                    <span className="font-medium">{a.actor}</span>
                  )}{' '}
                  <span className="text-pm-text-muted">{a.action}</span>
                  {a.project && <> <span className="text-pm-text-muted">·</span>{' '}
                    {a.project_id ? (
                      <button type="button" onClick={() => goProject(a)} className="inline-block max-w-full truncate align-bottom text-left text-pm-text-primary hover:text-pm-accent hover:underline">{a.project}</button>
                    ) : (
                      <span className="inline-block max-w-full truncate align-bottom text-pm-text-primary">{a.project}</span>
                    )}</>}
                </p>
                <span className="text-[11px] text-pm-text-muted">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
