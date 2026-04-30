import React from 'react'
import { Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useI18n } from '@hooks/useI18n'
import { usePermissions } from '@hooks/usePermissions'

/**
 * License inactive screen for users who can't fix it.
 * Users with canManageLicense get redirected to /license to fix it.
 * Lower-permitted users see a "contact admin" message instead.
 *
 * Usage:
 *   const guard = useLicenseGuard()
 *   if (guard) return guard
 */
export function useLicenseGuard() {
  const { __ } = useI18n()
  const { isPro, isProLicensed, canManageLicense } = usePermissions()

  if (!isPro || isProLicensed) return null

  // Users with manage_options cap go to /license (they can fix it).
  // Everyone else — delegated managers/co-workers/clients — sees inline message.
  // Mirrors backend Administrator permission gate on license/* routes.
  if (canManageLicense) return <Navigate to="/license" replace />

  return (
    <div className="max-w-[1400px] mx-auto p-8 sm:p-12">
      <div className="rounded-xl border bg-card p-10 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-pm-text-primary mb-1">
          {__('You are not authorized to view this page.')}
        </h2>
        <p className="text-sm text-pm-text-muted">
          {__('This feature requires an active Pro license. Please ask your administrator to activate the license.')}
        </p>
      </div>
    </div>
  )
}
