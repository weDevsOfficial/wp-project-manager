import { sanitizeHtml } from '@lib/sanitize'

// GitHub-flavoured Markdown to HTML for the rich-text editor and the read
// views. Covers what people paste from GitHub issues, PRs and READMEs:
// headings, paragraphs with hard line breaks, bold/italic/strike/code,
// links and bare URLs, images, bullet/ordered/task lists (nested), quotes,
// fenced code, rules and tables. Output always goes through sanitizeHtml.

const BLOCK_SIGNAL_RE = /^(?: {0,3}#{1,6}\s+\S| {0,3}>| {0,3}(?:```|~~~)|\s*(?:[-*+]|\d{1,9}[.)])\s+\S| {0,3}(?:-{3,}|\*{3,}|_{3,})\s*$|\s*\|.*\|\s*$)/m
const INLINE_SIGNAL_RE = /\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\)/
const HTML_BLOCK_RE = /<(?:p|div|br|ul|ol|li|h[1-6]|table|blockquote|pre|hr|img)\b/i

const LIST_ITEM_RE = /^( *)([-*+]|\d{1,9}[.)])(?:( +)(.*))?$/
const TASK_RE = /^\[([ xX])\](?:\s+([\s\S]*))?$/
const FENCE_RE = /^ {0,3}(`{3,}|~{3,})\s*([^`\s]*)[^`]*$/
const HEADING_RE = /^ {0,3}(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/
const SETEXT_RE = /^ {0,3}(=+|-+)\s*$/
const HR_RE = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/
const QUOTE_RE = /^ {0,3}> ?/
const TABLE_DELIM_RE = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/
const HTML_LINE_RE = /^ {0,3}<\/?(?:details|summary|div|p|br|hr|img|picture|source|center|table|thead|tbody|tr|td|th)\b/i

const escapeText = (value) => value
  .replace(/&(?![a-zA-Z][a-zA-Z0-9]*;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const escapeAttr = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const escapeCode = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** True when pasted plain text reads as Markdown rather than prose. */
export function looksLikeMarkdown(text) {
  if (typeof text !== 'string' || !text.trim()) return false
  return BLOCK_SIGNAL_RE.test(text) || INLINE_SIGNAL_RE.test(text)
}

// http(s), mailto, in-page and relative targets only; anything with another
// scheme (javascript:, data:, vbscript:) is dropped and the text stays as is.
function safeUrl(raw) {
  const url = String(raw || '').trim()
  if (!url) return ''
  if (/^(?:https?:|mailto:)/i.test(url)) return url
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return ''
  return url
}

function anchor(href, innerHtml, title) {
  const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
  return `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer"${titleAttr}>${innerHtml}</a>`
}

// GFM autolink rule: trailing punctuation and an unbalanced ")" are not part of the URL.
function trimUrl(raw) {
  let url = raw
  let trail = ''
  const unbalancedParen = (value) => value.endsWith(')') && (value.match(/\(/g) || []).length < (value.match(/\)/g) || []).length
  while (url && (/[.,:;!?'"*_~]$/.test(url) || unbalancedParen(url))) {
    trail = url.slice(-1) + trail
    url = url.slice(0, -1)
  }
  return { url, trail }
}

function renderEmphasis(value) {
  return value
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^\w])__(?=\S)([\s\S]*?\S)__(?!\w)/g, '$1<strong>$2</strong>')
    .replace(/~~(?=\S)([\s\S]*?\S)~~/g, '<s>$1</s>')
    .replace(/(^|[^\w*])\*(?=[^\s*])([^*\n]*?[^\s*])\*(?![\w*])/g, '$1<em>$2</em>')
    .replace(/(^|[^\w])_(?=[^\s_])([^_\n]*?[^\s_])_(?!\w)/g, '$1<em>$2</em>')
}

