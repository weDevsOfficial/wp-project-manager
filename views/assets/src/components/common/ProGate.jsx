import React from 'react'
import { usePermissions } from '@hooks/usePermissions'
import { useProModal } from './ProUpgradeModal'

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
      className="group/pro cursor-pointer"
      onClick={() => setOpen(true)}
    >
      <div className="opacity-75 pointer-events-none select-none">
        {children}
      </div>
    </div>
  )
}
