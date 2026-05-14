import { __ } from '@wordpress/i18n';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useApi } from '@hooks/useApi'
import { usePermissions } from '@hooks/usePermissions'
import { useActiveProModules, isProModuleActive, isProPluginInstalled } from '@hooks/useActiveProModules'
import ProBadge from '@components/common/ProBadge'
import {
  FolderKanban, CheckSquare, Calendar, BarChart3,
  Settings, ArrowLeft, PanelLeftClose, PanelLeftOpen,
  ChevronDown, Star, LayoutList, Layout, MessageSquare,
  Milestone, FileText, Activity, Tag, Crown, Layers,
  Columns3, GitBranch, Receipt, Timer, Shield, Wrench,
} from 'lucide-react'
import { cn } from '@lib/utils'

function statusColor(p) {
  const s = p.status
  if (s === 'complete' || s === '1' || s === 1) return '#10b981'
  if (s === 'archived' || s === '2' || s === 2) return '#6b7280'
  if (s === 'pending' || s === '3' || s === 3) return '#f59e0b'
  return '#6366f1'
}

// ── Project sub-nav items (moved inside component for i18n — see getProjectSubNav_FREE / getProSubNav below) ──

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
  const { isAdmin, isPro, canManage, canManageLicense, isManagerAnywhere } = usePermissions()
  const isFrontend = typeof PM_Vars !== 'undefined' && PM_Vars.is_frontend && !PM_Vars.is_admin

  // ── Project sub-nav items — inside component so __() is extractable by make-pot ──
  const projectSubNav_FREE = useMemo(() => [
    { key: 'task-lists',   label: __('Task Lists', 'wedevs-project-manager'),   icon: LayoutList,     path: (pid) => `/projects/${pid}/task-lists` },
    { key: 'overview',     label: __('Overview', 'wedevs-project-manager'),      icon: Layout,         path: (pid) => `/projects/${pid}/overview` },
    { key: 'discussions',  label: __('Discussions', 'wedevs-project-manager'),   icon: MessageSquare,  path: (pid) => `/projects/${pid}/discussions` },
    { key: 'milestones',   label: __('Milestones', 'wedevs-project-manager'),    icon: Milestone,      path: (pid) => `/projects/${pid}/milestones` },
    { key: 'files',        label: __('Files', 'wedevs-project-manager'),         icon: FileText,       path: (pid) => `/projects/${pid}/files` },
  ], [__])

  // Pro sub-nav items — filtered by the provided active module paths
  const getProSubNav = useCallback((modulePaths) => {
    const isActive = (dir) => isProModuleActive(modulePaths, dir)
    const items = []
    // Activities is not a module, always show when pro is active
    items.push({ key: 'activities', label: __('Activities', 'wedevs-project-manager'),    icon: Activity,   path: (pid) => `/projects/${pid}/activities` })
    if (isActive('Kanboard'))  items.push({ key: 'kanban',   label: __('Kanban Board', 'wedevs-project-manager'), icon: Columns3,  path: (pid) => `/projects/${pid}/kanban` })
    if (isActive('Gantt'))     items.push({ key: 'gantt',    label: __('Gantt Chart', 'wedevs-project-manager'),  icon: GitBranch,  path: (pid) => `/projects/${pid}/gantt` })
    const canSeeManagerItems = canManage || isManagerAnywhere
    if (isActive('Invoice') && canSeeManagerItems) items.push({ key: 'invoices', label: __('Invoices', 'wedevs-project-manager'),     icon: Receipt,    path: (pid) => `/projects/${pid}/invoices` })
    if (canSeeManagerItems) items.push({ key: 'settings', label: __('Settings', 'wedevs-project-manager'), icon: Settings, path: (pid) => `/projects/${pid}/settings` })
    return items
  }, [__, canManage, isManagerAnywhere])
  const location = useLocation()
  const navigate = useNavigate()
  const api      = useApi()

  const activeModulePaths = useActiveProModules()

  // Merge free + pro sub-nav items — reactive via activeModulePaths.
  // When pro is off, show Activities/Kanban/Gantt/Invoice/Settings as pro previews.
  const projectSubNav = useMemo(() => {
    if (isPro) return [...projectSubNav_FREE, ...getProSubNav(activeModulePaths)]
    const proItems = [
      { key: 'activities', label: __('Activities', 'wedevs-project-manager'),    icon: Activity,   path: (pid) => `/projects/${pid}/activities`, proPreview: true },
      { key: 'kanban',   label: __('Kanban Board', 'wedevs-project-manager'), icon: Columns3,  path: (pid) => `/projects/${pid}/kanban`,   proPreview: true },
      { key: 'gantt',    label: __('Gantt Chart', 'wedevs-project-manager'),  icon: GitBranch,  path: (pid) => `/projects/${pid}/gantt`,    proPreview: true },
    ]
    if (canManage || isManagerAnywhere) {
      proItems.push({ key: 'invoices', label: __('Invoices', 'wedevs-project-manager'),     icon: Receipt,    path: (pid) => `/projects/${pid}/invoices`, proPreview: true })
      proItems.push({ key: 'settings', label: __('Settings', 'wedevs-project-manager'),     icon: Settings,   path: (pid) => `/projects/${pid}/settings`, proPreview: true })
    }
    return [...projectSubNav_FREE, ...proItems]
  }, [isPro, activeModulePaths, canManage, isManagerAnywhere])

  // Sidebar keeps its own project list — independent of ProjectsPage Redux filters
  const [sidebarProjects, setSidebarProjects] = useState([])

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('pm-sidebar-collapsed') === 'true'
  )
  const [expandedProjects, setExpandedProjects] = useState(new Set())
  const [showFavourites, setShowFavourites] = useState(true)
  const [sidebarMode, setSidebarMode] = useState(
    () => isFrontend ? 'plugin' : (localStorage.getItem('pm-sidebar-mode') ?? 'wordpress')
  )

  // Listen for mode changes from TopBar
  useEffect(() => {
    const handler = (e) => setSidebarMode(e.detail)
    window.addEventListener('pm-sidebar-mode-change', handler)
    return () => window.removeEventListener('pm-sidebar-mode-change', handler)
  }, [])

  // Frontend should always use plugin sidebar mode.
  useEffect(() => {
    if (!isFrontend) return
    localStorage.setItem('pm-sidebar-mode', 'plugin')
    if (sidebarMode !== 'plugin') {
      setSidebarMode('plugin')
    }
    document.body.classList.remove('pm-mode-wordpress')
  }, [isFrontend, sidebarMode])

  // Apply mode on mount
  useEffect(() => {
    if (sidebarMode === 'wordpress') {
      document.body.classList.add('pm-mode-wordpress')
    } else {
      document.body.classList.remove('pm-mode-wordpress')
    }
    return () => {
      document.body.classList.remove('pm-mode-wordpress')
    }
  }, [sidebarMode])

  function toggleCollapse() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('pm-sidebar-collapsed', String(next))
  }

  // Fetch ALL projects for sidebar (never affected by page filters)
  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      let page = 1
      let all = []
      try {
        while (true) {
          const res = await api.get('projects', {
            per_page: 100,
            page,
            select: 'id, title, status, favourite, color_code',
            with: 'assignees',
          })
          const data = res.data ?? []
          all = all.concat(data)
          if (data.length < 100) break
          page++
        }
      } catch { /* ignore */ }
      if (!cancelled) setSidebarProjects(all)
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  // Detect active project from URL and auto-expand it
  const activeProjectId = useMemo(() => {
    const match = location.pathname.match(/^\/projects\/(\d+)/)
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
      .filter(p => p && !p.favourite)
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
    { key: 'projects', label: __('Projects', 'wedevs-project-manager'), short: __('Proj', 'wedevs-project-manager'), icon: FolderKanban, route: '/projects' },
    { key: 'my-tasks', label: __('My Tasks', 'wedevs-project-manager'), short: __('Tasks', 'wedevs-project-manager'), icon: CheckSquare,  route: '/my-tasks' },
  ], [__])

  // Pro plugin installed (pm-pro.js loaded) — may or may not be licensed
  const isProInstalled = isProPluginInstalled()

  const viewNavItems = useMemo(() => {
    const isModuleActive = (dir) => isProModuleActive(activeModulePaths, dir)
    const items = [
      { key: 'calendar', label: __('Calendar', 'wedevs-project-manager'), short: __('Cal', 'wedevs-project-manager'),     icon: Calendar,      route: '/calendar', pro: !isPro },
      { key: 'progress', label: __('Progress', 'wedevs-project-manager'), short: __('Prog', 'wedevs-project-manager'),    icon: Activity,      route: '/progress', pro: !isPro },
      { key: 'reports',  label: __('Reports', 'wedevs-project-manager'),  short: __('Rep', 'wedevs-project-manager'),     icon: BarChart3,     route: '/reports',  pro: !isPro },
    ]
    // Non-pro: show as upgrade preview only to users who could use it (managers/admins).
    // Pro: only show when the Sprint module is active, and only to managers/admins.
    if (canManage || isManagerAnywhere) {
      if (!isPro || isModuleActive('Sprint')) {
        items.push({ key: 'sprints', label: __('Sprints', 'wedevs-project-manager'), short: __('Sprint', 'wedevs-project-manager'), icon: Timer, route: '/sprints', pro: !isPro })
      }
    }
    return items
  }, [__, isPro, activeModulePaths, canManage, isManagerAnywhere])

  // Auto-collapse sidebar on full-width pages (reports, calendar, progress, sprints)
  const autoCollapsedRef = useRef(false)
  const prevPathnameRef = useRef(location.pathname)
  useEffect(() => {
    const prevPath = prevPathnameRef.current
    const currPath = location.pathname
    prevPathnameRef.current = currPath

    const fullWidthPages = ['reports', 'calendar', 'progress', 'sprints']
    const isFullWidth = fullWidthPages.some(p => currPath.startsWith(`/${p}`))

    if (prevPath === currPath) {
      // Initial mount — auto-collapse if landing on a full-width page
      if (isFullWidth && !collapsed) {
        autoCollapsedRef.current = true
        setCollapsed(true)
      }
      return
    }

    const wasFullWidth = fullWidthPages.some(p => prevPath.startsWith(`/${p}`))

    if (isFullWidth && !wasFullWidth && !collapsed) {
      autoCollapsedRef.current = true
      setCollapsed(true)
    } else if (!isFullWidth && wasFullWidth && autoCollapsedRef.current) {
      autoCollapsedRef.current = false
      setCollapsed(false)
    }
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

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
    if (path.startsWith('/importtools')) return 'importtools'
    if (path.startsWith('/license')) return 'license'
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
      <Link
        key={item.key}
        to={item.route}
        className={cn(
          'w-full flex items-center min-w-0 rounded-md transition-colors text-left mb-0.5 group/nav',
          collapsed ? 'flex-col justify-center px-0 py-1.5 gap-0.5' : 'gap-2.5 px-2.5 py-[7px]',
          isActive
            ? 'bg-pm-accent/10 text-pm-accent font-medium'
            : 'text-pm-text-muted hover:bg-pm-hover hover:text-pm-text',
        )}
        title={item.label}
      >
        <Icon className={cn('shrink-0', collapsed ? 'w-[18px] h-[18px]' : 'w-[18px] h-[18px]', isActive ? 'text-pm-accent' : 'text-pm-text-muted')} />
        {collapsed
          ? <span className={cn('text-[10px] font-medium leading-none', isActive ? 'text-pm-accent' : 'text-pm-text-muted')}>{item.short ?? item.label}</span>
          : <TruncText className="text-[15px]">{item.label}</TruncText>
        }
        {!collapsed && item.pro && <span className="shrink-0 opacity-0 group-hover/nav:opacity-100 transition-opacity"><ProBadge /></span>}
      </Link>
    )
  }

  function renderProjectItem(project) {
    const isExpanded = expandedProjects.has(project.id)
    const isActive = activeProjectId === project.id
    const color = project.color_code || statusColor(project)

    return (
      <div key={project.id} className="mb-0.5">
        {/* Project row */}
        <button
          className={cn(
            'w-full flex items-center min-w-0 rounded-md transition-colors text-left',
            collapsed ? 'flex-col justify-center px-0 py-1.5 gap-0.5' : 'gap-1.5 pl-2 pr-1.5 py-[6px]',
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
              className="h-3.5 w-3.5 shrink-0 text-pm-text-muted/50 transition-transform duration-200"
              style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
            />
          )}
          <span
            className={cn('rounded-sm shrink-0', collapsed ? 'h-3 w-3' : 'h-2 w-2')}
            style={{ backgroundColor: color }}
          />
          {collapsed
            ? <span className="text-[10px] font-medium leading-none text-pm-text-muted w-full text-center truncate px-0.5">
                {project.title.substring(0, 4)}
              </span>
            : <>
                <TruncText className={cn('text-[15px]', isActive && 'font-medium')}>
                  {project.title}
                </TruncText>
                {project.favourite && (
                  <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                )}
              </>
          }
        </button>

        {/* Sub-nav (expanded, not collapsed) */}
        {isExpanded && !collapsed && (
          <div className="ml-5 pl-2.5 border-l border-border/50 mt-0.5 mb-1 space-y-0.5">
            {projectSubNav.map(sub => {
              const SubIcon = sub.icon
              const subActive = isActive && activeSubKey === sub.key

              return (
                <Link
                  key={sub.key}
                  to={sub.path(project.id)}
                  className={cn(
                    'w-full flex items-center min-w-0 gap-2 rounded-md px-2 py-[5px] text-left transition-colors group/sub',
                    subActive
                      ? 'bg-pm-accent/10 text-pm-accent font-medium'
                      : 'text-pm-text-muted hover:bg-pm-hover hover:text-pm-text',
                  )}
                >
                  <SubIcon className={cn('h-4 w-4 shrink-0', subActive ? 'text-pm-accent' : 'text-pm-text-muted/70')} />
                  <TruncText className="text-[14px]">{sub.label}</TruncText>
                  {sub.proPreview && <span className="shrink-0 opacity-0 group-hover/sub:opacity-100 transition-opacity"><ProBadge /></span>}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // ── Main render ─────────────────────────────────────

  const sidebarWidth = sidebarMode === 'wordpress' ? 0 : (collapsed ? 64 : 240)

  return (
    <aside
      className={cn(
        'shrink-0 bg-pm-surface border-r border-pm-border flex flex-col transition-all duration-200',
        sidebarMode === 'wordpress' && 'overflow-hidden',
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
              className="flex items-center gap-1.5 text-sm text-pm-text-muted hover:text-pm-accent transition-colors"
              onClick={goBack}
            >
              <ArrowLeft className="w-4 h-4" />
              {__('Back to WP Admin', 'wedevs-project-manager')}
            </button>
          )}
          <div className="flex items-center gap-0.5">
            <button
              className="p-1 rounded hover:bg-pm-hover text-pm-text-muted hover:text-pm-text transition-colors"
              title={collapsed ? __('Expand sidebar', 'wedevs-project-manager') : __('Collapse sidebar', 'wedevs-project-manager')}
              onClick={toggleCollapse}
            >
              {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {!collapsed && (
          <h1 className="text-pm-text font-semibold text-base mt-2">
            {__('Project Manager', 'wedevs-project-manager')}
          </h1>
        )}
      </div>

      {/* Scrollable nav — overflow-y for scroll, overflow-x hidden to contain content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pm-sidebar-scroll">
        <nav className={cn('pb-4 pt-1', collapsed ? 'px-1.5' : 'px-3')}>
          {/* Main nav */}
          <div className="mb-3">
            {!collapsed && (
              <p className="text-[14px] font-medium text-pm-text-muted uppercase tracking-wider px-2 mb-1.5">
                {__('Workspace', 'wedevs-project-manager')}
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
                  <p className="text-[14px] font-medium text-pm-text-muted uppercase tracking-wider">
                    {__('Favourites', 'wedevs-project-manager')}
                  </p>
                  <ChevronDown className="h-3.5 w-3.5 text-pm-text-muted/40 transition-transform duration-200" style={{ transform: showFavourites ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
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
                  <p className="text-[14px] font-medium text-pm-text-muted uppercase tracking-wider">
                    {__('Recent', 'wedevs-project-manager')}
                  </p>
                  <ChevronDown className="h-3.5 w-3.5 text-pm-text-muted/40 transition-transform duration-200" style={{ transform: showRecent ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
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
              <p className="text-[14px] font-medium text-pm-text-muted uppercase tracking-wider px-2 mb-1.5">
                {__('Views', 'wedevs-project-manager')}
              </p>
            ) : (
              <div className="border-t border-pm-border my-2 mx-1" />
            )}
            {viewNavItems.map(renderNavItem)}
          </div>

          {/* Modules + Premium */}
          {!isFrontend && (
          <div className="mb-3">
            {!collapsed ? (
              <p className="text-[14px] font-medium text-pm-text-muted uppercase tracking-wider px-2 mb-1.5">
                {__('Modules', 'wedevs-project-manager')}
              </p>
            ) : (
              <div className="border-t border-pm-border my-2 mx-1" />
            )}
            {renderNavItem({ key: 'modules', label: __('Modules', 'wedevs-project-manager'), icon: Layers, route: '/modules', pro: !isPro })}
            {!isPro && (
              collapsed ? (
                <button
                  className="w-full flex justify-center py-2 text-pm-accent hover:bg-pm-accent/5 rounded-md transition-colors"
                  title={__('Upgrade to Pro', 'wedevs-project-manager')}
                  onClick={() => navigate('/premium')}
                >
                  <Crown className="w-5 h-5" />
                </button>
              ) : (
                <button
                  className="w-full flex items-center min-w-0 gap-2.5 rounded-md px-2.5 py-[7px] text-left mb-0.5 transition-colors text-pm-accent hover:bg-pm-accent/5"
                  onClick={() => navigate('/premium')}
                >
                  <Crown className="w-5 h-5 shrink-0" />
                  <TruncText className="text-[15px] font-medium">{__('Upgrade to Pro', 'wedevs-project-manager')}</TruncText>
                </button>
              )
            )}
          </div>
          )}

          {/* Admin */}
          {isAdmin && (
            <div className="mb-3">
              {!collapsed ? (
                <p className="text-[14px] font-medium text-pm-text-muted uppercase tracking-wider px-2 mb-1.5">
                  {__('Administration', 'wedevs-project-manager')}
                </p>
              ) : (
                <div className="border-t border-pm-border my-2 mx-1" />
              )}
              {/* Categories available in both wp-admin AND frontend for admins */}
              {renderNavItem({ key: 'categories', label: __('Categories', 'wedevs-project-manager'), short: __('Cat', 'wedevs-project-manager'),   icon: Tag,     route: '/categories', adminOnly: true })}
              {/* Settings / Tools / License remain wp-admin-only */}
              {!isFrontend && renderNavItem({ key: 'settings',   label: __('Settings', 'wedevs-project-manager'),   short: __('Set', 'wedevs-project-manager'),   icon: Settings, route: '/settings',   adminOnly: true })}
              {!isFrontend && renderNavItem({ key: 'importtools', label: __('Tools', 'wedevs-project-manager'),     short: __('Tools', 'wedevs-project-manager'), icon: Wrench,  route: '/importtools', adminOnly: true })}
              {!isFrontend && isProInstalled && canManageLicense && renderNavItem({ key: 'license', label: __('License', 'wedevs-project-manager'), short: __('Lic', 'wedevs-project-manager'), icon: Shield, route: '/license' })}
            </div>
          )}
        </nav>
      </div>

      {/* Footer */}
      {!isFrontend && (
        <div className={cn('border-t border-pm-border py-3', collapsed ? 'px-2' : 'px-4')}>
          {collapsed ? (
            <button
              className="w-full flex justify-center p-1 rounded hover:bg-pm-hover text-pm-text-muted hover:text-pm-accent transition-colors"
              title={__('Back to WP Admin', 'wedevs-project-manager')}
              onClick={goBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex justify-center px-2">
              <img
                src={`${typeof PM_Vars !== 'undefined' ? PM_Vars.dir_url : '/wp-content/plugins/wedevs-project-manager/'}views/assets/images/pm-logo.svg`}
                alt="WP Project Manager"
                className="h-6 opacity-60"
              />
            </div>
          )}
        </div>
      )}
      </>
      )}
    </aside>
  )
}
