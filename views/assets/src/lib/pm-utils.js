/**
 * PM API Value Utilities
 *
 * The WP Project Manager PHP backend returns values in inconsistent formats:
 * - Status: integer 0/1 (Transformer) OR string 'incomplete'/'complete' (Helper)
 * - Priority: string 'low'/'medium'/'high' (Transformer) OR integer 0/1/2 (raw row)
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

// ── Task Priority ─────────────────────────────────────

const PRIORITY_SLUGS = ['low', 'medium', 'high']

/**
 * Normalize a task priority to a slug.
 * API returns the slug ('low' | 'medium' | 'high'); the DB int (0 | 1 | 2)
 * only reaches the client on payloads that bypass the model accessor.
 */
export function taskPriority(value) {
  if (value === null || value === undefined || value === '') return null
  const slug = typeof value === 'number' ? PRIORITY_SLUGS[value] : String(value).toLowerCase()
  return PRIORITY_SLUGS.includes(slug) ? slug : null
}

// ── Privacy ───────────────────────────────────────────

/**
 * Check if an item is private.
 * API returns: 0/1 integer, '0'/'1' string, 'true'/'false' string, or boolean.
 * Must strictly match private values — anything else (0, "0", null, undefined, false) is public.
 */
export function isPrivate(val) {
  // Strict check: only these exact values mean "private"
  return val === 1 || val === '1' || val === true || val === 'true'
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
  return d.toLocaleDateString('en-US', options ?? { month: 'short', day: 'numeric', year: 'numeric' })
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
  const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

/**
 * Check if a task's due date is overdue (past today and task is not complete).
 */
export function isOverdue(dueField, status) {
  if (isTaskComplete(status)) return false
  const dateStr = extractDateStr(dueField)
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  if (isNaN(due.getTime())) return false
  due.setHours(0, 0, 0, 0)
  return due < today
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

// ── Project Roles ─────────────────────────────────────

/**
 * Default role for a member being added to a project.
 * roles[0] is Manager (id 1), so falling back to it handed full project
 * control (member management, project delete) to anyone added in two clicks.
 * Co-Worker is the least-privilege role that can still do project work.
 */
export function defaultMemberRoleId(roles) {
  const list = roles || []
  const coWorker = list.find(r => r.slug === 'co_worker')
  return coWorker ? coWorker.id : (list[0]?.id ?? 2)
}

// ── Local Calendar Dates ──────────────────────────────

/**
 * YYYY-MM-DD for the viewer's own calendar day.
 * toISOString() converts to UTC first, so east of UTC it returns yesterday:
 * in Asia/Dhaka (UTC+6) a local Sep 9 came back as 2026-09-08, which moved
 * "today", the week start and every overdue comparison a day early.
 */
export function toLocalDateStr(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * YYYY-MM-DD for today in the SITE's timezone (PM_Vars.wp_time_zone).
 * Server-stamped rows (activities, comments) carry site time, so grouping
 * them against the viewer's local day mislabels everything whenever the two
 * zones disagree. Falls back to the viewer's own day if the zone is unknown.
 */
export function siteTodayStr() {
  const zone = typeof PM_Vars !== 'undefined' ? PM_Vars?.wp_time_zone : null
  if (!zone) return toLocalDateStr(new Date())
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date())
  } catch {
    return toLocalDateStr(new Date())
  }
}

/**
 * Human file size. `(bytes / 1024).toFixed(0) + 'KB'` reported every file
 * under 512 bytes as "0KB", so a real attachment looked empty.
 */
export function formatFileSize(bytes) {
  const size = Number(bytes)
  if (!Number.isFinite(size) || size < 0) return ''
  if (size < 1024) return `${Math.round(size)} B`
  const kb = size / 1024
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`
  return `${(mb / 1024).toFixed(1)} GB`
}
