// Shared download-with-progress system. Any CSV/PDF/file export routes through
// here so the user sees the app toast card with 0–100% progress instead of a
// silent browser navigation. Exposed to Pro via window.PM.download.
//
// - downloadFile(url, opts): fetches to a blob with real byte progress (falls
//   back to indeterminate when the server sends no Content-Length), then saves.
// - downloadBlob(blob, filename): client-side data already in memory (CSV);
//   shows a brief determinate ramp so the action still feels acknowledged.
import { createDownloadToast } from '@lib/toast-custom'

function filenameFromResponse(res, fallback) {
  const cd = res.headers.get('Content-Disposition') || ''
  const star = cd.match(/filename\*=(?:UTF-8'')?([^;]+)/i)
  if (star) { try { return decodeURIComponent(star[1].replace(/"/g, '').trim()) } catch { /* ignore */ } }
  const plain = cd.match(/filename="?([^";]+)"?/i)
  if (plain) return plain[1].trim()
  return fallback
}

export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'download'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function fetchToBlob(url, { headers, onProgress, stallTimeout = 30000 } = {}) {
  // Abort if no bytes arrive for stallTimeout ms; the timer resets on each chunk,
  // so genuinely slow-but-progressing downloads are never killed, only stuck ones.
  const controller = new AbortController()
  let stalled = false
  let timer
  const arm = () => {
    clearTimeout(timer)
    timer = setTimeout(() => { stalled = true; controller.abort() }, stallTimeout)
  }

  try {
    arm()
    const res = await fetch(url, { headers, credentials: 'same-origin', signal: controller.signal })
    // Headers arrived: the stall window starts again for the body.
    arm()
    if (!res.ok) throw new Error(`Download failed (${res.status})`)

    const total = Number(res.headers.get('Content-Length')) || 0
    // No stream to read → just await the blob (no progress to report).
    if (!res.body || typeof res.body.getReader !== 'function') {
      onProgress?.({ progress: 0, indeterminate: true })
      const blob = await res.blob()
      onProgress?.({ progress: 100, indeterminate: false })
      return { blob, res }
    }

    // Read by chunks even without Content-Length (generated PDFs usually have
    // none), so every chunk re-arms the stall timer; progress is indeterminate then.
    if (!total) onProgress?.({ progress: 0, indeterminate: true })
    const reader = res.body.getReader()
    const chunks = []
    let loaded = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      arm()
      chunks.push(value)
      loaded += value.length
      if (total) onProgress?.({ progress: Math.min(99, Math.round((loaded / total) * 100)), indeterminate: false })
    }
    onProgress?.({ progress: 100, indeterminate: false })
    const type = res.headers.get('Content-Type') || 'application/octet-stream'
    return { blob: new Blob(chunks, { type }), res }
  } catch (e) {
    if (stalled) throw new Error('Download timed out')
    throw e
  } finally {
    clearTimeout(timer)
  }
}

// Same-origin REST downloads need the nonce like every other API call; without
// it a cookie-authenticated request is treated as logged out.
function withRestNonce(url, headers) {
  const rest = typeof PM_Vars !== 'undefined' ? PM_Vars?.rest_url : ''
  const nonce = typeof PM_Vars !== 'undefined' ? PM_Vars?.permission : ''
  if (!nonce || headers?.['X-WP-Nonce']) return headers
  const restRoot = rest ? String(rest).replace(/\/(pm|pm-pro)\/v\d+\/?$/, '/') : ''
  if (!restRoot || !String(url).startsWith(restRoot)) return headers
  return { ...(headers || {}), 'X-WP-Nonce': nonce }
}

// Download a server-generated file (PDF, export) with progress feedback.
export async function downloadFile(url, { filename, headers } = {}) {
  const t = createDownloadToast(filename || __label(url))
  try {
    const { blob, res } = await fetchToBlob(url, {
      headers: withRestNonce(url, headers),
      onProgress: ({ progress, indeterminate }) => t.progress(progress, indeterminate),
    })
    const name = filenameFromResponse(res, filename || __label(url))
    saveBlob(blob, name)
    t.done()
    return blob
  } catch (e) {
    t.error(e.message || 'Download failed')
    throw e
  }
}

// Save an already-built blob (client-side CSV etc.) with a short progress ramp.
export function downloadBlob(blob, filename) {
  return new Promise((resolve) => {
    const t = createDownloadToast(filename || 'download')
    let p = 0
    t.progress(0, false)
    const tick = setInterval(() => {
      p += 20
      if (p >= 100) {
        clearInterval(tick)
        saveBlob(blob, filename)
        t.done()
        resolve()
      } else {
        t.progress(p, false)
      }
    }, 60)
  })
}

function __label(url) {
  try {
    const u = new URL(url, window.location.href)
    const seg = u.pathname.split('/').filter(Boolean).pop() || 'download'
    return seg
  } catch { return 'download' }
}
