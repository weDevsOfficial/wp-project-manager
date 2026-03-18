import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'

export function AppLayout() {
  useEffect(() => {
    document.body.classList.add('pm-fullscreen-settings')
    return () => document.body.classList.remove('pm-fullscreen-settings')
  }, [])

  return (
    <div className="pm-app-layout flex h-screen overflow-hidden bg-pm-surface-muted">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