function renderInline(text) {
  const held = []
  // Finished HTML is parked behind a NUL-delimited index so later passes
  // (escaping, emphasis, bare URLs) cannot touch it.
  const hold = (html) => `\u0000${held.push(html) - 1}\u0000`

  let value = text
    .replace(/\\([\\`*_{}[\]()#+\-.!|~>])/g, (_, char) => hold(escapeText(char)))
    .replace(/(`+)(?!`)([\s\S]*?[^`])\1(?!`)/g, (_, _ticks, code) => hold(`<code>${escapeCode(code.replace(/^ ([\s\S]*) $/, '$1'))}</code>`))
    .replace(/<((?:https?:\/\/|mailto:)[^\s<>]+)>/gi, (_, url) => hold(anchor(url, escapeText(url))))
    .replace(/<!--[\s\S]*?-->/g, '')
    // Inline HTML is left for the sanitizer, as GitHub does.
    .replace(/<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^<>]*)?\/?>/g, (tag) => hold(tag))
    .replace(/!\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+"([^"]*)")?\s*\)/g, (match, alt, src, title) => {
      const url = safeUrl(src)
      if (!url) return match
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
      return hold(`<img src="${escapeAttr(url)}" alt="${escapeAttr(alt)}"${titleAttr}>`)
    })
    .replace(/\[((?:[^[\]]|\[[^\]]*\])+)\]\(\s*<?([^\s)>]+(?:\([^\s)]*\))?)>?(?:\s+"([^"]*)")?\s*\)/g, (match, label, href, title) => {
      const url = safeUrl(href)
      return url ? hold(anchor(url, renderEmphasis(escapeText(label)), title)) : match
    })
    .replace(/(^|[^\w/"'=:\u0000])((?:https?:\/\/|www\.)[^\s<\u0000]+)/g, (match, lead, raw) => {
      const { url, trail } = trimUrl(raw)
      const href = safeUrl(url.startsWith('www.') ? `https://${url}` : url)
      return href && url ? `${lead}${hold(anchor(href, escapeText(url)))}${trail}` : match
    })

  value = renderEmphasis(escapeText(value)).replace(/ *\\?\n/g, '<br>')

  // Held HTML can itself hold (a code span inside a link label).
  for (let depth = 0; depth < 5 && value.includes('\u0000'); depth++) {
    value = value.replace(/\u0000(\d+)\u0000/g, (_, index) => held[Number(index)] ?? '')
  }
  return value
}

function splitTableRow(row) {
  let value = row.trim()
  if (value.startsWith('|')) value = value.slice(1)
  if (value.endsWith('|') && !value.endsWith('\\|')) value = value.slice(0, -1)

  const cells = []
  let current = ''
  let inCode = false
  for (let index = 0; index < value.length; index++) {
    const char = value[index]
    if (char === '\\' && value[index + 1] === '|') { current += '\\|'; index++; continue }
    if (char === '`') inCode = !inCode
    if (char === '|' && !inCode) { cells.push(current.trim()); current = ''; continue }
    current += char
  }
  cells.push(current.trim())
  return cells
}

function isTableStart(lines, index) {
  const header = lines[index]
  const delimiter = lines[index + 1]
  if (!header || !delimiter || !header.includes('|') || !TABLE_DELIM_RE.test(delimiter)) return false
  if (!delimiter.includes('|') && splitTableRow(header).length < 2) return false
  return splitTableRow(header).length === splitTableRow(delimiter).length
}

function isBlockStart(line) {
  return FENCE_RE.test(line) || HEADING_RE.test(line) || HR_RE.test(line) || QUOTE_RE.test(line) || LIST_ITEM_RE.test(line)
}

function unwrapParagraph(html) {
  const match = html.match(/^<p>([\s\S]*)<\/p>$/)
  return match && !match[1].includes('<p>') ? match[1] : html
}

