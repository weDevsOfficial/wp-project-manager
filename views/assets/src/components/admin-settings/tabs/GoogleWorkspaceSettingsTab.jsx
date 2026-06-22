import { __ } from '@wordpress/i18n'
/**
 * GoogleWorkspaceSettingsTab — admin, one-time setup of the site-level Google
 * Cloud OAuth credentials + Picker keys. Shared by all Google Workspace
 * features (Drive now; Calendar/Meet later). Per-user account connection lives
 * on the separate Google Workspace page, not here.
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchSettings, saveSettings } from '@store/googleWorkspaceSlice'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Switch } from '@components/ui/switch'
import { Skeleton } from '@components/ui/skeleton'
import { Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react'
import { useToast } from '@hooks/useToast'

export default function GoogleWorkspaceSettingsTab() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { settings, settingsLoading, saving } = useAppSelector(s => s.googleWorkspace)

  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [appId, setAppId] = useState('')
  const [driveEnabled, setDriveEnabled] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { dispatch(fetchSettings()) }, [dispatch])

  useEffect(() => {
    setClientId(settings.client_id || '')
    setApiKey(settings.api_key || '')
    setAppId(settings.app_id || '')
    setDriveEnabled(!!settings.drive_enabled)
  }, [settings.client_id, settings.api_key, settings.app_id, settings.drive_enabled])

  const redirectUri = settings.redirect_uri || (window.PM_Vars?.google_workspace?.redirect_uri ?? '')

  function copyRedirect() {
    navigator.clipboard?.writeText(redirectUri)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  async function toggleDrive(v) {
    setDriveEnabled(v)
    const res = await dispatch(saveSettings({ client_id: clientId, client_secret: '', api_key: apiKey, app_id: appId, drive_enabled: v }))
    if (saveSettings.fulfilled.match(res)) {
      toast.success(v ? __('Google Drive enabled.', 'wedevs-project-manager') : __('Google Drive disabled.', 'wedevs-project-manager'))
    } else {
      setDriveEnabled(!v)
      toast.error(res.payload || __('Failed to update.', 'wedevs-project-manager'))
    }
  }

  async function onSave(e) {
    e.preventDefault()
    const res = await dispatch(saveSettings({ client_id: clientId, client_secret: clientSecret, api_key: apiKey, app_id: appId, drive_enabled: driveEnabled }))
    if (saveSettings.fulfilled.match(res)) {
      setClientSecret('')
      toast.success(__('Google Workspace settings saved.', 'wedevs-project-manager'))
    } else {
      toast.error(res.payload || __('Failed to save settings.', 'wedevs-project-manager'))
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">{__('Google Workspace', 'wedevs-project-manager')}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {__('Connect your Google Cloud project once. These credentials power all Google Workspace features (Drive now; Calendar and Meet coming soon). Each user then connects their own Google account from the Google Workspace page.', 'wedevs-project-manager')}
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <div className="text-sm font-medium text-gray-900">{__('Enable Google Drive', 'wedevs-project-manager')}</div>
          <div className="text-xs text-gray-500 mt-0.5">{__('Show Google Drive in the sidebar and on tasks. Turn off to hide it everywhere.', 'wedevs-project-manager')}</div>
        </div>
        <Switch checked={driveEnabled} onCheckedChange={toggleDrive} disabled={settingsLoading} />
      </div>

      {settings.picker_ready && driveEnabled && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-md px-3 py-2">
          <ShieldCheck className="h-4 w-4" /> {__('Google Workspace is configured. Users can now connect their accounts.', 'wedevs-project-manager')}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{__('Authorized redirect URI', 'wedevs-project-manager')}</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-3 py-2 break-all">{redirectUri}</code>
            <Button type="button" variant="outline" size="sm" onClick={copyRedirect}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-1">{__('Add this exact URI to your Google OAuth client (Web application).', 'wedevs-project-manager')}</p>
        </div>

        {settingsLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <form onSubmit={onSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{__('Client ID', 'wedevs-project-manager')}</label>
              <Input value={clientId} onChange={e => setClientId(e.target.value)} placeholder="xxxxxxxx.apps.googleusercontent.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{__('Client Secret', 'wedevs-project-manager')}</label>
              <Input
                type="password"
                value={clientSecret}
                onChange={e => setClientSecret(e.target.value)}
                placeholder={settings.has_secret ? '••••••••••••  (' + __('saved — leave blank to keep', 'wedevs-project-manager') + ')' : 'GOCSPX-…'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{__('API Key', 'wedevs-project-manager')}</label>
              <Input value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="AIza…" />
              <p className="text-xs text-gray-400 mt-1">{__('Used by the Google Picker. Create under Credentials → API key, and enable the Picker API.', 'wedevs-project-manager')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{__('App ID (project number)', 'wedevs-project-manager')}</label>
              <Input value={appId} onChange={e => setAppId(e.target.value)} placeholder="123456789012" />
              <p className="text-xs text-gray-400 mt-1">{__('Your Google Cloud project number (Dashboard → Project info).', 'wedevs-project-manager')}</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" disabled={saving}>{saving ? __('Saving…', 'wedevs-project-manager') : __('Save credentials', 'wedevs-project-manager')}</Button>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank" rel="noreferrer"
                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                {__('Open Google Cloud Console', 'wedevs-project-manager')} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
