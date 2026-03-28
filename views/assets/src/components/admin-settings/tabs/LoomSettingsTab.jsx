/**
 * LoomSettingsTab — Loom integration settings (enable previews, oEmbed test).
 * Loom uses oEmbed — no API token needed.
 * Uses the general PM settings API (POST /pm/v2/settings) — same as Vue version.
 */
import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Switch } from '@components/ui/switch'
import { Label } from '@components/ui/label'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

// Loom brand starburst logo SVG — exact path from Vue PR #586
const LoomLogo = ({ className = '' }) => (
  <svg viewBox="0 0 62 62" fill="#625DF5" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M62,27.6H43.9l15.7-9.1l-3.4-6l-15.7,9.1l9.1-15.7l-6-3.5l-9.1,15.7V0h-6.9v18.1L18.5,2.4l-6,3.4l9.1,15.7L5.9,12.5l-3.4,6l15.7,9.1H0v6.9h18.1L2.4,43.5l3.4,6l15.7-9.1l-9.1,15.7l6,3.4l9.1-15.7V62h6.9V43.9l9.1,15.7l6-3.4l-9.1-15.7l15.7,9.1l3.4-6l-15.7-9.1H62L62,27.6L62,27.6z M31,40.4c-5.2,0-9.4-4.2-9.4-9.4c0-5.2,4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4C40.4,36.2,36.2,40.4,31,40.4z" />
  </svg>
)

const LoomSettingsTab = () => {
  const api   = useApi()
  const { __ } = useI18n()
  const toast  = useToast()

  const [enablePreviews, setEnablePreviews] = useState(true)
  const [saving, setSaving]                 = useState(false)
  const [isDirty, setIsDirty]               = useState(false)
  const [loading, setLoading]               = useState(true)
  const [connStatus, setConnStatus]         = useState('untested')
  const [connError, setConnError]           = useState('')

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

  const testConnection = async () => {
    setConnStatus('testing')
    setConnError('')
    try {
      const res = await api.post('loom/test-connection')
      if (res?.success) {
        setConnStatus('connected')
      } else {
        setConnStatus('failed')
        setConnError(res?.error || __('Connection failed', 'wedevs-project-manager'))
      }
    } catch (err) {
      setConnStatus('failed')
      setConnError(err?.message || __('Connection failed', 'wedevs-project-manager'))
    }
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-pm-text flex items-center gap-2">
              <LoomLogo className="w-4 h-4 text-pm-accent" />
              {__('Loom Integration', 'wedevs-project-manager')}
            </h2>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 text-pm-text-muted text-sm py-8 justify-center">
          <span className="w-4 h-4 rounded-full border-2 border-pm-accent border-t-transparent animate-spin" />
          {__('Loading...', 'wedevs-project-manager')}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-pm-text flex items-center gap-2">
            <LoomLogo className="w-4 h-4 text-pm-accent" />
            {__('Loom Integration', 'wedevs-project-manager')}
          </h2>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__('Show Loom video preview cards in descriptions and comments. No API token required — uses oEmbed.', 'wedevs-project-manager')}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-pm-border bg-white">
        {/* Enable Previews */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label>{__('Enable Previews', 'wedevs-project-manager')}</Label>
            <p className="text-xs text-pm-text-muted mt-1">{__('Show Loom video preview cards automatically.', 'wedevs-project-manager')}</p>
          </div>
          <Switch checked={enablePreviews} onCheckedChange={(v) => { setEnablePreviews(v); markDirty() }} />
        </div>

        <div className="border-t border-pm-border" />

        {/* oEmbed Status */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label>{__('oEmbed Status', 'wedevs-project-manager')}</Label>
            <div className="flex items-center gap-2 text-xs mt-1">
              {connStatus === 'untested' && <span className="text-pm-text-muted">{__('Not tested yet', 'wedevs-project-manager')}</span>}
              {connStatus === 'testing' && <><Loader2 className="h-3.5 w-3.5 animate-spin text-pm-accent" /><span className="text-pm-text-muted">{__('Testing...', 'wedevs-project-manager')}</span></>}
              {connStatus === 'connected' && <><CheckCircle className="h-3.5 w-3.5 text-green-600" /><span className="text-green-600 font-medium">{__('oEmbed available', 'wedevs-project-manager')}</span></>}
              {connStatus === 'failed' && <><XCircle className="h-3.5 w-3.5 text-destructive" /><span className="text-destructive">{connError}</span></>}
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={testConnection} disabled={connStatus === 'testing'}>
            {__('Test Connection', 'wedevs-project-manager')}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <Button type="submit" disabled={!isDirty || saving}>
          {saving ? __('Saving...', 'wedevs-project-manager') : __('Save Changes', 'wedevs-project-manager')}
        </Button>
        {isDirty && !saving && (
          <span className="text-xs text-pm-text-muted">{__('You have unsaved changes', 'wedevs-project-manager')}</span>
        )}
      </div>
    </form>
  )
}

export default LoomSettingsTab
