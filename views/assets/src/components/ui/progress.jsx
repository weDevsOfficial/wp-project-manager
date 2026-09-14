"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, indicatorClassName, indicatorStyle, ...props }, ref) => {
  // Tailwind `important: true` makes `bg-primary` !important, which would beat an
  // inline backgroundColor — so drop it when a custom fill color is provided.
  const hasCustomColor = !!(indicatorStyle && indicatorStyle.backgroundColor)
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}>
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 transition-all", !hasCustomColor && "bg-primary", indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)`, ...indicatorStyle }} />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
