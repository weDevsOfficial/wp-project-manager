import React from 'react'
import { Crown } from 'lucide-react'
import { useProModal } from './ProUpgradeModal'
import { usePermissions } from '@hooks/usePermissions'
import { useI18n } from '@hooks/useI18n'

/**
 * ProBadge — small inline "PRO" pill badge.
 * Only renders when !isPro. Clicking opens the upgrade modal.
 *
 * Usage:
 *   <ProBadge />                         — always visible
 *   <ProBadge label="Pro Required" />    — custom label
 *   <ProBadge hover />                   — hidden, shows on parent group hover
 */
export default function ProBadge({ label, className = '', hover = false }) {
  const { isPro } = usePermissions()
  const { setOpen } = useProModal()
  const { __ } = useI18n()

  if (isPro) return null

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); setOpen(true) }}
      className={`inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-pm-accent/10 text-pm-accent hover:bg-pm-accent/20 transition-all cursor-pointer ${hover ? 'opacity-0 group-hover:opacity-100' : ''} ${className}`}
      title={__('Available in Pro')}
    >
      <Crown className="h-2.5 w-2.5" />
      {label || 'PRO'}
    </button>
  )
}
