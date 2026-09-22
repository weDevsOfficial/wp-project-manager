import { __ } from '@wordpress/i18n'
import React, { useCallback, useEffect, useState } from 'react'
import { Check, Loader2, Plus, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { cn } from '@lib/utils'

/**
 * One picker for the task sheet's single-value attributes (Type, Priority,
 * Milestone, Pro's Sprint), in the Label picker's design: a chip with the
 * field's icon (dashed while empty, no chevron), a list with a check on the
 * chosen row, and an optional "+ Create" form whose name is required.
 *
 * options:  [{ id, label, leading?, trailing? }]
 * value:    id of the chosen option, or null
 * create:   { label, placeholder, requiredMessage, extra?, onSubmit(title) -> Promise, onReset? }
 */
export default function AttributePicker({
  icon: Icon,
  value = null,
  options = [],
  onSelect,
  onClear,
  canEdit = true,
  saving = false,
  loading = false,
  placeholder = '',
  readOnlyText,
  triggerText,
  emptyText,
  noneLabel,
  clearLabel,
  create,
  widthClass = 'w-56',
  onOpenChange,
}) {
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const selected = options.find((o) => String(o.id) === String(value)) || null

  const resetCreate = useCallback(() => {
    setCreating(false)
    setTitle('')
    setError('')
    create?.onReset?.()
  }, [create])

  const changeOpen = (next) => {
    if (!canEdit) return
    setOpen(next)
    if (!next) resetCreate()
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!canEdit && open) setOpen(false)
  }, [canEdit, open])

  const choose = (option) => {
    setOpen(false)
    resetCreate()
    onSelect?.(option)
  }

  const submitCreate = async () => {
    const name = title.trim()
    if (!name) {
      setError(create.requiredMessage)
      return
    }
    if (busy) return
    setBusy(true)
    try {
      await create.onSubmit(name)
      setOpen(false)
      resetCreate()
    } catch (e) {
      setError((e && e.message) || (typeof e === 'string' && e) || create.failedMessage || '')
    } finally {
      setBusy(false)
    }
  }

  const label = triggerText ?? (selected ? selected.label : placeholder)

  if (!canEdit) {
    return (
      <span className={cn('text-sm', selected ? 'text-pm-text-primary' : 'text-pm-text-muted')}>
        {readOnlyText ?? (selected ? selected.label : '—')}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1 min-w-0">
      <Popover open={open} onOpenChange={changeOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={saving}
            className={cn(
              'inline-flex items-center gap-1 min-w-0 max-w-full px-1.5 py-0.5 rounded border text-sm transition-colors hover:text-pm-accent hover:border-pm-accent/30 disabled:opacity-50',
              selected ? 'border-pm-border/50 text-pm-text-primary' : 'border-dashed border-pm-border/50 text-pm-text-muted',
            )}
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                <span>{__('Saving...', 'wedevs-project-manager')}</span>
              </>
            ) : (
              <>
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                <span className="truncate">{label}</span>
              </>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className={cn(widthClass, 'p-1')} align="start">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {noneLabel && (
                <button
                  type="button"
                  onClick={() => choose(null)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left text-foreground hover:bg-muted/50 transition-colors',
                    !selected && 'bg-pm-accent/5 text-pm-accent font-medium',
                  )}
                >
                  <span className="flex-1 italic">{noneLabel}</span>
                  {!selected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              )}
              {options.map((o) => {
                const isSelected = selected && String(selected.id) === String(o.id)
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(o)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left text-foreground hover:bg-muted/50 transition-colors',
                      isSelected && 'bg-pm-accent/5 text-pm-accent font-medium',
                    )}
                  >
                    {o.leading}
                    <span className="flex-1 truncate">{o.label}</span>
                    {o.trailing}
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                )
              })}
              {options.length === 0 && !noneLabel && (
                <p className="px-2 py-3 text-sm text-pm-text-muted text-center">{emptyText}</p>
              )}
              {options.length === 0 && noneLabel && emptyText && (
                <p className="px-2 py-1.5 text-sm text-pm-text-muted italic">{emptyText}</p>
              )}
              {clearLabel && selected && onClear && (
                <>
                  <div className="border-t border-border my-1" />
                  <button
                    type="button"
                    onClick={() => { setOpen(false); onClear() }}
                    className="w-full text-left text-sm px-2 py-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    {clearLabel}
                  </button>
                </>
              )}
            </div>
          )}

          {create && !loading && (creating ? (
            <div className="space-y-2 p-1 pt-2 mt-1 border-t border-pm-border/50">
              <Input
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (error) setError('') }}
                placeholder={create.placeholder}
                aria-label={create.placeholder}
                aria-required="true"
                aria-invalid={error ? 'true' : undefined}
                className={cn('h-7 text-sm', error && 'border-red-500 focus-visible:border-red-500')}
                autoFocus
                disabled={busy}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitCreate() } }}
              />
              {error && <p className="text-[12px] text-red-500" role="alert">{error}</p>}
              {create.extra}
              <div className="flex gap-1">
                <Button size="sm" className="h-11 text-[14px]" onClick={submitCreate} disabled={busy}>
                  {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {__('Add', 'wedevs-project-manager')}
                </Button>
                <Button size="sm" variant="outline" className="h-11 text-[14px]" onClick={resetCreate} disabled={busy}>
                  {__('Cancel', 'wedevs-project-manager')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-1 pt-1 border-t border-pm-border/50">
              <button
                type="button"
                className="text-sm text-pm-accent hover:underline flex items-center gap-1 px-2 py-1.5"
                onClick={() => setCreating(true)}
              >
                <Plus className="h-3.5 w-3.5" />{create.label}
              </button>
            </div>
          ))}
        </PopoverContent>
      </Popover>

      {onClear && selected && !saving && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center text-pm-text-muted hover:text-destructive transition-colors"
          title={clearLabel || __('Remove', 'wedevs-project-manager')}
          aria-label={clearLabel || __('Remove', 'wedevs-project-manager')}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
