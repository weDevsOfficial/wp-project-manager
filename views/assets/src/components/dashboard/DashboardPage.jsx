import { __ } from '@wordpress/i18n'
import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react'
import { useApi } from '@hooks/useApi'
import { usePermissions, pmCanSeeUpgrade } from '@hooks/usePermissions'
import { Skeleton } from '@components/ui/skeleton'
import { cn } from '@lib/utils'

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
const MyWorkloadCard        = React.lazy(() => import('./parts/MyWorkloadCard'))

// Lazy card wrapper — own Suspense boundary so one card streaming in never
// blocks the others.
function Lazy({ h = 'h-72', children }) {
  return <Suspense fallback={<Skeleton className={`${h} w-full rounded-xl`} />}>{children}</Suspense>
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Skeleton className="h-72 w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const api = useApi()
  const requestSeqRef = useRef(0)
  const { isPro, canManage, isManagerAnywhere } = usePermissions()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refetching, setRefetching] = useState(false)
  const [range, setRange] = useState(7)
  const [error, setError] = useState(null)

  const load = useCallback(async (rangeArg = 7, isInitial = false) => {
    const seq = ++requestSeqRef.current
    if (isInitial) setLoading(true)
    else setRefetching(true)
    setError(null)
    try {
      const res = await api.get('dashboard', { range: rangeArg })
      if (seq === requestSeqRef.current) setData(res?.data ?? res)
    } catch (e) {
      if (seq === requestSeqRef.current) {
        setError(e?.message || __('Failed to load dashboard.', 'wedevs-project-manager'))
      }
    } finally {
      if (seq === requestSeqRef.current) {
        setLoading(false)
        setRefetching(false)
      }
    }
  }, [api])

  useEffect(() => { load(range, true) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onRangeChange = useCallback((r) => {
    setRange(r)
    load(r, false)
  }, [load])

  if (loading) {
    return <div className="p-4 sm:p-6"><LoadingState /></div>
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl border border-pm-border bg-card p-8 text-center">
          <p className="text-[14px] text-pm-text-muted mb-3">{error}</p>
          <button
            onClick={() => load(range, true)}
            className="rounded-lg bg-pm-accent px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-pm-accent-hover"
          >
            {__('Try again', 'wedevs-project-manager')}
          </button>
        </div>
      </div>
    )
  }

  const showTeam = canManage || isManagerAnywhere
  const thirdCard = showTeam
    ? <Lazy><TeamStatusCard team={data?.team} range={range} scope={data?.team?.scope} /></Lazy>
    : <Lazy><MyWorkloadCard workload={data?.my_workload} range={range} /></Lazy>

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <DashboardHeader
        user={data?.user}
        onTaskCreated={() => load(range, false)}
        range={range}
        onRangeChange={onRangeChange}
        loading={refetching}
      />

      <Lazy h="h-24"><KpiCards kpis={data?.kpis} range={range} /></Lazy>

      {/* Pro insights (module-gated, managers) */}
      {showTeam && isPro && <Lazy h="h-24"><ProInsightsRow /></Lazy>}

      {/* Performance (wide, range filter) + project status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Lazy h="h-72">
            <TaskPerformanceCard performance={data?.performance} range={range} />
          </Lazy>
        </div>
        <Lazy h="h-72"><ProjectStatusCard status={data?.projects_status} /></Lazy>
      </div>

      {/* What needs doing, and when. Highest-intent row, so it sits directly
          under the charts rather than at the bottom of the page. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Lazy><OverduePriorityCard items={data?.overdue_list} total={data?.overdue_total} /></Lazy>
        <Lazy><UpcomingScheduleCard items={data?.upcoming} total={data?.upcoming_total} /></Lazy>
        <Lazy h="h-80"><MiniCalendarCard calendar={data?.calendar} /></Lazy>
      </div>

      {/* Where the work lives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Lazy h="h-80"><ActiveProjectsCard projects={data?.active_projects} /></Lazy>
        </div>
        <Lazy><MilestonesCard milestones={data?.milestones} /></Lazy>
      </div>

      {/* Who and how — supporting context. A member with Pro gets neither the
          team card nor the upsell, so the row drops to two columns rather
          than leaving an empty third cell. */}
      <div className={cn('grid grid-cols-1 gap-5', thirdCard ? 'lg:grid-cols-3' : 'lg:grid-cols-2')}>
        <Lazy><TaskDistributionCard distribution={data?.task_distribution} /></Lazy>
        <Lazy><RecentActivityCard activity={data?.recent_activity} range={range} /></Lazy>
        {thirdCard}
      </div>

      {/* Ambient, not actionable — so it closes the page. The upsell rides
          alongside it rather than displacing a member's workload card. */}
      {/* The upsell tile is only useful to someone who can act on it, so a
          co-worker or client keeps the full-width heatmap instead. */}
      {isPro || !pmCanSeeUpgrade() ? (
        <Lazy h="h-44"><ProductivityHeatmapCard /></Lazy>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <Lazy h="h-44"><ProductivityHeatmapCard /></Lazy>
          </div>
          <Lazy h="h-44"><ProUpgradeCard /></Lazy>
        </div>
      )}
    </div>
  )
}
