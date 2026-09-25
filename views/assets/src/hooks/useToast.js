/**
 * Toast notifications using Sonner. The `toast` singleton is patched app-wide
 * in lib/toast-custom to render our custom ToastCard (full-body countdown +
 * dynamic description/action/icon). This hook just maps the (message,
 * description) signature onto it.
 */
import { toast } from 'sonner'
import '@lib/toast-custom'

export function useToast() {
  return {
    success: (message, description, opts) => toast.success(message, { description, ...opts }),
    error: (message, description, opts) => toast.error(message, { description, ...opts }),
    warning: (message, description, opts) => toast.warning(message, { description, ...opts }),
    info: (message, description, opts) => toast.info(message, { description, ...opts }),
  }
}
