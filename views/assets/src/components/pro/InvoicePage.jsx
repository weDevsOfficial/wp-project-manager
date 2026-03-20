import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchInvoices, deleteInvoice, sendInvoiceEmail } from '@store/pro/invoiceSlice'
import { useI18n } from '@hooks/useI18n'
import { useApi } from '@hooks/useApi'
import { useProApi } from '@hooks/useProApi'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { Card } from '@components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Skeleton } from '@components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Download, Mail, Trash2, FileText, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { STATUS_MAP, STATUS_STYLE, extractDateStr, fmtMoney } from './invoice/helpers'
import InvoiceForm from './invoice/InvoiceFormSheet'
import InvoiceDetailView from './invoice/InvoiceDetailView'
import PaymentDialog from './invoice/PaymentDialog'

export default function InvoicePage() {
  const { projectId } = useParams()
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const api    = useApi()
  const proApi = useProApi()
  const { invoices, pagination, loading } = useAppSelector((s) => s.invoice)

  // view: 'list' | 'form' | 'detail'
  const [view, setView]               = useState('list')
  const [editInvoice, setEditInvoice] = useState(null)
  const [detailInvoice, setDetailInvoice] = useState(null)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [members, setMembers]         = useState([])
  const [page, setPage]               = useState(1)

  useEffect(() => {
    dispatch(fetchInvoices({ projectId, page }))
    api.get(`projects/${projectId}`, { with: 'assignees' }).then((res) => {
      const p = res?.data ?? res
      setMembers(p?.assignees?.data || [])
    }).catch(() => {})
  }, [projectId, page, dispatch, api])

  const handleCreate = () => { setEditInvoice(null); setView('form') }
  const handleEdit   = (inv) => { setEditInvoice(inv); setView('form') }

  const handleView = async (inv) => {
    try {
      const res = await proApi.get(`projects/${projectId}/invoice/${inv.id}`)
      setDetailInvoice(res?.data ?? res)
    } catch {
      setDetailInvoice(inv)
    }
    setView('detail')
  }

  const handleBackToList = () => {
    setView('list')
    dispatch(fetchInvoices({ projectId, page }))
  }

  const handleDelete = (invoiceId) => {
    if (window.confirm(__('Delete this invoice?', 'wedevs-project-manager'))) {
      dispatch(deleteInvoice({ projectId, invoiceId }))
      toast.success(__('Invoice deleted', 'wedevs-project-manager'))
    }
  }

  const handleEmail = (invoiceId) => {
    dispatch(sendInvoiceEmail({ projectId, invoiceId })).then(() =>
      toast.success(__('Invoice emailed', 'wedevs-project-manager'))
    )
  }

  const handlePdf = (invoiceId) => {
    const base = PM_Vars.api_base_url ?? PM_Vars.rest_url ?? ''
    window.open(`${base}pm-pro/v2/projects/${projectId}/invoice/${invoiceId}/pdf`, '_blank')
  }

  /* ── Loading ── */
  if (loading && view === 'list') {
    return (
      <div className="max-w-[1400px] mx-auto p-6 space-y-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  /* ── Form View (Create / Edit) ── */
  if (view === 'form') {
    return (
      <div className="max-w-[1400px] mx-auto p-6">
        <InvoiceForm
          invoice={editInvoice}
          projectId={projectId}
          members={members}
          onClose={handleBackToList}
        />
      </div>
    )
  }

  /* ── Detail View ── */
  if (view === 'detail' && detailInvoice) {
    return (
      <div className="max-w-[1400px] mx-auto p-6">
        <InvoiceDetailView
          invoice={detailInvoice}
          projectId={projectId}
          onBack={handleBackToList}
          onEdit={handleEdit}
          onPayment={() => setPaymentOpen(true)}
        />
        <PaymentDialog
          open={paymentOpen}
          onClose={() => {
            setPaymentOpen(false)
            proApi.get(`projects/${projectId}/invoice/${detailInvoice.id}`)
              .then((res) => setDetailInvoice(res?.data ?? res)).catch(() => {})
          }}
          invoice={detailInvoice}
          projectId={projectId}
        />
      </div>
    )
  }

  /* ── List View ── */
  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-pm-text">{__('Invoices', 'wedevs-project-manager')}</h2>
        <Button size="sm" onClick={handleCreate} className="bg-pm-accent hover:bg-pm-accent/90">
          <Plus className="h-4 w-4 mr-1" />{__('New Invoice', 'wedevs-project-manager')}
        </Button>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-pm-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-pm-text-muted">{__('No invoices yet.', 'wedevs-project-manager')}</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1" />{__('Create your first invoice', 'wedevs-project-manager')}
          </Button>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{__('Title', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs">{__('Date', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs">{__('Due', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs">{__('Status', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs">{__('Discount', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs text-right">{__('Total', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs text-right">{__('Paid', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs text-right">{__('Due Amount', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => {
                const st = inv.status ?? 0
                return (
                  <TableRow key={inv.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleView(inv)}>
                    <TableCell className="text-sm font-medium">{inv.title || `#${inv.id}`}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{extractDateStr(inv.start_at) || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{extractDateStr(inv.due_date) || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-[10px]', STATUS_STYLE[st])}>{STATUS_MAP[st]}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{inv.discount ? `${inv.discount}%` : '—'}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{fmtMoney(inv.invoice_total)}</TableCell>
                    <TableCell className="text-sm text-right text-green-600">{fmtMoney(inv.paid_amount)}</TableCell>
                    <TableCell className="text-sm text-right text-red-600 font-medium">{fmtMoney(inv.due_amount)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4 text-pm-text-muted" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => handleView(inv)}><FileText className="h-3.5 w-3.5 mr-2" />{__('View', 'wedevs-project-manager')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(inv)}><Pencil className="h-3.5 w-3.5 mr-2" />{__('Edit', 'wedevs-project-manager')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePdf(inv.id)}><Download className="h-3.5 w-3.5 mr-2" />{__('Download PDF', 'wedevs-project-manager')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEmail(inv.id)}><Mail className="h-3.5 w-3.5 mr-2" />{__('Send Email', 'wedevs-project-manager')}</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(inv.id)}><Trash2 className="h-3.5 w-3.5 mr-2" />{__('Delete', 'wedevs-project-manager')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {(() => {
        const pg = pagination?.pagination
        if (!pg || pg.total_pages <= 1) return null
        return (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {__('Page', 'wedevs-project-manager')} {page} {__('of', 'wedevs-project-manager')} {pg.total_pages}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= pg.total_pages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
