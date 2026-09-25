import { toLocalDateStr } from '@lib/pm-utils'

export function extractDate(val) {
  if (!val) return ''
  if (typeof val === 'string') return val.substring(0, 10)
  if (typeof val === 'object' && val.date) return String(val.date).substring(0, 10)
  return ''
}

// YYYY-MM-DD strings compare correctly as text, so ranges are checked that
// way rather than through Date objects and the viewer's timezone.
export function getEventDates(event) {
  const start = extractDate(event.start_date || event.start || event.start_at)
  const end = extractDate(event.due_date || event.end || event.achieve_date)
  const from = start || end
  const to = end && end >= from ? end : from
  return { start: from, end: to }
}

export function getAllDatesBetween(startStr, endStr) {
  if (!startStr) return []
  const dates = []
  // Parse as local midnight: a bare 'YYYY-MM-DD' parses as UTC and lands on
  // the previous day for anyone west of UTC.
  const current = new Date(`${startStr}T00:00:00`)
  const end = new Date(`${endStr || startStr}T00:00:00`)
  while (current <= end) {
    dates.push(toLocalDateStr(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export function isEventComplete(event) {
  return event.status === 1 || event.status === 'complete' || event.status === 'completed'
}

export function isEventOverdue(event) {
  if (isEventComplete(event)) return false
  const { end } = getEventDates(event)
  return !!end && end < toLocalDateStr(new Date())
}

// Status colours shared by the calendar chips, legends and charts, matching the
// dashboard: accent = open, rose = overdue, emerald = done. `fill` feeds SVG
// charts, which cannot resolve Tailwind classes.
export const CALENDAR_TONES = {
  current:     { chip: 'bg-pm-accent/10 text-pm-accent hover:bg-pm-accent/15', dot: 'bg-pm-accent', fill: 'rgb(var(--pm-accent-rgb))' },
  outstanding: { chip: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/15', dot: 'bg-rose-500', fill: '#f43f5e' },
  complete:    { chip: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15', dot: 'bg-emerald-500', fill: '#10b981' },
  milestone:   { chip: 'bg-sky-500/10 text-sky-600 hover:bg-sky-500/15', dot: 'bg-sky-500', fill: '#0ea5e9' },
}

export function getEventTone(event) {
  if (event.type === 'milestone') return CALENDAR_TONES.milestone
  if (isEventComplete(event)) return CALENDAR_TONES.complete
  if (isEventOverdue(event)) return CALENDAR_TONES.outstanding
  return CALENDAR_TONES.current
}
