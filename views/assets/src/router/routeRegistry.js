import { useState, useEffect } from 'react'

/**
 * Route registry for WP Project Manager.
 * Pro plugin registers additional routes at runtime.
 * Free app picks them up reactively via useRegisteredRoutes().
 */

const registeredRoutes = []
const listeners = new Set()

function notify() {
  listeners.forEach(fn => fn())
}

/**
 * Register a route. Called by pro plugin's entry point.
 * @param {{ path: string, element: React.ReactElement }} config
 */
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
