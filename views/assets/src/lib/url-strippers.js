import { __, sprintf } from '@wordpress/i18n'

/**
 * URL helpers for the GitHub / Notion / Loom preview cards.
 *
 * The cards load over the network and can fail (previews switched off, no
 * access, rate limits, the 10-URL batch cap), so rendered content keeps every
 * integration link in the text as a short readable reference instead of
 * stripping it; a card is extra detail on top when it loads.
 */

const GITHUB_URL_RE = /https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/(issues|pull)\/\d+(?:[?#/]\S*)?/gi
// Notion URLs: notion.so/workspace/Page-Title-{32hex} or notion.so/{32hex} or UUID dashes
const NOTION_URL_RE = /https?:\/\/(?:www\.)?notion\.(?:so|site)\/[a-zA-Z0-9_\-/]*[a-f0-9]{32}(?:\?[^"<\s]*)?/gi
const LOOM_URL_RE   = /https?:\/\/(?:www\.)?loom\.com\/(share|embed)\/[a-f0-9]{32}(?:[?#/]\S*)?/gi

// Extract matching URLs from HTML string
export function extractGithubUrls(html) {
  if (!html) return []
  return [...new Set([...(html.matchAll(GITHUB_URL_RE) || [])].map(m => m[0]))]
}

export function extractNotionUrls(html) {
  if (!html) return []
  return [...new Set([...(html.matchAll(NOTION_URL_RE) || [])].map(m => m[0]))]
}

export function extractLoomUrls(html) {
  if (!html) return []
  return [...new Set([...(html.matchAll(LOOM_URL_RE) || [])].map(m => m[0]))]
}

// Strip matching URLs from HTML (removes <a> wraps and bare URLs)
function stripUrlsFromHtml(html, regex) {
  if (!html) return html
  // Remove <a> tags that link to matching URLs
  let result = html.replace(/<a[^>]*href=["'][^"']*(?:github\.com\/[^"']*(?:issues|pull)\/\d+|notion\.(?:so|site)\/[^"']*[a-f0-9]{32}|loom\.com\/(?:share|embed)\/[a-f0-9]{32})[^"']*["'][^>]*>.*?<\/a>/gi, '')
  // Remove bare URLs
  result = result.replace(regex, '')
  return result
}

export function stripGithubUrls(html) { return stripUrlsFromHtml(html, GITHUB_URL_RE) }
export function stripNotionUrls(html) { return stripUrlsFromHtml(html, NOTION_URL_RE) }
export function stripLoomUrls(html)   { return stripUrlsFromHtml(html, LOOM_URL_RE) }

const GITHUB_REF_RE = /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/(?:issues|pull)\/(\d+)(?:[/?#]\S*)?$/i
const NOTION_PAGE_RE = /^https?:\/\/(?:[\w-]+\.)?notion\.(?:so|site)\/(?:[^?#]*\/)?([^/?#]*?)-?([a-f0-9]{32})(?:[?#]\S*)?$/i
const LOOM_VIDEO_RE = /^https?:\/\/(?:www\.)?loom\.com\/(?:share|embed)\/[a-f0-9]{32}/i
const LINK_SKIP_TAGS = new Set(['A', 'CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA'])

// The label shown for an integration URL, or null for any other URL.
function integrationLink(href) {
  const github = href.match(GITHUB_REF_RE)
  if (github) {
    const ref = `${github[1]}/${github[2]}#${github[3]}`
    if (/#(?:issuecomment-|discussion_r|pullrequestreview-)/.test(href)) {
      /* translators: %s: GitHub reference such as owner/repo#12 */
      return { kind: 'github', label: sprintf(__('%s (comment)', 'wedevs-project-manager'), ref) }
    }
    return { kind: 'github', label: ref }
  }

  const notion = href.match(NOTION_PAGE_RE)
  if (notion) {
    let title = ''
    try { title = decodeURIComponent(notion[1]).replace(/-/g, ' ').trim() } catch { title = '' }
    return { kind: 'notion', label: title || __('Notion page', 'wedevs-project-manager') }
  }

  if (LOOM_VIDEO_RE.test(href)) return { kind: 'loom', label: __('Loom video', 'wedevs-project-manager') }

  return null
}

function trimTrailingPunctuation(url) {
  let value = url
  const unbalancedParen = (v) => v.endsWith(')') && (v.match(/\(/g) || []).length < (v.match(/\)/g) || []).length
  while (value && (/[.,:;!?'"*_~]$/.test(value) || unbalancedParen(value))) value = value.slice(0, -1)
  return value
}

function markIntegrationLink(anchor, info, href) {
  anchor.classList.add('pm-integration-link', `pm-integration-link--${info.kind}`)
  anchor.setAttribute('target', '_blank')
  anchor.setAttribute('rel', 'noopener noreferrer')
  anchor.setAttribute('title', href)
}

/**
 * Render-only: turns GitHub issue/PR, Notion and Loom URLs into compact
 * links (`owner/repo#12`, the page title, "Loom video"). Anchors keep text
 * the author chose; a bare URL or URL-as-text is relabelled. Built with
 * DOM APIs so stored content cannot inject markup through a URL.
 */
export function decorateIntegrationLinks(html) {
  if (typeof html !== 'string' || !/github\.com|notion\.(?:so|site)|loom\.com/i.test(html)) return html

  let doc
  try {
    doc = new DOMParser().parseFromString(html, 'text/html')
  } catch {
    return html
  }

  doc.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href') || ''
    if (!/^https?:\/\//i.test(href)) return
    const info = integrationLink(href)
    if (!info) return
    const text = (anchor.textContent || '').trim()
    if (!text || text === href || /^(?:https?:\/\/|www\.)\S+$/i.test(text)) anchor.textContent = info.label
    markIntegrationLink(anchor, info, href)
  })

  const bareUrlRe = new RegExp([GITHUB_URL_RE.source, NOTION_URL_RE.source, LOOM_URL_RE.source].join('|'), 'gi')
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  const textNodes = []
  while (walker.nextNode()) textNodes.push(walker.currentNode)

  textNodes.forEach((node) => {
    for (let parent = node.parentElement; parent && parent !== doc.body; parent = parent.parentElement) {
      if (LINK_SKIP_TAGS.has(parent.tagName)) return
    }
    const text = node.nodeValue || ''
    bareUrlRe.lastIndex = 0
    if (!bareUrlRe.test(text)) return

    const fragment = doc.createDocumentFragment()
    let cursor = 0
    bareUrlRe.lastIndex = 0
    for (const match of text.matchAll(bareUrlRe)) {
      const url = trimTrailingPunctuation(match[0])
      const info = integrationLink(url)
      if (!info) continue
      fragment.appendChild(doc.createTextNode(text.slice(cursor, match.index)))
      const anchor = doc.createElement('a')
      anchor.setAttribute('href', url)
      anchor.textContent = info.label
      markIntegrationLink(anchor, info, url)
      fragment.appendChild(anchor)
      cursor = match.index + url.length
    }
    if (!cursor) return
    fragment.appendChild(doc.createTextNode(text.slice(cursor)))
    node.replaceWith(fragment)
  })

  return doc.body.innerHTML
}

// Name kept for Pro, which reads it from window.PM.utils.urlStrippers.
// GitHub/Notion/Loom URLs are decorated now, not removed (see top of file).
export function stripAllPreviewUrls(html) {
  return decorateIntegrationLinks(html)
}
