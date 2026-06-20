import { __ } from '@wordpress/i18n'
/**
 * GoogleWorkspacePage — per-user account connection (every user, incl. admin,
 * connects their own Google account here). One connection powers all Google
 * Workspace features (Drive now; Calendar/Meet later).
 *
 * Admin credential setup lives separately under Settings → Google Workspace.
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchStatus, getAuthUrl, disconnect } from '@store/googleWorkspaceSlice'
import { Button } from '@components/ui/button'
import { Skeleton } from '@components/ui/skeleton'
import { ShieldCheck, Unlink, HardDrive, Calendar, Video, Settings as SettingsIcon } from 'lucide-react'
import { toast } from 'sonner'

const GoogleGlyph = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
)

const DriveLogo = (props) => (
  <svg viewBox="0 0 87.3 78" {...props}>
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.79 1.35-1.2 2.9-1.2 4.5h27.5z" fill="#00ac47"/>
    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.6-.4-3.15-1.2-4.5z" fill="#ffba00"/>
  </svg>
)

export default function GoogleWorkspacePage() {
  const dispatch = useAppDispatch()
  const { status, statusLoading } = useAppSelector(s => s.googleWorkspace)
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

  useEffect(() => { dispatch(fetchStatus()) }, [dispatch])

  async function onConnect() {
    setConnecting(true)
    const res = await dispatch(getAuthUrl())
    setConnecting(false)
    if (getAuthUrl.fulfilled.match(res) && res.payload) window.location.href = res.payload
    else toast.error(res.payload || __('Could not start Google connection.', 'wedevs-project-manager'))
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
          <p className="text-sm text-gray-500">{__('Connect your Google account to use Google features inside Project Manager.', 'wedevs-project-manager')}</p>
        </div>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        {status.expired && (
          <p className="text-sm text-amber-700 bg-amber-50 rounded-md px-3 py-2 mb-3">
            {__('Your Google connection expired (site security keys changed). Please reconnect — your attached files are unaffected.', 'wedevs-project-manager')}
          </p>
        )}

        {statusLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : !status.configured ? (
          <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-md px-3 py-2.5">
            <SettingsIcon className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{__('Google Workspace isn’t set up yet. An administrator needs to add the credentials under Settings → Google Workspace.', 'wedevs-project-manager')}</span>
          </div>
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
            <p className="text-sm text-gray-600">{__('Connect your Google account to browse and attach Drive files to tasks.', 'wedevs-project-manager')}</p>
            <Button size="sm" onClick={onConnect} disabled={connecting}>
              <GoogleGlyph width="16" height="16" /> <span className="ml-1.5">{connecting ? __('Redirecting…', 'wedevs-project-manager') : __('Connect Google', 'wedevs-project-manager')}</span>
            </Button>
          </div>
        )}
      </section>

      {/* Features overview — grows as Calendar/Meet land. */}
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-3">{__('Features', 'wedevs-project-manager')}</h2>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <DriveLogo width="18" height="18" />
            <div className="flex-1">
              <div className="text-sm text-gray-800">{__('Google Drive', 'wedevs-project-manager')}</div>
              <div className="text-xs text-gray-500">{__('Browse and attach Drive files to tasks.', 'wedevs-project-manager')}</div>
            </div>
            <span className="text-[11px] font-medium text-green-700 bg-green-50 rounded-full px-2 py-0.5">{__('Available', 'wedevs-project-manager')}</span>
          </li>
          <li className="flex items-center gap-3 opacity-60">
            <Calendar className="h-[18px] w-[18px] text-gray-400" />
            <div className="flex-1">
              <div className="text-sm text-gray-800">{__('Google Calendar', 'wedevs-project-manager')}</div>
              <div className="text-xs text-gray-500">{__('Create calendar events from tasks.', 'wedevs-project-manager')}</div>
            </div>
            <span className="text-[11px] font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">{__('Coming soon', 'wedevs-project-manager')}</span>
          </li>
          <li className="flex items-center gap-3 opacity-60">
            <Video className="h-[18px] w-[18px] text-gray-400" />
            <div className="flex-1">
              <div className="text-sm text-gray-800">{__('Google Meet', 'wedevs-project-manager')}</div>
              <div className="text-xs text-gray-500">{__('Generate Meet links for tasks.', 'wedevs-project-manager')}</div>
            </div>
            <span className="text-[11px] font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">{__('Coming soon', 'wedevs-project-manager')}</span>
          </li>
        </ul>
      </section>
    </div>
  )
}
