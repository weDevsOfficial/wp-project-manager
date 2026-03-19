import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Switch } from '@components/ui/switch'
import { Checkbox } from '@components/ui/checkbox'
import { Card } from '@components/ui/card'
import { Label } from '@components/ui/label'
import { Copy, Slack, Github } from 'lucide-react'

const SLACK_OPTIONS = [
  { key: 'task_create',       label: 'Task Created' },
  { key: 'task_update',       label: 'Task Updated' },
  { key: 'task_complete',     label: 'Task Completed' },
  { key: 'task_incomplete',   label: 'Task Incomplete' },
  { key: 'comment_create',    label: 'Comment Created' },
  { key: 'comment_update',    label: 'Comment Updated' },
]

const IntegrationsTab = ({ projectId }) => {
  const api   = useApi()
  const { __ } = useI18n()
  const toast = useToast()

  const [loading, setLoading] = useState(true)

  // Slack state
  const [slackEnabled, setSlackEnabled] = useState(false)
  const [slackWebhook, setSlackWebhook] = useState('')
  const [slackOptions, setSlackOptions] = useState(() =>
    SLACK_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.key]: false }), {})
  )
  const [slackSaving, setSlackSaving] = useState(false)

  // GitHub/Bitbucket state
  const [gitEnabled, setGitEnabled]     = useState(false)
  const [gitWebhookUrl, setGitWebhookUrl] = useState('')
  const [userMappings, setUserMappings] = useState([])
  const [newWpUser, setNewWpUser]       = useState('')
  const [newGitUser, setNewGitUser]     = useState('')
  const [gitSaving, setGitSaving]       = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchSettings = async () => {
      try {
        const res = await api.get(`projects/${projectId}`)
        if (cancelled) return

        const project = res?.data ?? res
        if (project?.slack) {
          setSlackEnabled(project.slack.status === 'enable' || project.slack.status === true)
          setSlackWebhook(project.slack.webhook ?? '')
          if (project.slack.options) {
            setSlackOptions((prev) => ({ ...prev, ...project.slack.options }))
          }
        }

        if (project?.git_bit) {
          setGitEnabled(project.git_bit.status === 'enable' || project.git_bit.status === true)
          setGitWebhookUrl(project.git_bit.webhook_url ?? '')
        }
      } catch (err) {
        if (!cancelled && err?.status !== 404 && err?.response?.status !== 404) {
          toast.error(__('Failed to load integration settings', 'wedevs-project-manager'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSettings()
    return () => { cancelled = true }
  }, [projectId])

  const toggleSlackOption = useCallback((key) => {
    setSlackOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const handleSlackSave = async () => {
    setSlackSaving(true)
    try {
      await api.post(`projects/${projectId}/settings`, {
        settings: [{
          key: 'slack',
          value: {
            status:  slackEnabled ? 'enable' : 'disable',
            webhook: slackWebhook,
            options: slackOptions,
          },
        }],
      })
      toast.success(__('Slack settings saved', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err?.message ?? __('Failed to save Slack settings', 'wedevs-project-manager'))
    } finally {
      setSlackSaving(false)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(__('Copied to clipboard', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to copy', 'wedevs-project-manager'))
    }
  }

  const addUserMapping = () => {
    if (!newWpUser.trim() || !newGitUser.trim()) return
    setUserMappings((prev) => [
      ...prev,
      { wp_user: newWpUser.trim(), git_user: newGitUser.trim() },
    ])
    setNewWpUser('')
    setNewGitUser('')
  }

  const removeUserMapping = (index) => {
    setUserMappings((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGitSave = async () => {
    setGitSaving(true)
    try {
      await api.post('save_users_map_name', {
        project_id: projectId,
        status:     gitEnabled ? 'enable' : 'disable',
        mappings:   userMappings,
      })
      toast.success(__('Git settings saved', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err?.message ?? __('Failed to save Git settings', 'wedevs-project-manager'))
    } finally {
      setGitSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-pm-text-muted text-sm py-16 justify-center">
        <span className="w-4 h-4 rounded-full border-2 border-pm-accent border-t-transparent animate-spin" />
        {__('Loading...', 'wedevs-project-manager')}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-pm-text mb-1">
        {__('Integrations', 'wedevs-project-manager')}
      </h2>
      <p className="text-sm text-pm-text-muted mb-5">
        {__('Connect third-party services to this project.', 'wedevs-project-manager')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Slack Card ────────────────────────────────────── */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Slack className="w-5 h-5 text-pm-text" />
            <h3 className="text-sm font-semibold text-pm-text flex-1">
              {__('Slack', 'wedevs-project-manager')}
            </h3>
            <Switch
              checked={slackEnabled}
              onCheckedChange={setSlackEnabled}
            />
          </div>

          {slackEnabled && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-pm-text mb-1.5 block">
                  {__('Webhook URL', 'wedevs-project-manager')}
                </Label>
                <Input
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-pm-text mb-2 block">
                  {__('Notifications', 'wedevs-project-manager')}
                </Label>
                <div className="space-y-2">
                  {SLACK_OPTIONS.map((opt) => (
                    <div key={opt.key} className="flex items-center gap-2.5">
                      <Checkbox
                        id={`slack-${opt.key}`}
                        checked={slackOptions[opt.key]}
                        onCheckedChange={() => toggleSlackOption(opt.key)}
                      />
                      <label
                        htmlFor={`slack-${opt.key}`}
                        className="text-sm text-pm-text cursor-pointer"
                      >
                        {__(opt.label, 'wedevs-project-manager')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSlackSave} disabled={slackSaving} size="sm">
                {slackSaving
                  ? __('Saving...', 'wedevs-project-manager')
                  : __('Save', 'wedevs-project-manager')}
              </Button>
            </div>
          )}
        </Card>

        {/* ── GitHub / Bitbucket Card ──────────────────────── */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-5 h-5 text-pm-text" />
            <h3 className="text-sm font-semibold text-pm-text flex-1">
              {__('GitHub / Bitbucket', 'wedevs-project-manager')}
            </h3>
            <Switch
              checked={gitEnabled}
              onCheckedChange={setGitEnabled}
            />
          </div>

          {gitEnabled && (
            <div className="space-y-4">
              {/* Webhook URL (read-only) */}
              {gitWebhookUrl && (
                <div>
                  <Label className="text-sm font-medium text-pm-text mb-1.5 block">
                    {__('Webhook URL', 'wedevs-project-manager')}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={gitWebhookUrl}
                      readOnly
                      className="bg-muted/30 text-pm-text-muted"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(gitWebhookUrl)}
                      title={__('Copy', 'wedevs-project-manager')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* User mapping */}
              <div>
                <Label className="text-sm font-medium text-pm-text mb-2 block">
                  {__('User Mapping', 'wedevs-project-manager')}
                </Label>

                {userMappings.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {userMappings.map((mapping, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate text-pm-text">{mapping.wp_user}</span>
                        <span className="text-pm-text-muted">&rarr;</span>
                        <span className="flex-1 truncate text-pm-text">{mapping.git_user}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-destructive"
                          onClick={() => removeUserMapping(idx)}
                        >
                          {__('Remove', 'wedevs-project-manager')}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    value={newWpUser}
                    onChange={(e) => setNewWpUser(e.target.value)}
                    placeholder={__('WP Username', 'wedevs-project-manager')}
                    className="flex-1"
                  />
                  <Input
                    value={newGitUser}
                    onChange={(e) => setNewGitUser(e.target.value)}
                    placeholder={__('Git Username', 'wedevs-project-manager')}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addUserMapping}
                  >
                    {__('Add', 'wedevs-project-manager')}
                  </Button>
                </div>
              </div>

              <Button onClick={handleGitSave} disabled={gitSaving} size="sm">
                {gitSaving
                  ? __('Saving...', 'wedevs-project-manager')
                  : __('Save', 'wedevs-project-manager')}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default IntegrationsTab
