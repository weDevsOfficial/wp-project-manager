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
 * Set `noSidebar: true` on routes that should hide the AppSidebar (e.g. client-facing
 * shortcode pages). Layout components consult this via `useIsBareLayout()`.
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

/** Hook: true when the current route is registered with `noSidebar: true`. */
export function useHideSidebar() {
  return !!useMatchedRoute()?.noSidebar
}

/** Hook: true when the current route is registered with `noSubNav: true`. */
export function useHideSubNav() {
  const m = useMatchedRoute()
  return !!(m?.noSubNav || m?.noSidebar)
}
