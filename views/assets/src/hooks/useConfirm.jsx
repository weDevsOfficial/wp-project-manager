import { __ } from '@wordpress/i18n';
import { useState, useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@components/ui/alert-dialog'

/**
 * Returns [ConfirmDialog, confirm]
 *
 * Usage:
 *   const [ConfirmDialog, confirm] = useConfirm()
 *   // In JSX: <ConfirmDialog />
 *   // In handler:
 *   const ok = await confirm('Are you sure?', 'Delete item')
 *   if (!ok) return
 */
export function useConfirm() {
  const [state, setState] = useState({
    open: false,
    resolve: null,
    message: '',
    title: '',
  })

  const confirm = useCallback(
    (message, title = '') =>
      new Promise((resolve) => {
        setState({ open: true, resolve, message, title })
      }),
    []
  )

  const handleResult = useCallback((result) => {
    setState((s) => {
      s.resolve?.(result)
      return { ...s, open: false, resolve: null }
    })
  }, [])

  const ConfirmDialog = useCallback(
    () => (
      <AlertDialog
        open={state.open}
        onOpenChange={(open) => {
          if (!open) handleResult(false)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            {state.title ? (
              <AlertDialogTitle>{state.title}</AlertDialogTitle>
            ) : null}
            <AlertDialogDescription>{state.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => { e.stopPropagation(); handleResult(false) }}>
              {__('Cancel', 'wedevs-project-manager')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.stopPropagation(); handleResult(true) }}>
              {__('Confirm', 'wedevs-project-manager')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    [state, handleResult, __]
  )

  return [ConfirmDialog, confirm]
}
