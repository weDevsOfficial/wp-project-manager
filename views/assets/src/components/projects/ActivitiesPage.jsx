import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { Button } from '@components/ui/button'
import { Skeleton } from '@components/ui/skeleton'
import { Badge } from '@components/ui/badge'
import { Separator } from '@components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import {
  ArrowLeft, Activity, CheckSquare, FolderKanban, MessageSquare,
  FileText, Milestone, Trash2, Edit3, ArrowUpDown, Plus,
  ChevronDown, Loader2,
} from 'lucide-react'
import { extractDateStr, userInitials } from '@lib/pm-utils'
import { cn } from '@lib/utils'

// ── Action icon map ──────────────────────────────────────
const ACTION_ICON_MAP = {
  create_project: FolderKanban,
  update_project: Edit3,
  update_project_title: Edit3,
  delete_project: Trash2,
  create_task: CheckSquare,
  update_task: Edit3,
  update_task_title: Edit3,
  update_task_description: Edit3,
  update_task_status: ArrowUpDown,
  update_task_start_at: Edit3,
  update_task_start_at_date: Edit3,
  update_task_due_date: Edit3,
  update_task_estimation: Edit3,
  update_task_priority: Edit3,
  delete_task: Trash2,
  complete_task: CheckSquare,
  incomplete_task: CheckSquare,
  create_task_list: Plus,
  update_task_list_title: Edit3,
  delete_task_list: Trash2,
  create_milestone: Milestone,
  update_milestone_title: Edit3,
  delete_milestone: Trash2,
  create_discussion_board: MessageSquare,
  update_discussion_board_title: Edit3,
  delete_discussion_board: Trash2,
  comment_on_task: MessageSquare,
  comment_on_discussion_board: MessageSquare,
  comment_on_project: MessageSquare,
  reply_comment_on_task: MessageSquare,
  update_comment_on_task: Edit3,
  delete_comment_on_task: Trash2,
  upload_file: FileText,
  create_file: FileText,
  delete_file: Trash2,
}

const ACTION_COLOR_MAP = {
  create: 'bg-emerald-500',
  update: 'bg-blue-500',
  delete: 'bg-red-500',
}

const ACTION_LABELS = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
}

// ── Fallback messages for actions PHP doesn't cover ──────
const ACTION_FALLBACKS = {
  create_project: 'created a project',
  update_project_title: 'updated project title',
  create_task: 'created a task',
  delete_task: 'deleted a task',
  update_task_title: 'updated task title',
  update_task_description: 'updated task description',
  update_task_status: 'updated task status',
  update_task_start_at: 'updated task start date',
  update_task_start_at_date: 'updated task start date',
  update_task_due_date: 'updated task due date',
  update_task_estimation: 'updated task estimation',
  update_task_priority: 'updated task priority',
  create_task_list: 'created a task list',
  delete_task_list: 'deleted a task list',
  update_task_list_title: 'updated task list title',
  create_milestone: 'created a milestone',
  delete_milestone: 'deleted a milestone',
  create_discussion_board: 'created a discussion',
  comment_on_task: 'commented on a task',
  comment_on_discussion_board: 'commented on a discussion',
  comment_on_project: 'commented on a project',
  reply_comment_on_task: 'replied to a comment',
}

function parseMessage(activity) {
  const actor = activity.actor?.data || {}
  const meta = activity.meta || {}
  let msg = activity.message || ''

  if (!msg) {
    const fallback = ACTION_FALLBACKS[activity.action]
    if (fallback) {
      const title = meta.task_title || meta.task_list_title || meta.project_title
        || meta.milestone_title || meta.discussion_board_title || ''
      return title ? `${fallback} "${title}"` : fallback
    }
    return (activity.action || 'activity').replace(/_/g, ' ')
  }

  // Replace {{path.to.value}} placeholders
  msg = msg.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const keys = path.trim().split('.')
    const data = { actor: { data: actor }, meta }
    let val = data
    for (const k of keys) {
      if (val == null) return ''
      val = val[k]
    }
    return (val != null && typeof val !== 'object') ? String(val) : ''
  })

  // Remove the actor name from the beginning since we show it separately
  const actorName = actor.display_name || ''
  if (actorName && msg.startsWith(actorName)) {
    msg = msg.slice(actorName.length).replace(/^\s+/, '')
    // Capitalize first letter
    msg = msg.charAt(0).toUpperCase() + msg.slice(1)
  }

  return msg
}

function formatTime(committedAt) {
  if (!committedAt) return ''
  if (typeof committedAt === 'object' && committedAt.time) {
    try {
      const d = new Date(`1970-01-01T${committedAt.time}`)
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
      }
    } catch {}
    return committedAt.time?.slice(0, 5) || ''
  }
  return ''
}

