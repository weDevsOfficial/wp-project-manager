import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { checkLicense, activateLicense, deleteLicense } from '@store/pro/licenseSlice'
import { useI18n } from '@hooks/useI18n'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card'
import { Badge } from '@components/ui/badge'
import { Shield, ShieldCheck, ShieldX, Key, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LicensePage() {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { license, loading } = useAppSelector(s => s.license)
  const [key, setKey] = useState('')

  useEffect(() => {
    dispatch(checkLicense())
  }, [dispatch])

  const handleActivate = () => {
    if (!key.trim()) return
    dispatch(activateLicense({ key: key.trim() })).then((action) => {
      if (!action.error) {
        toast.success(__('License activated'))
        setKey('')
      } else {
        toast.error(__('Invalid license key'))
      }
    })
  }

  const handleDelete = () => {
    if (window.confirm(__('Remove this license?'))) {
      dispatch(deleteLicense()).then(() => toast.success(__('License removed')))
    }
  }

  const isActive = license?.status === 'active' || license?.activated

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-5 w-5 text-pm-accent" />
        <h2 className="text-lg font-semibold text-pm-text-primary">{__('License')}</h2>
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
                {isActive ? __('License Active') : __('No Active License')}
              </CardTitle>
              <CardDescription className="text-xs">
                {isActive
                  ? __('Your Pro license is active. All modules are available.')
                  : __('Enter your license key to activate Pro features.')
                }
              </CardDescription>
            </div>
            {isActive && (
              <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200 text-xs">
                {__('Active')}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isActive ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 text-sm text-pm-text-muted font-mono bg-muted px-3 py-2 rounded">
                {license?.key
                  ? `${license.key.substring(0, 4)}${'*'.repeat(Math.max(license.key.length - 8, 8))}${license.key.slice(-4)}`
                  : '****-****-****-****'}
              </div>
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />{__('Remove')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-pm-text-muted" />
                <Input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={__('Enter license key...')}
                  className="pl-8 h-9 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                />
              </div>
              <Button size="sm" onClick={handleActivate} disabled={loading}>
                {__('Activate')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
