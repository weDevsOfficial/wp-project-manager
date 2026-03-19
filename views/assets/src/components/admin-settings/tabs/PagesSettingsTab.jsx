import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '@store/index'
import { saveGeneral } from '@store/settingsSlice'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Label } from '@components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'

export default function PagesSettingsTab() {
  const { __ } = useI18n()
  const toast = useToast()
  const dispatch = useAppDispatch()
  const [isDirty, setIsDirty] = useState(false)
  const [frontEndPage, setFrontEndPage] = useState('')
  const [pages, setPages] = useState([])

  useEffect(() => {
    if (typeof PM_Pro_Vars !== 'undefined') {
      setPages(PM_Pro_Vars.pages || [])
      if (PM_Pro_Vars.page?.project) {
        setFrontEndPage(String(PM_Pro_Vars.page.project))
      }
    }
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(saveGeneral({ front_end_page: frontEndPage })).unwrap()
      setIsDirty(false)
      toast.success(__('Page settings saved'))
    } catch (err) {
      toast.error(err ?? __('Failed to save'))
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-lg font-semibold text-pm-text mb-1">{__('Page Settings')}</h2>
      <p className="text-sm text-pm-text-muted mb-5">{__('Configure front-end pages for Project Manager')}</p>

      <div className="rounded-lg border border-pm-border bg-white mb-5">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label className="text-sm font-medium">{__('Front-end Page')}</Label>
            <p className="text-xs text-pm-text-muted mt-0.5">{__('Select the page where Project Manager will be displayed')}</p>
          </div>
          <Select value={frontEndPage} onValueChange={(v) => { setFrontEndPage(v); setIsDirty(true) }}>
            <SelectTrigger className="w-64 h-8 text-sm">
              <SelectValue placeholder={__('Select a page...')} />
            </SelectTrigger>
            <SelectContent>
              {pages.map(page => (
                <SelectItem key={page.ID} value={String(page.ID)}>{page.post_title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!isDirty}>
          {__('Save Changes')}
        </Button>
        {isDirty && (
          <span className="text-xs text-pm-text-muted">
            {__('You have unsaved changes')}
          </span>
        )}
      </div>
    </form>
  )
}