function parseList(lines, start) {
  const first = lines[start].match(LIST_ITEM_RE)
  const indent = first[1].length
  const ordered = /\d/.test(first[2])
  const startNumber = ordered ? parseInt(first[2], 10) : 1
  const items = []
  let loose = false
  let index = start

  while (index < lines.length) {
    const match = lines[index].match(LIST_ITEM_RE)
    if (!match || /\d/.test(match[2]) !== ordered || match[1].length < indent || match[1].length > indent + 3) break

    const itemIndent = match[1].length
    const contentColumn = itemIndent + match[2].length + Math.min((match[3] || ' ').length, 4)
    const itemLines = [match[4] || '']
    let sawBlank = false
    index++

    while (index < lines.length) {
      const line = lines[index]
      if (!line.trim()) { itemLines.push(''); sawBlank = true; index++; continue }
      const lead = line.match(/^ */)[0].length
      if (lead >= contentColumn || (lead > itemIndent && LIST_ITEM_RE.test(line))) {
        itemLines.push(line.slice(Math.min(lead, contentColumn)))
        index++
        continue
      }
      // Lazy continuation: an unindented line straight after the item text.
      if (!sawBlank && !isBlockStart(line)) { itemLines.push(line.trim()); index++; continue }
      break
    }

    let trailingBlank = false
    while (itemLines.length > 1 && itemLines[itemLines.length - 1] === '') { itemLines.pop(); trailingBlank = true }
    if (itemLines.includes('')) loose = true

    const next = lines[index] && lines[index].match(LIST_ITEM_RE)
    if (trailingBlank && next && /\d/.test(next[2]) === ordered && next[1].length >= indent && next[1].length <= indent + 3) loose = true

    const task = ordered ? null : itemLines[0].match(TASK_RE)
    items.push({ lines: itemLines, task })
  }

  const allTasks = items.length > 0 && items.every((item) => item.task)

  const body = items.map((item) => {
    const lines = allTasks ? [item.task[2] || '', ...item.lines.slice(1)] : item.lines
    const blocks = renderBlocks(lines)
    const inner = (loose ? blocks : blocks.map(unwrapParagraph)).join('')
    if (!allTasks) return `<li>${inner}</li>`
    const checked = item.task[1] !== ' '
    return `<li data-type="taskItem" data-checked="${checked ? 'true' : 'false'}"><div>${inner || '<p></p>'}</div></li>`
  }).join('')

  let html
  if (allTasks) html = `<ul data-type="taskList">${body}</ul>`
  else if (ordered) html = `<ol${startNumber !== 1 ? ` start="${startNumber}"` : ''}>${body}</ol>`
  else html = `<ul>${body}</ul>`

  return { html, next: index }
}

