import { __ } from '@wordpress/i18n'
/**
 * DrivePickerModal — launches the Google Picker (Google-hosted overlay) under
 * the drive.file scope and attaches picked files by reference.
 *
 * The Picker is Google's own iframe overlay (appended to <body>), so it can't
 * live inside our task sheet. We render nothing ourselves — just open the
 * Picker on top of everything — to avoid a spinner dialog covering it.
 */
import { useEffect, useRef } from 'react'
import { useAppDispatch } from '@store/index'
import { fetchPickerConfig, attachFile } from '@store/googleWorkspaceSlice'
import { toast } from 'sonner'

const GAPI_SRC = 'https://apis.google.com/js/api.js'
const ZINDEX_STYLE_ID = 'pm-gpicker-zindex'

// Force the Google Picker above the task sheet / WP admin bar.
function ensureZIndexStyle() {
  if (document.getElementById(ZINDEX_STYLE_ID)) return
  const s = document.createElement('style')
  s.id = ZINDEX_STYLE_ID
  // z-index: above the task sheet / admin bar.
  // pointer-events: the open Radix sheet sets body { pointer-events:none },
  // which freezes the Picker (it lives on <body>) — re-enable it here.
  s.textContent =
    '.picker-dialog-bg{z-index:2147483646 !important;pointer-events:auto !important}' +
    '.picker-dialog{z-index:2147483647 !important;pointer-events:auto !important}' +
    '.picker-dialog iframe{pointer-events:auto !important}'
  document.head.appendChild(s)
}

function loadPickerApi() {
  return new Promise((resolve, reject) => {
    if (window.google?.picker) return resolve()
    const ready = () => window.gapi.load('picker', { callback: resolve, onerror: reject })
    if (window.gapi) return ready()
    const existing = document.querySelector(`script[src="${GAPI_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', ready)
      existing.addEventListener('error', reject)
      return
    }
    const el = document.createElement('script')
    el.src = GAPI_SRC; el.async = true; el.defer = true
    el.onload = ready; el.onerror = reject
    document.body.appendChild(el)
  })
}

export default function DrivePickerModal({ projectId, taskId, attachedIds = [], onClose }) {
  const dispatch = useAppDispatch()
  const launchedRef = useRef(false)

  useEffect(() => {
    if (launchedRef.current) return
    launchedRef.current = true

    let cancelled = false
    const toastId = toast.loading(__('Opening Google Drive…', 'wedevs-project-manager'))

    ;(async () => {
      try {
        const cfgRes = await dispatch(fetchPickerConfig())
        if (!fetchPickerConfig.fulfilled.match(cfgRes)) {
          throw new Error(cfgRes.payload || __('Could not start Google Picker.', 'wedevs-project-manager'))
        }
        const { access_token, api_key, app_id } = cfgRes.payload

        await loadPickerApi()
        if (cancelled) return
        ensureZIndexStyle()

        const { google } = window
        const view = new google.picker.DocsView(google.picker.ViewId.DOCS)
          .setIncludeFolders(true)
          .setSelectFolderEnabled(false)
          .setMode(google.picker.DocsViewMode.LIST)

        const picker = new google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .setOrigin(window.location.protocol + '//' + window.location.host)
          .setOAuthToken(access_token)
          .setDeveloperKey(api_key)
          .setAppId(app_id)
          .addView(view)
          .setCallback((data) => handlePickerEvent(data, google))
          .build()

        toast.dismiss(toastId)
        // Flag the active Picker session so the task sheet won't close on the
        // Picker's outside focus/pointer events.
        window.__pmGooglePickerOpen = true
        picker.setVisible(true)
      } catch (e) {
        toast.dismiss(toastId)
        toast.error(e.message || __('Failed to load Google Picker.', 'wedevs-project-manager'))
        onClose()
      }
    })()

    return () => { cancelled = true; toast.dismiss(toastId); window.__pmGooglePickerOpen = false }
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handlePickerEvent(data, google) {
    const Action = google.picker.Action

    // Only PICKED/CANCEL end the session. Other callbacks (LOADED, folder
    // navigation) must NOT clear the flag, or the sheet would close mid-pick.
    if (data.action !== Action.PICKED && data.action !== Action.CANCEL) return

    // Session ending — clear the flag a tick later so the close event Radix
    // sees is still suppressed, then normal behavior resumes.
    setTimeout(() => { window.__pmGooglePickerOpen = false }, 300)

    if (data.action === Action.CANCEL) { onClose(); return }

    const docs = data.docs || []
    let attached = 0
    for (const doc of docs) {
      if (attachedIds.includes(doc.id)) continue
      const file = {
        id:           doc.id,
        name:         doc.name,
        mimeType:     doc.mimeType,
        iconLink:     doc.iconUrl,
        webViewLink:  doc.url,
        modifiedTime: doc.lastEditedUtc ? new Date(doc.lastEditedUtc).toISOString() : '',
      }
      const res = await dispatch(attachFile({ projectId, taskId, file }))
      if (attachFile.fulfilled.match(res)) attached++
    }
    if (attached > 0) toast.success(__('File attached.', 'wedevs-project-manager'))
    onClose()
  }

  // Picker renders its own overlay; we render nothing.
  return null
}
