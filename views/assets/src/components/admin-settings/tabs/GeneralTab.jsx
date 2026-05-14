import { __ } from '@wordpress/i18n';
import React, { useState, useCallback, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { saveGeneral } from '@store/settingsSlice'
import { usePermissions } from '@hooks/usePermissions'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Switch } from '@components/ui/switch'
import { Separator } from '@components/ui/separator'
import { Calendar, Mail as MailIcon, Image, Upload, Trash2, Loader2 } from 'lucide-react'

const GeneralTab = () => {
  const toast  = useToast()
  const dispatch = useAppDispatch()
  const { isPro } = usePermissions()

  const general       = useAppSelector((s) => s.settings.general)
  const generalSaving = useAppSelector((s) => s.settings.generalSaving)

  const [form, setForm] = useState({ ...general })
  const [isDirty, setIsDirty] = useState(false)

  // Pro fields
  const settings = typeof PM_Vars !== 'undefined' ? PM_Vars.settings : {}
  const [taskStartField, setTaskStartField] = useState(
    settings?.task_start_field === undefined ? true : (settings?.task_start_field === 'true' || settings?.task_start_field === true)
  )
  const [dailyDigest, setDailyDigest] = useState(
    settings?.daily_digest === undefined ? true : (settings?.daily_digest === 'true' || settings?.daily_digest === true)
  )
  const [logo, setLogo] = useState(() => {
    if (typeof PM_Pro_Vars !== 'undefined' && PM_Pro_Vars.pm_logo && typeof PM_Pro_Vars.pm_logo === 'object' && (PM_Pro_Vars.pm_logo.thumb || PM_Pro_Vars.pm_logo.url)) {
      return PM_Pro_Vars.pm_logo
    }
    return null
  })
  const [logoId, setLogoId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const updateField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }, [])

  const handleLogoUpload = () => {
    fileRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error(__('Please select an image file', 'wedevs-project-manager')); return }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const nonce = typeof PM_Vars !== 'undefined' ? (PM_Vars.permission || PM_Vars.nonce) : ''
      const res = await fetch('/wp-json/wp/v2/media', {
        method: 'POST',
        headers: { 'X-WP-Nonce': nonce },
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const att = await res.json()
      setLogoId(att.id)
      setLogo({ thumb: att.source_url, name: att.title?.rendered || file.name })
      setIsDirty(true)
      toast.success(__('Logo uploaded', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err?.message || __('Failed to upload', 'wedevs-project-manager'))
    }
    setUploading(false)
    e.target.value = ''
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form }
      if (isPro) {
        payload.task_start_field = taskStartField
        payload.daily_digest = dailyDigest
        if (logoId !== null) payload.logo = logoId
        // Preserve estimation_type — set by Vue Sub_Tasks module via pm_apply_filters,
        // must be passed through so React save doesn't wipe the stored value.
        if (settings?.estimation_type !== undefined) {
          payload.estimation_type = settings.estimation_type
        }
      }
      await dispatch(saveGeneral(payload)).unwrap()
      setIsDirty(false)
      toast.success(__('Settings saved', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err ?? __('Failed to save settings', 'wedevs-project-manager'))
    }
  }

  const fields = [
    {
      key:   'upload_limit',
      label: __('File Upload Limit', 'wedevs-project-manager'),
      hint:  __('Size in Megabytes (e.g. 2)', 'wedevs-project-manager'),
      min:   1,
    },
    {
      key:   'project_per_page',
      label: __('Projects Per Page', 'wedevs-project-manager'),
      hint:  __('-1 for unlimited', 'wedevs-project-manager'),
      min:   -1,
    },
    {
      key:   'list_per_page',
      label: __('Task Lists Per Page', 'wedevs-project-manager'),
      min:   1,
    },
    {
      key:   'incomplete_tasks_per_page',
      label: __('Incomplete Tasks Per Page', 'wedevs-project-manager'),
      min:   1,
    },
    {
      key:   'complete_tasks_per_page',
      label: __('Completed Tasks Per Page', 'wedevs-project-manager'),
      min:   1,
    },
  ]

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-lg font-semibold text-pm-text mb-1">
        {__('General Settings', 'wedevs-project-manager')}
      </h2>
      <p className="text-sm text-pm-text-muted mb-5">
        {__('Configure pagination and file upload limits.', 'wedevs-project-manager')}
      </p>

      <div className="rounded-lg border border-pm-border bg-pm-surface">
        {fields.map((field, idx) => (
          <React.Fragment key={field.key}>
            {idx > 0 && <div className="border-t border-pm-border" />}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <Label htmlFor={field.key} className="text-sm font-medium text-pm-text">
                  {field.label}
                </Label>
                {field.hint && (
                  <p className="text-sm text-pm-text-muted mt-0.5">{field.hint}</p>
                )}
              </div>
              <Input
                id={field.key}
                type="number"
                min={field.min}
                value={form[field.key]}
                onChange={(e) => updateField(field.key, Number(e.target.value))}
                className="w-32 text-right"
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Pro settings — appended to General when Pro is active */}
      {isPro && (
        <div className="rounded-lg border border-pm-border bg-pm-surface mt-5">
          <div className="px-5 py-3 bg-muted/30 border-b border-pm-border">
            <h3 className="text-sm font-semibold text-pm-text-primary">{__('Pro Settings', 'wedevs-project-manager')}</h3>
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-pm-text-muted" />{__('Task Start Date', 'wedevs-project-manager')}
              </Label>
              <p className="text-sm text-pm-text-muted mt-0.5">{__('Enable start date field for tasks', 'wedevs-project-manager')}</p>
            </div>
            <Switch checked={taskStartField} onCheckedChange={(v) => { setTaskStartField(v); setIsDirty(true) }} />
          </div>

          <div className="border-t border-pm-border" />

          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <MailIcon className="h-5 w-5 text-pm-text-muted" />{__('Daily Digest', 'wedevs-project-manager')}
              </Label>
              <p className="text-sm text-pm-text-muted mt-0.5">{__('Send daily digest emails to team members', 'wedevs-project-manager')}</p>
            </div>
            <Switch checked={dailyDigest} onCheckedChange={(v) => { setDailyDigest(v); setIsDirty(true) }} />
          </div>

          <div className="border-t border-pm-border" />

          <div className="px-5 py-4">
            <Label className="text-sm font-medium flex items-center gap-2 mb-1">
              <Image className="h-5 w-5 text-pm-text-muted" />{__('Company Logo', 'wedevs-project-manager')}
            </Label>
            <p className="text-sm text-pm-text-muted mb-3">{__('Used on invoices and reports', 'wedevs-project-manager')}</p>
            <div className="flex items-center gap-3">
              {logo?.thumb && (
                <img src={logo.thumb} alt={logo.name || 'Logo'} className="h-14 w-14 rounded-lg border border-pm-border object-contain bg-pm-surface" />
              )}
              <div className="flex gap-2">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <Button type="button" size="sm" variant="outline" className="h-8 text-sm" onClick={handleLogoUpload} disabled={uploading}>
                  {uploading ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1" />}
                  {uploading ? __('Uploading...', 'wedevs-project-manager') : logo ? __('Change', 'wedevs-project-manager') : __('Upload', 'wedevs-project-manager')}
                </Button>
                {logo && (
                  <Button type="button" size="sm" variant="outline" className="h-8 text-sm text-destructive" onClick={() => { setLogo(null); setLogoId(null); setIsDirty(true) }}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" />{__('Remove', 'wedevs-project-manager')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mt-5">
        <Button type="submit" disabled={!isDirty || generalSaving}>
          {generalSaving
            ? __('Saving...', 'wedevs-project-manager')
            : __('Save Changes', 'wedevs-project-manager')}
        </Button>
        {isDirty && !generalSaving && (
          <span className="text-sm text-pm-text-muted">
            {__('You have unsaved changes', 'wedevs-project-manager')}
          </span>
        )}
      </div>
    </form>
  )
}

export default GeneralTab
