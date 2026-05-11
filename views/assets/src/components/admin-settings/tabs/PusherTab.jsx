import { __ } from '@wordpress/i18n';
import React, { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { savePusher } from '@store/settingsSlice'
import { useToast } from '@hooks/useToast'
import { useApi } from '@hooks/useApi'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Switch } from '@components/ui/switch'
import { Radio, Zap, Bell } from 'lucide-react'

const TRIGGERS = [
  { key: 'pusher_notify_task_assign',    label: 'Task assigned',           desc: 'Notify users when assigned to a task' },
  { key: 'pusher_notify_task_status',    label: 'Task status changed',     desc: 'Notify on complete / re-open' },
  { key: 'pusher_notify_task_update',    label: 'Task updated',            desc: 'Notify on title, description, or due date change' },
  { key: 'pusher_notify_comment_new',    label: 'New comment',             desc: 'Notify on new comment' },
  { key: 'pusher_notify_comment_update', label: 'Comment updated',         desc: 'Notify when a comment is edited' },
  { key: 'pusher_notify_message_new',    label: 'New discussion message',  desc: 'Notify on new discussion board message' },
  { key: 'pusher_notify_message_update', label: 'Discussion updated',      desc: 'Notify when a discussion message is edited' },
]

const PusherTab = () => {
  const toast  = useToast()
  const api    = useApi()
  const dispatch = useAppDispatch()

  const pusher       = useAppSelector((s) => s.settings.pusher)
  const pusherSaving = useAppSelector((s) => s.settings.pusherSaving)

  const [form, setForm] = useState({ ...pusher })
  const [isDirty, setIsDirty] = useState(false)
  const [testing, setTesting] = useState(false)

  const updateField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(savePusher(form)).unwrap()
      setIsDirty(false)
      toast.success(__('Pusher settings saved', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err ?? __('Failed to save Pusher settings', 'wedevs-project-manager'))
    }
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      await api.post('pusher/test')
      // Success toast comes via Pusher event bridge — avoid double toast.
    } catch (err) {
      const msg = err?.message || err?.data?.message || __('Pusher test failed', 'wedevs-project-manager')
      toast.error(msg)
    } finally {
      setTesting(false)
    }
  }

  const enabled = !!form.pusher_enable

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-pm-text flex items-center gap-2">
            <Radio className="w-5 h-5 text-pm-accent" />
            {__('Pusher Settings', 'wedevs-project-manager')}
          </h2>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__('Enable real-time updates via Pusher.', 'wedevs-project-manager')}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-pm-border bg-pm-surface">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label htmlFor="pusher_enable" className="text-sm font-medium text-pm-text">
              {__('Enable Pusher Notifications', 'wedevs-project-manager')}
            </Label>
            <p className="text-sm text-pm-text-muted mt-0.5">
              {__('Master switch. Disables all real-time notifications when off.', 'wedevs-project-manager')}
            </p>
          </div>
          <Switch
            id="pusher_enable"
            checked={enabled}
            onCheckedChange={(val) => updateField('pusher_enable', val)}
          />
        </div>
      </div>

      <div className={`mt-5 rounded-lg border border-pm-border bg-pm-surface ${enabled ? '' : 'opacity-60 pointer-events-none'}`}>
        <div className="flex items-center justify-between px-5 py-4">
          <div><Label htmlFor="pusher_app_id">{__('App ID', 'wedevs-project-manager')}</Label></div>
          <Input id="pusher_app_id" value={form.pusher_app_id} onChange={(e) => updateField('pusher_app_id', e.target.value)} placeholder={__('Your Pusher App ID', 'wedevs-project-manager')} className="max-w-sm" />
        </div>
        <div className="border-t border-pm-border" />
        <div className="flex items-center justify-between px-5 py-4">
          <div><Label htmlFor="pusher_app_key">{__('App Key', 'wedevs-project-manager')}</Label></div>
          <Input id="pusher_app_key" value={form.pusher_app_key} onChange={(e) => updateField('pusher_app_key', e.target.value)} placeholder={__('Your Pusher App Key', 'wedevs-project-manager')} className="max-w-sm" />
        </div>
        <div className="border-t border-pm-border" />
        <div className="flex items-center justify-between px-5 py-4">
          <div><Label htmlFor="pusher_secret">{__('App Secret', 'wedevs-project-manager')}</Label></div>
          <Input id="pusher_secret" type="password" value={form.pusher_secret} onChange={(e) => updateField('pusher_secret', e.target.value)} placeholder={__('Your Pusher App Secret', 'wedevs-project-manager')} className="max-w-sm" />
        </div>
        <div className="border-t border-pm-border" />
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label htmlFor="pusher_cluster">{__('Cluster', 'wedevs-project-manager')}</Label>
            <p className="text-sm text-pm-text-muted mt-1">{__('e.g. ap2, eu, us2', 'wedevs-project-manager')}</p>
          </div>
          <Input id="pusher_cluster" value={form.pusher_cluster} onChange={(e) => updateField('pusher_cluster', e.target.value)} placeholder="mt1" className="w-40" />
        </div>
        <div className="border-t border-pm-border" />
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label htmlFor="pusher_link_to_backend" className="text-sm font-medium text-pm-text">
              {__('Link to Backend', 'wedevs-project-manager')}
            </Label>
            <p className="text-sm text-pm-text-muted mt-0.5">
              {__('Pusher notification links point to the WP admin backend', 'wedevs-project-manager')}
            </p>
          </div>
          <Switch
            id="pusher_link_to_backend"
            checked={!!form.pusher_link_to_backend}
            onCheckedChange={(val) => updateField('pusher_link_to_backend', val)}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-pm-text flex items-center gap-2">
          <Bell className="w-4 h-4 text-pm-accent" />
          {__('Notification Triggers', 'wedevs-project-manager')}
        </h3>
        <p className="text-sm text-pm-text-muted mt-0.5">
          {__('Toggle individual events that trigger Pusher notifications.', 'wedevs-project-manager')}
        </p>
      </div>

      <div className={`mt-3 rounded-lg border border-pm-border bg-pm-surface ${enabled ? '' : 'opacity-60 pointer-events-none'}`}>
        {TRIGGERS.map((t, i) => (
          <React.Fragment key={t.key}>
            {i > 0 && <div className="border-t border-pm-border" />}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <Label htmlFor={t.key} className="text-sm font-medium text-pm-text">
                  {__(t.label, 'wedevs-project-manager')}
                </Label>
                <p className="text-sm text-pm-text-muted mt-0.5">
                  {__(t.desc, 'wedevs-project-manager')}
                </p>
              </div>
              <Switch
                id={t.key}
                checked={!!form[t.key]}
                onCheckedChange={(val) => updateField(t.key, val)}
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-5">
        <Button type="submit" disabled={!isDirty || pusherSaving}>
          {pusherSaving ? __('Saving...', 'wedevs-project-manager') : __('Save Changes', 'wedevs-project-manager')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleTest}
          disabled={testing || isDirty || !form.pusher_app_key || !enabled}
          className="gap-1.5"
        >
          <Zap className="w-4 h-4" />
          {testing ? __('Testing...', 'wedevs-project-manager') : __('Test Connection', 'wedevs-project-manager')}
        </Button>
        {isDirty && !pusherSaving && (
          <span className="text-sm text-pm-text-muted">{__('Save changes before testing', 'wedevs-project-manager')}</span>
        )}
      </div>
    </form>
  )
}

export default PusherTab
