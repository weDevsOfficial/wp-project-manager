import { useEffect, useState } from 'react'
import { useApi } from '@hooks/useApi'

// Per-projectId in-memory cache so repeated callers share one fetch.
const cache = new Map()        // projectId → project object
const inflight = new Map()     // projectId → Promise
const failed = new Map()       // projectId → true when the fetch was rejected
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

  failed.delete(projectId)

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
      // Remember the failure so callers can tell 'denied/missing' from 'still loading'
      // instead of rendering a spinner forever.
      failed.set(projectId, true)
      notify()
      return null
    })

  inflight.set(projectId, p)
  return p
}

export function invalidateProjectCache(projectId) {
  if (projectId == null) {
    cache.clear()
    failed.clear()
  } else {
    cache.delete(projectId)
    failed.delete(projectId)
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

/**
 * True when loading the project was rejected (no access, or it no longer exists).
 * Lets a route render a real error state instead of an endless spinner.
 */
export function useProjectLoadFailed(projectId) {
  const key = projectId ? String(projectId) : null
  const [isFailed, setIsFailed] = useState(() => (key ? failed.has(key) : false))

  useEffect(() => {
    if (!key) { setIsFailed(false); return }

    let cancelled = false
    const sub = () => {
      if (!cancelled) setIsFailed(failed.has(key))
    }
    listeners.add(sub)
    sub()

    return () => {
      cancelled = true
      listeners.delete(sub)
    }
  }, [key])

  return isFailed
}
