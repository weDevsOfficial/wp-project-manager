import { __ } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { Plus, CheckSquare, Flag } from 'lucide-react'
import { Button } from '@components/ui/button'
import { UserAvatar } from '@components/common/UserAvatar'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return __('Good morning', 'wedevs-project-manager')
  if (h < 18) return __('Good afternoon', 'wedevs-project-manager')
  return __('Good evening', 'wedevs-project-manager')
}

export default function DashboardHeader({ user, canCreate }) {
  const navigate = useNavigate()
  const name = user?.name || ''
  const firstName = name.split(' ')[0]

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {user && (
          <UserAvatar
            user={{ id: user.id, display_name: user.name, avatar_url: user.avatar_url }}
            size="xl"
            className="w-12 h-12 shrink-0"
            fallbackClassName="bg-violet-100 text-violet-700"
          />
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-pm-text-primary truncate">
            {greeting()}{firstName ? `, ${firstName}` : ''} 👋
          </h1>
          <p className="text-[13px] text-pm-text-muted">
            {user?.role_label ? `${user.role_label} · ` : ''}{today}
          </p>
        </div>
      </div>

      {canCreate && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/my-tasks')} className="gap-1.5">
            <CheckSquare className="w-4 h-4" />
            {__('New Task', 'wedevs-project-manager')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/projects')} className="gap-1.5 hidden sm:inline-flex">
            <Flag className="w-4 h-4" />
            {__('Milestone', 'wedevs-project-manager')}
          </Button>
          <Button size="sm" onClick={() => navigate('/projects')} className="gap-1.5">
            <Plus className="w-4 h-4" />
            {__('New Project', 'wedevs-project-manager')}
          </Button>
        </div>
      )}
    </div>
  )
}
