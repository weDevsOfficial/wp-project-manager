import React from 'react'
import { Navigate } from 'react-router-dom'
import { useI18n } from '@hooks/useI18n'
import { usePermissions } from '@hooks/usePermissions'
import { useProModal } from '@components/common/ProUpgradeModal'
import ProBadge from '@components/common/ProBadge'
import { Activity, Crown, User, FolderKanban, CheckSquare, MessageSquare, FileText, Plus } from 'lucide-react'
import { Avatar, AvatarFallback } from '@components/ui/avatar'
import { Badge } from '@components/ui/badge'
import { Separator } from '@components/ui/separator'

// Mock activity data for the preview
const MOCK_ACTIVITIES = [
  {
    date: 'Today',
    items: [
      { id: 1, user: 'Sarah K.', initials: 'SK', action: 'create', type: 'task', message: 'created a task "Update homepage design"', project: 'Website Redesign', time: '2 hours ago', color: 'bg-emerald-500' },
      { id: 2, user: 'John D.', initials: 'JD', action: 'update', type: 'task', message: 'completed task "Fix login bug"', project: 'Backend API', time: '3 hours ago', color: 'bg-blue-500' },
      { id: 3, user: 'Emily R.', initials: 'ER', action: 'comment', type: 'comment', message: 'commented on "Sprint planning doc"', project: 'Mobile App', time: '4 hours ago', color: 'bg-amber-500' },
      { id: 4, user: 'Mike T.', initials: 'MT', action: 'create', type: 'file', message: 'uploaded "final-mockup-v3.fig"', project: 'Website Redesign', time: '5 hours ago', color: 'bg-purple-500' },
    ],
  },
  {
    date: 'Yesterday',
    items: [
      { id: 5, user: 'Sarah K.', initials: 'SK', action: 'update', type: 'milestone', message: 'updated milestone "Phase 2 Launch"', project: 'Mobile App', time: '1 day ago', color: 'bg-blue-500' },
      { id: 6, user: 'Alex W.', initials: 'AW', action: 'create', type: 'project', message: 'created project "Q2 Marketing Campaign"', project: 'Q2 Marketing Campaign', time: '1 day ago', color: 'bg-emerald-500' },
      { id: 7, user: 'John D.', initials: 'JD', action: 'update', type: 'task', message: 'changed status of "API rate limiting" to in progress', project: 'Backend API', time: '1 day ago', color: 'bg-blue-500' },
    ],
  },
  {
    date: 'Mar 17, 2026',
    items: [
      { id: 8, user: 'Emily R.', initials: 'ER', action: 'create', type: 'task', message: 'created task "Push notification setup"', project: 'Mobile App', time: '3 days ago', color: 'bg-emerald-500' },
      { id: 9, user: 'Mike T.', initials: 'MT', action: 'comment', type: 'discussion', message: 'started discussion "Design system tokens"', project: 'Website Redesign', time: '3 days ago', color: 'bg-amber-500' },
    ],
  },
]

const ACTION_ICONS = {
  task: CheckSquare,
  project: FolderKanban,
  comment: MessageSquare,
  discussion: MessageSquare,
  file: FileText,
  milestone: Plus,
}

const ACTION_LABELS = {
  create: 'Created',
  update: 'Updated',
  comment: 'Commented',
}

function MockActivityItem({ item }) {
  const Icon = ACTION_ICONS[item.type] || Activity
  return (
    <div className="flex items-start gap-3 py-3 px-4 hover:bg-pm-hover/50 rounded-lg transition-colors">
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarFallback className="text-[15px] font-semibold bg-pm-accent/10 text-pm-accent">
          {item.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-pm-text">{item.user}</span>
          <Badge variant="outline" className={`text-[14px] px-1.5 py-0 h-4 font-medium border-0 text-white ${item.color}`}>
            {ACTION_LABELS[item.action] || item.action}
          </Badge>
        </div>
        <p className="text-sm text-pm-text-muted leading-snug">{item.message}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[15px] text-pm-text-muted/70 flex items-center gap-1">
            <FolderKanban className="h-3.5 w-3.5" />
            {item.project}
          </span>
          <span className="text-[15px] text-pm-text-muted/50">{item.time}</span>
        </div>
      </div>
      <div className="shrink-0 mt-1">
        <Icon className="h-5 w-5 text-pm-text-muted/40" />
      </div>
    </div>
  )
}

export default function ProgressPage() {
  const { __ } = useI18n()
  const { isPro, isProLicensed } = usePermissions()
  const { setOpen } = useProModal()

  if (isPro && !isProLicensed) return <Navigate to="/license" replace />

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-pm-text">
            {__('Progress')}
          </h1>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__('Track all project activity and team progress in one place')}
          </p>
        </div>
        {!isPro && <ProBadge label={__('Pro Required')} />}
      </div>

      {/* Progress preview card */}
      <div className="group relative rounded-xl border bg-card overflow-hidden">
        <div className="p-4">
          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {[
              { label: __('Activities Today'), value: '24', color: 'text-pm-accent' },
              { label: __('Tasks Completed'), value: '12', color: 'text-emerald-500' },
              { label: __('Comments'), value: '8', color: 'text-blue-500' },
              { label: __('Files Uploaded'), value: '3', color: 'text-amber-500' },
            ].map((stat) => (
              <div key={stat.label} className="bg-muted/30 rounded-lg px-4 py-3 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[15px] text-pm-text-muted mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Activity feed */}
          <div className="space-y-4">
            {MOCK_ACTIVITIES.map((group) => (
              <div key={group.date}>
                <div className="flex items-center gap-3 mb-2 px-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-pm-text-muted/70">{group.date}</h3>
                  <Separator className="flex-1" />
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <MockActivityItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Load more hint */}
          <div className="text-center pt-4 pb-2">
            <div className="inline-flex items-center gap-1 text-sm text-pm-text-muted/50">
              <span>{__('Showing 9 of 250+ activities')}</span>
            </div>
          </div>
        </div>

        {/* Pro overlay */}
        {!isPro && (
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setOpen(true)}
          >
            <div className="bg-white rounded-2xl px-8 py-6 shadow-xl text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-pm-accent/10 mb-4">
                <Activity className="h-7 w-7 text-pm-accent" />
              </div>
              <h3 className="text-lg font-bold text-pm-text mb-1">
                {__('Team Progress Tracker')}
              </h3>
              <p className="text-sm text-pm-text-muted mb-4 max-w-[250px]">
                {__('Track all team activities, task completions, and project updates in real-time.')}
              </p>
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
                style={{ background: '#ff9000' }}
              >
                <Crown className="h-5 w-5" />
                {__('Upgrade to Pro')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
