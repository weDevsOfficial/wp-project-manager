import { useMemo } from 'react'
import { useAppSelector } from '@store/index'

/**
 * Returns the list of active pro module paths (e.g. 'Kanboard/Kanboard.php').
 *
 * Source priority:
 *   1. Redux slice `modules.activeModules` (populated by pm-pro's
 *      injectReducer + fetchModules thunk).
 *   2. PHP-localized `PM_Pro_Vars.active_modules` fallback used until the
 *      Redux slice is populated, or when pm-pro hasn't registered the
 *      reducer yet (free-only installs return []).
 *
 * Free components should call this instead of reading `s.modules` directly
 * or dereferencing `PM_Pro_Vars`; that keeps the coupling in one place and
 * lets future refactors (e.g. moving to a filter) touch a single file.
 */
export function useActiveProModules() {
  const reduxActiveModules = useAppSelector(s => s.modules?.activeModules ?? null)
  return useMemo(() => {
    const phpModules = typeof PM_Pro_Vars !== 'undefined' ? (PM_Pro_Vars.active_modules ?? []) : []
    const raw = (reduxActiveModules && reduxActiveModules.length > 0)
      ? reduxActiveModules
      : phpModules
    return raw.map(m => typeof m === 'string' ? m : (m.path || ''))
  }, [reduxActiveModules])
}

export function isProModuleActive(modulePaths, dir) {
  return modulePaths.some(m => m.startsWith(dir + '/') || m === dir)
}

/**
 * Whether the pm-pro plugin is loaded on the page (licensed or not).
 * Backed by the PHP-localized `PM_Pro_Vars` global.
 */
export function isProPluginInstalled() {
  return typeof PM_Pro_Vars !== 'undefined'
}
