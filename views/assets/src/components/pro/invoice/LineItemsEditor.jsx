import React, { useState, useCallback, useRef } from 'react'
import { useI18n } from '@hooks/useI18n'
import { useApi } from '@hooks/useApi'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Separator } from '@components/ui/separator'
import { Plus, X } from 'lucide-react'
import { taskLineTotal, itemLineTotal, calcSubtotal, calcTax, calcDiscount, calcTotal, fmtMoney, emptyTaskRow, emptyItemRow } from './helpers'

export default function LineItemsEditor({ entryTasks, entryNames, discount, onChange, projectId }) {
  const { __ } = useI18n()
  const api = useApi()
  const [searchResults, setSearchResults] = useState([])
  const [searchingIdx, setSearchingIdx] = useState(null)

  const updateTask = (idx, field, value) => {
    const rows = [...entryTasks]
    rows[idx] = { ...rows[idx], [field]: value }
    onChange({ entryTasks: rows })
  }

  const updateItem = (idx, field, value) => {
    const rows = [...entryNames]
    rows[idx] = { ...rows[idx], [field]: value }
    onChange({ entryNames: rows })
  }

  const addTaskRow = () => onChange({ entryTasks: [...entryTasks, emptyTaskRow()] })
  const addItemRow = () => onChange({ entryNames: [...entryNames, emptyItemRow()] })
  const removeTaskRow = (idx) => onChange({ entryTasks: entryTasks.filter((_, i) => i !== idx) })
  const removeItemRow = (idx) => onChange({ entryNames: entryNames.filter((_, i) => i !== idx) })

  const timerRef = useRef(null)

  const searchTasks = useCallback((query, idx) => {
    if (!query || query.length < 2) { setSearchResults([]); setSearchingIdx(null); return }
    setSearchingIdx(idx)
    // Debounce 300ms
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`projects/${projectId}/tasks`, { s: query, per_page: 10 })
        const tasks = Array.isArray(res) ? res : (res?.data || [])
        setSearchResults(tasks)
      } catch { setSearchResults([]) }
    }, 300)
  }, [api, projectId])

  const subtotal = calcSubtotal(entryTasks, entryNames)
  const tax      = calcTax(entryTasks, entryNames)
  const disc     = calcDiscount(entryTasks, entryNames, discount)
  const total    = calcTotal(entryTasks, entryNames, discount)

  return (
    <div className="space-y-6">
      {/* Task Entries */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold">{__('Task Entries', 'wedevs-project-manager')}</h4>
          <Button type="button" variant="ghost" size="sm" onClick={addTaskRow}>
            <Plus className="w-3.5 h-3.5 mr-1" />{__('Add Row', 'wedevs-project-manager')}
          </Button>
        </div>
        <div className="border rounded-lg">
          <table className="w-full caption-bottom text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs w-8" />
                <TableHead className="text-xs">{__('Task', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs w-24">{__('Rate', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs w-20">{__('Hours', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs w-20">{__('Tax %', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs w-24 text-right">{__('Total', 'wedevs-project-manager')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entryTasks.map((row, idx) => (
                <React.Fragment key={idx}>
                  <TableRow>
                    <TableCell className="p-1">
                      {entryTasks.length > 1 && (
                        <button type="button" onClick={() => removeTaskRow(idx)} className="p-0.5 text-red-400 hover:text-red-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="p-1">
                      <div className="relative">
                        <Input
                          value={row.task}
                          onChange={(e) => { updateTask(idx, 'task', e.target.value); searchTasks(e.target.value, idx) }}
                          onBlur={() => setTimeout(() => setSearchingIdx(null), 300)}
                          placeholder={__('Search task...', 'wedevs-project-manager')}
                          className="h-8 text-xs"
                        />
                        {searchingIdx === idx && (
                          <div className="absolute top-full left-0 right-0 z-50 bg-white border rounded shadow-lg mt-0.5 max-h-40 overflow-y-auto">
                            {searchResults.length > 0 ? searchResults.map((t) => (
                              <button key={t.id} type="button" className="w-full text-left px-2 py-1.5 text-xs hover:bg-muted truncate"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  const updates = { task: t.title }
                                  // Auto-populate hours from time tracker if available
                                  if (t.time && t.time.total_time) {
                                    updates.hour = (parseFloat(t.time.total_time) / 60).toFixed(2)
                                  }
                                  const rows = [...entryTasks]
                                  rows[idx] = { ...rows[idx], ...updates, srcItem: t }
                                  onChange({ entryTasks: rows })
                                  setSearchingIdx(null); setSearchResults([])
                                }}>
                                {t.title}
                              </button>
                            )) : (
                              <p className="px-2 py-1.5 text-xs text-muted-foreground">{__('No Task Found!', 'wedevs-project-manager')}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <button type="button" className="text-[10px] text-pm-accent mt-0.5" onClick={() => updateTask(idx, 'descriptionField', !row.descriptionField)}>
                        {row.descriptionField ? __('Hide description', 'wedevs-project-manager') : __('+ Description', 'wedevs-project-manager')}
                      </button>
                    </TableCell>
                    <TableCell className="p-1">
                      <Input type="number" step="0.01" value={row.amount} onChange={(e) => updateTask(idx, 'amount', e.target.value)} className="h-8 text-xs" placeholder="0.00" />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input type="number" step="0.5" value={row.hour} onChange={(e) => updateTask(idx, 'hour', e.target.value)} className="h-8 text-xs" placeholder="0" />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input type="number" step="0.01" value={row.tax} onChange={(e) => updateTask(idx, 'tax', e.target.value)} className="h-8 text-xs" placeholder="0" />
                    </TableCell>
                    <TableCell className="p-1 text-right text-xs font-medium">{fmtMoney(taskLineTotal(row))}</TableCell>
                  </TableRow>
                  {row.descriptionField && (
                    <TableRow>
                      <TableCell />
                      <TableCell colSpan={5} className="p-1">
                        <Textarea value={row.description} onChange={(e) => updateTask(idx, 'description', e.target.value)}
                          placeholder={__('Description...', 'wedevs-project-manager')} className="text-xs min-h-[50px]" rows={2} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </table>
        </div>
      </div>

      {/* Item Entries */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold">{__('Item Entries', 'wedevs-project-manager')}</h4>
          <Button type="button" variant="ghost" size="sm" onClick={addItemRow}>
            <Plus className="w-3.5 h-3.5 mr-1" />{__('Add Row', 'wedevs-project-manager')}
          </Button>
        </div>
        <div className="border rounded-lg">
          <table className="w-full caption-bottom text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs w-8" />
                <TableHead className="text-xs">{__('Item', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs w-24">{__('Unit Cost', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs w-20">{__('Qty', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs w-20">{__('Tax %', 'wedevs-project-manager')}</TableHead>
                <TableHead className="text-xs w-24 text-right">{__('Total', 'wedevs-project-manager')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entryNames.map((row, idx) => (
                <React.Fragment key={idx}>
                  <TableRow>
                    <TableCell className="p-1">
                      {entryNames.length > 1 && (
                        <button type="button" onClick={() => removeItemRow(idx)} className="p-0.5 text-red-400 hover:text-red-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="p-1">
                      <div className="relative">
                        <Input
                          value={row.task}
                          onChange={(e) => { updateItem(idx, 'task', e.target.value); searchTasks(e.target.value, `item-${idx}`) }}
                          onBlur={() => setTimeout(() => setSearchingIdx(null), 300)}
                          className="h-8 text-xs"
                          placeholder={__('Search item...', 'wedevs-project-manager')}
                        />
                        {searchingIdx === `item-${idx}` && (
                          <div className="absolute top-full left-0 right-0 z-50 bg-white border rounded shadow-lg mt-0.5 max-h-40 overflow-y-auto">
                            {searchResults.length > 0 ? searchResults.map((t) => (
                              <button key={t.id} type="button" className="w-full text-left px-2 py-1.5 text-xs hover:bg-muted truncate"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { updateItem(idx, 'task', t.title); setSearchingIdx(null); setSearchResults([]) }}>
                                {t.title}
                              </button>
                            )) : (
                              <p className="px-2 py-1.5 text-xs text-muted-foreground">{__('No Task Found!', 'wedevs-project-manager')}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <button type="button" className="text-[10px] text-pm-accent mt-0.5" onClick={() => updateItem(idx, 'descriptionField', !row.descriptionField)}>
                        {row.descriptionField ? __('Hide description', 'wedevs-project-manager') : __('+ Description', 'wedevs-project-manager')}
                      </button>
                    </TableCell>
                    <TableCell className="p-1">
                      <Input type="number" step="0.01" value={row.amount} onChange={(e) => updateItem(idx, 'amount', e.target.value)} className="h-8 text-xs" placeholder="0.00" />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input type="number" step="1" value={row.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} className="h-8 text-xs" placeholder="1" />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input type="number" step="0.01" value={row.tax} onChange={(e) => updateItem(idx, 'tax', e.target.value)} className="h-8 text-xs" placeholder="0" />
                    </TableCell>
                    <TableCell className="p-1 text-right text-xs font-medium">{fmtMoney(itemLineTotal(row))}</TableCell>
                  </TableRow>
                  {row.descriptionField && (
                    <TableRow>
                      <TableCell />
                      <TableCell colSpan={5} className="p-1">
                        <Textarea value={row.description} onChange={(e) => updateItem(idx, 'description', e.target.value)}
                          placeholder={__('Description...', 'wedevs-project-manager')} className="text-xs min-h-[50px]" rows={2} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">{__('Subtotal', 'wedevs-project-manager')}</span><span>{fmtMoney(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{__('Discount', 'wedevs-project-manager')} ({discount || 0}%)</span><span>-{fmtMoney(disc)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{__('Tax', 'wedevs-project-manager')}</span><span>{fmtMoney(tax)}</span></div>
          <Separator />
          <div className="flex justify-between font-semibold text-base"><span>{__('Total', 'wedevs-project-manager')}</span><span>{fmtMoney(total)}</span></div>
        </div>
      </div>
    </div>
  )
}
