import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchSingleList, addTaskToList } from '@store/taskListsSlice'
import { useI18n } from '@hooks/useI18n'
import { useApi } from '@hooks/useApi'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Progress } from '@components/ui/progress'
import { Skeleton } from '@components/ui/skeleton'
import { UserAvatar } from '@components/common/UserAvatar'
import RichTextEditor from '@components/common/RichTextEditor'
import { ArrowLeft, Lock, MessageSquare, Pencil, Trash2, Paperclip } from 'lucide-react'
import { formatPmDateTime } from '@lib/pm-utils'
import TaskRow from './TaskRow'
import TaskDetailSheet from './TaskDetailSheet'
import { sanitizeHtml } from '@lib/sanitize'

export default function SingleTaskListPage() {
  const { projectId: pidParam, listId: lidParam } = useParams()
  const projectId = parseInt(pidParam ?? '0', 10)
  const listId = parseInt(lidParam ?? '0', 10)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { __ } = useI18n()
  const api = useApi()
  const toast = useToast()

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
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState('')

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
    try {
      const res = await api.post(`projects/${projectId}/comments`, {
        content: newComment,
        commentable_id: listId,
        commentable_type: 'task_list',
        project_id: projectId,
      })
      if (res.data) {
        setComments(prev => [...prev, res.data])
      }
      setNewComment('')
      toast.success(__('Comment added'))
    } catch {
      toast.error(__('Failed to add comment'))
    }
    setSubmittingComment(false)
  }, [api, projectId, listId, newComment, toast, __])

  const startEditComment = useCallback((c) => {
    setEditingCommentId(c.id)
    setEditCommentText(c.content || '')
  }, [])

  const cancelEditComment = useCallback(() => {
    setEditingCommentId(null)
    setEditCommentText('')
  }, [])

  const handleUpdateComment = useCallback(async () => {
    if (!editCommentText.trim() || !editingCommentId) return
    try {
      await api.post(`projects/${projectId}/comments/${editingCommentId}`, {
        content: editCommentText.trim(),
      })
      setComments(prev => prev.map(c =>
        c.id === editingCommentId ? { ...c, content: editCommentText.trim() } : c
      ))
      cancelEditComment()
      toast.success(__('Comment updated'))
    } catch {
      toast.error(__('Failed to update comment'))
    }
  }, [api, projectId, editingCommentId, editCommentText, toast, __, cancelEditComment])

  const handleDeleteComment = useCallback(async (commentId) => {
    if (!confirm(__('Are you sure?'))) return
    try {
      await api.post(`projects/${projectId}/comments/${commentId}/delete`)
      setComments(prev => prev.filter(c => c.id !== commentId))
      toast.success(__('Comment deleted'))
    } catch {
      toast.error(__('Failed to delete comment'))
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
      toast.error(__('Failed to load more tasks'))
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
        <Button variant="outline" size="sm" className="gap-1.5 mb-4 bg-white hover:border-pm-accent hover:text-pm-accent" onClick={() => navigate(`/projects/${projectId}/task-lists`)}>
          <ArrowLeft className="h-4 w-4" />
          {__('Back to Task Lists')}
        </Button>
        <p className="text-sm text-pm-text-muted">{__('Task list not found.')}</p>
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
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      {/* Back button */}
      <Button variant="outline" size="sm" className="gap-1.5 bg-white hover:border-pm-accent hover:text-pm-accent" onClick={() => navigate(`/projects/${projectId}/task-lists`)}>
        <ArrowLeft className="h-4 w-4" />
        {__('Back to Task Lists')}
      </Button>

      {/* List header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-pm-text-primary">{currentList.title}</h1>
        {currentList.meta?.privacy === 1 && (
          <Lock className="h-4 w-4 text-pm-text-muted" title={__('Private')} />
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
        <div className="text-sm text-pm-text-muted" dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentList.description) }} />
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
            {__('No incomplete tasks')}
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
              {loadingMore ? __('Loading...') : __('Load more tasks')}
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
                {totalComplete} {__('Completed')}
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
                      {loadingMoreComplete ? __('Loading...') : __('Load more completed')}
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
        <h3 className="text-sm font-semibold uppercase tracking-wider text-pm-text-muted/70 flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4" />{__('Discussion')}
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
                      <div className="text-sm text-pm-text-primary/80 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.content) }} />
                    )}
                    {/* Comment files */}
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

        {/* Add comment form */}
        <div className="space-y-2">
          <RichTextEditor
            content={newComment}
            placeholder={__('Write a comment...')}
            onChange={(html) => setNewComment(html)}
            minHeight="60px"
          />
          <Button size="sm" className="h-7 text-sm" onClick={handleSubmitComment} disabled={!newComment.trim() || submittingComment}>
            {submittingComment ? __('Sending...') : __('Post Comment')}
          </Button>
        </div>
      </div>

      {/* Task detail sheet */}
      <TaskDetailSheet />
    </div>
  )
}
