import React, { useState, useEffect } from 'react'
import { useI18n } from '@hooks/useI18n'
import { useApi } from '@hooks/useApi'
import { Switch } from '@components/ui/switch'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Label } from '@components/ui/label'
import { Separator } from '@components/ui/separator'
import { Calendar, Mail as MailIcon, Image, Upload, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

/**
 * ProSettingsTab — Pro fields appended to General settings.
 * Matches Vue: task_start_field, daily_digest, logo upload.
 */
export default function ProSettingsTab() {
  const { __ } = useI18n()
  const api = useApi()

  const [saving, setSaving] = useState(false)
  const [taskStartField, setTaskStartField] = useState(false)
  const [dailyDigest, setDailyDigest] = useState(false)
  const [logo, setLogo] = useState(null)
  const [logoId, setLogoId] = useState(null)

  useEffect(() => {
    const s = typeof PM_Vars !== 'undefined' ? PM_Vars.settings : {}
    setTaskStartField(s?.task_start_field === 'true' || s?.task_start_field === true)
    setDailyDigest(s?.daily_digest === 'true' || s?.daily_digest === true)
    if (typeof PM_Pro_Vars !== 'undefined' && PM_Pro_Vars.pm_logo && !jQuery.isEmptyObject(PM_Pro_Vars.pm_logo)) {
      setLogo(PM_Pro_Vars.pm_logo)
    }
  }, [])

  const handleLogoUpload = () => {
    const frame = wp.media({ title: __('Select Logo'), button: { text: __('Use this image') }, multiple: false })
    frame.on('select', () => {
      const att = frame.state().get('selection').first().toJSON()
      setLogoId(att.id)
      setLogo({ thumb: att.url, name: att.filename || att.title })
    })
    frame.open()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = { task_start_field: taskStartField, daily_digest: dailyDigest }
      if (logoId !== null) data.logo = logoId
      await api.post('settings', data)
      toast.success(__('Settings saved'))
    } catch (e) { toast.error(e?.message || __('Failed to save')) }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-pm-text-primary mb-1">{__('Pro Settings')}</h2>
        <p className="text-xs text-pm-text-muted">{__('Additional settings available with PM Pro')}</p>
      </div>

      <div className="space-y-5 rounded-lg border border-pm-border bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-pm-text-muted" />{__('Task Start Date')}
            </Label>
            <p className="text-xs text-pm-text-muted mt-0.5">{__('Enable start date field for tasks')}</p>
          </div>
          <Switch checked={taskStartField} onCheckedChange={setTaskStartField} />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-pm-text-muted" />{__('Daily Digest')}
            </Label>
            <p className="text-xs text-pm-text-muted mt-0.5">{__('Send daily digest emails to team members')}</p>
          </div>
          <Switch checked={dailyDigest} onCheckedChange={setDailyDigest} />
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Image className="h-4 w-4 text-pm-text-muted" />{__('Company Logo')}
          </Label>
          <p className="text-xs text-pm-text-muted mb-3">{__('Used on invoices and reports')}</p>
          <div className="flex items-center gap-3">
            {logo?.thumb && (
              <img src={logo.thumb} alt={logo.name || 'Logo'} className="h-16 w-16 rounded-lg border border-pm-border object-contain bg-white" />
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleLogoUpload}>
                <Upload className="h-3 w-3 mr-1" />{logo ? __('Change') : __('Upload')}
              </Button>
              {logo && (
                <Button size="sm" variant="outline" className="h-8 text-xs text-destructive" onClick={() => { setLogo(null); setLogoId(null) }}>
                  <Trash2 className="h-3 w-3 mr-1" />{__('Remove')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? __('Saving...') : __('Save Changes')}
      </Button>
    </div>
  )
}
