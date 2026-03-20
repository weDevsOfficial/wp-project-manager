import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApi } from '@hooks/useApi'
import { usePermissions } from '@hooks/usePermissions'
import ProBadge from '@components/common/ProBadge'
import { useI18n } from '@hooks/useI18n'
import {
  FolderKanban, CheckSquare, Calendar, BarChart3,
  Settings, ArrowLeft, PanelLeftClose, PanelLeftOpen,
  ChevronDown, Star, ListTodo, Layout, MessageSquare,
  Milestone, FileText, Activity, Tag, Crown, Layers,
  Columns3, GitBranch, Receipt, Timer, Shield, Wrench,
} from 'lucide-react'
import { cn } from '@lib/utils'

// ── Project sub-nav items ────────────────────────────

const projectSubNav_FREE = [
  { key: 'task-lists',   label: 'Task Lists',   icon: ListTodo,       path: (pid) => `/projects/${pid}/task-lists` },
  { key: 'overview',     label: 'Overview',      icon: Layout,         path: (pid) => `/projects/${pid}/overview` },
  { key: 'discussions',  label: 'Discussions',   icon: MessageSquare,  path: (pid) => `/projects/${pid}/discussions` },
  { key: 'milestones',   label: 'Milestones',    icon: Milestone,      path: (pid) => `/projects/${pid}/milestones` },
  { key: 'files',        label: 'Files',         icon: FileText,       path: (pid) => `/projects/${pid}/files` },
  { key: 'activities',   label: 'Activities',    icon: Activity,       path: (pid) => `/projects/${pid}/activities` },
]

// Pro sub-nav items — filtered by active modules at runtime
function getProSubNav() {
  const modules = (typeof PM_Pro_Vars !== 'undefined' && Array.isArray(PM_Pro_Vars.active_modules))
    ? PM_Pro_Vars.active_modules.map(m => typeof m === 'string' ? m : (m.path || ''))
    : []
  const isActive = (dir) => modules.some(m => m.startsWith(dir + '/') || m === dir)

  const items = []
  if (isActive('Kanboard'))  items.push({ key: 'kanban',   label: 'Kanban Board', icon: Columns3,  path: (pid) => `/projects/${pid}/kanban` })
  if (isActive('Gantt'))     items.push({ key: 'gantt',    label: 'Gantt Chart',  icon: GitBranch,  path: (pid) => `/projects/${pid}/gantt` })
  if (isActive('Invoice'))   items.push({ key: 'invoices', label: 'Invoices',     icon: Receipt,    path: (pid) => `/projects/${pid}/invoices` })
  // Settings always available when pro is active
  items.push({ key: 'settings', label: 'Settings', icon: Settings, path: (pid) => `/projects/${pid}/settings` })
  return items
}

const PROJECT_SUB_NAV_PRO = getProSubNav()

// ── Truncated text helper ────────────────────────────
// A flex-1 span that always truncates. Uses a wrapper div
// with overflow:hidden so it works reliably inside any flex parent,
// regardless of WordPress admin CSS overrides.

function TruncText({ children, className }) {
  return (
    <div className="flex-1 min-w-0 overflow-hidden">
      <div className={cn('truncate', className)}>{children}</div>
    </div>
  )
}

// ── Main component ───────────────────────────────────

