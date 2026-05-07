/** Wraps pm_apply_filters and pm_do_action WP-JS hooks with safe fallback */
export function usePmHooks() {
  return {
    applyFilters: (hook, value, ...args) =>
      typeof pm_apply_filters === 'function'
        ? pm_apply_filters(hook, value, ...args)
        : value,
    doAction: (hook, ...args) => {
      if (typeof pm_do_action === 'function') pm_do_action(hook, ...args)
    },
  }
}
