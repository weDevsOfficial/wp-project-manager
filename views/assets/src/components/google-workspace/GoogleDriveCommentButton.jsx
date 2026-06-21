import { __ } from '@wordpress/i18n'
/**
 * GoogleDriveCommentButton — icon-only Drive add button for a comment header
 * (sits beside Edit/Delete). Opens the Picker; attachments render separately
 * via <GoogleDriveAttach showAdd={false} /> under the comment body.
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchStatus, fetchCanUse, fetchAttachmentsFor } from '@store/googleWorkspaceSlice'
import DrivePickerModal from './DrivePickerModal'

const DriveGlyph = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 17L15.2083 11.5L17.4718 7.61972L19.8 11.5L21.4109 14.1848C23.2105 17.1841 21.05 21 17.5521 21H14.3333L13.1667 19L12 17Z"/>
    <path d="M8.79167 11.5L12 17L13.1667 19L14.3333 21H9.66667H6.44786C2.95003 21 0.789527 17.1841 2.58914 14.1848L4.2 11.5H8.79167Z"/>
    <path d="M15.2083 11.5H8.79167H4.2L6.52817 7.61972L8.35566 4.57391C10.0064 1.82272 13.9936 1.82272 15.6443 4.57391L17.4718 7.61972L15.2083 11.5Z"/>
  </svg>
)

export default function GoogleDriveCommentButton({ projectId, attachableType, attachableId, allowEdit = true, className = '' }) {
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

  // Only show when the user can actually add here.
  if (!(status.configured && status.connected && status.picker_ready && canUse === true && allowEdit)) return null

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        title={__('Add from Google Drive', 'wedevs-project-manager')}
        className={`p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent ${className}`}
      >
        <DriveGlyph className="h-3.5 w-3.5" />
      </button>
      {pickerOpen && (
        <DrivePickerModal
          projectId={projectId}
          attachableType={attachableType}
          attachableId={attachableId}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  )
}
