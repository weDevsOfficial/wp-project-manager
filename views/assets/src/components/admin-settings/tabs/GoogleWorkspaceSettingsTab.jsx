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
import { Copy, Check, ExternalLink, ShieldCheck, Lock } from 'lucide-react'
import { useToast } from '@hooks/useToast'
import { Slot } from '@hooks/useSlot'
import { useProModal } from '@components/common/ProUpgradeModal'
import ProBadge from '@components/common/ProBadge'
import { GoogleMonoGlyph } from '@components/google-workspace/GoogleIcons'

const DOCS_URL = 'https://wedevs.com/docs/wp-project-manager/integrations/google-workspace/'

/**
 * Free, locked teaser for a Pro Google feature's settings (Calendar/Meet).
 * Pro replaces it by filling the matching slot with real enable + sync toggles.
 */
const LockedSettingCard = ({ title, description }) => {
  const { setOpen } = useProModal()
  return (
    <div
      className="mb-4 flex items-center justify-between rounded-lg border border-pm-border bg-pm-surface p-4 cursor-pointer hover:border-pm-border"
      onClick={() => setOpen(true)}
    >
      <div>
        <div className="text-lg font-semibold text-pm-text-primary flex items-center gap-2">
          {title}
          <ProBadge />
        </div>
        <div className="text-xs text-pm-text-muted mt-0.5">{description}</div>
      </div>
      <Lock className="h-4 w-4 text-pm-text-muted shrink-0" />
    </div>
  )
}

