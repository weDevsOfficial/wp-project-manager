import { __ } from '@wordpress/i18n';
import { useMemo, useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@store/index'
import { fetchTask, openTaskSheet } from '@store/tasksSlice'
import { useApi } from '@hooks/useApi'
import { useCurrentProject } from '@hooks/useCurrentProject'
import { usePermissions } from '@hooks/usePermissions'
import { UserAvatar } from '@components/common/UserAvatar'
import { Button } from '@components/ui/button'
import {
  Dialog,
  DialogContent,
} from '@components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/ui/command'
import {
  ChevronRight,
  Search,
  Bell,
  FolderKanban,
  CheckSquare,
  LayoutList,
  Loader2,
  LayoutDashboard,
  Monitor,
  Lightbulb,
  Megaphone,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@lib/utils'
import { formatPmDateTime } from '@lib/pm-utils'

export function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const api = useApi()

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ projects: [], tasks: [], taskLists: [] })
  const [searching, setSearching] = useState(false)

  const isFrontendPage = typeof PM_Vars !== 'undefined' && PM_Vars.is_frontend && !PM_Vars.is_admin

  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-pm-theme') === 'dark'
  )
  function toggleDarkMode() {
    const next = !isDark
    setIsDark(next)
    window.PM.setDarkMode(next)
  }

  const [sidebarMode, setSidebarMode] = useState(
    () => isFrontendPage ? 'plugin' : (localStorage.getItem('pm-sidebar-mode') ?? 'wordpress')
  )

  const toggleSidebarMode = useCallback(() => {
    const next = sidebarMode === 'plugin' ? 'wordpress' : 'plugin'
    setSidebarMode(next)
    localStorage.setItem('pm-sidebar-mode', next)
    if (next === 'wordpress') {
      document.body.classList.add('pm-mode-wordpress')
    } else {
      document.body.classList.remove('pm-mode-wordpress')
    }
    // Dispatch custom event so AppSidebar picks up the change
    window.dispatchEvent(new CustomEvent('pm-sidebar-mode-change', { detail: next }))
  }, [sidebarMode])

  // Sync body class with sidebar mode
  useEffect(() => {
    if (isFrontendPage) {
      document.body.classList.remove('pm-mode-wordpress')
    } else if (sidebarMode === 'wordpress') {
      document.body.classList.add('pm-mode-wordpress')
    } else {
      document.body.classList.remove('pm-mode-wordpress')
    }
  }, [isFrontendPage, sidebarMode])

  // Listen for mode changes dispatched by other components
  useEffect(() => {
    const handler = (e) => setSidebarMode(e.detail)
    window.addEventListener('pm-sidebar-mode-change', handler)
    return () => window.removeEventListener('pm-sidebar-mode-change', handler)
  }, [])

  const activeProjectId = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    return parts[0] === 'projects' && parts[1] ? parts[1] : null
  }, [location.pathname])

  const activeProject = useCurrentProject(activeProjectId)

  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifLoading, setNotifLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Keyboard shortcut: Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Search handler
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query)
    if (query.trim().length < 2) {
      setSearchResults({ projects: [], tasks: [], taskLists: [] })
      return
    }
    setSearching(true)
    try {
      const [topbarRes, taskRes] = await Promise.all([
        api.get('admin-topbar-search', { query: query.trim() }),
        api.get('tasks', { title: query.trim(), per_page: 5 }),
      ])
      const topbarItems = Array.isArray(topbarRes) ? topbarRes : []
      const projects  = topbarItems.filter(i => i.type === 'project').slice(0, 5)
      const taskLists = topbarItems.filter(i => i.type === 'task_list').slice(0, 5)
      const tasks = (taskRes.data ?? []).slice(0, 5)
      setSearchResults({ projects, tasks, taskLists })
    } catch {
      setSearchResults({ projects: [], tasks: [], taskLists: [] })
    }
    setSearching(false)
  }, [api])

  // Fetch recent activities as notifications (no dedicated notifications endpoint)
  useEffect(() => {
    if (!notifOpen) return
    setNotifLoading(true)
    api.get('activities', { per_page: 20 })
      .then(res => {
        setNotifications(res.data ?? [])
        setUnreadCount(0)
      })
      .catch(() => setNotifications([]))
      .finally(() => setNotifLoading(false))
  }, [notifOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Build breadcrumb from URL
  // Translatable breadcrumb labels — ensures make-pot can extract them
  const BREADCRUMB_LABELS = useMemo(() => ({
    'task-lists':  __('Task Lists', 'wedevs-project-manager'),
    'overview':    __('Overview', 'wedevs-project-manager'),
    'discussions': __('Discussions', 'wedevs-project-manager'),
    'milestones':  __('Milestones', 'wedevs-project-manager'),
    'files':       __('Files', 'wedevs-project-manager'),
    'activities':  __('Activities', 'wedevs-project-manager'),
    'kanban':      __('Kanban Board', 'wedevs-project-manager'),
    'gantt':       __('Gantt Chart', 'wedevs-project-manager'),
    'invoices':    __('Invoices', 'wedevs-project-manager'),
    'settings':    __('Settings', 'wedevs-project-manager'),
    'my-tasks':    __('My Tasks', 'wedevs-project-manager'),
    'projects':    __('Projects', 'wedevs-project-manager'),
    'categories':  __('Categories', 'wedevs-project-manager'),
    'calendar':    __('Calendar', 'wedevs-project-manager'),
    'reports':     __('Reports', 'wedevs-project-manager'),
    'progress':    __('Progress', 'wedevs-project-manager'),
    'sprints':     __('Sprints', 'wedevs-project-manager'),
    'modules':     __('Modules', 'wedevs-project-manager'),
    'premium':     __('Premium', 'wedevs-project-manager'),
    'license':     __('License', 'wedevs-project-manager'),
  }), [__])

  const breadcrumbs = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    const crumbs = [{ label: BREADCRUMB_LABELS['projects'] || __('Projects', 'wedevs-project-manager'), path: '/projects' }]

    if (parts[0] === 'projects' && parts[1]) {
      const projectLabel = activeProject?.title
        ? `#${parts[1]} · ${activeProject.title}`
        : `#${parts[1]}`
      crumbs.push({ label: projectLabel, path: `/projects/${parts[1]}/task-lists` })
      if (parts[2]) {
        const section = BREADCRUMB_LABELS[parts[2]] ?? parts[2].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        crumbs.push({ label: section, path: location.pathname })
      }
    } else if (parts[0] === 'my-tasks') {
      crumbs.push({ label: BREADCRUMB_LABELS['my-tasks'] || __('My Tasks', 'wedevs-project-manager'), path: '/my-tasks' })
    } else if (parts[0] === 'settings') {
      crumbs.push({ label: BREADCRUMB_LABELS['settings'] || __('Settings', 'wedevs-project-manager'), path: '/settings' })
    } else if (parts[0] === 'categories') {
      crumbs.push({ label: BREADCRUMB_LABELS['categories'] || __('Categories', 'wedevs-project-manager'), path: '/categories' })
    } else if (parts[0] === 'reports') {
      crumbs.push({ label: BREADCRUMB_LABELS['reports'] || __('Reports', 'wedevs-project-manager'), path: '/reports' })
      if (parts[1] === 'report-summary') {
        crumbs.push({ label: __('Summary Report', 'wedevs-project-manager'), path: location.pathname })
      }
    } else if (parts[0] === 'calendar') {
      crumbs.push({ label: BREADCRUMB_LABELS['calendar'] || __('Calendar', 'wedevs-project-manager'), path: '/calendar' })
    } else if (parts[0] === 'sprints') {
      crumbs.push({ label: BREADCRUMB_LABELS['sprints'] || __('Sprints', 'wedevs-project-manager'), path: '/sprints' })
    } else if (parts[0] === 'modules') {
      crumbs.push({ label: BREADCRUMB_LABELS['modules'] || __('Modules', 'wedevs-project-manager'), path: '/modules' })
    } else if (parts[0] === 'premium') {
      crumbs.push({ label: BREADCRUMB_LABELS['premium'] || __('Premium', 'wedevs-project-manager'), path: '/premium' })
    } else if (parts[0] === 'license') {
      crumbs.push({ label: BREADCRUMB_LABELS['license'] || __('License', 'wedevs-project-manager'), path: '/license' })
    } else if (parts[0]) {
      const label = BREADCRUMB_LABELS[parts[0]] ?? parts[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      crumbs.push({ label, path: `/${parts[0]}` })
    }

    return crumbs
  }, [location.pathname, __, BREADCRUMB_LABELS])

  const currentUser = typeof PM_Vars !== 'undefined' ? PM_Vars.current_user : null
  const isFrontend = typeof PM_Vars !== 'undefined' && PM_Vars.is_frontend && !PM_Vars.is_admin
  const hasResults = searchResults.projects.length > 0 || searchResults.tasks.length > 0 || searchResults.taskLists.length > 0

  return (
    <>
      <div className="h-12 border-b border-pm-border bg-pm-surface flex items-center px-2 sm:px-4 gap-2 sm:gap-3 shrink-0">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-pm-text-muted/50 shrink-0" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-sm font-medium text-pm-text-primary truncate">{crumb.label}</span>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(crumb.path)}
                  className="text-sm text-pm-text-muted hover:text-pm-accent transition-colors truncate"
                >
                  {crumb.label}
                </button>
              )}
            </span>
          ))}
        </nav>

        {/* Search trigger — icon on mobile, full button on desktop */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden shrink-0"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5 text-pm-text-muted" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-sm gap-1.5 text-pm-text-muted font-normal hidden md:flex"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          {__('Search...', 'wedevs-project-manager')}
          <kbd className="ml-2 text-[14px] bg-muted px-1 py-0.5 rounded font-mono">⌘K</kbd>
        </Button>

        {/* Share Your Idea */}
        <a
          href="https://pm.canny.io/ideas"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1 text-sm text-pm-text-muted hover:text-pm-accent transition-colors shrink-0"
          title={__('Share your idea', 'wedevs-project-manager')}
        >
          <Lightbulb className="h-4 w-4" />
        </a>

        {/* What's New (Headway) */}
        <span
          className="relative shrink-0 inline-flex items-center p-1 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent transition-colors cursor-pointer"
          id="pm-headway-icon"
          role="button"
          tabIndex={0}
          title={__("What's New", 'wedevs-project-manager')}
          onClick={(e) => {
            e.stopPropagation()
            if (typeof window.Headway !== 'undefined') {
              try {
                window.Headway.toggle(e.nativeEvent)
              } catch (err) {
                console.warn('[PM] Headway toggle failed:', err)
              }
            }
          }}
        >
          <Megaphone className="h-5 w-5 pointer-events-none" />
        </span>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8 relative shrink-0" onClick={() => setNotifOpen(true)}>
          <Bell className="h-5 w-5 text-pm-text-muted" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] flex items-center justify-center rounded-full bg-destructive text-[11px] text-white font-bold px-1">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* Dark mode toggle */}
        <button
          type="button"
          className="p-1 rounded hover:bg-pm-hover text-pm-text-muted hover:text-pm-text transition-colors shrink-0"
          title={isDark ? __('Switch to light mode', 'wedevs-project-manager') : __('Switch to dark mode', 'wedevs-project-manager')}
          onClick={toggleDarkMode}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Sidebar mode toggle — admin only (no WP sidebar on frontend), hidden on mobile */}
        {!isFrontend && (
          <div className="flex items-center gap-0.5 bg-muted/60 rounded-md p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => sidebarMode !== 'plugin' && toggleSidebarMode()}
              className={cn(
                'p-1.5 rounded transition-colors',
                sidebarMode === 'plugin' ? 'bg-background shadow-sm text-pm-accent' : 'text-pm-text-muted hover:text-pm-text'
              )}
              title={__('Plugin sidebar', 'wedevs-project-manager')}
            >
              <LayoutDashboard className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => sidebarMode !== 'wordpress' && toggleSidebarMode()}
              className={cn(
                'p-1.5 rounded transition-colors',
                sidebarMode === 'wordpress' ? 'bg-background shadow-sm text-pm-accent' : 'text-pm-text-muted hover:text-pm-text'
              )}
              title={__('WordPress sidebar', 'wedevs-project-manager')}
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* User avatar */}
        {currentUser && (
          <UserAvatar
            user={{
              avatar_url: currentUser.data?.avatar_url || currentUser.avatar_url || (typeof PM_Vars !== 'undefined' ? PM_Vars.avatar_url : ''),
              display_name: currentUser.data?.display_name || currentUser.display_name || currentUser.data?.user_login || 'U',
            }}
            size="md"
          />
        )}
      </div>

      {/* ── Search Dialog (Ctrl+K) ── */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[480px] p-0 gap-0 overflow-hidden" data-pm-dialog>
          <Command shouldFilter={false} className="rounded-lg">
            <CommandInput
              placeholder={__('Search projects and tasks...', 'wedevs-project-manager')}
              value={searchQuery}
              onValueChange={handleSearch}
            />
            <CommandList className="max-h-[320px]">
              {searching && (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{__('Searching...', 'wedevs-project-manager')}
                </div>
              )}
              {!searching && searchQuery.trim().length >= 2 && !hasResults && (
                <CommandEmpty>{__('No results found', 'wedevs-project-manager')}</CommandEmpty>
              )}
              {searchResults.projects.length > 0 && (
                <CommandGroup heading={__('Projects', 'wedevs-project-manager')}>
                  {searchResults.projects.map(p => (
                    <CommandItem
                      key={`p-${p.id}`}
                      value={`project-${p.id}`}
                      onSelect={() => { navigate(`/projects/${p.id}/task-lists`); setSearchOpen(false); setSearchQuery('') }}
                      className="cursor-pointer"
                    >
                      <FolderKanban className="h-4 w-4 mr-2 text-pm-text-muted" />
                      <span className="text-sm truncate">{p.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {searchResults.taskLists.length > 0 && (
                <CommandGroup heading={__('Task Lists', 'wedevs-project-manager')}>
                  {searchResults.taskLists.map(l => (
                    <CommandItem
                      key={`tl-${l.id}`}
                      value={`tasklist-${l.id}`}
                      onSelect={() => { navigate(`/projects/${l.project_id}/task-lists/${l.id}`); setSearchOpen(false); setSearchQuery('') }}
                      className="cursor-pointer"
                    >
                      <LayoutList className="h-4 w-4 mr-2 text-pm-text-muted" />
                      <span className="text-sm truncate">{l.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {searchResults.tasks.length > 0 && (
                <CommandGroup heading={__('Tasks', 'wedevs-project-manager')}>
                  {searchResults.tasks.map(t => (
                    <CommandItem
                      key={`t-${t.id}`}
                      value={`task-${t.id}`}
                      onSelect={() => {
                        const rawList = t.task_list_id
                        const listId = rawList?.data?.id ?? rawList?.id ?? rawList ?? null
                        const projectId = t.project_id
                        setSearchOpen(false)
                        setSearchQuery('')
                        const target = listId
                          ? `/projects/${projectId}/task-lists/${listId}`
                          : `/projects/${projectId}/task-lists`
                        navigate(target)
                        dispatch(openTaskSheet({ ...t, project_id: projectId, task_list_id: listId }))
                      }}
                      className="cursor-pointer"
                    >
                      <CheckSquare className="h-4 w-4 mr-2 text-pm-text-muted" />
                      <span className="text-sm truncate">{t.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* ── Notifications Sheet ── */}
      <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[380px] p-0 gap-0 flex flex-col h-full">
          <SheetHeader className="px-5 py-4 border-b shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-pm-accent" />
              {__('Notifications', 'wedevs-project-manager')}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto min-h-0">
            {notifLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-pm-text-muted">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />{__('Loading...', 'wedevs-project-manager')}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <Bell className="h-10 w-10 text-pm-text-muted/30 mb-3" />
                <p className="text-sm text-pm-text-muted">{__('No notifications yet', 'wedevs-project-manager')}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(n => {
                  // Parse {{placeholder}} templates in activity messages
                  let msg = n.message || n.description || n.title || __('Activity', 'wedevs-project-manager')
                  if (typeof msg === 'string') {
                    msg = msg.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
                      const val = path.split('.').reduce((o, k) => o?.[k], n)
                      return val != null ? String(val) : ''
                    })
                  }
                  const actor = n.actor?.data || n.actor || {}
                  return (
                    <div key={n.id} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                      {actor.avatar_url ? (
                        <img src={actor.avatar_url} className="h-7 w-7 rounded-full shrink-0 mt-0.5" alt="" />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-muted shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-pm-text-primary leading-relaxed">{msg}</p>
                        {n.created_at && (
                          <p className="text-[13px] text-pm-text-muted mt-0.5">{formatPmDateTime(n.created_at)}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
