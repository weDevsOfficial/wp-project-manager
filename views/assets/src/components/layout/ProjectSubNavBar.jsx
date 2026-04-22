import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePermissions } from '@hooks/usePermissions'
import { useActiveProModules, isProModuleActive } from '@hooks/useActiveProModules'
import { useI18n } from '@hooks/useI18n'
import {
  LayoutList, Layout, MessageSquare, Milestone, FileText,
  Activity, Columns3, GitBranch, Receipt, Settings,
} from 'lucide-react'
import { cn } from '@lib/utils'
import ProBadge from '@components/common/ProBadge'

// ── Sub-nav item definitions (mirrors AppSidebar) ────

const SUB_NAV_FREE = [
  { key: 'task-lists',  label: 'Task Lists',  icon: LayoutList,    path: (pid) => `/projects/${pid}/task-lists` },
  { key: 'overview',    label: 'Overview',     icon: Layout,        path: (pid) => `/projects/${pid}/overview` },
  { key: 'discussions', label: 'Discussions',  icon: MessageSquare, path: (pid) => `/projects/${pid}/discussions` },
  { key: 'milestones',  label: 'Milestones',   icon: Milestone,     path: (pid) => `/projects/${pid}/milestones` },
  { key: 'files',       label: 'Files',        icon: FileText,      path: (pid) => `/projects/${pid}/files` },
]

function buildProSubNav(modulePaths) {
  const isActive = (dir) => isProModuleActive(modulePaths, dir)
  const items = []
  if (isActive('Kanboard')) items.push({ key: 'kanban',   label: 'Kanban Board', icon: Columns3,  path: (pid) => `/projects/${pid}/kanban` })
  if (isActive('Gantt'))    items.push({ key: 'gantt',    label: 'Gantt Chart',  icon: GitBranch, path: (pid) => `/projects/${pid}/gantt` })
  if (isActive('Invoice'))  items.push({ key: 'invoices', label: 'Invoices',     icon: Receipt,   path: (pid) => `/projects/${pid}/invoices` })
  items.push({ key: 'settings', label: 'Settings', icon: Settings, path: (pid) => `/projects/${pid}/settings` })
  return items
}

// ── Component ────────────────────────────────────────

export function ProjectSubNavBar() {
  const { isPro } = usePermissions()

  const activeModulePaths = useActiveProModules()
  const { __ } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()

  const [sidebarMode, setSidebarMode] = useState(
    () => localStorage.getItem('pm-sidebar-mode') ?? 'plugin'
  )

  useEffect(() => {
    const handler = (e) => setSidebarMode(e.detail)
    window.addEventListener('pm-sidebar-mode-change', handler)
    return () => window.removeEventListener('pm-sidebar-mode-change', handler)
  }, [])

  const activeProjectId = useMemo(() => {
    const m = location.pathname.match(/\/projects\/(\d+)/)
    return m ? parseInt(m[1], 10) : null
  }, [location.pathname])

  const subNav = useMemo(() => {
    if (isPro) return [...SUB_NAV_FREE, ...buildProSubNav(activeModulePaths)]
    return [
      ...SUB_NAV_FREE,
      { key: 'activities', label: 'Activities',  icon: Activity,     path: (pid) => `/projects/${pid}/activities`, proPreview: true },
      { key: 'kanban',   label: 'Kanban Board', icon: Columns3,  path: (pid) => `/projects/${pid}/kanban`,   proPreview: true },
      { key: 'gantt',    label: 'Gantt Chart',  icon: GitBranch, path: (pid) => `/projects/${pid}/gantt`,    proPreview: true },
      { key: 'invoices', label: 'Invoices',     icon: Receipt,   path: (pid) => `/projects/${pid}/invoices`, proPreview: true },
      { key: 'settings', label: 'Settings',     icon: Settings,  path: (pid) => `/projects/${pid}/settings`, proPreview: true },
    ]
  }, [isPro, activeModulePaths])

  const activeSubKey = useMemo(() => {
    if (!activeProjectId) return null
    const path = location.pathname
    for (const item of subNav) {
      if (path.includes(item.key)) return item.key
    }
    return 'task-lists'
  }, [location.pathname, activeProjectId, subNav])

  // Only render in WP sidebar mode when inside a project
  if (sidebarMode !== 'wordpress' || !activeProjectId) return null

  return (
    <div className="shrink-0 bg-white border-b border-pm-border">
      <nav className="flex items-stretch overflow-x-auto px-2 scrollbar-none">
        {subNav.map(item => {
          const Icon = item.icon
          const isActive = activeSubKey === item.key

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path(activeProjectId))}
              className={cn(
                'group/tab flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium whitespace-nowrap',
                'border-b-2 transition-colors shrink-0',
                isActive
                  ? 'border-pm-accent text-pm-accent'
                  : 'border-transparent text-pm-text-muted hover:text-pm-text hover:border-pm-border',
              )}
            >
              <Icon className={cn(
                'w-3.5 h-3.5 shrink-0',
                isActive ? 'text-pm-accent' : 'text-pm-text-muted group-hover/tab:text-pm-text',
              )} />
              {__(item.label)}
              {item.proPreview && (
                <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover/tab:max-w-fit group-hover/tab:ml-1 transition-all">
                  <ProBadge />
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
