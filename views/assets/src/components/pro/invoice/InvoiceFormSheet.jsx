import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '@store/index'
import { createInvoice, updateInvoice, fetchInvoices } from '@store/pro/invoiceSlice'
import { useI18n } from '@hooks/useI18n'
import { useProApi } from '@hooks/useProApi'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Label } from '@components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Switch } from '@components/ui/switch'
import { Separator } from '@components/ui/separator'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AddressFields } from './AddressSection'
import LineItemsEditor from './LineItemsEditor'
import { extractDateStr, emptyTaskRow, emptyItemRow } from './helpers'

export default function InvoiceForm({ invoice, projectId, members, onClose }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const proApi = useProApi()
  const isEdit = !!invoice?.id
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '', client_id: '', start_at: '', due_date: '', discount: '',
    partial: 0, partial_amount: '', terms: '', client_notes: '',
    entryTasks: [emptyTaskRow()], entryNames: [emptyItemRow()],
  })

  const [orgAddress, setOrgAddress] = useState({ name: '', address_1: '', address_2: '', city: '', state: '', zip: '', country: '' })
  const [clientAddress, setClientAddress] = useState({ name: '', address_1: '', address_2: '', city: '', state: '', zip: '', country: '' })

  useEffect(() => {
    if (isEdit && invoice) {
      setForm({
        title: invoice.title || '',
        client_id: invoice.client_id ? String(invoice.client_id) : '',
        start_at: extractDateStr(invoice.start_at),
        due_date: extractDateStr(invoice.due_date),
        discount: invoice.discount || '',
        partial: parseInt(invoice.partial) ? 1 : 0,
        partial_amount: invoice.partial_amount || '',
        terms: invoice.terms || '',
        client_notes: invoice.client_notes || invoice.client_note || '',
        entryTasks: invoice.entryTasks?.length ? invoice.entryTasks : [emptyTaskRow()],
        entryNames: invoice.entryNames?.length ? invoice.entryNames : [emptyItemRow()],
      })
      if (invoice.client_address) setClientAddress(invoice.client_address)
    } else {
      setForm({
        title: '', client_id: '', start_at: '', due_date: '', discount: '',
        partial: 0, partial_amount: '', terms: '', client_notes: '',
        entryTasks: [emptyTaskRow()], entryNames: [emptyItemRow()],
      })
      setClientAddress({ name: '', address_1: '', address_2: '', city: '', state: '', zip: '', country: '' })
    }
    const inv = typeof PM_Vars !== 'undefined' ? PM_Vars?.settings?.invoice : {}
    if (inv) {
      setOrgAddress({
        name: inv.organization || '', address_1: inv.address_1 || '', address_2: inv.address_2 || '',
        city: inv.city || '', state: inv.state || '', zip: inv.zip || '', country: inv.country_code || '',
      })
    }
  }, [invoice, isEdit])

  useEffect(() => {
    if (!form.client_id) return
    proApi.get(`invoice/user-address/user/${form.client_id}`).then((res) => {
      if (res && typeof res === 'object' && (res.name || res.address_1)) setClientAddress(res)
    }).catch(() => {})
  }, [form.client_id, proApi])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.warning(__('Title is required', 'wedevs-project-manager')); return }
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        client_id: form.client_id ? parseInt(form.client_id) : 0,
        start_at: { date: form.start_at || '' },
        due_date: { date: form.due_date || '' },
        discount: parseFloat(form.discount) || 0,
        partial: form.partial ? 1 : 0,
        partial_amount: parseFloat(form.partial_amount) || 0,
        terms: form.terms || '',
        client_notes: form.client_notes || '',
        entryTasks: form.entryTasks,
        entryNames: form.entryNames,
      }
      if (isEdit) {
        await dispatch(updateInvoice({ projectId, invoiceId: invoice.id, payload })).unwrap()
        toast.success(__('Invoice updated', 'wedevs-project-manager'))
      } else {
        await dispatch(createInvoice({ projectId, payload })).unwrap()
        toast.success(__('Invoice created', 'wedevs-project-manager'))
      }
      try { await proApi.post('invoice/address', orgAddress) } catch {}
      if (form.client_id) { try { await proApi.post(`invoice/user-address/user/${form.client_id}`, clientAddress) } catch {} }
      dispatch(fetchInvoices({ projectId }))
      onClose()
    } catch (err) {
      toast.error(err?.message || __('Failed to save invoice', 'wedevs-project-manager'))
    } finally { setSaving(false) }
  }

  const updateField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClose}><ArrowLeft className="w-4 h-4" /></Button>
        <h2 className="text-lg font-semibold">{isEdit ? __('Edit Invoice', 'wedevs-project-manager') : __('New Invoice', 'wedevs-project-manager')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">{__('Invoice Details', 'wedevs-project-manager')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">{__('Invoice Title', 'wedevs-project-manager')} *</Label>
                <Input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder={__('Invoice #001', 'wedevs-project-manager')} className="mt-1" autoFocus />
              </div>
              <div>
                <Label className="text-xs">{__('Client', 'wedevs-project-manager')}</Label>
                <Select value={form.client_id} onValueChange={(v) => updateField('client_id', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={__('Select Client', 'wedevs-project-manager')} /></SelectTrigger>
                  <SelectContent>
                    {(members || []).map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>{m.display_name || m.nicename || m.user_nicename || `User #${m.id}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">{__('Invoice Date', 'wedevs-project-manager')}</Label>
                <Input type="date" value={form.start_at} onChange={(e) => updateField('start_at', e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">{__('Due Date', 'wedevs-project-manager')}</Label>
                <Input type="date" value={form.due_date} onChange={(e) => updateField('due_date', e.target.value)} className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">{__('Discount (%)', 'wedevs-project-manager')}</Label>
                <Input type="number" step="0.01" value={form.discount} onChange={(e) => updateField('discount', e.target.value)} placeholder="0" className="mt-1" />
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <Switch checked={!!form.partial} onCheckedChange={(v) => updateField('partial', v ? 1 : 0)} />
                  <Label className="text-xs">{__('Allow Partial Payment', 'wedevs-project-manager')}</Label>
                </div>
              </div>
            </div>

            {form.partial === 1 && (
              <div>
                <Label className="text-xs">{__('Minimum Partial Amount', 'wedevs-project-manager')}</Label>
                <Input type="number" step="0.01" value={form.partial_amount} onChange={(e) => updateField('partial_amount', e.target.value)} placeholder="0.00" className="mt-1 max-w-[250px]" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">{__('Addresses', 'wedevs-project-manager')}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <AddressFields label={__('From (Organization)', 'wedevs-project-manager')} address={orgAddress} onChange={setOrgAddress} />
              <AddressFields label={__('To (Client)', 'wedevs-project-manager')} address={clientAddress} onChange={setClientAddress} />
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">{__('Line Items', 'wedevs-project-manager')}</CardTitle></CardHeader>
          <CardContent>
            <LineItemsEditor
              entryTasks={form.entryTasks}
              entryNames={form.entryNames}
              discount={form.discount}
              onChange={(updates) => setForm((f) => ({ ...f, ...updates }))}
              projectId={projectId}
            />
          </CardContent>
        </Card>

        {/* Terms & Notes */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">{__('Additional Information', 'wedevs-project-manager')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">{__('Terms & Conditions', 'wedevs-project-manager')}</Label>
              <Textarea value={form.terms} onChange={(e) => updateField('terms', e.target.value)} placeholder={__('Net 30...', 'wedevs-project-manager')} rows={3} className="mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-xs">{__('Client Notes', 'wedevs-project-manager')}</Label>
              <Textarea value={form.client_notes} onChange={(e) => updateField('client_notes', e.target.value)} placeholder={__('Thank you for your business...', 'wedevs-project-manager')} rows={2} className="mt-1 text-sm" />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>{__('Cancel', 'wedevs-project-manager')}</Button>
          <Button type="submit" disabled={saving} className="bg-pm-accent hover:bg-pm-accent/90">
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            {isEdit ? __('Update Invoice', 'wedevs-project-manager') : __('Create Invoice', 'wedevs-project-manager')}
          </Button>
        </div>
      </form>
    </div>
  )
}
