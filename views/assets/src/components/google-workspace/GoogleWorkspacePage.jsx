import { __ } from '@wordpress/i18n'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import {
  fetchStatus, fetchSettings, saveSettings, getAuthUrl, disconnect,
} from '@store/googleWorkspaceSlice'
import { pmHasManageCapability } from '@hooks/usePermissions'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Skeleton } from '@components/ui/skeleton'
import { Copy, Check, ShieldCheck, Link2, Unlink, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

const GoogleGlyph = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
)

export default function GoogleWorkspacePage() {
  const dispatch = useAppDispatch()
  const isManager = pmHasManageCapability()

  const { status, settings, statusLoading, settingsLoading, saving } =
    useAppSelector(s => s.googleWorkspace)

  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [appId, setAppId] = useState('')
  const [copied, setCopied] = useState(false)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const result = params.get('google_connected')
    if (!result) return

    const messages = {
      success:       [__('Google account connected.', 'wedevs-project-manager'), 'success'],
      error:         [__('Could not connect Google account. Try again.', 'wedevs-project-manager'), 'error'],
      denied:        [__('Google connection was cancelled.', 'wedevs-project-manager'), 'error'],
      invalid_state: [__('Security check failed. Please retry.', 'wedevs-project-manager'), 'error'],
    }
    const [msg, type] = messages[result] || []
    if (msg) (type === 'success' ? toast.success : toast.error)(msg)

    params.delete('google_connected')
    const clean = window.location.pathname + (params.toString() ? `?${params}` : '') + window.location.hash
    window.history.replaceState({}, '', clean)
  }, [])

  useEffect(() => {
    dispatch(fetchStatus())
    if (isManager) dispatch(fetchSettings())
  }, [dispatch, isManager])

  useEffect(() => {
    setClientId(settings.client_id || '')
    setApiKey(settings.api_key || '')
    setAppId(settings.app_id || '')
  }, [settings.client_id, settings.api_key, settings.app_id])

  const redirectUri = settings.redirect_uri || (window.PM_Vars?.google_workspace?.redirect_uri ?? '')

  function copyRedirect() {
    navigator.clipboard?.writeText(redirectUri)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  async function onSave(e) {
    e.preventDefault()
    const res = await dispatch(saveSettings({ client_id: clientId, client_secret: clientSecret, api_key: apiKey, app_id: appId }))
    if (saveSettings.fulfilled.match(res)) {
      setClientSecret('')
      toast.success(__('Settings saved.', 'wedevs-project-manager'))
    } else {
      toast.error(res.payload || __('Failed to save settings.', 'wedevs-project-manager'))
    }
  }

  async function onConnect() {
    setConnecting(true)
    const res = await dispatch(getAuthUrl())
    setConnecting(false)
    if (getAuthUrl.fulfilled.match(res) && res.payload) {
      window.location.href = res.payload
    } else {
      toast.error(res.payload || __('Could not start Google connection.', 'wedevs-project-manager'))
    }
  }

  async function onDisconnect() {
    const res = await dispatch(disconnect())
    if (disconnect.fulfilled.match(res)) toast.success(__('Google account disconnected.', 'wedevs-project-manager'))
    else toast.error(res.payload || __('Failed to disconnect.', 'wedevs-project-manager'))
  }

  return (
    <div className="pm-google-workspace max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center gap-3">
        <GoogleGlyph />
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{__('Google Workspace', 'wedevs-project-manager')}</h1>
          <p className="text-sm text-gray-500">{__('Connect Google Drive to attach files to your tasks.', 'wedevs-project-manager')}</p>
        </div>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-gray-400" /> {__('Your connection', 'wedevs-project-manager')}
        </h2>

        {status.expired && (
          <p className="text-sm text-amber-700 bg-amber-50 rounded-md px-3 py-2 mb-3">
            {__('Your Google connection expired (site security keys changed). Please reconnect — your attached files are unaffected.', 'wedevs-project-manager')}
          </p>
        )}

        {statusLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : !status.configured ? (
          <p className="text-sm text-amber-600 bg-amber-50 rounded-md px-3 py-2">
            {__('Google is not configured yet. An administrator must add the Client ID and Secret below.', 'wedevs-project-manager')}
          </p>
        ) : status.connected ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span>{__('Connected as', 'wedevs-project-manager')} <strong>{status.account_email || __('Google account', 'wedevs-project-manager')}</strong></span>
            </div>
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              <Unlink className="h-4 w-4 mr-1.5" /> {__('Disconnect', 'wedevs-project-manager')}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">{__('Connect your Google account to browse and attach Drive files.', 'wedevs-project-manager')}</p>
            <Button size="sm" onClick={onConnect} disabled={connecting}>
              <GoogleGlyph width="16" height="16" /> <span className="ml-1.5">{connecting ? __('Redirecting…', 'wedevs-project-manager') : __('Connect Google', 'wedevs-project-manager')}</span>
            </Button>
          </div>
        )}
      </section>

      {isManager && (
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-base font-medium text-gray-900 mb-1">{__('Google Cloud OAuth credentials', 'wedevs-project-manager')}</h2>
          <p className="text-sm text-gray-500 mb-4">
            {__('Create an OAuth 2.0 Web client in Google Cloud Console, then paste the credentials here.', 'wedevs-project-manager')}
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{__('Authorized redirect URI', 'wedevs-project-manager')}</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-3 py-2 break-all">{redirectUri}</code>
              <Button type="button" variant="outline" size="sm" onClick={copyRedirect}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1">{__('Add this exact URI to your Google OAuth client.', 'wedevs-project-manager')}</p>
          </div>

          {settingsLoading ? (
            <Skeleton className="h-24 w-full" />
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
              {!settings.picker_ready && (settings.client_id || apiKey) && (
                <p className="text-xs text-amber-600">{__('Drive attach needs all four: Client ID, Secret, API key, and App ID.', 'wedevs-project-manager')}</p>
              )}
              <div className="flex items-center gap-3">
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
        </section>
      )}
    </div>
  )
}
