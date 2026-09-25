import React from 'react'
import { cn } from '@lib/utils'

/**
 * The plugin's empty state: a faint icon, a title that says what is missing,
 * one line on what to do about it, and an optional action. Pages use the
 * default size inside a bordered card; tabs and panels use `compact`.
 * Pro reaches it through `window.PM.components.EmptyState`.
 */
export function EmptyState({ icon: Icon, title, description, action, compact = false, bordered = false, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8 px-4' : 'py-16 px-6',
        bordered && 'rounded-lg border bg-card',
        className,
      )}
    >
      {Icon && (
        <Icon className={cn('text-muted-foreground/30 mb-3', compact ? 'h-10 w-10' : 'h-14 w-14')} />
      )}
      {title && <h3 className="text-sm font-medium text-pm-text-primary mb-1">{title}</h3>}
      {description && <p className="text-sm text-pm-text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState
