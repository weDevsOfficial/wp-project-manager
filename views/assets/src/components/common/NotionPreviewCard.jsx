/**
 * NotionPreviewCard — Notion page/database preview with left accent stripe.
 */
import React from 'react'
import { useI18n } from '@hooks/useI18n'
import { cn } from '@lib/utils'
import { Skeleton } from '@components/ui/skeleton'
import { RefreshCw, ExternalLink, Database, FileText, Clock } from 'lucide-react'

// Notion brand "N" logo SVG
const NotionLogo = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L2.451 2.577c-.466.046-.56.28-.374.466l2.382 1.165zM5.251 7.26v13.932c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V7.307c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.747.327-.747.933zm14.336.42c.094.42 0 .84-.42.886l-.7.14v10.264c-.607.327-1.167.514-1.634.514-.747 0-.933-.234-1.494-.933l-4.577-7.186v6.953l1.447.327s0 .84-1.167.84l-3.22.187c-.093-.187 0-.653.327-.747l.84-.22V9.854L7.822 9.76c-.094-.42.14-1.027.747-1.073l3.454-.234 4.764 7.28V9.527l-1.214-.14c-.093-.513.28-.886.747-.933l3.267-.187z" />
  </svg>
)

function relativeEditTime(dateStr, __) {
  if (!dateStr) return ''
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diffMs / 86400000)
  if (days > 30) return new Date(dateStr).toLocaleDateString()
  if (days > 0) return `${days}d ago`
  const hours = Math.floor(diffMs / 3600000)
  if (hours > 0) return `${hours}h ago`
  return __('just now')
}

export default function NotionPreviewCard({ previewData, loading, url, onRefresh }) {
  const { __ } = useI18n()

  if (loading) {
    return (
      <div className="flex rounded-lg border border-pm-border bg-white max-w-md overflow-hidden">
        <div className="w-1 shrink-0 bg-gray-200" />
        <div className="flex-1 p-3 space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!previewData) return null

  const isError = previewData.state === 'access_denied' || previewData.state === 'error' || previewData.state === 'rate_limited'
  const isDatabase = previewData.type === 'database'
  const TypeIcon = isDatabase ? Database : FileText

  const openInNotion = () => {
    const target = previewData.url || url
    if (!target) return
    try {
      const parsed = new URL(target)
      if (parsed.protocol === 'https:' && /notion\.(so|site)$/.test(parsed.hostname)) {
        window.open(target, '_blank', 'noopener,noreferrer')
      }
    } catch { /* invalid URL */ }
  }

  return (
    <div
      className={cn(
        'flex rounded-lg border border-pm-border bg-white max-w-md overflow-hidden cursor-pointer hover:border-pm-accent/40 hover:shadow-sm transition-all',
        isError && 'opacity-70'
      )}
      onClick={openInNotion}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') openInNotion() }}
    >
      {/* Left accent stripe */}
      <div className="w-1 shrink-0 bg-gradient-to-b from-gray-800 to-gray-400" />

      <div className="flex-1 p-3 min-w-0">
        {/* Source badge row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-pm-text-muted font-medium">
            <NotionLogo className="h-3.5 w-3.5" />
            <span>Notion</span>
          </div>
          <div className="flex items-center gap-1">
            {onRefresh && (
              <button
                className="p-0.5 rounded hover:bg-muted text-pm-text-muted/40 hover:text-pm-text-muted transition-colors"
                onClick={(e) => { e.stopPropagation(); onRefresh() }}
                title={__('Refresh')}
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            )}
            <ExternalLink className="h-3 w-3 text-pm-text-muted/30" />
          </div>
        </div>

        {isError ? (
          <div>
            <span className="text-xs text-pm-text-muted">{isDatabase ? __('Database') : __('Page')}</span>
            {previewData.error && <p className="text-[10px] text-amber-600 mt-0.5">{previewData.error}</p>}
          </div>
        ) : (
          <div className="flex items-start gap-3">
            {/* Page icon */}
            <div className="shrink-0">
              {previewData.icon?.type === 'emoji' ? (
                <div className="h-11 w-11 rounded-lg bg-muted/40 flex items-center justify-center">
                  <span className="text-[26px] leading-none">{previewData.icon.value}</span>
                </div>
              ) : previewData.icon?.type === 'external' ? (
                <img src={previewData.icon.value} alt="" className="h-11 w-11 rounded-lg object-cover" />
              ) : (
                <div className="h-11 w-11 rounded-lg bg-muted/40 flex items-center justify-center text-pm-text-muted">
                  <TypeIcon className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Title */}
              <p className="text-sm font-semibold text-pm-text leading-snug">
                {previewData.title || __('Untitled')}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-2 text-[11px] text-pm-text-muted mt-1.5">
                <span className={cn(
                  'inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded',
                  isDatabase ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-gray-100'
                )}>
                  <TypeIcon className="h-3 w-3" />
                  {isDatabase ? __('Database') : __('Page')}
                </span>
                {previewData.last_edited_time && (
                  <span className="flex items-center gap-0.5 text-pm-text-muted/70">
                    <Clock className="h-3 w-3" />
                    {relativeEditTime(previewData.last_edited_time, __)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cover image on the right if available */}
      {previewData.cover_url && !isError && (
        <div className="w-24 shrink-0 bg-muted">
          <img src={previewData.cover_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}
