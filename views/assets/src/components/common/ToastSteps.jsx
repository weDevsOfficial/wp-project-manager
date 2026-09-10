import React from 'react'
import { CircleCheck, CircleX, Loader2, Circle, Sparkles, X } from 'lucide-react'

// A multi-step "server flow" toast card: a title plus a checklist of steps that
// light up one after another (pending → active spinner → done check). Matches
// the app ToastCard shell. Driven by createStepsToast in lib/toast-custom.js.
export default function ToastSteps({ title, icon, steps = [], onDismiss }) {
  const HeadIcon = icon || Sparkles

  return (
    <div className="pm-toast relative overflow-hidden w-[356px] max-w-[calc(100vw-2rem)] rounded-lg border bg-card shadow-lg">
      <div className="flex items-start gap-2.5 px-4 py-3">
        <span className="shrink-0 mt-px">
          <HeadIcon className="h-5 w-5 text-pm-accent" />
        </span>

        <div className="min-w-0 flex-1">
          {title != null && (
            <div className="text-sm font-medium text-pm-text-primary leading-snug break-words">{title}</div>
          )}

          <ul className="mt-2 space-y-1.5">
            {steps.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-[13px] leading-snug">
                <StepIcon status={s.status} />
                <span className={stepText(s.status)}>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close"
            className="shrink-0 -mr-1 -mt-0.5 p-1 rounded text-pm-text-muted/70 hover:text-pm-text-primary hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

function StepIcon({ status }) {
  if (status === 'done') return <CircleCheck className="h-4 w-4 shrink-0 text-emerald-600" />
  if (status === 'error') return <CircleX className="h-4 w-4 shrink-0 text-red-600" />
  if (status === 'active') return <Loader2 className="h-4 w-4 shrink-0 text-pm-accent animate-spin" />
  return <Circle className="h-4 w-4 shrink-0 text-pm-text-muted/30" />
}

function stepText(status) {
  if (status === 'done') return 'text-pm-text-muted'
  if (status === 'error') return 'text-red-600 font-medium'
  if (status === 'active') return 'text-pm-text-primary font-medium'
  return 'text-pm-text-muted/60'
}
