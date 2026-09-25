import { __ } from '@wordpress/i18n';
import React from 'react';
import { AiMagic, Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Pop-stack process card: the running task sits prominent at the bottom; when it
// finishes it shrinks + blurs and recedes to the top of the stack, and the next
// task pops in below it. Pending tasks are hidden until they become active, so
// each one "pops" into view. Used for both generation and creation.
export default function CreationSteps({ title, items = [] }) {
  const allDone = items.length > 0 && items.every((s) => s.status === 'done');
  const anyError = items.some((s) => s.status === 'error');
  const anyActive = items.some((s) => s.status === 'active');

  return (
    <div className="rounded-xl border border-pm-border bg-card p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-pm-text-primary">
          <AiMagic className="h-3.5 w-3.5 text-pm-accent" />
          {title}
        </div>
        <StatusTag allDone={allDone} anyError={anyError} anyActive={anyActive} />
      </div>

      <div className="space-y-1">
        {items.map((it, i) => {
          // Pending tasks stay hidden — they mount (and pop in) only once active.
          if (it.status === 'pending') return null;
          const done = it.status === 'done';
          const active = it.status === 'active';
          const error = it.status === 'error';
          return (
            <div
              key={i}
              className={cn(
                'pm-step-pop flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all duration-500 ease-out',
                active && 'bg-pm-accent/5',
                done && 'scale-[0.94] opacity-40 blur-[0.5px]',
              )}
            >
              <Node status={it.status} />
              <span
                className={cn(
                  'min-w-0 flex-1 truncate',
                  active && 'text-[13px] font-medium text-pm-text-primary',
                  done && 'text-[12px] text-pm-text-muted',
                  error && 'text-[13px] font-medium text-red-600',
                )}
              >
                {it.label}
              </span>
              <RowState status={it.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Node({ status }) {
  const base = 'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-500';
  if (status === 'done') {
    return (
      <span className={cn(base, 'border-emerald-500 bg-emerald-500 text-white')}>
        <Check className="h-3 w-3" />
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className={cn(base, 'border-red-500 bg-red-500 text-white')}>
        <X className="h-3 w-3" />
      </span>
    );
  }
  if (status === 'active') {
    return (
      <span className={cn(base, 'border-pm-accent/40 bg-pm-accent/10 text-pm-accent')}>
        <Loader2 className="h-3 w-3 animate-spin" />
      </span>
    );
  }
  return (
    <span className={cn(base, 'border-pm-border bg-transparent')}>
      <span className="h-1.5 w-1.5 rounded-full bg-pm-text-muted/40" />
    </span>
  );
}

function RowState({ status }) {
  const base = 'shrink-0 text-[11px] font-medium tabular-nums';
  if (status === 'done') return <span className={cn(base, 'text-emerald-600')}>{__('Done', 'wedevs-project-manager')}</span>;
  if (status === 'active') return <span className={cn(base, 'text-pm-accent')}>{__('Running…', 'wedevs-project-manager')}</span>;
  if (status === 'error') return <span className={cn(base, 'text-red-600')}>{__('Failed', 'wedevs-project-manager')}</span>;
  return null;
}

function StatusTag({ allDone, anyError, anyActive }) {
  if (anyError) {
    return <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600">{__('Failed', 'wedevs-project-manager')}</span>;
  }
  if (allDone) {
    return <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">{__('Complete', 'wedevs-project-manager')}</span>;
  }
  if (anyActive) {
    return (
      <span className="flex items-center gap-1.5 rounded-md bg-pm-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-pm-accent">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pm-accent" />
        {__('Working', 'wedevs-project-manager')}
      </span>
    );
  }
  return null;
}