function renderBlocks(lines) {
  const out = []
  let paragraph = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    out.push(`<p>${renderInline(paragraph.join('\n'))}</p>`)
    paragraph = []
  }

  let index = 0
  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) { flushParagraph(); index++; continue }

    const fence = line.match(FENCE_RE)
    if (fence) {
      flushParagraph()
      const marker = fence[1]
      const closing = new RegExp(`^ {0,3}\\${marker[0]}{${marker.length},}\\s*$`)
      const code = []
      index++
      while (index < lines.length && !closing.test(lines[index])) { code.push(lines[index]); index++ }
      index++
      const langAttr = fence[2] ? ` class="language-${escapeAttr(fence[2])}"` : ''
      out.push(`<pre><code${langAttr}>${escapeCode(code.join('\n'))}</code></pre>`)
      continue
    }

    if (/^ {0,3}<!--/.test(line)) {
      flushParagraph()
      while (index < lines.length && !lines[index].includes('-->')) index++
      index++
      continue
    }

    const setext = paragraph.length ? line.match(SETEXT_RE) : null
    if (setext) {
      const level = setext[1][0] === '=' ? 1 : 2
      out.push(`<h${level}>${renderInline(paragraph.join(' '))}</h${level}>`)
      paragraph = []
      index++
      continue
    }

    const heading = line.match(HEADING_RE)
    if (heading) {
      flushParagraph()
      const level = heading[1].length
      out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`)
      index++
      continue
    }

    if (HR_RE.test(line)) {
      flushParagraph()
      out.push('<hr>')
      index++
      continue
    }

    if (QUOTE_RE.test(line)) {
      flushParagraph()
      const quoted = []
      while (index < lines.length && QUOTE_RE.test(lines[index])) {
        quoted.push(lines[index].replace(QUOTE_RE, ''))
        index++
      }
      out.push(`<blockquote>${renderBlocks(quoted).join('')}</blockquote>`)
      continue
    }

    if (isTableStart(lines, index)) {
      flushParagraph()
      const header = splitTableRow(lines[index])
      const rows = []
      index += 2
      while (index < lines.length && lines[index].trim() && lines[index].includes('|')) {
        rows.push(splitTableRow(lines[index]))
        index++
      }
      const cell = (tag, value) => `<${tag}>${renderInline(value || '')}</${tag}>`
      const head = `<tr>${header.map((value) => cell('th', value)).join('')}</tr>`
      const bodyRows = rows.map((row) => `<tr>${header.map((_, column) => cell('td', row[column])).join('')}</tr>`).join('')
      out.push(`<table><thead>${head}</thead>${bodyRows ? `<tbody>${bodyRows}</tbody>` : ''}</table>`)
      continue
    }

    // An empty item cannot interrupt a paragraph ("text\n-" is a setext heading, handled above).
    const listItem = line.match(LIST_ITEM_RE)
    if (listItem && (!paragraph.length || (listItem[4] || '').trim())) {
      flushParagraph()
      const list = parseList(lines, index)
      out.push(list.html)
      index = list.next
      continue
    }

    if (HTML_LINE_RE.test(line)) {
      flushParagraph()
      out.push(renderInline(line.trim()))
      index++
      continue
    }

    paragraph.push(line.replace(/^ {1,3}/, ''))
    index++
  }

  flushParagraph()
  return out
}

/** Markdown source to sanitized HTML. */
export function markdownToHtml(markdown) {
  const source = String(markdown ?? '').replace(/\r\n?/g, '\n').replace(/\t/g, '    ')
  return sanitizeHtml(renderBlocks(source.split('\n')).join(''))
}

// GitHub's rendered checklists: <li class="task-list-item"><input type="checkbox" checked> text</li>.
function leadingCheckbox(item) {
  return item.querySelector(':scope > input[type="checkbox"], :scope > p:first-child > input[type="checkbox"], :scope > label:first-child > input[type="checkbox"]')
}

/** Rewrites pasted checkbox lists (GitHub, Notion, Docs) into the editor's task list markup. */
export function normalizeTaskLists(html) {
  if (typeof html !== 'string' || !/type=["']?checkbox/i.test(html)) return html

  let doc
  try {
    doc = new DOMParser().parseFromString(html, 'text/html')
  } catch {
    return html
  }

  doc.querySelectorAll('ul, ol').forEach((list) => {
    const items = [...list.children].filter((child) => child.tagName === 'LI')
    const boxes = items.map(leadingCheckbox)
    if (!items.length || boxes.some((box) => !box)) return

    list.setAttribute('data-type', 'taskList')
    items.forEach((item, index) => {
      const box = boxes[index]
      item.setAttribute('data-type', 'taskItem')
      item.setAttribute('data-checked', box.checked || box.hasAttribute('checked') ? 'true' : 'false')
      box.remove()
      const wrapper = doc.createElement('div')
      while (item.firstChild) wrapper.appendChild(item.firstChild)
      item.appendChild(wrapper)
    })
  })

  return doc.body.innerHTML
}

/**
 * Sanitized HTML for a stored description or comment. Content written in
 * the editor is HTML; content that arrived as plain Markdown (API clients,
 * imports) has no block tags and is rendered as Markdown instead of one
 * run-on line.
 */
export function renderRichText(content) {
  const value = typeof content === 'string' ? content : ''
  if (value && !HTML_BLOCK_RE.test(value) && (value.includes('\n') || looksLikeMarkdown(value))) {
    return markdownToHtml(value)
  }
  return sanitizeHtml(value)
}
