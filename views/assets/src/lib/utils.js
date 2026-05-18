import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** Convert {key: val, ...} to [{key, value}, ...] — matches WP REST API format */
export function formatSettings(settings) {
  return Object.entries(settings).map(([key, value]) => ({ key, value }))
}

/** Read a setting from PM_Vars.settings with a fallback default */
export function getSetting(key, fallback) {
  const val = PM_Vars.settings?.[key]
  if (val === undefined || val === null) return fallback
  if (val === 'true')  return true
  if (val === 'false') return false
  return val
}
