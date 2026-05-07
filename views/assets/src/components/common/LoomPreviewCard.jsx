/**
 * LoomPreviewCard — Loom video preview with thumbnail, overlay info bar, and embed modal.
 */
import React, { useState } from 'react'
import { useI18n } from '@hooks/useI18n'
import { cn } from '@lib/utils'
import { Skeleton } from '@components/ui/skeleton'
import { Dialog, DialogContent } from '@components/ui/dialog'
import { RefreshCw, Play, ExternalLink, User } from 'lucide-react'

// Loom brand starburst logo — exact SVG from Vue PR #586
const LoomLogo = ({ className = '' }) => (
  <svg viewBox="0 0 62 62" fill="#625DF5" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M62,27.6H43.9l15.7-9.1l-3.4-6l-15.7,9.1l9.1-15.7l-6-3.5l-9.1,15.7V0h-6.9v18.1L18.5,2.4l-6,3.4l9.1,15.7L5.9,12.5l-3.4,6l15.7,9.1H0v6.9h18.1L2.4,43.5l3.4,6l15.7-9.1l-9.1,15.7l6,3.4l9.1-15.7V62h6.9V43.9l9.1,15.7l6-3.4l-9.1-15.7l15.7,9.1l3.4-6l-15.7-9.1H62L62,27.6L62,27.6z M31,40.4c-5.2,0-9.4-4.2-9.4-9.4c0-5.2,4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4C40.4,36.2,36.2,40.4,31,40.4z" />
  </svg>
)

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function LoomPreviewCard({ previewData, loading, url, onRefresh }) {
  const { __ } = useI18n()
  const [embedOpen, setEmbedOpen] = useState(false)

  if (loading) {
    return (
      <div className="rounded-lg border border-pm-border bg-pm-surface max-w-md overflow-hidden">
        <Skeleton className="h-36 w-full" />
        <div className="p-3 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    )
  }

  if (!previewData) return null

  const isError = previewData.state === 'access_denied' || previewData.state === 'error' || previewData.state === 'rate_limited'
  const duration = formatDuration(previewData.duration)

  const openEmbed = (e) => {
    e.stopPropagation()
    if (isError) return
    if (previewData.embed_url) {
      setEmbedOpen(true)
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openEmbed(e)
    }
  }

  return (
    <>
      <div
        className={cn(
          'rounded-lg border border-pm-border bg-pm-surface max-w-md overflow-hidden cursor-pointer hover:border-pm-accent/40 hover:shadow-sm transition-all',
          isError && 'opacity-70 cursor-default'
        )}
        role="button"
        tabIndex={0}
        aria-disabled={isError}
        onClick={openEmbed}
        onKeyDown={handleKeyDown}
      >
        {/* Source badge row */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
          <div className="flex items-center gap-1.5 text-[13px] text-pm-text-muted font-medium">
            <LoomLogo className="h-4 w-4" />
            <span>Loom</span>
          </div>
          <div className="flex items-center gap-1">
            {onRefresh && (
              <button
                className="p-0.5 rounded hover:bg-muted text-pm-text-muted/40 hover:text-pm-text-muted transition-colors"
                onClick={(e) => { e.stopPropagation(); onRefresh() }}
                title={__('Refresh')}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
            <ExternalLink className="h-3.5 w-3.5 text-pm-text-muted/30" />
          </div>
        </div>

        {isError ? (
          <div className="px-3 pb-3">
            <span className="text-sm text-pm-text-muted">{__('Loom Video')}</span>
            {previewData.error && <p className="text-[14px] text-amber-600 mt-0.5">{previewData.error}</p>}
          </div>
        ) : (
          <>
            {/* Thumbnail with play overlay + duration */}
            {previewData.thumbnail_url && (
              <div className="relative mx-3 mb-2 rounded-md overflow-hidden bg-black">
                <img src={previewData.thumbnail_url} alt={previewData.title || ''} className="w-full h-36 object-cover opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-11 w-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                    <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
                {/* Bottom gradient bar with author + duration */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pb-2 pt-6">
                  <div className="flex items-center justify-between">
                    {previewData.author_name && (
                      <span className="flex items-center gap-1 text-[14px] text-white/80 font-medium">
                        <User className="h-3.5 w-3.5" />
                        {previewData.author_name}
                      </span>
                    )}
                    {duration && (
                      <span className="text-[14px] font-medium text-white bg-black/50 px-1.5 py-0.5 rounded">
                        {duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="px-3 pb-3">
              <p className="text-sm font-medium text-pm-text leading-tight truncate">
                {previewData.title || __('Untitled Video')}
              </p>
              {previewData.description && (
                <p className="text-[15px] text-pm-text-muted mt-0.5 line-clamp-1">{previewData.description}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Embed modal */}
      {previewData.embed_url && (
        <Dialog open={embedOpen} onOpenChange={setEmbedOpen}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden" data-pm-dialog>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={previewData.embed_url}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
