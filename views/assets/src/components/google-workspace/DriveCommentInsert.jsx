import { __ } from '@wordpress/i18n'
/**
 * DriveCommentInsert — Drive button for a comment composer (new or edit). Opens
 * the Picker and inserts a link to the chosen file(s) into the comment text
 * (no separate attachment record). Gated by Drive enabled + connection + the
 * admin "Drive in comments" toggle + per-project role.
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchStatus, fetchCanUse } from '@store/googleWorkspaceSlice'
import { Button } from '@components/ui/button'
import DrivePickerModal from './DrivePickerModal'

const MonoDrive = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 17L15.2083 11.5L17.4718 7.61972L19.8 11.5L21.4109 14.1848C23.2105 17.1841 21.05 21 17.5521 21H14.3333L13.1667 19L12 17Z"/>
    <path d="M8.79167 11.5L12 17L13.1667 19L14.3333 21H9.66667H6.44786C2.95003 21 0.789527 17.1841 2.58914 14.1848L4.2 11.5H8.79167Z"/>
    <path d="M15.2083 11.5H8.79167H4.2L6.52817 7.61972L8.35566 4.57391C10.0064 1.82272 13.9936 1.82272 15.6443 4.57391L17.4718 7.61972L15.2083 11.5Z"/>
  </svg>
)

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))
const safeHttpUrl = (u) => {
  try { const p = new URL(u, window.location.origin); return (p.protocol === 'https:' || p.protocol === 'http:') ? p.href : '' }
  catch { return '' }
}

function linkHtml(f) {
  const url = safeHttpUrl(f.webViewLink || f.url)
  if (!url) return ''
  return `<p><a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(f.name || __('Drive file', 'wedevs-project-manager'))}</a></p>`
}

export default function DriveCommentInsert({ projectId, onInsert }) {
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.googleWorkspace.status)
  const canUse = useAppSelector(s => s.googleWorkspace.canUseByProject[projectId])
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    if (!status.configured && !status.connected) dispatch(fetchStatus())
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (projectId && canUse === undefined) dispatch(fetchCanUse({ projectId }))
  }, [dispatch, projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function openPicker() {
    try {
      if (document.requestStorageAccessFor) {
        await Promise.allSettled([
          document.requestStorageAccessFor('https://docs.google.com'),
          document.requestStorageAccessFor('https://accounts.google.com'),
        ])
      }
    } catch (e) { /* guidance shows elsewhere */ }
    setPickerOpen(true)
  }

  if (status.drive_comments_on === false) return null
  if (!(status.configured && status.connected && status.picker_ready && canUse === true)) return null

  return (
    <>
      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-pm-accent" title={__('Add Google Drive file', 'wedevs-project-manager')} onClick={openPicker}>
        <MonoDrive className="h-4 w-4" />
      </Button>
      {pickerOpen && (
        <DrivePickerModal
          projectId={projectId}
          onClose={() => setPickerOpen(false)}
          onPicked={(files) => { files.forEach(f => { const h = linkHtml(f); if (h) onInsert(h) }) }}
        />
      )}
    </>
  )
}
