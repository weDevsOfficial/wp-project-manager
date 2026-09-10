import { createElement } from 'react'
import { __ } from '@wordpress/i18n'
import { toast } from 'sonner'
import ToastCard from '@components/common/ToastCard'
import ToastSteps from '@components/common/ToastSteps'

// Short fallback description per type so every toast has a supporting line.
// Caller-provided `description` always wins. Evaluated lazily so locale is ready.
const DEFAULT_DESC = {
  success: () => __('Your changes were saved successfully.', 'wedevs-project-manager'),
  error: () => __('Something went wrong. Please try again.', 'wedevs-project-manager'),
  warning: () => __('Please review the highlighted issue.', 'wedevs-project-manager'),
  info: () => __('Here is something you should know.', 'wedevs-project-manager'),
  loading: () => __('Please wait a moment…', 'wedevs-project-manager'),
}

// Route EVERY Sonner toast through our ToastCard so the full-body countdown
// fill + design are consistent app-wide. Patches the shared `toast` singleton,
// so any `import { toast } from 'sonner'` (Free or Pro) gets it automatically.
// Functionality is preserved: options (description, action, cancel, icon, id,
// duration, onAutoClose, …) pass straight through to Sonner.

const DURATION = { success: 3000, error: 5000, warning: 4000, info: 3000, message: 4000, loading: Infinity }

function patchType(type) {
  return (message, data = {}) => {
    const duration = data.duration ?? DURATION[type] ?? 4000
    const description = data.description ?? DEFAULT_DESC[type]?.()
    return toast.custom(
      (id) =>
        createElement(ToastCard, {
          type,
          title: message,
          description,
          icon: data.icon,
          user: data.user,
          action: data.action,
          cancel: data.cancel,
          duration,
          closeButton: data.closeButton !== false,
          onDismiss: () => toast.dismiss(id),
        }),
      { ...data, duration }
    )
  }
}

// Download progress toast — renders through the same ToastCard so downloads
// match the app toaster, with a determinate bar + live percentage. Returns a
// handle the download pipeline drives. Persistent (duration: Infinity) until
// done/error, then auto-dismisses.
let _dlSeq = 0

export function createDownloadToast(name) {
  const id = `pm-download-${++_dlSeq}`
  let state = { name, status: 'downloading', progress: 0, indeterminate: true }

  const paint = () => {
    const done = state.status === 'done'
    const error = state.status === 'error'
    const active = state.status === 'downloading'
    const pct = Math.round(state.progress || 0)
    const duration = active ? Infinity : (error ? 6000 : 3000)

    const description = error
      ? (state.error || __('Download failed', 'wedevs-project-manager'))
      : done
        ? __('Downloaded', 'wedevs-project-manager')
        : state.indeterminate
          ? __('Preparing…', 'wedevs-project-manager')
          : `${__('Downloading…', 'wedevs-project-manager')} ${pct}%`

    toast.custom(
      () =>
        createElement(ToastCard, {
          type: error ? 'error' : done ? 'success' : 'loading',
          title: name,
          description,
          progress: error || (active && state.indeterminate) ? null : (done ? 100 : pct),
          indeterminate: active && state.indeterminate,
          duration,
          onDismiss: () => toast.dismiss(id),
        }),
      { id, duration },
    )
  }

  paint()

  return {
    progress(p, indeterminate = false) {
      state = { ...state, status: 'downloading', progress: p, indeterminate }
      paint()
    },
    done() {
      state = { ...state, status: 'done', progress: 100, indeterminate: false }
      paint()
    },
    error(msg) {
      state = { ...state, status: 'error', error: msg }
      paint()
    },
    dismiss() { toast.dismiss(id) },
  }
}

// Multi-step "server flow" toast — a checklist that advances one step at a
// time (create project → task lists → tasks). Returns a handle the caller
// drives. Persistent until done()/fail(), then auto-dismisses.
let _stepSeq = 0

export function createStepsToast(title, labels, { icon } = {}) {
  const id = `pm-steps-${++_stepSeq}`
  let steps = labels.map((label) => ({ label, status: 'pending' }))

  const paint = (duration = Infinity) => {
    toast.custom(
      () => createElement(ToastSteps, { title, icon, steps, onDismiss: () => toast.dismiss(id) }),
      { id, duration },
    )
  }
  paint()

  const setStatus = (i, status) => {
    steps = steps.map((s, idx) => (idx === i ? { ...s, status } : s))
  }

  return {
    start(i) { setStatus(i, 'active'); paint() },
    complete(i) { setStatus(i, 'done'); paint() },
    setLabel(i, label) { steps = steps.map((s, idx) => (idx === i ? { ...s, label } : s)); paint() },
    error(i, label) {
      steps = steps.map((s, idx) => (idx === i ? { ...s, status: 'error', label: label || s.label } : s))
      paint(6000)
    },
    done() { paint(3000) },
    dismiss() { toast.dismiss(id) },
  }
}

export function installCustomToasts() {
  if (toast.__pmPatched) return
  ;['success', 'error', 'warning', 'info', 'message', 'loading'].forEach((t) => {
    if (typeof toast[t] === 'function') toast[t] = patchType(t)
  })
  toast.__pmPatched = true
}

installCustomToasts()
