import { useEffect, useState } from 'react'
import { useApi } from '@hooks/useApi'

// Per-projectId in-memory cache so repeated callers share one fetch.
const cache = new Map()        // projectId → project object
const inflight = new Map()     // projectId → Promise
const listeners = new Set()    // () => void subscribers for cache updates

function notify() {
  listeners.forEach((fn) => {
    try { fn() } catch (_) { /* noop */ }
  })
}

function fetchProject(api, projectId) {
  if (!projectId) return Promise.resolve(null)
  if (cache.has(projectId)) return Promise.resolve(cache.get(projectId))
  if (inflight.has(projectId)) return inflight.get(projectId)

  const p = api
    .get(`projects/${projectId}`, { with: 'assignees,assignees.roles' })
    .then((res) => {
      const data = res?.data ?? res
      cache.set(projectId, data)
      inflight.delete(projectId)
      notify()
      return data
    })
    .catch(() => {
      inflight.delete(projectId)
      return null
    })

  inflight.set(projectId, p)
  return p
}

export function invalidateProjectCache(projectId) {
  if (projectId == null) {
    cache.clear()
  } else {
    cache.delete(projectId)
  }
  notify()
}

/**
 * Returns the cached current project (with assignees + role caps) or null until loaded.
 * Safe to call from many components — one fetch per projectId.
 */
export function useCurrentProject(projectId) {
  const api = useApi()
  const key = projectId ? String(projectId) : null
  const [project, setProject] = useState(() => (key ? cache.get(key) || null : null))

  useEffect(() => {
    if (!key) { setProject(null); return }

    let cancelled = false
    const sub = () => {
      if (!cancelled) setProject(cache.get(key) || null)
    }
    listeners.add(sub)

    if (cache.has(key)) {
      setProject(cache.get(key))
    } else {
      fetchProject(api, key).then((p) => {
        if (!cancelled) setProject(p)
      })
    }

    return () => {
      cancelled = true
      listeners.delete(sub)
    }
  }, [key, api])

  return project
}
