// Rich-text HTML (task descriptions, comments) to GitHub-flavoured Markdown,
// the reverse of markdown.js so a copy pasted back into PM or into GitHub keeps
// its structure: headings, bold/italic/strike/code, links, images, nested and
// ordered lists, checklists, quotes, fenced code, rules, tables and @mentions.

const INLINE_ESCAPE_RE = /([\\`*_[\]])/g

const escapeInline = (text) => text.replace(INLINE_ESCAPE_RE, '\\$1')

// Wrap text in a marker, keeping edge spaces outside it ("** bold**" is not bold).
function wrap(marker, inner) {
  if (!inner.trim()) return inner
  const lead = inner.match(/^\s*/)[0]
  const tail = inner.match(/\s*$/)[0]
  return `${lead}${marker}${inner.trim()}${marker}${tail}`
}

function codeSpan(text) {
  const longest = Math.max(0, ...(text.match(/`+/g) || []).map((run) => run.length))
  const fence = '`'.repeat(longest + 1)
  const pad = text.startsWith('`') || text.endsWith('`') ? ' ' : ''
  return `${fence}${pad}${text}${pad}${fence}`
}

function inline(node) {
  if (node.nodeType === 3) return escapeInline(node.nodeValue.replace(/\s+/g, ' '))
  if (node.nodeType !== 1) return ''

  const tag = node.tagName
  const kids = () => Array.from(node.childNodes).map(inline).join('')

  if (node.getAttribute('data-type') === 'mention') {
    const label = node.getAttribute('data-label') || node.textContent.replace(/^@/, '')
    return `@${label}`
  }

  switch (tag) {
    case 'STRONG': case 'B': return wrap('**', kids())
    case 'EM': case 'I': return wrap('_', kids())
    case 'S': case 'DEL': case 'STRIKE': return wrap('~~', kids())
    case 'CODE': return codeSpan(node.textContent)
    case 'BR': return '\n'
    case 'IMG': {
      const src = node.getAttribute('src') || ''
      return src ? `![${escapeInline(node.getAttribute('alt') || '')}](${src})` : ''
    }
    case 'A': {
      const href = node.getAttribute('href') || ''
      const text = kids().trim()
      if (!href) return text
      if (!text || text === escapeInline(href)) return href
      return `[${text}](${href})`
    }
    case 'INPUT': case 'LABEL': case 'BUTTON': return ''
    default: return kids()
  }
}

const BLOCK_TAGS = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'PRE', 'TABLE', 'HR', 'FIGURE', 'SECTION', 'ARTICLE'])

const isBlock = (node) => node.nodeType === 1 && BLOCK_TAGS.has(node.tagName)

const indent = (text, prefix) => text.split('\n').map((line) => (line ? prefix + line : line)).join('\n')

// An item's text, with any nested list directly under it (a tight list, no blank line).
function listItemBody(li) {
  const own = Array.from(li.children).filter((c) => c.tagName !== 'LABEL' && c.tagName !== 'INPUT')
  // Checklist items wrap their content in a single <div>.
  const content = own.length === 1 && own[0].tagName === 'DIV' ? own[0] : li
  const parts = []
  let buffer = []
  const flush = () => {
    if (!buffer.length) return
    const holder = li.ownerDocument.createElement('div')
    buffer.forEach((n) => holder.appendChild(n.cloneNode(true)))
    const text = blocks(holder).trim()
    if (text) parts.push({ text, sep: '\n\n' })
    buffer = []
  }

  for (const child of Array.from(content.childNodes)) {
    if (child.nodeType === 1 && (child.tagName === 'UL' || child.tagName === 'OL')) {
      flush()
      parts.push({ text: list(child), sep: '\n' })
    } else if (!(child.nodeType === 1 && (child.tagName === 'LABEL' || child.tagName === 'INPUT'))) {
      buffer.push(child)
    }
  }
  flush()

  return parts.map((p, i) => (i === 0 ? p.text : p.sep + p.text)).join('')
}

