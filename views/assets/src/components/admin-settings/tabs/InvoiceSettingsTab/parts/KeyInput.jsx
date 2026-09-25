import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@components/ui/input';

/**
 * Masked API key field with a show/hide toggle. For secrets the server never
 * sends the saved value, so `saved` only switches the hint to "leave blank".
 */
export default function KeyInput({ value, onChange, placeholder, saved = false, label }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative max-w-full w-64">
      <Input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-7 w-full pr-8 text-sm font-mono"
        placeholder={saved ? __('Saved, type to replace', 'wedevs-project-manager') : placeholder}
        title={saved ? __('A key is saved. Leave this blank to keep it, or type a new key to replace it.', 'wedevs-project-manager') : undefined}
        autoComplete="new-password"
        spellCheck={false}
        aria-label={label}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-1.5 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-pm-text-muted hover:text-pm-text-primary"
        aria-label={show ? __('Hide key', 'wedevs-project-manager') : __('Show key', 'wedevs-project-manager')}
        title={show ? __('Hide key', 'wedevs-project-manager') : __('Show key', 'wedevs-project-manager')}
      >
        {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
