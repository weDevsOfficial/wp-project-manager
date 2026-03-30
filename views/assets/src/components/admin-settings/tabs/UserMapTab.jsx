import React, { useState, useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import {
  fetchSettingsProjects, selectProjectForMap, saveUserMap,
} from '@store/settingsSlice'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@components/ui/select'

const UserMapTab = () => {
  const { __ } = useI18n()
  const toast  = useToast()
  const dispatch = useAppDispatch()

  const projects       = useAppSelector((s) => s.settings.projects)
  const userMapUsers   = useAppSelector((s) => s.settings.userMapUsers)
  const userMapLoading = useAppSelector((s) => s.settings.userMapLoading)
  const userMapSaving  = useAppSelector((s) => s.settings.userMapSaving)

  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [userEdits, setUserEdits] = useState({})

  useEffect(() => {
    dispatch(fetchSettingsProjects())
  }, [dispatch])

  const loadProjectUsers = useCallback((projectId) => {
    const project = projects.find((p) => String(p.id) === projectId)
    if (project?.assignees?.data) {
      const assignees = project.assignees.data
      dispatch(selectProjectForMap(assignees))

      const edits = {}
      assignees.forEach((u) => {
        edits[u.id] = {
          github:    u.github ?? '',
          bitbucket: u.bitbucket ?? '',
        }
      })
      setUserEdits(edits)
    }
  }, [projects, dispatch])

  const onProjectSelect = useCallback((value) => {
    if (!value) return
    setSelectedProjectId(value)
    loadProjectUsers(value)
  }, [loadProjectUsers])

  const updateUserEdit = useCallback((userId, field, value) => {
    setUserEdits((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }))
  }, [])

  const onSubmit = async () => {
    const payload = {}
    Object.entries(userEdits).forEach(([id, vals]) => {
      payload[`github_${id}`]    = vals.github
      payload[`bitbucket_${id}`] = vals.bitbucket
    })

    try {
      await dispatch(saveUserMap(payload)).unwrap()
      toast.success(__('User mapping saved', 'wedevs-project-manager'))
      await dispatch(fetchSettingsProjects()).unwrap()
      if (selectedProjectId) {
        loadProjectUsers(selectedProjectId)
      }
    } catch (err) {
      toast.error(err ?? __('Failed to save user map', 'wedevs-project-manager'))
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-pm-text mb-1">{__('User Map', 'wedevs-project-manager')}</h2>
      <p className="text-sm text-pm-text-muted mb-5">{__('Map project members to their GitHub and Bitbucket usernames.', 'wedevs-project-manager')}</p>

      <div className="rounded-lg border border-pm-border bg-white">
        <div className="flex items-center justify-between px-5 py-4">
          <Label className="text-sm font-medium text-pm-text">{__('Select Project', 'wedevs-project-manager')}</Label>
          {userMapLoading ? (
            <div className="h-9 w-56 bg-pm-border/50 rounded animate-pulse" />
          ) : (
            <Select value={selectedProjectId} onValueChange={onProjectSelect}>
              <SelectTrigger className="w-64"><SelectValue placeholder={__('-- Choose a project --', 'wedevs-project-manager')} /></SelectTrigger>
              <SelectContent>
                {projects.map((project) => (<SelectItem key={project.id} value={String(project.id)}>{project.title}</SelectItem>))}
              </SelectContent>
            </Select>
          )}
        </div>

        {userMapUsers.length > 0 && (
          <>
            <div className="border-t border-pm-border" />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pm-border">
                  <th className="text-left px-5 py-3 font-medium text-pm-text-muted">{__('User', 'wedevs-project-manager')}</th>
                  <th className="text-left px-5 py-3 font-medium text-pm-text-muted">{__('GitHub Username', 'wedevs-project-manager')}</th>
                  <th className="text-left px-5 py-3 font-medium text-pm-text-muted">{__('Bitbucket Username', 'wedevs-project-manager')}</th>
                </tr>
              </thead>
              <tbody>
                {userMapUsers.map((user) => (
                  <tr key={user.id} className="border-b border-pm-border last:border-b-0">
                    <td className="px-5 py-3 font-medium text-pm-text">
                      {user.display_name || user.username || user.nicename || '\u2014'}
                    </td>
                    <td className="px-5 py-3">
                      {userEdits[user.id] && (
                        <Input value={userEdits[user.id].github} onChange={(e) => updateUserEdit(user.id, 'github', e.target.value)} placeholder="github-username" className="h-8 text-sm" />
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {userEdits[user.id] && (
                        <Input value={userEdits[user.id].bitbucket} onChange={(e) => updateUserEdit(user.id, 'bitbucket', e.target.value)} placeholder="bitbucket-username" className="h-8 text-sm" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {!userMapLoading && userMapUsers.length === 0 && (
          <>
            <div className="border-t border-pm-border" />
            <div className="px-5 py-4 text-sm text-pm-text-muted">
              {__('Select a project above to see its members.', 'wedevs-project-manager')}
            </div>
          </>
        )}
      </div>

      {userMapUsers.length > 0 && (
        <div className="mt-5">
          <Button disabled={userMapSaving} onClick={onSubmit}>
            {userMapSaving ? __('Saving...', 'wedevs-project-manager') : __('Save Mapping', 'wedevs-project-manager')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default UserMapTab
