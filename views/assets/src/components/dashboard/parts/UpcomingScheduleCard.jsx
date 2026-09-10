import { __, sprintf, _n } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CircleDot } from 'lucide-react'
import { Card } from '@components/ui/card'
import { CardHead, CardAction, EmptyState, ROW } from './CardShell'

// The API sends priority as a slug ('low' | 'medium' | 'high'), not the DB int.
const PRIORITY = {
  low:    'hsl(var(--muted-foreground))',
  medium: 'hsl(38 92% 55%)',
  high:   'hsl(0 72% 60%)',
}

export default function UpcomingScheduleCard({ items, total = 0 }) {
  const navigate = useNavigate()
  const list = items || []
  const hidden = Math.max(0, total - list.length)

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col h-full">
      <CardHead
        icon={CalendarDays}
        title={__('Upcoming Tasks', 'wedevs-project-manager')}
        action={<CardAction onClick={() => navigate('/my-tasks')}>{__('My tasks', 'wedevs-project-manager')}</CardAction>}
      />

      {list.length === 0 ? (
        <EmptyState icon={CalendarDays}>{__('Nothing scheduled. Add a due date to a task to see it here.', 'wedevs-project-manager')}</EmptyState>
      ) : (
        <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pm-sidebar-scroll pr-1">
          {list.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(`/projects/${t.project_id}/task-lists/tasks/${t.id}`)}
              className={ROW}
            >
              <CircleDot className="w-4 h-4 shrink-0" style={{ color: PRIORITY[t.priority] ?? PRIORITY.medium }} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-pm-text-primary truncate">{t.title}</div>
                {t.project_title && (
                  <div className="text-[12px] text-pm-text-muted truncate">{t.project_title}</div>
                )}
              </div>
              {t.due_date && (
                <span className="text-[12px] text-pm-text-muted whitespace-nowrap shrink-0">{t.due_date}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => navigate('/my-tasks')}
          className="mt-3 shrink-0 rounded-lg border border-pm-border py-2 text-[12px] font-medium text-pm-text-muted transition-colors hover:bg-pm-hover hover:text-pm-text-primary"
        >
          {sprintf( _n( 'View %d more', 'View %d more', hidden, 'wedevs-project-manager' ), hidden )}
        </button>
      )}
    </Card>
  )
}
