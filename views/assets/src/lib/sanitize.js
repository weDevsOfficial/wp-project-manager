import DOMPurify from 'dompurify'

/**
 * Sanitizes HTML for safe rendering via dangerouslySetInnerHTML.
 *
 * Defense-in-depth: WordPress applies wp_kses_post() on save,
 * but this catches any stored XSS that bypasses the backend filter.
 *
 * @param {string} html - Raw HTML string to sanitize
 * @returns {string} Sanitized HTML safe for rendering
 */
export const sanitizeHtml = (html) =>
  DOMPurify.sanitize(html ?? '', {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'a',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre', 'img',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'col', 'colgroup',
      'span', 'div', 'sub', 'sup', 'hr', 'mark',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'class', 'target', 'rel', 'style', 'title', 'id',
      'colspan', 'rowspan', 'width', 'height', 'align', 'valign',
      'bgcolor', 'border', 'cellpadding', 'cellspacing', 'scope',
    ],
  })
