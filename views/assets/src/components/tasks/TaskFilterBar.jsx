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
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Search, X, Filter } from 'lucide-react'
import { userInitials } from '@lib/pm-utils'

export default function TaskFilterBar({ projectId, lists, onFilterResults, onClear }) {
  const { __ } = useI18n()
  const api = useApi()

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
    } catch {
      // silently fail
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
        <SelectTrigger className="h-8 w-auto sm:w-[120px] text-xs">
          <SelectValue placeholder={__('Status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="incomplete">{__('Incomplete')}</SelectItem>
          <SelectItem value="complete">{__('Complete')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Due date */}
      <Select value={dueDate} onValueChange={(v) => { setDueDate(v); applyFilter({ dueDate: v }) }}>
        <SelectTrigger className="h-8 w-auto sm:w-[120px] text-xs">
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
          <SelectTrigger className="h-8 w-auto sm:w-[140px] text-xs">
            <SelectValue placeholder={__('Task List')} />
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
          <SelectTrigger className="h-8 w-auto sm:w-[140px] text-xs">
            <SelectValue placeholder={__('Assignee')} />
          </SelectTrigger>
          <SelectContent>
            {allAssignees.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                <span className="flex items-center gap-1.5">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={u.avatar_url} />
                    <AvatarFallback className="text-[7px]">{userInitials(u.display_name || '')}</AvatarFallback>
                  </Avatar>
                  {u.display_name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear */}
      {hasActiveFilter && (
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={handleClear}>
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
