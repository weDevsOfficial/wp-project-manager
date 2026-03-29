/**
 * GitHubSettingsTab — GitHub integration settings (token, enable previews, connection test).
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

// GitHub brand SVG
const GitHubLogo = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

const GitHubSettingsTab = () => {
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

  // Connection test
  const [connStatus, setConnStatus]       = useState('untested')
  const [connError, setConnError]         = useState('')
  const [githubUser, setGithubUser]       = useState('')
  const [rateLimitInfo, setRateLimitInfo] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        // Load token mask
        const tokenRes = await api.get('settings', { key: 'github_access_token' })
        const tokenVal = tokenRes?.data?.[0]?.value ?? tokenRes?.value ?? PM_Vars?.settings?.github_access_token
        if (tokenVal && typeof tokenVal === 'string' && tokenVal.length > 1) {
          setMaskedToken(tokenVal)
          setTokenSaved(true)
        }
        // Load enable_previews
        const prevRes = await api.get('settings', { key: 'github_enable_previews' })
        const prevVal = prevRes?.data?.[0]?.value ?? prevRes?.value ?? PM_Vars?.settings?.github_enable_previews
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
        { key: 'github_enable_previews', value: enablePreviews ? '1' : '0' },
      ]
      if (accessToken.trim()) {
        settings.push({ key: 'github_access_token', value: accessToken.trim() })
      }
      const res = await api.post('settings', { settings })
      // Update PM_Vars
      if (res?.data) {
        res.data.forEach((item) => {
          PM_Vars.settings[item.key] = item.value
          if (item.key === 'github_access_token' && item.value) {
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
      toast.success(__('GitHub settings saved', 'wedevs-project-manager'))
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
      const res = await api.post('github/test-connection', { token })
      if (res?.success) {
        setConnStatus('connected')
        setGithubUser(res.data?.login || '')
        if (res.data?.rate_limit) {
          setRateLimitInfo(`${res.data.rate_limit.remaining}/${res.data.rate_limit.limit} remaining`)
        }
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
              <GitHubLogo className="w-4 h-4 text-pm-accent" />
              {__('GitHub Integration', 'wedevs-project-manager')}
            </h2>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          {[1, 2, 3].map((i) => (
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
            <GitHubLogo className="w-4 h-4 text-pm-accent" />
            {__('GitHub Integration', 'wedevs-project-manager')}
          </h2>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__('Show preview cards for GitHub issue and PR URLs in descriptions and comments.', 'wedevs-project-manager')}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-pm-border bg-white">
        {/* Personal Access Token */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label>{__('Personal Access Token', 'wedevs-project-manager')}</Label>
            <p className="text-xs text-pm-text-muted mt-1">
              {__('Enables private repo access & higher rate limits.', 'wedevs-project-manager')}{' '}
              {tokenSaved && <span className="text-green-600">&check; {__('Saved', 'wedevs-project-manager')}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!editingToken && maskedToken ? (
              <>
                <Input type={showToken ? 'text' : 'password'} value={maskedToken} readOnly className="w-56" />
                <Button type="button" variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setShowToken(!showToken)}>
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-9 shrink-0" onClick={() => { setEditingToken(true); markDirty() }}>
                  {__('Change', 'wedevs-project-manager')}
                </Button>
              </>
            ) : (
              <>
                <Input
                  value={accessToken}
                  onChange={(e) => { setAccessToken(e.target.value); markDirty() }}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-56"
                />
                {editingToken && maskedToken && (
                  <Button type="button" variant="outline" size="sm" className="h-9 shrink-0" onClick={() => { setEditingToken(false); setAccessToken('') }}>
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
            <p className="text-xs text-pm-text-muted mt-1">{__('Show GitHub issue/PR preview cards automatically.', 'wedevs-project-manager')}</p>
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
              {connStatus === 'connected' && (
                <>
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-green-600 font-medium">{__('Connected', 'wedevs-project-manager')}</span>
                  {githubUser && <span className="text-pm-text-muted">{__('as', 'wedevs-project-manager')} <strong>{githubUser}</strong></span>}
                  {rateLimitInfo && <span className="text-pm-text-muted">({rateLimitInfo})</span>}
                </>
              )}
              {connStatus === 'failed' && <><XCircle className="h-3.5 w-3.5 text-destructive" /><span className="text-destructive">{connError}</span></>}
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={testConnection} disabled={connStatus === 'testing'}>
            {__('Test Connection', 'wedevs-project-manager')}
          </Button>
        </div>
      </div>

      <div className="mt-3 px-5 py-2 text-xs text-pm-text-muted">
        <a href="https://github.com/settings/tokens/new?scopes=repo&description=WP%20Project%20Manager" target="_blank" rel="noopener noreferrer" className="text-pm-accent hover:underline">
          {__('Generate a new token on GitHub', 'wedevs-project-manager')}
        </a>{' '}
        ({__('Select "repo" scope for private repository access', 'wedevs-project-manager')})
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

export default GitHubSettingsTab
