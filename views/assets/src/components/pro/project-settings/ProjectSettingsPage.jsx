import React, { useState, lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { useI18n } from '@hooks/useI18n'
import { cn } from '@lib/utils'
import { Shield, Plug, Tag, LayoutGrid } from 'lucide-react'
import { Card } from '@components/ui/card'

// ── Lazy-loaded tab components ───────────────────────────────
const CapabilitiesTab = lazy(() => import('./CapabilitiesTab'))
const IntegrationsTab = lazy(() => import('./IntegrationsTab'))
const LabelsTab       = lazy(() => import('./LabelsTab'))
const CustomFieldsTab = lazy(() => import('./CustomFieldsTab'))

// ── Tab → Component map ──────────────────────────────────────
const tabComponents = {
  'capabilities':  CapabilitiesTab,
  'integrations':  IntegrationsTab,
  'labels':        LabelsTab,
  'custom-fields': CustomFieldsTab,
}

const STORAGE_KEY = 'pm_project_settings_tab'

const TABS = [
  { key: 'capabilities',  label: 'Capabilities',  icon: Shield },
  { key: 'integrations',  label: 'Integrations',  icon: Plug },
  { key: 'labels',        label: 'Label',          icon: Tag },
  { key: 'custom-fields', label: 'Custom Field',   icon: LayoutGrid },
]

// ── Component ────────────────────────────────────────────────
const ProjectSettingsPage = () => {
  const { __ } = useI18n()
  const { projectId } = useParams()

  const [activeTab, setActiveTab] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored && tabComponents[stored] ? stored : 'capabilities'
  })

  const handleTabChange = (key) => {
    setActiveTab(key)
    localStorage.setItem(STORAGE_KEY, key)
  }

  const ActiveComponent = tabComponents[activeTab]

  return (
    <div className="pm-project-settings-page flex h-full overflow-hidden">

      {/* ── Settings sub-nav (internal sidebar) ────────────── */}
      <aside className="shrink-0 w-[200px] bg-white border-r border-pm-border flex flex-col">
        <div className="px-4 pt-5 pb-3">
          <h1 className="text-pm-text font-semibold text-base">
            {__('Settings', 'wedevs-project-manager')}
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto pb-4 pt-1 px-2">
          {TABS.map((tab) => {
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
                onClick={() => handleTabChange(tab.key)}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0',
                    isActive ? 'text-pm-accent' : 'text-pm-text-muted'
                  )}
                />
                <span className="flex-1 truncate text-[13px]">
                  {__(tab.label, 'wedevs-project-manager')}
                </span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* ── Content area ──────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-pm-surface-muted">
        <div className="max-w-[840px] mx-auto p-8">
          <Card className="p-6">
            <Suspense
              fallback={
                <div className="flex items-center gap-2 text-pm-text-muted text-sm py-16 justify-center">
                  <span className="w-4 h-4 rounded-full border-2 border-pm-accent border-t-transparent animate-spin" />
                  {__('Loading...', 'wedevs-project-manager')}
                </div>
              }
            >
              <ActiveComponent projectId={projectId} />
            </Suspense>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ProjectSettingsPage
