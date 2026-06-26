import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { __ } from '@wordpress/i18n'

import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '@components/ui/popover'
import { Calendar } from '@components/ui/calendar'
import { dateFormatters, getWeekStartsOn } from '@/lib/date-locale'

// Localize month/weekday/day labels via Intl without modifying the shadcn Calendar.
const localeFormatters = {
  formatDay: dateFormatters.day,
  formatCaption: dateFormatters.caption,
  formatWeekdayName: dateFormatters.weekday,
}

// ISO "yyyy-mm-dd" <-> local Date, kept in local time so the picked day never
// shifts across timezones (the bug Date(isoString) introduces).
function parseISO(value) {
  if (!value || typeof value !== 'string') return undefined
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return undefined
  const date = new Date(y, m - 1, d)
  return isNaN(date.getTime()) ? undefined : date
}

function toISO(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Drop-in replacement for <input type="date">. value/onChange use ISO strings.
function DatePicker({
  value,
  onChange,
  placeholder,
  disabled = false,
  id,
  className,
  align = 'start',
  min,
  max,
  ...props
}) {
  const [open, setOpen] = React.useState(false)
  const selected = parseISO(value)

  // Restrict selectable days (e.g. due date can't precede start date).
  const minDate = parseISO(min)
  const maxDate = parseISO(max)
  const disabledMatcher =
    minDate || maxDate ? { ...(minDate && { before: minDate }), ...(maxDate && { after: maxDate }) } : undefined

  const emit = (date) => {
    onChange?.(toISO(date))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-pm-border bg-pm-surface px-3 text-sm text-pm-text-primary disabled:opacity-50',
            !selected && 'text-pm-text-muted',
            className
          )}
          {...props}
        >
          <span className="truncate">
            {selected
              ? dateFormatters.display(selected)
              : placeholder || __('dd/mm/yyyy', 'wedevs-project-manager')}
          </span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-pm-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={emit}
          defaultMonth={selected}
          disabled={disabledMatcher}
          weekStartsOn={getWeekStartsOn()}
          formatters={localeFormatters}
        />
        <div className="flex items-center justify-between border-t border-pm-border px-3 py-2">
          <button
            type="button"
            className="text-sm font-medium text-pm-accent hover:underline"
            onClick={() => emit(undefined)}
          >
            {__('Clear', 'wedevs-project-manager')}
          </button>
          <button
            type="button"
            className="text-sm font-medium text-pm-accent hover:underline"
            onClick={() => emit(new Date())}
          >
            {__('Today', 'wedevs-project-manager')}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
DatePicker.displayName = 'DatePicker'

export { DatePicker, parseISO, toISO }