function list(el) {
  const ordered = el.tagName === 'OL'
  const start = ordered ? parseInt(el.getAttribute('start') || '1', 10) || 1 : 1
  const items = Array.from(el.children).filter((child) => child.tagName === 'LI')

  return items.map((li, i) => {
    const checkbox = li.querySelector(':scope > label > input[type="checkbox"], :scope > input[type="checkbox"]')
    const isTask = li.getAttribute('data-type') === 'taskItem' || el.getAttribute('data-type') === 'taskList' || !!checkbox
    const checked = li.getAttribute('data-checked') === 'true' || (checkbox ? checkbox.checked || checkbox.hasAttribute('checked') : false)

    let marker = ordered ? `${start + i}.` : '-'
    if (isTask) marker = `- [${checked ? 'x' : ' '}]`

    const body = listItemBody(li)
    const pad = ' '.repeat(ordered && !isTask ? marker.length + 1 : 2)
    const [first = '', ...rest] = body.split('\n')
    const restText = rest.length ? '\n' + indent(rest.join('\n'), pad) : ''
    return `${marker} ${first}${restText}`
  }).join('\n')
}

function table(el) {
  const rows = Array.from(el.querySelectorAll('tr'))
  if (!rows.length) return ''
  const cell = (c) => inline(c).replace(/\n/g, ' ').replace(/\|/g, '\\|').trim()
  const lines = rows.map((tr) => `| ${Array.from(tr.children).map(cell).join(' | ')} |`)
  const width = rows[0].children.length || 1
  lines.splice(1, 0, `| ${Array(width).fill('---').join(' | ')} |`)
  return lines.join('\n')
}

function block(node) {
  switch (node.tagName) {
    case 'H1': case 'H2': case 'H3': case 'H4': case 'H5': case 'H6':
      return `${'#'.repeat(Number(node.tagName[1]))} ${inline(node).replace(/\n/g, ' ').trim()}`
    case 'UL': case 'OL':
      return list(node)
    case 'BLOCKQUOTE':
      return blocks(node).trim().split('\n').map((line) => (line ? `> ${line}` : '>')).join('\n')
    case 'PRE': {
      const code = node.querySelector('code')
      const lang = ((code && code.className) || '').match(/language-([\w-]+)/)?.[1] || ''
      const text = (code || node).textContent.replace(/\n$/, '')
      const longest = Math.max(2, ...(text.match(/`+/g) || []).map((run) => run.length))
      const fence = '`'.repeat(longest + 1)
      return `${fence}${lang}\n${text}\n${fence}`
    }
    case 'HR':
      return '---'
    case 'TABLE':
      return table(node)
    default:
      // P, DIV and friends: a paragraph, or a container of further blocks.
      return Array.from(node.childNodes).some(isBlock) ? blocks(node) : inline(node).trim()
  }
}

function blocks(container) {
  const out = []
  let run = []
  const flush = () => {
    const text = run.map(inline).join('').trim()
    if (text) out.push(text)
    run = []
  }

  for (const child of Array.from(container.childNodes)) {
    if (isBlock(child)) {
      flush()
      const text = block(child)
      if (text && text.trim()) out.push(text)
    } else {
      run.push(child)
    }
  }
  flush()

  return out.join('\n\n')
}

/** Convert stored rich-text HTML to Markdown. Plain text passes through unchanged. */
export function htmlToMarkdown(html) {
  if (!html) return ''
  const source = String(html)
  if (!/<[a-z][\s\S]*>/i.test(source)) return source.trim()

  const doc = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html')
  const root = doc.body.firstElementChild
  return blocks(root).replace(/\n{3,}/g, '\n\n').trim()
}

/** Put text on the clipboard; falls back to a hidden textarea where the async API is unavailable. */
export async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return
  }
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(area)
  if (!ok) throw new Error('copy failed')
}
