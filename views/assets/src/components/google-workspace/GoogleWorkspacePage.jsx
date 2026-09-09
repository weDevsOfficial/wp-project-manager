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
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@components/ui/alert-dialog'
import { ShieldCheck, Unlink, HardDrive, Settings as SettingsIcon, Lock, Info } from 'lucide-react'
import { CalendarGlyph, MeetGlyph, GoogleColorGlyph, GoogleDriveColorGlyph } from '@components/google-workspace/GoogleIcons'
import ProBadge from '@components/common/ProBadge'
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
      className="rounded-lg border border-pm-border bg-pm-surface p-5 cursor-pointer hover:border-pm-border"
      onClick={() => setOpen(true)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-pm-text-muted mt-0.5" />
          <div>
            <div className="text-sm font-medium text-pm-text-primary flex items-center gap-2">
              {title}
              <ProBadge />
            </div>
            <div className="text-xs text-pm-text-muted mt-0.5">{description}</div>
          </div>
        </div>
        <Lock className="h-4 w-4 text-pm-text-muted shrink-0" />
      </div>
    </section>
  )
}

export default function GoogleWorkspacePage() {
  const dispatch = useAppDispatch()
  const { status, statusLoading } = useAppSelector(s => s.googleWorkspace)
  const [connecting, setConnecting] = useState(false)
  const [disconnectOpen, setDisconnectOpen] = useState(false)

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
        <GoogleColorGlyph />
        <div>
          <h1 className="text-xl font-semibold text-pm-text-primary">{__('Google Workspace', 'wedevs-project-manager')}</h1>
          <p className="text-sm text-pm-text-muted">{__('Connect your Google account to use Google features inside Project Manager.', 'wedevs-project-manager')}</p>
        </div>
      </header>

      <section className="rounded-lg border border-pm-border bg-pm-surface p-5">
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
            <div className="flex items-center gap-2 text-sm text-pm-text-primary">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span>{__('Connected as', 'wedevs-project-manager')} <strong>{status.account_email || __('Google account', 'wedevs-project-manager')}</strong></span>
            </div>
            <Button className="h-11 px-5" variant="outline" size="sm" onClick={() => setDisconnectOpen(true)}>
              <Unlink className="h-4 w-4 mr-1.5" /> {__('Disconnect', 'wedevs-project-manager')}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-pm-text-muted">{__('Connect your Google account to browse and attach Drive files to tasks.', 'wedevs-project-manager')}</p>
            <Button className="h-11 px-5" size="sm" onClick={onConnect} disabled={connecting}>
              <GoogleColorGlyph width="16" height="16" /> <span className="ml-1.5">{connecting ? __('Redirecting…', 'wedevs-project-manager') : __('Connect Google', 'wedevs-project-manager')}</span>
            </Button>
          </div>
        )}

        {status.configured && (
          <p className="mt-3 flex items-start gap-1.5 text-xs text-pm-text-muted">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{__('All Google features — Drive, Calendar and Meet — use this one account.', 'wedevs-project-manager')}</span>
          </p>
        )}
      </section>

      {/* Connected services — one card per Google feature. */}
      <h2 className="text-sm font-medium text-pm-text-primary">{__('Connected services', 'wedevs-project-manager')}</h2>

      {/* Google Drive (free) — admin master gate + per-user on/off */}
      <section className={`rounded-lg border border-pm-border bg-pm-surface p-5${!status.drive_enabled ? ' opacity-70' : ''}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <GoogleDriveColorGlyph width="20" height="20" />
            <div>
              <div className="text-sm font-medium text-pm-text-primary">{__('Google Drive', 'wedevs-project-manager')}</div>
              <div className="text-xs text-pm-text-muted mt-0.5">{__('Attach Drive files to tasks, comments, discussions and files.', 'wedevs-project-manager')}</div>
            </div>
          </div>
          {status.drive_enabled ? (
            <Switch
              checked={!!status.connected && !!status.drive_user_on}
              disabled={!status.connected}
              onCheckedChange={async v => {
                const res = await dispatch(saveDrivePref({ drive_on: v }))
                if (saveDrivePref.fulfilled.match(res)) {
                  toast.success(v ? __('Google Drive enabled.', 'wedevs-project-manager') : __('Google Drive disabled.', 'wedevs-project-manager'))
                } else {
                  toast.error(__('Failed to update Drive setting.', 'wedevs-project-manager'))
                }
              }}
            />
          ) : (
            <span className="text-[11px] font-medium text-pm-text-muted bg-pm-surface-muted rounded-md px-2 py-0.5">{__('Off', 'wedevs-project-manager')}</span>
          )}
        </div>
        {!status.drive_enabled ? (
          <p className="mt-2 pl-8 text-xs text-pm-text-muted">{__('Drive is turned off. An administrator can enable it in Settings → Google Workspace.', 'wedevs-project-manager')}</p>
        ) : !status.connected ? (
          <p className="mt-2 pl-8 text-xs text-amber-700">{__('Connect your Google account above to use Drive.', 'wedevs-project-manager')}</p>
        ) : null}
      </section>

      {/* Google Calendar — Pro fills with connect + status; free shows a cover. */}
      <Slot
        name="google.workspace.feature.calendar"
        status={status}
        fallback={<ProFeatureCard icon={CalendarGlyph} title={__('Google Calendar', 'wedevs-project-manager')} description={__('Two-way sync task due dates and milestones with Google Calendar.', 'wedevs-project-manager')} />}
      />

      {/* Google Meet — Pro (coming soon); free shows a cover. */}
      <Slot
        name="google.workspace.feature.meet"
        status={status}
        fallback={<ProFeatureCard icon={MeetGlyph} title={__('Google Meet', 'wedevs-project-manager')} description={__('Generate Meet links for tasks and discussions.', 'wedevs-project-manager')} />}
      />

      <AlertDialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
        <AlertDialogContent className="sm:max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{__('Disconnect this Google account?', 'wedevs-project-manager')}</AlertDialogTitle>
            <AlertDialogDescription>
              {__('This unlinks your Google account from Project Manager. Here’s what happens:', 'wedevs-project-manager')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ul className="space-y-2 text-sm text-pm-text-muted list-disc pl-5">
            <li>{__('Calendar events created from your tasks and milestones are removed from Google Calendar.', 'wedevs-project-manager')}</li>
            <li>{__('Drive files you attached stay listed, but you can’t open or attach more until you reconnect.', 'wedevs-project-manager')}</li>
            <li>{__('All Google features (Drive, Calendar, Meet) stop working for you until you reconnect.', 'wedevs-project-manager')}</li>
            <li>{__('You can reconnect anytime — your data isn’t deleted.', 'wedevs-project-manager')}</li>
          </ul>
          <AlertDialogFooter>
            <AlertDialogCancel>{__('Cancel', 'wedevs-project-manager')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setDisconnectOpen(false); onDisconnect() }}>
              {__('Disconnect', 'wedevs-project-manager')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
