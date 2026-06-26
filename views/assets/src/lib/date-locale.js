// Resolve the active WordPress locale (e.g. "bn_BD") to a BCP-47 tag ("bn-BD")
// so Intl.* can localize month/weekday/day names without bundling date-fns locales.
export function getPmLocaleTag() {
  const raw =
    typeof PM_Vars !== 'undefined' && PM_Vars.locale ? PM_Vars.locale : 'en_US'
  return raw.replace('_', '-')
}

const tag = getPmLocaleTag()

const numberFmt = new Intl.NumberFormat(tag)
const captionFmt = new Intl.DateTimeFormat(tag, { month: 'long', year: 'numeric' })
const weekdayFmt = new Intl.DateTimeFormat(tag, { weekday: 'short' })
const longDateFmt = new Intl.DateTimeFormat(tag, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export const dateFormatters = {
  day: (date) => numberFmt.format(date.getDate()),
  caption: (date) => captionFmt.format(date),
  weekday: (date) => weekdayFmt.format(date),
  // Localized dd/mm/yyyy display for trigger inputs.
  display: (date) => longDateFmt.format(date),
}

// First day of week per locale (0 = Sunday). Most locales start Monday; keep a
// small override map and default to Sunday for en/bn which the UI shipped with.
const MONDAY_FIRST = new Set(['en-GB', 'fr', 'de', 'es', 'it', 'nl', 'pl', 'cs', 'ru'])
export function getWeekStartsOn() {
  const base = tag.toLowerCase()
  return [...MONDAY_FIRST].some((l) => base === l || base.startsWith(l + '-')) ? 1 : 0
}
