import { __ } from '@wordpress/i18n'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ListPlus, Flag } from 'lucide-react'
import { useAppDispatch } from '@store/index'
import { setCreateSheetOpen, fetchCategories, fetchRoles } from '@store/projectsSlice'
import { usePermissions } from '@hooks/usePermissions'
import { Button } from '@components/ui/button'
import { UserAvatar } from '@components/common/UserAvatar'
import NewTaskSheet from '@components/my-tasks/MyTasksPage/parts/NewTaskSheet'
import { ProjectCreateSheet } from '@components/projects/ProjectCreateSheet'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return __('Good morning', 'wedevs-project-manager')
  if (h < 18) return __('Good afternoon', 'wedevs-project-manager')
  return __('Good evening', 'wedevs-project-manager')
}

export default function DashboardHeader({ user, onTaskCreated }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { canCreate, canManage, isManagerAnywhere } = usePermissions()
  const canManageMilestone = canManage || isManagerAnywhere
  const [newTaskOpen, setNewTaskOpen] = useState(false)

  const openNewProject = () => {
    // ProjectsPage normally loads these on mount; fetch here so the
    // create sheet's category/role dropdowns aren't empty when opened cold.
    dispatch(fetchCategories())
    dispatch(fetchRoles())
    dispatch(setCreateSheetOpen(true))
  }
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

      <div className="flex items-center gap-2">
        {/* New Task — any user, matches MyTasksPage (ungated) */}
        <Button variant="outline" size="sm" onClick={() => setNewTaskOpen(true)} className="gap-1.5">
          <ListPlus className="w-4 h-4" />
          {__('New Task', 'wedevs-project-manager')}
        </Button>
        {/* Milestone — manager only; creation is project-scoped, so route to projects */}
        {canManageMilestone && (
          <Button variant="outline" size="sm" onClick={() => navigate('/projects')} className="gap-1.5 hidden sm:inline-flex">
            <Flag className="w-4 h-4" />
            {__('Milestone', 'wedevs-project-manager')}
          </Button>
        )}
        {/* New Project — admin/manager only, opens the shared ProjectCreateSheet */}
        {canCreate && (
          <Button size="sm" onClick={openNewProject} className="gap-1.5">
            <Plus className="w-4 h-4" />
            {__('New Project', 'wedevs-project-manager')}
          </Button>
        )}
      </div>

      <NewTaskSheet
        open={newTaskOpen}
        onOpenChange={setNewTaskOpen}
        userId={user?.id}
        onCreated={() => { setNewTaskOpen(false); onTaskCreated?.() }}
      />
      {canCreate && <ProjectCreateSheet />}
    </div>
  )
}
