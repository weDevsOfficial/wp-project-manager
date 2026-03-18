import React, { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { saveGeneral } from '@store/settingsSlice'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'

const GeneralTab = () => {
  const { __ } = useI18n()
  const toast  = useToast()
  const dispatch = useAppDispatch()

  const general       = useAppSelector((s) => s.settings.general)
  const generalSaving = useAppSelector((s) => s.settings.generalSaving)

  const [form, setForm] = useState({ ...general })
  const [isDirty, setIsDirty] = useState(false)

  const updateField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(saveGeneral(form)).unwrap()
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

      <div className="rounded-lg border border-pm-border bg-white">
        {fields.map((field, idx) => (
          <React.Fragment key={field.key}>
            {idx > 0 && <div className="border-t border-pm-border" />}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <Label htmlFor={field.key} className="text-sm font-medium text-pm-text">
                  {field.label}
                </Label>
                {field.hint && (
                  <p className="text-xs text-pm-text-muted mt-0.5">{field.hint}</p>
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

      <div className="flex items-center gap-3 mt-5">
        <Button type="submit" disabled={!isDirty || generalSaving}>
          {generalSaving
            ? __('Saving...', 'wedevs-project-manager')
            : __('Save Changes', 'wedevs-project-manager')}
        </Button>
        {isDirty && !generalSaving && (
          <span className="text-xs text-pm-text-muted">
            {__('You have unsaved changes', 'wedevs-project-manager')}
          </span>
        )}
      </div>
    </form>
  )
}

export default GeneralTab
