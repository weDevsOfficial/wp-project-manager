import { __ } from '@wordpress/i18n';
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useApi } from '@hooks/useApi'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { UserAvatar } from '@components/common/UserAvatar'
import { Search, X, Filter } from 'lucide-react'
import { cn } from '@lib/utils'

export default function TaskFilterBar({ projectId, lists, onFilterResults, onClear }) {
  const api = useApi()
  const toast = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [listId, setListId] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [searchTitle, setSearchTitle] = useState('')
  const [filtering, setFiltering] = useState(false)

  const searchTimerRef = useRef(null)

  // Collect unique assignees from all lists
  const allAssignees = React.useMemo(() => {
    const map = new Map()
    lists?.forEach(list => {
      const tasks = [...(list.incomplete_tasks?.data ?? []), ...(list.complete_tasks?.data ?? [])]
      tasks.forEach(task => {
        const users = Array.isArray(task.assignees) ? task.assignees : (task.assignees?.data ?? [])
        users.forEach(u => { if (u.id && !map.has(u.id)) map.set(u.id, u) })
      })
    })
    return Array.from(map.values())
  }, [lists])

  const hasActiveFilter = status || dueDate || listId || assigneeId || searchTitle.trim()
  const activeCount = [status, dueDate, listId, assigneeId, searchTitle.trim()].filter(Boolean).length

  const applyFilter = useCallback(async (overrides = {}) => {
    const params = {
      project_id: projectId,
      status: overrides.status ?? status,
      dueDate: overrides.dueDate ?? dueDate,
      lists: (overrides.listId ?? listId) ? [Number(overrides.listId ?? listId)] : undefined,
      users: (overrides.assigneeId ?? assigneeId) ? [Number(overrides.assigneeId ?? assigneeId)] : undefined,
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
      const lists = res.data ?? []
      const tasks = []
      lists.forEach(list => {
        const incomplete = list.incomplete_tasks?.data ?? []
        const complete = list.complete_tasks?.data ?? []
        incomplete.forEach(t => tasks.push({ ...t, task_list_id: t.task_list_id ?? list.id, board_id: t.board_id ?? list.id }))
        complete.forEach(t => tasks.push({ ...t, task_list_id: t.task_list_id ?? list.id, board_id: t.board_id ?? list.id }))
      })
      onFilterResults?.(tasks)
    } catch (err) {
      console.error('[TaskFilterBar] filter request failed:', err)
      toast.error(__('Failed to filter tasks', 'wedevs-project-manager'))
    }
    setFiltering(false)
  }, [api, projectId, status, dueDate, listId, assigneeId, searchTitle, onFilterResults, onClear])

  const handleClear = useCallback(() => {
    setStatus('')
    setDueDate('')
    setListId('')
    setAssigneeId('')
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
      <Button
        variant="outline"
        className={cn(
          "gap-2 h-10 rounded-[6px] px-4 border-pm-border hover:bg-pm-surface transition-all",
          hasActiveFilter && "border-pm-accent bg-pm-accent/5 text-pm-accent"
        )}
        onClick={() => setIsOpen(true)}
      >
        <Filter className="h-4 w-4" />
        <span className="font-semibold">{__('Filter', 'wedevs-project-manager')}</span>
        {activeCount > 0 && (
          <Badge variant="pm-accent" className="h-5 px-1.5 text-[14px] rounded-full ml-1">
            {activeCount}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap bg-white dark:bg-slate-900 border border-pm-border p-1.5 rounded-2xl shadow-sm animate-in fade-in zoom-in duration-200">
      {/* Search */}
      <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-pm-surface/50 border border-transparent focus-within:border-pm-accent/20 focus-within:bg-white transition-all min-w-[200px]">
        <Search className="h-4 w-4 text-pm-text-muted shrink-0" />
        <input
          value={searchTitle}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={__('Search tasks...', 'wedevs-project-manager')}
          className="flex-1 bg-transparent text-sm font-medium text-pm-text-primary placeholder:text-pm-text-muted focus:outline-none border-0 p-0 shadow-none ring-0"
        />
      </div>

      <div className="h-6 w-px bg-pm-border mx-1 hidden sm:block" />

      {/* Status */}
      <Select value={status} onValueChange={(v) => { setStatus(v); applyFilter({ status: v }) }}>
        <SelectTrigger className="h-10 border-0 bg-transparent hover:bg-pm-surface rounded-xl px-3 gap-2 font-medium text-sm focus:ring-0 shadow-none">
          <SelectValue placeholder={__('Status', 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-pm-border">
          <SelectItem value="incomplete">{__('Incomplete', 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="complete">{__('Complete', 'wedevs-project-manager')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Due date */}
      <Select value={dueDate} onValueChange={(v) => { setDueDate(v); applyFilter({ dueDate: v }) }}>
        <SelectTrigger className="h-10 border-0 bg-transparent hover:bg-pm-surface rounded-xl px-3 gap-2 font-medium text-sm focus:ring-0 shadow-none">
          <SelectValue placeholder={__('Due Date', 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-pm-border">
          <SelectItem value="overdue">{__('Overdue', 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="today">{__('Today', 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="week">{__('This Week', 'wedevs-project-manager')}</SelectItem>
        </SelectContent>
      </Select>

      {/* List */}
      {lists?.length > 0 && (
        <Select value={listId} onValueChange={(v) => { setListId(v); applyFilter({ listId: v }) }}>
          <SelectTrigger className="h-10 border-0 bg-transparent hover:bg-pm-surface rounded-xl px-3 gap-2 font-medium text-sm focus:ring-0 shadow-none">
            <SelectValue placeholder={__('Task List', 'wedevs-project-manager')} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-pm-border">
            {lists.map((l) => (
              <SelectItem key={l.id} value={String(l.id)}>{l.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Assignee */}
      {allAssignees.length > 0 && (
        <Select value={assigneeId} onValueChange={(v) => { setAssigneeId(v); applyFilter({ assigneeId: v }) }}>
          <SelectTrigger className="h-10 border-0 bg-transparent hover:bg-pm-surface rounded-xl px-3 gap-2 font-medium text-sm focus:ring-0 shadow-none">
            <SelectValue placeholder={__('Assignee', 'wedevs-project-manager')} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-pm-border">
            {allAssignees.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                <div className="flex items-center gap-2">
                  <UserAvatar user={u} size="xs" />
                  <span>{u.display_name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasActiveFilter && (
        <Button variant="ghost" size="sm" className="h-10 text-destructive hover:bg-destructive/5 rounded-[6px] px-3 gap-1.5 font-semibold" onClick={handleClear}>
          <X className="h-4 w-4" />
          {__('Reset', 'wedevs-project-manager')}
        </Button>
      )}

      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl ml-auto" onClick={() => { setIsOpen(false); if (!hasActiveFilter) onClear?.() }}>
        <X className="h-5 w-5 text-pm-text-muted" />
      </Button>
    </div>
  )
}
