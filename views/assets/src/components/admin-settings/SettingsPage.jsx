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

// ── Lazy-loaded tab components ───────────────────────────────
const GeneralTab    = lazy(() => import('./tabs/GeneralTab'))
const EmailTab      = lazy(() => import('./tabs/EmailTab'))
const TaskTypesTab  = lazy(() => import('./tabs/TaskTypesTab'))
const UserMapTab    = lazy(() => import('./tabs/UserMapTab'))
const PusherTab     = lazy(() => import('./tabs/PusherTab'))
const AiSettingsTab      = lazy(() => import('./tabs/AiSettingsTab'))
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
        <div
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
        </div>
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
                <div className="flex items-center gap-2 text-pm-text-muted text-sm py-16 justify-center">
                  <span className="w-4 h-4 rounded-full border-2 border-pm-accent border-t-transparent animate-spin" />
                  {__('Loading...', 'wedevs-project-manager')}
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
