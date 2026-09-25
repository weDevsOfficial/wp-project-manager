import { __ } from '@wordpress/i18n';
import React from 'react'
import { Crown } from 'lucide-react'
import { useProModal } from './ProUpgradeModal'
import { usePermissions, pmCanSeeUpgrade } from '@hooks/usePermissions'

/**
 * ProBadge — small inline "PRO" pill badge.
 * Only renders when !isPro. Clicking opens the upgrade modal.
 *
 * Usage:
 *   <ProBadge />                         — always visible
 *   <ProBadge label="Pro Required" />    — custom label
 *   <ProBadge hover />                   — hidden, shows on parent group hover
 */
export default function ProBadge({ label, className = '', hover = false, interactive = true }) {
  const { isPro } = usePermissions()
  const { setOpen } = useProModal()

  if (isPro) return null

  // The badge is an upsell affordance: it labels a locked feature and opens
  // the upgrade dialog. A co-worker or client can do neither, so they get no
  // badge rather than a dead button.
  if (!pmCanSeeUpgrade()) return null

  const baseClass = `inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded bg-pm-accent/10 text-pm-accent transition-all ${hover ? 'opacity-0 group-hover:opacity-100' : ''} ${className}`
  const content = (
    <>
      <Crown className="h-3 w-3" />
      {label || __('PRO', 'wedevs-project-manager')}
    </>
  )

  // Non-interactive variant renders a span — safe to nest inside another button.
  if (!interactive) {
    return (
      <span className={baseClass} title={__('Available in Pro', 'wedevs-project-manager')}>
        {content}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); setOpen(true) }}
      className={`${baseClass} hover:bg-pm-accent/20 cursor-pointer`}
      title={__('Available in Pro', 'wedevs-project-manager')}
    >
      {content}
    </button>
  )
}
