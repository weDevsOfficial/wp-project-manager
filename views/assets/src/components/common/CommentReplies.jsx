import React, { useCallback, useState } from 'react'
import { __, _n, sprintf } from '@wordpress/i18n'
import { Loader2, Pencil, Trash2 } from 'lucide-react'
import { useApi } from '@hooks/useApi'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import RichTextEditor from '@components/common/RichTextEditor'
import FileUploadArea from '@components/common/FileUploadArea'
import CommentAttachment from '@components/common/CommentAttachment'
import { UserAvatar } from '@components/common/UserAvatar'
import { CopyMarkdownButton } from '@components/common/CopyMarkdownButton'
import GitHubPreviewContainer from '@components/common/GitHubPreviewContainer'
import NotionPreviewContainer from '@components/common/NotionPreviewContainer'
import LoomPreviewContainer from '@components/common/LoomPreviewContainer'
import { renderRichText } from '@lib/markdown'
import { decorateIntegrationLinks } from '@/lib/url-strippers'
import { decorateGoogleLinks } from '@lib/google-links'
import { formatPmDateTime } from '@lib/pm-utils'

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Same markup the editor's @mention produces, so the server sees a normal mention.
function mentionHtml(user) {
  if (!user?.id) return ''
  const name = escapeHtml(user.display_name || user.name || '')
  return `<p><span data-type="mention" class="mention" data-id="${escapeHtml(user.id)}" data-label="${name}">@${name}</span>&nbsp;</p>`
}

function mentionedUserIds(html) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html')
  const ids = []
  doc.querySelectorAll('span[data-type="mention"][data-id]').forEach((el) => {
    const id = el.getAttribute('data-id')
    if (id && !ids.includes(id)) ids.push(id)
  })
  return ids.join(',')
}

/**
 * Replies under a comment, one level deep: replying to a reply adds to the same
 * thread and mentions that reply's author.
 *
 * @param {object}   props.comment          Top-level comment, with `replies.data`.
 * @param {number}   props.projectId
 * @param {Array}    props.users            Project members for @mentions.
 * @param {Function} props.canEditComment   (comment) => bool.
 * @param {Function} props.onRepliesChange  (commentId, replies) => void.
 */
