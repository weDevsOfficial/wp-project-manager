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
      // API returns task lists with embedded tasks — extract flat task array
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
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 text-sm"
          onClick={() => setIsOpen(true)}
        >
          <Filter className="h-4 w-4" />
          {__('Filter', 'wedevs-project-manager')}
          {activeCount > 0 && (
            <Badge variant="secondary" className="h-4 px-1 text-[14px] rounded-full ml-0.5">
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
        <Search className="h-4 w-4 text-pm-text-muted shrink-0" />
        <input
          value={searchTitle}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={__('Search tasks...', 'wedevs-project-manager')}
          className="flex-1 min-w-0 h-full bg-transparent text-sm text-pm-text-primary placeholder:text-muted-foreground focus:outline-none !border-0 !p-0 !shadow-none"
        />
      </div>

      {/* Status */}
      <Select value={status} onValueChange={(v) => { setStatus(v); applyFilter({ status: v }) }}>
        <SelectTrigger className="h-8 w-auto sm:w-[120px] text-sm">
          <SelectValue placeholder={__('Status', 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="incomplete">{__('Incomplete', 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="complete">{__('Complete', 'wedevs-project-manager')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Due date */}
      <Select value={dueDate} onValueChange={(v) => { setDueDate(v); applyFilter({ dueDate: v }) }}>
        <SelectTrigger className="h-8 w-auto sm:w-[120px] text-sm">
          <SelectValue placeholder={__('Due Date', 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="overdue">{__('Overdue', 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="today">{__('Today', 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="week">{__('This Week', 'wedevs-project-manager')}</SelectItem>
        </SelectContent>
      </Select>

      {/* List */}
      {lists?.length > 0 && (
        <Select value={listId} onValueChange={(v) => { setListId(v); applyFilter({ listId: v }) }}>
          <SelectTrigger className="h-8 w-auto sm:w-[140px] text-sm">
            <SelectValue placeholder={__('Task List', 'wedevs-project-manager')} />
          </SelectTrigger>
          <SelectContent>
            {lists.map((l) => (
              <SelectItem key={l.id} value={String(l.id)}>{l.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Assignee */}
      {allAssignees.length > 0 && (
        <Select value={assigneeId} onValueChange={(v) => { setAssigneeId(v); applyFilter({ assigneeId: v }) }}>
          <SelectTrigger className="h-8 w-auto sm:w-[140px] text-sm">
            <SelectValue placeholder={__('Assignee', 'wedevs-project-manager')} />
          </SelectTrigger>
          <SelectContent>
            {allAssignees.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                <span className="flex items-center gap-1.5">
                  <UserAvatar user={u} size="sm" />
                  {u.display_name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear */}
      {hasActiveFilter && (
        <Button variant="outline" size="sm" className="h-8 text-sm gap-1" onClick={handleClear}>
          <X className="h-3.5 w-3.5" />
          {__('Clear', 'wedevs-project-manager')}
        </Button>
      )}

      {/* Close */}
      <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto shrink-0" onClick={() => { setIsOpen(false); if (!hasActiveFilter) onClear?.() }}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
