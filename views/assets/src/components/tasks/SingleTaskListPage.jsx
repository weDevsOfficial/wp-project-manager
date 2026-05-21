import { __ } from '@wordpress/i18n';
import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchSingleList, addTaskToList } from '@store/taskListsSlice'
import { useApi } from '@hooks/useApi'
import { useToast } from '@hooks/useToast'
import { useConfirm } from '@hooks/useConfirm'
import { useCurrentProject } from '@hooks/useCurrentProject'
import { Button } from '@components/ui/button'
import { Progress } from '@components/ui/progress'
import { Skeleton } from '@components/ui/skeleton'
import { UserAvatar } from '@components/common/UserAvatar'
import RichTextEditor from '@components/common/RichTextEditor'
import NotifyUsers from '@components/common/NotifyUsers'
import FileUploadArea from '@components/common/FileUploadArea'
import { cn } from '@lib/utils'
import { Lock, MessageSquare, Pencil, Trash2, Paperclip, X } from 'lucide-react'
import BackButton from '@components/common/BackButton'
import { formatPmDateTime } from '@lib/pm-utils'
import TaskRow from './TaskRow'
import TaskDetailSheet from './TaskDetailSheet'
import { sanitizeHtml } from '@lib/sanitize'

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

export default function SingleTaskListPage() {
  const { projectId: pidParam, listId: lidParam } = useParams()
  const projectId = parseInt(pidParam ?? '0', 10)
  const listId = parseInt(lidParam ?? '0', 10)
  const dispatch = useAppDispatch()
  const project = useCurrentProject(projectId)
  const projectUsers = project?.assignees?.data ?? []
  const api = useApi()
  const toast = useToast()
  const [ConfirmDialog, confirm] = useConfirm()

  const currentList = useAppSelector(s => s.taskLists.currentList)
  const [loading, setLoading] = useState(true)
  const [showCompleted, setShowCompleted] = useState(false)
  const [showLabels, setShowLabels] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingMoreComplete, setLoadingMoreComplete] = useState(false)
  const [allIncompleteLoaded, setAllIncompleteLoaded] = useState(false)
  const [allCompleteLoaded, setAllCompleteLoaded] = useState(false)

  // Discussion / comments
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentNotifyUsers, setCommentNotifyUsers] = useState([])
  const [commentFiles, setCommentFiles] = useState([])
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState('')
  const [editCommentNewFiles, setEditCommentNewFiles] = useState([])
  const [editCommentDeletedFileIds, setEditCommentDeletedFileIds] = useState([])
  const [savingEditComment, setSavingEditComment] = useState(false)

  useEffect(() => {
    if (projectId && listId) {
      setLoading(true)
      dispatch(fetchSingleList({ projectId, listId }))
        .finally(() => setLoading(false))

      api.get(`projects/${projectId}`, { with: 'labels' })
        .then(res => {
          const proj = res?.data ?? res
          if (proj?.label_in_tasks_list) {
            setShowLabels(proj.label_in_tasks_list.status === 'enable' || proj.label_in_tasks_list.status === true)
          }
        })
        .catch(() => {})
    }
  }, [dispatch, projectId, listId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync comments from currentList
  useEffect(() => {
    if (currentList?.comments?.data) {
      setComments(currentList.comments.data)
    }
  }, [currentList])

  // ── Comment handlers ──────────────────────────────
  const handleSubmitComment = useCallback(async () => {
    if (!newComment.trim()) return
    setSubmittingComment(true)
    const mentionedUsers = extractMentionedUsers(newComment)
    try {
      let res
      if (commentFiles.length > 0) {
        const fd = new FormData()
        fd.append('content', newComment)
        fd.append('commentable_id', listId)
        fd.append('commentable_type', 'task_list')
        fd.append('project_id', projectId)
        fd.append('mentioned_users', mentionedUsers)
        commentNotifyUsers.forEach(id => fd.append('notify_users[]', String(id)))
        commentFiles.forEach(f => fd.append('files[]', f))
        res = await api.upload(`projects/${projectId}/comments`, fd)
      } else {
        res = await api.post(`projects/${projectId}/comments`, {
          content: newComment,
          commentable_id: listId,
          commentable_type: 'task_list',
          project_id: projectId,
          mentioned_users: mentionedUsers,
          notify_users: commentNotifyUsers,
        })
      }
      if (res.data) {
        setComments(prev => [...prev, res.data])
      }
      setNewComment('')
      setCommentNotifyUsers([])
      setCommentFiles([])
      toast.success(__('Comment added', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to add comment', 'wedevs-project-manager'))
    }
    setSubmittingComment(false)
  }, [api, projectId, listId, newComment, commentNotifyUsers, commentFiles, toast, __])

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
    if (!editCommentText.trim() || !editingCommentId) return
    setSavingEditComment(true)
    const mentionedUsers = extractMentionedUsers(editCommentText)
    try {
      const hasFileChange = editCommentNewFiles.length > 0 || editCommentDeletedFileIds.length > 0
      let res
      if (hasFileChange) {
        const fd = new FormData()
        fd.append('content', editCommentText.trim())
        fd.append('project_id', projectId)
        fd.append('mentioned_users', mentionedUsers)
        fd.append('notify_users', '')
        editCommentNewFiles.forEach(f => fd.append('files[]', f))
        editCommentDeletedFileIds.forEach(id => fd.append('files_to_delete[]', String(id)))
        res = await api.upload(`projects/${projectId}/comments/${editingCommentId}`, fd)
      } else {
        res = await api.post(`projects/${projectId}/comments/${editingCommentId}`, {
          content: editCommentText.trim(),
          mentioned_users: mentionedUsers,
          notify_users: '',
        })
      }
      if (res?.data) {
        setComments(prev => prev.map(c => c.id === editingCommentId ? res.data : c))
      } else {
        setComments(prev => prev.map(c =>
          c.id === editingCommentId ? { ...c, content: editCommentText.trim() } : c
        ))
      }
      dispatch(fetchSingleList({ projectId, listId }))
      cancelEditComment()
      toast.success(__('Comment updated', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to update comment', 'wedevs-project-manager'))
    }
    setSavingEditComment(false)
  }, [api, projectId, listId, dispatch, editingCommentId, editCommentText, editCommentNewFiles, editCommentDeletedFileIds, toast, __, cancelEditComment])

  const handleDeleteComment = useCallback(async (commentId) => {
    const ok = await confirm(__('Are you sure?', 'wedevs-project-manager'), __('Delete Comment', 'wedevs-project-manager'))
    if (!ok) return
    try {
      await api.post(`projects/${projectId}/comments/${commentId}/delete`)
      setComments(prev => prev.filter(c => c.id !== commentId))
      toast.success(__('Comment deleted', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to delete comment', 'wedevs-project-manager'))
    }
  }, [api, projectId, toast, __])

  // ── Load more tasks (same pattern as TaskListSection) ──
  const handleLoadMore = useCallback(async (status) => {
    if (!currentList) return
    const isComplete = status === 1
    if (isComplete) setLoadingMoreComplete(true)
    else setLoadingMore(true)
    try {
      const existingTasks = isComplete
        ? (currentList.complete_tasks?.data ?? [])
        : (currentList.incomplete_tasks?.data ?? [])
      const existingIds = existingTasks.map(t => t.id)
      const res = await api.get(`projects/${projectId}/task-lists/${listId}/more/tasks`, {
        task_ids: existingIds,
        status,
      })
      const newTasks = res?.data?.tasks?.data ?? res?.data ?? []
      if (newTasks.length > 0) {
        newTasks.forEach(t => dispatch(addTaskToList({ listId, task: t, incrementTotal: false })))
      } else {
        if (isComplete) setAllCompleteLoaded(true)
        else setAllIncompleteLoaded(true)
      }
    } catch {
      toast.error(__('Failed to load more tasks', 'wedevs-project-manager'))
    }
    if (isComplete) setLoadingMoreComplete(false)
    else setLoadingMore(false)
  }, [api, projectId, listId, currentList, dispatch, toast, __])

  // ── Render ────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-3 bg-muted/30 border-b">
            <Skeleton className="h-5 w-1/3" />
          </div>
          <div className="p-3 space-y-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!currentList) {
    return (
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6">
        <BackButton fallback={`/projects/${projectId}/task-lists`} label={__('Back to Task Lists', 'wedevs-project-manager')} className="mb-4" />
        <p className="text-sm text-pm-text-muted">{__('Task list not found.', 'wedevs-project-manager')}</p>
      </div>
    )
  }

  const incompleteTasks = currentList.incomplete_tasks?.data ?? []
  const completeTasks = currentList.complete_tasks?.data ?? []
  const totalIncomplete = currentList.meta?.total_incomplete_tasks ?? incompleteTasks.length
  const totalComplete = currentList.meta?.total_complete_tasks ?? completeTasks.length
  const total = totalIncomplete + totalComplete
  const progress = total > 0 ? Math.round((totalComplete / total) * 100) : 0
  const currentUserId = typeof PM_Vars !== 'undefined' ? PM_Vars.current_user?.ID : null

  return (
    <>
    <ConfirmDialog />
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      {/* Back button */}
      <BackButton fallback={`/projects/${projectId}/task-lists`} label={__('Back to Task Lists', 'wedevs-project-manager')} />

      {/* List header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-pm-text-primary">{currentList.title}</h1>
        {currentList.meta?.privacy === 1 && (
          <Lock className="h-4 w-4 text-pm-text-muted" title={__('Private', 'wedevs-project-manager')} />
        )}
        <span className="text-sm text-pm-text-muted tabular-nums">
          {totalComplete}/{total}
        </span>
        <Progress value={progress} className="h-1.5 w-20" />
        <span className="text-sm font-medium text-pm-text-muted tabular-nums">
          {progress}%
        </span>
      </div>

      {/* Description */}
      {currentList.description && (
        <div className="text-sm text-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentList.description) }} />
      )}

      {/* Tasks */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Incomplete tasks */}
        {incompleteTasks.length > 0 ? (
          incompleteTasks.map(task => (
            <TaskRow key={task.id} task={task} projectId={projectId} listId={listId} showLabels={showLabels} />
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-pm-text-muted">
            {__('No incomplete tasks', 'wedevs-project-manager')}
          </div>
        )}

        {/* Load more incomplete */}
        {!allIncompleteLoaded && incompleteTasks.length > 0 && incompleteTasks.length < totalIncomplete && (
          <div className="px-4 py-1.5 border-b border-border/40">
            <button
              type="button"
              className="text-sm text-pm-accent hover:underline disabled:opacity-50"
              disabled={loadingMore}
              onClick={() => handleLoadMore(0)}
            >
              {loadingMore ? __('Loading...', 'wedevs-project-manager') : __('Load more tasks', 'wedevs-project-manager')}
            </button>
          </div>
        )}

        {/* Completed tasks toggle */}
        {totalComplete > 0 && (
          <div className="border-t border-border/40">
            <button
              type="button"
              onClick={() => setShowCompleted(v => !v)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-pm-text-muted hover:bg-muted/20 transition-colors"
            >
              <span className="font-medium">
                {totalComplete} {__('Completed', 'wedevs-project-manager')}
              </span>
            </button>
            {showCompleted && (
              <>
                {completeTasks.map(task => (
                  <TaskRow key={task.id} task={task} projectId={projectId} listId={listId} showLabels={showLabels} />
                ))}
                {!allCompleteLoaded && completeTasks.length < totalComplete && (
                  <div className="px-4 py-1.5">
                    <button
                      type="button"
                      className="text-sm text-pm-accent hover:underline disabled:opacity-50"
                      disabled={loadingMoreComplete}
                      onClick={() => handleLoadMore(1)}
                    >
                      {loadingMoreComplete ? __('Loading...', 'wedevs-project-manager') : __('Load more completed', 'wedevs-project-manager')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Discussion ── */}
      <div className="rounded-xl border bg-card p-4 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-pm-text-muted flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4" />{__('Discussion', 'wedevs-project-manager')}
          {comments.length > 0 && (
            <span className="text-[14px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums">{comments.length}</span>
          )}
        </h3>

        {/* Comment list */}
        {comments.length > 0 && (
          <div className="space-y-3">
            {comments.map(comment => {
              const isOwn = comment.creator?.data?.id === currentUserId
              const isEditing = editingCommentId === comment.id
              return (
                <div key={comment.id} className="flex gap-2.5 group/comment">
                  <UserAvatar user={comment.creator?.data} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-pm-text-primary">{comment.creator?.data?.display_name}</span>
                      <span className="text-[13px] text-pm-text-muted">{formatPmDateTime(comment.created_at)}</span>
                      {isOwn && !isEditing && (
                        <span className="opacity-0 group-hover/comment:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
                          <button type="button" onClick={() => startEditComment(comment)} className="p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent" title={__('Edit', 'wedevs-project-manager')}>
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDeleteComment(comment.id)} className="p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-destructive" title={__('Delete', 'wedevs-project-manager')}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <RichTextEditor content={editCommentText} onChange={setEditCommentText} minHeight="60px" autofocus users={projectUsers} />
                        {comment.files?.data?.filter(f => !editCommentDeletedFileIds.includes(f.id)).length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {comment.files.data.filter(f => !editCommentDeletedFileIds.includes(f.id)).map(f => {
                              const isImg = (f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url)
                              return (
                                <div key={f.id} className={cn('relative inline-flex items-center gap-1.5 text-sm border border-border/50 bg-muted/30 rounded-md', isImg ? 'p-0' : 'px-2 py-1 pr-6')}>
                                  {isImg ? (
                                    <img src={f.thumb || f.url} alt={f.name} className="h-12 w-12 rounded object-cover" />
                                  ) : (
                                    <>
                                      <Paperclip className="h-3.5 w-3.5 text-pm-text-muted" />
                                      <span className="truncate max-w-[140px]">{f.name}</span>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); markDeleteExistingFile(f.id) }}
                                    className="absolute -top-1.5 -right-1.5 z-10 bg-background border border-border/60 rounded-full p-0.5 text-pm-text-muted hover:text-destructive hover:border-destructive/40 shadow-sm cursor-pointer"
                                    title={__('Remove', 'wedevs-project-manager')}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                        <FileUploadArea files={editCommentNewFiles} onFilesChange={setEditCommentNewFiles} compact />
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="h-6 text-[15px]" onClick={handleUpdateComment} disabled={savingEditComment || !editCommentText.trim()}>
                            {savingEditComment ? __('Saving...', 'wedevs-project-manager') : __('Save', 'wedevs-project-manager')}
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 text-[15px]" onClick={cancelEditComment} disabled={savingEditComment}>{__('Cancel', 'wedevs-project-manager')}</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.content) }} />
                    )}
                    {/* Comment files */}
                    {!isEditing && comment.files?.data?.length > 0 && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {comment.files.data.map(f => (
                          <a key={f.id} href={f.url} target="_blank" rel="noreferrer" title={f.name}
                            className="block overflow-hidden rounded-md border border-border/50 hover:border-pm-accent/40 transition-all no-underline">
                            <img src={f.thumb || f.url} alt={f.name} className="h-20 w-20 object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add comment form */}
        <div className="space-y-2">
          <RichTextEditor
            content={newComment}
            placeholder={__('Write a comment...', 'wedevs-project-manager')}
            onChange={(html) => setNewComment(html)}
            minHeight="60px"
            users={projectUsers}
          />
          <FileUploadArea files={commentFiles} onFilesChange={setCommentFiles} compact />
          <NotifyUsers
            users={projectUsers}
            value={commentNotifyUsers}
            onChange={setCommentNotifyUsers}
          />
          <Button size="sm" className="h-7 text-sm" onClick={handleSubmitComment} disabled={!newComment.trim() || submittingComment}>
            {submittingComment ? __('Sending...', 'wedevs-project-manager') : __('Post Comment', 'wedevs-project-manager')}
          </Button>
        </div>
      </div>

      {/* Task detail sheet */}
      <TaskDetailSheet />
    </div>
    </>
  )
}
