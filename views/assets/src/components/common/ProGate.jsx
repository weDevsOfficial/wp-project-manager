import React from 'react'
import { usePermissions } from '@hooks/usePermissions'
import { useProModal } from './ProUpgradeModal'
import ProBadge from './ProBadge'
import { Lock } from 'lucide-react'

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
export default function ProGate({ children, feature = '' }) {
  const { isPro } = usePermissions()
  const { setOpen } = useProModal()

  if (isPro) return children

  return (
    <div className="relative group/pro">
      {/* Dimmed content — non-interactive */}
      <div className="opacity-50 pointer-events-none select-none">
        {children}
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-lg opacity-0 group-hover/pro:opacity-100 transition-opacity bg-background/60 backdrop-blur-[1px]"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2 bg-background border shadow-sm rounded-full px-3 py-1.5">
          <Lock className="h-3 w-3 text-pm-accent" />
          <span className="text-xs font-medium text-pm-text-primary">
            {feature || 'Pro Feature'}
          </span>
          <ProBadge />
        </div>
      </div>
    </div>
  )
}
