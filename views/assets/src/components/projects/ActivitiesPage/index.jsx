import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useApi } from '@hooks/useApi';
import { useI18n } from '@hooks/useI18n';
import { usePermissions } from '@hooks/usePermissions';
import { useProModal } from '@components/common/ProUpgradeModal';
import ProBadge from '@components/common/ProBadge';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { Badge } from '@components/ui/badge';
import { Separator } from '@components/ui/separator';
import { Avatar, AvatarFallback } from '@components/ui/avatar';
import {
  Activity, CheckSquare, MessageSquare,
  FileText, Edit3, ArrowUpDown,
  ChevronDown, Loader2, BarChart2, Clock, PlusCircle, RefreshCw, Crown,
} from 'lucide-react';
import { extractDateStr } from '@lib/pm-utils';
import { cn } from '@lib/utils';
import { ACTION_COLOR_MAP, ACTION_LABELS } from './constants';
import { groupByDate } from './utils';
import ActivityItem from './parts/ActivityItem';
import TaskDetailSheet from '@components/tasks/TaskDetailSheet';

export default function ActivitiesPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { __, sprintf } = useI18n();
  const { isPro, isProLicensed } = usePermissions();
  const { setOpen } = useProModal();

  if (isPro && !isProLicensed) return <Navigate to="/license" replace />;

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isPro) return;
    setLoading(true);
    api.get(`projects/${projectId}/activities`, { per_page: 20, page: 1 })
      .then((res) => {
        setActivities(res.data ?? []);
        const p = res.meta?.pagination;
        setHasMore(p ? p.current_page < p.total_pages : false);
        setTotal(p?.total || 0);
        setPage(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId, isPro]);

  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await api.get(`projects/${projectId}/activities`, { per_page: 20, page: nextPage });
      setActivities((prev) => [...prev, ...(res.data ?? [])]);
      const p = res.meta?.pagination;
      setHasMore(p ? p.current_page < p.total_pages : false);
      setTotal(p?.total || 0);
      setPage(nextPage);
    } catch {}
    setLoadingMore(false);
  };

  const grouped = useMemo(() => groupByDate(activities, __), [activities, __]);

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayItems = activities.filter(a => extractDateStr(a.committed_at) === todayStr);
    return {
      total: total || activities.length,
      today: todayItems.length,
      creates: activities.filter(a => a.action_type === 'create').length,
      updates: activities.filter(a => a.action_type === 'update').length,
    };
  }, [activities, total]);

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-pm-text">{__('Activities')}</h1>
          <p className="text-sm text-pm-text-muted">{__('All changes and updates in this project')}</p>
        </div>
        {!isPro && <ProBadge label={__('Pro Required')} />}
      </div>

      {!isPro ? (
        <div className="group relative rounded-xl border bg-card overflow-hidden">
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: __('Total'),   value: '—', icon: BarChart2,  color: 'text-pm-accent bg-indigo-50' },
                { label: __('Today'),   value: '—', icon: Clock,      color: 'text-emerald-500 bg-emerald-50' },
                { label: __('Created'), value: '—', icon: PlusCircle, color: 'text-blue-500 bg-blue-50' },
                { label: __('Updated'), value: '—', icon: RefreshCw,  color: 'text-amber-500 bg-amber-50' },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl border bg-muted/20 p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color.split(' ')[1]}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color.split(' ')[0]}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold tabular-nums ${stat.color.split(' ')[0]}`}>{stat.value}</p>
                    <p className="text-[15px] text-pm-text-muted font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border bg-card">
              <div className="p-4 space-y-4">
                {['Today', 'Yesterday'].map(date => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-3 px-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-pm-text-muted/70 whitespace-nowrap">
                        {date}
                      </h3>
                      <Separator className="flex-1" />
                      <span className="text-[13px] text-pm-text-muted/50">3 activities</span>
                    </div>
                    <div className="space-y-0.5">
                      {[
                        { icon: CheckSquare, type: 'create', actor: 'Alex Johnson', message: 'created a task "Design system components"' },
                        { icon: Edit3, type: 'update', actor: 'Emma Davis', message: 'updated task description on "API endpoint setup"' },
                        { icon: ArrowUpDown, type: 'update', actor: 'Michael Chen', message: 'changed status to "In Progress" on "Database migration"' },
                        { icon: CheckSquare, type: 'create', actor: 'Sarah Wilson', message: 'created a task "Code review and testing"' },
                        { icon: MessageSquare, type: 'update', actor: 'James Brown', message: 'commented on "Frontend optimization"' },
                        { icon: FileText, type: 'update', actor: 'Lisa Anderson', message: 'uploaded new document "Requirements.pdf"' },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        const badgeColor = ACTION_COLOR_MAP[item.type] || 'bg-gray-400';
                        const badgeLabel = __(ACTION_LABELS[item.type] || item.type);
                        return (
                          <div key={i} className="flex items-start gap-3 py-3 px-4 hover:bg-pm-hover/50 rounded-lg transition-colors opacity-70">
                            <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                              <AvatarFallback className="text-[15px] font-semibold bg-pm-accent/10 text-pm-accent">
                                {item.actor.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-semibold text-pm-text">{item.actor}</span>
                                <Badge variant="outline" className={cn('text-[14px] px-1.5 py-0 h-4 font-medium border-0 text-white', badgeColor)}>
                                  {badgeLabel}
                                </Badge>
                              </div>
                              <p className="text-sm text-pm-text-muted leading-snug">{item.message}</p>
                            </div>
                            <div className="shrink-0 mt-1">
                              <Icon className="h-5 w-5 text-pm-text-muted/40" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setOpen(true)}
          >
            <div className="bg-white rounded-2xl px-8 py-6 shadow-xl text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-pm-accent/10 mb-4">
                <Activity className="h-7 w-7 text-pm-accent" />
              </div>
              <h3 className="text-lg font-bold text-pm-text-primary mb-1">
                {__('Project Activities')}
              </h3>
              <p className="text-sm text-pm-text-muted mb-4 max-w-[250px]">
                {__('View all changes, updates, and activities happening in your project in real-time.')}
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
        </div>
      ) : loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-start gap-3 py-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-50" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16">
          <Activity className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text mb-1">{__('No activities yet')}</h3>
          <p className="text-sm text-pm-text-muted">{__('Project activity will appear here.')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: __('Total'),   value: stats.total,   icon: BarChart2,  color: 'text-pm-accent bg-indigo-50' },
              { label: __('Today'),   value: stats.today,   icon: Clock,      color: 'text-emerald-500 bg-emerald-50' },
              { label: __('Created'), value: stats.creates, icon: PlusCircle, color: 'text-blue-500 bg-blue-50' },
              { label: __('Updated'), value: stats.updates, icon: RefreshCw,  color: 'text-amber-500 bg-amber-50' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl border bg-card p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color.split(' ')[1]}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color.split(' ')[0]}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold tabular-nums ${stat.color.split(' ')[0]}`}>{stat.value}</p>
                  <p className="text-[15px] text-pm-text-muted font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card">
            <div className="p-4 space-y-4">
              {grouped.map(group => (
                <div key={group.dateRaw}>
                  <div className="flex items-center gap-3 mb-2 px-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-pm-text-muted/70 whitespace-nowrap">
                      {group.date}
                    </h3>
                    <Separator className="flex-1" />
                    <span className="text-[13px] text-pm-text-muted/50">{group.items.length} {__('activities')}</span>
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((act, i) => (
                      <ActivityItem key={act.id || i} act={act} projectId={projectId} />
                    ))}
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="text-center pt-2 pb-1">
                  <Button variant="outline" size="sm" onClick={loadMore} disabled={loadingMore} className="gap-2">
                    {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
                    {__('Load More')}
                  </Button>
                  <p className="text-[13px] text-pm-text-muted/50 mt-1.5">
                    {sprintf(__('Showing %1$s of %2$s activities'), activities.length, total || '...')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <TaskDetailSheet />
    </div>
  );
}
