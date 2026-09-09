import { __, sprintf } from '@wordpress/i18n';
import React, { useEffect, useCallback, useState, useRef } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@store/index'
import { openTaskSheet, closeTaskSheet, fetchTask, updateTask, changeTaskStatus, addTaskComment, updateTaskComment, deleteTaskComment, deleteTask, markTaskModified } from '@store/tasksSlice'
import { toggleTaskInList, removeTaskFromList } from '@store/taskListsSlice'
import { useApi } from '@hooks/useApi'
import { cn } from '@lib/utils'
import { useToast } from '@hooks/useToast'
import { usePermissions } from '@hooks/usePermissions'
import { useCurrentProject } from '@hooks/useCurrentProject'
import { useConfirm } from '@hooks/useConfirm'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@components/ui/dialog'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import RichTextEditor from '@components/common/RichTextEditor'
import GitHubPreviewContainer from '@components/common/GitHubPreviewContainer'
import NotionPreviewContainer from '@components/common/NotionPreviewContainer'
import LoomPreviewContainer from '@components/common/LoomPreviewContainer'
import { stripAllPreviewUrls } from '@/lib/url-strippers'
import { sanitizeHtml } from '@lib/sanitize'
import { decorateGoogleLinks } from '@lib/google-links'
import FileUploadArea from '@components/common/FileUploadArea'
import CommentAttachment from '@components/common/CommentAttachment'
import CommentLinkActions from '@components/google-workspace/CommentLinkActions'
import TaskStatusCircle from '@components/common/TaskStatusCircle'
import NotifyUsers from '@components/common/NotifyUsers'
import { UserAvatar } from '@components/common/UserAvatar'
import { Separator } from '@components/ui/separator'
import { Skeleton } from '@components/ui/skeleton'
import { DatePicker } from '@components/ui/date-picker'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { Calendar, Users, Check, Maximize2, Minimize2, MoreHorizontal, Trash2, Link2, X, Plus, FolderKanban, Pencil, FileText, Loader2, Video, ListChecks, MessageSquare, Activity } from 'lucide-react'
import { DriveMonoGlyph } from '@components/google-workspace/GoogleIcons'
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
import TaskPriorityField from './parts/fields/TaskPriorityField'
import MilestoneField from './parts/fields/MilestoneField'
import ProInlineProperties from './parts/ProInlineProperties'
import ProSubtasksSection from './parts/ProSubtasksSection'
import ProBadge from '@components/common/ProBadge'

function extractMentionedUsers(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const ids = []
  doc.querySelectorAll('span[data-type="mention"][data-id]').forEach(el => {
    const id = el.getAttribute('data-id')
    if (id && !ids.includes(id)) ids.push(id)
  })
  return ids.join(',')
}

// The Google Drive Picker renders its own overlay outside this sheet's DOM.
// Treat clicks/focus on it as "inside" so the task sheet stays open while
// the user picks a file (only the X / Esc should close the sheet).
function isGooglePickerInteraction(e) {
  // While the Picker session is active, never let an outside interaction close
  // the sheet (the Picker overlay lives outside this DOM and its focus/pointer
  // events would otherwise dismiss the task).
  if (typeof window !== 'undefined' && window.__pmGooglePickerOpen) return true
  const t = e?.detail?.originalEvent?.target || e?.target
  if (!t || typeof t.closest !== 'function') return false
  return !!t.closest('.picker-dialog, .picker-dialog-bg, .picker, .picker-dialog-content')
}

