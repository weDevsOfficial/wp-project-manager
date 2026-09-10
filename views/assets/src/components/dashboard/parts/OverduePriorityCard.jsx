import { __, sprintf, _n } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card } from '@components/ui/card'
import { Badge } from '@components/ui/badge'
import { cn } from '@lib/utils'
import { CardHead, EmptyState, ROW } from './CardShell'

const PRIORITY_DOT = {
  high:   'bg-rose-500',
  medium: 'bg-amber-500',
  low:    'bg-pm-text-muted/50',
}

export default function OverduePriorityCard({ items, total = 0 }) {
  const navigate = useNavigate()
  const list = items || []
  const hidden = Math.max(0, total - list.length)

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col h-full">
      <CardHead
        icon={AlertTriangle}
        iconClassName="text-rose-500"
        title={__('Needs attention', 'wedevs-project-manager')}
        subtitle={total > 0 ? sprintf( /* translators: %d is the number of overdue tasks. */ _n( '%d task past its due date', '%d tasks past their due date', total, 'wedevs-project-manager' ), total ) : null}
      />

      {list.length === 0 ? (
        <EmptyState icon={CheckCircle2} tone="positive">{__('Nothing overdue. Everything with a due date is on time.', 'wedevs-project-manager')}</EmptyState>
      ) : (
        <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pm-sidebar-scroll pr-1">
          {list.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(`/projects/${t.project_id}/task-lists/tasks/${t.id}`)}
              className={ROW}
            >
              <span className={cn('w-2 h-2 rounded-full shrink-0', PRIORITY_DOT[t.priority] || PRIORITY_DOT.medium)} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-pm-text-primary truncate">{t.title}</div>
                {t.project_title && <div className="text-[12px] text-pm-text-muted truncate">{t.project_title}</div>}
              </div>
              <Badge variant="outline" className="shrink-0 text-[11px] text-rose-600 border-rose-200 bg-rose-50">
                {sprintf( /* translators: %d is the number of days a task is overdue, abbreviated (e.g. 45d). */ _n( '%dd', '%dd', t.days_overdue, 'wedevs-project-manager' ), t.days_overdue )}
              </Badge>
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
          {sprintf( /* translators: %d is the number of tasks not shown in the list. */ _n( 'View %d more', 'View %d more', hidden, 'wedevs-project-manager' ), hidden )}
        </button>
      )}
    </Card>
  )
}
