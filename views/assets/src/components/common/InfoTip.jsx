import { __ } from '@wordpress/i18n'
import { Info } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@components/ui/tooltip'
import { cn } from '@lib/utils'

/**
 * Small info icon that explains a number on hover or keyboard focus.
 * @param {{ text: string, className?: string }} props
 */
export function InfoTip({ text, className }) {
  if (!text) return null
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={__('How this is calculated', 'wedevs-project-manager')}
            className={cn('inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 hover:text-pm-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40', className)}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[240px] text-[12px] leading-snug normal-case tracking-normal font-normal">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default InfoTip
