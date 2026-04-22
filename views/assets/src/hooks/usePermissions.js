import { useMemo } from 'react'

export function usePermissions() {
  const isAdmin      = useMemo(() => !!PM_Vars.is_admin, [])
  const isPro        = useMemo(() => !!PM_Vars.is_pro, [])
  const isProLicensed = useMemo(() => isPro && typeof PM_Pro_Vars !== 'undefined' && !!PM_Pro_Vars.is_license_active, [isPro])
  const canManage    = useMemo(() => !!PM_Vars.manage_capability, [])
  const canCreate    = useMemo(() => !!PM_Vars.create_capability, [])

  return { isAdmin, isPro, isProLicensed, canManage, canCreate }
}
