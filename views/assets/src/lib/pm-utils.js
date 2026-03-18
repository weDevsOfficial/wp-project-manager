/**
 * PM API Value Utilities
 *
 * The WP Project Manager PHP backend returns values in inconsistent formats:
 * - Status: integer 0/1 (Transformer) OR string 'incomplete'/'complete' (Helper)
 * - Privacy: integer 0/1 OR string 'true'/'false' OR boolean true/false
 * - Booleans: string '1'/'0' OR 'true'/'false' OR actual boolean OR integer
 * - Dates: object { date, time, datetime, timezone, timestamp } OR null
 *
 * These helpers normalize all variants into predictable JS values.
 */

// ── Boolean / Truthy ──────────────────────────────────

/** Normalize any WP-style truthy value to boolean */
export function isTruthy(val) {
  if (val === true || val === 1 || val === '1' || val === 'true') return true
  return false
}

/** Normalize any WP-style falsy value to boolean */
export function isFalsy(val) {
  return !isTruthy(val)
}

// ── Task Status ───────────────────────────────────────

/**
 * Check if a task is complete.
 * API returns: 1, '1', 'complete', or true depending on endpoint.
 */
export function isTaskComplete(status) {
  return status === 1 || status === '1' || status === 'complete' || status === true
}

/**
 * Check if a project is complete.
 * API returns: 'complete', 1, or '1' depending on endpoint.
 */
export function isProjectComplete(status) {
  return status === 'complete' || status === 1 || status === '1'
}

// ── Privacy ───────────────────────────────────────────

/**
 * Check if an item is private.
 * API returns: 0/1 integer, '0'/'1' string, 'true'/'false' string, or boolean.
 */
export function isPrivate(val) {
  return isTruthy(val)
}

// ── Dates ─────────────────────────────────────────────

/**
 * Extract a plain date string from PM's date field.
 * API returns: { date: '2025-01-15', time: '...', datetime: '...', ... } OR plain string OR null
 */
export function extractDateStr(field) {
  if (!field) return null
  if (typeof field === 'string') return field
  return field.date ?? field.datetime ?? null
}

/**
 * Format a PM date field for display.
 * Returns empty string if no valid date.
 */
export function formatPmDate(field, options) {
  const dateStr = extractDateStr(field)
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', options ?? { month: 'short', day: 'numeric' })
}

/**
 * Format a PM date field with both date and time (e.g. "Jan 15, 03:45 pm").
 * Mirrors Vue 2: taskDateFormat(date) + dateTimeFormat(datetime).
 */
export function formatPmDateTime(field) {
  if (!field) return ''
  // field is { date, time, datetime } or a plain string
  const dateStr = typeof field === 'string' ? field : (field.datetime ?? field.date ?? null)
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
  return `${datePart}, ${timePart}`
}

/**
 * Get CSS class for a due date (overdue=red, today=amber, future=muted).
 */
export function dueDateColorClass(field) {
  const dateStr = extractDateStr(field)
  if (!dateStr) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  if (isNaN(due.getTime())) return 'text-pm-text-muted'
  due.setHours(0, 0, 0, 0)
  if (due < today) return 'text-red-500'
  if (due.getTime() === today.getTime()) return 'text-amber-500'
  return 'text-pm-text-muted'
}

// ── Estimation ────────────────────────────────────────

/**
 * Format estimation in minutes to human-readable "Xh Ym".
 * API stores estimation in MINUTES.
 */
export function formatEstimation(minutes) {
  const m = typeof minutes === 'string' ? parseInt(minutes, 10) : (minutes ?? 0)
  if (!m || isNaN(m)) return ''
  const h = Math.floor(m / 60)
  const rem = m % 60
  if (h && rem) return `${h}h ${rem}m`
  if (h) return `${h}h`
  return `${rem}m`
}

// ── Fractal Data Unwrap ───────────────────────────────

/**
 * Unwrap Fractal's { data: T } wrapper.
 * Fractal includes return { data: { ... } }, but sometimes the API
 * returns the data flat. This handles both.
 */
export function unwrapData(val) {
  if (!val) return undefined
  if (typeof val === 'object' && 'data' in val) return val.data
  return val
}

// ── User Initials ─────────────────────────────────────

export function userInitials(name) {
  return name
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}
