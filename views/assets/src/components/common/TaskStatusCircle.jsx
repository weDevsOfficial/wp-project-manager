import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@lib/utils'

export default function TaskStatusCircle({ complete, hovered, size = 'sm', groupHover = false, className }) {
  const isLarge = size === 'lg'
  const box = isLarge ? 'h-6 w-6' : 'h-[18px] w-[18px]'
  const icon = isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'

  if (complete) {
    return (
      <span className={cn('flex items-center justify-center rounded-full bg-pm-accent text-white ring-1 ring-pm-accent/40 shadow-sm', box, className)}>
        <Check className={icon} strokeWidth={3} />
      </span>
    )
  }

  if (hovered) {
    return (
      <span className={cn('flex items-center justify-center rounded-full border-2 border-pm-accent text-pm-accent', box, className)}>
        <Check className={icon} strokeWidth={3} />
      </span>
    )
  }

  if (groupHover) {
    return (
      <span className={cn('flex items-center justify-center rounded-full border-[1.5px] border-dashed border-pm-text-muted transition-all group-hover/status:border-solid group-hover/status:border-pm-accent group-hover/status:text-pm-accent', box, className)}>
        <Check className={cn(icon, 'opacity-0 transition-opacity group-hover/status:opacity-100')} strokeWidth={3} />
      </span>
    )
  }

  return (
    <span className={cn('block rounded-full border-[1.5px] border-dashed border-pm-text-muted', box, className)} />
  )
}
