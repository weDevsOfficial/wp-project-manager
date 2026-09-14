import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Download, ExternalLink, File, FileArchive, FileSpreadsheet, FileText, Image as ImageIcon, Presentation, RotateCcw, Video, X, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@components/ui/dialog'

function getFileType(file) {
  return (file?.mime_type || file?.mime || file?.type || '').toLowerCase()
}

function getFileName(file) {
  return file?.name || file?.title || file?.meta?.title || __('Attachment', 'wedevs-project-manager')
}

function hasFileExtension(file, pattern) {
  return [
    file?.file_extension,
    getFileName(file),
    file?.url,
  ].filter(Boolean).some(value => pattern.test(String(value)))
}

function isImageFile(file) {
  const type = getFileType(file)

  return type === 'image' || type.startsWith('image/') || hasFileExtension(file, /(^|\.)((avif|bmp|gif|jpe?g|png|svg|webp))(\?.*)?$/i)
}

function isPdfFile(file) {
  const type = getFileType(file)

  return type.includes('pdf') || hasFileExtension(file, /(^|\.)pdf(\?.*)?$/i)
}

function isVideoFile(file) {
  const type = getFileType(file)

  return type === 'video' || type.startsWith('video/') || hasFileExtension(file, /(^|\.)(mp4|m4v|mov|ogv|webm)(\?.*)?$/i)
}

function getFileIconMeta(file) {
  const type = getFileType(file)

  if (isImageFile(file)) return { Icon: ImageIcon, className: 'text-blue-500' }
  if (isVideoFile(file)) return { Icon: Video, className: 'text-violet-500' }
  if (isPdfFile(file)) return { Icon: FileText, className: 'text-red-600' }
  if (type.includes('zip') || type.includes('archive') || type.includes('rar') || type.includes('compressed')) {
    return { Icon: FileArchive, className: 'text-amber-600' }
  }
  if (type.includes('spreadsheet') || type.includes('excel') || hasFileExtension(file, /(^|\.)(xls|xlsx|csv)(\?.*)?$/i)) {
    return { Icon: FileSpreadsheet, className: 'text-emerald-600' }
  }
  if (type.includes('presentation') || type.includes('powerpoint') || hasFileExtension(file, /(^|\.)(ppt|pptx)(\?.*)?$/i)) {
    return { Icon: Presentation, className: 'text-amber-500' }
  }
  if (type.includes('document') || type.includes('text') || hasFileExtension(file, /(^|\.)(doc|docx|txt|rtf)(\?.*)?$/i)) {
    return { Icon: FileText, className: 'text-blue-500' }
  }

  return { Icon: File, className: 'text-pm-text-muted' }
}

