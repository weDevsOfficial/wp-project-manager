import { __ } from '@wordpress/i18n'
/**
 * GoogleDriveTaskSection — lists Drive files attached to a task and opens the
 * Google Picker. Fills the task.detail.subtasks slot in the task detail sheet.
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchStatus, fetchAttachments, detachFile } from '@store/googleWorkspaceSlice'
import { Button } from '@components/ui/button'
import { FileText, Plus, ExternalLink, Trash2, Link2, Info, Chrome } from 'lucide-react'
import { toast } from 'sonner'
import DrivePickerModal from './DrivePickerModal'

// Modern multicolor Google Drive logo.
const DriveLogo = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 87.3 78" className={className} aria-hidden="true">
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.79 1.35-1.2 2.9-1.2 4.5h27.5z" fill="#00ac47"/>
    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.6-.4-3.15-1.2-4.5z" fill="#ffba00"/>
  </svg>
)

export default function GoogleDriveTaskSection({ taskId, projectId }) {
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.googleWorkspace.status)
  const attachments = useAppSelector(s => s.googleWorkspace.attachmentsByTask[taskId] || [])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // Option 3: BEFORE the Picker/sign-in loads, ask the browser to grant
  // third-party storage *for Google* from this top-level page (the correct API
  // for unblocking an embedded Google iframe). Falls back to requestStorageAccess.
  // Option 2: if everything is unavailable/denied, reveal the guidance note.
  async function openPicker() {
    try {
      if (document.requestStorageAccessFor) {
        // Pre-grant for the Picker + auth origins so no sign-in/401 appears.
        await Promise.allSettled([
          document.requestStorageAccessFor('https://docs.google.com'),
          document.requestStorageAccessFor('https://accounts.google.com'),
        ])
      } else if (document.hasStorageAccess && document.requestStorageAccess) {
        const has = await document.hasStorageAccess()
        if (!has) await document.requestStorageAccess()
      } else {
        setShowHelp(true) // no storage-access API → likely blocked
      }
    } catch (e) {
      setShowHelp(true) // denied → Picker likely blocked; show how to fix
    }
    setPickerOpen(true)
  }

  useEffect(() => {
    if (!status.configured && !status.connected) dispatch(fetchStatus())
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (taskId && projectId) dispatch(fetchAttachments({ projectId, taskId }))
  }, [dispatch, taskId, projectId])

  async function onDetach(id) {
    const res = await dispatch(detachFile({ projectId, taskId, id }))
    if (detachFile.fulfilled.match(res)) toast.success(__('File removed.', 'wedevs-project-manager'))
  }

  if (!status.configured) return null

  return (
    <div className="px-6 py-3 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <DriveLogo className="h-4 w-4" />
          {__('Google Drive', 'wedevs-project-manager')}
          {attachments.length > 0 && <span className="text-xs text-gray-400">({attachments.length})</span>}
        </div>

        {status.connected ? (
          <Button
            variant="outline" size="sm" className="h-7"
            disabled={!status.picker_ready}
            title={status.picker_ready ? '' : __('Admin must add the API key and App ID first.', 'wedevs-project-manager')}
            onClick={openPicker}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> {__('Attach', 'wedevs-project-manager')}
          </Button>
        ) : (
          <a href="#/google-workspace" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
            <Link2 className="h-3.5 w-3.5" /> {__('Connect Google', 'wedevs-project-manager')}
          </a>
        )}
      </div>

      {status.connected && status.picker_ready && (
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setShowHelp(v => !v)}
            className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Info className="h-3 w-3" />
            {__('Picker not opening?', 'wedevs-project-manager')}
          </button>
          {showHelp && (
            <div className="mt-1.5 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
              <p className="font-medium mb-1.5">{__('Browser is blocking the Google picker', 'wedevs-project-manager')}</p>
              <p className="text-amber-800 mb-2">{__('Google Drive opens in a secure pop-in that needs third-party cookies. If it stays blank or frozen, try one of these:', 'wedevs-project-manager')}</p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2">
                  <Chrome className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                  {__('Open this page in Google Chrome (usually works by default)', 'wedevs-project-manager')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {__('Chrome: click the eye / cookie icon in the address bar → allow third-party cookies for this site', 'wedevs-project-manager')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {__('Brave: click the lion (Shields) icon → turn Shields off for this site', 'wedevs-project-manager')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {__('Safari: Settings → Privacy → uncheck “Prevent cross-site tracking”', 'wedevs-project-manager')}
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {attachments.length === 0 ? (
        <p className="text-xs text-gray-400 py-1">{__('No Drive files attached.', 'wedevs-project-manager')}</p>
      ) : (
        <ul className="space-y-1">
          {attachments.map(file => (
            <li key={file.id} className="group flex items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-50">
              {file.icon_link
                ? <img src={file.icon_link} alt="" className="h-4 w-4 shrink-0" />
                : <FileText className="h-4 w-4 text-gray-400 shrink-0" />}
              <a
                href={file.web_view_link} target="_blank" rel="noreferrer"
                className="flex-1 truncate text-sm text-gray-700 hover:text-blue-600 hover:underline"
                title={file.name}
              >
                {file.name}
              </a>
              <a href={file.web_view_link} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button onClick={() => onDetach(file.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600" title={__('Remove', 'wedevs-project-manager')}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {pickerOpen && (
        <DrivePickerModal
          projectId={projectId}
          taskId={taskId}
          attachedIds={attachments.map(f => f.file_id)}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
