import { __ } from '@wordpress/i18n'
import React, { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useToast } from '@hooks/useToast'
import { htmlToMarkdown, copyText } from '@lib/html-to-markdown'
import { cn } from '@lib/utils'

/**
 * Copies a description or comment to the clipboard as GitHub-flavoured Markdown.
 * @param {{ html: string, className?: string, showLabel?: boolean }} props
 */
export function CopyMarkdownButton({ html, className, showLabel = false }) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  if (!html || !String(html).replace(/<[^>]*>/g, '').trim()) return null

  const label = __('Copy as Markdown', 'wedevs-project-manager')

  const handleCopy = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await copyText(htmlToMarkdown(html))
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1500)
      toast.success(__('Copied as Markdown', 'wedevs-project-manager'), __('Paste it into GitHub, a README or back into Project Manager.', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Could not copy', 'wedevs-project-manager'), __('Your browser blocked clipboard access.', 'wedevs-project-manager'))
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1 rounded p-1 text-pm-text-muted transition-colors hover:bg-muted hover:text-pm-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/40',
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {showLabel && <span className="text-[12px]">{copied ? __('Copied', 'wedevs-project-manager') : label}</span>}
    </button>
  )
}

export default CopyMarkdownButton
