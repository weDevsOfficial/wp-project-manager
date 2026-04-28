import React, { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@store/index'
import { closeTaskSheet, fetchTask, updateTask, changeTaskStatus, addTaskComment, updateTaskComment, deleteTaskComment, deleteTask } from '@store/tasksSlice'
import { toggleTaskInList, removeTaskFromList } from '@store/taskListsSlice'
import { useApi } from '@hooks/useApi'
import { cn } from '@lib/utils'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { usePermissions } from '@hooks/usePermissions'
import { useCurrentProject } from '@hooks/useCurrentProject'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@components/ui/sheet'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import RichTextEditor from '@components/common/RichTextEditor'
import GitHubPreviewContainer from '@components/common/GitHubPreviewContainer'
import NotionPreviewContainer from '@components/common/NotionPreviewContainer'
import LoomPreviewContainer from '@components/common/LoomPreviewContainer'
import { stripAllPreviewUrls } from '@/lib/url-strippers'
import { sanitizeHtml } from '@lib/sanitize'
import FileUploadArea from '@components/common/FileUploadArea'
import { UserAvatar } from '@components/common/UserAvatar'
import { Separator } from '@components/ui/separator'
import { Skeleton } from '@components/ui/skeleton'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import {
  Calendar,
  Users,
  MessageSquare,
  Paperclip,
  Check,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Trash2,
  Link2,
  Activity,
  X,
  Plus,
  Eye,
  EyeOff,
  Layers,
  Pencil,
  FileText,
  Loader2,
} from 'lucide-react'
import {
  isTaskComplete,
  formatPmDate,
  formatPmDateTime,
  extractDateStr,
} from '@lib/pm-utils'
import { parseActivityMessage } from './utils'
import { resolveActivityUrl } from '@lib/activity-links'
import TaskPrivacyField from './parts/fields/TaskPrivacyField'
import TaskEstimationField from './parts/fields/TaskEstimationField'
import TaskTypeField from './parts/fields/TaskTypeField'
import MilestoneField from './parts/fields/MilestoneField'
import ProInlineProperties from './parts/ProInlineProperties'
import ProSubtasksSection from './parts/ProSubtasksSection'

export default function TaskDetailSheet() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const api = useApi()
  const { __ } = useI18n()
  const toast = useToast()
  const { currentTask, taskSheetOpen, loading } = useAppSelector(s => s.tasks)
  const storeProjectId = useAppSelector(s => s.taskLists.projectId)

  const projectId = storeProjectId || currentTask?.project_id || currentTask?.project?.id
  const isProContext = !storeProjectId && (currentTask?.project_id || currentTask?.project?.id)
  const project = useCurrentProject(projectId)
  const { canEditTask, canEditComment, userCan } = usePermissions(project)

  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [description, setDescription] = useState('')
  const [savingDesc, setSavingDesc] = useState(false)

  const [editingDates, setEditingDates] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')

  const [showAssigneeSearch, setShowAssigneeSearch] = useState(false)
  const [assigneeQuery, setAssigneeQuery] = useState('')
  const [assigneeResults, setAssigneeResults] = useState([])

  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentFiles, setCommentFiles] = useState([])
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState('')

  const [activities, setActivities] = useState([])
  const [showActivities, setShowActivities] = useState(false)
  const [loadingActivities, setLoadingActivities] = useState(false)

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title)
      setDescription(currentTask.description?.content ?? '')
      setStartDate(extractDateStr(currentTask.start_at) || '')
      setDueDate(extractDateStr(currentTask.due_date) || '')
    }
  }, [currentTask])

  useEffect(() => {
    if (taskSheetOpen && currentTask && projectId) {
      dispatch(fetchTask({ projectId, taskId: currentTask.id }))
    }
  }, [taskSheetOpen, currentTask?.id, projectId, isProContext, dispatch])


  const assignees = currentTask
    ? (Array.isArray(currentTask.assignees) ? currentTask.assignees : (currentTask.assignees?.data) ?? [])
    : []
  const comments = useAppSelector(s => s.tasks.taskComments)
  const complete = currentTask ? isTaskComplete(currentTask.status) : false

  const handleClose = useCallback((open) => {
    if (!open) {
      dispatch(closeTaskSheet())
      setFullscreen(false)
      setEditingDates(false)
      setShowAssigneeSearch(false)
      setShowActivities(false)
      setNewComment('')
    }
  }, [dispatch])

  const handleTitleSave = useCallback(async () => {
    if (!currentTask || !projectId || title === currentTask.title) {
      setEditingTitle(false)
      return
    }
    try {
      await dispatch(updateTask({ projectId, taskId: currentTask.id, data: { title } })).unwrap()
    } catch {
      toast.error(__('Failed to update title'))
      setTitle(currentTask.title)
    }
    setEditingTitle(false)
  }, [dispatch, projectId, currentTask, title, toast, __])

  const handleDescSave = useCallback(async () => {
    if (!currentTask || !projectId) return
    setSavingDesc(true)
    try {
      await dispatch(updateTask({ projectId, taskId: currentTask.id, data: { description } })).unwrap()
      toast.success(__('Description updated'))
      setEditingDesc(false)
    } catch {
      toast.error(__('Failed to update description'))
    }
    setSavingDesc(false)
  }, [dispatch, projectId, currentTask, description, toast, __])

  const handleDescCancel = useCallback(() => {
    setDescription(currentTask?.description?.html || currentTask?.description?.content || '')
    setEditingDesc(false)
  }, [currentTask])

  const handleToggleStatus = useCallback(async () => {
    if (!currentTask || !projectId) return
    const newStatus = isTaskComplete(currentTask.status) ? 0 : 1
    dispatch(toggleTaskInList({ listId: currentTask.task_list_id, taskId: currentTask.id, newStatus }))
    try {
      await dispatch(changeTaskStatus({ projectId, taskId: currentTask.id, status: newStatus })).unwrap()
      toast.success(newStatus === 1 ? __('Task completed') : __('Task reopened'))
    } catch {
      toast.error(__('Failed to update status'))
    }
  }, [dispatch, projectId, currentTask, toast, __])

  const handleDateSave = useCallback(async () => {
    if (!currentTask || !projectId) return
    try {
      await dispatch(updateTask({
        projectId, taskId: currentTask.id,
        data: { start_at: startDate || undefined, due_date: dueDate || undefined },
      })).unwrap()
      toast.success(__('Dates updated'))
      setEditingDates(false)
    } catch {
      toast.error(__('Failed to update dates'))
    }
  }, [dispatch, projectId, currentTask, startDate, dueDate, toast, __])

  const handleAssigneeSearch = useCallback(async (q) => {
    setAssigneeQuery(q)
    if (q.length < 2) { setAssigneeResults([]); return }
    try {
      const res = await api.get('users', { search: q })
      setAssigneeResults(res.data ?? [])
    } catch { setAssigneeResults([]) }
  }, [api])

  const handleAddAssignee = useCallback(async (user) => {
    if (!currentTask || !projectId) return
    const existingIds = assignees.map(a => a.assigned_to ?? a.id)
    if (existingIds.includes(user.id)) return
    const newAssignees = [...existingIds, user.id]
    try {
      await dispatch(updateTask({
        projectId, taskId: currentTask.id,
        data: { assignees: newAssignees },
      })).unwrap()
      dispatch(fetchTask({ projectId, taskId: currentTask.id }))
      toast.success(__('Assignee added'))
    } catch {
      toast.error(__('Failed to add assignee'))
    }
    setAssigneeQuery('')
    setAssigneeResults([])
    setShowAssigneeSearch(false)
  }, [dispatch, projectId, currentTask, assignees, toast, __])

  const handleRemoveAssignee = useCallback(async (userId) => {
    if (!currentTask || !projectId) return
    const remainingIds = assignees.map(a => a.assigned_to ?? a.id).filter(id => parseInt(id) !== parseInt(userId))
    try {
      const assigneePayload = remainingIds.length > 0 ? remainingIds : [-1]
      await dispatch(updateTask({
        projectId, taskId: currentTask.id,
        data: { assignees: assigneePayload },
      })).unwrap()
      dispatch(fetchTask({ projectId, taskId: currentTask.id }))
      toast.success(__('Assignee removed'))
    } catch {
      toast.error(__('Failed to remove assignee'))
    }
  }, [dispatch, projectId, currentTask, assignees, toast, __])

  const handleSubmitComment = useCallback(async () => {
    if (!currentTask || !projectId || !newComment.trim()) return
    setSubmittingComment(true)
    try {
      if (commentFiles.length > 0) {
        const formData = new FormData()
        formData.append('content', newComment)
        formData.append('commentable_id', currentTask.id)
        formData.append('commentable_type', 'task')
        formData.append('mentioned_users', '')
        formData.append('notify_users', '')
        formData.append('project_id', projectId)
        commentFiles.forEach(f => formData.append('files[]', f))
        await api.upload(`projects/${projectId}/comments`, formData)
        dispatch(fetchTask({ projectId, taskId: currentTask.id }))
      } else {
        await dispatch(addTaskComment({ projectId, taskId: currentTask.id, content: newComment })).unwrap()
      }
      setNewComment('')
      setCommentFiles([])
      toast.success(__('Comment added'))
    } catch {
      toast.error(__('Failed to add comment'))
    }
    setSubmittingComment(false)
  }, [dispatch, projectId, currentTask, newComment, commentFiles, api, toast, __])

  const startEditComment = useCallback((c) => {
    setEditingCommentId(c.id)
    setEditCommentText(c.content || '')
  }, [])

  const cancelEditComment = useCallback(() => {
    setEditingCommentId(null)
    setEditCommentText('')
  }, [])

  const handleUpdateComment = useCallback(async () => {
    if (!editCommentText.trim() || !editingCommentId || !projectId) return
    try {
      await dispatch(updateTaskComment({ projectId, commentId: editingCommentId, content: editCommentText.trim() })).unwrap()
      cancelEditComment()
      toast.success(__('Comment updated'))
    } catch {
      toast.error(__('Failed to update comment'))
    }
  }, [dispatch, projectId, editingCommentId, editCommentText, toast, __, cancelEditComment])

  const handleDeleteComment = useCallback(async (commentId) => {
    if (!projectId) return
    try {
      await dispatch(deleteTaskComment({ projectId, commentId })).unwrap()
      toast.success(__('Comment deleted'))
    } catch {
      toast.error(__('Failed to delete comment'))
    }
  }, [dispatch, projectId, toast, __])

  const handleLoadActivities = useCallback(async () => {
    if (!currentTask || !projectId) return
    setShowActivities(true)
    setLoadingActivities(true)
    try {
      const res = await api.post(`projects/${projectId}/tasks/${currentTask.id}/activity`, { per_page: 20 })
      setActivities(res.data ?? [])
    } catch { setActivities([]) }
    setLoadingActivities(false)
  }, [api, projectId, currentTask])

  const handleDelete = useCallback(async () => {
    if (!currentTask || !projectId) return
    if (!confirm(__('Are you sure you want to delete this task?'))) return
    dispatch(removeTaskFromList({ listId: currentTask.task_list_id, taskId: currentTask.id }))
    dispatch(closeTaskSheet())
    try {
      await dispatch(deleteTask({ projectId, taskId: currentTask.id })).unwrap()
      toast.success(__('Task deleted'))
    } catch {
      toast.error(__('Failed to delete task'))
    }
  }, [dispatch, projectId, currentTask, toast, __])

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#/projects/${projectId}/task-lists/${currentTask?.task_list_id}/tasks/${currentTask?.id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success(__('Link copied'))
    } catch {
      try {
        const el = document.createElement('textarea')
        el.value = url
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        toast.success(__('Link copied'))
      } catch {
        toast.error(__('Could not copy link'))
      }
    }
  }, [projectId, currentTask, toast, __])

  return (
    <Sheet open={taskSheetOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className={cn(
          'overflow-y-auto p-0 transition-all duration-300',
          fullscreen ? 'w-full sm:max-w-full' : 'w-full sm:max-w-[560px]',
        )}
      >
        {loading && !currentTask ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-pm-accent" />
          </div>
        ) : currentTask ? (
          <div className={cn('flex flex-col h-full', fullscreen && 'max-w-4xl mx-auto')}>

            <div className="flex items-center gap-1 px-4 pt-3 pb-1">
              <button
                type="button"
                onClick={() => setFullscreen(v => !v)}
                className="p-1.5 rounded-md hover:bg-muted text-pm-text-muted hover:text-pm-text-primary transition-colors"
                title={fullscreen ? __('Exit full screen') : __('Full screen')}
              >
                {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-md hover:bg-muted text-pm-text-muted hover:text-pm-text-primary transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Link2 className="h-4 w-4 mr-2" />{__('Copy Link')}
                  </DropdownMenuItem>
                  {canEditTask(currentTask) && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />{__('Delete')}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator />

            <div className="px-6 pt-6 pb-4 space-y-4">
              <SheetHeader className="space-y-1.5">
                <SheetDescription asChild>
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground min-w-0">
                    {(currentTask.project?.data?.title || currentTask.project?.title) && (
                      <button
                        type="button"
                        onClick={() => {
                          const pid = currentTask.project?.data?.id || currentTask.project?.id || projectId
                          dispatch(closeTaskSheet())
                          navigate(`/projects/${pid}/task-lists`)
                        }}
                        className="inline-flex items-center gap-1 font-medium text-pm-accent hover:text-pm-accent/80 transition-colors truncate min-w-0"
                        title={currentTask.project?.data?.title || currentTask.project?.title}
                      >
                        <Layers className="h-3 w-3 shrink-0" />
                        {currentTask.project?.data?.title || currentTask.project?.title}
                      </button>
                    )}
                    <span className="text-muted-foreground/40">|</span>
                    <span className="font-mono text-[12px] text-muted-foreground/70">#{currentTask.id}</span>
                    {currentTask.creator?.data && (
                      <>
                        <span className="text-muted-foreground/40">·</span>
                        <div className="inline-flex items-center gap-1 shrink-0">
                          <UserAvatar user={currentTask.creator.data} size="xs" />
                          <button
                            type="button"
                            onClick={() => { dispatch(closeTaskSheet()); navigate('/my-tasks'); }}
                            className="hover:text-pm-accent transition-colors cursor-pointer"
                          >
                            {currentTask.creator.data.display_name}
                          </button>
                        </div>
                      </>
                    )}
                    {currentTask.created_at && (
                      <>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="inline-flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" />{formatPmDateTime(currentTask.created_at)}</span>
                      </>
                    )}
                  </div>
                </SheetDescription>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={handleToggleStatus} className="shrink-0 group/status">
                    {complete ? (
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pm-accent text-white">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center h-6 w-6 rounded-full border-[1.5px] border-dashed border-pm-text-muted/40 group-hover/status:border-solid group-hover/status:border-pm-accent group-hover/status:text-pm-accent transition-all">
                        <Check className="h-4 w-4 opacity-0 group-hover/status:opacity-100 transition-opacity" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                  {editingTitle && canEditTask(currentTask) ? (
                    <Input autoFocus value={title} onChange={e => setTitle(e.target.value)} onBlur={handleTitleSave}
                      onKeyDown={e => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') { setTitle(currentTask.title); setEditingTitle(false) } }}
                      className="text-lg font-semibold h-auto py-0.5 border-none shadow-none focus-visible:ring-1 flex-1"
                    />
                  ) : (
                    <SheetTitle className={cn('text-lg leading-snug truncate', canEditTask(currentTask) && 'cursor-pointer hover:text-pm-accent transition-colors', complete && 'line-through text-pm-text-muted')}
                      title={currentTask.title}
                      onClick={() => canEditTask(currentTask) && setEditingTitle(true)}>
                      {currentTask.title}
                    </SheetTitle>
                  )}
                </div>
              </SheetHeader>

              <div className="bg-muted/20 pb-2">
                <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors cursor-pointer" onClick={handleToggleStatus}>
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                    <Check className="h-4 w-4" /><span className="text-sm">{__('Status')}</span>
                  </div>
                  <span className={cn('inline-flex items-center gap-1.5 text-[15px] font-medium px-2.5 py-0.5 rounded-full',
                    complete ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', complete ? 'bg-emerald-500' : 'bg-amber-500')} />
                    {complete ? __('Done') : __('Active')}
                  </span>
                </div>

                <div className="flex items-center min-h-[32px] px-2 rounded-md hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                    <Calendar className="h-4 w-4" /><span className="text-sm">{__('Dates')}</span>
                  </div>
                  {editingDates ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-sm gap-1.5 font-normal min-w-[120px] justify-start">
                            <Calendar className="h-3.5 w-3.5" />
                            {startDate || __('Start')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="start">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-pm-text-muted">{__('Start Date')}</p>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            {startDate && <Button variant="ghost" size="sm" className="h-6 text-[14px] w-full" onClick={() => setStartDate('')}>{__('Clear')}</Button>}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <span className="text-sm text-pm-text-muted">→</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-sm gap-1.5 font-normal min-w-[120px] justify-start">
                            <Calendar className="h-3.5 w-3.5" />
                            {dueDate || __('Due')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="start">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-pm-text-muted">{__('Due Date')}</p>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            {dueDate && <Button variant="ghost" size="sm" className="h-6 text-[14px] w-full" onClick={() => setDueDate('')}>{__('Clear')}</Button>}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button size="sm" className="h-6 text-[15px] px-2" onClick={handleDateSave}>{__('Save')}</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[15px] px-2" onClick={() => setEditingDates(false)}>{__('Cancel')}</Button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setEditingDates(true)} className="text-sm text-pm-text-primary hover:text-pm-accent transition-colors">
                      {extractDateStr(currentTask.start_at) && extractDateStr(currentTask.due_date)
                        ? `${formatPmDate(currentTask.start_at)} → ${formatPmDate(currentTask.due_date)}`
                        : extractDateStr(currentTask.due_date)
                          ? formatPmDate(currentTask.due_date)
                          : __('Set dates')}
                    </button>
                  )}
                </div>

                <div className="flex items-start min-h-[32px] px-2 rounded-md hover:bg-muted/40 transition-colors py-1">
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0 pt-0.5">
                    <Users className="h-4 w-4" /><span className="text-sm">{__('Assignees')}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {assignees.map(user => (
                        <span key={user.id || user.assigned_to} className="inline-flex items-center gap-1 text-sm bg-muted/50 rounded-full pl-0.5 pr-2 py-0.5">
                          <UserAvatar user={user} size="sm" />
                          {user.display_name}
                          <button type="button" className="ml-0.5 text-pm-text-muted hover:text-destructive" onClick={() => handleRemoveAssignee(user.assigned_to ?? user.id)}>
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                      <button type="button" onClick={() => setShowAssigneeSearch(v => !v)}
                        className="inline-flex items-center gap-1 text-[15px] text-pm-accent hover:text-pm-accent/80 transition-colors">
                        <Plus className="h-3.5 w-3.5" />{__('Add')}
                      </button>
                    </div>
                    {showAssigneeSearch && (
                      <div className="relative mt-1.5">
                        <Input autoFocus value={assigneeQuery} onChange={e => handleAssigneeSearch(e.target.value)}
                          placeholder={__('Search users...')} className="h-7 text-sm"
                          onKeyDown={e => { if (e.key === 'Escape') { setShowAssigneeSearch(false); setAssigneeQuery(''); setAssigneeResults([]) } }}
                        />
                        {assigneeResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-36 overflow-y-auto">
                            {assigneeResults.map(u => {
                              const isAssigned = assignees.some(a => parseInt(a.id || a.assigned_to) === parseInt(u.id))
                              return (
                                <button key={u.id} type="button"
                                  className={cn("w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left", isAssigned ? "bg-pm-accent/5 text-pm-accent" : "hover:bg-muted/50")}
                                  onClick={() => isAssigned ? handleRemoveAssignee(u.id) : handleAddAssignee(u)}
                                >
                                  <UserAvatar user={u} size="sm" />
                                  <span className="flex-1">{u.display_name}</span>
                                  {isAssigned && <Check className="h-4 w-4 text-pm-accent shrink-0" />}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <TaskEstimationField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} api={api} />

                <TaskTypeField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} api={api} />

                <MilestoneField task={currentTask} projectId={currentTask?.project_id} api={api} />

                {canEditTask(currentTask) && userCan('view_private_task') && (
                  <TaskPrivacyField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} api={api} />
                )}

                <ProInlineProperties
                  taskId={currentTask?.id}
                  projectId={currentTask?.project_id}
                  currentTask={currentTask}
                  dispatch={dispatch}
                  api={api}
                />
              </div>
            </div>

            <Separator />

            <div className="px-5 py-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-pm-text-muted/70"><FileText className="h-4 w-4" />{__('Description')}</h4>
                {!editingDesc && canEditTask(currentTask) && (
                  <Button
                    size="sm"
                    className="h-7 text-sm gap-1"
                    onClick={() => { setDescription(currentTask.description?.html || currentTask.description?.content || ''); setEditingDesc(true) }}
                  >
                    {currentTask.description?.content ? (<>
                      <Plus className="h-3 w-3" />{__('Edit')}
                    </>) : (<>
                      <Plus className="h-3 w-3" />{__('Add')}
                    </>)}
                  </Button>
                )}
              </div>
              {editingDesc ? (
                <div className="space-y-3">
                  <RichTextEditor content={description} placeholder={__('Write a description...')} onChange={html => setDescription(html)} autofocus minHeight="100px" />
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="h-7 text-sm" onClick={handleDescSave} disabled={savingDesc}>{savingDesc ? __('Saving...') : __('Save')}</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-sm" onClick={handleDescCancel}>{__('Cancel')}</Button>
                  </div>
                </div>
              ) : (
                <div className={cn('rounded-lg p-3 min-h-[48px] transition-colors', currentTask.description?.html ? 'bg-muted/20' : 'bg-muted/10 border border-dashed border-border/60')}>
                  {currentTask.description?.html ? (
                    <>
                      <div className="prose prose-sm max-w-none text-sm text-pm-text-primary/80 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripAllPreviewUrls(currentTask.description.html)) }} />
                      <GitHubPreviewContainer content={currentTask.description.html} />
                      <NotionPreviewContainer content={currentTask.description.html} />
                      <LoomPreviewContainer content={currentTask.description.html} />
                    </>
                  ) : (
                    <p className="text-sm text-pm-text-muted italic">{__('No description yet. Click "Add" to write one.')}</p>
                  )}
                </div>
              )}
            </div>

            <Separator />

            <ProSubtasksSection
              taskId={currentTask?.id}
              projectId={currentTask?.project_id}
              currentTask={currentTask}
            />

            <Separator />

            <div className="px-6 py-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-pm-text-muted/70 mb-3 flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />{__('Comments')}
                {comments.length > 0 && <span className="text-[14px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums">{comments.length}</span>}
              </h4>

              {comments.length > 0 && (
                <div className="space-y-3 mb-4">
                  {comments.map(comment => {
                    const canEdit = canEditComment(comment)
                    const isEditing = editingCommentId === comment.id
                    return (
                      <div key={comment.id} className="flex gap-2.5 group/comment">
                        <UserAvatar user={comment.creator?.data} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <button
                              type="button"
                              onClick={() => { if (comment.creator?.data?.id) { dispatch(closeTaskSheet()); navigate('/my-tasks'); } }}
                              className="text-sm font-medium text-pm-text-primary hover:text-pm-accent transition-colors cursor-pointer"
                            >
                              {comment.creator?.data?.display_name}
                            </button>
                            <span className="text-[13px] text-pm-text-muted">{formatPmDateTime(comment.created_at)}</span>
                            {canEdit && !isEditing && (
                              <span className="opacity-0 group-hover/comment:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
                                <button type="button" onClick={() => startEditComment(comment)} className="p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent" title={__('Edit')}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button type="button" onClick={() => handleDeleteComment(comment.id)} className="p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-destructive" title={__('Delete')}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </span>
                            )}
                          </div>
                          {isEditing ? (
                            <div className="space-y-2">
                              <RichTextEditor content={editCommentText} onChange={setEditCommentText} minHeight="60px" autofocus />
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="h-6 text-[15px]" onClick={handleUpdateComment}>{__('Save')}</Button>
                                <Button size="sm" variant="ghost" className="h-6 text-[15px]" onClick={cancelEditComment}>{__('Cancel')}</Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-sm text-pm-text-primary/80 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripAllPreviewUrls(comment.content)) }} />
                              <GitHubPreviewContainer content={comment.content || ''} />
                              <NotionPreviewContainer content={comment.content || ''} />
                              <LoomPreviewContainer content={comment.content || ''} />
                            </>
                          )}
                          {comment.files?.data?.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {comment.files.data.some(f => (f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url)) && (
                                <div className="flex gap-2 flex-wrap">
                                  {comment.files.data.filter(f => (f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url)).map(f => (
                                    <a key={f.id} href={f.url} target="_blank" rel="noreferrer"
                                      className="group relative block overflow-hidden rounded-xl border border-border/50 hover:border-pm-accent/40 transition-all hover:shadow-md">
                                      <img src={f.thumb || f.url} alt={f.name} className="h-24 w-24 object-cover transition-transform group-hover:scale-105" />
                                    </a>
                                  ))}
                                </div>
                              )}
                              {comment.files.data.some(f => !((f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url))) && (
                                <div className="flex gap-2 flex-wrap">
                                  {comment.files.data.filter(f => !((f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url))).map(f => (
                                    <a key={f.id} href={f.url} target="_blank" rel="noreferrer"
                                      className="inline-flex items-center gap-2 text-sm border border-border/50 rounded-xl px-3 py-2 hover:bg-muted/40 hover:border-pm-accent/30 transition-all group">
                                      <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                                        <Paperclip className="h-3.5 w-3.5 text-pm-text-muted group-hover:text-pm-accent transition-colors" />
                                      </div>
                                      <span className="text-pm-text-primary truncate max-w-[150px] text-[13px] font-medium">{f.name}</span>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="space-y-2">
                <RichTextEditor
                  content={newComment}
                  placeholder={__('Write a comment...')}
                  onChange={(html) => setNewComment(html)}
                  minHeight="60px"
                />
                <FileUploadArea files={commentFiles} onFilesChange={setCommentFiles} compact />
                <Button size="sm" className="h-7 text-sm gap-1" onClick={handleSubmitComment} disabled={!newComment.trim() || submittingComment}>
                  <Plus className="h-3 w-3" />{submittingComment ? __('Sending...') : __('Add Comment')}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-pm-text-muted/70 flex items-center gap-1.5">
                  <Activity className="h-4 w-4" />{__('Activity')}
                </h4>
                <button
                  type="button"
                  onClick={showActivities ? () => setShowActivities(false) : handleLoadActivities}
                  className="p-1 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent transition-colors"
                  title={showActivities ? __('Hide activity') : __('Show activity')}
                >
                  {showActivities
                    ? <Eye className="h-4 w-4" />
                    : <EyeOff className="h-4 w-4" />
                  }
                </button>
              </div>
              {showActivities && (
                <div className="mt-3 space-y-2">
                  {loadingActivities ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : activities.length > 0 ? (
                    activities.map((act, i) => {
                      const actActor = act.actor?.data;
                      const actUrl = resolveActivityUrl(act);
                      const handleActClick = () => {
                        if (!actUrl) return;
                        if (actUrl.openTaskSheet) {
                          dispatch(openTaskSheet({ id: actUrl.taskId, project_id: actUrl.projectId, task_list_id: actUrl.listId }));
                        } else {
                          dispatch(closeTaskSheet());
                          navigate(actUrl.path);
                        }
                      };
                      return (
                        <div key={act.id || i} className="flex gap-2 text-sm text-pm-text-muted">
                          <span className="h-1.5 w-1.5 rounded-full bg-pm-text-muted/30 mt-1.5 shrink-0" />
                          <div>
                            {actActor?.id && (
                              <button
                                type="button"
                                onClick={() => { dispatch(closeTaskSheet()); navigate('/my-tasks'); }}
                                className="font-medium text-pm-text hover:text-pm-accent transition-colors cursor-pointer mr-1"
                              >
                                {actActor.display_name}
                              </button>
                            )}
                            {actUrl ? (
                              <button
                                type="button"
                                onClick={handleActClick}
                                className="hover:text-pm-accent transition-colors cursor-pointer"
                              >
                                {parseActivityMessage(act) || act.action}
                              </button>
                            ) : (
                              <span>{parseActivityMessage(act) || act.action}</span>
                            )}
                            {act.committed_at && <span className="ml-1.5 text-[14px]">· {formatPmDateTime(act.committed_at)}</span>}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-pm-text-muted italic">{__('No activity yet')}</p>
                  )}
                </div>
              )}
            </div>

          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
