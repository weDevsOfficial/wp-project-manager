import { __ } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { Card } from '@components/ui/card'
import { UserAvatar } from '@components/common/UserAvatar'

export default function RecentActivityCard({ activity }) {
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
    <Card className="p-5 border-pm-border flex flex-col h-full">
      <h3 className="text-[15px] font-semibold text-pm-text-primary flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-pm-text-muted" />
        {__('Recent Activity', 'wedevs-project-manager')}
      </h3>

      {list.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <Activity className="w-8 h-8 text-pm-text-muted/40 mb-2" />
          <p className="text-[13px] text-pm-text-muted">{__('No recent activity.', 'wedevs-project-manager')}</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pm-sidebar-scroll pr-1">
          {list.map(a => (
            <div key={a.id} className="flex items-start gap-2.5">
              <UserAvatar
                user={{ display_name: a.actor, avatar_url: a.avatar_url }}
                size="md"
                className="w-8 h-8 shrink-0 mt-0.5"
                fallbackClassName="text-[12px] bg-violet-100 text-violet-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-pm-text-primary leading-snug">
                  {a.project_id ? (
                    <button type="button" onClick={() => goActivity(a)} className="font-medium hover:text-pm-accent hover:underline">{a.actor}</button>
                  ) : (
                    <span className="font-medium">{a.actor}</span>
                  )}{' '}
                  <span className="text-pm-text-muted">{a.action}</span>
                  {a.project && <> <span className="text-pm-text-muted">·</span>{' '}
                    {a.project_id ? (
                      <button type="button" onClick={() => goProject(a)} className="text-pm-text-primary hover:text-pm-accent hover:underline">{a.project}</button>
                    ) : (
                      <span className="text-pm-text-primary">{a.project}</span>
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
