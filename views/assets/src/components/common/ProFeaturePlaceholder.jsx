import { __, sprintf } from '@wordpress/i18n';
import React from 'react'
import { usePermissions } from '@hooks/usePermissions'
import { useProModal } from './ProUpgradeModal'
import { useLicenseGuard } from './LicenseGuard'
import ProBadge from './ProBadge'
import { Crown } from 'lucide-react'

/* ── Mock UI backgrounds for each feature ── */

function KanbanMock() {
  const cols = [
    { title: __('Open', 'wedevs-project-manager'), color: '#ef4444', tasks: [__('Design homepage', 'wedevs-project-manager'), __('API integration', 'wedevs-project-manager'), __('Write tests', 'wedevs-project-manager')] },
    { title: __('In Progress', 'wedevs-project-manager'), color: '#f59e0b', tasks: [__('Database schema', 'wedevs-project-manager'), __('Auth module', 'wedevs-project-manager')] },
    { title: __('Done', 'wedevs-project-manager'), color: '#22c55e', tasks: [__('Project setup', 'wedevs-project-manager'), __('CI/CD pipeline', 'wedevs-project-manager'), __('Documentation', 'wedevs-project-manager'), __('Code review', 'wedevs-project-manager')] },
    { title: __('Overdue', 'wedevs-project-manager'), color: '#6b7280', tasks: [__('Bug fix #42', 'wedevs-project-manager')] },
  ]
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-5" style={{ minHeight: '420px', alignItems: 'flex-start' }}>
      {cols.map(col => (
        <div key={col.title} className="flex-1 rounded-lg bg-pm-surface-muted overflow-hidden">
          <div className="px-3 py-2 text-white text-sm font-semibold flex justify-between" style={{ background: col.color }}>
            {col.title} <span className="bg-white/30 rounded-full px-1.5 text-[14px]">{col.tasks.length}</span>
          </div>
          <div className="p-2">
            {col.tasks.map((t, i) => (
              <div key={i} className="bg-pm-surface rounded-md px-3 py-2.5 mb-1.5 text-sm text-pm-text shadow-sm border border-pm-border">{t}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function GanttMock() {
  const tasks = [
    { name: __('Research', 'wedevs-project-manager'), start: 5, width: 30, color: '#7C3AED' },
    { name: __('Design', 'wedevs-project-manager'), start: 20, width: 25, color: '#a78bfa' },
    { name: __('Development', 'wedevs-project-manager'), start: 35, width: 40, color: '#7C3AED' },
    { name: __('Testing', 'wedevs-project-manager'), start: 60, width: 20, color: '#a78bfa' },
    { name: __('Deployment', 'wedevs-project-manager'), start: 75, width: 15, color: '#22c55e' },
    { name: __('Review', 'wedevs-project-manager'), start: 10, width: 35, color: '#f59e0b' },
  ]
  const months = [__('Jan', 'wedevs-project-manager'), __('Feb', 'wedevs-project-manager'), __('Mar', 'wedevs-project-manager'), __('Apr', 'wedevs-project-manager'), __('May', 'wedevs-project-manager')]
  return (
    <div className="p-5" style={{ minHeight: '420px' }}>
      <div className="flex border-b border-pm-border pb-2 mb-3">
        <div className="w-28 text-[15px] font-semibold text-pm-text">{__('Task', 'wedevs-project-manager')}</div>
        <div className="flex-1 flex">
          {months.map(m => <div key={m} className="flex-1 text-[14px] text-pm-text-muted text-center">{m}</div>)}
        </div>
      </div>
      {tasks.map((t, i) => (
        <div key={i} className="flex items-center mb-2.5">
          <div className="w-28 text-sm text-pm-text font-medium">{t.name}</div>
          <div className="flex-1 relative h-6 bg-pm-surface-muted rounded">
            <div className="absolute h-full rounded" style={{ left: `${t.start}%`, width: `${t.width}%`, background: t.color, opacity: 0.85 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function InvoiceMock() {
  const rows = [
    { item: __('Web Design', 'wedevs-project-manager'), qty: 1, rate: '$2,500', total: '$2,500' },
    { item: __('Development', 'wedevs-project-manager'), qty: 40, rate: '$85/hr', total: '$3,400' },
    { item: __('Hosting Setup', 'wedevs-project-manager'), qty: 1, rate: '$150', total: '$150' },
  ]
  return (
    <div className="p-8" style={{ minHeight: '420px' }}>
      <div className="flex justify-between mb-8">
        <div>
          <div className="text-xl font-bold text-pm-text-primary">{__('INVOICE', 'wedevs-project-manager')}</div>
          <div className="text-[15px] text-pm-text-muted mt-1">#INV-2026-001</div>
        </div>
        <div className="text-right">
          <div className="text-[15px] text-pm-text-muted">{__('Due: Apr 15, 2026', 'wedevs-project-manager')}</div>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 text-[15px] font-semibold">{__('Unpaid', 'wedevs-project-manager')}</span>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-pm-border">
            <th className="text-left py-2 text-pm-text-muted font-semibold">{__('Item', 'wedevs-project-manager')}</th>
            <th className="text-center py-2 text-pm-text-muted font-semibold">{__('Qty', 'wedevs-project-manager')}</th>
            <th className="text-right py-2 text-pm-text-muted font-semibold">{__('Rate', 'wedevs-project-manager')}</th>
            <th className="text-right py-2 text-pm-text-muted font-semibold">{__('Total', 'wedevs-project-manager')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-pm-border">
              <td className="py-2.5 text-pm-text">{r.item}</td>
              <td className="py-2.5 text-center text-pm-text-muted">{r.qty}</td>
              <td className="py-2.5 text-right text-pm-text-muted">{r.rate}</td>
              <td className="py-2.5 text-right font-semibold text-pm-text-primary">{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4 pt-3 border-t-2 border-pm-border">
        <div className="text-right">
          <div className="text-[15px] text-pm-text-muted">{__('Total Due', 'wedevs-project-manager')}</div>
          <div className="text-2xl font-bold text-pm-accent">$6,050.00</div>
        </div>
      </div>
    </div>
  )
}

function SettingsMock() {
  const tabs = [__('General', 'wedevs-project-manager'), __('Capabilities', 'wedevs-project-manager'), __('Integrations', 'wedevs-project-manager')]
  const fields = [__('Project Name', 'wedevs-project-manager'), __('Description', 'wedevs-project-manager'), __('Status', 'wedevs-project-manager'), __('Visibility', 'wedevs-project-manager')]
  return (
    <div className="p-5" style={{ minHeight: '420px' }}>
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
        {tabs.map((t, i) => (
          <div key={t} className={`px-4 py-1.5 rounded-md text-sm font-medium ${i === 0 ? 'bg-pm-accent text-white' : 'bg-pm-surface-muted text-pm-text-muted'}`}>{t}</div>
        ))}
      </div>
      {fields.map((f, i) => (
        <div key={i} className="flex items-center justify-between gap-3 py-3.5 border-b border-pm-border">
          <span className="text-[15px] text-pm-text font-medium shrink-0">{f}</span>
          <div className="w-full sm:w-48 h-8 rounded-md bg-pm-surface-muted border border-pm-border" />
        </div>
      ))}
    </div>
  )
}

function SprintsMock() {
  const sprints = [
    { name: __('Sprint 12', 'wedevs-project-manager'), status: __('Active', 'wedevs-project-manager'), dates: 'Mar 18 – Mar 31', tasks: 8, completed: 3, color: '#7C3AED' },
    { name: __('Sprint 11', 'wedevs-project-manager'), status: __('Completed', 'wedevs-project-manager'), dates: 'Mar 4 – Mar 17', tasks: 12, completed: 12, color: '#22c55e' },
    { name: __('Sprint 10', 'wedevs-project-manager'), status: __('Completed', 'wedevs-project-manager'), dates: 'Feb 18 – Mar 3', tasks: 10, completed: 10, color: '#22c55e' },
  ]
  return (
    <div className="p-5" style={{ minHeight: '420px' }}>
      <div className="space-y-3">
        {sprints.map((s, i) => (
          <div key={i} className="rounded-lg border border-pm-border bg-pm-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-sm font-semibold text-pm-text-primary">{s.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[14px] font-medium ${s.status === 'Active' ? 'bg-pm-accent/15 text-pm-accent' : 'bg-green-500/15 text-green-500'}`}>{s.status}</span>
              </div>
              <span className="text-[15px] text-pm-text-muted">{s.dates}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-pm-surface-muted">
              <div className="h-full rounded-full" style={{ width: `${(s.completed / s.tasks) * 100}%`, background: s.color, opacity: 0.7 }} />
            </div>
            <div className="mt-2 text-[15px] text-pm-text-muted">{sprintf(__('%1$s/%2$s tasks completed', 'wedevs-project-manager'), s.completed, s.tasks)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WooProjectMock() {
  const products = [
    { name: __('Website Development Package', 'wedevs-project-manager'), action: __('Create New Project', 'wedevs-project-manager'), assignees: 3 },
    { name: __('SEO Audit Service', 'wedevs-project-manager'), action: __('Duplicate Project', 'wedevs-project-manager'), assignees: 2 },
    { name: __('Logo Design Bundle', 'wedevs-project-manager'), action: __('Create New Project', 'wedevs-project-manager'), assignees: 1 },
  ]
  return (
    <div className="p-5" style={{ minHeight: '420px' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-pm-accent/15 flex items-center justify-center">
            <svg className="h-4 w-4 text-pm-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <span className="text-sm font-semibold text-pm-text-primary">{__('WooCommerce Project Mapping', 'wedevs-project-manager')}</span>
        </div>
        <div className="px-3 py-1.5 rounded-md bg-pm-accent text-white text-sm font-medium">{__('+ Add Product', 'wedevs-project-manager')}</div>
      </div>
      <div className="space-y-3">
        {products.map((p, i) => (
          <div key={i} className="rounded-lg border border-pm-border bg-pm-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-pm-text-primary">{p.name}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[14px] font-medium ${p.action.includes('Duplicate') ? 'bg-blue-500/15 text-blue-500' : 'bg-green-500/15 text-green-500'}`}>{p.action}</span>
            </div>
            <div className="flex items-center gap-4 text-[15px] text-pm-text-muted">
              <div className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>{p.assignees} {__('assignees', 'wedevs-project-manager')}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <span>{__('Auto-created on order', 'wedevs-project-manager')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MOCK_MAP = {
  kanban: KanbanMock,
  gantt: GanttMock,
  invoices: InvoiceMock,
  settings: SettingsMock,
  sprints: SprintsMock,
  'woo-project': WooProjectMock,
}

export default function ProFeaturePlaceholder({ title, description, icon: Icon, mockKey }) {
  const { isPro } = usePermissions()
  const { setOpen } = useProModal()
  const MockComponent = mockKey && MOCK_MAP[mockKey]

  const licenseGuard = useLicenseGuard()
  if (licenseGuard) return licenseGuard

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Header — same pattern as CalendarPage */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-pm-text-primary">{title}</h1>
          <p className="text-sm text-pm-text-muted mt-0.5">{description}</p>
        </div>
        {!isPro && <ProBadge label={__('Pro Required', 'wedevs-project-manager')} />}
      </div>

      {/* Preview card — same pattern as CalendarPage */}
      <div className="group relative rounded-xl border bg-card overflow-hidden">
        <div className="p-6">
          {MockComponent ? <MockComponent /> : (
            <div style={{ minHeight: '500px' }} className="flex items-center justify-center">
              {Icon && <Icon className="h-32 w-32 text-pm-text-muted/10" />}
            </div>
          )}
        </div>

        {/* Pro overlay — same as CalendarPage: hidden, shows on hover */}
        {!isPro && (
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setOpen(true)}
          >
            <div className="bg-pm-surface rounded-2xl px-8 py-6 shadow-xl text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-pm-accent/10 mb-4">
                {Icon && <Icon className="h-7 w-7 text-pm-accent" />}
              </div>
              <h3 className="text-lg font-bold text-pm-text-primary mb-1">{title}</h3>
              <p className="text-sm text-pm-text-muted mb-4 max-w-[250px]">{description}</p>
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
                style={{ background: '#ff9000' }}
              >
                <Crown className="h-5 w-5" />
                {__('Upgrade to Pro', 'wedevs-project-manager')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
