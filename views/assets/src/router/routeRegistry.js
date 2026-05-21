import { useState, useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

/**
 * Route registry for WP Project Manager.
 * Pro plugin registers additional routes at runtime.
 * Free app picks them up reactively via useRegisteredRoutes().
 *
 * Route config:
 *   { path: string, element: React.ReactElement, noSidebar?: boolean, noSubNav?: boolean }
 *
 * Setting `noSidebar: true` on a route hides BOTH the AppSidebar and the
 * sub-navigation (it implies `noSubNav`). Layout components consult this via
 * `useLayoutFlags()` (single subscription, returns { hideSidebar, hideSubNav }).
 * Thin wrappers `useHideSidebar()` / `useHideSubNav()` exist for back-compat.
 */

const registeredRoutes = []
const listeners = new Set()

function notify() {
  listeners.forEach(fn => fn())
}

export function registerRoute(config) {
  registeredRoutes.push(config)
  notify()
}

/** Hook: get all registered routes (reactive) */
export function useRegisteredRoutes() {
  const [, bump] = useState(0)
  useEffect(() => {
    const handler = () => bump(n => n + 1)
    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [])
  return [...registeredRoutes]
}

/**
 * Match current pathname against registered routes; return the matching config
 * (or null). Reactive — re-runs when routes change or the URL changes.
 */
export function useMatchedRoute() {
  const routes = useRegisteredRoutes()
  const location = useLocation()
  return routes.find(r => matchPath({ path: '/' + r.path, end: true }, location.pathname)) || null
}

/**
 * Hook: layout flags derived from the matched route's config. Single
 * `useMatchedRoute` subscription. Setting `noSidebar: true` on a route also
 * hides the sub-navigation.
 */
export function useLayoutFlags() {
  const m = useMatchedRoute()
  return {
    hideSidebar: !!m?.noSidebar,
    hideSubNav: !!(m?.noSubNav || m?.noSidebar),
  }
}

/** Back-compat: thin wrapper. Prefer `useLayoutFlags` to avoid duplicate subs. */
export function useHideSidebar() {
  return useLayoutFlags().hideSidebar
}

/** Back-compat: thin wrapper. Prefer `useLayoutFlags` to avoid duplicate subs. */
export function useHideSubNav() {
  return useLayoutFlags().hideSubNav
}
