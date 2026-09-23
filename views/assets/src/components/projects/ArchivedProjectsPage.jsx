import { __, sprintf } from '@wordpress/i18n'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@store/index'
import { setProjectArchived, deleteProject } from '@store/projectsSlice'
import { useApi } from '@hooks/useApi'
import { useToast } from '@hooks/useToast'
import { useConfirm } from '@hooks/useConfirm'
import { pmIsManager } from '@hooks/usePermissions'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { Skeleton } from '@components/ui/skeleton'
import { Progress } from '@components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { LoadFailed } from '@components/common/LoadFailed'
import { UserAvatar } from '@components/common/UserAvatar'
import BackButton from '@components/common/BackButton'
import { formatPmDate } from '@lib/pm-utils'
import { getMeta, projectProgress } from './ProjectsPage/utils'
import { Archive, FolderKanban, RotateCcw, MoreHorizontal, Trash2, Loader2, CheckCircle2 } from 'lucide-react'

/**
 * Archived projects, kept out of every tab on the Projects page. Restore puts a
 * project back under Active; delete is permanent.
 */
export default function ArchivedProjectsPage() {
  const api = useApi()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const [ConfirmDialog, confirm] = useConfirm()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [busy, setBusy] = useState({})

  const fetchArchived = useCallback(async () => {
    setLoading(true)
    setLoadFailed(false)
    try {
      const res = await api.get('advanced/projects', {
        status: 'archived',
        with: 'assignees',
        project_meta: 'all',
        per_page: 100,
        orderby: 'updated_at:desc',
      })
      setProjects(res?.data ?? [])
    } catch {
      setProjects([])
      setLoadFailed(true)
    }
    setLoading(false)
  }, [api])

  useEffect(() => { fetchArchived() }, [fetchArchived])

  const markBusy = (id, value) => setBusy((prev) => ({ ...prev, [id]: value }))

  const handleRestore = useCallback(async (project) => {
    markBusy(project.id, 'restore')
    try {
      await dispatch(setProjectArchived({ project, archived: false })).unwrap()
      setProjects((prev) => prev.filter((p) => p.id !== project.id))
      toast.success(__('Project restored to Active', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to restore the project', 'wedevs-project-manager'))
    }
    markBusy(project.id, null)
  }, [dispatch, toast])

  const handleDelete = useCallback(async (project) => {
    const ok = await confirm(
      sprintf(
        /* translators: %s: project title */
        __('Delete "%s" and everything in it? This cannot be undone.', 'wedevs-project-manager'),
        project.title,
      ),
      __('Delete project permanently', 'wedevs-project-manager'),
    )
    if (!ok) return
    markBusy(project.id, 'delete')
    try {
      await dispatch(deleteProject(project.id)).unwrap()
      setProjects((prev) => prev.filter((p) => p.id !== project.id))
      toast.success(__('Project deleted', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to delete the project', 'wedevs-project-manager'))
    }
    markBusy(project.id, null)
  }, [confirm, dispatch, toast])

  const renderSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border bg-card p-4 flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-11 w-28 rounded-md" />
        </div>
      ))}
    </div>
  )

  const renderEmpty = () => (
    <div className="text-center py-16 rounded-lg border bg-card">
      <Archive className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
      <h3 className="text-sm font-medium text-pm-text-primary mb-1">
        {__('No archived projects', 'wedevs-project-manager')}
      </h3>
      <p className="text-sm text-pm-text-muted mb-4">
        {__('Archive a project from its menu on the Projects page and it will appear here.', 'wedevs-project-manager')}
      </p>
      <BackButton fallback="/projects" label={__('Back to Projects', 'wedevs-project-manager')} />
    </div>
  )

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <ConfirmDialog />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <BackButton fallback="/projects" />
          <Archive className="h-5 w-5 text-pm-text-muted" />
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__('Archived Projects', 'wedevs-project-manager')}
          </h1>
          {projects.length > 0 && (
            <span className="text-sm text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-md tabular-nums">
              {projects.length}
            </span>
          )}
        </div>
      </div>

      {loading ? renderSkeleton() : loadFailed ? (
        <LoadFailed
          title={__('Archived projects could not be loaded.', 'wedevs-project-manager')}
          onRetry={fetchArchived}
        />
      ) : projects.length === 0 ? renderEmpty() : (
        <div className="space-y-3">
          {projects.map((project) => {
            const meta = getMeta(project) || {}
            const total = meta.total_tasks ?? 0
            const done = meta.total_complete_tasks ?? 0
            const progress = projectProgress(project)
            const members = project.assignees?.data ?? []
            const canAct = pmIsManager(project)
            const state = busy[project.id]

            return (
              <div
                key={project.id}
                className="rounded-xl border bg-card p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60 shrink-0">
                    <FolderKanban className="h-5 w-5 text-pm-text-muted" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/projects/${project.id}/task-lists`)}
                      className="block max-w-full text-left text-sm font-medium text-pm-text-primary truncate hover:text-pm-accent transition-colors"
                    >
                      {project.title}
                    </button>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {total > 0 && (
                        <span className="text-sm text-pm-text-muted flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          {sprintf(
                            /* translators: 1: completed tasks, 2: total tasks */
                            __('%1$d/%2$d tasks', 'wedevs-project-manager'), done, total,
                          )}
                        </span>
                      )}
                      {total > 0 && (
                        <span className="flex items-center gap-2 w-28">
                          <Progress value={progress} className="h-1.5" />
                          <span className="text-[12px] text-pm-text-muted tabular-nums">{progress}%</span>
                        </span>
                      )}
                      {project.updated_at && (
                        <span className="text-sm text-pm-text-muted">
                          {sprintf(
                            /* translators: %s: date the project was last changed */
                            __('Archived %s', 'wedevs-project-manager'), formatPmDate(project.updated_at),
                          )}
                        </span>
                      )}
                      {members.length > 0 && (
                        <span className="flex -space-x-1.5">
                          {members.slice(0, 4).map((u) => (
                            <UserAvatar key={u.id} user={u} size="sm" className="ring-2 ring-card" />
                          ))}
                          {members.length > 4 && (
                            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-muted px-1 text-[11px] font-medium text-pm-text-muted ring-2 ring-card">
                              +{members.length - 4}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-[14px]">
                    {__('Archived', 'wedevs-project-manager')}
                  </Badge>
                  {canAct && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-sm h-11 px-5"
                        disabled={!!state}
                        onClick={() => handleRestore(project)}
                      >
                        {state === 'restore'
                          ? <><Loader2 className="h-4 w-4 animate-spin" />{__('Restoring...', 'wedevs-project-manager')}</>
                          : <><RotateCcw className="h-4 w-4" />{__('Restore', 'wedevs-project-manager')}</>}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-label={__('Project actions', 'wedevs-project-manager')} variant="ghost" size="icon" className="h-8 w-8" disabled={!!state}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(project)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {__('Delete permanently', 'wedevs-project-manager')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
