import React from 'react'
import { useI18n } from '@hooks/useI18n'
import { Input } from '@components/ui/input'

/* ── Editable address fields ── */
export function AddressFields({ label, address, onChange }) {
  const { __ } = useI18n()
  const update = (k, v) => onChange({ ...address, [k]: v })

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase text-muted-foreground">{label}</h4>
      <Input value={address.name || ''} onChange={(e) => update('name', e.target.value)} placeholder={__('Name / Organization', 'wedevs-project-manager')} className="h-8 text-xs" />
      <Input value={address.address_1 || ''} onChange={(e) => update('address_1', e.target.value)} placeholder={__('Address Line 1', 'wedevs-project-manager')} className="h-8 text-xs" />
      <Input value={address.address_2 || ''} onChange={(e) => update('address_2', e.target.value)} placeholder={__('Address Line 2', 'wedevs-project-manager')} className="h-8 text-xs" />
      <div className="grid grid-cols-2 gap-2">
        <Input value={address.city || ''} onChange={(e) => update('city', e.target.value)} placeholder={__('City', 'wedevs-project-manager')} className="h-8 text-xs" />
        <Input value={address.state || ''} onChange={(e) => update('state', e.target.value)} placeholder={__('State', 'wedevs-project-manager')} className="h-8 text-xs" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input value={address.zip || ''} onChange={(e) => update('zip', e.target.value)} placeholder={__('Zip Code', 'wedevs-project-manager')} className="h-8 text-xs" />
        <Input value={address.country || ''} onChange={(e) => update('country', e.target.value)} placeholder={__('Country', 'wedevs-project-manager')} className="h-8 text-xs" />
      </div>
    </div>
  )
}

/* ── Read-only address display ── */
export function AddressDisplay({ label, address }) {
  if (!address || (!address.name && !address.address_1 && !address.organization)) return null
  const name = address.name || address.organization || ''
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">{label}</h4>
      <div className="text-sm space-y-0.5">
        {name && <p className="font-medium">{name}</p>}
        {address.address_1 && <p>{address.address_1}</p>}
        {address.address_2 && <p>{address.address_2}</p>}
        <p>{[address.city, address.state, address.zip].filter(Boolean).join(', ')}</p>
        {(address.country || address.country_code) && <p>{address.country || address.country_code}</p>}
      </div>
    </div>
  )
}
