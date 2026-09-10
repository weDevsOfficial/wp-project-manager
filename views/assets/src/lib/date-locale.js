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
  // Localized numeric date for trigger inputs. Field order follows the locale,
  // so this is mm/dd/yyyy on en-US and dd/mm/yyyy on most others.
  display: (date) => longDateFmt.format(date),
}

// Hint for an empty date field. Derived from the same formatter as `display`,
// so it can never promise an order the field will not use.
export function getDatePlaceholder() {
  return longDateFmt
    .formatToParts(new Date(2026, 11, 31))
    .map((part) => {
      if (part.type === 'day') return 'dd'
      if (part.type === 'month') return 'mm'
      if (part.type === 'year') return 'yyyy'
      return part.value
    })
    .join('')
}

// First day of week per locale (0 = Sunday). Most locales start Monday; keep a
// small override map and default to Sunday for en/bn which the UI shipped with.
const MONDAY_FIRST = new Set(['en-GB', 'fr', 'de', 'es', 'it', 'nl', 'pl', 'cs', 'ru'])
export function getWeekStartsOn() {
  const base = tag.toLowerCase()
  return [...MONDAY_FIRST].some((l) => base === l || base.startsWith(l + '-')) ? 1 : 0
}
