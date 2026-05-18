import React, { useState, useEffect, Suspense } from 'react'

/**
 * Slot/Fill + Filter system for WP Project Manager.
 *
 * Bridges WordPress's own wp.hooks (addFilter/applyFilters/addAction/doAction)
 * with a React-reactive layer that triggers re-renders when pro registers new fills.
 *
 * - WP hooks (`wp.hooks`): Used for data filters and non-UI actions
 * - PM slots: Used for React component injection (needs re-render on registration)
 *
 * Free plugin defines <Slot name="..." /> placeholders.
 * Pro plugin calls registerSlot()/registerFilter() or wp.hooks.addFilter() to extend.
 */

// ── WordPress hooks bridge ────────────────────────────────
// wp.hooks is provided by @wordpress/hooks (loaded as 'wp-hooks' script)
const wpHooks = (typeof wp !== 'undefined' && wp.hooks) ? wp.hooks : null

// ── React-reactive registry ───────────────────────────────
const slotRegistry = {}
const filterRegistry = {}
const listeners = new Set()

function notify() {
  listeners.forEach(fn => fn())
}

/** Register a React component to fill a named slot */
export function registerSlot(name, component, priority = 10) {
  if (!slotRegistry[name]) slotRegistry[name] = []
  slotRegistry[name].push({ component, priority })
  slotRegistry[name].sort((a, b) => a.priority - b.priority)
  notify()

  // Also fire WP action so PHP-registered JS can listen
  if (wpHooks) wpHooks.doAction('pm_slot_registered', name, component)
}

/**
 * Register a filter callback.
 * Also registers with wp.hooks so WP's applyFilters picks it up too.
 */
export function registerFilter(name, callback, priority = 10) {
  if (!filterRegistry[name]) filterRegistry[name] = []
  filterRegistry[name].push({ callback, priority })
  filterRegistry[name].sort((a, b) => a.priority - b.priority)
  notify()

  // Bridge to WP hooks
  if (wpHooks) wpHooks.addFilter(name, 'pm-pro', callback, priority)
}

/**
 * Apply all registered filters to a value.
 * Checks BOTH our registry AND wp.hooks so filters registered via either system work.
 */
export function applyFilters(name, value, ...args) {
  // First apply our own filters
  let result = value
  if (filterRegistry[name]) {
    result = filterRegistry[name].reduce(
      (acc, { callback }) => callback(acc, ...args),
      result
    )
  }
  // Then apply any additional wp.hooks filters (if not already bridged)
  if (wpHooks && wpHooks.hasFilter(name)) {
    result = wpHooks.applyFilters(name, result, ...args)
  }
  return result
}

/**
 * Fire a WP action (pass-through to wp.hooks.doAction).
 */
export function doAction(name, ...args) {
  if (wpHooks) wpHooks.doAction(name, ...args)
}

/**
 * Add a WP action listener (pass-through to wp.hooks.addAction).
 */
export function addAction(name, namespace, callback, priority = 10) {
  if (wpHooks) wpHooks.addAction(name, namespace, callback, priority)
}

// ── React hooks (reactive) ───────────────────────────────

/** Hook: subscribe to registry changes (triggers re-render) */
function useRegistryUpdate() {
  const [, bump] = useState(0)
  useEffect(() => {
    const handler = () => bump(n => n + 1)
    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [])
}

/** Hook: get current fills for a slot (reactive) */
export function useSlotFills(name) {
  useRegistryUpdate()
  return slotRegistry[name] || []
}

/** Hook: apply filters reactively (re-renders when new filters are registered) */
export function useFilter(name, defaultValue, ...args) {
  useRegistryUpdate()
  return applyFilters(name, defaultValue, ...args)
}

/** Component: renders all fills registered to a named slot */
export function Slot({ name, fallback = null, ...props }) {
  const fills = useSlotFills(name)
  if (fills.length === 0) return fallback
  return fills.map(({ component: Comp }, i) => (
    <Suspense key={i} fallback={null}>
      <Comp {...props} />
    </Suspense>
  ))
}
