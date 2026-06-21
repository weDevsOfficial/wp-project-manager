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

// Google Drive logo (2026 mark), full color.
const DriveLogo = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 17L15.2083 11.5L17.4718 7.61972L19.8 11.5L21.4109 14.1848C23.2105 17.1841 21.05 21 17.5521 21H14.3333L13.1667 19L12 17Z" fill="url(#pmgd_a)"/>
    <path d="M8.79167 11.5L12 17L13.1667 19L14.3333 21H9.66667H6.44786C2.95003 21 0.789527 17.1841 2.58914 14.1848L4.2 11.5H8.79167Z" fill="url(#pmgd_b)"/>
    <path d="M15.2083 11.5H8.79167H4.2L6.52817 7.61972L8.35566 4.57391C10.0064 1.82272 13.9936 1.82272 15.6443 4.57391L17.4718 7.61972L15.2083 11.5Z" fill="url(#pmgd_c)"/>
    <defs>
      <linearGradient id="pmgd_a" x1="15.2651" y1="11.2054" x2="21.5787" y2="18.5942" gradientUnits="userSpaceOnUse"><stop stopColor="#FECA06"/><stop offset="1" stopColor="#FFE31F"/></linearGradient>
      <linearGradient id="pmgd_b" x1="8" y1="18.8492" x2="11.6122" y2="21.1175" gradientUnits="userSpaceOnUse"><stop stopColor="#3185FF"/><stop offset="1" stopColor="#A8A8FE"/></linearGradient>
      <linearGradient id="pmgd_c" x1="10.1707" y1="8.85" x2="5.8286" y2="10.6011" gradientUnits="userSpaceOnUse"><stop stopColor="#16BC66"/><stop offset="1" stopColor="#78C9FF"/></linearGradient>
    </defs>
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
