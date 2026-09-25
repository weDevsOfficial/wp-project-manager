import { __ } from '@wordpress/i18n'
/**
 * GoogleDriveCommentButton — icon-only Drive add button for a comment header
 * (sits beside Edit/Delete). Opens the Picker; attachments render separately
 * via <GoogleDriveAttach showAdd={false} /> under the comment body.
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchStatus, fetchCanUse, fetchAttachmentsFor } from '@store/googleWorkspaceSlice'
import { DriveMonoGlyph } from '@components/google-workspace/GoogleIcons'
import DrivePickerModal from './DrivePickerModal'

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
  if (status.drive_comments_on === false) return null
  if (!(status.configured && status.connected && status.picker_ready && canUse === true && allowEdit)) return null

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        title={__('Add from Google Drive', 'wedevs-project-manager')}
        aria-label={__('Add from Google Drive', 'wedevs-project-manager')}
        className={`p-0.5 rounded hover:bg-muted text-pm-text-muted hover:text-pm-accent ${className}`}
      >
        <DriveMonoGlyph className="h-3.5 w-3.5" />
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