export default function CommentAttachment({ file, onRemove, className, children, previewOnly = false }) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const fileName = getFileName(file)
  const isPdf = isPdfFile(file) && file?.url
  const isVideo = isVideoFile(file) && file?.url
  const isImage = !isPdf && !isVideo && isImageFile(file) && (file?.thumb || file?.url)
  const imageUrl = file?.thumb || file?.url
  const canPreview = Boolean(file?.url && (isImage || isPdf || isVideo))
  const { Icon, className: iconClassName } = getFileIconMeta(file)
  const videoType = getFileType(file).startsWith('video/') ? getFileType(file) : undefined

  useEffect(() => {
    setImageFailed(false)
  }, [file?.id, file?.thumb, file?.url])

  // Reset image zoom/rotation each time the viewer opens or the file changes.
  useEffect(() => {
    if (!previewOpen) return
    setZoom(1)
    setRotation(0)
  }, [previewOpen, file?.id, file?.url])

  const fileContent = (
    <span className="inline-flex max-w-[220px] items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1.5">
      <Icon className={cn('h-5 w-5 shrink-0', iconClassName)} />
      <span className="truncate text-sm text-pm-text-primary">{fileName}</span>
    </span>
  )

  const defaultContent = isImage && !imageFailed ? (
    <span className="inline-flex h-24 w-32 items-center justify-center overflow-hidden rounded-md bg-background p-1">
      <img
        src={imageUrl}
        alt={fileName}
        className="block max-h-20 max-w-28 object-contain"
        onError={() => setImageFailed(true)}
      />
    </span>
  ) : fileContent
  const content = children || defaultContent

  const classes = cn(
    'relative inline-flex rounded-md border border-border/60 bg-background no-underline transition-colors hover:border-pm-accent/50',
    children && 'border-0 bg-transparent hover:border-transparent',
    className,
  )

  const pdfSrc = isPdf ? `${file.url}${file.url.includes('#') ? '&' : '#'}toolbar=0&navpanes=0&statusbar=0&zoom=page-width` : null

  const preview = canPreview ? (
    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
      <DialogContent
        data-pm-dialog
        style={{ maxHeight: '96vh', width: 'calc(100vw - 2rem)' }}
        className="!flex max-w-6xl flex-col !gap-0 overflow-hidden rounded-2xl sm:rounded-2xl !p-0"
      >
        {/* Header: file identity (built-in close sits top-right) */}
        <div className="flex shrink-0 items-center gap-2.5 border-b border-border bg-background px-5 py-3 pr-14">
          <Icon className={cn('h-5 w-5 shrink-0', iconClassName)} />
          <DialogTitle className="min-w-0 flex-1 truncate text-left text-sm font-medium text-pm-text-primary">
            {fileName}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isPdf
              ? __('PDF attachment preview', 'wedevs-project-manager')
              : isVideo
                ? __('Video attachment preview', 'wedevs-project-manager')
                : __('Image attachment preview', 'wedevs-project-manager')}
          </DialogDescription>
        </div>

        {/* Media */}
        <div
          style={isPdf ? { height: '70vh' } : undefined}
          className={cn(
            'relative flex min-h-0 overflow-auto',
            isImage
              ? 'items-center justify-center bg-neutral-100 p-4 dark:bg-neutral-900'
              : isVideo
                ? 'items-center justify-center bg-black p-4'
                : 'bg-neutral-100 dark:bg-neutral-900',
          )}
        >
          {isPdf ? (
            <iframe
              src={pdfSrc}
              title={fileName}
              className="absolute inset-0 h-full w-full border-0 bg-white"
            />
          ) : isVideo ? (
            <video controls className="max-h-[80vh] max-w-full bg-black" preload="metadata">
              <source src={file.url} type={videoType} />
              {__('Your browser does not support the video tag.', 'wedevs-project-manager')}
            </video>
          ) : (
            <img
              src={file.url || imageUrl}
              alt={fileName}
              draggable={false}
              className="max-h-[80vh] max-w-full object-contain transition-transform duration-150"
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
            />
          )}
        </div>

        {/* Bottom action bar — icon above label */}
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-1 border-t border-border bg-background px-4 py-2">
          {isImage && (
            <>
              <button
                type="button"
                title={__('Zoom out', 'wedevs-project-manager')}
                disabled={zoom <= 0.5}
                onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.25) * 100) / 100))}
                className="flex min-w-[64px] flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-pm-text-primary transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ZoomOut className="h-5 w-5" />
                {__('Zoom out', 'wedevs-project-manager')}
              </button>
              <span className="w-12 select-none text-center text-xs tabular-nums text-pm-text-muted">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                title={__('Zoom in', 'wedevs-project-manager')}
                disabled={zoom >= 4}
                onClick={() => setZoom((z) => Math.min(4, Math.round((z + 0.25) * 100) / 100))}
                className="flex min-w-[64px] flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-pm-text-primary transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ZoomIn className="h-5 w-5" />
                {__('Zoom in', 'wedevs-project-manager')}
              </button>
              <button
                type="button"
                title={__('Rotate', 'wedevs-project-manager')}
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex min-w-[64px] flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-pm-text-primary transition-colors hover:bg-muted"
              >
                <RotateCcw className="h-5 w-5" />
                {__('Rotate', 'wedevs-project-manager')}
              </button>
              <span className="mx-1 h-8 w-px bg-border" aria-hidden="true" />
            </>
          )}
          <a
            href={file.url}
            download={fileName}
            className="flex min-w-[64px] flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-pm-text-primary no-underline transition-colors hover:bg-muted hover:no-underline"
          >
            <Download className="h-5 w-5" />
            {__('Download', 'wedevs-project-manager')}
          </a>
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-[64px] flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-pm-text-primary no-underline transition-colors hover:bg-muted hover:no-underline"
          >
            <ExternalLink className="h-5 w-5" />
            {__('Open', 'wedevs-project-manager')}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  ) : null

  const previewButton = (
    <button
      type="button"
      title={fileName}
      className={cn(classes, 'cursor-pointer text-left')}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        setPreviewOpen(true)
      }}
    >
      {content}
    </button>
  )

  if (onRemove) {
    return (
      <>
        <span className={cn(classes, canPreview && 'border-0 bg-transparent')} title={fileName}>
          {canPreview ? previewButton : content}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onRemove(file.id)
            }}
            className="absolute -right-1.5 -top-1.5 z-10 rounded-full border border-border/60 bg-background p-0.5 text-pm-text-muted shadow-sm hover:border-destructive/40 hover:text-destructive"
            title={__('Remove', 'wedevs-project-manager')}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
        {preview}
      </>
    )
  }

  if (!file?.url) {
    return <span className={classes} title={fileName}>{content}</span>
  }

  if (canPreview) {
    return (
      <>
        {previewButton}
        {preview}
      </>
    )
  }

  if (previewOnly) {
    return <span className={classes} title={fileName}>{content}</span>
  }

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noreferrer"
      title={fileName}
      className={classes}
    >
      {content}
    </a>
  )
}
