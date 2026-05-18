import { __ } from '@wordpress/i18n';
import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { usePermissions } from '@hooks/usePermissions'
import { useCurrentProject } from '@hooks/useCurrentProject'

function Forbidden({ message }) {
  return (
    <div className="max-w-[1400px] mx-auto p-8 sm:p-12">
      <div className="rounded-xl border bg-card p-10 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-pm-text-primary mb-1">
          {__('Access denied', 'wedevs-project-manager')}
        </h2>
        <p className="text-sm text-pm-text-muted">
          {message || __('You do not have permission to view this page.', 'wedevs-project-manager')}
        </p>
      </div>
    </div>
  )
}

/**
 * Gate route by admin/manage capability.
 * Use for site-wide admin pages: /settings, /categories, /importtools, /modules.
 */
export function AdminRoute({ children }) {
  const { canManage, isAdmin } = usePermissions()
  if (!(canManage || isAdmin)) return <Forbidden />
  return children
}

/**
 * Gate route by manage capability OR manager role in any project.
 * Mirrors Vue sprint access: no global cap required, project-scoped managers pass.
 * Use for global pages that project managers should access (Sprints, etc).
 */
export function ManagerRoute({ children }) {
  const { canManage, isManagerAnywhere } = usePermissions()
  if (!(canManage || isManagerAnywhere)) return <Forbidden />
  return children
}

/**
 * License page guard.
 * Mirrors backend Administrator permission class (manage_options cap).
 * Delegated managers and regular users must not access this page; backend
 * REST will also reject them, this is the UI mirror.
 */
export function LicenseRoute({ children }) {
  const { canManageLicense } = usePermissions()
  if (canManageLicense) return children
  return <Forbidden message={__('You are not authorized to view this page.', 'wedevs-project-manager')} />
}

/**
 * Gate project-scoped route by capability slug or manager role.
 * Reads :projectId from URL and resolves project for cap check.
 */
export function ProjectRoute({ children, cap = null, managerOnly = false }) {
  const { projectId } = useParams()
  const project = useCurrentProject(projectId)
  const { isManager, isUserInProject, userCan, canManage } = usePermissions(project)

  if (canManage) return children
  // Wait for project to load before deciding
  if (!project) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="w-5 h-5 rounded-full border-2 border-pm-accent border-t-transparent animate-spin" />
      </div>
    )
  }
  if (isManager) return children
  if (managerOnly) return <Forbidden />
  if (!isUserInProject) return <Forbidden />
  if (cap && !userCan(cap)) return <Forbidden />
  return children
}

export default AdminRoute
