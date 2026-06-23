import React from 'react'
/**
 * CommentLinkActions — the Drive + Meet "insert link" buttons for a comment
 * composer (new or edit). Drive is free (DriveCommentInsert); Meet is Pro, which
 * fills the comment.composer.action slot. Both insert a link into the comment
 * via onInsert(html).
 */
import DriveCommentInsert from './DriveCommentInsert'
import { Slot } from '@hooks/useSlot'

export default function CommentLinkActions({ projectId, onInsert, allowMeet = true }) {
  if (!projectId || typeof onInsert !== 'function') return null
  return (
    <div className="flex items-center gap-2">
      <DriveCommentInsert projectId={projectId} onInsert={onInsert} />
      {allowMeet && <Slot name="comment.composer.action" projectId={projectId} onInsert={onInsert} />}
    </div>
  )
}
