import { useMemo } from 'react'

export function usePermissions() {
  const isAdmin      = useMemo(() => !!PM_Vars.is_admin, [])
  const isPro        = useMemo(() => !!PM_Vars.is_pro, [])
  const canManage    = useMemo(() => !!PM_Vars.manage_capability, [])
  const canCreate    = useMemo(() => !!PM_Vars.create_capability, [])

  return { isAdmin, isPro, canManage, canCreate }
}
