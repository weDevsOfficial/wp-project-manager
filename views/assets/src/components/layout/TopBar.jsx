import { useMemo, useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { usePermissions } from '@hooks/usePermissions'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
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
  Loader2,
  LayoutDashboard,
  Monitor,
  Lightbulb,
  Megaphone,
} from 'lucide-react'
import { cn } from '@lib/utils'
import { userInitials, formatPmDateTime } from '@lib/pm-utils'

export function TopBar() {
  const { __ } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const api = useApi()

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ projects: [], tasks: [] })
  const [searching, setSearching] = useState(false)

  const isFrontendPage = typeof PM_Vars !== 'undefined' && PM_Vars.is_frontend && !PM_Vars.is_admin
  const [sidebarMode, setSidebarMode] = useState(
    () => isFrontendPage ? 'plugin' : (localStorage.getItem('pm-sidebar-mode') ?? 'plugin')
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

  // Frontend: always force plugin sidebar mode, remove WP sidebar class
  useEffect(() => {
    if (isFrontendPage) {
      document.body.classList.remove('pm-mode-wordpress')
    }
  }, [isFrontendPage])

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
      setSearchResults({ projects: [], tasks: [] })
      return
    }
    setSearching(true)
    try {
      // Search projects
      const projRes = await api.get('projects', { search: query.trim(), per_page: 5 })
      const projects = projRes.data ?? []

      // Search tasks
      const taskRes = await api.get('tasks', { title: query.trim(), per_page: 5 })
      const tasks = taskRes.data ?? []

      setSearchResults({ projects, tasks })
    } catch {
      setSearchResults({ projects: [], tasks: [] })
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
    'task-lists':  __('Task Lists'),
    'overview':    __('Overview'),
    'discussions': __('Discussions'),
    'milestones':  __('Milestones'),
    'files':       __('Files'),
    'activities':  __('Activities'),
    'kanban':      __('Kanban Board'),
    'gantt':       __('Gantt Chart'),
    'invoices':    __('Invoices'),
    'settings':    __('Settings'),
    'my-tasks':    __('My Tasks'),
    'projects':    __('Projects'),
    'categories':  __('Categories'),
    'calendar':    __('Calendar'),
    'reports':     __('Reports'),
    'progress':    __('Progress'),
    'sprints':     __('Sprints'),
    'modules':     __('Modules'),
    'premium':     __('Premium'),
    'license':     __('License'),
  }), [__])

  const breadcrumbs = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    const crumbs = [{ label: BREADCRUMB_LABELS['projects'] || __('Projects'), path: '/projects' }]

    if (parts[0] === 'projects' && parts[1]) {
      crumbs.push({ label: `#${parts[1]}`, path: `/projects/${parts[1]}/task-lists` })
      if (parts[2]) {
        const section = BREADCRUMB_LABELS[parts[2]] ?? parts[2].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        crumbs.push({ label: section, path: location.pathname })
      }
    } else if (parts[0] === 'my-tasks') {
      crumbs.push({ label: BREADCRUMB_LABELS['my-tasks'] || __('My Tasks'), path: '/my-tasks' })
    } else if (parts[0] === 'settings') {
      crumbs.push({ label: BREADCRUMB_LABELS['settings'] || __('Settings'), path: '/settings' })
    } else if (parts[0] === 'categories') {
      crumbs.push({ label: BREADCRUMB_LABELS['categories'] || __('Categories'), path: '/categories' })
    } else if (parts[0] === 'reports') {
      crumbs.push({ label: BREADCRUMB_LABELS['reports'] || __('Reports'), path: '/reports' })
      if (parts[1] === 'report-summary') {
        crumbs.push({ label: __('Summary Report'), path: location.pathname })
      }
    } else if (parts[0] === 'calendar') {
      crumbs.push({ label: BREADCRUMB_LABELS['calendar'] || __('Calendar'), path: '/calendar' })
    } else if (parts[0] === 'sprints') {
      crumbs.push({ label: BREADCRUMB_LABELS['sprints'] || __('Sprints'), path: '/sprints' })
    } else if (parts[0] === 'modules') {
      crumbs.push({ label: BREADCRUMB_LABELS['modules'] || __('Modules'), path: '/modules' })
    } else if (parts[0] === 'premium') {
      crumbs.push({ label: BREADCRUMB_LABELS['premium'] || __('Premium'), path: '/premium' })
    } else if (parts[0] === 'license') {
      crumbs.push({ label: BREADCRUMB_LABELS['license'] || __('License'), path: '/license' })
    } else if (parts[0]) {
      const label = BREADCRUMB_LABELS[parts[0]] ?? parts[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      crumbs.push({ label, path: `/${parts[0]}` })
    }

    return crumbs
  }, [location.pathname, __, BREADCRUMB_LABELS])

  const currentUser = typeof PM_Vars !== 'undefined' ? PM_Vars.current_user : null
  const isFrontend = typeof PM_Vars !== 'undefined' && PM_Vars.is_frontend && !PM_Vars.is_admin
  const hasResults = searchResults.projects.length > 0 || searchResults.tasks.length > 0

  return (
    <>
      <div className="h-12 border-b border-pm-border bg-white flex items-center px-2 sm:px-4 gap-2 sm:gap-3 shrink-0">
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
          {__('Search...')}
          <kbd className="ml-2 text-[14px] bg-muted px-1 py-0.5 rounded font-mono">⌘K</kbd>
        </Button>

        {/* Share Your Idea */}
        <a
          href="https://pm.canny.io/ideas"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1 text-sm text-pm-text-muted hover:text-pm-accent transition-colors shrink-0"
          title={__('Share your idea')}
        >
          <Lightbulb className="h-4 w-4" />
        </a>

        {/* What's New (Headway) */}
        <span
          className="relative shrink-0 inline-flex items-center p-1 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent transition-colors cursor-pointer"
          id="pm-headway-icon"
          role="button"
          tabIndex={0}
          title={__("What's New")}
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
              title={__('Plugin sidebar')}
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
              title={__('WordPress sidebar')}
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* User avatar */}
        {currentUser && (
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={currentUser.data?.avatar_url || currentUser.avatar_url || (typeof PM_Vars !== 'undefined' ? PM_Vars.avatar_url : '')} />
            <AvatarFallback className="text-[14px]">
              {userInitials(currentUser.data?.display_name || currentUser.display_name || currentUser.data?.user_login || 'U')}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* ── Search Dialog (Ctrl+K) ── */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[480px] p-0 gap-0 overflow-hidden" data-pm-dialog>
          <Command shouldFilter={false} className="rounded-lg">
            <CommandInput
              placeholder={__('Search projects and tasks...')}
              value={searchQuery}
              onValueChange={handleSearch}
            />
            <CommandList className="max-h-[320px]">
              {searching && (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{__('Searching...')}
                </div>
              )}
              {!searching && searchQuery.trim().length >= 2 && !hasResults && (
                <CommandEmpty>{__('No results found')}</CommandEmpty>
              )}
              {searchResults.projects.length > 0 && (
                <CommandGroup heading={__('Projects')}>
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
              {searchResults.tasks.length > 0 && (
                <CommandGroup heading={__('Tasks')}>
                  {searchResults.tasks.map(t => (
                    <CommandItem
                      key={`t-${t.id}`}
                      value={`task-${t.id}`}
                      onSelect={() => { navigate(`/projects/${t.project_id}/task-lists`); setSearchOpen(false); setSearchQuery('') }}
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
              {__('Notifications')}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto min-h-0">
            {notifLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-pm-text-muted">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />{__('Loading...')}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <Bell className="h-10 w-10 text-pm-text-muted/30 mb-3" />
                <p className="text-sm text-pm-text-muted">{__('No notifications yet')}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(n => {
                  // Parse {{placeholder}} templates in activity messages
                  let msg = n.message || n.description || n.title || __('Activity')
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
