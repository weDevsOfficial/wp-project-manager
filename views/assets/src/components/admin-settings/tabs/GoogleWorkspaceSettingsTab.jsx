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

const DOCS_URL = 'https://wedevs.com/docs/wp-project-manager/integrations/google-workspace/'

const GoogleGlyph = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
)

const DriveLogo = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 17L15.2083 11.5L17.4718 7.61972L19.8 11.5L21.4109 14.1848C23.2105 17.1841 21.05 21 17.5521 21H14.3333L13.1667 19L12 17Z" fill="#FECA06"/>
    <path d="M8.79167 11.5L12 17L13.1667 19L14.3333 21H9.66667H6.44786C2.95003 21 0.789527 17.1841 2.58914 14.1848L4.2 11.5H8.79167Z" fill="#3185FF"/>
    <path d="M15.2083 11.5H8.79167H4.2L6.52817 7.61972L8.35566 4.57391C10.0064 1.82272 13.9936 1.82272 15.6443 4.57391L17.4718 7.61972L15.2083 11.5Z" fill="#16BC66"/>
  </svg>
)

/**
 * Free, locked teaser for a Pro Google feature's settings (Calendar/Meet).
 * Pro replaces it by filling the matching slot with real enable + sync toggles.
 */
const LockedSettingCard = ({ title, description }) => {
  const { setOpen } = useProModal()
  return (
    <div
      className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 cursor-pointer hover:border-gray-300"
      onClick={() => setOpen(true)}
    >
      <div>
        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
          {title}
          <ProBadge />
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
      </div>
      <Lock className="h-4 w-4 text-gray-300 shrink-0" />
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
    <div className="max-w-2xl">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <GoogleGlyph className="h-7 w-7 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{__('Google Workspace', 'wedevs-project-manager')}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {__('Set up your Google Cloud project once. Users then connect their own account.', 'wedevs-project-manager')}
            </p>
          </div>
        </div>
        <a
          href={DOCS_URL}
          target="_blank" rel="noreferrer"
          title={__('Setup guide', 'wedevs-project-manager')}
          className="mt-0.5 shrink-0 text-gray-400 hover:text-blue-600"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <DriveLogo className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900">{__('Enable Google Drive', 'wedevs-project-manager')}</div>
              <div className="text-xs text-gray-500 mt-0.5">{__('Show Google Drive in the sidebar and on tasks. Turn off to hide it everywhere.', 'wedevs-project-manager')}</div>
            </div>
          </div>
          <Switch checked={driveEnabled} onCheckedChange={toggleDrive} disabled={settingsLoading} />
        </div>

        {driveEnabled && (
          <div className="mt-4 pl-8 border-t border-gray-100 pt-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-gray-900">{__('Allow Drive in comments', 'wedevs-project-manager')}</div>
              <div className="text-xs text-gray-500 mt-0.5">{__('Let users attach Drive files inside comments. Turn off to hide the Drive button in comments only.', 'wedevs-project-manager')}</div>
            </div>
            <Switch checked={driveComments} onCheckedChange={toggleComments} disabled={settingsLoading} />
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

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">{__('API credentials & keys', 'wedevs-project-manager')}</h3>

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
