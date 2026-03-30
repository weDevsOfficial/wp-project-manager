import React, { useRef, useState, useEffect } from 'react'
import { Button } from '@components/ui/button'
import { Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react'
import { useI18n } from '@hooks/useI18n'

function fileIcon(file) {
  if (file.type?.startsWith('image')) return ImageIcon
  return FileText
}

function FileThumbnail({ file }) {
  const [preview, setPreview] = useState(null)
  useEffect(() => {
    if (file.type?.startsWith('image')) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])
  if (preview) return <img src={preview} alt="" className="h-8 w-8 rounded object-cover shrink-0" />
  const Icon = fileIcon(file)
  return <Icon className="h-3.5 w-3.5 text-pm-text-muted" />
}

export default function FileUploadArea({ files = [], onFilesChange, compact = false }) {
  const { __ } = useI18n()
  const inputRef = useRef(null)

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length > 0) {
      onFilesChange([...files, ...selected])
    }
    e.target.value = ''
  }

  const handleRemove = (index) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {files.map((f, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 text-sm bg-muted/50 px-2 py-1 rounded-md border border-border/50">
            <FileThumbnail file={f} />
            <span className="truncate max-w-[120px]">{f.name}</span>
            <span className="text-[11px] text-pm-text-muted tabular-nums">{(f.size / 1024).toFixed(0)}KB</span>
            <button type="button" onClick={() => handleRemove(i)} className="text-pm-text-muted hover:text-destructive ml-0.5">
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1 text-sm text-pm-accent hover:text-pm-accent/80 transition-colors"
        >
          <Paperclip className="h-3.5 w-3.5" />
          {files.length > 0 ? __('More') : __('Attach')}
        </button>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleSelect} />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-border/60 rounded-lg p-4 text-center hover:border-pm-accent/40 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <Paperclip className="h-5 w-5 text-pm-text-muted/50 mx-auto mb-1.5" />
        <p className="text-sm text-pm-text-muted">{__('Click to attach files')}</p>
        <p className="text-[13px] text-pm-text-muted/60 mt-0.5">{__('or drag and drop')}</p>
      </div>
      <input ref={inputRef} type="file" multiple className="hidden" onChange={handleSelect} />

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-md px-3 py-1.5">
              <FileThumbnail file={f} />
              <span className="text-sm text-pm-text-primary flex-1 truncate">{f.name}</span>
              <span className="text-[13px] text-pm-text-muted tabular-nums">{(f.size / 1024).toFixed(0)} KB</span>
              <button type="button" onClick={() => handleRemove(i)} className="text-pm-text-muted hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
