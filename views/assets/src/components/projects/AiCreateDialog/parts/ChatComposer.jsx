import { __ } from '@wordpress/i18n';
import React, { useRef, useState } from 'react';
import { AiMagic, ArrowUp } from 'lucide-react';

// Chat-style composer docked at the bottom. Enter sends, Shift+Enter newlines.
// Left chip shows the AI model selected in settings; no controls we don't
// actually support (no model picker/mic here — model is chosen in Settings).
export default function ChatComposer({ onSend, disabled, placeholder, model }) {
  const [value, setValue] = useState('');
  const taRef = useRef(null);

  const reset = () => {
    setValue('');
    if (taRef.current) taRef.current.style.height = 'auto';
  };

  const submit = () => {
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    reset();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onChange = (e) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(320, el.scrollHeight)}px`;
  };

  return (
    <div className="px-4 pb-4 pt-1">
      <div className="rounded-2xl border border-pm-border bg-pm-surface shadow-sm transition-colors focus-within:border-pm-accent/50">
        <textarea
          ref={taRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          rows={1}
          disabled={disabled}
          placeholder={placeholder || __('Describe your project…', 'wedevs-project-manager')}
          className="block min-h-[120px] w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm text-pm-text-primary placeholder:text-pm-text-muted/60 focus:outline-none disabled:opacity-60"
        />
        <div className="flex items-center justify-between px-2.5 pb-2.5 pt-1">
          <span
            className="inline-flex max-w-[240px] items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-pm-text-muted"
            title={model ? __('AI model (change in Settings)', 'wedevs-project-manager') : undefined}
          >
            <AiMagic className="h-3.5 w-3.5 shrink-0 text-pm-accent" />
            <span className="truncate">{model || __('AI', 'wedevs-project-manager')}</span>
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={disabled || !value.trim()}
            aria-label={__('Send', 'wedevs-project-manager')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-pm-accent text-white shadow-sm transition-colors hover:bg-pm-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
