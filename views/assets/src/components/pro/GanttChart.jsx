import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useI18n } from '@hooks/useI18n'
import { useApi } from '@hooks/useApi'
import { Skeleton } from '@components/ui/skeleton'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@components/ui/context-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import {
  Plus, ZoomIn, ZoomOut, Eye, Trash2, CheckCircle2, RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { addDays } from 'date-fns'
import {
  GanttProvider, GanttSidebar, GanttSidebarItem, GanttSidebarGroup,
  GanttTimeline, GanttHeader, GanttFeatureList, GanttFeatureListGroup,
  GanttFeatureItem, GanttToday,
} from './gantt/index'

/* ── Helpers ── */
function extractDate(v) {
  if (!v) return null
  if (typeof v === 'string' && v.length >= 10) return v.substring(0, 10)
  if (typeof v === 'object' && v.date) return String(v.date).substring(0, 10)
  return null
}
function toDateStr(d) { return d instanceof Date ? d.toISOString().split('T')[0] : String(d) }

const STATUS_COLORS = {
  project: { id: 'project', name: 'Project', color: '#7c3aed' },
  list:    { id: 'list',    name: 'List',    color: '#3b82f6' },
  active:  { id: 'active',  name: 'Active',  color: '#10b981' },
  done:    { id: 'done',    name: 'Done',    color: '#9ca3af' },
}

export default function GanttChart() {
  const { projectId } = useParams()
  const { __ } = useI18n()
  const api = useApi()

  const [loading, setLoading] = useState(true)
  const [features, setFeatures] = useState([])
  const [groups, setGroups] = useState([])
  const [addingTo, setAddingTo] = useState(null)
  const [addTitle, setAddTitle] = useState('')
  const [range, setRange] = useState('monthly')
  const [zoom, setZoom] = useState(100)
  const [detailItem, setDetailItem] = useState(null)

  // ── Load data ─────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!projectId) return
    try {
      const res = await api.get(`projects/${projectId}/task-lists`, {
        with: 'incomplete_tasks,complete_tasks',
        incomplete_task_per_page: -1,
        complete_task_per_page: -1,
        per_page: -1,
      })
      const lists = res?.data ?? []
      const allFeatures = []
      const allGroups = []

      lists.forEach(list => {
        const tasks = [
          ...(list.incomplete_tasks?.data || []),
          ...(list.complete_tasks?.data || []),
        ]
        const groupId = `list-${list.id}`

        allGroups.push({ id: groupId, name: list.title, rawId: list.id, type: 'list' })

        // List bar
        let minD = null, maxD = null
        tasks.forEach(t => {
          const s = extractDate(t.start_at) || extractDate(t.created_at)
          const e = extractDate(t.due_date)
          if (s && (!minD || s < minD)) minD = s
          if (e && (!maxD || e > maxD)) maxD = e
        })

        // Each task as a feature
        tasks.forEach(t => {
          const s = extractDate(t.start_at) || extractDate(t.created_at)
          const e = extractDate(t.due_date)
          const isDone = t.status === 'complete' || t.status === 1

          allFeatures.push({
            id: `t-${t.id}`,
            name: t.title,
            startAt: s ? new Date(s) : new Date(),
            endAt: e ? new Date(e) : addDays(s ? new Date(s) : new Date(), 3),
            status: isDone ? STATUS_COLORS.done : STATUS_COLORS.active,
            group: groupId,
            rawId: t.id,
            type: 'task',
            progress: isDone ? 1 : 0,
            assignees: t.assignees?.data || [],
            description: typeof t.description === 'string' ? t.description : (t.description?.content || ''),
          })
        })
      })

      setFeatures(allFeatures)
      setGroups(allGroups)
    } catch {} finally { setLoading(false) }
  }, [projectId, api])

  useEffect(() => { loadData() }, [loadData])

  // ── Group features by list ────────────────────────
  const groupedFeatures = useMemo(() => {
    const result = {}
    groups.forEach(g => { result[g.id] = { group: g, features: [] } })
    features.forEach(f => {
      if (result[f.group]) result[f.group].features.push(f)
    })
    return result
  }, [features, groups])

  // ── Actions ───────────────────────────────────────
  const handleMove = useCallback((id, startAt, endAt) => {
    if (!endAt) return
    const feature = features.find(f => f.id === id)
    if (!feature) return

    // Optimistic update
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, startAt, endAt } : f))

    // Save to API
    api.post(`projects/${projectId}/tasks/${feature.rawId}/update`, {
      title: feature.name,
      start_at: toDateStr(startAt),
      due_date: toDateStr(endAt),
    }).then(() => {
      toast.success(__('Task updated'))
    }).catch(() => {
      toast.error(__('Failed to update'))
      loadData() // revert
    })
  }, [features, api, projectId, __, loadData])

  const handleAddItem = useCallback(async () => {
    if (!addTitle.trim() || !addingTo) return
    try {
      if (addingTo.type === 'list') {
        await api.post(`projects/${projectId}/task-lists`, { title: addTitle.trim(), project_id: projectId })
      } else {
        await api.post(`projects/${projectId}/tasks`, { title: addTitle.trim(), board_id: addingTo.listId, project_id: projectId })
      }
      setAddTitle(''); setAddingTo(null)
      toast.success(addingTo.type === 'list' ? __('List created') : __('Task created'))
      loadData()
    } catch { toast.error(__('Failed to create')) }
  }, [addTitle, addingTo, api, projectId, __, loadData])

  const handleDelete = useCallback(async (feature) => {
    if (!window.confirm(`Delete "${feature.name}"?`)) return
    try {
      await api.post(`projects/${projectId}/tasks/${feature.rawId}/delete`)
      toast.success(__('Deleted'))
      loadData()
    } catch { toast.error(__('Failed to delete')) }
  }, [api, projectId, __, loadData])

  const handleToggleStatus = useCallback(async (feature) => {
    const newStatus = feature.progress >= 1 ? 0 : 1
    try {
      await api.post(`projects/${projectId}/tasks/${feature.rawId}/change-status`, { status: newStatus })
      toast.success(newStatus === 1 ? __('Completed') : __('Reopened'))
      loadData()
    } catch { toast.error(__('Failed')) }
  }, [api, projectId, __, loadData])

  // ── Loading ───────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{__('Gantt Chart')}</h2>
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{__('Daily')}</SelectItem>
              <SelectItem value="monthly">{__('Monthly')}</SelectItem>
              <SelectItem value="quarterly">{__('Quarterly')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(50, z - 25))}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{zoom}%</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(200, z + 25))}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setAddingTo({ type: 'list' })}>
            <Plus className="h-3.5 w-3.5 mr-1" />{__('Add List')}
          </Button>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="border rounded-lg" style={{ height: 'calc(100vh - 200px)' }}>
        <GanttProvider range={range} zoom={zoom} onAddItem={(date) => console.log('add at', date)}>
          {/* Sidebar */}
          <GanttSidebar>
            {Object.values(groupedFeatures).map(({ group, features: gFeatures }) => (
              <GanttSidebarGroup key={group.id} name={group.name}>
                {gFeatures.map(feature => (
                  <GanttSidebarItem
                    key={feature.id}
                    feature={feature}
                    onSelectItem={(id) => {
                      const f = features.find(ft => ft.id === id)
                      if (f) setDetailItem(f)
                    }}
                  />
                ))}
                {/* Add task button */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
                  onClick={() => setAddingTo({ type: 'task', listId: group.rawId })}
                >
                  <Plus className="h-3 w-3" />
                  <span>{__('Add Task')}</span>
                </div>
              </GanttSidebarGroup>
            ))}
          </GanttSidebar>

          {/* Timeline */}
          <GanttTimeline>
            <GanttHeader />
            <GanttFeatureList>
              {Object.values(groupedFeatures).map(({ group, features: gFeatures }) => (
                <GanttFeatureListGroup key={group.id}>
                  {gFeatures.map(feature => (
                    <div className="flex" key={feature.id}>
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <button type="button" onClick={() => setDetailItem(feature)} className="w-full">
                            <GanttFeatureItem {...feature} onMove={handleMove}>
                              <p className="flex-1 truncate text-xs">{feature.name}</p>
                              {feature.assignees?.length > 0 && (
                                <div className="flex -space-x-1 shrink-0">
                                  {feature.assignees.slice(0, 3).map(a => (
                                    <Avatar key={a.id} className="h-5 w-5 border border-white/50">
                                      {a.avatar_url ? (
                                        <AvatarImage src={a.avatar_url} alt={a.display_name} />
                                      ) : null}
                                      <AvatarFallback className="text-[7px] bg-primary/20">
                                        {(a.display_name || a.nicename || '?').slice(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                              )}
                            </GanttFeatureItem>
                          </button>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem className="flex items-center gap-2" onClick={() => setDetailItem(feature)}>
                            <Eye className="text-muted-foreground" size={16} />{__('View')}
                          </ContextMenuItem>
                          <ContextMenuItem className="flex items-center gap-2" onClick={() => handleToggleStatus(feature)}>
                            {feature.progress >= 1
                              ? <><RotateCcw className="text-muted-foreground" size={16} />{__('Reopen')}</>
                              : <><CheckCircle2 className="text-muted-foreground" size={16} />{__('Complete')}</>
                            }
                          </ContextMenuItem>
                          <ContextMenuItem className="flex items-center gap-2 text-destructive" onClick={() => handleDelete(feature)}>
                            <Trash2 size={16} />{__('Delete')}
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    </div>
                  ))}
                </GanttFeatureListGroup>
              ))}
            </GanttFeatureList>
            <GanttToday />
          </GanttTimeline>
        </GanttProvider>
      </div>

      {/* Add dialog */}
      <Dialog open={!!addingTo} onOpenChange={() => setAddingTo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{addingTo?.type === 'list' ? __('Add List') : __('Add Task')}</DialogTitle>
          </DialogHeader>
          <Input value={addTitle} onChange={(e) => setAddTitle(e.target.value)} placeholder={__('Title...')} autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddItem() }} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingTo(null)}>{__('Cancel')}</Button>
            <Button onClick={handleAddItem} className="bg-pm-accent hover:bg-pm-accent/90">{__('Create')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{detailItem?.name}</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: detailItem.status.color }} />
                <span className="text-muted-foreground">{detailItem.status.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">{__('Start')}: </span>{toDateStr(detailItem.startAt)}</div>
                <div><span className="text-muted-foreground">{__('End')}: </span>{detailItem.endAt ? toDateStr(detailItem.endAt) : '—'}</div>
              </div>
              {detailItem.description && (
                <p className="text-xs text-muted-foreground">
                  {typeof detailItem.description === 'string' ? detailItem.description : (detailItem.description?.content || detailItem.description?.html || '')}
                </p>
              )}
              {detailItem.assignees?.length > 0 && (
                <div className="flex gap-1">
                  {detailItem.assignees.map(a => (
                    <span key={a.id} className="text-xs bg-muted px-1.5 py-0.5 rounded">{a.display_name || a.nicename}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => { handleToggleStatus(detailItem); setDetailItem(null) }}>
                  {detailItem.progress >= 1 ? __('Reopen') : __('Complete')}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => { handleDelete(detailItem); setDetailItem(null) }}>
                  {__('Delete')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
