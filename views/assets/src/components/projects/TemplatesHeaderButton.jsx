import React from 'react'
import { Slot, useSlotFills } from '@hooks/useSlot'
import { useI18n } from '@hooks/useI18n'
import { usePermissions } from '@hooks/usePermissions'
import { useProModal } from '@components/common/ProUpgradeModal'
import ProBadge from '@components/common/ProBadge'
import { Button } from '@components/ui/button'
import { LayoutTemplate, ChevronDown } from 'lucide-react'

export default function TemplatesHeaderButton() {
  const { __ } = useI18n()
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
        {__('From Template')}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        <span className="ml-0.5 hidden group-hover/tpl:inline-flex">
          <ProBadge />
        </span>
      </Button>
    )
  }

  return null
}
