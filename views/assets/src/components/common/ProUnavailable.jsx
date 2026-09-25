import { __ } from '@wordpress/i18n'
import React from 'react'
import { Lock } from 'lucide-react'

/**
 * Shown in place of a Pro marketing preview to users who cannot act on it.
 * Co-workers and clients can neither install nor license Pro, and the previews
 * are filled with invented sample data (fake invoices, fake teammates) that
 * reads as real project data to them.
 */
export default function ProUnavailable({ title, description }) {
  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-pm-text-primary">{title}</h1>
        {description && <p className="text-sm text-pm-text-muted mt-0.5">{description}</p>}
      </div>
      <div className="rounded-lg border bg-card p-10 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-pm-text-primary mb-1">
          {__('Not available', 'wedevs-project-manager')}
        </h2>
        <p className="text-sm text-pm-text-muted">
          {__('This feature is not enabled on this site. Ask an administrator for access.', 'wedevs-project-manager')}
        </p>
      </div>
    </div>
  )
}
