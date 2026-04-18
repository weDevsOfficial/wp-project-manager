import React, { useState } from 'react';
import { useI18n } from '@hooks/useI18n';
import { Input } from '@components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { cn } from '@/lib/utils';
import { PRESET_COLORS } from '../constants';

export default function ColorPicker({ value, onChange }) {
  const { __ } = useI18n();
  const [hex, setHex] = useState(value || '#82b541');

  const handleHexChange = (v) => {
    setHex(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
  };

  const selectPreset = (c) => {
    setHex(c);
    onChange(c);
  };

  React.useEffect(() => { setHex(value || '') }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 h-8 px-2 rounded-md border border-pm-border hover:border-pm-accent/50 transition-colors"
        >
          <span className="w-5 h-5 rounded border border-pm-border/50" style={{ backgroundColor: value || '#ccc' }} />
          <span className="text-sm font-mono text-pm-text-muted">{value || '#82b541'}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded border border-pm-border" style={{ backgroundColor: hex }} />
            <Input
              value={hex}
              onChange={e => handleHexChange(e.target.value)}
              className="h-7 text-sm font-mono flex-1"
              placeholder="#82b541"
            />
          </div>
          <input
            type="color"
            value={hex}
            onChange={e => { setHex(e.target.value); onChange(e.target.value) }}
            className="w-full h-8 rounded border border-pm-border cursor-pointer"
          />
          <div>
            <p className="text-[13px] text-pm-text-muted mb-1.5">{__('Presets')}</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => selectPreset(c)}
                  className={cn(
                    'w-5 h-5 rounded border-2 transition-transform hover:scale-125',
                    value === c ? 'border-pm-accent ring-1 ring-pm-accent/30' : 'border-transparent'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
