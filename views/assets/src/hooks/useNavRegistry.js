import { useState, useEffect } from 'react'

/**
 * Sidebar nav item registry for WP Project Manager.
 * Pro plugin registers additional nav items at runtime.
 * Sidebar picks them up reactively via useRegisteredNavItems().
 */

const navItems = []
const listeners = new Set()

function notify() {
  listeners.forEach(fn => fn())
}

/**
 * Register a sidebar nav item.
 * @param {{ label: string, path: string, icon: string, section?: string, position?: number }} item
 *   section: 'global' | 'project' — where in the sidebar to show
 *   position: sort order (lower = higher in list)
 */
export function registerNavItem(item) {
  navItems.push(item)
  navItems.sort((a, b) => (a.position || 99) - (b.position || 99))
  notify()
}

/** Hook: get all registered nav items (reactive) */
export function useRegisteredNavItems(section) {
  const [, bump] = useState(0)
  useEffect(() => {
    const handler = () => bump(n => n + 1)
    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [])
  if (section) return navItems.filter(item => item.section === section)
  return [...navItems]
}
