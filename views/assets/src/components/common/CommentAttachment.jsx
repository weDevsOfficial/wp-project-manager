import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Download, ExternalLink, File, FileArchive, FileSpreadsheet, FileText, Image as ImageIcon, Presentation, Video, X } from 'lucide-react'
import { cn } from '@lib/utils'
import { Button } from '@components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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

  const preview = canPreview ? (
    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
      <DialogContent
        data-pm-dialog
        className="!flex h-[90vh] w-[calc(100vw-2rem)] max-w-5xl flex-col !gap-0 overflow-hidden !p-0"
      >
        <DialogHeader className="shrink-0 !space-y-0 border-b px-6 py-3 pr-12">
          <DialogTitle className="truncate text-center text-base leading-6">
            {fileName}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isPdf
              ? __('PDF attachment preview', 'wedevs-project-manager')
              : isVideo
                ? __('Video attachment preview', 'wedevs-project-manager')
                : __('Image attachment preview', 'wedevs-project-manager')}
          </DialogDescription>
        </DialogHeader>
        <div className={cn(
          'flex min-h-0 flex-1 items-center justify-center overflow-auto',
          isImage || isVideo ? 'bg-black/90 p-4' : 'bg-background',
        )}>
          {isPdf ? (
            <iframe
              src={file.url}
              title={fileName}
              className="h-full w-full bg-background"
            />
          ) : isVideo ? (
            <video controls className="max-h-full max-w-full bg-black" preload="metadata">
              <source src={file.url} type={videoType} />
              {__('Your browser does not support the video tag.', 'wedevs-project-manager')}
            </video>
          ) : (
            <img
              src={file.url || imageUrl}
              alt={fileName}
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t bg-background px-6 py-3">
          <Button asChild variant="outline" size="sm" className="no-underline hover:no-underline focus:no-underline">
            <a href={file.url} download={fileName}>
              <Download className="h-4 w-4" />
              {__('Download', 'wedevs-project-manager')}
            </a>
          </Button>
          <Button asChild size="sm" className="no-underline hover:no-underline focus:no-underline">
            <a href={file.url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              {__('Open in new tab', 'wedevs-project-manager')}
            </a>
          </Button>
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
