import React from 'react'
import { cn } from '@lib/utils'
import { EmptyState as SharedEmptyState } from '@components/common/EmptyState'

// Shared chrome for every dashboard card, so titles, actions and empty
// states keep one rhythm instead of each card re-deciding its own.

export function CardHead({ icon: Icon, iconClassName, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-pm-text-primary flex items-center gap-2">
          {Icon && <Icon className={cn('w-4 h-4 shrink-0 text-pm-text-muted', iconClassName)} />}
          <span className="truncate">{title}</span>
        </h3>
        {subtitle && <p className="text-[12px] text-pm-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function CardAction({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[12px] font-medium text-pm-accent hover:bg-pm-accent-light hover:underline transition-colors"
    >
      {children}
    </button>
  )
}

// The plugin-wide empty state in its compact size, filling the card so it
// stays centred. `positive` tints the icon for good news ("nothing overdue").
export function EmptyState({ icon: Icon, tone = 'muted', title, children }) {
  const TintedIcon = React.useMemo(() => {
    if (!Icon || tone !== 'positive') return Icon
    return (props) => <Icon {...props} className={cn(props.className, 'text-emerald-500/70')} />
  }, [Icon, tone])

  return (
    <SharedEmptyState
      compact
      className="flex-1"
      icon={TintedIcon}
      title={title}
      description={children}
    />
  )
}

// Row hit-target shared by the list cards.
export const ROW = 'w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-pm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40'
