import { cn } from '@lib/utils'

// Shared chrome for every dashboard card, so titles, actions and empty
// states keep one rhythm instead of each card re-deciding its own.

export function CardHead({ icon: Icon, iconClassName, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="min-w-0">
        <h3 className="text-2xl font-semibold text-pm-text-primary flex items-center gap-2">
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

export function EmptyState({ icon: Icon, tone = 'muted', children }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
      {Icon && (
        <span className={cn(
          'flex items-center justify-center w-11 h-11 rounded-full mb-2.5',
          tone === 'positive' ? 'bg-emerald-50' : 'bg-pm-surface-muted',
        )}>
          <Icon className={cn('w-5 h-5', tone === 'positive' ? 'text-emerald-500' : 'text-pm-text-muted/60')} />
        </span>
      )}
      <p className="text-[13px] text-pm-text-muted max-w-[220px]">{children}</p>
    </div>
  )
}

// Row hit-target shared by the list cards.
export const ROW = 'w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-pm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40'