export default function TaskDetailSheet() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const api = useApi()
  const prePathRef = useRef(null)
  const toast = useToast()
  const [ConfirmDialog, confirm] = useConfirm()
  const { currentTask, taskSheetOpen, loading } = useAppSelector(s => s.tasks)
  const storeProjectId = useAppSelector(s => s.taskLists.projectId)

  const projectId = storeProjectId || currentTask?.project_id || currentTask?.project?.id
  const isProContext = !storeProjectId && (currentTask?.project_id || currentTask?.project?.id)
  const project = useCurrentProject(projectId)
  const { canEditTask, canEditComment, userCan, isPro } = usePermissions(project)
  const canEditCurrentTask = currentTask ? canEditTask(currentTask) : false

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

  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentFiles, setCommentFiles] = useState([])
  const [commentNotifyUsers, setCommentNotifyUsers] = useState([])
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState('')
  const [editCommentNewFiles, setEditCommentNewFiles] = useState([])
  const [editCommentDeletedFileIds, setEditCommentDeletedFileIds] = useState([])
  const [savingEditComment, setSavingEditComment] = useState(false)

  const [activities, setActivities] = useState([])
  const [showActivities, setShowActivities] = useState(false)
  const [loadingActivities, setLoadingActivities] = useState(false)
  // Tab kept in the URL as ?tab= so a task can be linked straight to its
  // comments or activities. A query param rather than a path segment: the
  // sheet opens from several different task routes.
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const detailTab = ['subtasks', 'comments', 'activities'].includes(tabParam) ? tabParam : 'comments'
  const setDetailTab = (key) => {
    const next = new URLSearchParams(searchParams)
    if (key === 'comments') { next.delete('tab') } else { next.set('tab', key) }
    setSearchParams(next, { replace: true })
  }

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

  const lastPushedPathRef = useRef(null)

  useEffect(() => {
    const taskId = currentTask?.id
    const taskListId = currentTask?.task_list_id || currentTask?.task_list?.data?.id
    const pid = projectId

    if (!taskSheetOpen) {
      const isOnTaskUrl = /\/tasks\/\d+$/.test(location.pathname)
      if (prePathRef.current !== null && isOnTaskUrl) {
        const restore = prePathRef.current
        prePathRef.current = null
        lastPushedPathRef.current = null
        navigate(restore, { replace: true })
      } else if (lastPushedPathRef.current && isOnTaskUrl) {
        let fallback = location.pathname.replace(/\/tasks\/\d+$/, '')
        const sprintProjectMatch = fallback.match(/^\/sprints\/projects\/\d+$/)
        if (sprintProjectMatch) fallback = '/sprints'
        lastPushedPathRef.current = null
        navigate(fallback, { replace: true })
      } else {
        prePathRef.current = null
        lastPushedPathRef.current = null
      }
      return
    }

    if (!taskId || !pid) return

    // Navigating to another project while a sheet is open: close it instead of
    // rewriting the URL back to the open task's project, which used to bounce
    // the user into the previously visited project.
    const onOtherProjectMatch = location.pathname.match(/^\/projects\/(\d+)(?:\/|$)/)
    if (onOtherProjectMatch && String(onOtherProjectMatch[1]) !== String(pid)) {
      dispatch(closeTaskSheet())
      return
    }

    const onSingleListMatch = location.pathname.match(/^\/projects\/(\d+)\/task-lists\/(\d+)(?:\/|$)/)
    const onTaskListsOverview = /^\/projects\/(\d+)\/task-lists(?:\/|$)/.test(location.pathname) && !onSingleListMatch
    const onKanbanMatch = location.pathname.match(/^\/projects\/(\d+)\/kanban(?:\/|$)/)
    const onGanttMatch = location.pathname.match(/^\/projects\/(\d+)\/gantt(?:\/|$)/)
    const onMilestonesMatch = location.pathname.match(/^\/projects\/(\d+)\/milestones(?:\/|$)/)
    const onSprintMatch = /^\/sprints(?:\/|$)/.test(location.pathname)

    let target = null
    if (onSingleListMatch && String(onSingleListMatch[1]) === String(pid)) {
      const urlListId = onSingleListMatch[2]
      const useListId = (taskListId && String(taskListId) !== String(urlListId)) ? taskListId : urlListId
      target = `/projects/${pid}/task-lists/${useListId}/tasks/${taskId}`
    } else if (onTaskListsOverview) {
      target = `/projects/${pid}/task-lists/tasks/${taskId}`
    } else if (onKanbanMatch && String(onKanbanMatch[1]) === String(pid)) {
      target = `/projects/${pid}/kanban/tasks/${taskId}`
    } else if (onGanttMatch && String(onGanttMatch[1]) === String(pid)) {
      target = `/projects/${pid}/gantt/tasks/${taskId}`
    } else if (onMilestonesMatch && String(onMilestonesMatch[1]) === String(pid)) {
      target = `/projects/${pid}/milestones/tasks/${taskId}`
    } else if (onSprintMatch) {
      target = `/sprints/projects/${pid}/tasks/${taskId}`
    }

    if (!target) return

    if (location.pathname === target) {
      lastPushedPathRef.current = target
      return
    }

    if (lastPushedPathRef.current && location.pathname !== lastPushedPathRef.current) {
      dispatch(closeTaskSheet())
      return
    }

    if (prePathRef.current === null) {
      prePathRef.current = location.pathname + location.search
    }
    lastPushedPathRef.current = target
    navigate(target, { replace: true })
  }, [taskSheetOpen, currentTask?.id, currentTask?.task_list_id, projectId, location.pathname, location.search, navigate, dispatch])


  const assignees = currentTask
    ? (Array.isArray(currentTask.assignees) ? currentTask.assignees : (currentTask.assignees?.data) ?? [])
    : []
  const comments = useAppSelector(s => s.tasks.taskComments)
  // Subtasks live in a Pro slice that only loads once its tab is opened, so take
  // the count off the task itself. Every subtask mutation refetches the task.
  const subtaskCount = parseInt(currentTask?.meta?.total_sub_task) || 0
  const complete = currentTask ? isTaskComplete(currentTask.status) : false

  const handleClose = useCallback((open) => {
    if (!open) {
      dispatch(closeTaskSheet())
      setFullscreen(false)
      setEditingDates(false)
      setShowAssigneeSearch(false)
      setShowActivities(false)
      setNewComment('')
      // Drop ?tab= with the sheet so the next task opens on comments.
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete('tab')
        return next
      }, { replace: true })
    }
  }, [dispatch, setSearchParams])

  const handleTitleSave = useCallback(async () => {
    if (!currentTask || !projectId || title === currentTask.title) {
      setEditingTitle(false)
      return
    }
    try {
      await dispatch(updateTask({ projectId, taskId: currentTask.id, data: { title } })).unwrap()
    } catch {
      toast.error(__('Failed to update title', 'wedevs-project-manager'))
      setTitle(currentTask.title)
    }
    setEditingTitle(false)
  }, [dispatch, projectId, currentTask, title, toast, __])

  const handleDescSave = useCallback(async () => {
    if (!currentTask || !projectId) return
    setSavingDesc(true)
    try {
      await dispatch(updateTask({ projectId, taskId: currentTask.id, data: { description } })).unwrap()
      toast.success(__('Description updated', 'wedevs-project-manager'))
      setEditingDesc(false)
    } catch {
      toast.error(__('Failed to update description', 'wedevs-project-manager'))
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
      toast.success(newStatus === 1 ? __('Task completed', 'wedevs-project-manager') : __('Task reopened', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to update status', 'wedevs-project-manager'))
    }
  }, [dispatch, projectId, currentTask, toast, __])

  const handleDateSave = useCallback(async () => {
    if (!currentTask || !projectId || !canEditCurrentTask) return
    // Local validation: due date can't be before start date.
    if (startDate && dueDate && dueDate < startDate) {
      toast.warning(__('Due date cannot be earlier than the start date', 'wedevs-project-manager'))
      return
    }
    try {
      await dispatch(updateTask({
        projectId, taskId: currentTask.id,
        data: { start_at: startDate || undefined, due_date: dueDate || undefined },
      })).unwrap()
      toast.success(__('Dates updated', 'wedevs-project-manager'))
      setEditingDates(false)
    } catch {
      toast.error(__('Failed to update dates', 'wedevs-project-manager'))
    }
  }, [dispatch, projectId, currentTask, startDate, dueDate, toast, __, canEditCurrentTask])

  useEffect(() => {
    if (!canEditCurrentTask) setEditingDates(false)
  }, [canEditCurrentTask, currentTask?.id])

  const projectMembers = project?.assignees?.data ?? []
  const filteredMembers = assigneeQuery.trim().length === 0
    ? projectMembers
    : projectMembers.filter(u => (u.display_name || '').toLowerCase().includes(assigneeQuery.toLowerCase()))

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
      toast.success(
        __('Assignee added', 'wedevs-project-manager'),
        sprintf(/* translators: %s is the name of the user assigned to the task. */ __('%s was assigned to this task.', 'wedevs-project-manager'), user.display_name),
        { user }
      )
    } catch {
      toast.error(__('Failed to add assignee', 'wedevs-project-manager'))
    }
    setAssigneeQuery('')
    setShowAssigneeSearch(false)
  }, [dispatch, projectId, currentTask, assignees, toast, __])

  const handleRemoveAssignee = useCallback(async (userId) => {
    if (!currentTask || !projectId) return
    const removedUser = projectMembers.find(u => parseInt(u.id) === parseInt(userId))
    const removedName = removedUser?.display_name
    const remainingIds = assignees.map(a => a.assigned_to ?? a.id).filter(id => parseInt(id) !== parseInt(userId))
    try {
      const assigneePayload = remainingIds.length > 0 ? remainingIds : [-1]
      await dispatch(updateTask({
        projectId, taskId: currentTask.id,
        data: { assignees: assigneePayload },
      })).unwrap()
      dispatch(fetchTask({ projectId, taskId: currentTask.id }))
      toast.success(
        __('Assignee removed', 'wedevs-project-manager'),
        removedName
          ? sprintf(/* translators: %s is the name of the user removed from the task. */ __('%s was removed from this task.', 'wedevs-project-manager'), removedName)
          : undefined,
        removedUser ? { user: removedUser } : undefined
      )
    } catch {
      toast.error(__('Failed to remove assignee', 'wedevs-project-manager'))
    }
  }, [dispatch, projectId, currentTask, assignees, projectMembers, toast, __])

  const handleSubmitComment = useCallback(async () => {
    if (!currentTask || !projectId || !newComment.trim()) return
    setSubmittingComment(true)
    const mentionedUsers = extractMentionedUsers(newComment)
    try {
      if (commentFiles.length > 0) {
        const formData = new FormData()
        formData.append('content', newComment)
        formData.append('commentable_id', currentTask.id)
        formData.append('commentable_type', 'task')
        formData.append('mentioned_users', mentionedUsers)
        commentNotifyUsers.forEach(id => formData.append('notify_users[]', String(id)))
        formData.append('project_id', projectId)
        commentFiles.forEach(f => formData.append('files[]', f))
        await api.upload(`projects/${projectId}/comments`, formData)
        dispatch(fetchTask({ projectId, taskId: currentTask.id }))
      } else {
        await dispatch(addTaskComment({ projectId, taskId: currentTask.id, content: newComment, mentionedUsers, notifyUsers: commentNotifyUsers })).unwrap()
      }
      setNewComment('')
      setCommentFiles([])
      setCommentNotifyUsers([])
      toast.success(__('Comment added', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to add comment', 'wedevs-project-manager'))
    }
    setSubmittingComment(false)
  }, [dispatch, projectId, currentTask, newComment, commentFiles, commentNotifyUsers, api, toast, __])

  const startEditComment = useCallback((c) => {
    setEditingCommentId(c.id)
    setEditCommentText(c.content || '')
    setEditCommentNewFiles([])
    setEditCommentDeletedFileIds([])
  }, [])

  const cancelEditComment = useCallback(() => {
    setEditingCommentId(null)
    setEditCommentText('')
    setEditCommentNewFiles([])
    setEditCommentDeletedFileIds([])
  }, [])

  const markDeleteExistingFile = useCallback((fileId) => {
    setEditCommentDeletedFileIds(prev =>
      prev.includes(fileId) ? prev : [...prev, fileId]
    )
  }, [])

  const handleUpdateComment = useCallback(async () => {
    if (!editCommentText.trim() || !editingCommentId || !projectId) return
    setSavingEditComment(true)
    try {
      const mentionedUsers = extractMentionedUsers(editCommentText)
      await dispatch(updateTaskComment({
        projectId,
        commentId: editingCommentId,
        content: editCommentText.trim(),
        mentionedUsers,
        files: editCommentNewFiles,
        filesToDelete: editCommentDeletedFileIds,
      })).unwrap()
      if (currentTask?.id) {
        dispatch(fetchTask({ projectId, taskId: currentTask.id }))
      }
      cancelEditComment()
      toast.success(__('Comment updated', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to update comment', 'wedevs-project-manager'))
    }
    setSavingEditComment(false)
  }, [dispatch, projectId, editingCommentId, editCommentText, editCommentNewFiles, editCommentDeletedFileIds, currentTask?.id, toast, __, cancelEditComment])

  const handleDeleteComment = useCallback(async (commentId) => {
    if (!projectId) return
    try {
      await dispatch(deleteTaskComment({ projectId, commentId, taskId: currentTask?.id })).unwrap()
      toast.success(__('Comment deleted', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to delete comment', 'wedevs-project-manager'))
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

  // Opening the sheet straight on ?tab=activities has no click to hang the
  // fetch off, so the feed stayed empty until the tab was clicked again.
  useEffect(() => {
    if (detailTab === 'activities' && !showActivities && currentTask && projectId) {
      handleLoadActivities()
    }
  }, [detailTab, showActivities, currentTask, projectId, handleLoadActivities])

  const handleDelete = useCallback(async () => {
    if (!currentTask || !projectId) return
    const ok = await confirm(__('Are you sure you want to delete this task?', 'wedevs-project-manager'), __('Delete Task', 'wedevs-project-manager'))
    if (!ok) return
    dispatch(removeTaskFromList({ listId: currentTask.task_list_id, taskId: currentTask.id }))
    dispatch(markTaskModified())
    dispatch(closeTaskSheet())
    try {
      await dispatch(deleteTask({ projectId, taskId: currentTask.id })).unwrap()
      toast.success(__('Task deleted', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to delete task', 'wedevs-project-manager'))
    }
  }, [dispatch, projectId, currentTask, toast, __, confirm])

  const handleCopyLink = useCallback(async () => {
    const listId = currentTask?.task_list_id || currentTask?.task_list?.data?.id
    const taskId = currentTask?.id
    const hashPath = listId
      ? `#/projects/${projectId}/task-lists/${listId}/tasks/${taskId}`
      : `#/projects/${projectId}/task-lists/tasks/${taskId}`
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}${hashPath}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success(__('Link copied', 'wedevs-project-manager'))
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
        toast.success(__('Link copied', 'wedevs-project-manager'))
      } catch {
        toast.error(__('Could not copy link', 'wedevs-project-manager'))
      }
    }
  }, [projectId, currentTask, toast, __])

  return (
    <>
    <ConfirmDialog />
    <Dialog open={taskSheetOpen} onOpenChange={handleClose}>
      <DialogContent
        data-pm-dialog
        className={cn(
          'flex flex-col gap-0 overflow-hidden p-0 border-pm-border transition-all duration-200',
          fullscreen ? 'w-[98vw] max-w-[98vw] h-[96vh]' : 'w-[95vw] max-w-6xl h-[88vh]',
        )}
        onPointerDownOutside={(e) => { if (isGooglePickerInteraction(e)) e.preventDefault() }}
        onInteractOutside={(e) => { if (isGooglePickerInteraction(e)) e.preventDefault() }}
        onFocusOutside={(e) => { if (isGooglePickerInteraction(e)) e.preventDefault() }}
      >
        <DialogTitle className="sr-only">{currentTask?.title || __('Task details', 'wedevs-project-manager')}</DialogTitle>
        {loading && !currentTask ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-pm-accent" />
          </div>
        ) : currentTask ? (
          <>
            {/* Toolbar (built-in close button sits top-right) */}
            <div className="flex items-center gap-1 px-4 py-2.5 pr-14 shrink-0">
              <button
                type="button"
                onClick={() => setFullscreen(v => !v)}
                className="p-1.5 rounded-md hover:bg-muted text-pm-text-muted hover:text-pm-text-primary transition-colors"
                title={fullscreen ? __('Exit full screen', 'wedevs-project-manager') : __('Full screen', 'wedevs-project-manager')}
              >
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button aria-label={__('Task actions', 'wedevs-project-manager')} className="p-1.5 rounded-md hover:bg-muted text-pm-text-muted hover:text-pm-text-primary transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Link2 className="h-4 w-4 mr-2" />{__('Copy Link', 'wedevs-project-manager')}
                  </DropdownMenuItem>
                  {canEditTask(currentTask) && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />{__('Delete', 'wedevs-project-manager')}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator />

            {/* Two-column body */}
            <div className="flex flex-1 min-h-0 max-md:flex-col max-md:overflow-y-auto">

            {/* LEFT — task header + properties */}
            <aside className="w-[400px] shrink-0 overflow-y-auto border-r border-pm-border px-5 py-4 space-y-2.5 max-md:w-full max-md:overflow-visible max-md:border-r-0 max-md:border-b">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground min-w-0">
                  {(currentTask.project?.data?.title || currentTask.project?.title) && (
                    <button
                      type="button"
                      onClick={() => {
                        const pid = currentTask.project?.data?.id || currentTask.project?.id || projectId
                        dispatch(closeTaskSheet())
                        navigate(`/projects/${pid}/task-lists`)
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-pm-accent hover:text-pm-accent/80 transition-colors truncate min-w-0"
                      title={currentTask.project?.data?.title || currentTask.project?.title}
                    >
                      <FolderKanban className="h-4 w-4 shrink-0" />
                      {currentTask.project?.data?.title || currentTask.project?.title}
                    </button>
                  )}
                  <span className="font-mono text-[12px] text-muted-foreground/60">#{currentTask.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={handleToggleStatus} className="shrink-0 group/status">
                    <TaskStatusCircle complete={complete} size="lg" groupHover />
                  </button>
                  {editingTitle && canEditTask(currentTask) ? (
                    <Input autoFocus value={title} onChange={e => setTitle(e.target.value)} onBlur={handleTitleSave}
                      onKeyDown={e => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') { setTitle(currentTask.title); setEditingTitle(false) } }}
                      className="text-lg font-semibold h-auto py-0.5 border-none shadow-none focus-visible:ring-1 flex-1"
                    />
                  ) : (
                    <h2 className={cn('text-lg font-bold leading-snug break-words', canEditTask(currentTask) && 'cursor-pointer hover:text-pm-accent transition-colors', complete && 'line-through text-pm-text-muted')}
                      title={currentTask.title}
                      {...(canEditTask(currentTask) ? {
                        role: 'button',
                        tabIndex: 0,
                        onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEditingTitle(true) } },
                      } : {})}
                      onClick={() => canEditTask(currentTask) && setEditingTitle(true)}>
                      {currentTask.title}
                    </h2>
                  )}
                </div>
              </div>

              <h3 className="px-2 text-[13px] font-semibold text-pm-text-primary">{__('Attributes', 'wedevs-project-manager')}</h3>
              <div className="flex flex-col divide-y divide-pm-border/40 -mt-2">
                <div className="flex items-center h-11 px-2 rounded-md hover:bg-muted/40 transition-colors cursor-pointer" onClick={handleToggleStatus}>
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                    <Check className="h-4 w-4" /><span className="text-sm">{__('Status', 'wedevs-project-manager')}</span>
                  </div>
                  <span className={cn('inline-flex items-center gap-1.5 text-[15px] font-medium px-2.5 py-0.5 rounded-md',
                    complete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', complete ? 'bg-emerald-500' : 'bg-amber-500')} />
                    {complete ? __('Done', 'wedevs-project-manager') : __('Active', 'wedevs-project-manager')}
                  </span>
                </div>

                <div className="flex items-center min-h-11 px-2 rounded-md hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                    <Calendar className="h-4 w-4" /><span className="text-sm">{__('Dates', 'wedevs-project-manager')}</span>
                  </div>
                  {editingDates ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <DatePicker
                        value={startDate}
                        onChange={(v) => setStartDate(v)}
                        max={dueDate || undefined}
                        placeholder={__('Start', 'wedevs-project-manager')}
                        className="h-7 w-auto min-w-[140px]"
                      />
                      <span className="text-sm text-pm-text-muted">→</span>
                      <DatePicker
                        value={dueDate}
                        onChange={(v) => setDueDate(v)}
                        min={startDate || undefined}
                        placeholder={__('Due', 'wedevs-project-manager')}
                        className="h-7 w-auto min-w-[140px]"
                      />
                      <Button size="sm" className="h-11 text-[15px] px-2" onClick={handleDateSave}>{__('Save', 'wedevs-project-manager')}</Button>
                      <Button variant="ghost" size="sm" className="h-11 text-[15px] px-2" onClick={() => setEditingDates(false)}>{__('Cancel', 'wedevs-project-manager')}</Button>
                    </div>
                  ) : (
                    <button type="button" disabled={!canEditCurrentTask} onClick={() => canEditCurrentTask && setEditingDates(true)} className={cn('text-sm text-pm-text-primary transition-colors', canEditCurrentTask && 'hover:text-pm-accent')}>
                      {extractDateStr(currentTask.start_at) && extractDateStr(currentTask.due_date)
                        ? `${formatPmDate(currentTask.start_at)} → ${formatPmDate(currentTask.due_date)}`
                        : extractDateStr(currentTask.due_date)
                          ? formatPmDate(currentTask.due_date)
                          : __('Set dates', 'wedevs-project-manager')}
                    </button>
                  )}
                </div>

                <div className="flex items-center min-h-11 px-2 rounded-md hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                    <Users className="h-4 w-4" /><span className="text-sm">{__('Assignees', 'wedevs-project-manager')}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {assignees.map(user => (
                        <span key={user.id || user.assigned_to} className="inline-flex items-center gap-1 text-sm bg-muted/50 rounded-md pl-0.5 pr-2 py-0.5">
                          <UserAvatar user={user} size="sm" />
                          {user.display_name}
                          {canEditTask(currentTask) && (
                            <button type="button" className="ml-0.5 text-pm-text-muted hover:text-destructive" onClick={() => handleRemoveAssignee(user.assigned_to ?? user.id)}>
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </span>
                      ))}
                      {canEditTask(currentTask) && (
                        <button type="button" onClick={() => setShowAssigneeSearch(v => !v)}
                          className="inline-flex items-center gap-1 text-[15px] text-pm-accent hover:text-pm-accent/80 transition-colors">
                          <Plus className="h-4 w-4" />{__('Add', 'wedevs-project-manager')}
                        </button>
                      )}
                    </div>
                    {canEditTask(currentTask) && showAssigneeSearch && (
                      <div className="relative mt-1.5">
                        <Input autoFocus value={assigneeQuery} onChange={e => setAssigneeQuery(e.target.value)}
                          placeholder={__('Search members...', 'wedevs-project-manager')} className="h-7 text-sm pr-7"
                          onKeyDown={e => { if (e.key === 'Escape') { setShowAssigneeSearch(false); setAssigneeQuery('') } }}
                        />
                        <button
                          type="button"
                          onClick={() => { setShowAssigneeSearch(false); setAssigneeQuery('') }}
                          className="absolute right-1 inset-y-0 flex items-center px-0.5 text-pm-text-muted hover:text-destructive transition-colors"
                          title={__('Close', 'wedevs-project-manager')}
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto p-1">
                          {filteredMembers.length === 0 && (
                            <div className="px-3 py-3 text-sm text-pm-text-muted">{__('No project members', 'wedevs-project-manager')}</div>
                          )}
                          {filteredMembers.map(u => {
                            const isAssigned = assignees.some(a => parseInt(a.id || a.assigned_to) === parseInt(u.id))
                            return (
                              <button key={u.id} type="button"
                                className={cn("w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors", isAssigned ? "bg-pm-accent/5" : "hover:bg-muted/60")}
                                onClick={() => isAssigned ? handleRemoveAssignee(u.id) : handleAddAssignee(u)}
                              >
                                <UserAvatar user={u} size="md" className="shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-pm-text-primary truncate">{u.display_name}</p>
                                  {u.email && <p className="text-[12px] text-pm-text-muted truncate">{u.email}</p>}
                                </div>
                                {isAssigned && <Check className="h-4 w-4 text-pm-accent shrink-0" />}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {currentTask.creator?.data && (
                  <div className="flex items-center h-11 px-2 rounded-md hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                      <Users className="h-4 w-4" /><span className="text-sm">{__('Created by', 'wedevs-project-manager')}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { dispatch(closeTaskSheet()); navigate('/my-tasks'); }}
                      className="inline-flex items-center gap-1.5 text-sm text-pm-text-primary hover:text-pm-accent transition-colors"
                    >
                      <UserAvatar user={currentTask.creator.data} size="sm" />
                      {currentTask.creator.data.display_name}
                    </button>
                  </div>
                )}

                {currentTask.created_at && (
                  <div className="flex items-center h-11 px-2 rounded-md hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
                      <Calendar className="h-4 w-4" /><span className="text-sm">{__('Created', 'wedevs-project-manager')}</span>
                    </div>
                    <span className="text-sm text-pm-text-primary">{formatPmDateTime(currentTask.created_at)}</span>
                  </div>
                )}

                <TaskEstimationField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} api={api} />

                <TaskTypeField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} api={api} canEdit={canEditTask(currentTask)} />

                <TaskPriorityField task={currentTask} projectId={currentTask?.project_id} dispatch={dispatch} canEdit={canEditTask(currentTask)} />

                <MilestoneField task={currentTask} projectId={currentTask?.project_id} api={api} canEdit={canEditTask(currentTask)} />

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
            </aside>

            {/* RIGHT — description + tabs */}
            <div className="flex-1 min-w-0 overflow-y-auto max-md:w-full">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide text-muted-foreground/70"><FileText className="h-4 w-4" />{__('Description', 'wedevs-project-manager')}</h4>
                {!editingDesc && canEditTask(currentTask) && (
                  <Button
                    size="sm"
                    className="h-11 px-4 text-sm gap-1.5"
                    onClick={() => { setDescription(currentTask.description?.html || currentTask.description?.content || ''); setEditingDesc(true) }}
                  >
                    {currentTask.description?.content ? (<>
                      <Pencil className="h-4 w-4" />{__('Edit', 'wedevs-project-manager')}
                    </>) : (<>
                      <Plus className="h-4 w-4" />{__('Add', 'wedevs-project-manager')}
                    </>)}
                  </Button>
                )}
              </div>
              {editingDesc ? (
                <div className="space-y-3">
                  <RichTextEditor content={description} placeholder={__('Write a description...', 'wedevs-project-manager')} onChange={html => setDescription(html)} autofocus minHeight="100px" users={project?.assignees?.data ?? []} />
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="h-11 text-sm" onClick={handleDescSave} disabled={savingDesc}>{savingDesc ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{__('Saving...', 'wedevs-project-manager')}</> : __('Save', 'wedevs-project-manager')}</Button>
                    <Button variant="ghost" size="sm" className="h-11 text-sm" onClick={handleDescCancel}>{__('Cancel', 'wedevs-project-manager')}</Button>
                  </div>
                </div>
              ) : (
                <div
                  className={cn('rounded-lg p-3 min-h-[48px] transition-colors', currentTask.description?.html ? 'bg-muted/20' : 'bg-muted/10 border border-dashed border-border/60', canEditTask(currentTask) && !currentTask.description?.html && 'cursor-text hover:bg-muted/40')}
                  {...(canEditTask(currentTask) && !currentTask.description?.html ? {
                    role: 'button',
                    tabIndex: 0,
                    onClick: () => { setDescription(currentTask.description?.content || ''); setEditingDesc(true) },
                    onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); setDescription(currentTask.description?.content || ''); setEditingDesc(true) } },
                  } : {})}
                >
                  {currentTask.description?.html ? (
                    <>
                      <div className="prose prose-sm max-w-none text-foreground text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripAllPreviewUrls(currentTask.description.html)) }} />
                      <GitHubPreviewContainer content={currentTask.description.html} />
                      <NotionPreviewContainer content={currentTask.description.html} />
                      <LoomPreviewContainer content={currentTask.description.html} />
                    </>
                  ) : (
                    <p className="text-sm text-pm-text-muted italic">{canEditTask(currentTask) ? __('Click here to add a description…', 'wedevs-project-manager') : __('No description yet.', 'wedevs-project-manager')}</p>
                  )}
                </div>
              )}
            </div>

            <Separator />

            <div className="px-6 pt-4">
              <div className="inline-flex max-w-full items-center rounded-lg border border-pm-border bg-muted/60 p-1 gap-0.5 overflow-x-auto scrollbar-none max-md:flex-wrap max-md:overflow-visible">
                {[
                  { key: 'subtasks', label: __('Subtasks', 'wedevs-project-manager'), count: subtaskCount, pro: !isPro, icon: ListChecks },
                  { key: 'comments', label: __('Comments', 'wedevs-project-manager'), count: comments.length, icon: MessageSquare },
                  { key: 'activities', label: __('Activities', 'wedevs-project-manager'), count: activities.length, icon: Activity },
                ].map(t => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => { setDetailTab(t.key); if (t.key === 'activities' && !showActivities) handleLoadActivities() }}
                    className={cn('relative inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200', detailTab === t.key ? 'bg-background text-pm-accent shadow-sm' : 'text-pm-text-muted hover:text-pm-text-primary')}
                  >
                    {t.icon && <t.icon className="h-4 w-4" />}
                    {t.label}
                    {t.count > 0 && <span className={cn('inline-flex items-center justify-center rounded-md px-1.5 min-w-[18px] h-[18px] text-[12px] font-medium tabular-nums', detailTab === t.key ? 'bg-pm-accent/10 text-pm-accent' : 'text-pm-text-muted/70')}>{t.count}</span>}
                    {t.pro && <ProBadge interactive={false} />}
                  </button>
                ))}
              </div>
            </div>

            {detailTab === 'subtasks' && (
              <ProSubtasksSection
                taskId={currentTask?.id}
                projectId={currentTask?.project_id}
                currentTask={currentTask}
              />
            )}

            {detailTab === 'comments' && (
              <div className="px-6 py-4">
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
                                <button type="button" onClick={() => startEditComment(comment)} className="p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent" title={__('Edit', 'wedevs-project-manager')}>
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button type="button" onClick={() => handleDeleteComment(comment.id)} className="p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-destructive" title={__('Delete', 'wedevs-project-manager')}>
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </span>
                            )}
                          </div>
                          {isEditing ? (
                            <div className="space-y-2">
                              <RichTextEditor content={editCommentText} onChange={setEditCommentText} minHeight="60px" autofocus users={project?.assignees?.data ?? []} />
                              {comment.files?.data?.filter(f => !editCommentDeletedFileIds.includes(f.id)).length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                  {comment.files.data.filter(f => !editCommentDeletedFileIds.includes(f.id)).map(f => (
                                    <CommentAttachment key={f.id} file={f} onRemove={markDeleteExistingFile} />
                                  ))}
                                </div>
                              )}
                              <FileUploadArea files={editCommentNewFiles} onFilesChange={setEditCommentNewFiles} compact />
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="h-11 text-[15px]" onClick={handleUpdateComment} disabled={savingEditComment || !editCommentText.trim()}>
                                  {savingEditComment ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{__('Saving...', 'wedevs-project-manager')}</> : __('Save', 'wedevs-project-manager')}
                                </Button>
                                <Button size="sm" variant="ghost" className="h-11 text-[15px]" onClick={cancelEditComment} disabled={savingEditComment}>{__('Cancel', 'wedevs-project-manager')}</Button>
                                <CommentLinkActions projectId={projectId} onInsert={(html) => setEditCommentText(prev => (prev || '') + html)} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="pm-rich-comment-content text-sm leading-relaxed prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: decorateGoogleLinks(sanitizeHtml(stripAllPreviewUrls(comment.content))) }} />
                              <GitHubPreviewContainer content={comment.content || ''} />
                              <NotionPreviewContainer content={comment.content || ''} />
                              <LoomPreviewContainer content={comment.content || ''} />
                            </>
                          )}
                          {!isEditing && comment.files?.data?.length > 0 && (
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {comment.files.data.map(f => (
                                <CommentAttachment key={f.id} file={f} />
                              ))}
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
                  placeholder={__('Write a comment...', 'wedevs-project-manager')}
                  onChange={(html) => setNewComment(html)}
                  minHeight="60px"
                  users={project?.assignees?.data ?? []}
                />
                <FileUploadArea files={commentFiles} onFilesChange={setCommentFiles} compact />
                <div className="flex items-center gap-2 flex-wrap">
                  <NotifyUsers
                    users={project?.assignees?.data ?? []}
                    value={commentNotifyUsers}
                    onChange={setCommentNotifyUsers}
                  />
                  <Button size="sm" className="h-11 text-sm gap-1" onClick={handleSubmitComment} disabled={!newComment.trim() || submittingComment}>
                    <Plus className="h-4 w-4" />{submittingComment ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{__('Sending...', 'wedevs-project-manager')}</> : __('Add Comment', 'wedevs-project-manager')}
                  </Button>
                  <CommentLinkActions projectId={projectId} onInsert={(html) => setNewComment(prev => (prev || '') + html)} />
                </div>
              </div>
              </div>
              )}

              {detailTab === 'activities' && (
                <div className="px-6 py-4">
                  {loadingActivities ? (
                    <div className="space-y-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="flex gap-3">
                          <Skeleton className="h-7 w-7 rounded-md shrink-0" />
                          <div className="flex-1 space-y-1.5 pt-0.5">
                            <Skeleton className="h-3.5 w-3/4" />
                            <Skeleton className="h-3 w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activities.length > 0 ? (
                    <div>
                      {activities.map((act, i) => {
                        const actActor = act.actor?.data;
                        const isLast = i === activities.length - 1;
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
                          <div key={act.id || i} className="flex gap-3">
                            {/* Avatar rail with connector */}
                            <div className="flex flex-col items-center shrink-0">
                              {actActor ? (
                                <UserAvatar user={actActor} size="sm" className="-mt-1" />
                              ) : (
                                <span className="-mt-1 flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                                  <Activity className="h-3.5 w-3.5 text-pm-text-muted" />
                                </span>
                              )}
                              {!isLast && <div className="my-1 w-px flex-1 bg-pm-border" />}
                            </div>

                            {/* Content */}
                            <div className={cn('min-w-0 flex-1', isLast ? 'pb-0' : 'pb-4')}>
                              <div className="text-sm leading-snug text-pm-text">
                                {actActor?.id && (
                                  <button
                                    type="button"
                                    onClick={() => { dispatch(closeTaskSheet()); navigate('/my-tasks'); }}
                                    className="border-0 bg-transparent p-0 align-baseline font-medium text-pm-text-primary hover:text-pm-accent transition-colors cursor-pointer mr-1"
                                  >
                                    {actActor.display_name}
                                  </button>
                                )}
                                {actUrl ? (
                                  <button
                                    type="button"
                                    onClick={handleActClick}
                                    className="border-0 bg-transparent p-0 align-baseline text-left text-pm-text-muted hover:text-pm-accent transition-colors cursor-pointer"
                                  >
                                    {parseActivityMessage(act) || act.action}
                                  </button>
                                ) : (
                                  <span className="text-pm-text-muted">{parseActivityMessage(act) || act.action}</span>
                                )}
                                {(act.action === 'attach_drive_file' || act.meta?.has_drive) && (
                                  act.action === 'attach_drive_file' && act.meta?.file_url ? (
                                    <a href={act.meta.file_url} target="_blank" rel="noopener noreferrer" title={act.meta.file_name || __('Google Drive file', 'wedevs-project-manager')} className="ml-1.5 inline-flex align-middle text-pm-text-muted/35 hover:text-pm-accent">
                                      <DriveMonoGlyph className="h-4 w-4" />
                                    </a>
                                  ) : (
                                    <DriveMonoGlyph className="ml-1.5 inline-flex align-middle h-4 w-4 text-pm-text-muted/30" title={__('Google Drive', 'wedevs-project-manager')} />
                                  )
                                )}
                                {act.meta?.has_meet && (
                                  <Video className="ml-1.5 inline-flex align-middle h-4 w-4 text-pm-text-muted/30" title={__('Google Meet', 'wedevs-project-manager')} />
                                )}
                              </div>
                              {act.committed_at && (
                                <div className="mt-0.5 text-[12px] text-pm-text-muted/70 tabular-nums">
                                  {formatPmDateTime(act.committed_at)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-pm-text-muted italic">{__('No activity yet', 'wedevs-project-manager')}</p>
                  )}
                </div>
              )}

            </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
    </>
  )
}
