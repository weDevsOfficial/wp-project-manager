import { __ } from '@wordpress/i18n';
import React, { useMemo, lazy, Suspense } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePermissions } from '@hooks/usePermissions'
import ProBadge from '@components/common/ProBadge'
import ProFeaturePlaceholder from '@components/common/ProFeaturePlaceholder'
import { cn } from '@lib/utils'
import { useFilter } from '@hooks/useSlot'
import { Settings, Mail, ListTodo, Bot, Radio, FileText, ShoppingCart } from 'lucide-react'
import { DriveMonoGlyph as GoogleWorkspaceNavIcon } from '@components/google-workspace/GoogleIcons'

// Brand SVG icons for settings nav (not available as non-deprecated lucide icons)
const GitHubNavIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
)
const NotionNavIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L2.451 2.577c-.466.046-.56.28-.374.466l2.382 1.165zM5.251 7.26v13.932c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V7.307c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.747.327-.747.933zm14.336.42c.094.42 0 .84-.42.886l-.7.14v10.264c-.607.327-1.167.514-1.634.514-.747 0-.933-.234-1.494-.933l-4.577-7.186v6.953l1.447.327s0 .84-1.167.84l-3.22.187c-.093-.187 0-.653.327-.747l.84-.22V9.854L7.822 9.76c-.094-.42.14-1.027.747-1.073l3.454-.234 4.764 7.28V9.527l-1.214-.14c-.093-.513.28-.886.747-.933l3.267-.187z" />
  </svg>
)
const LoomNavIcon = (props) => (
  <svg viewBox="0 0 62 62" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M62,27.6H43.9l15.7-9.1l-3.4-6l-15.7,9.1l9.1-15.7l-6-3.5l-9.1,15.7V0h-6.9v18.1L18.5,2.4l-6,3.4l9.1,15.7L5.9,12.5l-3.4,6l15.7,9.1H0v6.9h18.1L2.4,43.5l3.4,6l15.7-9.1l-9.1,15.7l6,3.4l9.1-15.7V62h6.9V43.9l9.1,15.7l6-3.4l-9.1-15.7l15.7,9.1l3.4-6l-15.7-9.1H62L62,27.6L62,27.6z M31,40.4c-5.2,0-9.4-4.2-9.4-9.4c0-5.2,4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4C40.4,36.2,36.2,40.4,31,40.4z" />
  </svg>
)

// ── Lazy-loaded tab components ───────────────────────────────
const GeneralTab    = lazy(() => import('./tabs/GeneralTab'))
const EmailTab      = lazy(() => import('./tabs/EmailTab'))
const TaskTypesTab  = lazy(() => import('./tabs/TaskTypesTab'))
const PusherTab     = lazy(() => import('./tabs/PusherTab'))
const AiSettingsTab      = lazy(() => import('./tabs/AiSettingsTab'))
const GitHubSettingsTab  = lazy(() => import('./tabs/GitHubSettingsTab'))
const NotionSettingsTab  = lazy(() => import('./tabs/NotionSettingsTab'))
const LoomSettingsTab    = lazy(() => import('./tabs/LoomSettingsTab'))
const InvoiceSettingsTab  = lazy(() => import('./tabs/InvoiceSettingsTab'))
const PagesSettingsTab    = lazy(() => import('./tabs/PagesSettingsTab'))
const GoogleWorkspaceSettingsTab = lazy(() => import('./tabs/GoogleWorkspaceSettingsTab'))

// ── Tab → Component map ──────────────────────────────────────
const tabComponents = {
  'general':      GeneralTab,
  'email':        EmailTab,
  'task-types':   TaskTypesTab,
  'pusher':       PusherTab,
  'ai-settings':  AiSettingsTab,
  'github':       GitHubSettingsTab,
  'notion':       NotionSettingsTab,
  'loom':         LoomSettingsTab,
  'google-workspace': GoogleWorkspaceSettingsTab,
  'invoices':     InvoiceSettingsTab,
  'pages':        PagesSettingsTab,
  'woo-project':  null, // injected by pm-pro via filter
}


