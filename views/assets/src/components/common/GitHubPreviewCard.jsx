import { __ } from '@wordpress/i18n';
/**
 * GitHubPreviewCard — displays a single GitHub issue/PR preview card.
 */
import React from 'react'
import { cn } from '@lib/utils'
import { Skeleton } from '@components/ui/skeleton'
import {
  GitPullRequest, GitPullRequestClosed, GitMerge,
  CircleDot, CircleCheck, RefreshCw, ExternalLink,
} from 'lucide-react'

// GitHub Octocat brand SVG (not available as non-deprecated lucide icon)
const GitHubLogo = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

function labelTextColor(hexColor) {
  if (!hexColor) return '#333'
  const r = parseInt(hexColor.substring(0, 2), 16)
  const g = parseInt(hexColor.substring(2, 4), 16)
  const b = parseInt(hexColor.substring(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#24292f' : '#ffffff'
}

function relativeTime(dateStr) {
  if (!dateStr) return ''
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 365) return `${Math.floor(days / 365)}y ago`
  if (days > 30)  return `${Math.floor(days / 30)}mo ago`
  if (days > 0)   return `${days}d ago`
  if (hours > 0)  return `${hours}h ago`
  if (mins > 0)   return `${mins}m ago`
  return 'just now'
}

function StateIcon({ state, type }) {
  const cls = 'h-3.5 w-3.5'
  if (state === 'merged')  return <GitMerge className={cn(cls, 'text-purple-600')} />
  if (state === 'closed' && type === 'pull_request') return <GitPullRequestClosed className={cn(cls, 'text-red-600')} />
  if (state === 'closed')  return <CircleCheck className={cn(cls, 'text-red-600')} />
  if (type === 'pull_request') return <GitPullRequest className={cn(cls, 'text-green-600')} />
  return <CircleDot className={cn(cls, 'text-green-600')} />
}

export default function GitHubPreviewCard({ previewData, loading, url, onRefresh }) {

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-pm-border p-3 bg-pm-surface max-w-md">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    )
  }

  if (!previewData) return null

  const isError = previewData.state === 'access_denied' || previewData.state === 'error' || previewData.state === 'rate_limited'
  const typeLabel = previewData.type === 'pull_request' ? __('PR', 'wedevs-project-manager') : __('Issue', 'wedevs-project-manager')

  const stateColors = {
    open:   'text-green-600 bg-green-50',
    closed: 'text-red-600 bg-red-50',
    merged: 'text-purple-600 bg-purple-50',
  }

  const openInGitHubLogo = () => {
    const target = previewData.html_url || url
    if (!target) return
    try {
      const parsed = new URL(target)
      if (parsed.protocol === 'https:' && /^(www\.)?github\.com$/.test(parsed.hostname)) {
        window.open(target, '_blank', 'noopener,noreferrer')
      }
    } catch { /* invalid URL */ }
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-pm-border p-3 bg-pm-surface max-w-md cursor-pointer hover:border-pm-accent/40 hover:shadow-sm transition-all',
        isError && 'opacity-70'
      )}
      onClick={openInGitHubLogo}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') openInGitHubLogo() }}
    >
      {/* Source badge row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[13px] text-pm-text-muted font-medium">
          <GitHubLogo className="h-4 w-4" />
          <span>GitHub</span>
          {previewData.repository?.full_name && (
            <span className="text-pm-text-muted/60">&middot; {previewData.repository.full_name}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <button
              className="p-0.5 rounded hover:bg-muted text-pm-text-muted/40 hover:text-pm-text-muted transition-colors"
              onClick={(e) => { e.stopPropagation(); onRefresh() }}
              title={__('Refresh', 'wedevs-project-manager')}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
          <ExternalLink className="h-3.5 w-3.5 text-pm-text-muted/30" />
        </div>
      </div>

      {isError ? (
        <div>
          <span className="text-sm text-pm-text-muted">{typeLabel} #{previewData.number}</span>
          {previewData.error && <p className="text-[14px] text-amber-600 mt-0.5">{previewData.error}</p>}
        </div>
      ) : (
        <div className="flex items-start gap-2.5">
          {/* Author avatar */}
          <div className="shrink-0 mt-0.5">
            {previewData.author?.avatar_url ? (
              <img src={previewData.author.avatar_url} alt={previewData.author.login} className="h-7 w-7 rounded-full" />
            ) : (
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-pm-text-muted">
                <GitHubLogo className="h-5 w-5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title + state badge */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-medium text-pm-text leading-tight">{previewData.title}</span>
              {previewData.state && (
                <span className={cn('inline-flex items-center gap-0.5 text-[14px] font-medium px-1.5 py-0.5 rounded-full capitalize', stateColors[previewData.state] || 'text-pm-text-muted bg-muted')}>
                  <StateIcon state={previewData.state} type={previewData.type} />
                  {previewData.state}
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-1.5 text-[15px] text-pm-text-muted mt-0.5 flex-wrap">
              <span className="font-medium">{typeLabel}</span>
              <span>#{previewData.number}</span>
              {previewData.author && <><span>&middot;</span><span>{previewData.author.login}</span></>}
              {previewData.created_at && <><span>&middot;</span><span>{relativeTime(previewData.created_at)}</span></>}
            </div>

            {/* Labels */}
            {previewData.labels?.length > 0 && (
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                {previewData.labels.map((label, i) => (
                  <span key={i} className="text-[14px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `#${label.color}`, color: labelTextColor(label.color) }}>
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
