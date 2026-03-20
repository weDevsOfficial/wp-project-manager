import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '@store/index'
import { recordPayment, fetchInvoices } from '@store/pro/invoiceSlice'
import { useI18n } from '@hooks/useI18n'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Label } from '@components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { fmtMoney } from './helpers'

export default function PaymentDialog({ open, onClose, invoice, projectId }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const [amount, setAmount] = useState('')
  const [fullPayment, setFullPayment] = useState(false)
  const [gateway, setGateway] = useState('cash')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const dueAmount = invoice?.due_amount ?? 0

  useEffect(() => {
    if (fullPayment) setAmount(String(dueAmount))
  }, [fullPayment, dueAmount])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) { toast.warning(__('Enter a valid amount', 'wedevs-project-manager')); return }
    setSaving(true)
    try {
      await dispatch(recordPayment({
        projectId, invoiceId: invoice.id,
        payload: { amount, paymentGateway: gateway, paymentDate: date, paymentNotes: notes },
      })).unwrap()
      toast.success(__('Payment recorded', 'wedevs-project-manager'))
      dispatch(fetchInvoices({ projectId }))
      onClose()
    } catch (err) {
      toast.error(err?.message || __('Failed to record payment', 'wedevs-project-manager'))
    } finally { setSaving(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{__('Record Payment', 'wedevs-project-manager')} — {invoice?.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1">
            <div className="flex justify-between">
              <span>{__('Invoice Total', 'wedevs-project-manager')}</span>
              <span className="font-medium">{fmtMoney(invoice?.invoice_total)}</span>
            </div>
            <div className="flex justify-between">
              <span>{__('Amount Due', 'wedevs-project-manager')}</span>
              <span className="font-semibold text-red-600">{fmtMoney(dueAmount)}</span>
            </div>
          </div>

          <div>
            <Label className="text-xs">{__('Payment Amount', 'wedevs-project-manager')}</Label>
            <Input type="number" step="0.01" value={amount} onChange={(e) => { setAmount(e.target.value); setFullPayment(false) }} placeholder="0.00" className="mt-1" />
            <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer">
              <input type="checkbox" checked={fullPayment} onChange={(e) => setFullPayment(e.target.checked)} className="rounded" />
              {__('Full Payment', 'wedevs-project-manager')}
            </label>
          </div>

          <div>
            <Label className="text-xs">{__('Payment Method', 'wedevs-project-manager')}</Label>
            <Select value={gateway} onValueChange={setGateway}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">{__('Cash', 'wedevs-project-manager')}</SelectItem>
                <SelectItem value="bank_transfer">{__('Bank Transfer', 'wedevs-project-manager')}</SelectItem>
                <SelectItem value="check">{__('Check', 'wedevs-project-manager')}</SelectItem>
                <SelectItem value="paypal">{__('PayPal', 'wedevs-project-manager')}</SelectItem>
                <SelectItem value="stripe">{__('Stripe', 'wedevs-project-manager')}</SelectItem>
                <SelectItem value="other">{__('Other', 'wedevs-project-manager')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">{__('Payment Date', 'wedevs-project-manager')}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label className="text-xs">{__('Notes', 'wedevs-project-manager')}</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 text-xs" placeholder={__('Payment notes...', 'wedevs-project-manager')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>{__('Cancel', 'wedevs-project-manager')}</Button>
            <Button type="submit" disabled={saving} className="bg-pm-accent hover:bg-pm-accent/90">
              {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              {__('Record Payment', 'wedevs-project-manager')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
