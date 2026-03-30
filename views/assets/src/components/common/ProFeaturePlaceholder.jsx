import React from 'react'
import { Navigate } from 'react-router-dom'
import { useI18n } from '@hooks/useI18n'
import { usePermissions } from '@hooks/usePermissions'
import { useProModal } from './ProUpgradeModal'
import ProBadge from './ProBadge'
import { Crown } from 'lucide-react'

/* ── Mock UI backgrounds for each feature ── */

function KanbanMock() {
  const cols = [
    { title: 'Open', color: '#ef4444', tasks: ['Design homepage', 'API integration', 'Write tests'] },
    { title: 'In Progress', color: '#f59e0b', tasks: ['Database schema', 'Auth module'] },
    { title: 'Done', color: '#22c55e', tasks: ['Project setup', 'CI/CD pipeline', 'Documentation', 'Code review'] },
    { title: 'Overdue', color: '#6b7280', tasks: ['Bug fix #42'] },
  ]
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-5" style={{ minHeight: '420px', alignItems: 'flex-start' }}>
      {cols.map(col => (
        <div key={col.title} className="flex-1 rounded-lg bg-gray-50 overflow-hidden">
          <div className="px-3 py-2 text-white text-xs font-semibold flex justify-between" style={{ background: col.color }}>
            {col.title} <span className="bg-white/30 rounded-full px-1.5 text-[10px]">{col.tasks.length}</span>
          </div>
          <div className="p-2">
            {col.tasks.map((t, i) => (
              <div key={i} className="bg-white rounded-md px-3 py-2.5 mb-1.5 text-xs text-gray-600 shadow-sm border">{t}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function GanttMock() {
  const tasks = [
    { name: 'Research', start: 5, width: 30, color: '#7C3AED' },
    { name: 'Design', start: 20, width: 25, color: '#a78bfa' },
    { name: 'Development', start: 35, width: 40, color: '#7C3AED' },
    { name: 'Testing', start: 60, width: 20, color: '#a78bfa' },
    { name: 'Deployment', start: 75, width: 15, color: '#22c55e' },
    { name: 'Review', start: 10, width: 35, color: '#f59e0b' },
  ]
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
  return (
    <div className="p-5" style={{ minHeight: '420px' }}>
      <div className="flex border-b pb-2 mb-3">
        <div className="w-28 text-[11px] font-semibold text-gray-500">Task</div>
        <div className="flex-1 flex">
          {months.map(m => <div key={m} className="flex-1 text-[10px] text-gray-400 text-center">{m}</div>)}
        </div>
      </div>
      {tasks.map((t, i) => (
        <div key={i} className="flex items-center mb-2.5">
          <div className="w-28 text-xs text-gray-600 font-medium">{t.name}</div>
          <div className="flex-1 relative h-6 bg-gray-100 rounded">
            <div className="absolute h-full rounded" style={{ left: `${t.start}%`, width: `${t.width}%`, background: t.color, opacity: 0.85 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function InvoiceMock() {
  const rows = [
    { item: 'Web Design', qty: 1, rate: '$2,500', total: '$2,500' },
    { item: 'Development', qty: 40, rate: '$85/hr', total: '$3,400' },
    { item: 'Hosting Setup', qty: 1, rate: '$150', total: '$150' },
  ]
  return (
    <div className="p-8" style={{ minHeight: '420px' }}>
      <div className="flex justify-between mb-8">
        <div>
          <div className="text-xl font-bold text-gray-900">INVOICE</div>
          <div className="text-[11px] text-gray-400 mt-1">#INV-2026-001</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-gray-400">Due: Apr 15, 2026</div>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[11px] font-semibold">Unpaid</span>
        </div>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-2 text-gray-500 font-semibold">Item</th>
            <th className="text-center py-2 text-gray-500 font-semibold">Qty</th>
            <th className="text-right py-2 text-gray-500 font-semibold">Rate</th>
            <th className="text-right py-2 text-gray-500 font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-2.5 text-gray-700">{r.item}</td>
              <td className="py-2.5 text-center text-gray-500">{r.qty}</td>
              <td className="py-2.5 text-right text-gray-500">{r.rate}</td>
              <td className="py-2.5 text-right font-semibold text-gray-900">{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4 pt-3 border-t-2 border-gray-200">
        <div className="text-right">
          <div className="text-[11px] text-gray-400">Total Due</div>
          <div className="text-2xl font-bold text-pm-accent">$6,050.00</div>
        </div>
      </div>
    </div>
  )
}

function SettingsMock() {
  const tabs = ['General', 'Capabilities', 'Integrations']
  const fields = ['Project Name', 'Description', 'Status', 'Visibility']
  return (
    <div className="p-5" style={{ minHeight: '420px' }}>
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
        {tabs.map((t, i) => (
          <div key={t} className={`px-4 py-1.5 rounded-md text-xs font-medium ${i === 0 ? 'bg-pm-accent text-white' : 'bg-gray-100 text-gray-500'}`}>{t}</div>
        ))}
      </div>
      {fields.map((f, i) => (
        <div key={i} className="flex items-center justify-between gap-3 py-3.5 border-b border-gray-100">
          <span className="text-[13px] text-gray-700 font-medium shrink-0">{f}</span>
          <div className="w-full sm:w-48 h-8 rounded-md bg-gray-50 border border-gray-200" />
        </div>
      ))}
    </div>
  )
}

function SprintsMock() {
  const sprints = [
    { name: 'Sprint 12', status: 'Active', dates: 'Mar 18 – Mar 31', tasks: 8, completed: 3, color: '#7C3AED' },
    { name: 'Sprint 11', status: 'Completed', dates: 'Mar 4 – Mar 17', tasks: 12, completed: 12, color: '#22c55e' },
    { name: 'Sprint 10', status: 'Completed', dates: 'Feb 18 – Mar 3', tasks: 10, completed: 10, color: '#22c55e' },
  ]
  return (
    <div className="p-5" style={{ minHeight: '420px' }}>
      <div className="space-y-3">
        {sprints.map((s, i) => (
          <div key={i} className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${s.status === 'Active' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{s.status}</span>
              </div>
              <span className="text-[11px] text-gray-400">{s.dates}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100">
              <div className="h-full rounded-full" style={{ width: `${(s.completed / s.tasks) * 100}%`, background: s.color, opacity: 0.7 }} />
            </div>
            <div className="mt-2 text-[11px] text-gray-400">{s.completed}/{s.tasks} tasks completed</div>
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
}

export default function ProFeaturePlaceholder({ title, description, icon: Icon, mockKey }) {
  const { __ } = useI18n()
  const { isPro, isProLicensed } = usePermissions()
  const { setOpen } = useProModal()
  const MockComponent = mockKey && MOCK_MAP[mockKey]

  if (isPro && !isProLicensed) return <Navigate to="/license" replace />

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Header — same pattern as CalendarPage */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-pm-text-primary">{__(title)}</h1>
          <p className="text-sm text-pm-text-muted mt-0.5">{__(description)}</p>
        </div>
        {!isPro && <ProBadge label={__('Pro Required')} />}
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
            <div className="bg-white rounded-2xl px-8 py-6 shadow-xl text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-pm-accent/10 mb-4">
                {Icon && <Icon className="h-7 w-7 text-pm-accent" />}
              </div>
              <h3 className="text-lg font-bold text-pm-text-primary mb-1">{__(title)}</h3>
              <p className="text-xs text-pm-text-muted mb-4 max-w-[250px]">{__(description)}</p>
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
                style={{ background: '#ff9000' }}
              >
                <Crown className="h-4 w-4" />
                {__('Upgrade to Pro')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
