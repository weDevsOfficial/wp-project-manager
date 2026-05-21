import { __ } from '@wordpress/i18n'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '@store/index'
import { createUser } from '@store/projectsSlice'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Label } from '@components/ui/label'
import { Input } from '@components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import { Loader2 } from 'lucide-react'

export default function CreateUserDialog({ open, onOpenChange, defaultSeed = '', onCreated }) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ username: '', first_name: '', last_name: '', email: '' })

  useEffect(() => {
    if (!open) return
    const seed = (defaultSeed || '').trim()
    const looksLikeEmail = /.+@.+\..+/.test(seed)
    setForm({
      username: looksLikeEmail ? seed.split('@')[0] : seed,
      first_name: '',
      last_name: '',
      email: looksLikeEmail ? seed : '',
    })
  }, [open, defaultSeed])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.email.trim()) {
      toast.error(__('Username and email are required', 'wedevs-project-manager'))
      return
    }
    setSubmitting(true)
    try {
      const created = await dispatch(createUser(form)).unwrap()
      if (!created?.id) throw new Error('no_id_returned')
      toast.success(__('User created', 'wedevs-project-manager'))
      onOpenChange?.(false)
      onCreated?.(created)
    } catch (err) {
      const errorMap = {
        create_user_failed: __('Could not create user', 'wedevs-project-manager'),
        no_id_returned: __('Server did not return a user. Try again.', 'wedevs-project-manager'),
      }
      const fallback = __('Could not create user', 'wedevs-project-manager')
      const raw = typeof err === 'string' ? err : err?.message
      // Treat internal snake_case keys as non-user-friendly; only surface
      // strings that contain whitespace (real sentences from WP_Error etc.).
      const looksFriendly = typeof raw === 'string' && /\s/.test(raw)
      const msg = (typeof raw === 'string' && errorMap[raw]) || (looksFriendly ? raw : fallback)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-pm-dialog>
        <DialogHeader>
          <DialogTitle>{__('Create a new user', 'wedevs-project-manager')}</DialogTitle>
          <DialogDescription>
            {__('Create a WordPress user. They will be available to add to projects.', 'wedevs-project-manager')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="pm-cu-username">{__('Username', 'wedevs-project-manager')}</Label>
            <Input
              id="pm-cu-username"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pm-cu-first">{__('First Name', 'wedevs-project-manager')}</Label>
              <Input
                id="pm-cu-first"
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pm-cu-last">{__('Last Name', 'wedevs-project-manager')}</Label>
              <Input
                id="pm-cu-last"
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pm-cu-email">{__('Email', 'wedevs-project-manager')}</Label>
            <Input
              id="pm-cu-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)} disabled={submitting}>
              {__('Cancel', 'wedevs-project-manager')}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {submitting ? __('Creating...', 'wedevs-project-manager') : __('Create User', 'wedevs-project-manager')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
