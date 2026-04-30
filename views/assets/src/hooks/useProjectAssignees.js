import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchProjectAssignees } from '@store/projectsSlice'

/**
 * Returns the assignees array for a project, loading from Redux cache.
 * One API call per projectId; all callers share the same cached result.
 */
export function useProjectAssignees(projectId) {
  const dispatch = useAppDispatch()
  const key = projectId ? String(projectId) : null
  const assignees = useAppSelector(s => (key ? s.projects.projectAssignees[key] : undefined))

  useEffect(() => {
    if (!key || assignees !== undefined) return
    dispatch(fetchProjectAssignees(key))
  }, [key, assignees, dispatch])

  return assignees ?? []
}