export function CommentReplies({ comment, projectId, users = [], canEditComment, onRepliesChange }) {
  const api = useApi()
  const toast = useToast()
  const replies = comment?.replies?.data ?? []

  const [composerOpen, setComposerOpen] = useState(false)
  const [composerKey, setComposerKey] = useState(0)
  const [replyText, setReplyText] = useState('')
  const [replyFiles, setReplyFiles] = useState([])
  const [sending, setSending] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editNewFiles, setEditNewFiles] = useState([])
  const [editDeletedIds, setEditDeletedIds] = useState([])
  const [saving, setSaving] = useState(false)

  const setReplies = useCallback((next) => onRepliesChange?.(comment.id, next), [onRepliesChange, comment?.id])

  const openComposer = useCallback((author) => {
    setReplyText(mentionHtml(author))
    setReplyFiles([])
    setComposerOpen(true)
    // Remount so the caret lands after the pre-filled mention.
    setComposerKey((k) => k + 1)
  }, [])

  const closeComposer = useCallback(() => {
    setComposerOpen(false)
    setReplyText('')
    setReplyFiles([])
  }, [])

  const handleSend = useCallback(async () => {
    if (!replyText.trim() || sending) return
    setSending(true)
    try {
      const fd = new FormData()
      fd.append('content', replyText.trim())
      fd.append('commentable_type', 'comment')
      fd.append('commentable_id', comment.id)
      fd.append('project_id', projectId)
      fd.append('mentioned_users', mentionedUserIds(replyText))
      replyFiles.forEach((f) => fd.append('files[]', f))
      const res = await api.upload(`projects/${projectId}/comments`, fd)
      if (res?.data) setReplies([...replies, res.data])
      closeComposer()
      toast.success(__('Reply added', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(__('Failed to add reply', 'wedevs-project-manager'), typeof err === 'string' ? err : err?.message)
    }
    setSending(false)
  }, [api, toast, comment?.id, projectId, replyText, replyFiles, replies, sending, setReplies, closeComposer])

  const startEdit = (reply) => {
    setEditingId(reply.id)
    setEditText(reply.content || '')
    setEditNewFiles([])
    setEditDeletedIds([])
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
    setEditNewFiles([])
    setEditDeletedIds([])
  }

  const handleSave = useCallback(async () => {
    if (!editText.trim() || !editingId) return
    setSaving(true)
    try {
      const mentioned = mentionedUserIds(editText)
      let res
      if (editNewFiles.length > 0 || editDeletedIds.length > 0) {
        const fd = new FormData()
        fd.append('content', editText.trim())
        fd.append('project_id', projectId)
        fd.append('mentioned_users', mentioned)
        editNewFiles.forEach((f) => fd.append('files[]', f))
        editDeletedIds.forEach((id) => fd.append('files_to_delete[]', String(id)))
        res = await api.upload(`projects/${projectId}/comments/${editingId}`, fd)
      } else {
        res = await api.post(`projects/${projectId}/comments/${editingId}`, {
          content: editText.trim(),
          project_id: projectId,
          mentioned_users: mentioned,
        })
      }
      setReplies(replies.map((r) => (r.id === editingId ? { ...r, ...(res?.data ?? {}), content: editText.trim() } : r)))
      cancelEdit()
      toast.success(__('Reply updated', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(__('Failed to update reply', 'wedevs-project-manager'), typeof err === 'string' ? err : err?.message)
    }
    setSaving(false)
  }, [api, toast, projectId, editingId, editText, editNewFiles, editDeletedIds, replies, setReplies])

  const handleDelete = useCallback(async (replyId) => {
    try {
      await api.post(`projects/${projectId}/comments/${replyId}/delete`)
      setReplies(replies.filter((r) => r.id !== replyId))
      toast.success(__('Reply deleted', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to delete reply', 'wedevs-project-manager'))
    }
  }, [api, toast, projectId, replies, setReplies])

  if (!comment?.id) return null

  return (
    <div className="mt-1.5">
      <div className="flex items-center gap-3 text-[13px]">
        <button
          type="button"
          className="font-medium text-pm-text-muted hover:text-pm-accent transition-colors"
          onClick={() => openComposer(comment.creator?.data)}
        >
          {__('Reply', 'wedevs-project-manager')}
        </button>
        {replies.length > 0 && (
          <span className="text-pm-text-muted">
            {sprintf(_n('%d reply', '%d replies', replies.length, 'wedevs-project-manager'), replies.length)}
          </span>
        )}
      </div>

      {(replies.length > 0 || composerOpen) && (
        <div className="mt-2 space-y-3 border-l-2 border-pm-border pl-3 sm:pl-4">
          {replies.map((reply) => {
            const author = reply.creator?.data
            const isEditing = editingId === reply.id
            const canEdit = canEditComment ? canEditComment(reply) : false
            const files = reply.files?.data ?? []

            return (
              <div key={reply.id} className="flex gap-2 group/reply">
                <UserAvatar user={author} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-pm-text-primary">{author?.display_name}</span>
                    <span className="text-[12px] text-pm-text-muted">{formatPmDateTime(reply.created_at)}</span>
                    {!isEditing && (
                      <span className="opacity-0 group-hover/reply:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
                        <CopyMarkdownButton html={reply.content} className="p-0.5" />
                        {canEdit && (<>
                          <button type="button" onClick={() => startEdit(reply)} className="p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent" title={__('Edit', 'wedevs-project-manager')} aria-label={__('Edit', 'wedevs-project-manager')}>
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDelete(reply.id)} className="p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-destructive" title={__('Delete', 'wedevs-project-manager')} aria-label={__('Delete', 'wedevs-project-manager')}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>)}
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <RichTextEditor content={editText} onChange={setEditText} minHeight="48px" autofocus="end" users={users} />
                      {files.filter((f) => !editDeletedIds.includes(f.id)).length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {files.filter((f) => !editDeletedIds.includes(f.id)).map((f) => (
                            <CommentAttachment key={f.id} file={f} onRemove={(id) => setEditDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))} />
                          ))}
                        </div>
                      )}
                      <FileUploadArea files={editNewFiles} onFilesChange={setEditNewFiles} compact />
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="h-9 text-sm" onClick={handleSave} disabled={saving || !editText.trim()}>
                          {saving ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{__('Saving...', 'wedevs-project-manager')}</> : __('Save', 'wedevs-project-manager')}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 text-sm" onClick={cancelEdit} disabled={saving}>{__('Cancel', 'wedevs-project-manager')}</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="pm-rich-comment-content text-sm leading-relaxed prose prose-sm max-w-none text-foreground"
                        dangerouslySetInnerHTML={{ __html: decorateGoogleLinks(decorateIntegrationLinks(renderRichText(reply.content))) }}
                      />
                      <GitHubPreviewContainer content={reply.content || ''} />
                      <NotionPreviewContainer content={reply.content || ''} />
                      <LoomPreviewContainer content={reply.content || ''} />
                      {files.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {files.map((f) => <CommentAttachment key={f.id} file={f} />)}
                        </div>
                      )}
                      <button
                        type="button"
                        className="mt-1 text-[12px] font-medium text-pm-text-muted hover:text-pm-accent transition-colors"
                        onClick={() => openComposer(author)}
                      >
                        {__('Reply', 'wedevs-project-manager')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          {composerOpen && (
            <div className="space-y-2">
              <RichTextEditor
                key={composerKey}
                content={replyText}
                onChange={setReplyText}
                placeholder={__('Write a reply...', 'wedevs-project-manager')}
                minHeight="48px"
                autofocus="end"
                users={users}
              />
              <FileUploadArea files={replyFiles} onFilesChange={setReplyFiles} compact />
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-9 text-sm" onClick={handleSend} disabled={sending || !replyText.trim()}>
                  {sending ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{__('Sending...', 'wedevs-project-manager')}</> : __('Reply', 'wedevs-project-manager')}
                </Button>
                <Button size="sm" variant="ghost" className="h-9 text-sm" onClick={closeComposer} disabled={sending}>{__('Cancel', 'wedevs-project-manager')}</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CommentReplies