export function AppSidebar() {
  const { isAdmin, isPro } = usePermissions()
  const { __ } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const api      = useApi()

  // Merge free + pro sub-nav items
  const projectSubNav = useMemo(() => {
    return isPro
      ? [...projectSubNav_FREE, ...PROJECT_SUB_NAV_PRO]
      : projectSubNav_FREE
  }, [isPro])

  // Sidebar keeps its own project list — independent of ProjectsPage Redux filters
  const [sidebarProjects, setSidebarProjects] = useState([])

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('pm-sidebar-collapsed') === 'true'
  )
  const [expandedProjects, setExpandedProjects] = useState(new Set())
  const [showFavourites, setShowFavourites] = useState(true)
  const [sidebarMode, setSidebarMode] = useState(
    localStorage.getItem('pm-sidebar-mode') ?? 'plugin'
  )

  // Listen for mode changes from TopBar
  useEffect(() => {
    const handler = (e) => setSidebarMode(e.detail)
    window.addEventListener('pm-sidebar-mode-change', handler)
    return () => window.removeEventListener('pm-sidebar-mode-change', handler)
  }, [])

  // Apply mode on mount
  useEffect(() => {
    if (sidebarMode === 'wordpress') {
      document.body.classList.add('pm-mode-wordpress')
    }
    return () => {
      document.body.classList.remove('pm-mode-wordpress')
    }
  }, [])

  function toggleCollapse() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('pm-sidebar-collapsed', String(next))
  }

  // Fetch ALL projects for sidebar (never affected by page filters)
  useEffect(() => {
    api.get('projects', {
      per_page: 100,
      select: 'id, title, status',
      with: 'assignees',
    })
      .then(res => setSidebarProjects(res.data ?? []))
      .catch(() => {})
  }, [])

  // Detect active project from URL and auto-expand it
  const activeProjectId = useMemo(() => {
    const match = location.pathname.match(/\/projects\/(\d+)/)
    return match ? parseInt(match[1], 10) : null
  }, [location.pathname])

  // ── Recent Projects — track last 5 visited projects ──
  const [recentProjectIds, setRecentProjectIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pm-recent-projects') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    if (activeProjectId) {
      setExpandedProjects(new Set([activeProjectId]))

      // Add to recent projects (move to front, max 5, no duplicates)
      setRecentProjectIds(prev => {
        const updated = [activeProjectId, ...prev.filter(id => id !== activeProjectId)].slice(0, 5)
        localStorage.setItem('pm-recent-projects', JSON.stringify(updated))
        return updated
      })
    }
  }, [activeProjectId])

  const recentProjects = useMemo(() => {
    if (!recentProjectIds.length || !sidebarProjects.length) return []
    return recentProjectIds
      .map(id => sidebarProjects.find(p => p.id === id))
      .filter(Boolean)
  }, [recentProjectIds, sidebarProjects])

  const [showRecent, setShowRecent] = useState(true)

  const activeSubKey = useMemo(() => {
    if (!activeProjectId) return null
    const path = location.pathname
    for (const item of projectSubNav) {
      if (path.includes(item.key)) return item.key
    }
    return 'task-lists'
  }, [location.pathname, activeProjectId])

  function toggleProject(id) {
    setExpandedProjects(prev => {
      if (prev.has(id)) return new Set()
      return new Set([id])
    })
  }

  const favouriteProjects = useMemo(
    () => sidebarProjects.filter(p => p.favourite),
    [sidebarProjects],
  )

  const topNavItems = useMemo(() => [
    { key: 'projects', label: __('Projects'), icon: FolderKanban, route: '/projects' },
    { key: 'my-tasks', label: __('My Tasks'), icon: CheckSquare,  route: '/my-tasks' },
  ], [__])

  const viewNavItems = useMemo(() => {
    const items = [
      { key: 'calendar',  label: __('Calendar'),  icon: Calendar,  route: '/calendar',  pro: !isPro },
      { key: 'progress',  label: __('Progress'),  icon: Activity,  route: '/progress',  pro: !isPro },
      { key: 'reports',   label: __('Reports'),   icon: BarChart3, route: '/reports',   pro: !isPro },
    ]
    if (isPro) {
      items.push(
        { key: 'sprints', label: __('Sprints'), icon: Timer,  route: '/sprints' },
        { key: 'license', label: __('License'), icon: Shield, route: '/license' },
      )
    }
    return items
  }, [__, isPro])

  const activeKey = useMemo(() => {
    const path = location.pathname
    if (path.startsWith('/modules')) return 'modules'
    if (path.startsWith('/premium')) return 'premium'
    if (path.startsWith('/categories')) return 'categories'
    if (path.startsWith('/settings')) return 'settings'
    if (path.startsWith('/projects')) return 'projects'
    if (path.startsWith('/my-tasks')) return 'my-tasks'
    if (path.startsWith('/calendar')) return 'calendar'
    if (path.startsWith('/progress')) return 'progress'
    if (path.startsWith('/reports'))  return 'reports'
    if (path.startsWith('/sprints'))  return 'sprints'
    if (path.startsWith('/license'))  return 'license'
    return 'projects'
  }, [location.pathname])

  function goBack() {
    document.body.classList.remove('pm-fullscreen-settings')
    window.location.href = PM_Vars.ajax_url?.replace('admin-ajax.php', '') ?? '/wp-admin/'
  }

  // ── Render helpers ──────────────────────────────────

  function renderNavItem(item) {
    if (item.adminOnly && !isAdmin) return null
    const Icon = item.icon
    const isActive = activeKey === item.key && !activeProjectId

    return (
      <button
        key={item.key}
        className={cn(
          'w-full flex items-center min-w-0 rounded-md transition-colors text-left mb-0.5',
          collapsed ? 'justify-center px-0 py-2' : 'gap-2.5 px-2.5 py-[7px]',
          isActive
            ? 'bg-pm-accent/10 text-pm-accent font-medium'
            : 'text-pm-text-muted hover:bg-pm-hover hover:text-pm-text',
        )}
        title={item.label}
        onClick={() => navigate(item.route)}
      >
        <Icon className={cn('shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4', isActive ? 'text-pm-accent' : 'text-pm-text-muted')} />
        {!collapsed && <TruncText className="text-[13px]">{item.label}</TruncText>}
        {!collapsed && item.pro && <span className="shrink-0"><ProBadge /></span>}
      </button>
    )
  }

  function renderProjectItem(project) {
    const isExpanded = expandedProjects.has(project.id)
    const isActive = activeProjectId === project.id
    const color = project.color_code || 'hsl(var(--primary))'

    return (
      <div key={project.id} className="mb-0.5">
        {/* Project row */}
        <button
          className={cn(
            'w-full flex items-center min-w-0 rounded-md transition-colors text-left',
            collapsed ? 'justify-center px-0 py-2' : 'gap-1.5 pl-2 pr-1.5 py-[6px]',
            isActive
              ? 'bg-pm-accent/5 text-pm-text-primary'
              : 'text-pm-text-muted hover:bg-pm-hover hover:text-pm-text',
          )}
          title={project.title}
          onClick={() => {
            if (collapsed) {
              navigate(`/projects/${project.id}/task-lists`)
              return
            }
            toggleProject(project.id)
            if (!isExpanded) navigate(`/projects/${project.id}/task-lists`)
          }}
        >
          {!collapsed && (
            <ChevronDown
              className="h-3 w-3 shrink-0 text-pm-text-muted/50 transition-transform duration-200"
              style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
            />
          )}
          <span
            className="h-2 w-2 rounded-sm shrink-0"
            style={{ backgroundColor: color }}
          />
          {!collapsed && (
            <>
              <TruncText className={cn('text-[13px]', isActive && 'font-medium')}>
                {project.title}
              </TruncText>
              {project.favourite && (
                <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
              )}
            </>
          )}
        </button>

        {/* Sub-nav (expanded, not collapsed) */}
        {isExpanded && !collapsed && (
          <div className="ml-5 pl-2.5 border-l border-border/50 mt-0.5 mb-1 space-y-0.5">
            {projectSubNav.map(sub => {
              const SubIcon = sub.icon
              const subActive = isActive && activeSubKey === sub.key

              return (
                <button
                  key={sub.key}
                  className={cn(
                    'w-full flex items-center min-w-0 gap-2 rounded-md px-2 py-[5px] text-left transition-colors',
                    subActive
                      ? 'bg-pm-accent/10 text-pm-accent font-medium'
                      : 'text-pm-text-muted hover:bg-pm-hover hover:text-pm-text',
                  )}
                  onClick={() => navigate(sub.path(project.id))}
                >
                  <SubIcon className={cn('h-3.5 w-3.5 shrink-0', subActive ? 'text-pm-accent' : 'text-pm-text-muted/70')} />
                  <TruncText className="text-[12px]">{__(sub.label)}</TruncText>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // ── Main render ─────────────────────────────────────

  const sidebarWidth = sidebarMode === 'wordpress' ? 0 : (collapsed ? 56 : 240)

  return (
    <aside
      className={cn(
        'shrink-0 bg-white border-r border-pm-border flex flex-col transition-all duration-200',
        sidebarMode === 'wordpress' && 'overflow-hidden'
      )}
      style={{ width: sidebarWidth, minWidth: sidebarWidth, maxWidth: sidebarWidth }}
    >
      {sidebarMode === 'wordpress' ? (
        /* Hidden in WP mode — toggle is in TopBar */
        null
      ) : (
      <>
      {/* Header */}
      <div className={cn('pt-3 pb-2', collapsed ? 'px-2' : 'px-4')}>
        <div className={cn('flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && (
            <button
              className="flex items-center gap-1.5 text-xs text-pm-text-muted hover:text-pm-accent transition-colors"
              onClick={goBack}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {__('Back to WP Admin')}
            </button>
          )}
          <button
            className="p-1 rounded hover:bg-pm-hover text-pm-text-muted hover:text-pm-text transition-colors"
            title={collapsed ? __('Expand sidebar') : __('Collapse sidebar')}
            onClick={toggleCollapse}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>
        {!collapsed && (
          <h1 className="text-pm-text font-semibold text-base mt-2">
            {__('Project Manager')}
          </h1>
        )}
      </div>

      {/* Scrollable nav — overflow-y for scroll, overflow-x hidden to contain content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <nav className={cn('pb-4 pt-1', collapsed ? 'px-1.5' : 'px-3')}>
          {/* Main nav */}
          <div className="mb-3">
            {!collapsed && (
              <p className="text-[11px] font-medium text-pm-text-muted uppercase tracking-wider px-2 mb-1.5">
                {__('Workspace')}
              </p>
            )}
            {topNavItems.map(renderNavItem)}
          </div>

          {/* Favourites */}
          {favouriteProjects.length > 0 && (
            <div className="mb-3">
              {!collapsed ? (
                <button
                  className="w-full flex items-center justify-between px-2 mb-1.5 group/sec"
                  onClick={() => setShowFavourites(v => !v)}
                >
                  <p className="text-[11px] font-medium text-pm-text-muted uppercase tracking-wider">
                    {__('Favourites')}
                  </p>
                  <ChevronDown className="h-3 w-3 text-pm-text-muted/40 transition-transform duration-200" style={{ transform: showFavourites ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                </button>
              ) : (
                <div className="border-t border-pm-border my-2 mx-1" />
              )}
              {showFavourites && favouriteProjects.map(renderProjectItem)}
            </div>
          )}

          {/* Recent Projects */}
          {recentProjects.length > 0 && (
            <div className="mb-3">
              {!collapsed ? (
                <button
                  className="w-full flex items-center justify-between px-2 mb-1.5 group/sec"
                  onClick={() => setShowRecent(v => !v)}
                >
                  <p className="text-[11px] font-medium text-pm-text-muted uppercase tracking-wider">
                    {__('Recent')}
                  </p>
                  <ChevronDown className="h-3 w-3 text-pm-text-muted/40 transition-transform duration-200" style={{ transform: showRecent ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                </button>
              ) : (
                <div className="border-t border-pm-border my-2 mx-1" />
              )}
              {showRecent && recentProjects.map(renderProjectItem)}
            </div>
          )}

          {/* Views */}
          <div className="mb-3">
            {!collapsed ? (
              <p className="text-[11px] font-medium text-pm-text-muted uppercase tracking-wider px-2 mb-1.5">
                {__('Views')}
              </p>
            ) : (
              <div className="border-t border-pm-border my-2 mx-1" />
            )}
            {viewNavItems.map(renderNavItem)}
          </div>

          {/* Modules + Premium */}
          <div className="mb-3">
            {!collapsed ? (
              <p className="text-[11px] font-medium text-pm-text-muted uppercase tracking-wider px-2 mb-1.5">
                {__('Modules')}
              </p>
            ) : (
              <div className="border-t border-pm-border my-2 mx-1" />
            )}
            {renderNavItem({ key: 'modules', label: __('Modules'), icon: Layers, route: '/modules' })}
            {!isPro && (
              collapsed ? (
                <button
                  className="w-full flex justify-center py-2 text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                  title={__('Upgrade to Pro')}
                  onClick={() => navigate('/premium')}
                >
                  <Crown className="w-5 h-5" />
                </button>
              ) : (
                <button
                  className="w-full flex items-center min-w-0 gap-2.5 rounded-md px-2.5 py-[7px] text-left mb-0.5 transition-colors text-orange-500 hover:bg-orange-50"
                  onClick={() => navigate('/premium')}
                >
                  <Crown className="w-4 h-4 shrink-0" />
                  <TruncText className="text-[13px] font-medium">{__('Upgrade to Pro')}</TruncText>
                </button>
              )
            )}
          </div>

          {/* Admin */}
          {isAdmin && (
            <div className="mb-3">
              {!collapsed ? (
                <p className="text-[11px] font-medium text-pm-text-muted uppercase tracking-wider px-2 mb-1.5">
                  {__('Administration')}
                </p>
              ) : (
                <div className="border-t border-pm-border my-2 mx-1" />
              )}
              {renderNavItem({ key: 'categories', label: __('Categories'), icon: Tag, route: '/categories', adminOnly: true })}
              {renderNavItem({ key: 'settings', label: __('Settings'), icon: Settings, route: '/settings', adminOnly: true })}
              {renderNavItem({ key: 'importtools', label: __('Tools'), icon: Wrench, route: '/importtools', adminOnly: true })}
            </div>
          )}
        </nav>
      </div>

      {/* Footer */}
      <div className={cn('border-t border-pm-border py-3', collapsed ? 'px-2' : 'px-4')}>
        {collapsed ? (
          <button
            className="w-full flex justify-center p-1 rounded hover:bg-pm-hover text-pm-text-muted hover:text-pm-accent transition-colors"
            title={__('Back to WP Admin')}
            onClick={goBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <p className="text-[11px] text-pm-text-muted">WP Project Manager</p>
        )}
      </div>
      </>
      )}
    </aside>
  )
}
