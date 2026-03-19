import React, { useState, lazy, Suspense } from 'react'
import { useI18n } from '@hooks/useI18n'
import { cn } from '@lib/utils'
import {
  Settings, Mail, Users, ListTodo, Bot, Radio,
} from 'lucide-react'

// ── Lazy-loaded tab components ───────────────────────────────
const GeneralTab    = lazy(() => import('./tabs/GeneralTab'))
const EmailTab      = lazy(() => import('./tabs/EmailTab'))
const TaskTypesTab  = lazy(() => import('./tabs/TaskTypesTab'))
const UserMapTab    = lazy(() => import('./tabs/UserMapTab'))
const PusherTab     = lazy(() => import('./tabs/PusherTab'))
const AiSettingsTab = lazy(() => import('./tabs/AiSettingsTab'))

// ── Tab → Component map ──────────────────────────────────────
const tabComponents = {
  'general':     GeneralTab,
  'email':       EmailTab,
  'task-types':  TaskTypesTab,
  'usermap':     UserMapTab,
  'pusher':      PusherTab,
  'ai-settings': AiSettingsTab,
}

// ── Component ────────────────────────────────────────────────
const SettingsPage = () => {
  const { __ } = useI18n()
  const [activeTab, setActiveTab] = useState('general')

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
  ]

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
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
