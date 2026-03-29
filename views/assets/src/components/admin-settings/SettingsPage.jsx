import React, { useState, lazy, Suspense } from 'react'
import { useI18n } from '@hooks/useI18n'
import { usePermissions } from '@hooks/usePermissions'
import { useProModal } from '@components/common/ProUpgradeModal'
import ProBadge from '@components/common/ProBadge'
import { cn } from '@lib/utils'
import {
  Settings, Mail, Users, ListTodo, Bot, Radio,
  Calendar, Image, FileText, Crown, Lock,
} from 'lucide-react'

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
  <svg viewBox="0 0 62 62" fill="#625DF5" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M62,27.6H43.9l15.7-9.1l-3.4-6l-15.7,9.1l9.1-15.7l-6-3.5l-9.1,15.7V0h-6.9v18.1L18.5,2.4l-6,3.4l9.1,15.7L5.9,12.5l-3.4,6l15.7,9.1H0v6.9h18.1L2.4,43.5l3.4,6l15.7-9.1l-9.1,15.7l6,3.4l9.1-15.7V62h6.9V43.9l9.1,15.7l6-3.4l-9.1-15.7l15.7,9.1l3.4-6l-15.7-9.1H62L62,27.6L62,27.6z M31,40.4c-5.2,0-9.4-4.2-9.4-9.4c0-5.2,4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4C40.4,36.2,36.2,40.4,31,40.4z" />
  </svg>
)

// ── Lazy-loaded tab components ───────────────────────────────
const GeneralTab    = lazy(() => import('./tabs/GeneralTab'))
const EmailTab      = lazy(() => import('./tabs/EmailTab'))
const TaskTypesTab  = lazy(() => import('./tabs/TaskTypesTab'))
const UserMapTab    = lazy(() => import('./tabs/UserMapTab'))
const PusherTab     = lazy(() => import('./tabs/PusherTab'))
const AiSettingsTab      = lazy(() => import('./tabs/AiSettingsTab'))
const GitHubSettingsTab  = lazy(() => import('./tabs/GitHubSettingsTab'))
const NotionSettingsTab  = lazy(() => import('./tabs/NotionSettingsTab'))
const LoomSettingsTab    = lazy(() => import('./tabs/LoomSettingsTab'))
const InvoiceSettingsTab = lazy(() => import('./tabs/InvoiceSettingsTab'))
const PagesSettingsTab   = lazy(() => import('./tabs/PagesSettingsTab'))

// ── Tab → Component map ──────────────────────────────────────
const tabComponents = {
  'general':      GeneralTab,
  'email':        EmailTab,
  'task-types':   TaskTypesTab,
  'usermap':      UserMapTab,
  'pusher':       PusherTab,
  'ai-settings':  AiSettingsTab,
  'github':       GitHubSettingsTab,
  'notion':       NotionSettingsTab,
  'loom':         LoomSettingsTab,
  'invoices':     InvoiceSettingsTab,
  'pages':        PagesSettingsTab,
}

// ── Pro Preview placeholder ──────────────────────────────────
function ProSettingsPreview({ tabLabel, icon: Icon }) {
  const { __ } = useI18n()
  const { setOpen } = useProModal()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-pm-text mb-1">{tabLabel}</h2>
        <p className="text-sm text-pm-text-muted">{__('This feature requires PM Pro')}</p>
      </div>

      <div className="group relative rounded-xl border bg-card overflow-hidden">
        <div className="p-6 space-y-4 opacity-50">
          {/* Mock settings rows */}
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-pm-border last:border-0">
              <div className="space-y-1">
                <div className="h-4 w-32 rounded bg-muted/60" />
                <div className="h-3 w-48 rounded bg-muted/40" />
              </div>
              <div className="h-6 w-11 rounded-full bg-muted/60" />
            </div>
          ))}
        </div>

        {/* Pro overlay */}
        <button
          type="button"
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer rounded-xl"
          onClick={() => setOpen(true)}
        >
          <div className="bg-white rounded-2xl px-8 py-6 shadow-xl text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-pm-accent/10 mb-3">
              <Lock className="h-6 w-6 text-pm-accent" />
            </div>
            <h3 className="text-base font-bold text-pm-text mb-1">{tabLabel}</h3>
            <p className="text-xs text-pm-text-muted mb-4 max-w-[220px]">
              {__('Unlock this feature by upgrading to PM Pro.')}
            </p>
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold text-sm"
              style={{ background: '#ff9000' }}
            >
              <Crown className="h-4 w-4" />
              {__('Upgrade to Pro')}
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

