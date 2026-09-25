import { __ } from '@wordpress/i18n'
import React from 'react'
import { CircleCheck, CircleX, AlertTriangle, Info, Loader2, X } from 'lucide-react'
import { UserAvatar } from '@components/common/UserAvatar'

const MAP = {
  success: { Icon: CircleCheck, color: '#16a34a' },
  error: { Icon: CircleX, color: '#dc2626' },
  warning: { Icon: AlertTriangle, color: '#d97706' },
  info: { Icon: Info, color: '#2563eb' },
  message: { Icon: Info, color: '#6b7280' },
  loading: { Icon: Loader2, color: '#6b7280' },
}

const renderNode = (v) => (typeof v === 'function' ? v() : v)

// Custom Sonner toast card. The draining fill lives INSIDE our own markup
// (inset:0) so it always covers the full body. Fully dynamic: title,
// description, custom icon, action/cancel buttons, loading spinner, close.
export default function ToastCard({
  type = 'info',
  title,
  description,
  icon,
  user,
  action,
  cancel,
  duration = 4000,
  progress = null, // 0–100 for a determinate bar (downloads); null = none
  indeterminate = false, // sweeping bar while the total size is unknown
  onDismiss,
  closeButton = true,
}) {
  const conf = MAP[type] || MAP.info
  const Icon = conf.Icon
  const isLoading = type === 'loading'
  const hasProgress = progress != null && Number.isFinite(progress)
  // Time-based drain only when there's no explicit progress bar.
  const showFill = !isLoading && Number.isFinite(duration) && !hasProgress

  const handle = (fn) => (e) => {
    fn?.(e)
    onDismiss?.()
  }

  return (
    <div className="pm-toast relative overflow-hidden w-[356px] max-w-[calc(100vw-2rem)] rounded-lg border bg-card shadow-lg">
      {showFill && (
        <div
          className="pm-toast-fill absolute inset-0 origin-left"
          style={{
            background: conf.color,
            opacity: 0.16,
            animation: `pm-toast-progress ${duration}ms linear forwards`,
          }}
        />
      )}

      <div className="relative z-10 flex items-start gap-2.5 px-4 py-3">
        <span className="shrink-0 mt-px relative">
          {user ? (
            <>
              <UserAvatar user={user} size="sm" />
              <span
                className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-card"
                style={{ padding: 1 }}
              >
                <Icon className="h-3 w-3" style={{ color: conf.color }} />
              </span>
            </>
          ) : icon !== undefined ? (
            renderNode(icon)
          ) : (
            <Icon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} style={{ color: conf.color }} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          {title != null && (
            <div className="text-sm font-medium text-pm-text-primary leading-snug break-words">{renderNode(title)}</div>
          )}
          {description != null && (
            <div className="text-[13px] text-pm-text-muted mt-0.5 leading-snug break-words">{renderNode(description)}</div>
          )}

          {(action || cancel) && (
            <div className="flex items-center gap-2 mt-2">
              {action && (
                <button
                  type="button"
                  onClick={handle(action.onClick)}
                  className="h-7 px-2.5 rounded-md bg-pm-accent text-white text-[13px] font-medium hover:bg-pm-accent/90 transition-colors"
                >
                  {action.label}
                </button>
              )}
              {cancel && (
                <button
                  type="button"
                  onClick={handle(cancel.onClick)}
                  className="h-7 px-2.5 rounded-md text-[13px] font-medium text-pm-text-muted hover:bg-muted transition-colors"
                >
                  {cancel.label}
                </button>
              )}
            </div>
          )}
        </div>

        {closeButton && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={__('Close', 'wedevs-project-manager')}
            className="shrink-0 -mr-1 -mt-0.5 p-1 rounded text-pm-text-muted/70 hover:text-pm-text-primary hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {(hasProgress || indeterminate) && (
        <div className="relative z-10 h-1 w-full bg-muted overflow-hidden">
          {indeterminate ? (
            <div
              className="pm-download-indeterminate h-full rounded-full"
              style={{ background: conf.color }}
            />
          ) : (
            <div
              className="h-full transition-[width] duration-200 ease-out"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%`, background: conf.color }}
            />
          )}
        </div>
      )}
    </div>
  )
}