export default function GoogleWorkspaceSettingsTab() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { settings, settingsLoading, saving } = useAppSelector(s => s.googleWorkspace)

  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [appId, setAppId] = useState('')
  const [driveEnabled, setDriveEnabled] = useState(false)
  const [driveComments, setDriveComments] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => { dispatch(fetchSettings()) }, [dispatch])

  useEffect(() => {
    setClientId(settings.client_id || '')
    setApiKey(settings.api_key || '')
    setAppId(settings.app_id || '')
    setDriveEnabled(!!settings.drive_enabled)
    setDriveComments(settings.drive_comments === undefined ? true : !!settings.drive_comments)
  }, [settings.client_id, settings.api_key, settings.app_id, settings.drive_enabled, settings.drive_comments])

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

  async function toggleComments(v) {
    setDriveComments(v)
    const res = await dispatch(saveSettings({ client_id: clientId, client_secret: '', api_key: apiKey, app_id: appId, drive_enabled: driveEnabled, drive_comments: v }))
    if (saveSettings.fulfilled.match(res)) {
      toast.success(v ? __('Drive in comments enabled.', 'wedevs-project-manager') : __('Drive in comments disabled.', 'wedevs-project-manager'))
    } else {
      setDriveComments(!v)
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
    <div className="w-full">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-pm-text-primary flex items-center gap-2">
            <GoogleMonoGlyph className="h-5 w-5 text-pm-accent" />
            {__('Google Workspace', 'wedevs-project-manager')}
          </h2>
          <p className="text-xs text-pm-text-muted mt-1">
            {__('Set up your Google Cloud project once. Users then connect their own account.', 'wedevs-project-manager')}
          </p>
        </div>
        <a
          href={DOCS_URL}
          target="_blank" rel="noreferrer"
          title={__('Setup guide', 'wedevs-project-manager')}
          className="mt-0.5 shrink-0 text-pm-text-muted hover:text-blue-600"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="mb-4 rounded-lg border border-pm-border bg-pm-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-pm-text-primary">{__('Enable Google Drive', 'wedevs-project-manager')}</div>
            <div className="text-xs text-pm-text-muted mt-0.5">{__('Show Google Drive in the sidebar and on tasks. Turn off to hide it everywhere.', 'wedevs-project-manager')}</div>
          </div>
          <Switch aria-label={__('Show Google Drive in the sidebar and on tasks. Turn off to hide it everywhere.', 'wedevs-project-manager')} checked={driveEnabled} onCheckedChange={toggleDrive} disabled={settingsLoading} />
        </div>

        {driveEnabled && (
          <div className="mt-4 pl-8 border-t border-pm-border pt-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-pm-text-primary">{__('Allow Drive in comments', 'wedevs-project-manager')}</div>
              <div className="text-xs text-pm-text-muted mt-0.5">{__('Let team members attach Drive files inside comments. Turn off to hide the Drive button in comments only.', 'wedevs-project-manager')}</div>
            </div>
            <Switch aria-label={__('Let team members attach Drive files inside comments. Turn off to hide the Drive button in comments only.', 'wedevs-project-manager')} checked={driveComments} onCheckedChange={toggleComments} disabled={settingsLoading} />
          </div>
        )}
      </div>

      <Slot
        name="google.workspace.settings.calendar"
        settings={settings}
        fallback={<LockedSettingCard title={__('Google Calendar sync', 'wedevs-project-manager')} description={__('Two-way sync of task due dates and milestones with Google Calendar.', 'wedevs-project-manager')} />}
      />
      <Slot
        name="google.workspace.settings.meet"
        settings={settings}
        fallback={<LockedSettingCard title={__('Google Meet', 'wedevs-project-manager')} description={__('Generate Google Meet links on tasks and discussions.', 'wedevs-project-manager')} />}
      />

      {settings.picker_ready && driveEnabled && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-md px-3 py-2">
          <ShieldCheck className="h-4 w-4" /> {__('Google Workspace is configured. Users can now connect their accounts.', 'wedevs-project-manager')}
        </div>
      )}

      <h3 className="text-sm font-medium text-pm-text-primary mt-6 mb-2">{__('API credentials & keys', 'wedevs-project-manager')}</h3>

      <div className="rounded-lg border border-pm-border bg-pm-surface p-5">
        <div className="mb-4">
          <label className="block text-sm font-medium text-pm-text-primary mb-1">{__('Authorized redirect URI', 'wedevs-project-manager')}</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-pm-surface-muted border border-pm-border rounded px-3 py-2 break-all">{redirectUri}</code>
            <Button className="h-11 px-5" type="button" variant="outline" size="sm" onClick={copyRedirect}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-pm-text-muted mt-1">{__('Add this exact URI to your Google OAuth client (Web application).', 'wedevs-project-manager')}</p>
        </div>

        {settingsLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <form onSubmit={onSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pm-text-primary mb-1">{__('Client ID', 'wedevs-project-manager')}</label>
              <Input value={clientId} onChange={e => setClientId(e.target.value)} placeholder="xxxxxxxx.apps.googleusercontent.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-pm-text-primary mb-1">{__('Client Secret', 'wedevs-project-manager')}</label>
              <Input
                type="password"
                value={clientSecret}
                onChange={e => setClientSecret(e.target.value)}
                placeholder={settings.has_secret ? '••••••••••••  (' + __('saved — leave blank to keep', 'wedevs-project-manager') + ')' : 'GOCSPX-…'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pm-text-primary mb-1">{__('API Key', 'wedevs-project-manager')}</label>
              <Input value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="AIza…" />
              <p className="text-xs text-pm-text-muted mt-1">{__('Used by the Google Picker. Create under Credentials → API key, and enable the Picker API.', 'wedevs-project-manager')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-pm-text-primary mb-1">{__('App ID (project number)', 'wedevs-project-manager')}</label>
              <Input value={appId} onChange={e => setAppId(e.target.value)} placeholder="123456789012" />
              <p className="text-xs text-pm-text-muted mt-1">{__('Your Google Cloud project number (Dashboard → Project info).', 'wedevs-project-manager')}</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button className="h-11 px-5" type="submit" disabled={saving}>{saving ? __('Saving…', 'wedevs-project-manager') : __('Save credentials', 'wedevs-project-manager')}</Button>
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
