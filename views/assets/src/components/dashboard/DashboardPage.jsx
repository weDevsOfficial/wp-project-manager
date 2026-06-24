import { __ } from '@wordpress/i18n'
import React, { useEffect, useState, useCallback, Suspense } from 'react'
import { useApi } from '@hooks/useApi'
import { usePermissions } from '@hooks/usePermissions'
import { Skeleton } from '@components/ui/skeleton'

// ── Header is eager (above the fold, tiny). Everything else is lazy-loaded
//    into its own chunk and streamed in behind a Skeleton fallback. ──
import DashboardHeader from './parts/DashboardHeader'

const KpiCards              = React.lazy(() => import('./parts/KpiCards'))
const ProInsightsRow        = React.lazy(() => import('./parts/ProInsightsRow'))
const TaskPerformanceCard   = React.lazy(() => import('./parts/TaskPerformanceCard'))
const ProjectStatusCard     = React.lazy(() => import('./parts/ProjectStatusCard'))
const ActiveProjectsCard    = React.lazy(() => import('./parts/ActiveProjectsCard'))
const MiniCalendarCard      = React.lazy(() => import('./parts/MiniCalendarCard'))
const ProductivityHeatmapCard = React.lazy(() => import('./parts/ProductivityHeatmapCard'))
const UpcomingScheduleCard  = React.lazy(() => import('./parts/UpcomingScheduleCard'))
const MilestonesCard        = React.lazy(() => import('./parts/MilestonesCard'))
const RecentActivityCard    = React.lazy(() => import('./parts/RecentActivityCard'))
const OverduePriorityCard   = React.lazy(() => import('./parts/OverduePriorityCard'))
const TaskDistributionCard  = React.lazy(() => import('./parts/TaskDistributionCard'))
const TeamStatusCard        = React.lazy(() => import('./parts/TeamStatusCard'))
const ProUpgradeCard        = React.lazy(() => import('./parts/ProUpgradeCard'))

// Lazy card wrapper — own Suspense boundary so one card streaming in never
// blocks the others.
function Lazy({ h = 'h-72', children }) {
  return <Suspense fallback={<Skeleton className={`${h} w-full`} />}>{children}</Suspense>
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-14 w-full" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="h-72 w-full lg:col-span-2" />
        <Skeleton className="h-72 w-full" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const api = useApi()
  const { isPro, canManage, isManagerAnywhere } = usePermissions()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refetching, setRefetching] = useState(false)
  const [range, setRange] = useState(7)
  const [error, setError] = useState(null)

  const load = useCallback(async (rangeArg = 7, isInitial = false) => {
    if (isInitial) setLoading(true)
    else setRefetching(true)
    setError(null)
    try {
      const res = await api.get('dashboard', { range: rangeArg })
      setData(res?.data ?? res)
    } catch (e) {
      setError(e?.message || __('Failed to load dashboard.', 'wedevs-project-manager'))
    } finally {
      setLoading(false)
      setRefetching(false)
    }
  }, [api])

  useEffect(() => { load(range, true) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onRangeChange = useCallback((r) => {
    setRange(r)
    load(r, false)
  }, [load])

  if (loading) {
    return <div className="p-4 sm:p-6 max-w-[1400px] mx-auto"><LoadingState /></div>
  }

  if (error) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="rounded-lg border border-pm-border bg-card p-8 text-center">
          <p className="text-[14px] text-pm-text-muted mb-3">{error}</p>
          <button onClick={() => load(range, true)} className="text-[13px] font-medium text-pm-accent hover:underline">
            {__('Try again', 'wedevs-project-manager')}
          </button>
        </div>
      </div>
    )
  }

  const showTeam = canManage || isManagerAnywhere
  const team = data?.team ?? []

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-5">
      <DashboardHeader user={data?.user} onTaskCreated={() => load(range, false)} />

      {/* Pro insights (module-gated, managers) */}
      {showTeam && isPro && <Lazy h="h-24"><ProInsightsRow /></Lazy>}

      <Lazy h="h-24"><KpiCards kpis={data?.kpis} /></Lazy>

      {/* Performance (wide, range filter) + project status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Lazy h="h-72">
            <TaskPerformanceCard
              performance={data?.performance}
              range={range}
              onRangeChange={onRangeChange}
              loading={refetching}
            />
          </Lazy>
        </div>
        <Lazy h="h-72"><ProjectStatusCard status={data?.projects_status} /></Lazy>
      </div>

      {/* Active projects (wide) + calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Lazy h="h-80"><ActiveProjectsCard projects={data?.active_projects} /></Lazy>
        </div>
        <Lazy h="h-80"><MiniCalendarCard calendar={data?.calendar} /></Lazy>
      </div>

      {/* Productivity heatmap (full width, self-fetches by year) */}
      <Lazy h="h-44"><ProductivityHeatmapCard /></Lazy>

      {/* Upcoming + milestones + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Lazy><UpcomingScheduleCard items={data?.upcoming} /></Lazy>
        <Lazy><MilestonesCard milestones={data?.milestones} /></Lazy>
        <Lazy><RecentActivityCard activity={data?.recent_activity} /></Lazy>
      </div>

      {/* Overdue + distribution + team / upgrade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Lazy><OverduePriorityCard items={data?.overdue_list} /></Lazy>
        <Lazy><TaskDistributionCard distribution={data?.task_distribution} /></Lazy>
        {showTeam
          ? <Lazy><TeamStatusCard team={team} /></Lazy>
          : (!isPro ? <Lazy><ProUpgradeCard /></Lazy> : null)}
      </div>
    </div>
  )
}
