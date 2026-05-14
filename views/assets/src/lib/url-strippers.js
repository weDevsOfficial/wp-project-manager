/**
 * URL stripping utilities for preview card integration.
 * Strips GitHub/Notion/Loom URLs from rendered HTML so they don't display
 * both as raw text AND as preview cards.
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

export function stripAllPreviewUrls(html) {
  return stripLoomUrls(stripNotionUrls(stripGithubUrls(html)))
}
