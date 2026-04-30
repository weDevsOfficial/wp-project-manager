import { useCallback, useMemo } from 'react'

// ── Stateless helpers (match Vue bootstrap.js) ─────────────────

function getCurrentUser() {
  return (typeof PM_Vars !== 'undefined' && PM_Vars.current_user) || {}
}

export function pmUserCanAccess(capSlug) {
  const user = getCurrentUser()
  const caps = user.caps || {}
  const allcaps = user.allcaps || {}
  if (allcaps.manage_options === true) return true
  if (caps[capSlug] === true) return true
  if (allcaps[capSlug] === true) return true
  return false
}

export function pmHasManageCapability() {
  const slug = (typeof PM_Vars !== 'undefined' && PM_Vars.manager_cap_slug) || ''
  if (!!PM_Vars?.manage_capability) return true
  if (slug && pmUserCanAccess(slug)) return true
  return false
}

function findAssignee(project, userId) {
  const list = project?.assignees?.data ?? project?.assignees ?? []
  const arr = Array.isArray(list) ? list : Object.values(list || {})
  return arr.find((a) => String(a?.id) === String(userId)) || null
}

export function pmIsUserInProject(project, user) {
  const u = user || getCurrentUser()
  if (!project) return false
  return !!findAssignee(project, u.ID)
}

export function pmGetRole(project, user) {
  const u = user || getCurrentUser()
  const a = findAssignee(project, u.ID)
  if (!a) return null
  const roles = a?.roles?.data ?? a?.roles ?? []
  const list = Array.isArray(roles) ? roles : Object.values(roles || {})
  return list.length ? (list[0].slug || null) : null
}

export function pmGetRoleCaps(project, role) {
  const caps = project?.capabilities || {}
  return caps[role] || {}
}

export function pmIsManager(project, user) {
  if (pmHasManageCapability()) return true
  if (!project) return false
  const u = user || getCurrentUser()
  const a = findAssignee(project, u.ID)
  if (!a) return false
  const roles = a?.roles?.data ?? a?.roles ?? []
  const list = Array.isArray(roles) ? roles : Object.values(roles || {})
  return list.some((r) => r?.slug === 'manager')
}

export function pmUserCan(cap, project, user) {
  if (pmHasManageCapability()) return true
  if (!pmIsUserInProject(project, user)) return false
  if (pmIsManager(project, user)) return true
  const role = pmGetRole(project, user)
  if (!role) return false
  const roleCaps = pmGetRoleCaps(project, role)
  if (!Object.keys(roleCaps).length) return true
  const v = roleCaps[cap]
  return v === true || v === 'true'
}

export function pmCanEditTask(task, project) {
  if (pmIsManager(project)) return true
  const user = getCurrentUser()
  const creatorId = task?.creator?.data?.id ?? task?.created_by ?? task?.creator?.id
  if (!creatorId) return false
  return String(creatorId) === String(user.ID)
}

export function pmCanEditComment(comment, project) {
  if (comment?.commentable_type === 'task_activity') return false
  if (pmIsManager(project)) return true
  const user = getCurrentUser()
  const creatorId = comment?.creator?.data?.id ?? comment?.creator?.id ?? comment?.created_by
  if (!creatorId) return false
  return String(creatorId) === String(user.ID)
}

export function pmCanCompleteTask(task, project) {
  if (pmIsManager(project)) return true
  const user = getCurrentUser()
  const creatorId = task?.creator?.data?.id ?? task?.created_by
  if (creatorId && String(creatorId) === String(user.ID)) return true
  const assignees = task?.assignees?.data ?? task?.assignees ?? []
  const list = Array.isArray(assignees) ? assignees : Object.values(assignees || {})
  return list.some((a) => String(a?.id ?? a?.assigned_to) === String(user.ID))
}

// ── React hook wrapper ────────────────────────────────────────

export function usePermissions(project) {
  // PM_Vars.is_admin reflects WP's is_admin() — true for ANY user viewing
  // wp-admin (incl. Subscribers). Use manage_options cap for true admin check.
  const isAdmin       = useMemo(() => {
    const u = getCurrentUser()
    return !!(u?.allcaps?.manage_options || u?.caps?.manage_options)
  }, [])
  const isPro         = useMemo(() => !!PM_Vars?.is_pro, [])
  const isProLicensed = useMemo(
    () => isPro && typeof PM_Pro_Vars !== 'undefined' && !!PM_Pro_Vars.is_license_active,
    [isPro],
  )
  const canManage     = useMemo(() => pmHasManageCapability(), [])
  const canCreate     = useMemo(() => pmHasManageCapability(), [])
  const currentUserId = useMemo(() => getCurrentUser().ID ?? null, [])

  // License management is admin-only (manage_options cap). Used by sidebar nav,
  // LicenseRoute guard, and useLicenseGuard redirect. Single source of truth so
  // backend (Administrator permission class) and frontend stay aligned.
  const canManageLicense = isAdmin

  const isManager     = useMemo(() => pmIsManager(project), [project])
  const isUserInProject = useMemo(() => pmIsUserInProject(project), [project])

  const userCan = useCallback((cap) => pmUserCan(cap, project), [project])
  const canEditTask = useCallback((task) => pmCanEditTask(task, project), [project])
  const canEditComment = useCallback((comment) => pmCanEditComment(comment, project), [project])
  const canCompleteTask = useCallback((task) => pmCanCompleteTask(task, project), [project])

  return {
    isAdmin,
    isPro,
    isProLicensed,
    canManageLicense,
    canManage,
    canCreate,
    isManager,
    isUserInProject,
    currentUserId,
    userCan,
    canEditTask,
    canEditComment,
    canCompleteTask,
  }
}
