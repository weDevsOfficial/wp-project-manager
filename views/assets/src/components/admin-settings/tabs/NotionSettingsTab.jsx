/**
 * NotionSettingsTab — Notion integration settings (token, enable previews, connection test).
 * Uses the general PM settings API (POST /pm/v2/settings) — same as Vue version.
 */
import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Switch } from '@components/ui/switch'
import { Label } from '@components/ui/label'
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from 'lucide-react'

// Notion brand "N" logo SVG
const NotionLogo = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L2.451 2.577c-.466.046-.56.28-.374.466l2.382 1.165zM5.251 7.26v13.932c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V7.307c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.747.327-.747.933zm14.336.42c.094.42 0 .84-.42.886l-.7.14v10.264c-.607.327-1.167.514-1.634.514-.747 0-.933-.234-1.494-.933l-4.577-7.186v6.953l1.447.327s0 .84-1.167.84l-3.22.187c-.093-.187 0-.653.327-.747l.84-.22V9.854L7.822 9.76c-.094-.42.14-1.027.747-1.073l3.454-.234 4.764 7.28V9.527l-1.214-.14c-.093-.513.28-.886.747-.933l3.267-.187z" />
  </svg>
)

const NotionSettingsTab = () => {
  const api   = useApi()
  const { __ } = useI18n()
  const toast  = useToast()

  const [accessToken, setAccessToken]       = useState('')
  const [maskedToken, setMaskedToken]       = useState('')
  const [enablePreviews, setEnablePreviews] = useState(true)
  const [editingToken, setEditingToken]     = useState(false)
  const [showToken, setShowToken]           = useState(false)
  const [tokenSaved, setTokenSaved]         = useState(false)
  const [saving, setSaving]                 = useState(false)
  const [isDirty, setIsDirty]               = useState(false)
  const [loading, setLoading]               = useState(true)
  const [connStatus, setConnStatus]         = useState('untested')
  const [connError, setConnError]           = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const tokenRes = await api.get('settings', { key: 'notion_access_token' })
        const tokenVal = tokenRes?.data?.[0]?.value ?? tokenRes?.value ?? PM_Vars?.settings?.notion_access_token
        if (tokenVal && typeof tokenVal === 'string' && tokenVal.length > 1) {
          setMaskedToken(tokenVal)
          setTokenSaved(true)
        }
        const prevRes = await api.get('settings', { key: 'notion_enable_previews' })
        const prevVal = prevRes?.data?.[0]?.value ?? prevRes?.value ?? PM_Vars?.settings?.notion_enable_previews
        if (prevVal !== undefined) {
          setEnablePreviews(prevVal !== false && prevVal !== 'false' && prevVal !== '0' && prevVal !== 0)
        }
      } catch { /* first time — no settings yet */ }
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const markDirty = useCallback(() => setIsDirty(true), [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const settings = [
        { key: 'notion_enable_previews', value: enablePreviews ? '1' : '0' },
      ]
      if (accessToken.trim()) {
        settings.push({ key: 'notion_access_token', value: accessToken.trim() })
      }
      const res = await api.post('settings', { settings })
      if (res?.data) {
        res.data.forEach((item) => {
          PM_Vars.settings[item.key] = item.value
          if (item.key === 'notion_access_token' && item.value) {
            setTokenSaved(true)
            if (typeof item.value === 'string' && item.value.length > 1) {
              setMaskedToken(item.value)
            }
          }
        })
      }
      if (accessToken.trim()) {
        setAccessToken('')
        setEditingToken(false)
      }
      setIsDirty(false)
      toast.success(__('Notion settings saved', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err?.message ?? __('Failed to save settings', 'wedevs-project-manager'))
    }
    setSaving(false)
  }

  const testConnection = async () => {
    setConnStatus('testing')
    setConnError('')
    try {
      const token = (accessToken && accessToken.trim()) ? accessToken.trim() : '__saved__'
      const res = await api.post('notion/test-connection', { token })
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
              <NotionLogo className="w-4 h-4 text-pm-accent" />
              {__('Notion Integration', 'wedevs-project-manager')}
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
            <NotionLogo className="w-4 h-4 text-pm-accent" />
            {__('Notion Integration', 'wedevs-project-manager')}
          </h2>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__('Show preview cards for Notion page URLs in descriptions and comments.', 'wedevs-project-manager')}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-pm-border bg-white">
        {/* Integration Token */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label>{__('Internal Integration Token', 'wedevs-project-manager')}</Label>
            <p className="text-xs text-pm-text-muted mt-1">
              {__('Create an integration in your Notion workspace.', 'wedevs-project-manager')}{' '}
              {tokenSaved && <span className="text-green-600">&check; {__('Saved', 'wedevs-project-manager')}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2 max-w-sm">
            {!editingToken && maskedToken ? (
              <>
                <Input value={showToken ? maskedToken : '••••••••••••••••'} readOnly className="bg-muted/30 text-pm-text-muted" />
                <Button type="button" variant="outline" size="sm" onClick={() => setShowToken(!showToken)}>
                  {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => { setEditingToken(true); markDirty() }}>
                  {__('Change', 'wedevs-project-manager')}
                </Button>
              </>
            ) : (
              <>
                <Input
                  value={accessToken}
                  onChange={(e) => { setAccessToken(e.target.value); markDirty() }}
                  placeholder="secret_xxxxxxxxxxxx"
                  className="max-w-sm"
                />
                {editingToken && maskedToken && (
                  <Button type="button" variant="outline" size="sm" onClick={() => { setEditingToken(false); setAccessToken('') }}>
                    {__('Cancel', 'wedevs-project-manager')}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="border-t border-pm-border" />

        {/* Enable Previews */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label>{__('Enable Previews', 'wedevs-project-manager')}</Label>
            <p className="text-xs text-pm-text-muted mt-1">{__('Show Notion page preview cards automatically.', 'wedevs-project-manager')}</p>
          </div>
          <Switch checked={enablePreviews} onCheckedChange={(v) => { setEnablePreviews(v); markDirty() }} />
        </div>

        <div className="border-t border-pm-border" />

        {/* Connection Status */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label>{__('Connection Status', 'wedevs-project-manager')}</Label>
            <div className="flex items-center gap-2 text-xs mt-1">
              {connStatus === 'untested' && <span className="text-pm-text-muted">{__('Not tested yet', 'wedevs-project-manager')}</span>}
              {connStatus === 'testing' && <><Loader2 className="h-3.5 w-3.5 animate-spin text-pm-accent" /><span className="text-pm-text-muted">{__('Testing...', 'wedevs-project-manager')}</span></>}
              {connStatus === 'connected' && <><CheckCircle className="h-3.5 w-3.5 text-green-600" /><span className="text-green-600 font-medium">{__('Connected', 'wedevs-project-manager')}</span></>}
              {connStatus === 'failed' && <><XCircle className="h-3.5 w-3.5 text-destructive" /><span className="text-destructive">{connError}</span></>}
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={testConnection} disabled={connStatus === 'testing'}>
            {__('Test Connection', 'wedevs-project-manager')}
          </Button>
        </div>
      </div>

      <div className="mt-3 px-5 py-2 text-xs text-pm-text-muted">
        <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-pm-accent hover:underline">
          {__('Create a Notion integration', 'wedevs-project-manager')}
        </a>
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

export default NotionSettingsTab
