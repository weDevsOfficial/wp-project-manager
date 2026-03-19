import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import {
  fetchOverdueTasks, fetchCompletedTasks, fetchUserActivities,
  fetchUnassignedTasks, fetchMilestoneTasks, fetchAdvanceReport,
  fetchAssignedUsers, fetchReportProjects, exportReport,
  fetchReportSummary, exportReportSummary, clearSummary,
  setReportType, setFilters, resetFilters,
} from '@store/pro/reportsSlice'
import { useI18n } from '@hooks/useI18n'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Badge } from '@components/ui/badge'
import { Skeleton } from '@components/ui/skeleton'
import { Separator } from '@components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog'
import {
  Download, FileText, BarChart3, AlertTriangle, CheckCircle2, Users,
  Milestone, Eye, ArrowLeft, Filter, Maximize2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Helpers ─────────────────────────────────────────────
const BAR_COLORS = {
  estHours:  '#f77726',
  taskCount: '#4bc0c0',
  users:     '#36a2ec',
  assigned:  '#3498db',
  completed: '#2ecc71',
  pending:   '#f39c12',
  overdue:   '#e74c3c',
}

const EXPORTABLE = ['overdue-tasks', 'completed-tasks', 'user-activities', 'milestone', 'unassigned']

function formatDate(val) {
  if (!val) return '—'
  if (typeof val === 'string') return val.substring(0, 10)
  if (typeof val === 'object' && val.date) return val.date
  return '—'
}

function currentMonthStart() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function sumTime(items, key) {
  let total = 0
  items.forEach(p => {
    const tf = p[key] || '0:00'
    const parts = tf.split(':')
    total += (parseInt(parts[0]) || 0) * 3600 + (parseInt(parts[1]) || 0) * 60
  })
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  return `${h}:${String(m).padStart(2, '0')}`
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REPORT CARDS — Landing page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const REPORT_CARDS = [
  { key: 'overdue-tasks',    title: 'Overdue Task(s)',   desc: 'Generate a report based on tasks which are pending beyond due dates.',           icon: AlertTriangle, color: 'text-red-500',    bg: 'bg-red-50' },
  { key: 'completed-tasks',  title: 'Complete Task(s)',  desc: 'Generate a report from tasks which were completed.',                             icon: CheckCircle2,  color: 'text-green-500',  bg: 'bg-green-50' },
  { key: 'user-activities',  title: 'User Activities',   desc: 'Create a report based on an employee or all employee activity on tasks.',        icon: Users,         color: 'text-blue-500',   bg: 'bg-blue-50' },
  { key: 'milestone-tasks',  title: 'Task by Milestone', desc: 'Browse tasks reports according to Milestones (CSV exportable).',                 icon: Milestone,     color: 'text-purple-500', bg: 'bg-purple-50' },
  { key: 'unassigned-tasks', title: 'Unassigned Task',   desc: 'Find out all tasks which were not assigned to any employee.',                    icon: FileText,      color: 'text-cyan-500',   bg: 'bg-cyan-50' },
  { key: 'summary',          title: 'Summary',           desc: 'Browse summary reports with charts and estimation data (CSV exportable).',       icon: BarChart3,     color: 'text-pm-accent',  bg: 'bg-violet-50' },
]

function ReportLanding({ onSelect }) {
  const { __ } = useI18n()
  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-pm-text-primary">{__('Reports')}</h2>
        <p className="text-sm text-pm-text-muted mt-1">{__('Select a report type to view detailed data.')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_CARDS.map(card => {
          const Icon = card.icon
          return (
            <Card key={card.key} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 text-center">
                <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3', card.bg)}>
                  <Icon className={cn('w-7 h-7', card.color)} />
                </div>
                <h3 className="text-sm font-semibold text-pm-text mb-1.5">{__(card.title)}</h3>
                <p className="text-xs text-pm-text-muted mb-4 leading-relaxed">{__(card.desc)}</p>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => onSelect(card.key)}>
                  <Eye className="w-3.5 h-3.5 mr-1.5" />{__('View Full Report')}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TASK REPORT DETAIL (overdue, completed, etc.)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TaskReportFilters({ reportType, filters, allProjects, assignedUsers, onChange, onGenerate }) {
  const { __ } = useI18n()
  const showUser = ['overdue-tasks', 'completed-tasks', 'user-activities'].includes(reportType)

  return (
    <div className="flex flex-wrap items-end gap-3 mb-4">
      <div className="space-y-1">
        <Label className="text-[10px] font-medium uppercase text-pm-text-muted">{__('Start Date')}</Label>
        <Input type="date" value={filters.start_date || ''} onChange={(e) => onChange({ start_date: e.target.value })} className="h-8 text-sm w-36" />
      </div>
      <div className="space-y-1">
        <Label className="text-[10px] font-medium uppercase text-pm-text-muted">{__('End Date')}</Label>
        <Input type="date" value={filters.end_date || ''} onChange={(e) => onChange({ end_date: e.target.value })} className="h-8 text-sm w-36" />
      </div>
      <div className="space-y-1">
        <Label className="text-[10px] font-medium uppercase text-pm-text-muted">{__('Project')}</Label>
        <Select value={filters.project_id || 'all'} onValueChange={(v) => onChange({ project_id: v === 'all' ? '' : v })}>
          <SelectTrigger className="h-8 text-sm w-44"><SelectValue placeholder={__('All Projects')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{__('All Projects')}</SelectItem>
            {allProjects.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {showUser && (
        <div className="space-y-1">
          <Label className="text-[10px] font-medium uppercase text-pm-text-muted">{__('User')}</Label>
          <Select value={filters.user_id || 'all'} onValueChange={(v) => onChange({ user_id: v === 'all' ? '' : v })}>
            <SelectTrigger className="h-8 text-sm w-40"><SelectValue placeholder={__('All Users')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{__('All Users')}</SelectItem>
              {assignedUsers.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.display_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}
      <Button size="sm" className="h-8" onClick={onGenerate}>
        <Filter className="h-3.5 w-3.5 mr-1" />{__('Generate')}
      </Button>
    </div>
  )
}

function TaskResultsTable({ tasks, reportType }) {
  const { __ } = useI18n()
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-10 w-10 text-pm-text-muted/30 mx-auto mb-2" />
        <p className="text-sm text-pm-text-muted">{__('No results found. Try adjusting your filters.')}</p>
      </div>
    )
  }
  const dateLabel = reportType === 'completed-tasks' ? __('Completed At') : __('Due Date')
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">{__('Task')}</TableHead>
          <TableHead className="text-xs">{__('Project')}</TableHead>
          <TableHead className="text-xs">{__('List')}</TableHead>
          <TableHead className="text-xs">{dateLabel}</TableHead>
          <TableHead className="text-xs">{__('Created')}</TableHead>
          <TableHead className="text-xs">{__('Created By')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map(task => (
          <TableRow key={task.id}>
            <TableCell className="text-sm font-medium max-w-[200px] truncate">{task.title}</TableCell>
            <TableCell className="text-sm text-pm-text-muted">{task.project_title || '—'}</TableCell>
            <TableCell className="text-sm text-pm-text-muted">{task.task_list_title || '—'}</TableCell>
            <TableCell className="text-sm text-pm-text-muted">{reportType === 'completed-tasks' ? formatDate(task.completed_at) : formatDate(task.due_date)}</TableCell>
            <TableCell className="text-sm text-pm-text-muted">{formatDate(task.created_at)}</TableCell>
            <TableCell className="text-sm text-pm-text-muted">{task.creator?.data?.display_name || '—'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ActivityResults({ activities }) {
  const { __ } = useI18n()
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-10 w-10 text-pm-text-muted/30 mx-auto mb-2" />
        <p className="text-sm text-pm-text-muted">{__('No activities found.')}</p>
      </div>
    )
  }
  const grouped = {}
  activities.forEach(act => {
    const date = formatDate(act.committed_at || act.created_at)
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(act)
  })
  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, acts]) => (
        <div key={date}>
          <h4 className="text-xs font-semibold text-pm-text-muted uppercase mb-2">{date}</h4>
          <div className="space-y-1">
            {acts.map(act => (
              <div key={act.id} className="flex items-start gap-3 py-2 px-3 rounded hover:bg-muted/30">
                <Avatar className="h-6 w-6 mt-0.5">
                  <AvatarImage src={act.actor?.data?.avatar_url} />
                  <AvatarFallback className="text-[9px]">{(act.actor?.data?.display_name || 'U')[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: act.message || act.description || '' }} />
                  <span className="text-[10px] text-pm-text-muted">{act.committed_at?.time || act.created_at?.time || ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TaskReportDetail({ reportType, onBack }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { reportData, reportMeta, filters, assignedUsers, allProjects, loading } = useAppSelector(s => s.reports)

  useEffect(() => {
    dispatch(fetchAssignedUsers())
    dispatch(fetchReportProjects())
  }, [dispatch])

  const cardInfo = REPORT_CARDS.find(c => c.key === reportType)
  const Icon = cardInfo?.icon || FileText

  const handleGenerate = useCallback(() => {
    const f = filters
    switch (reportType) {
      case 'overdue-tasks':    dispatch(fetchOverdueTasks({ filters: f })); break
      case 'completed-tasks':  dispatch(fetchCompletedTasks({ filters: f })); break
      case 'user-activities':  dispatch(fetchUserActivities({ filters: f })); break
      case 'unassigned-tasks': dispatch(fetchUnassignedTasks({ filters: f })); break
      case 'milestone-tasks':  dispatch(fetchMilestoneTasks({ filters: f })); break
      default: break
    }
  }, [dispatch, reportType, filters])

  const handlePageChange = (page) => {
    dispatch(setFilters({ page }))
    setTimeout(() => handleGenerate(), 0)
  }

  const canExport = EXPORTABLE.some(e => reportType.includes(e))
  const isActivities = reportType === 'user-activities'
  const tasks = Array.isArray(reportData) ? reportData : []
  const totalPages = reportMeta?.total_page || reportMeta?.pagination?.total_pages || 1

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
          <Icon className={cn('h-5 w-5', cardInfo?.color || 'text-pm-accent')} />
          <h2 className="text-lg font-semibold text-pm-text-primary">{__(cardInfo?.title || 'Report')}</h2>
        </div>
        {canExport && reportData && (
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => dispatch(exportReport({ reportType, format: 'csv' }))}>
            <Download className="h-3.5 w-3.5 mr-1" />{__('CSV')}
          </Button>
        )}
      </div>

      <TaskReportFilters
        reportType={reportType}
        filters={filters}
        allProjects={allProjects}
        assignedUsers={assignedUsers}
        onChange={(p) => dispatch(setFilters(p))}
        onGenerate={handleGenerate}
      />

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : reportData === null ? (
            <div className="text-center py-16">
              <BarChart3 className="h-12 w-12 text-pm-text-muted/20 mx-auto mb-3" />
              <p className="text-sm text-pm-text-muted">{__('Select your filters and click Generate to view report.')}</p>
            </div>
          ) : isActivities ? (
            <div className="p-4"><ActivityResults activities={tasks} /></div>
          ) : (
            <TaskResultsTable tasks={tasks} reportType={reportType} />
          )}
        </CardContent>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-pm-border">
            <span className="text-xs text-pm-text-muted">{__('Page')} {filters.page || 1} {__('of')} {totalPages}</span>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-7 px-2" disabled={(filters.page || 1) <= 1} onClick={() => handlePageChange((filters.page || 1) - 1)}>{__('Prev')}</Button>
              <Button size="sm" variant="ghost" className="h-7 px-2" disabled={(filters.page || 1) >= totalPages} onClick={() => handlePageChange((filters.page || 1) + 1)}>{__('Next')}</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUMMARY REPORT — Charts via shadcn ChartContainer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SUMMARY_TYPES = [
  { value: 'all_project',   label: 'All Projects' },
  { value: 'task_type',     label: 'Task Type' },
  { value: 'sub_task_type', label: 'Subtask Type' },
  { value: 'all_user',      label: 'All Users' },
]

// ── Stat card ───────────────────────────────────────────
function StatCard({ label, value, color = 'text-pm-accent' }) {
  return (
    <Card className="p-3 min-w-[120px]">
      <div className="text-[10px] font-medium uppercase text-pm-text-muted mb-1">{label}</div>
      <div className={cn('text-xl font-bold', color)}>{value}</div>
    </Card>
  )
}

// ── Horizontal bar chart (shadcn ChartContainer) ────────
function HorizontalBarChart({ data, bars, height }) {
  const config = {}
  bars.forEach(b => { config[b.dataKey] = { label: b.name, color: b.fill } })

  if (!data || data.length === 0) return null

  const h = height || Math.max(200, data.length * 45)

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <ChartContainer config={config} className="w-full !aspect-auto" style={{ height: `${h}px` }}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={120} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {bars.map(b => (
              <Bar key={b.dataKey} dataKey={b.dataKey} fill={`var(--color-${b.dataKey})`} barSize={14} radius={[0, 4, 4, 0]} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ── Fullscreen Chart Dialog ─────────────────────────────
function FullscreenChartDialog({ open, onOpenChange, title, config, data, bars }) {
  if (!data || data.length === 0) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh]" data-pm-dialog>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 pt-2" style={{ height: '65vh' }}>
          <ChartContainer config={config} className="w-full h-full !aspect-auto">
            <BarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} width={35} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {bars.map(key => (
                <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[4, 4, 0, 0]} maxBarSize={40} />
              ))}
            </BarChart>
          </ChartContainer>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Small chart card with expand button ─────────────────
function ChartCardWithExpand({ title, config, data, bars, emptyText }) {
  const [expanded, setExpanded] = useState(false)
  const barKeys = bars || Object.keys(config)

  return (
    <>
      <Card>
        <CardHeader className="pb-1 pt-3 px-4 flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-semibold text-pm-text">{title}</CardTitle>
          {data && data.length > 0 && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(true)} title="Expand">
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {data && data.length > 0 ? (
            <ChartContainer config={config} className="w-full !aspect-auto" style={{ height: '260px' }}>
              <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={0} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} width={25} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {barKeys.map(key => (
                  <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[3, 3, 0, 0]} maxBarSize={18} />
                ))}
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-xs text-pm-text-muted">{emptyText || 'No data'}</div>
          )}
        </CardContent>
      </Card>
      <FullscreenChartDialog
        open={expanded}
        onOpenChange={setExpanded}
        title={title}
        config={config}
        data={data}
        bars={barKeys}
      />
    </>
  )
}

// ── All Projects Summary ────────────────────────────────
function AllProjectsSummary({ reports }) {
  const { __ } = useI18n()
  const rawProjects = reports?.projects?.data
  const projects = useMemo(() => {
    if (!rawProjects) return []
    if (Array.isArray(rawProjects)) return rawProjects
    return Object.values(rawProjects)
  }, [rawProjects])
  const meta = reports?.projects?.meta || {}
  const isSubtask = reports?.report_for === 'sub_task'

  const chartData = useMemo(() => {
    if (!projects || projects.length === 0) return []
    return projects.map(p => ({
      name: (p.title || '').length > 18 ? p.title.slice(0, 18) + '…' : p.title,
      estHours: isSubtask ? (p.sub_task_estimation_hours || 0) : (p.task_estimation_hours || 0),
      taskCount: isSubtask ? (p.total_incomplete_sub_tasks || 0) : (p.total_incomplete_tasks || 0),
      users: p.total_users || 0,
    }))
  }, [projects, isSubtask])

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <StatCard label={__('Total Estimation Hours')} value={isSubtask ? meta.total_sub_task_estimation_hours_tf : meta.total_task_estimation_hours_tf || '0:00'} />
        <StatCard label={isSubtask ? __('Total Subtasks') : __('Total Tasks')} value={isSubtask ? meta.total_incomplete_sub_tasks : meta.total_incomplete_tasks || 0} color="text-cyan-600" />
      </div>

      <HorizontalBarChart
        data={chartData}
        bars={[
          { dataKey: 'estHours', name: __('Est. Hours'), fill: BAR_COLORS.estHours },
          { dataKey: 'taskCount', name: isSubtask ? __('Subtasks') : __('Tasks'), fill: BAR_COLORS.taskCount },
          { dataKey: 'users', name: __('Users'), fill: BAR_COLORS.users },
        ]}
      />

      {projects.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{__('Project Name')}</TableHead>
                  <TableHead className="text-xs">{__('Users')}</TableHead>
                  <TableHead className="text-xs">{isSubtask ? __('Subtasks') : __('Tasks')}</TableHead>
                  <TableHead className="text-xs">{__('Est. Hour')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p, i) => (
                  <TableRow key={p.id || i}>
                    <TableCell className="text-sm font-medium">{p.title}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">
                      {(() => {
                        const ud = p.users?.data
                        if (!ud) return '—'
                        const arr = Array.isArray(ud) ? ud : Object.values(ud)
                        return arr.map(u => u.display_name).join(', ') || '—'
                      })()}
                    </TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{isSubtask ? p.total_incomplete_sub_tasks : p.total_incomplete_tasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{isSubtask ? p.sub_task_estimation_hours_tf : p.task_estimation_hours_tf || '0:00'}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell colSpan={2} className="text-sm">{__('Total')}</TableCell>
                  <TableCell className="text-sm">{isSubtask ? meta.total_incomplete_sub_tasks : meta.total_incomplete_tasks || 0}</TableCell>
                  <TableCell className="text-sm">{isSubtask ? meta.total_sub_task_estimation_hours_tf : meta.total_task_estimation_hours_tf || '0:00'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── All Users Summary ───────────────────────────────────
function AllUsersSummary({ reports }) {
  const { __ } = useI18n()
  const isSubtask = reports?.report_for === 'sub_task'
  const userData = isSubtask ? reports?.sub_task?.data : reports?.task?.data
  const meta = reports?.meta || {}
  const rawPl = reports?.projects?.data
  const projectsList = useMemo(() => {
    if (!rawPl) return []
    return Array.isArray(rawPl) ? rawPl : Object.values(rawPl)
  }, [rawPl])

  const chartData = useMemo(() => {
    if (!userData || typeof userData !== 'object') return []
    return Object.values(userData).map(item => ({
      name: (item.user?.display_name || '?').length > 14 ? item.user.display_name.slice(0, 14) + '…' : item.user?.display_name || '?',
      assigned: item.assigned_count || item.in_task_count || 0,
      completed: item.completed_count || 0,
      estHours: item.estimation_hours || 0,
    }))
  }, [userData])

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <StatCard label={__('Estimation Hours')} value={isSubtask ? meta.total_sub_task_estimation_hours_tf : meta.total_task_estimation_hours_tf || '0:00'} />
        <StatCard label={isSubtask ? __('Total Subtasks') : __('Total Tasks')} value={isSubtask ? meta.total_sub_tasks : meta.total_tasks || 0} color="text-cyan-600" />
        {projectsList.length > 0 && (
          <Card className="p-3 flex-1 min-w-[200px]">
            <div className="text-[10px] font-medium uppercase text-pm-text-muted mb-1">{__('Projects')}</div>
            <div className="text-sm text-pm-text truncate">{projectsList.map(p => p.title).join(', ')}</div>
          </Card>
        )}
      </div>

      <HorizontalBarChart
        data={chartData}
        bars={[
          { dataKey: 'assigned', name: isSubtask ? __('Assigned Subtasks') : __('Assigned Tasks'), fill: BAR_COLORS.assigned },
          { dataKey: 'completed', name: isSubtask ? __('Completed Subtasks') : __('Completed Tasks'), fill: BAR_COLORS.completed },
          { dataKey: 'estHours', name: __('Est. Hours'), fill: BAR_COLORS.estHours },
        ]}
      />

      {userData && Object.keys(userData).length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{__('User Name')}</TableHead>
                  <TableHead className="text-xs">{isSubtask ? __('Assigned Subtasks') : __('Assigned Tasks')}</TableHead>
                  <TableHead className="text-xs">{isSubtask ? __('Completed Subtasks') : __('Completed Tasks')}</TableHead>
                  <TableHead className="text-xs">{__('Est. Hour')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(userData).map((item, i) => (
                  <TableRow key={item.user?.id || i}>
                    <TableCell className="text-sm font-medium">{item.user?.display_name || '—'}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{item.assigned_count || item.in_task_count || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{item.completed_count || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{item.estimation_hours_tf || '0:00'}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell className="text-sm">{__('Total')}</TableCell>
                  <TableCell className="text-sm">{isSubtask ? meta.total_sub_tasks : meta.total_tasks || 0}</TableCell>
                  <TableCell className="text-sm">{Object.values(userData).reduce((s, u) => s + (u.completed_count || 0), 0)}</TableCell>
                  <TableCell className="text-sm">{isSubtask ? meta.total_sub_task_estimation_hours_tf : meta.total_task_estimation_hours_tf || '0:00'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── Task Type / Subtask Type Summary ────────────────────
function TaskTypeSummary({ reports, isSubtask = false }) {
  const { __ } = useI18n()
  const data = reports?.data || {}
  const meta = reports?.meta || {}
  const rawPl = reports?.projects?.data
  const projectsList = useMemo(() => {
    if (!rawPl) return []
    return Array.isArray(rawPl) ? rawPl : Object.values(rawPl)
  }, [rawPl])

  const chartData = useMemo(() => {
    if (!data || typeof data !== 'object') return []
    return Object.values(data).map(item => ({
      name: (item.type?.title || '?').length > 18 ? item.type.title.slice(0, 18) + '…' : item.type?.title || '?',
      assigned: item.total_assigned_tasks || item.total_incomplete_tasks || 0,
      completed: item.total_completed_tasks || 0,
      estHours: item.total_estimation_hours || 0,
    }))
  }, [data])

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <StatCard label={__('Total Estimation Hours')} value={meta.total_estimation_hours_tf || '0:00'} />
        <StatCard label={__('Total Tasks')} value={meta.total_incomplete_tasks || 0} color="text-cyan-600" />
        {projectsList.length > 0 && (
          <Card className="p-3 flex-1 min-w-[200px]">
            <div className="text-[10px] font-medium uppercase text-pm-text-muted mb-1">{__('Projects')}</div>
            <div className="text-sm text-pm-text truncate">{projectsList.map(p => p.title).join(', ')}</div>
          </Card>
        )}
      </div>

      <HorizontalBarChart
        data={chartData}
        bars={[
          { dataKey: 'assigned', name: __('Assigned Tasks'), fill: BAR_COLORS.assigned },
          { dataKey: 'completed', name: __('Completed Tasks'), fill: BAR_COLORS.completed },
          { dataKey: 'estHours', name: __('Est. Hours'), fill: BAR_COLORS.estHours },
        ]}
      />

      {Object.keys(data).length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{isSubtask ? __('Subtask Type Name') : __('Task Type Name')}</TableHead>
                  <TableHead className="text-xs">{__('Assigned Count')}</TableHead>
                  <TableHead className="text-xs">{__('Completed Count')}</TableHead>
                  <TableHead className="text-xs">{__('Est. Hour')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(data).map((item, i) => (
                  <TableRow key={item.type?.id || i}>
                    <TableCell className="text-sm font-medium">{item.type?.title || '—'}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{item.total_assigned_tasks || item.total_incomplete_tasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{item.total_completed_tasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{item.total_estimation_hours_tf || '0:00'}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell className="text-sm">{__('Total')}</TableCell>
                  <TableCell className="text-sm">{meta.total_assigned_tasks || meta.total_incomplete_tasks || 0}</TableCell>
                  <TableCell className="text-sm">{meta.total_completed_tasks || 0}</TableCell>
                  <TableCell className="text-sm">{meta.total_estimation_hours_tf || '0:00'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── User Report (individual) — 3 charts + 3 tables ──────
function UserReportSummary({ reports }) {
  const { __ } = useI18n()
  const users = reports?.users || {}
  const meta = reports?.meta || {}
  const projectsData = reports?.projects?.data || {}
  const tasksData = reports?.tasks?.data || {}
  const taskTypesData = reports?.task_types_detailed?.data || []
  const subtaskTypesData = reports?.subtask_types_detailed?.data || []
  const subTasksData = reports?.sub_tasks_details?.data || {}

  const allProjects = useMemo(() => {
    const result = []
    Object.values(projectsData).forEach(up => {
      const items = up?.data
      if (!items) return
      const arr = Array.isArray(items) ? items : Object.values(items)
      arr.forEach(p => result.push(p))
    })
    return result
  }, [projectsData])

  // ── Chart 1: All Projects ──
  const projectsChartData = useMemo(() => {
    return allProjects.map(p => ({
      name: (p.project?.title || '?').length > 15 ? p.project.title.slice(0, 15) + '…' : p.project?.title || '?',
      assigned: p.assigned_tasks || 0,
      completed: p.completed_tasks || 0,
      pending: p.pending_tasks || 0,
      overdue: p.overdue_tasks || 0,
    }))
  }, [allProjects])

  const projectsChartConfig = {
    assigned:  { label: __('Assigned Tasks'),  color: BAR_COLORS.assigned },
    completed: { label: __('Completed Tasks'), color: BAR_COLORS.completed },
    pending:   { label: __('Pending Tasks'),   color: BAR_COLORS.pending },
    overdue:   { label: __('Overdue Tasks'),   color: BAR_COLORS.overdue },
  }

  // ── Chart 2: Task Types ──
  const taskTypesChartData = useMemo(() => {
    if (!Array.isArray(taskTypesData)) return []
    return taskTypesData.map(t => ({
      name: t.type || '?',
      assigned: t.assigned || 0,
      completed: t.completed || 0,
      pending: t.pending || 0,
      overdue: t.overdue || 0,
    }))
  }, [taskTypesData])

  // ── Chart 3: Sub-Task Types ──
  const subtaskTypesChartData = useMemo(() => {
    if (!Array.isArray(subtaskTypesData)) return []
    return subtaskTypesData.map(t => ({
      name: t.type || '?',
      assigned: t.assigned || 0,
      completed: t.completed || 0,
      pending: t.pending || 0,
      overdue: t.overdue || 0,
    }))
  }, [subtaskTypesData])

  const typeChartConfig = {
    assigned:  { label: __('Assigned'),  color: BAR_COLORS.assigned },
    completed: { label: __('Completed'), color: BAR_COLORS.completed },
    pending:   { label: __('Pending'),   color: BAR_COLORS.pending },
    overdue:   { label: __('Overdue'),   color: BAR_COLORS.overdue },
  }

  // All tasks flattened
  const allTasks = useMemo(() => {
    const result = []
    Object.values(tasksData).forEach(ut => {
      const arr = ut?.data
      if (!arr) return
      ;(Array.isArray(arr) ? arr : Object.values(arr)).forEach(t => result.push(t))
    })
    return result
  }, [tasksData])

  // All subtasks flattened
  const allSubtasks = useMemo(() => {
    const result = []
    Object.values(subTasksData).forEach(ut => {
      const arr = ut?.data
      if (!arr) return
      ;(Array.isArray(arr) ? arr : Object.values(arr)).forEach(t => result.push(t))
    })
    return result
  }, [subTasksData])

  const userNames = Object.values(users).map(u => u.display_name).filter(Boolean)

  return (
    <div>
      {/* User header */}
      {userNames.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <Label className="text-sm font-semibold text-pm-text">{__('User Name')}</Label>
          <Badge variant="outline" className="text-sm">{userNames.join(', ')}</Badge>
        </div>
      )}

      {/* Meta stat cards — full width, 5 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {Object.entries(meta).map(([userId]) => {
          const projects = projectsData[userId]?.data
          const arr = !projects ? [] : Array.isArray(projects) ? projects : Object.values(projects)
          return (
            <React.Fragment key={userId}>
              <StatCard label={__('Total Estimation Hours')} value={sumTime(arr, 'estimated_hours_tf')} />
              <StatCard label={__('Total Working Hours')} value={sumTime(arr, 'working_hours_tf')} color="text-green-600" />
              <StatCard label={__('Completed Tasks')} value={arr.reduce((t, p) => t + (p.completed_tasks || 0), 0)} color="text-cyan-600" />
              <StatCard label={__('Completed Subtasks')} value={arr.reduce((t, p) => t + (p.completed_subtasks || 0), 0)} color="text-violet-600" />
              <StatCard label={__('Avg. Hour Per-task')} value={(() => {
                const totalEst = arr.reduce((t, p) => t + (parseFloat(p.estimated_hours) || 0), 0)
                const totalTasks = arr.reduce((t, p) => t + (p.assigned_tasks || 0) + (p.assigned_subtasks || 0), 0)
                if (!totalTasks) return '0:00'
                const avg = totalEst / totalTasks
                const h = Math.floor(avg); const m = Math.round((avg - h) * 60)
                return `${h}:${String(m).padStart(2, '0')}`
              })()} color="text-amber-600" />
            </React.Fragment>
          )
        })}
      </div>

      {/* ── 3 Charts side by side with expand buttons ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <ChartCardWithExpand
          title={__('All Projects Graph')}
          config={projectsChartConfig}
          data={projectsChartData}
          bars={['assigned', 'completed', 'pending', 'overdue']}
          emptyText={__('No data')}
        />
        <ChartCardWithExpand
          title={__('Task Types Graph')}
          config={typeChartConfig}
          data={taskTypesChartData}
          bars={['assigned', 'completed', 'pending', 'overdue']}
          emptyText={__('No data')}
        />
        <ChartCardWithExpand
          title={__('Sub-Task Types Graph')}
          config={typeChartConfig}
          data={subtaskTypesChartData}
          bars={['assigned', 'completed', 'pending', 'overdue']}
          emptyText={__('No data')}
        />
      </div>

      {/* ── Table 1: Projects Report ── */}
      {allProjects.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-pm-text">{__('Projects Report')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{__('Project Title')}</TableHead>
                  <TableHead className="text-xs">{__('Assigned Tasks')}</TableHead>
                  <TableHead className="text-xs">{__('Completed Tasks')}</TableHead>
                  <TableHead className="text-xs">{__('Assigned Sub-tasks')}</TableHead>
                  <TableHead className="text-xs">{__('Completed Sub-tasks')}</TableHead>
                  <TableHead className="text-xs">{__('Pending Tasks')}</TableHead>
                  <TableHead className="text-xs">{__('Overdue Tasks')}</TableHead>
                  <TableHead className="text-xs">{__('Pending Sub-tasks')}</TableHead>
                  <TableHead className="text-xs">{__('Overdue Sub-tasks')}</TableHead>
                  <TableHead className="text-xs">{__('Working Hours')}</TableHead>
                  <TableHead className="text-xs">{__('Estimated Hours')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProjects.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-medium">{p.project?.title || '—'}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{p.assigned_tasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{p.completed_tasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{p.assigned_subtasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{p.completed_subtasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{p.pending_tasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{p.overdue_tasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{p.pending_subtasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{p.overdue_subtasks || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{p.working_hours_tf || '0:00'}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{p.estimated_hours_tf || '0:00'}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell className="text-sm">{__('Total')}</TableCell>
                  <TableCell className="text-sm">{allProjects.reduce((t, p) => t + (p.assigned_tasks || 0), 0)}</TableCell>
                  <TableCell className="text-sm">{allProjects.reduce((t, p) => t + (p.completed_tasks || 0), 0)}</TableCell>
                  <TableCell className="text-sm">{allProjects.reduce((t, p) => t + (p.assigned_subtasks || 0), 0)}</TableCell>
                  <TableCell className="text-sm">{allProjects.reduce((t, p) => t + (p.completed_subtasks || 0), 0)}</TableCell>
                  <TableCell className="text-sm">{allProjects.reduce((t, p) => t + (p.pending_tasks || 0), 0)}</TableCell>
                  <TableCell className="text-sm">{allProjects.reduce((t, p) => t + (p.overdue_tasks || 0), 0)}</TableCell>
                  <TableCell className="text-sm">{allProjects.reduce((t, p) => t + (p.pending_subtasks || 0), 0)}</TableCell>
                  <TableCell className="text-sm">{allProjects.reduce((t, p) => t + (p.overdue_subtasks || 0), 0)}</TableCell>
                  <TableCell className="text-sm">{sumTime(allProjects, 'working_hours_tf')}</TableCell>
                  <TableCell className="text-sm">{sumTime(allProjects, 'estimated_hours_tf')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ── Table 2: Tasks Report ── */}
      {allTasks.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-pm-text">{__('Tasks Report')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{__('Completed At')}</TableHead>
                  <TableHead className="text-xs">{__('Assigned At')}</TableHead>
                  <TableHead className="text-xs">{__('Task Title')}</TableHead>
                  <TableHead className="text-xs">{__('Sub-tasks (#)')}</TableHead>
                  <TableHead className="text-xs">{__('Project Title')}</TableHead>
                  <TableHead className="text-xs">{__('Task Type')}</TableHead>
                  <TableHead className="text-xs">{__('Status')}</TableHead>
                  <TableHead className="text-xs">{__('Working Hours')}</TableHead>
                  <TableHead className="text-xs">{__('Est. Hours')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTasks.map((task, i) => (
                  <TableRow key={task.id || i}>
                    <TableCell className="text-sm text-pm-text-muted">{task.completed_at_display || 'N/A'}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{task.assigned_at_display || '—'}</TableCell>
                    <TableCell className="text-sm font-medium text-pm-accent">{task.title}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{task.subtasks_count || 0}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{task.project_title || '—'}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{task.type?.title || '—'}</TableCell>
                    <TableCell className="text-sm">
                      <span className={cn('font-medium', {
                        'text-green-600': task.status_label === 'Completed',
                        'text-red-500': task.status_label === 'Overdue',
                        'text-amber-500': task.status_label === 'Pending',
                      })}>{task.status_label || '—'}</span>
                    </TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{task.working_hours_tf || '0:00'}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{task.estimation_tf || '0:00'}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell className="text-sm">{__('Total')}</TableCell>
                  <TableCell colSpan={6} />
                  <TableCell className="text-sm">{sumTime(allTasks, 'working_hours_tf')}</TableCell>
                  <TableCell className="text-sm">{reports?.tasks?.meta?.total_hours_tf || sumTime(allTasks, 'estimation_tf')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ── Table 3: Sub-tasks Report ── */}
      {allSubtasks.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-pm-text">{__('Sub-tasks Report')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{__('Completed At')}</TableHead>
                  <TableHead className="text-xs">{__('Assigned At')}</TableHead>
                  <TableHead className="text-xs">{__('Sub-task Title')}</TableHead>
                  <TableHead className="text-xs">{__('Task Title')}</TableHead>
                  <TableHead className="text-xs">{__('Project Title')}</TableHead>
                  <TableHead className="text-xs">{__('Sub-task Type')}</TableHead>
                  <TableHead className="text-xs">{__('Status')}</TableHead>
                  <TableHead className="text-xs">{__('Est. Hours')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSubtasks.map((st, i) => (
                  <TableRow key={st.id || i}>
                    <TableCell className="text-sm text-pm-text-muted">{st.completed_at_display || 'N/A'}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{st.assigned_at_display || '—'}</TableCell>
                    <TableCell className="text-sm font-medium text-pm-accent">{st.title}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{st.parent_task_title || '—'}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{st.project_title || '—'}</TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{st.type?.title || '—'}</TableCell>
                    <TableCell className="text-sm">
                      <span className={cn('font-medium', {
                        'text-green-600': st.status_label === 'Completed',
                        'text-red-500': st.status_label === 'Overdue',
                        'text-amber-500': st.status_label === 'Pending',
                      })}>{st.status_label || '—'}</span>
                    </TableCell>
                    <TableCell className="text-sm text-pm-text-muted">{st.estimation_tf || '0:00'}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell className="text-sm">{__('Total')}</TableCell>
                  <TableCell colSpan={6} />
                  <TableCell className="text-sm">{reports?.sub_tasks_details?.meta?.total_hours_tf || sumTime(allSubtasks, 'estimation_tf')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ── Task Type Report Table ── */}
      {taskTypesData.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-pm-text">{__('Task Type Report')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{__('Type')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Assigned')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Completed')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Pending')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Overdue')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Working Hour')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Est H')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskTypesData.map((td, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-semibold">{td.type}</TableCell>
                    <TableCell className="text-sm text-center">{td.assigned || 0}</TableCell>
                    <TableCell className="text-sm text-center text-green-600 font-medium">{td.completed || 0}</TableCell>
                    <TableCell className="text-sm text-center text-amber-500 font-medium">{td.pending || 0}</TableCell>
                    <TableCell className="text-sm text-center text-red-500 font-medium">{td.overdue || 0}</TableCell>
                    <TableCell className="text-sm text-center">{td.working_hours || '0:00'}</TableCell>
                    <TableCell className="text-sm text-center">{td.est_hours || '0:00'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ── Sub Task Type Report Table ── */}
      {subtaskTypesData.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-pm-text">{__('Sub Task Type Report')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{__('Type')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Assigned')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Completed')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Pending')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Overdue')}</TableHead>
                  <TableHead className="text-xs text-center">{__('Est H')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subtaskTypesData.map((td, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-semibold">{td.type}</TableCell>
                    <TableCell className="text-sm text-center">{td.assigned || 0}</TableCell>
                    <TableCell className="text-sm text-center text-green-600 font-medium">{td.completed || 0}</TableCell>
                    <TableCell className="text-sm text-center text-amber-500 font-medium">{td.pending || 0}</TableCell>
                    <TableCell className="text-sm text-center text-red-500 font-medium">{td.overdue || 0}</TableCell>
                    <TableCell className="text-sm text-center">{td.est_hours || '0:00'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── Summary Report Container ────────────────────────────
function SummaryReportView({ onBack }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { summaryData, summaryLoading, assignedUsers, allProjects } = useAppSelector(s => s.reports)

  const [reportKind, setReportKind] = useState('summary')
  const [summaryType, setSummaryType] = useState('all_project')
  const [startDate, setStartDate] = useState(currentMonthStart())
  const [endDate, setEndDate] = useState(today())
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedProjects, setSelectedProjects] = useState([])
  const [showForm, setShowForm] = useState(true)

  useEffect(() => {
    dispatch(fetchAssignedUsers())
    dispatch(fetchReportProjects())
  }, [dispatch])

  // Parse legacy URL params on mount
  useEffect(() => {
    const hash = window.location.hash
    const qIdx = hash.indexOf('?')
    if (qIdx === -1) return
    const params = new URLSearchParams(hash.substring(qIdx))
    if (params.get('report_query') !== 'yes') return
    const t = params.get('type') || 'summary'
    const st = params.get('summaryType') || 'all_project'
    const sd = params.get('startDate') || currentMonthStart()
    const ed = params.get('endDate') || today()
    const u = params.get('users') || ''
    setReportKind(t)
    setSummaryType(st)
    setStartDate(sd)
    setEndDate(ed)
    setSelectedUser(u)
    setShowForm(false)
    dispatch(fetchReportSummary({ type: t, summaryType: st, startDate: sd, endDate: ed, users: u || undefined, estimated_time: params.get('estimated_time') || 'task_estimation' }))
  }, [])

  const handleRunReport = () => {
    if (reportKind === 'user' && !selectedUser) return
    setShowForm(false)
    const params = new URLSearchParams()
    params.set('type', reportKind)
    params.set('summaryType', summaryType)
    params.set('startDate', startDate)
    params.set('endDate', endDate)
    params.set('estimated_time', 'task_estimation')
    params.set('report_query', 'yes')
    if (selectedUser) params.set('users', selectedUser)
    navigate(`/reports/report-summary?${params.toString()}`, { replace: true })
    dispatch(fetchReportSummary({
      type: reportKind, summaryType, startDate, endDate,
      users: selectedUser || undefined,
      projects: selectedProjects.length > 0 ? selectedProjects : undefined,
      estimated_time: 'task_estimation',
    }))
  }

  const handleExportCsv = () => {
    dispatch(exportReportSummary({
      type: reportKind, summaryType, startDate, endDate,
      users: selectedUser || undefined,
      projects: selectedProjects.length > 0 ? selectedProjects : undefined,
      estimated_time: 'task_estimation',
    }))
  }

  const reportTypeLabel = useMemo(() => {
    if (!summaryData) return ''
    const t = summaryData.type || ''
    if (t.includes('all_projects') || t === 'get_summary_all_projects_by_task_estimated_time') return 'all_project'
    if (t === 'task_type_summary') return 'task_type'
    if (t === 'sub_task_type_summary') return 'sub_task_type'
    if (t.includes('user_all_projects') || t === 'get_user_all_projects_by_task_estimated_time') return 'all_user'
    if (t === 'get_users_by_task_estimated_time') return 'user_report'
    return summaryType
  }, [summaryData, summaryType])

  const showProjectFilter = reportKind === 'summary' && ['all_user', 'task_type', 'sub_task_type'].includes(summaryType)

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
          <BarChart3 className="h-5 w-5 text-pm-accent" />
          <h2 className="text-lg font-semibold text-pm-text-primary">{__('Summary Report')}</h2>
          {summaryData && startDate && endDate && (
            <span className="text-sm text-pm-text-muted ml-2">
              <span className="font-medium text-pm-accent">{startDate}</span>
              {' '}{__('to')}{' '}
              <span className="font-medium text-pm-accent">{endDate}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowForm(true)}>
            <Filter className="h-3.5 w-3.5 mr-1" />{__('Filter')}
          </Button>
          {summaryData && (
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleExportCsv}>
              <Download className="h-3.5 w-3.5 mr-1" />{__('Export CSV')}
            </Button>
          )}
        </div>
      </div>

      {/* Filter Form — single-line compact layout using shadcn */}
      {showForm && (
        <Card className="mb-5 border-pm-accent/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              {/* Report type (RadioGroup) */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium uppercase text-pm-text-muted">{__('Report Type')}</Label>
                <RadioGroup value={reportKind} onValueChange={setReportKind} className="flex gap-3">
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="summary" id="rt-summary" />
                    <Label htmlFor="rt-summary" className="text-sm cursor-pointer">{__('Summary')}</Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="user" id="rt-user" />
                    <Label htmlFor="rt-user" className="text-sm cursor-pointer">{__('User')}</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator orientation="vertical" className="h-8 hidden sm:block" />

              {/* Summary type (only for summary) */}
              {reportKind === 'summary' && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase text-pm-text-muted">{__('Summary Type')}</Label>
                  <Select value={summaryType} onValueChange={setSummaryType}>
                    <SelectTrigger className="h-8 text-sm w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SUMMARY_TYPES.map(st => <SelectItem key={st.value} value={st.value}>{__(st.label)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* User selector (only for user type) */}
              {reportKind === 'user' && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase text-pm-text-muted">{__('User')}</Label>
                  <Select value={selectedUser || 'none'} onValueChange={(v) => setSelectedUser(v === 'none' ? '' : v)}>
                    <SelectTrigger className="h-8 text-sm w-44"><SelectValue placeholder={__('Select User')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{__('Select User')}</SelectItem>
                      {assignedUsers.map(u => <SelectItem key={u.id || u.user_id} value={String(u.user_id || u.id)}>{u.display_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Project filter */}
              {showProjectFilter && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase text-pm-text-muted">{__('Project')}</Label>
                  <Select value={selectedProjects[0] ? String(selectedProjects[0]) : 'all'} onValueChange={(v) => setSelectedProjects(v === 'all' ? [] : [v])}>
                    <SelectTrigger className="h-8 text-sm w-40"><SelectValue placeholder={__('All Projects')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{__('All Projects')}</SelectItem>
                      {allProjects.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator orientation="vertical" className="h-8 hidden sm:block" />

              {/* Date range */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium uppercase text-pm-text-muted">{__('Start Date')}</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-8 text-sm w-36" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium uppercase text-pm-text-muted">{__('End Date')}</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-8 text-sm w-36" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button size="sm" className="h-8" onClick={handleRunReport}>{__('Run Report')}</Button>
                <Button size="sm" variant="ghost" className="h-8" onClick={() => setShowForm(false)}>{__('Cancel')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {summaryLoading ? (
        <div className="space-y-3">
          <div className="flex gap-3"><Skeleton className="h-20 w-36" /><Skeleton className="h-20 w-36" /></div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : !summaryData ? (
        <Card>
          <CardContent className="p-0">
            <div className="text-center py-16">
              <BarChart3 className="h-12 w-12 text-pm-text-muted/20 mx-auto mb-3" />
              <p className="text-sm text-pm-text-muted">{__('Configure your filters and click Run Report to generate summary.')}</p>
            </div>
          </CardContent>
        </Card>
      ) : reportTypeLabel === 'all_project' ? (
        <AllProjectsSummary reports={summaryData} />
      ) : reportTypeLabel === 'all_user' ? (
        <AllUsersSummary reports={summaryData} />
      ) : reportTypeLabel === 'task_type' ? (
        <TaskTypeSummary reports={summaryData} />
      ) : reportTypeLabel === 'sub_task_type' ? (
        <TaskTypeSummary reports={summaryData} isSubtask />
      ) : reportTypeLabel === 'user_report' ? (
        <UserReportSummary reports={summaryData} />
      ) : (
        <Card>
          <CardContent className="p-4">
            <pre className="text-xs text-pm-text-muted overflow-auto max-h-96">{JSON.stringify(summaryData, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ProReportsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const isSummaryRoute = location.pathname.includes('report-summary')
  const [activeReport, setActiveReport] = useState(null)

  useEffect(() => {
    if (isSummaryRoute) setActiveReport('summary')
  }, [isSummaryRoute])

  const handleSelectReport = (key) => {
    if (key === 'summary') {
      navigate('/reports/report-summary')
      setActiveReport('summary')
    } else {
      dispatch(setReportType(key))
      dispatch(resetFilters())
      setActiveReport(key)
    }
  }

  const handleBack = () => {
    setActiveReport(null)
    dispatch(clearSummary())
    navigate('/reports')
  }

  if (activeReport === 'summary') return <SummaryReportView onBack={handleBack} />
  if (activeReport) return <TaskReportDetail reportType={activeReport} onBack={handleBack} />
  return <ReportLanding onSelect={handleSelectReport} />
}
