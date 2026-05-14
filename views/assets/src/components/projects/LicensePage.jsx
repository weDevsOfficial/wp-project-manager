import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react'
import { useConfirm } from '@hooks/useConfirm'
import { useProApi } from '@hooks/useProApi'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card'
import { Badge } from '@components/ui/badge'
import { Shield, ShieldCheck, ShieldX, Key, Mail, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LicensePage() {
  const proApi = useProApi()
  const [ConfirmDialog, confirm] = useConfirm()
  const [license, setLicense] = useState(null)
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [key, setKey] = useState('')

  useEffect(() => {
    proApi.get('license/check').then(res => {
      const data = res?.data || res
      setLicense(data.license || null)
      setStatus(data.status || null)
      setMessage(data.message || '')
      if (data.license?.email) setEmail(data.license.email)
      if (data.license?.key) setKey(data.license.key)
    }).catch(() => {
      // API not available
    }).finally(() => setLoading(false))
  }, [])

  const isActive = status?.activated === true || status?.activated === 'true'

  const handleActivate = () => {
    if (!email.trim() || !key.trim()) return
    setSubmitting(true)
    proApi.post('license/activation', { email: email.trim(), key: key.trim() }).then(res => {
      const data = res?.data || res
      if (data?.data?.activated) {
        toast.success(__('License activated', 'wedevs-project-manager'))
        location.reload()
      } else if (data?.data?.error) {
        toast.error(data.data.error)
      } else {
        toast.error(data?.message || __('License activation failed', 'wedevs-project-manager'))
      }
    }).catch(() => {
      toast.error(__('Invalid license key', 'wedevs-project-manager'))
    }).finally(() => setSubmitting(false))
  }

  const handleDelete = async () => {
    const ok = await confirm(__('License will delete permanently', 'wedevs-project-manager'), __('Delete License', 'wedevs-project-manager'))
    if (!ok) return
    proApi.post('license/delete').then(() => {
      toast.success(__('License removed', 'wedevs-project-manager'))
      location.reload()
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-5 h-5 rounded-full border-2 border-pm-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      <ConfirmDialog />
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-5 w-5 text-pm-accent" />
        <h2 className="text-lg font-semibold text-pm-text-primary">{__('License', 'wedevs-project-manager')}</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {isActive ? (
              <ShieldCheck className="h-8 w-8 text-green-500" />
            ) : (
              <ShieldX className="h-8 w-8 text-pm-text-muted" />
            )}
            <div>
              <CardTitle className="text-sm">
                {isActive ? __('License Active', 'wedevs-project-manager') : __('No Active License', 'wedevs-project-manager')}
              </CardTitle>
              <CardDescription className="text-sm">
                {isActive
                  ? (message || __('Your Pro license is active. All modules are available.', 'wedevs-project-manager'))
                  : __('Enter your license key to activate Pro features.', 'wedevs-project-manager')
                }
              </CardDescription>
            </div>
            {isActive && (
              <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200 text-sm">
                {__('Active', 'wedevs-project-manager')}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isActive ? (
            <div className="space-y-3">
              {license?.email && (
                <div className="flex items-center gap-2 text-sm text-pm-text-muted">
                  <Mail className="h-4 w-4" />
                  <span>{license.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="flex-1 text-sm text-pm-text-muted font-mono bg-muted px-3 py-2 rounded">
                  {license?.key
                    ? `${license.key.substring(0, 4)}${'*'.repeat(Math.max(license.key.length - 8, 8))}${license.key.slice(-4)}`
                    : '****-****-****-****'}
                </div>
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />{__('Deactivate', 'wedevs-project-manager')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 h-9 rounded-md border border-pm-border bg-background px-2.5 focus-within:ring-1 focus-within:ring-pm-accent">
                <Mail className="h-4 w-4 text-pm-text-muted shrink-0" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={__('Enter your purchase email address...', 'wedevs-project-manager')}
                  type="email"
                  className="flex-1 min-w-0 h-full bg-transparent text-sm placeholder:text-pm-text-muted/60 focus:outline-none !border-0 !p-0 !shadow-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1 h-9 rounded-md border border-pm-border bg-background px-2.5 focus-within:ring-1 focus-within:ring-pm-accent">
                  <Key className="h-4 w-4 text-pm-text-muted shrink-0" />
                  <input
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder={__('Enter license key...', 'wedevs-project-manager')}
                    className="flex-1 min-w-0 h-full bg-transparent text-sm placeholder:text-pm-text-muted/60 focus:outline-none !border-0 !p-0 !shadow-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                  />
                </div>
                <Button size="sm" onClick={handleActivate} disabled={submitting || !email.trim() || !key.trim()}>
                  {__('Save & Activate', 'wedevs-project-manager')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
