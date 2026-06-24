/**
 * Render-only decoration for Google Drive / Meet links inside comment HTML.
 *
 * IMPORTANT: nothing here is ever stored. The DB keeps a plain <a href> link
 * (no emoji, no 4-byte chars) so the comment save flow stays safe on utf8mb3
 * columns. We inject mono lucide-style SVGs at render time, AFTER sanitize.
 */

// lucide 24x24 outline paths, mono via currentColor. Rendered at 14px, light shade.
const SW = 'width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
// shared file-body path used by most lucide File* glyphs
const BODY = '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>'
const ICONS = {
  drive:
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 17L15.2083 11.5L17.4718 7.61972L19.8 11.5L21.4109 14.1848C23.2105 17.1841 21.05 21 17.5521 21H14.3333L13.1667 19L12 17Z"/><path d="M8.79167 11.5L12 17L13.1667 19L14.3333 21H9.66667H6.44786C2.95003 21 0.789527 17.1841 2.58914 14.1848L4.2 11.5H8.79167Z"/><path d="M15.2083 11.5H8.79167H4.2L6.52817 7.61972L8.35566 4.57391C10.0064 1.82272 13.9936 1.82272 15.6443 4.57391L17.4718 7.61972L15.2083 11.5Z"/></svg>`,
  doc:    `<svg ${SW}>${BODY}<path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  pdf:    `<svg ${SW}>${BODY}<path d="M9 13v-1h6v1"/><path d="M11 18h2"/><path d="M12 12v6"/></svg>`,
  sheet:  `<svg ${SW}>${BODY}<path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/></svg>`,
  slides: `<svg ${SW}><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>`,
  archive:`<svg ${SW}><path d="M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="10" cy="20" r="2"/><path d="M10 7V6"/><path d="M10 12v-1"/><path d="M10 18v-2"/></svg>`,
  audio:  `<svg ${SW}><path d="M11.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v8"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="3" cy="17" r="1"/><path d="M2 17v-3a4 4 0 0 1 8 0v3"/><circle cx="9" cy="17" r="1"/></svg>`,
  video:  `<svg ${SW}>${BODY}<path d="m10 11 5 3-5 3v-6Z"/></svg>`,
  image:  `<svg ${SW}>${BODY}<circle cx="10" cy="12" r="2"/><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"/></svg>`,
  code:   `<svg ${SW}>${BODY}<path d="m10 13-2 2 2 2"/><path d="m14 13 2 2-2 2"/></svg>`,
  meet:   `<svg ${SW}><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>`,
}

function driveKind(href, text) {
  if (/docs\.google\.com\/spreadsheets/.test(href)) return 'sheet'
  if (/docs\.google\.com\/presentation/.test(href)) return 'slides'
  if (/docs\.google\.com\/document/.test(href)) return 'doc'
  const name = (text || '').toLowerCase()
  if (/\.pdf\b/.test(name)) return 'pdf'
  if (/\.(xls|xlsx|csv|ods)\b/.test(name)) return 'sheet'
  if (/\.(ppt|pptx|key|odp)\b/.test(name)) return 'slides'
  if (/\.(doc|docx|txt|rtf|pages|odt|md)\b/.test(name)) return 'doc'
  if (/\.(zip|rar|7z|tar|gz|tgz|bz2)\b/.test(name)) return 'archive'
  if (/\.(mp3|wav|flac|aac|ogg|m4a|wma)\b/.test(name)) return 'audio'
  if (/\.(mp4|mov|avi|mkv|webm|flv|wmv|m4v)\b/.test(name)) return 'video'
  if (/\.(jpg|jpeg|png|gif|svg|webp|heic|bmp|tiff?)\b/.test(name)) return 'image'
  if (/\.(js|ts|jsx|tsx|json|html?|css|php|py|xml|java|rb|go|sh|sql|yml|yaml)\b/.test(name)) return 'code'
  return 'drive'
}

function iconHtml(kind) {
  return `<span class="pm-gicon text-pm-text-muted/40 shrink-0 inline-flex" aria-hidden="true">${ICONS[kind]}</span>`
}

export function decorateGoogleLinks(html) {
  if (typeof html !== 'string' || html === '') return html
  if (!/drive\.google\.com|docs\.google\.com|meet\.google\.com/.test(html)) return html

  let doc
  try {
    doc = new DOMParser().parseFromString(html, 'text/html')
  } catch {
    return html
  }

  doc.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || ''
    const text = a.textContent || ''

    if (/meet\.google\.com/.test(href)) {
      const card = doc.createElement('span')
      card.className =
        'pm-meet-card inline-flex flex-col gap-1 w-fit max-w-full rounded-md border border-pm-text-muted/20 px-3 py-2 my-1 text-sm align-middle'
      card.innerHTML =
        `<span class="inline-flex items-center gap-2">${iconHtml('meet')}<span class="text-pm-text">${text || 'Google Meet'}</span></span>` +
        `<a href="${href}" target="_blank" rel="noreferrer" class="text-pm-accent hover:underline shrink-0">Join Google Meet</a>`
      a.replaceWith(card)
      return
    }

    if (/drive\.google\.com|docs\.google\.com/.test(href)) {
      const kind = driveKind(href, text)
      a.classList.add('pm-gdrive-link', 'inline-flex', 'items-center', 'gap-1', 'align-middle')
      a.insertAdjacentHTML('afterbegin', iconHtml(kind))
    }
  })

  return doc.body.innerHTML
}
