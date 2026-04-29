import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useI18n } from '@hooks/useI18n'
import { usePermissions } from '@hooks/usePermissions'
import { cn } from '@lib/utils'
import { UserAvatar } from '@components/common/UserAvatar'
import { AppSidebar } from '@components/layout/AppSidebar'
import {
  FolderKanban, CheckSquare, Calendar, BarChart3,
  Menu, X, LogOut, Crown,
} from 'lucide-react'

const currentUser = typeof PM_Vars !== 'undefined' ? PM_Vars.current_user : {}

// Navigation items for frontend (no Settings, Tools, Categories, Modules)
function getNavItems(isPro) {
  const items = [
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/my-tasks', label: 'My Tasks', icon: CheckSquare },
  ]
  if (isPro) {
    items.push(
      { path: '/calendar', label: 'Calendar', icon: Calendar },
      { path: '/reports', label: 'Reports', icon: BarChart3 },
    )
  }
  items.push({ path: '/premium', label: 'Upgrade', icon: Crown, hideWhenPro: true })
  return items
}

export function FrontendLayout() {
  const { __ } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const { isPro } = usePermissions()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = getNavItems(isPro).filter(item => !(item.hideWhenPro && isPro))
  const userName = currentUser?.data?.display_name || currentUser?.display_name || 'User'
  const userAvatar = currentUser?.data?.avatar_url || currentUser?.avatar_url || ''

  const isActive = (path) => location.pathname.startsWith(path) || location.hash?.includes(path)

  return (
    <div className="min-h-screen bg-pm-surface-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-pm-surface border-b border-pm-border shadow-sm">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo + Nav */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                className="flex items-center gap-2 font-bold text-pm-text-primary"
                onClick={() => navigate('/projects')}
              >
                <FolderKanban className="h-5 w-5 text-pm-accent" />
                <span className="text-sm">{__('Project Manager')}</span>
              </button>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(item => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        active
                          ? 'bg-pm-accent/10 text-pm-accent'
                          : 'text-pm-text-muted hover:text-pm-text-primary hover:bg-muted/50'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {__(item.label)}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Right side — user menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <UserAvatar user={{ avatar_url: userAvatar, display_name: userName }} size="md" fallbackClassName="bg-pm-accent/10 text-pm-accent" />
                <span className="text-sm font-medium text-pm-text-primary">{userName}</span>
              </div>
              <a
                href={typeof PM_Vars !== 'undefined' ? (PM_Vars.logout_url || '/wp-login.php?action=logout') : '/wp-login.php?action=logout'}
                className="p-1.5 rounded-md text-pm-text-muted hover:text-pm-text-primary hover:bg-muted/50 transition-colors"
                title={__('Logout')}
              >
                <LogOut className="h-5 w-5" />
              </a>

              {/* Mobile menu toggle */}
              <button
                type="button"
                className="md:hidden p-1.5 rounded-md text-pm-text-muted hover:bg-muted/50"
                onClick={() => setMobileMenuOpen(v => !v)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-3 border-t border-border/30 pt-2 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => { navigate(item.path); setMobileMenuOpen(false) }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left',
                      active ? 'bg-pm-accent/10 text-pm-accent' : 'text-pm-text-muted hover:bg-muted/50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {__(item.label)}
                  </button>
                )
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Sidebar + Main content */}
      <div className="flex min-h-[calc(100vh-56px)]">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
