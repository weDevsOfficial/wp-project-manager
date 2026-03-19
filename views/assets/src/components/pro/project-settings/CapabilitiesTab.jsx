import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'

const DEFAULT_CAPABILITIES = {
  co_worker: {
    create_message: true,
    view_private_message: true,
    create_list: true,
    view_private_list: true,
    create_task: true,
    view_private_task: true,
    create_milestone: true,
    view_private_milestone: true,
    create_file: true,
    view_private_file: true,
  },
  client: {
    create_message: true,
    view_private_message: false,
    create_list: true,
    view_private_list: false,
    create_task: true,
    view_private_task: false,
    create_milestone: true,
    view_private_milestone: false,
    create_file: true,
    view_private_file: false,
  },
}

const SECTIONS = [
  { key: 'message',   label: 'Message' },
  { key: 'list',      label: 'Todo List' },
  { key: 'task',      label: 'Todo' },
  { key: 'milestone', label: 'Milestone' },
  { key: 'file',      label: 'Files' },
]

const CapabilitiesTab = ({ projectId }) => {
  const api   = useApi()
  const { __ } = useI18n()
  const toast = useToast()

  const [capabilities, setCapabilities] = useState(DEFAULT_CAPABILITIES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchSettings = async () => {
      try {
        const res = await api.get(`projects/${projectId}`)
        if (!cancelled && res?.data?.capabilities) {
          const resCaps = res.data.capabilities
          setCapabilities((prev) => ({
            co_worker: { ...prev.co_worker, ...resCaps.co_worker },
            client:    { ...prev.client,    ...resCaps.client },
          }))
        }
      } catch (err) {
        if (!cancelled && err?.status !== 404 && err?.response?.status !== 404) {
          toast.error(__('Failed to load capabilities', 'wedevs-project-manager'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSettings()
    return () => { cancelled = true }
  }, [projectId])

  const toggle = useCallback((role, key) => {
    setCapabilities((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role][key],
      },
    }))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post(`projects/${projectId}/settings`, {
        settings: [{ key: 'capabilities', value: capabilities }],
      })
      toast.success(__('Capabilities saved', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err?.message ?? __('Failed to save capabilities', 'wedevs-project-manager'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-pm-text-muted text-sm py-16 justify-center">
        <span className="w-4 h-4 rounded-full border-2 border-pm-accent border-t-transparent animate-spin" />
        {__('Loading...', 'wedevs-project-manager')}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-pm-text mb-1">
        {__('Capabilities', 'wedevs-project-manager')}
      </h2>
      <p className="text-sm text-pm-text-muted mb-5">
        {__('Control what co-workers and clients can do in this project.', 'wedevs-project-manager')}
      </p>

      <div className="rounded-lg border border-pm-border bg-white overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_120px_120px] gap-2 px-5 py-3 bg-muted/30 border-b border-pm-border">
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider">
            {__('Section', 'wedevs-project-manager')}
          </div>
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider text-center">
            {__('Permission', 'wedevs-project-manager')}
          </div>
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider text-center">
            {__('Co-worker', 'wedevs-project-manager')}
          </div>
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider text-center">
            {__('Client', 'wedevs-project-manager')}
          </div>
        </div>

        {/* Rows */}
        {SECTIONS.map((section, idx) => {
          const createKey      = `create_${section.key}`
          const viewPrivateKey = `view_private_${section.key}`

          return (
            <div key={section.key}>
              {idx > 0 && <div className="border-t border-pm-border" />}

              {/* Create row */}
              <div className="grid grid-cols-[1fr_120px_120px_120px] gap-2 px-5 py-3 items-center">
                <span className="text-sm font-medium text-pm-text">
                  {__(section.label, 'wedevs-project-manager')}
                </span>
                <span className="text-xs text-pm-text-muted text-center">
                  {__('Create', 'wedevs-project-manager')}
                </span>
                <div className="flex justify-center">
                  <Checkbox
                    checked={capabilities.co_worker[createKey]}
                    onCheckedChange={() => toggle('co_worker', createKey)}
                  />
                </div>
                <div className="flex justify-center">
                  <Checkbox
                    checked={capabilities.client[createKey]}
                    onCheckedChange={() => toggle('client', createKey)}
                  />
                </div>
              </div>

              {/* View Private row */}
              <div className="grid grid-cols-[1fr_120px_120px_120px] gap-2 px-5 py-3 items-center bg-muted/20">
                <span />
                <span className="text-xs text-pm-text-muted text-center">
                  {__('View Private', 'wedevs-project-manager')}
                </span>
                <div className="flex justify-center">
                  <Checkbox
                    checked={capabilities.co_worker[viewPrivateKey]}
                    onCheckedChange={() => toggle('co_worker', viewPrivateKey)}
                  />
                </div>
                <div className="flex justify-center">
                  <Checkbox
                    checked={capabilities.client[viewPrivateKey]}
                    onCheckedChange={() => toggle('client', viewPrivateKey)}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3 mt-5">
        <Button onClick={handleSave} disabled={saving}>
          {saving
            ? __('Saving...', 'wedevs-project-manager')
            : __('Save Changes', 'wedevs-project-manager')}
        </Button>
      </div>
    </div>
  )
}

export default CapabilitiesTab
