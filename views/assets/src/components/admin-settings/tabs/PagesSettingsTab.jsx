import { __ } from '@wordpress/i18n';
import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '@store/index'
import { saveGeneral } from '@store/settingsSlice'
import { useToast } from '@hooks/useToast'
import { getSetting } from '@lib/utils'
import { Button } from '@components/ui/button'
import { Label } from '@components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'

export default function PagesSettingsTab() {
  const toast = useToast()
  const dispatch = useAppDispatch()
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pages, setPages] = useState([])

  // Read saved value — same pattern as GeneralTab uses getSetting()
  // Vue: this.getSettings('front_end_page', PM_Pro_Vars.page.project)
  const proPageFallback = (typeof PM_Pro_Vars !== 'undefined' && PM_Pro_Vars.page?.project)
    ? String(PM_Pro_Vars.page.project)
    : null
  const savedValue = getSetting('front_end_page', proPageFallback)
  const [frontEndPage, setFrontEndPage] = useState(
    savedValue && String(savedValue) !== '0' && String(savedValue) !== ''
      ? String(savedValue)
      : 'none'
  )

  useEffect(() => {
    if (typeof PM_Pro_Vars !== 'undefined') {
      setPages(PM_Pro_Vars.pages || [])
    }
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const valueToSave = frontEndPage === 'none' ? '' : frontEndPage
      await dispatch(saveGeneral({ front_end_page: valueToSave })).unwrap()
      // Also update PM_Pro_Vars so it persists in-memory
      if (typeof PM_Pro_Vars !== 'undefined') {
        if (!PM_Pro_Vars.page || Array.isArray(PM_Pro_Vars.page)) PM_Pro_Vars.page = {}
        PM_Pro_Vars.page.project = valueToSave
      }
      setIsDirty(false)
      toast.success(__('Page settings saved', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err ?? __('Failed to save', 'wedevs-project-manager'))
    }
    setSaving(false)
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-lg font-semibold text-pm-text mb-1">{__('Front-end Page', 'wedevs-project-manager')}</h2>
      <p className="text-sm text-pm-text-muted mb-5">{__('Configure front-end pages for Project Manager', 'wedevs-project-manager')}</p>

      <div className="rounded-lg border border-pm-border bg-pm-surface mb-5">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label className="text-sm font-medium">{__('Project Page', 'wedevs-project-manager')}</Label>
            <p className="text-sm text-pm-text-muted mt-0.5">{__('Select the page where Project Manager will be displayed on the front-end', 'wedevs-project-manager')}</p>
          </div>
          <Select
            value={frontEndPage}
            onValueChange={(v) => { setFrontEndPage(v); setIsDirty(true) }}
          >
            <SelectTrigger className="w-64 h-8 text-sm">
              <SelectValue placeholder={__('Select a page...', 'wedevs-project-manager')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{__('— None —', 'wedevs-project-manager')}</SelectItem>
              {pages.map(page => (
                <SelectItem key={page.ID} value={String(page.ID)}>{page.post_title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!isDirty || saving}>
          {saving ? __('Saving...', 'wedevs-project-manager') : __('Save Changes', 'wedevs-project-manager')}
        </Button>
        {isDirty && (
          <span className="text-sm text-pm-text-muted">
            {__('You have unsaved changes', 'wedevs-project-manager')}
          </span>
        )}
      </div>
    </form>
  )
}
