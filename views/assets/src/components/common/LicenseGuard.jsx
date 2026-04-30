import React from 'react'
import { Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useI18n } from '@hooks/useI18n'
import { usePermissions } from '@hooks/usePermissions'

/**
 * License inactive screen for non-admin users.
 * Admin/manage-cap users get redirected to /license to fix it.
 * Lower-permitted users see a "contact admin" message instead.
 *
 * Usage:
 *   const guard = useLicenseGuard()
 *   if (guard) return guard
 */
export function useLicenseGuard() {
  const { __ } = useI18n()
  const { isPro, isProLicensed, isAdmin } = usePermissions()

  if (!isPro || isProLicensed) return null

  // Only true WP admin gets redirected to license page (they can fix it).
  // Everyone else — including delegated managers/co-workers/clients — sees
  // an inline message. Avoids unwanted redirect for users who cannot manage license.
  if (isAdmin) return <Navigate to="/license" replace />

  return (
    <div className="max-w-[1400px] mx-auto p-8 sm:p-12">
      <div className="rounded-xl border bg-card p-10 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-pm-text-primary mb-1">
          {__('License inactive')}
        </h2>
        <p className="text-sm text-pm-text-muted">
          {__('This feature requires an active Pro license. Contact your administrator.')}
        </p>
      </div>
    </div>
  )
}