// ── Component ────────────────────────────────────────────────
const SettingsPage = () => {
  const { __ } = useI18n()
  const { isPro } = usePermissions()
  const [activeTab, setActiveTab] = useState('general')

  // Pro tabs that show for everyone (with preview for free users)
  const proTabs = [
    { key: 'invoices',     label: __('Invoices', 'wedevs-project-manager'),     icon: FileText, pro: true },
    { key: 'pages',        label: __('Pages', 'wedevs-project-manager'),        icon: FileText, pro: true },
  ]

  const tabGroups = [
    {
      title: __('Configuration', 'wedevs-project-manager'),
      tabs: [
        { key: 'general',    label: __('General',    'wedevs-project-manager'), icon: Settings },
        { key: 'email',      label: __('Email',      'wedevs-project-manager'), icon: Mail     },
        { key: 'task-types', label: __('Task Types', 'wedevs-project-manager'), icon: ListTodo },
      ],
    },
    {
      title: __('Integrations', 'wedevs-project-manager'),
      tabs: [
        { key: 'usermap', label: __('User Map', 'wedevs-project-manager'), icon: Users },
        { key: 'pusher',  label: __('Pusher',   'wedevs-project-manager'), icon: Radio },
        { key: 'github',  label: __('GitHub',   'wedevs-project-manager'), icon: GitHubNavIcon },
        { key: 'notion',  label: __('Notion',   'wedevs-project-manager'), icon: NotionNavIcon },
        { key: 'loom',    label: __('Loom',     'wedevs-project-manager'), icon: LoomNavIcon },
      ],
    },
    {
      title: __('Advanced', 'wedevs-project-manager'),
      tabs: [
        { key: 'ai-settings', label: __('AI Settings', 'wedevs-project-manager'), icon: Bot },
      ],
    },
    {
      title: __('Pro', 'wedevs-project-manager'),
      tabs: proTabs,
    },
  ]

  const activeTabConfig = tabGroups.flatMap(g => g.tabs).find(t => t.key === activeTab)
  const isProTab = activeTabConfig?.pro && !isPro
  const ActiveComponent = tabComponents[activeTab]

  return (
    <div className="pm-settings-page flex h-full overflow-hidden">

      {/* ── Settings sub-nav (internal sidebar) ────────────── */}
      <aside className="shrink-0 w-[200px] bg-white border-r border-pm-border flex flex-col">
        <div className="px-4 pt-5 pb-3">
          <h1 className="text-pm-text font-semibold text-base">
            {__('Settings', 'wedevs-project-manager')}
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto pb-4 pt-1 px-2">
          {tabGroups.map((group) => (
            <div key={group.title} className="mb-4">
              <p className="text-[11px] font-medium text-pm-text-muted uppercase tracking-wider px-2 mb-1.5">
                {group.title}
              </p>

              {group.tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.key
                const needsPro = tab.pro && !isPro

                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={cn(
                      'w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md transition-colors text-left mb-0.5',
                      isActive
                        ? 'bg-pm-accent/10 text-pm-accent font-medium'
                        : 'text-pm-text-muted hover:bg-pm-hover hover:text-pm-text'
                    )}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0',
                        isActive ? 'text-pm-accent' : 'text-pm-text-muted'
                      )}
                    />
                    <span className="flex-1 truncate text-[13px]">{tab.label}</span>
                    {needsPro && <ProBadge />}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Content area ──────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-pm-surface-muted">
        <div className="max-w-[840px] mx-auto p-8">
          {isProTab ? (
            <ProSettingsPreview
              tabLabel={activeTabConfig.label}
              icon={activeTabConfig.icon}
            />
          ) : (
            <Suspense
              fallback={
                <div className="space-y-4 py-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 w-full bg-pm-border/30 rounded-lg animate-pulse" />
                  ))}
                </div>
              }
            >
              <ActiveComponent />
            </Suspense>
          )}
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
