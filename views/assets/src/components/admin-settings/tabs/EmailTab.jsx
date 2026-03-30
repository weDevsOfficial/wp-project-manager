import React, { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { saveEmail } from '@store/settingsSlice'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Switch } from '@components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@components/ui/select'

const EmailTab = () => {
  const { __ } = useI18n()
  const toast  = useToast()
  const dispatch = useAppDispatch()

  const email       = useAppSelector((s) => s.settings.email)
  const emailSaving = useAppSelector((s) => s.settings.emailSaving)

  const [form, setForm] = useState({ ...email })
  const [isDirty, setIsDirty] = useState(false)

  const updateField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(saveEmail(form)).unwrap()
      setIsDirty(false)
      toast.success(__('Email settings saved', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err ?? __('Failed to save email settings', 'wedevs-project-manager'))
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-lg font-semibold text-pm-text mb-1">
        {__('Email Settings', 'wedevs-project-manager')}
      </h2>
      <p className="text-sm text-pm-text-muted mb-5">
        {__('Configure how notification emails are sent.', 'wedevs-project-manager')}
      </p>

      <div className="rounded-lg border border-pm-border bg-white">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label htmlFor="from_email" className="text-sm font-medium text-pm-text">
              {__('From Email', 'wedevs-project-manager')}
            </Label>
            <p className="text-sm text-pm-text-muted mt-0.5">
              {__('Sender address for all notifications', 'wedevs-project-manager')}
            </p>
          </div>
          <Input
            id="from_email"
            type="email"
            placeholder="noreply@yoursite.com"
            value={form.from_email}
            onChange={(e) => updateField('from_email', e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="border-t border-pm-border" />

        <div className="flex items-center justify-between px-5 py-4">
          <Label htmlFor="email_type" className="text-sm font-medium text-pm-text">
            {__('Email Type', 'wedevs-project-manager')}
          </Label>
          <Select
            value={form.email_type}
            onValueChange={(val) => updateField('email_type', val)}
          >
            <SelectTrigger id="email_type" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text/html">
                {__('HTML Mail', 'wedevs-project-manager')}
              </SelectItem>
              <SelectItem value="text/plain">
                {__('Plain Text', 'wedevs-project-manager')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-pm-border" />

        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label htmlFor="link_to_backend" className="text-sm font-medium text-pm-text">
              {__('Link to Backend', 'wedevs-project-manager')}
            </Label>
            <p className="text-sm text-pm-text-muted mt-0.5">
              {__('Email links point to the WP admin backend', 'wedevs-project-manager')}
            </p>
          </div>
          <Switch
            id="link_to_backend"
            checked={!!form.link_to_backend}
            onCheckedChange={(val) => updateField('link_to_backend', val)}
          />
        </div>

        <div className="border-t border-pm-border" />

        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label htmlFor="enable_bcc" className="text-sm font-medium text-pm-text">
              {__('Send via BCC', 'wedevs-project-manager')}
            </Label>
            <p className="text-sm text-pm-text-muted mt-0.5">
              {__('All recipients added as BCC instead of TO', 'wedevs-project-manager')}
            </p>
          </div>
          <Switch
            id="enable_bcc"
            checked={!!form.enable_bcc}
            onCheckedChange={(val) => updateField('enable_bcc', val)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <Button type="submit" disabled={!isDirty || emailSaving}>
          {emailSaving
            ? __('Saving...', 'wedevs-project-manager')
            : __('Save Changes', 'wedevs-project-manager')}
        </Button>
        {isDirty && !emailSaving && (
          <span className="text-sm text-pm-text-muted">
            {__('You have unsaved changes', 'wedevs-project-manager')}
          </span>
        )}
      </div>
    </form>
  )
}

export default EmailTab
