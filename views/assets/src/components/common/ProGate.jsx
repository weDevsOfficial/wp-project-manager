import React from 'react'
import { usePermissions } from '@hooks/usePermissions'
import { useProModal } from './ProUpgradeModal'
import ProBadge from './ProBadge'

/**
 * ProGate — wraps a feature section with a pro upgrade overlay.
 *
 * If !isPro:
 *   - Shows children dimmed with a hover overlay
 *   - On hover: shows a subtle "PRO" badge overlay
 *   - On click: opens upgrade modal
 *
 * If isPro:
 *   - Renders children normally (zero overhead)
 *
 * Usage:
 *   <ProGate feature="Privacy">
 *     <PrivacyToggle />
 *   </ProGate>
 */
// eslint-disable-next-line no-unused-vars
export default function ProGate({ children, feature = '' }) {
  const { isPro } = usePermissions()
  const { setOpen } = useProModal()

  if (isPro) return children

  return (
    <div
      className="relative group/pro cursor-pointer rounded-lg border border-transparent group-hover/pro:border-dashed group-hover/pro:border-pm-accent/40 transition-colors"
      onClick={() => setOpen(true)}
    >
      {/* Content — rendered as-is, dimmed slightly */}
      <div className="opacity-60 pointer-events-none select-none">
        {children}
      </div>

      {/* Pro badge — inline, always visible, subtle */}
      <div className="absolute top-1/2 -translate-y-1/2 right-2">
        <ProBadge />
      </div>
    </div>
  )
}
