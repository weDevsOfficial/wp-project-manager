import React, { useRef, useState } from 'react'
import { Button } from '@components/ui/button'
import { Paperclip, X, FileText, Image } from 'lucide-react'
import { useI18n } from '@hooks/useI18n'

function fileIcon(file) {
  if (file.type?.startsWith('image')) return Image
  return FileText
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
        {files.map((f, i) => {
          const Icon = fileIcon(f)
          return (
            <span key={i} className="inline-flex items-center gap-1 text-xs bg-muted/50 px-2 py-1 rounded-md">
              <Icon className="h-3 w-3 text-pm-text-muted" />
              <span className="truncate max-w-[120px]">{f.name}</span>
              <button type="button" onClick={() => handleRemove(i)} className="text-pm-text-muted hover:text-destructive ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </span>
          )
        })}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1 text-xs text-pm-accent hover:text-pm-accent/80 transition-colors"
        >
          <Paperclip className="h-3 w-3" />
          {__('Attach')}
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
        <p className="text-xs text-pm-text-muted">{__('Click to attach files')}</p>
        <p className="text-[10px] text-pm-text-muted/60 mt-0.5">{__('or drag and drop')}</p>
      </div>
      <input ref={inputRef} type="file" multiple className="hidden" onChange={handleSelect} />

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((f, i) => {
            const Icon = fileIcon(f)
            return (
              <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-md px-3 py-1.5">
                <Icon className="h-4 w-4 text-pm-text-muted shrink-0" />
                <span className="text-xs text-pm-text-primary flex-1 truncate">{f.name}</span>
                <span className="text-[10px] text-pm-text-muted tabular-nums">{(f.size / 1024).toFixed(0)} KB</span>
                <button type="button" onClick={() => handleRemove(i)} className="text-pm-text-muted hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
