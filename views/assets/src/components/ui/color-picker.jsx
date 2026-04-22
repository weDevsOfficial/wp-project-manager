import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { cn } from '@/lib/utils'
import { LABEL_COLOR_PRESETS } from '@lib/colorPresets'

const HEX_RE = /^#([0-9a-fA-F]{3}){1,2}$/

function normalizeHex(v) {
  if (!v) return ''
  const s = String(v).trim()
  if (!s) return ''
  return s.startsWith('#') ? s : `#${s}`
}

function isValidHex(v) {
  return HEX_RE.test(v || '')
}

const ColorPicker = React.forwardRef(function ColorPicker(
  {
    value = '',
    onChange,
    presetColors = LABEL_COLOR_PRESETS,
    triggerLabel,
    disabled = false,
    className,
    align = 'start',
    showClear = true,
    placeholder = '#000000',
  },
  ref
) {
  const [open, setOpen] = React.useState(false)
  const [hexInput, setHexInput] = React.useState(value || '')

  React.useEffect(() => { setHexInput(value || '') }, [value])

  const commit = (next) => {
    const n = normalizeHex(next)
    if (typeof onChange === 'function') onChange(n)
  }

  const handleHexInput = (v) => {
    setHexInput(v)
    const n = normalizeHex(v)
    if (isValidHex(n)) commit(n)
  }

  const handlePickerInput = (v) => {
    setHexInput(v)
    commit(v)
  }

  const selectPreset = (c) => {
    setHexInput(c)
    commit(c)
  }

  const clear = () => {
    setHexInput('')
    commit('')
  }

  const displayColor = isValidHex(normalizeHex(value)) ? value : ''

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          className={cn(
            'inline-flex items-center gap-2 h-8 px-2 rounded-md border border-pm-border bg-white hover:border-pm-accent/50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
        >
          <span
            className="w-5 h-5 rounded border border-pm-border/60"
            style={{ backgroundColor: displayColor || 'transparent', backgroundImage: displayColor ? undefined : 'linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)', backgroundSize: '8px 8px', backgroundPosition: '0 0,0 4px,4px -4px,-4px 0' }}
          />
          <span className="font-mono text-pm-text-muted">
            {displayColor || triggerLabel || placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3" align={align}>
        <div className="space-y-3">
          <input
            type="color"
            value={isValidHex(normalizeHex(hexInput)) ? normalizeHex(hexInput) : '#000000'}
            onChange={(e) => handlePickerInput(e.target.value)}
            className="w-full h-24 rounded border border-pm-border cursor-pointer p-0"
            aria-label="Color picker"
          />

          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded border border-pm-border shrink-0"
              style={{ backgroundColor: isValidHex(normalizeHex(hexInput)) ? normalizeHex(hexInput) : 'transparent' }}
            />
            <Input
              value={hexInput}
              onChange={(e) => handleHexInput(e.target.value)}
              className="h-7 text-sm font-mono flex-1"
              placeholder={placeholder}
              spellCheck={false}
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-1.5">
              {presetColors.map((c) => {
                const selected = normalizeHex(value).toLowerCase() === c.toLowerCase()
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => selectPreset(c)}
                    className={cn(
                      'w-5 h-5 rounded border transition-transform hover:scale-125',
                      selected ? 'border-pm-text scale-110' : 'border-pm-border/60'
                    )}
                    style={{ backgroundColor: c }}
                    title={c}
                    aria-label={c}
                  />
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-1 pt-1 border-t border-pm-border/50">
            {showClear && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-6 text-xs"
                onClick={clear}
              >
                Clear
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-6 text-xs"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
})

export { ColorPicker }
export default ColorPicker
