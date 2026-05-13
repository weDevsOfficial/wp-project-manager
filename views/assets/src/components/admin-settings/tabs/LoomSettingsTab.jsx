import { __ } from '@wordpress/i18n';
/**
 * LoomSettingsTab — Loom integration settings (enable previews, oEmbed test).
 * Loom uses oEmbed — no API token needed.
 * Uses the general PM settings API (POST /pm/v2/settings) — same as Vue version.
 */
import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Switch } from '@components/ui/switch'
import { Label } from '@components/ui/label'

// Loom brand starburst logo SVG — exact path from Vue PR #586
const LoomLogo = ({ className = '' }) => (
  <svg viewBox="0 0 62 62" fill="#625DF5" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M62,27.6H43.9l15.7-9.1l-3.4-6l-15.7,9.1l9.1-15.7l-6-3.5l-9.1,15.7V0h-6.9v18.1L18.5,2.4l-6,3.4l9.1,15.7L5.9,12.5l-3.4,6l15.7,9.1H0v6.9h18.1L2.4,43.5l3.4,6l15.7-9.1l-9.1,15.7l6,3.4l9.1-15.7V62h6.9V43.9l9.1,15.7l6-3.4l-9.1-15.7l15.7,9.1l3.4-6l-15.7-9.1H62L62,27.6L62,27.6z M31,40.4c-5.2,0-9.4-4.2-9.4-9.4c0-5.2,4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4C40.4,36.2,36.2,40.4,31,40.4z" />
  </svg>
)

const LoomSettingsTab = () => {
  const api   = useApi()
  const toast  = useToast()

  const [enablePreviews, setEnablePreviews] = useState(true)
  const [saving, setSaving]                 = useState(false)
  const [isDirty, setIsDirty]               = useState(false)
  const [loading, setLoading]               = useState(true)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('settings', { key: 'loom_enable_previews' })
        const val = res?.data?.[0]?.value ?? res?.value ?? PM_Vars?.settings?.loom_enable_previews
        if (val !== undefined) {
          setEnablePreviews(val !== false && val !== 'false' && val !== '0' && val !== 0)
        }
      } catch { /* first time */ }
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const markDirty = useCallback(() => setIsDirty(true), [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.post('settings', {
        settings: [{ key: 'loom_enable_previews', value: enablePreviews ? '1' : '0' }],
      })
      if (res?.data) {
        res.data.forEach((item) => { PM_Vars.settings[item.key] = item.value })
      }
      setIsDirty(false)
      toast.success(__('Loom settings saved', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err?.message ?? __('Failed to save settings', 'wedevs-project-manager'))
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-pm-text flex items-center gap-2">
              <LoomLogo className="w-5 h-5 text-pm-accent" />
              {__('Loom Integration', 'wedevs-project-manager')}
            </h2>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 w-full bg-pm-border/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-pm-text flex items-center gap-2">
            <LoomLogo className="w-5 h-5 text-pm-accent" />
            {__('Loom Integration', 'wedevs-project-manager')}
          </h2>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__('Show Loom video preview cards in descriptions and comments. No API token required — uses oEmbed.', 'wedevs-project-manager')}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-pm-border bg-pm-surface">
        {/* Enable Previews */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label>{__('Enable Previews', 'wedevs-project-manager')}</Label>
            <p className="text-sm text-pm-text-muted mt-1">{__('Show Loom video preview cards automatically.', 'wedevs-project-manager')}</p>
          </div>
          <Switch checked={enablePreviews} onCheckedChange={(v) => { setEnablePreviews(v); markDirty() }} />
        </div>

      </div>

      <div className="flex items-center gap-3 mt-5">
        <Button type="submit" disabled={!isDirty || saving}>
          {saving ? __('Saving...', 'wedevs-project-manager') : __('Save Changes', 'wedevs-project-manager')}
        </Button>
        {isDirty && !saving && (
          <span className="text-sm text-pm-text-muted">{__('You have unsaved changes', 'wedevs-project-manager')}</span>
        )}
      </div>
    </form>
  )
}

export default LoomSettingsTab
