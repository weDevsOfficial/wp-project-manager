import React, { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { savePusher } from '@store/settingsSlice'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { useApi } from '@hooks/useApi'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Radio, Zap } from 'lucide-react'

const PusherTab = () => {
  const { __ } = useI18n()
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
      const res = await api.post('pusher/test')
      const msg = res?.data?.message || res?.message || __('Test event sent', 'wedevs-project-manager')
      toast.success(msg)
    } catch (err) {
      const msg = err?.message || err?.data?.message || __('Pusher test failed', 'wedevs-project-manager')
      toast.error(msg)
    } finally {
      setTesting(false)
    }
  }

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
      </div>

      <div className="flex items-center gap-3 mt-5">
        <Button type="submit" disabled={!isDirty || pusherSaving}>
          {pusherSaving ? __('Saving...', 'wedevs-project-manager') : __('Save Changes', 'wedevs-project-manager')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleTest}
          disabled={testing || isDirty || !form.pusher_app_key}
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
