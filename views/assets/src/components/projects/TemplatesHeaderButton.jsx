import React from 'react'
import { Slot, useSlotFills } from '@hooks/useSlot'
import { __ } from '@wordpress/i18n'
import { usePermissions } from '@hooks/usePermissions'
import { useProModal } from '@components/common/ProUpgradeModal'
import { Button } from '@components/ui/button'
import { LayoutTemplate, ChevronDown, Crown } from 'lucide-react'

export default function TemplatesHeaderButton() {
  const { isPro } = usePermissions()
  const { setOpen } = useProModal()
  const fills = useSlotFills('projects.header.actions')

  // Pro active with fills — render real button
  if (fills.length > 0) {
    return <Slot name="projects.header.actions" />
  }

  // Free — upgrade teaser with ProBadge
  if (!isPro) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5 group/tpl"
        onClick={() => setOpen(true)}
      >
        <LayoutTemplate className="h-4 w-4" />
        {__('From Template', 'wedevs-project-manager')}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        <span className="ml-0.5 hidden group-hover/tpl:inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded bg-pm-accent/10 text-pm-accent">
          <Crown className="h-3 w-3" />
          {__('PRO', 'wedevs-project-manager')}
        </span>
      </Button>
    )
  }

  return null
}
