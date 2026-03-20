import React from 'react'
import { useAppDispatch } from '@store/index'
import { sendInvoiceEmail } from '@store/pro/invoiceSlice'
import { useI18n } from '@hooks/useI18n'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Separator } from '@components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { ArrowLeft, Pencil, MoreHorizontal, Mail, Download, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { AddressDisplay } from './AddressSection'
import {
  STATUS_MAP, STATUS_STYLE, extractDateStr, fmtMoney,
  taskLineTotal, itemLineTotal, calcSubtotal, calcTax, calcDiscount, calcTotal, calcPaid,
} from './helpers'

export default function InvoiceDetailView({ invoice, onBack, onEdit, onPayment, projectId }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()

  const status   = invoice?.status ?? 0
  const payments = invoice?.payments?.data || []
  const paid     = calcPaid(payments)
  const total    = invoice?.invoice_total ?? calcTotal(invoice?.entryTasks, invoice?.entryNames, invoice?.discount)
  const due      = invoice?.due_amount ?? (total - paid)

  const handleEmail = () => {
    dispatch(sendInvoiceEmail({ projectId, invoiceId: invoice.id })).then(() =>
      toast.success(__('Invoice emailed', 'wedevs-project-manager'))
    )
  }

  const handlePdf = () => {
    const base = typeof PM_Vars !== 'undefined' ? (PM_Vars.api_base_url ?? PM_Vars.rest_url ?? '') : ''
    window.open(`${base}pm-pro/v2/projects/${projectId}/invoice/${invoice.id}/pdf`, '_blank')
  }

  const hasTaskEntries = invoice.entryTasks?.length > 0 && invoice.entryTasks[0]?.task
  const hasItemEntries = invoice.entryNames?.length > 0 && invoice.entryNames[0]?.task

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
          <h2 className="text-lg font-semibold">{invoice.title}</h2>
          <Badge variant="outline" className={cn('text-xs', STATUS_STYLE[status])}>{STATUS_MAP[status]}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {status !== 1 && (
            <Button size="sm" variant="outline" onClick={onPayment}>
              <CreditCard className="w-3.5 h-3.5 mr-1" />{__('Enter Payment', 'wedevs-project-manager')}
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onEdit(invoice)}>
            <Pencil className="w-3.5 h-3.5 mr-1" />{__('Edit', 'wedevs-project-manager')}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button size="sm" variant="outline"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEmail}><Mail className="w-3.5 h-3.5 mr-2" />{__('Send Email', 'wedevs-project-manager')}</DropdownMenuItem>
              <DropdownMenuItem onClick={handlePdf}><Download className="w-3.5 h-3.5 mr-2" />{__('Download PDF', 'wedevs-project-manager')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Invoice Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div><span className="text-muted-foreground block text-xs">{__('Invoice #', 'wedevs-project-manager')}</span><span className="font-medium">{invoice.id}</span></div>
            <div><span className="text-muted-foreground block text-xs">{__('Invoice Date', 'wedevs-project-manager')}</span><span>{extractDateStr(invoice.start_at) || '—'}</span></div>
            <div><span className="text-muted-foreground block text-xs">{__('Due Date', 'wedevs-project-manager')}</span><span>{extractDateStr(invoice.due_date) || '—'}</span></div>
            <div><span className="text-muted-foreground block text-xs">{__('Amount Due', 'wedevs-project-manager')}</span><span className="font-semibold text-red-600">{fmtMoney(due)}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-4">
            <AddressDisplay label={__('From', 'wedevs-project-manager')} address={typeof PM_Vars !== 'undefined' ? PM_Vars?.settings?.invoice : {}} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <AddressDisplay label={__('To', 'wedevs-project-manager')} address={invoice.client_address} />
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      {(hasTaskEntries || hasItemEntries) && (
        <Card>
          <CardContent className="pt-4">
            {hasTaskEntries && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">{__('Task Entries', 'wedevs-project-manager')}</h4>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs">{__('Task', 'wedevs-project-manager')}</TableHead>
                      <TableHead className="text-xs w-24">{__('Rate', 'wedevs-project-manager')}</TableHead>
                      <TableHead className="text-xs w-20">{__('Hours', 'wedevs-project-manager')}</TableHead>
                      <TableHead className="text-xs w-20">{__('Tax %', 'wedevs-project-manager')}</TableHead>
                      <TableHead className="text-xs w-24 text-right">{__('Total', 'wedevs-project-manager')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.entryTasks.filter((t) => t.task).map((t, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{t.task}{t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}</TableCell>
                        <TableCell className="text-sm">{fmtMoney(t.amount)}</TableCell>
                        <TableCell className="text-sm">{t.hour}</TableCell>
                        <TableCell className="text-sm">{t.tax}%</TableCell>
                        <TableCell className="text-sm text-right font-medium">{fmtMoney(taskLineTotal(t))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {hasItemEntries && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">{__('Item Entries', 'wedevs-project-manager')}</h4>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs">{__('Item', 'wedevs-project-manager')}</TableHead>
                      <TableHead className="text-xs w-24">{__('Unit Cost', 'wedevs-project-manager')}</TableHead>
                      <TableHead className="text-xs w-20">{__('Qty', 'wedevs-project-manager')}</TableHead>
                      <TableHead className="text-xs w-20">{__('Tax %', 'wedevs-project-manager')}</TableHead>
                      <TableHead className="text-xs w-24 text-right">{__('Total', 'wedevs-project-manager')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.entryNames.filter((t) => t.task).map((t, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{t.task}{t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}</TableCell>
                        <TableCell className="text-sm">{fmtMoney(t.amount)}</TableCell>
                        <TableCell className="text-sm">{t.quantity}</TableCell>
                        <TableCell className="text-sm">{t.tax}%</TableCell>
                        <TableCell className="text-sm text-right font-medium">{fmtMoney(itemLineTotal(t))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Totals */}
            <div className="flex justify-end border-t pt-3">
              <div className="w-64 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{__('Subtotal', 'wedevs-project-manager')}</span><span>{fmtMoney(calcSubtotal(invoice.entryTasks, invoice.entryNames))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{__('Discount', 'wedevs-project-manager')} ({invoice.discount || 0}%)</span><span>-{fmtMoney(calcDiscount(invoice.entryTasks, invoice.entryNames, invoice.discount))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{__('Tax', 'wedevs-project-manager')}</span><span>{fmtMoney(calcTax(invoice.entryTasks, invoice.entryNames))}</span></div>
                <Separator />
                <div className="flex justify-between font-semibold"><span>{__('Total', 'wedevs-project-manager')}</span><span>{fmtMoney(total)}</span></div>
                <div className="flex justify-between text-green-600"><span>{__('Paid', 'wedevs-project-manager')}</span><span>{fmtMoney(paid)}</span></div>
                <div className="flex justify-between font-semibold text-red-600"><span>{__('Due', 'wedevs-project-manager')}</span><span>{fmtMoney(due)}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">{__('Payment History', 'wedevs-project-manager')}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs">{__('Date', 'wedevs-project-manager')}</TableHead>
                  <TableHead className="text-xs">{__('Method', 'wedevs-project-manager')}</TableHead>
                  <TableHead className="text-xs">{__('Notes', 'wedevs-project-manager')}</TableHead>
                  <TableHead className="text-xs text-right">{__('Amount', 'wedevs-project-manager')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p, i) => (
                  <TableRow key={p.id || i}>
                    <TableCell className="text-sm">{extractDateStr(p.date) || '—'}</TableCell>
                    <TableCell className="text-sm capitalize">{p.gateway || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.notes || '—'}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{fmtMoney(p.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Terms & Notes */}
      {(invoice.terms || invoice.client_notes || invoice.client_note) && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-6">
              {invoice.terms && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1">{__('Terms & Conditions', 'wedevs-project-manager')}</h4>
                  <p className="text-sm whitespace-pre-wrap">{invoice.terms}</p>
                </div>
              )}
              {(invoice.client_notes || invoice.client_note) && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1">{__('Client Notes', 'wedevs-project-manager')}</h4>
                  <p className="text-sm whitespace-pre-wrap">{invoice.client_notes || invoice.client_note}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
