import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

/**
 * shadcn/ui Calendar — built on react-day-picker v9.
 *
 * Local component (no @wedevs/plugin-ui dependency). All react-day-picker v9
 * props are forwarded, including `mode`, `selected`, `onSelect`, `modifiers`
 * and `modifiersClassNames`.
 *
 * @example
 *   <Calendar mode="single" selected={date} onSelect={setDate} />
 *   <Calendar month={cursor} modifiers={{ due: dueDays }} modifiersClassNames={{ due: 'pm-cal-due' }} />
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  mode,
  components: consumerComponents,
  ...props
}) {
  return (
    <DayPicker
      {...props}
      mode={mode}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: "rdp-root",
        months: "relative flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0",
        month: "flex flex-col gap-4 w-full",
        month_caption: "flex h-7 items-center justify-center",
        caption_label: "text-sm font-semibold text-pm-text-primary",
        nav: "absolute top-0 inset-x-0 flex h-7 items-center justify-between px-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-60 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-60 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-pm-text-muted rounded-md w-9 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-1",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-accent [&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100 rounded-md"
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground rounded-md font-semibold",
        outside: "outside text-pm-text-muted opacity-50",
        disabled: "text-pm-text-muted opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) => {
          if (orientation === "down") return <ChevronDown className="size-4" {...chevronProps} />
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return <Icon className="size-4" {...chevronProps} />
        },
        ...consumerComponents,
      }}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
