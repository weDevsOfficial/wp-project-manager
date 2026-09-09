import { __ } from '@wordpress/i18n'
/**
 * GoogleDriveAttach — reusable Drive attach + list for any entity
 * (task, comment, discussion, project). Respects per-project role access and
 * the global on/off + connection state.
 *
 * Props:
 *   projectId, attachableType ('task'|'comment'|'discussion'|'project'), attachableId
 *   variant: 'section' (bordered block, default) | 'compact' (inline chips)
 *   title (default "Google Drive")
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchStatus, fetchCanUse, fetchAttachmentsFor, detachFileFor } from '@store/googleWorkspaceSlice'
import { Button } from '@components/ui/button'
import { FileText, Plus, ExternalLink, Trash2, Link2, Lock, X } from 'lucide-react'
import { toast } from 'sonner'
import { GoogleDriveColorGlyph, DriveMonoGlyph } from '@components/google-workspace/GoogleIcons'
import DrivePickerModal from './DrivePickerModal'

const safeHttpUrl = (u) => {
  try { const p = new URL(u, window.location.origin); return (p.protocol === 'https:' || p.protocol === 'http:') ? p.href : '' }
  catch { return '' }
}

// Tiny "added by" avatar with tooltip — non-intrusive attribution.
const AdderAvatar = ({ file }) => {
  if (!file.added_by_name) return null
  const title = file.added_by_name
  return file.added_by_avatar
    ? <img src={file.added_by_avatar} alt="" title={title} className="h-4 w-4 rounded-md shrink-0 ring-1 ring-gray-200" />
    : <span title={title} className="h-4 w-4 rounded-md bg-pm-surface-muted text-[8px] text-pm-text-muted inline-flex items-center justify-center shrink-0">{title.charAt(0).toUpperCase()}</span>
}

const FileIcon = ({ file, className = 'h-4 w-4 shrink-0' }) =>
  file.icon_link
    ? <img src={file.icon_link} alt="" className={className} />
    : <FileText className={`${className} text-pm-text-muted`} />

const MAX_VISIBLE = 2

export default function GoogleDriveAttach({ projectId, attachableType, attachableId, variant = 'section', title, allowEdit = true, addRevealClass = '', showAdd = true }) {
  const dispatch = useAppDispatch()
  const key = `${attachableType}:${attachableId}`
  const status = useAppSelector(s => s.googleWorkspace.status)
  const canUse = useAppSelector(s => s.googleWorkspace.canUseByProject[projectId])
  const canEdit = canUse === true && allowEdit
  const attachments = useAppSelector(s => s.googleWorkspace.attachmentsByKey[key] || [])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!status.configured && !status.connected) dispatch(fetchStatus())
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (projectId && canUse === undefined) dispatch(fetchCanUse({ projectId }))
  }, [dispatch, projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (projectId && attachableId) dispatch(fetchAttachmentsFor({ projectId, attachableType, attachableId }))
  }, [dispatch, projectId, attachableType, attachableId])

  async function onDetach(id) {
    const res = await dispatch(detachFileFor({ projectId, attachableType, attachableId, id }))
    if (detachFileFor.fulfilled.match(res)) toast.success(__('File removed.', 'wedevs-project-manager'))
  }

  async function openPicker() {
    try {
      if (document.requestStorageAccessFor) {
        await Promise.allSettled([
          document.requestStorageAccessFor('https://docs.google.com'),
          document.requestStorageAccessFor('https://accounts.google.com'),
        ])
      } else if (document.hasStorageAccess && document.requestStorageAccess) {
        const has = await document.hasStorageAccess()
        if (!has) await document.requestStorageAccess()
      }
    } catch (e) { /* browser will prompt or guidance shows */ }
    setPickerOpen(true)
  }

  if (!status.configured) return null
  // Nothing to show and can't add → hide entirely.
  if ((canUse === false || !allowEdit) && attachments.length === 0) return null
  // Chips-only mode (add button lives elsewhere) with nothing attached → hide.
  if (!showAdd && attachments.length === 0) return null

  const action = status.connected && canEdit ? (
    variant === 'compact' ? (
      <Button
        variant="ghost" size="sm" className={`h-11 px-1.5 gap-1 text-pm-text-muted transition-opacity ${addRevealClass}`}
        disabled={!status.picker_ready}
        title={status.picker_ready ? __('Add from Drive', 'wedevs-project-manager') : __('Admin must add the API key and App ID first.', 'wedevs-project-manager')}
        onClick={openPicker}
      >
        <Plus className="h-3.5 w-3.5" /> <DriveMonoGlyph className="h-3.5 w-3.5" />
      </Button>
    ) : (
      <Button
        variant="outline" size="sm" className="h-11"
        disabled={!status.picker_ready}
        title={status.picker_ready ? '' : __('Admin must add the API key and App ID first.', 'wedevs-project-manager')}
        onClick={openPicker}
      >
        <Plus className="h-3.5 w-3.5 mr-1" /> {__('Attach', 'wedevs-project-manager')}
      </Button>
    )
  ) : canUse === false ? (
    <span className="inline-flex items-center gap-1 text-[11px] text-pm-text-muted" title={__('Your project role can view Drive files but not attach them.', 'wedevs-project-manager')}>
      <Lock className="h-3 w-3" /> {__('View only', 'wedevs-project-manager')}
    </span>
  ) : canEdit && !status.connected ? (
    <a href="#/google-workspace" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
      <Link2 className="h-3.5 w-3.5" /> {__('Connect Google', 'wedevs-project-manager')}
    </a>
  ) : null

  const picker = pickerOpen && (
    <DrivePickerModal
      projectId={projectId}
      attachableType={attachableType}
      attachableId={attachableId}
      attachedIds={attachments.map(f => f.file_id)}
      onClose={() => setPickerOpen(false)}
    />
  )

  // Compact: a small button + chips (for comment/discussion composers).
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {attachments.map(file => (
          <span key={file.id} className="inline-flex items-center gap-1 rounded-md border border-pm-border bg-muted pl-1.5 pr-1 py-0.5 text-xs text-pm-text-muted max-w-[220px]">
            <FileIcon file={file} className="h-3.5 w-3.5 shrink-0" />
            <a href={safeHttpUrl(file.web_view_link)} target="_blank" rel="noreferrer" className="truncate hover:text-pm-accent" title={file.name}>{file.name}</a>
            <AdderAvatar file={file} />
            {canEdit && (
              <button onClick={() => onDetach(file.id)} className="text-pm-text-muted hover:text-destructive" title={__('Remove', 'wedevs-project-manager')}>
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        {action}
        {picker}
      </div>
    )
  }

  // Section: bordered block with header (task detail / files).
  return (
    <div className={variant === 'section' ? 'px-6 py-3 border-t border-pm-border' : ''}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-pm-text-primary">
          <GoogleDriveColorGlyph className="h-4 w-4" aria-hidden="true" />
          {variant === 'section' && (title || __('Google Drive', 'wedevs-project-manager'))}
          {attachments.length > 0 && <span className="text-xs text-pm-text-muted">({attachments.length})</span>}
        </div>
        {action}
      </div>

      {attachments.length === 0 ? (
        <p className="text-xs text-pm-text-muted py-1">{__('No Drive files attached.', 'wedevs-project-manager')}</p>
      ) : (
        <>
          <ul className="space-y-1">
            {(expanded ? attachments : attachments.slice(0, MAX_VISIBLE)).map(file => (
              <li key={file.id} className="group flex items-center gap-2 rounded px-2 py-1.5 hover:bg-pm-surface-muted">
                <FileIcon file={file} />
                <a href={safeHttpUrl(file.web_view_link)} target="_blank" rel="noreferrer" className="flex-1 truncate text-sm text-pm-text-primary hover:text-pm-accent hover:underline" title={file.name}>
                  {file.name}
                </a>
                <AdderAvatar file={file} />
                <a href={safeHttpUrl(file.web_view_link)} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 text-pm-text-muted hover:text-pm-accent">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {canEdit && (
                  <button onClick={() => onDetach(file.id)} className="opacity-0 group-hover:opacity-100 text-pm-text-muted hover:text-destructive" title={__('Remove', 'wedevs-project-manager')}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {attachments.length > MAX_VISIBLE && (
            <button
              type="button"
              onClick={() => setExpanded(v => !v)}
              className="mt-1 text-xs font-medium text-blue-600 hover:underline"
            >
              {expanded
                ? __('Show less', 'wedevs-project-manager')
                : `${__('Show all', 'wedevs-project-manager')} (${attachments.length})`}
            </button>
          )}
        </>
      )}
      {picker}
    </div>
  )
}
