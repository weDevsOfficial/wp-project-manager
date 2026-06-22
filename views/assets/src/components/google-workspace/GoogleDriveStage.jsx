import { __ } from '@wordpress/i18n'
/**
 * GoogleDriveStage — pick Drive files BEFORE an entity exists (e.g. the
 * new-discussion form). Controlled: holds picked files in `value`; the parent
 * attaches them after the entity is created. No backend writes here.
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchStatus, fetchCanUse } from '@store/googleWorkspaceSlice'
import { Button } from '@components/ui/button'
import { Plus, X, FileText, Link2 } from 'lucide-react'
import DrivePickerModal from './DrivePickerModal'

const MonoDrive = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 17L15.2083 11.5L17.4718 7.61972L19.8 11.5L21.4109 14.1848C23.2105 17.1841 21.05 21 17.5521 21H14.3333L13.1667 19L12 17Z"/>
    <path d="M8.79167 11.5L12 17L13.1667 19L14.3333 21H9.66667H6.44786C2.95003 21 0.789527 17.1841 2.58914 14.1848L4.2 11.5H8.79167Z"/>
    <path d="M15.2083 11.5H8.79167H4.2L6.52817 7.61972L8.35566 4.57391C10.0064 1.82272 13.9936 1.82272 15.6443 4.57391L17.4718 7.61972L15.2083 11.5Z"/>
  </svg>
)

export default function GoogleDriveStage({ projectId, value = [], onChange }) {
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
    } catch (e) { /* guidance shows */ }
    setPickerOpen(true)
  }

  function onPicked(files) {
    const existing = new Set(value.map(f => f.id))
    onChange([...value, ...files.filter(f => !existing.has(f.id))])
  }

  function remove(id) {
    onChange(value.filter(f => f.id !== id))
  }

  if (!status.configured || canUse === false) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {value.map(file => (
        <span key={file.id} className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 pl-1.5 pr-1 py-0.5 text-xs text-gray-700 max-w-[200px]">
          {file.iconLink ? <img src={file.iconLink} alt="" className="h-3.5 w-3.5 shrink-0" /> : <FileText className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
          <span className="truncate" title={file.name}>{file.name}</span>
          <button type="button" onClick={() => remove(file.id)} className="text-gray-400 hover:text-red-600"><X className="h-3 w-3" /></button>
        </span>
      ))}

      {status.connected ? (
        <Button
          type="button" variant="ghost" size="sm" className="h-6 px-1.5 gap-1 text-gray-500"
          disabled={!status.picker_ready}
          title={status.picker_ready ? __('Add from Drive', 'wedevs-project-manager') : __('Admin must add the API key and App ID first.', 'wedevs-project-manager')}
          onClick={openPicker}
        >
          <Plus className="h-3.5 w-3.5" /> <MonoDrive className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <a href="#/google-workspace" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
          <Link2 className="h-3.5 w-3.5" /> {__('Connect Google', 'wedevs-project-manager')}
        </a>
      )}

      {pickerOpen && (
        <DrivePickerModal
          projectId={projectId}
          attachedIds={value.map(f => f.id)}
          onPicked={onPicked}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
