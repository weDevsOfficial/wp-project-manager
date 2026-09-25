import { __ } from '@wordpress/i18n'
import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@components/ui/button'
import { cn } from '@lib/utils'

/**
 * What a page or a panel shows when its request failed, so a failure never
 * reads as "there is nothing here". Pro reaches it through
 * `window.PM.components.LoadFailed`.
 */
export function LoadFailed({ title, description, onRetry, className, compact = false }) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-center',
        compact ? 'py-8 px-4' : 'py-16 px-6',
        className,
      )}
    >
      <span className={cn('flex items-center justify-center rounded-full bg-destructive/10', compact ? 'h-9 w-9' : 'h-11 w-11')}>
        <AlertCircle className={cn('text-destructive', compact ? 'h-5 w-5' : 'h-6 w-6')} />
      </span>
      <p className="text-sm font-medium text-pm-text-primary">
        {title || __('This could not be loaded.', 'wedevs-project-manager')}
      </p>
      <p className="text-[13px] text-pm-text-muted max-w-sm">
        {description || __('Check your connection and try again. If it keeps failing, you may not have access to it.', 'wedevs-project-manager')}
      </p>
      {onRetry && (
        <Button size="sm" variant="outline" className="h-11 text-sm gap-1.5" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />{__('Try again', 'wedevs-project-manager')}
        </Button>
      )}
    </div>
  )
}

export default LoadFailed