// Per-tab pro preview config — maps tab key → ProFeaturePlaceholder props
const getProTabConfig = () => ({
  'invoices':    { title: __('Invoices',    'wedevs-project-manager'), description: __('Create and manage invoices for your projects.',          'wedevs-project-manager'), icon: FileText,     mockKey: 'invoices'     },
  'pages':       { title: __('Pages',       'wedevs-project-manager'), description: __('Configure front-end pages for Project Manager.',         'wedevs-project-manager'), icon: FileText,     mockKey: 'settings'     },
  'woo-project': { title: __('WooCommerce', 'wedevs-project-manager'), description: __('Automatically create projects from WooCommerce orders.', 'wedevs-project-manager'), icon: ShoppingCart, mockKey: 'woo-project'  },
})

// ── Component ────────────────────────────────────────────────
const SettingsPage = () => {
  const { isPro } = usePermissions()
  const location = useLocation()
  const navigate = useNavigate()
  const PRO_TAB_CONFIG = useMemo(() => getProTabConfig(), [])

  // Woo Project tab component — injected by pm-pro via filter (only when module is active)
  const WooProjectComponent = useFilter('settings.tab.woo-project.component', null)

  // Mirror the exact sidebar logic:
  //   !isPro           → show with pro:true (ProSettingsPreview)
  //   isPro + active   → show, render WooProjectComponent
  //   isPro + inactive → hide entirely
  const isProInstalled = typeof PM_Pro_Vars !== 'undefined'
  const isWooModuleActive = (() => {
    const mods = (isProInstalled && Array.isArray(PM_Pro_Vars.active_modules))
      ? PM_Pro_Vars.active_modules.map(m => typeof m === 'string' ? m : (m.path || ''))
      : []
    return mods.some(m => m.startsWith('Woo_Project/') || m === 'Woo_Project')
  })()
  const showWooTab = !isPro || isWooModuleActive

  const integrationTabs = [
    { key: 'google-workspace', label: __('G Workspace', 'wedevs-project-manager'), icon: GoogleWorkspaceNavIcon },
    { key: 'pusher',  label: __('Pusher',   'wedevs-project-manager'), icon: Radio },
    { key: 'github',  label: __('GitHub',   'wedevs-project-manager'), icon: GitHubNavIcon },
    { key: 'notion',  label: __('Notion',   'wedevs-project-manager'), icon: NotionNavIcon },
    { key: 'loom',    label: __('Loom',     'wedevs-project-manager'), icon: LoomNavIcon },
  ]

  if (showWooTab) {
    integrationTabs.push({
      key:   'woo-project',
      label: __('WooCommerce', 'wedevs-project-manager'),
      icon:  ShoppingCart,
      pro:   !isPro,  // show ProBadge + ProSettingsPreview for free users
    })
  }

  const tabGroups = [
    {
      title: __('Configuration', 'wedevs-project-manager'),
      tabs: [
        { key: 'general',    label: __('General',    'wedevs-project-manager'), icon: Settings },
        { key: 'email',      label: __('Email',      'wedevs-project-manager'), icon: Mail     },
        { key: 'task-types', label: __('Task Types', 'wedevs-project-manager'), icon: ListTodo },
        { key: 'invoices',   label: __('Invoices',   'wedevs-project-manager'), icon: FileText, pro: true },
        { key: 'pages',      label: __('Pages',      'wedevs-project-manager'), icon: FileText, pro: true },
      ],
    },
    {
      title: __('Integrations', 'wedevs-project-manager'),
      tabs: integrationTabs,
    },
    {
      title: __('Advanced', 'wedevs-project-manager'),
      tabs: [
        { key: 'ai-settings', label: __('AI Settings', 'wedevs-project-manager'), icon: Bot },
      ],
    },
  ]

  // The open tab lives in the URL (/settings/email), so a tab can be linked,
  // reloaded and walked with the browser's back button. An unknown or missing
  // segment falls back to General.
  const urlTab = (location.pathname.split('/settings/')[1] || '').replace(/\/+$/, '')
  const allTabs = tabGroups.flatMap(g => g.tabs)
  const activeTab = allTabs.some(t => t.key === urlTab) ? urlTab : 'general'
  const setActiveTab = (key) => navigate(key === 'general' ? '/settings' : `/settings/${key}`)

  const activeTabConfig = allTabs.find(t => t.key === activeTab)
  const isProTab = activeTabConfig?.pro && !isPro
  // For woo-project tab: use the filter-injected component (set by pm-pro when module is active).
  // For all other tabs: use the static tabComponents map.
  const ActiveComponent = activeTab === 'woo-project' ? WooProjectComponent : tabComponents[activeTab]

  return (
    <div className="pm-settings-page flex flex-col h-full overflow-hidden bg-pm-surface-muted">

      {/* ── Page header ────────────────────────────────────── */}
      <div className="shrink-0 px-6 pt-6 pb-2">
        <h1 className="text-xl font-bold text-pm-text-primary">
          {__('Settings', 'wedevs-project-manager')}
        </h1>
      </div>

      {/* ── Left nav + content ─────────────────────────────
           The tab list used to be a second horizontal bar. With 12 entries it
           scrolled sideways and threw away the grouping that tabGroups already
           describes. A column shows every entry at once, keeps the group
           headings, and has room to grow. */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-6 pb-6 flex flex-col md:flex-row md:items-start gap-4 md:gap-6">

          <nav className="hidden md:block w-60 shrink-0 self-start sticky top-0 rounded-xl border bg-card shadow-sm p-3">
          {tabGroups.map((group) => (
            <div key={group.title} className="mb-5 last:mb-0">
              <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-pm-text-muted">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.key
                  const needsPro = tab.pro && !isPro
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        'group/tab w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors',
                        isActive
                          ? 'bg-pm-accent-light text-pm-accent'
                          : 'text-pm-text-muted hover:text-pm-text-primary hover:bg-muted',
                      )}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      <Icon className={cn(
                        'w-5 h-5 shrink-0',
                        isActive ? 'text-pm-accent' : 'text-pm-text-muted group-hover/tab:text-pm-text',
                      )} />
                      <span className="truncate">{tab.label}</span>
                      {needsPro && <span className="ml-auto shrink-0"><ProBadge interactive={false} /></span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Narrow viewports keep a horizontal strip: a 240px column would eat
           the content area. */}
          <nav className="md:hidden w-full shrink-0 flex items-center gap-1 overflow-x-auto rounded-xl border bg-card shadow-sm p-1.5 scrollbar-none">
          {tabGroups.flatMap(g => g.tabs).map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors',
                  isActive ? 'bg-pm-accent-light text-pm-accent' : 'text-pm-text-muted hover:text-pm-text-primary',
                )}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {tab.label}
              </button>
            )
          })}
        </nav>

      {/* ── Content area ──────────────────────────────────── */}
          <main className="flex-1 min-w-0 w-full">
        {isProTab ? (
          <ProFeaturePlaceholder {...(PRO_TAB_CONFIG[activeTab] ?? PRO_TAB_CONFIG['invoices'])} />
        ) : ActiveComponent ? (
          <Suspense
            fallback={
              activeTab === 'woo-project' ? (
                <div className="w-full p-6 space-y-5">
                  <div className="h-7 w-64 bg-pm-border/30 rounded-lg animate-pulse" />
                  <div className="h-4 w-96 bg-pm-border/30 rounded-lg animate-pulse" />
                  <div className="h-32 w-full bg-pm-border/30 rounded-lg animate-pulse" />
                  <div className="h-32 w-full bg-pm-border/30 rounded-lg animate-pulse" />
                </div>
              ) : (
                <div className="w-full p-4 sm:p-6 space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 w-full bg-pm-border/30 rounded-lg animate-pulse" />
                  ))}
                </div>
              )
            }
          >
            {/* Every tab gets the same card. WooCommerce brings its own
                padding, so the card supplies only the surface for it, which
                is why it used to render bare. */}
            <div className="w-full">
              <div className={cn(
                'rounded-xl border bg-card shadow-sm',
                activeTab !== 'woo-project' && 'p-4 sm:p-6',
              )}>
                <ActiveComponent />
              </div>
            </div>
          </Suspense>
        ) : null}
          </main>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
