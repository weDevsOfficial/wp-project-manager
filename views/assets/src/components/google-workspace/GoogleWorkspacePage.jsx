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
import { fetchStatus, getAuthUrl, disconnect, saveDrivePref } from '@store/googleWorkspaceSlice'
import { Button } from '@components/ui/button'
import { Switch } from '@components/ui/switch'
import { Skeleton } from '@components/ui/skeleton'
import { ShieldCheck, Unlink, HardDrive, Calendar, Video, Settings as SettingsIcon, Crown, Lock, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Slot } from '@hooks/useSlot'
import { useProModal } from '@components/common/ProUpgradeModal'

/**
 * Free card cover for a Pro Google feature section (e.g. Calendar). Pro replaces
 * it by filling the matching slot with the real settings.
 */
const ProFeatureCard = ({ icon: Icon, title, description }) => {
  const { setOpen } = useProModal()
  return (
    <section
      className="rounded-lg border border-gray-200 bg-white p-5 cursor-pointer hover:border-gray-300"
      onClick={() => setOpen(true)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
              {title}
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white rounded-full px-1.5 py-0.5" style={{ background: '#ff9000' }}>
                <Crown className="h-2.5 w-2.5" /> {__('Pro', 'wedevs-project-manager')}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{description}</div>
          </div>
        </div>
        <Lock className="h-4 w-4 text-gray-300 shrink-0" />
      </div>
    </section>
  )
}

const GoogleGlyph = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
)

const DriveLogo = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 17L15.2083 11.5L17.4718 7.61972L19.8 11.5L21.4109 14.1848C23.2105 17.1841 21.05 21 17.5521 21H14.3333L13.1667 19L12 17Z" fill="url(#pmgw_a)"/>
    <path d="M8.79167 11.5L12 17L13.1667 19L14.3333 21H9.66667H6.44786C2.95003 21 0.789527 17.1841 2.58914 14.1848L4.2 11.5H8.79167Z" fill="url(#pmgw_b)"/>
    <path d="M15.2083 11.5H8.79167H4.2L6.52817 7.61972L8.35566 4.57391C10.0064 1.82272 13.9936 1.82272 15.6443 4.57391L17.4718 7.61972L15.2083 11.5Z" fill="url(#pmgw_c)"/>
    <defs>
      <linearGradient id="pmgw_a" x1="15.2651" y1="11.2054" x2="21.5787" y2="18.5942" gradientUnits="userSpaceOnUse"><stop stopColor="#FECA06"/><stop offset="1" stopColor="#FFE31F"/></linearGradient>
      <linearGradient id="pmgw_b" x1="8" y1="18.8492" x2="11.6122" y2="21.1175" gradientUnits="userSpaceOnUse"><stop stopColor="#3185FF"/><stop offset="1" stopColor="#A8A8FE"/></linearGradient>
      <linearGradient id="pmgw_c" x1="10.1707" y1="8.85" x2="5.8286" y2="10.6011" gradientUnits="userSpaceOnUse"><stop stopColor="#16BC66"/><stop offset="1" stopColor="#78C9FF"/></linearGradient>
    </defs>
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

        {status.configured && (
          <p className="mt-3 flex items-start gap-1.5 text-xs text-gray-400">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{__('All Google features — Drive, Calendar and Meet — use this one account. Connecting a different Google account later replaces this one for every feature.', 'wedevs-project-manager')}</span>
          </p>
        )}
      </section>

      {/* Connected services — one card per Google feature. */}
      <h2 className="text-sm font-medium text-gray-900">{__('Connected services', 'wedevs-project-manager')}</h2>

      {/* Google Drive (free) — per-user on/off */}
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <DriveLogo width="20" height="20" />
            <div>
              <div className="text-sm font-medium text-gray-900">{__('Google Drive', 'wedevs-project-manager')}</div>
              <div className="text-xs text-gray-500 mt-0.5">{__('Attach Drive files to tasks, comments, discussions and files.', 'wedevs-project-manager')}</div>
            </div>
          </div>
          <Switch
            checked={!!status.drive_user_on}
            disabled={!status.connected}
            onCheckedChange={v => dispatch(saveDrivePref({ drive_on: v }))}
          />
        </div>
        {!status.connected && (
          <p className="mt-2 pl-8 text-xs text-amber-700">{__('Connect your Google account above to use Drive.', 'wedevs-project-manager')}</p>
        )}
      </section>

      {/* Google Calendar — Pro fills with connect + status; free shows a cover. */}
      <Slot
        name="google.workspace.feature.calendar"
        status={status}
        fallback={<ProFeatureCard icon={Calendar} title={__('Google Calendar', 'wedevs-project-manager')} description={__('Two-way sync task due dates and milestones with Google Calendar.', 'wedevs-project-manager')} />}
      />

      {/* Google Meet — Pro (coming soon); free shows a cover. */}
      <Slot
        name="google.workspace.feature.meet"
        status={status}
        fallback={<ProFeatureCard icon={Video} title={__('Google Meet', 'wedevs-project-manager')} description={__('Generate Meet links for tasks and discussions.', 'wedevs-project-manager')} />}
      />
    </div>
  )
}
