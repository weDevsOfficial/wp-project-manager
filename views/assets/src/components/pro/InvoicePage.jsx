import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchInvoices, createInvoice, deleteInvoice, sendInvoiceEmail } from '@store/pro/invoiceSlice'
import { useI18n } from '@hooks/useI18n'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Badge } from '@components/ui/badge'
import { Card, CardContent } from '@components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { Skeleton } from '@components/ui/skeleton'
import { Plus, MoreHorizontal, Eye, Download, Mail, Trash2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_BADGE = {
  unpaid: 'bg-red-50 text-red-700 border-red-200',
  partially_paid: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  draft: 'bg-gray-50 text-gray-600 border-gray-200',
}

function InvoiceForm({ projectId, onSubmit, onCancel }) {
  const { __ } = useI18n()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), total: parseFloat(amount) || 0, due_date: dueDate })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">{__('Invoice Title')}</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={__('Invoice #001')} autoFocus />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">{__('Amount')}</label>
          <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        </div>
        <div>
          <label className="text-sm font-medium">{__('Due Date')}</label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>{__('Cancel')}</Button>
        <Button type="submit">{__('Create Invoice')}</Button>
      </DialogFooter>
    </form>
  )
}

export default function InvoicePage() {
  const { projectId } = useParams()
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { invoices, loading } = useAppSelector(s => s.invoice)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    dispatch(fetchInvoices({ projectId }))
  }, [projectId, dispatch])

  const handleCreate = (payload) => {
    dispatch(createInvoice({ projectId, payload })).then(() => {
      setCreating(false)
      toast.success(__('Invoice created'))
    })
  }

  const handleDelete = (invoiceId) => {
    if (window.confirm(__('Delete this invoice?'))) {
      dispatch(deleteInvoice({ projectId, invoiceId }))
      toast.success(__('Invoice deleted'))
    }
  }

  const handleEmail = (invoiceId) => {
    dispatch(sendInvoiceEmail({ projectId, invoiceId })).then(() => {
      toast.success(__('Invoice emailed'))
    })
  }

  const handleDownloadPdf = (invoiceId) => {
    const base = PM_Vars.api_base_url ?? PM_Vars.rest_url ?? ''
    window.open(`${base}pm-pro/v2/projects/${projectId}/invoice/${invoiceId}/pdf`, '_blank')
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 space-y-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-pm-text-primary">{__('Invoices')}</h2>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-1" />{__('New Invoice')}
        </Button>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-pm-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-pm-text-muted">{__('No invoices yet.')}</p>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{__('Invoice')}</TableHead>
                <TableHead className="text-xs">{__('Amount')}</TableHead>
                <TableHead className="text-xs">{__('Status')}</TableHead>
                <TableHead className="text-xs">{__('Due Date')}</TableHead>
                <TableHead className="text-xs w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="text-sm font-medium">{inv.title || `#${inv.id}`}</TableCell>
                  <TableCell className="text-sm">${parseFloat(inv.total || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-[10px]', STATUS_BADGE[inv.status] || STATUS_BADGE.draft)}>
                      {(inv.status || 'draft').replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-pm-text-muted">{inv.due_date || '—'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4 text-pm-text-muted" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleDownloadPdf(inv.id)}>
                          <Download className="h-3.5 w-3.5 mr-2" />{__('Download PDF')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEmail(inv.id)}>
                          <Mail className="h-3.5 w-3.5 mr-2" />{__('Send Email')}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(inv.id)}>
                          <Trash2 className="h-3.5 w-3.5 mr-2" />{__('Delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader><DialogTitle>{__('Create Invoice')}</DialogTitle></DialogHeader>
          <InvoiceForm projectId={projectId} onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
