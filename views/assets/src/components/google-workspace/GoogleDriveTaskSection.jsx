import React from 'react'
import GoogleDriveAttach from './GoogleDriveAttach'

/**
 * Task detail Drive section — fills the task.detail.subtasks slot.
 * Thin wrapper over the shared GoogleDriveAttach.
 */
export default function GoogleDriveTaskSection({ taskId, projectId }) {
  if (!taskId || !projectId) return null
  return (
    <GoogleDriveAttach
      projectId={projectId}
      attachableType="task"
      attachableId={taskId}
      variant="section"
    />
  )
}
