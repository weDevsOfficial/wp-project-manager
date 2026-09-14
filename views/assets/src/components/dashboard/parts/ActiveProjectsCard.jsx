import { __ } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { FolderKanban } from 'lucide-react'
import { Card } from '@components/ui/card'
import { Progress } from '@components/ui/progress'
import { Badge } from '@components/ui/badge'
import { cn } from '@lib/utils'
import { CardHead, CardAction, EmptyState } from './CardShell'

export default function ActiveProjectsCard({ projects }) {
  const navigate = useNavigate()
  const list = projects || []

  return (
    <Card className="rounded-xl p-5 border-pm-border flex flex-col h-full">
      <CardHead
        icon={FolderKanban}
        title={__('Active Projects', 'wedevs-project-manager')}
        action={<CardAction onClick={() => navigate('/projects')}>{__('View all', 'wedevs-project-manager')}</CardAction>}
      />

      {list.length === 0 ? (
        <EmptyState icon={FolderKanban}>{__('No active projects. Create one to start tracking work.', 'wedevs-project-manager')}</EmptyState>
      ) : (
        <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pm-sidebar-scroll pr-1">
          {list.map(p => (
            <button
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}/task-lists`)}
              className="w-full text-left group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: p.color || 'rgb(var(--pm-accent-rgb))' }} />
                <span className="text-[14px] font-medium text-pm-text-primary truncate flex-1 group-hover:text-pm-accent transition-colors">
                  {p.title}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    'shrink-0 text-[11px] font-medium border',
                    p.risk === 'at_risk'
                      ? 'text-rose-600 border-rose-200 bg-rose-50'
                      : 'text-emerald-600 border-emerald-200 bg-emerald-50',
                  )}
                >
                  {p.risk === 'at_risk' ? __('At Risk', 'wedevs-project-manager') : __('On Track', 'wedevs-project-manager')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={p.progress} className="h-1.5 flex-1" />
                <span className="text-[12px] font-medium text-pm-text-muted w-9 text-right">{p.progress}%</span>
              </div>
              <div className="text-[11px] text-pm-text-muted mt-1">
                {p.completed}/{p.total} {__('tasks', 'wedevs-project-manager')}
                {p.overdue > 0 && <span className="text-rose-500"> · {p.overdue} {__('overdue', 'wedevs-project-manager')}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </Card>
  )
}
