import { __, _x, sprintf } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { Card } from '@components/ui/card'
import { UserAvatar } from '@components/common/UserAvatar'
import { resolveActivityUrl } from '@lib/activity-links'
import { CardHead, EmptyState } from './CardShell'

export default function RecentActivityCard({ activity, range = 7 }) {
  const navigate = useNavigate()
  const list = activity || []

  // Open the item the line is about. Deleted items have nowhere to go.
  const goActivity = (a) => {
    if (!a.clickable || !a.project_id) return
    const url = resolveActivityUrl({
      action: a.action_key,
      resource_type: a.resource_type,
      resource_id: a.resource_id,
      project: { id: a.project_id },
    }, a.project_id)
    if (!url) return
    if (url.openTaskSheet) navigate(`/projects/${url.projectId}/task-lists/tasks/${url.taskId}`)
    else navigate(url.path)
  }

  // The phrase is translated server side with one %s for the item title,
  // which becomes the link.
  const phrase = (a) => {
    const template = a.action_template || ''
    const at = template.indexOf('%s')
    if (at < 0 || !a.resource_title) return <span className="text-pm-text-muted">{a.action}</span>
    const title = a.clickable ? (
      <button type="button" onClick={() => goActivity(a)} className="inline text-left break-words font-medium text-pm-text-primary hover:text-pm-accent hover:underline">{a.resource_title}</button>
    ) : (
      <span className="break-words font-medium text-pm-text-primary">{a.resource_title}</span>
    )
    return <span className="text-pm-text-muted">{template.slice(0, at)}{title}{template.slice(at + 2)}</span>
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
                  <span className="font-medium">{a.actor}</span>{' '}
                  {phrase(a)}
                  {a.project && a.resource_type !== 'project' && <> <span className="text-pm-text-muted">{_x('in', 'recent activity: "updated task title in <project>"', 'wedevs-project-manager')}</span>{' '}
                    {a.clickable && a.project_id ? (
                      <button type="button" onClick={() => goActivity(a)} className="inline-block max-w-full truncate align-bottom text-left font-medium text-pm-text-primary hover:text-pm-accent hover:underline">{a.project}</button>
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
