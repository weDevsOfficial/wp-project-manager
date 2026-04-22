import React from 'react'
import { Slot, useSlotFills } from '@hooks/useSlot'
import { useI18n } from '@hooks/useI18n'
import { usePermissions } from '@hooks/usePermissions'
import ProBadge from '@components/common/ProBadge'
import { useProModal } from '@components/common/ProUpgradeModal'
import { LayoutTemplate } from 'lucide-react'

import { Label } from '@components/ui/label'
import { Separator } from '@components/ui/separator'

export default function ProTemplateField() {
  const { __ } = useI18n()
  const { isPro } = usePermissions()
  const { setOpen } = useProModal()
  const fills = useSlotFills('project.create.template')

  // Pro active and slot filled — render the real picker
  if (fills.length > 0) {
    return (
      <>
        <Slot name="project.create.template" />
        <Separator />
      </>
    )
  }

  // Free plugin — show dimmed upgrade teaser
  if (!isPro) {
    return (
      <>
        <div
          className="space-y-2 cursor-pointer group/pro"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-2 opacity-75">
            <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
            <Label className="flex items-center gap-2 cursor-pointer">
              {__('Template (Optional)')}
              <ProBadge />
            </Label>
          </div>
          <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted/30 px-3 text-sm text-muted-foreground opacity-75 pointer-events-none select-none">
            {__('Start from a template — upgrade to Pro')}
          </div>
        </div>
        <Separator />
      </>
    )
  }

  return null
}
