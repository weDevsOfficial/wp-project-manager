import { __, sprintf, _n } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card } from '@components/ui/card'
import { Badge } from '@components/ui/badge'
import { cn } from '@lib/utils'

const PRIORITY_DOT = {
  high:   'bg-rose-500',
  medium: 'bg-amber-500',
  low:    'bg-slate-400',
}

export default function OverduePriorityCard({ items }) {
  const navigate = useNavigate()
  const list = items || []

  return (
    <Card className="p-5 border-pm-border flex flex-col h-full">
      <h3 className="text-[15px] font-semibold text-pm-text-primary flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-rose-500" />
        {__('Overdue & Priority', 'wedevs-project-manager')}
      </h3>

      {list.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
          <p className="text-[13px] text-pm-text-muted">{__('Nothing overdue — great work!', 'wedevs-project-manager')}</p>
        </div>
      ) : (
        <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pm-sidebar-scroll pr-1">
          {list.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(`/projects/${t.project_id}/task-lists/tasks/${t.id}`)}
              className="w-full flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-pm-hover transition-colors text-left"
            >
              <span className={cn('w-2 h-2 rounded-full shrink-0', PRIORITY_DOT[t.priority] || PRIORITY_DOT.medium)} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-pm-text-primary truncate">{t.title}</div>
                {t.project_title && <div className="text-[12px] text-pm-text-muted truncate">{t.project_title}</div>}
              </div>
              <Badge variant="outline" className="shrink-0 text-[11px] text-rose-600 border-rose-200 bg-rose-50">
                {sprintf( _n( '%dd', '%dd', t.days_overdue, 'wedevs-project-manager' ), t.days_overdue )}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </Card>
  )
}
