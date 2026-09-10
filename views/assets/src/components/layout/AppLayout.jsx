import { useEffect } from 'react'
import { PageTransition } from '@components/common/PageTransition'
import { AppSidebar } from './AppSidebar'
import { TopBar } from './TopBar'
import { ProjectSubNavBar } from './ProjectSubNavBar'
import { useLayoutFlags } from '@/router/routeRegistry'

export function AppLayout() {
  const { hideSidebar, hideSubNav } = useLayoutFlags()

  useEffect(() => {
    document.body.classList.add('pm-fullscreen-settings')
    return () => document.body.classList.remove('pm-fullscreen-settings')
  }, [])

  return (
    <div className="pm-app-layout flex h-full overflow-hidden bg-pm-surface-muted">
      {!hideSidebar && <AppSidebar />}
      <div className="flex-1 flex flex-col overflow-hidden m-2 rounded-xl border border-pm-border bg-pm-surface shadow-sm">
        <TopBar />
        {!hideSubNav && <ProjectSubNavBar />}
        <main className="flex-1 overflow-y-auto">
          <PageTransition />
        </main>
      </div>
    </div>
  )
}
