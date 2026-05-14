import React from 'react'
import { useFilter } from '@hooks/useSlot'

/**
 * Task label badges rendered inline in task rows.
 *
 * Labels are a pro-only feature owned by pm-pro's LabelManager module.
 * In free this renders nothing; pro registers a filter under
 * 'task.row.labels' to supply the badge JSX (taking the task as context).
 *
 * `variant` lets consumers ask for a visual style:
 *   - 'full'  — pill with label text (task-list row)
 *   - 'dot'   — small colored dot (dense my-tasks row)
 *
 * Free will always receive `null` from the filter; the component short-
 * circuits so the empty-label branch imposes no layout cost.
 */
export default function TaskLabelBadges({ task, variant = 'full' }) {
  const Rendered = useFilter('task.row.labels', null, { task, variant })
  if (!Rendered) return null
  if (typeof Rendered === 'function') {
    const Comp = Rendered
    return <Comp task={task} variant={variant} />
  }
  if (React.isValidElement(Rendered)) return Rendered
  return null
}
