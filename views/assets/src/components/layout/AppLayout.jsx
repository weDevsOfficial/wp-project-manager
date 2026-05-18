import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { TopBar } from './TopBar'
import { ProjectSubNavBar } from './ProjectSubNavBar'

export function AppLayout() {
  useEffect(() => {
    document.body.classList.add('pm-fullscreen-settings')
    return () => document.body.classList.remove('pm-fullscreen-settings')
  }, [])

  return (
    <div className="pm-app-layout flex h-full overflow-hidden bg-pm-surface-muted">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <ProjectSubNavBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
