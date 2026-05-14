import { __ } from '@wordpress/i18n';
import React from 'react'
import { Crown } from 'lucide-react'
import { useProModal } from './ProUpgradeModal'
import { usePermissions } from '@hooks/usePermissions'

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

  if (isPro) return null

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); setOpen(true) }}
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded bg-pm-accent/10 text-pm-accent hover:bg-pm-accent/20 transition-all cursor-pointer ${hover ? 'opacity-0 group-hover:opacity-100' : ''} ${className}`}
      title={__('Available in Pro', 'wedevs-project-manager')}
    >
      <Crown className="h-3 w-3" />
      {label || __('PRO', 'wedevs-project-manager')}
    </button>
  )
}
