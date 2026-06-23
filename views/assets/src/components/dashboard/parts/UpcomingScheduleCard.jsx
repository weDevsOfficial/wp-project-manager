import { __ } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CircleDot } from 'lucide-react'
import { Card } from '@components/ui/card'

const PRIORITY = {
  0: 'hsl(220 9% 60%)',   // low
  1: 'hsl(38 92% 55%)',   // medium
  2: 'hsl(0 72% 60%)',    // high
}

export default function UpcomingScheduleCard({ items }) {
  const navigate = useNavigate()
  const list = items || []

  return (
    <Card className="p-5 border-pm-border flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-pm-text-primary flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-pm-text-muted" />
          {__('Upcoming Tasks', 'wedevs-project-manager')}
        </h3>
        <button
          className="text-[12px] text-pm-accent hover:underline"
          onClick={() => navigate('/my-tasks')}
        >
          {__('My tasks', 'wedevs-project-manager')}
        </button>
      </div>

      {list.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <CalendarDays className="w-8 h-8 text-pm-text-muted/40 mb-2" />
          <p className="text-[13px] text-pm-text-muted">
            {__('No upcoming tasks with a due date.', 'wedevs-project-manager')}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {list.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(`/projects/${t.project_id}/task-lists/tasks/${t.id}`)}
              className="w-full flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-pm-hover transition-colors text-left"
            >
              <CircleDot className="w-4 h-4 shrink-0" style={{ color: PRIORITY[t.priority] ?? PRIORITY[1] }} />
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
    </Card>
  )
}