function formatGroupDate(dateStr) {
  if (!dateStr) return 'Unknown'
  try {
    const d = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const dateOnly = new Date(d)
    dateOnly.setHours(0, 0, 0, 0)

    if (dateOnly.getTime() === today.getTime()) return 'Today'
    if (dateOnly.getTime() === yesterday.getTime()) return 'Yesterday'
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function groupByDate(activities) {
  const groups = []
  let currentDate = null
  let currentGroup = null

  for (const act of activities) {
    const dateStr = extractDateStr(act.committed_at)
    const dateKey = dateStr || 'Unknown'

    if (dateKey !== currentDate) {
      currentDate = dateKey
      currentGroup = { dateRaw: dateKey, date: formatGroupDate(dateKey), items: [] }
      groups.push(currentGroup)
    }
    currentGroup.items.push(act)
  }
  return groups
}

function ActivityItem({ act }) {
  const Icon = ACTION_ICON_MAP[act.action] || Activity
  const actor = act.actor?.data || {}
  const actionType = act.action_type || 'update'
  const timeStr = formatTime(act.committed_at)
  const badgeColor = ACTION_COLOR_MAP[actionType] || 'bg-gray-400'
  const badgeLabel = ACTION_LABELS[actionType] || actionType

  return (
    <div className="flex items-start gap-3 py-3 px-4 hover:bg-pm-hover/50 rounded-lg transition-colors">
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarImage src={actor.avatar_url} />
        <AvatarFallback className="text-[11px] font-semibold bg-pm-accent/10 text-pm-accent">
          {userInitials(actor.display_name ?? '?')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-pm-text">{actor.display_name || 'Unknown'}</span>
          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-4 font-medium border-0 text-white', badgeColor)}>
            {badgeLabel}
          </Badge>
        </div>
        <p className="text-sm text-pm-text-muted leading-snug">{parseMessage(act)}</p>
        {timeStr && (
          <span className="text-[11px] text-pm-text-muted/50 mt-1 inline-block">{timeStr}</span>
        )}
      </div>
      <div className="shrink-0 mt-1">
        <Icon className="h-4 w-4 text-pm-text-muted/40" />
      </div>
    </div>
  )
}

export default function ActivitiesPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const api = useApi()
  const { __ } = useI18n()

  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    api.get(`projects/${projectId}/activities`, { per_page: 20, page: 1 })
      .then((res) => {
        setActivities(res.data ?? [])
        const p = res.meta?.pagination
        setHasMore(p ? p.current_page < p.total_pages : false)
        setTotal(p?.total || 0)
        setPage(1)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [projectId])

  const loadMore = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    try {
      const res = await api.get(`projects/${projectId}/activities`, { per_page: 20, page: nextPage })
      setActivities((prev) => [...prev, ...(res.data ?? [])])
      const p = res.meta?.pagination
      setHasMore(p ? p.current_page < p.total_pages : false)
      setTotal(p?.total || 0)
      setPage(nextPage)
    } catch {}
    setLoadingMore(false)
  }

  const grouped = useMemo(() => groupByDate(activities), [activities])

  // Stats from loaded data
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    const todayItems = activities.filter(a => extractDateStr(a.committed_at) === todayStr)
    return {
      total: total || activities.length,
      today: todayItems.length,
      creates: activities.filter(a => a.action_type === 'create').length,
      updates: activities.filter(a => a.action_type === 'update').length,
    }
  }, [activities, total])

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/projects/${projectId}/task-lists`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-pm-text">{__('Activities')}</h1>
          <p className="text-sm text-pm-text-muted">{__('All changes and updates in this project')}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-start gap-3 py-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16">
          <Activity className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text mb-1">{__('No activities yet')}</h3>
          <p className="text-xs text-pm-text-muted">{__('Project activity will appear here.')}</p>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: __('Total'), value: stats.total, color: 'text-pm-accent' },
              { label: __('Today'), value: stats.today, color: 'text-emerald-500' },
              { label: __('Created'), value: stats.creates, color: 'text-blue-500' },
              { label: __('Updated'), value: stats.updates, color: 'text-amber-500' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-lg px-4 py-3 text-center border">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[11px] text-pm-text-muted mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Activity feed */}
          <div className="rounded-xl border bg-card">
            <div className="p-4 space-y-4">
              {grouped.map(group => (
                <div key={group.dateRaw}>
                  <div className="flex items-center gap-3 mb-2 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-pm-text-muted/70 whitespace-nowrap">
                      {group.date}
                    </h3>
                    <Separator className="flex-1" />
                    <span className="text-[10px] text-pm-text-muted/50">{group.items.length} {__('activities')}</span>
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((act, i) => (
                      <ActivityItem key={act.id || i} act={act} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Load more */}
              {hasMore && (
                <div className="text-center pt-2 pb-1">
                  <Button variant="outline" size="sm" onClick={loadMore} disabled={loadingMore} className="gap-2">
                    {loadingMore ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    {__('Load More')}
                  </Button>
                  <p className="text-[10px] text-pm-text-muted/50 mt-1.5">
                    {__('Showing')} {activities.length} {__('of')} {total || '...'} {__('activities')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
