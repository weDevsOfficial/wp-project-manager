import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Search, X, Filter } from 'lucide-react'

export default function TaskFilterBar({ projectId, lists, onFilterResults, onClear }) {
  const { __ } = useI18n()
  const api = useApi()

  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [listId, setListId] = useState('')
  const [searchTitle, setSearchTitle] = useState('')
  const [filtering, setFiltering] = useState(false)

  const searchTimerRef = useRef(null)

  const hasActiveFilter = status || dueDate || listId || searchTitle.trim()
  const activeCount = [status, dueDate, listId, searchTitle.trim()].filter(Boolean).length

  const applyFilter = useCallback(async (overrides = {}) => {
    const params = {
      project_id: projectId,
      status: overrides.status ?? status,
      dueDate: overrides.dueDate ?? dueDate,
      lists: (overrides.listId ?? listId) ? [Number(overrides.listId ?? listId)] : undefined,
      title: overrides.searchTitle ?? searchTitle.trim(),
    }

    // Remove empty params
    Object.keys(params).forEach((k) => {
      if (!params[k] || (Array.isArray(params[k]) && params[k].length === 0)) delete params[k]
    })

    if (Object.keys(params).length <= 1) {
      onClear?.()
      return
    }

    setFiltering(true)
    try {
      const res = await api.post(`projects/${projectId}/tasks/filter`, params)
      onFilterResults?.(res.data ?? [])
    } catch {
      // silently fail
    }
    setFiltering(false)
  }, [api, projectId, status, dueDate, listId, searchTitle, onFilterResults, onClear])

  const handleClear = useCallback(() => {
    setStatus('')
    setDueDate('')
    setListId('')
    setSearchTitle('')
    onClear?.()
  }, [onClear])

  const handleSearchChange = useCallback((value) => {
    setSearchTitle(value)
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      applyFilter({ searchTitle: value })
    }, 400)
  }, [applyFilter])

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [])

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 text-xs"
          onClick={() => setIsOpen(true)}
        >
          <Filter className="h-3.5 w-3.5" />
          {__('Filter')}
          {activeCount > 0 && (
            <Badge variant="secondary" className="h-4 px-1 text-[10px] rounded-full ml-0.5">
              {activeCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card px-3 py-2.5 flex items-center gap-2 flex-wrap">
      {/* Search */}
      <div className="flex items-center gap-1.5 flex-1 min-w-[160px] max-w-[240px] h-8 rounded-md border border-input bg-background px-2.5 focus-within:ring-1 focus-within:ring-pm-accent">
        <Search className="h-3.5 w-3.5 text-pm-text-muted shrink-0" />
        <input
          value={searchTitle}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={__('Search tasks...')}
          className="flex-1 min-w-0 h-full bg-transparent text-xs text-pm-text-primary placeholder:text-muted-foreground focus:outline-none !border-0 !p-0 !shadow-none"
        />
      </div>

      {/* Status */}
      <Select value={status} onValueChange={(v) => { setStatus(v); applyFilter({ status: v }) }}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder={__('Status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="incomplete">{__('Incomplete')}</SelectItem>
          <SelectItem value="complete">{__('Complete')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Due date */}
      <Select value={dueDate} onValueChange={(v) => { setDueDate(v); applyFilter({ dueDate: v }) }}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder={__('Due Date')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="overdue">{__('Overdue')}</SelectItem>
          <SelectItem value="today">{__('Today')}</SelectItem>
          <SelectItem value="week">{__('This Week')}</SelectItem>
        </SelectContent>
      </Select>

      {/* List */}
      {lists?.length > 0 && (
        <Select value={listId} onValueChange={(v) => { setListId(v); applyFilter({ listId: v }) }}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder={__('Task List')} />
          </SelectTrigger>
          <SelectContent>
            {lists.map((l) => (
              <SelectItem key={l.id} value={String(l.id)}>{l.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear */}
      {hasActiveFilter && (
        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-pm-text-muted" onClick={handleClear}>
          <X className="h-3 w-3" />
          {__('Clear')}
        </Button>
      )}

      {/* Close */}
      <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto shrink-0" onClick={() => { setIsOpen(false); if (!hasActiveFilter) onClear?.() }}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
