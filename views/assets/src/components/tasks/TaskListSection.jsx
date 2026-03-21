import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { toggleExpand, addTaskToList, reorderTasksLocal } from '@store/taskListsSlice'
import { sortTasks } from '@store/tasksSlice'
import { createTask } from '@store/tasksSlice'
import { useApi } from '@hooks/useApi'
// cn removed — not used in this file
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import RichTextEditor from '@components/common/RichTextEditor'
import { Progress } from '@components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { userInitials } from '@lib/pm-utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import {
  ChevronDown,
  Plus,
  MoreHorizontal,
  Trash2,
  Pencil,
} from 'lucide-react'
import TaskRow from './TaskRow'

export default function TaskListSection({ list, projectId, showLabels }) {
  const dispatch = useAppDispatch()
  const { __ } = useI18n()
  const toast = useToast()
  const expanded = useAppSelector(s => s.taskLists.expandedIds.includes(list.id))

  const api = useApi()

  const [showNewTask, setShowNewTask] = useState(false)
  const [expandedForm, setExpandedForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [assigneeSearch, setAssigneeSearch] = useState('')
  const [assigneeResults, setAssigneeResults] = useState([])
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [creating, setCreating] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)

  // List rename
  const [renaming, setRenaming] = useState(false)
  const [renameTitle, setRenameTitle] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingMoreComplete, setLoadingMoreComplete] = useState(false)
  const [allIncompleteLoaded, setAllIncompleteLoaded] = useState(false)
  const [allCompleteLoaded, setAllCompleteLoaded] = useState(false)

  // Search users for assignment
  const handleSearchUsers = useCallback(async (q) => {
    setAssigneeSearch(q)
    if (q.length < 2) { setAssigneeResults([]); return }
    try {
      const res = await api.get('users', { search: q })
      setAssigneeResults(res.data ?? [])
    } catch { setAssigneeResults([]) }
  }, [api])

  const addAssignee = useCallback((user) => {
    if (!selectedAssignees.find(u => u.id === user.id)) {
      setSelectedAssignees(prev => [...prev, user])
    }
    setAssigneeSearch('')
    setAssigneeResults([])
  }, [selectedAssignees])

  const removeAssignee = useCallback((userId) => {
    setSelectedAssignees(prev => prev.filter(u => u.id !== userId))
  }, [])

  const resetForm = useCallback(() => {
    setShowNewTask(false)
    setExpandedForm(false)
    setNewTitle('')
    setNewDesc('')
    setNewDueDate('')
    setAssigneeSearch('')
    setAssigneeResults([])
    setSelectedAssignees([])
  }, [])

  const incompleteTasks = list.incomplete_tasks?.data ?? []
  const completeTasks = list.complete_tasks?.data ?? []
  const totalIncomplete = list.meta?.total_incomplete_tasks ?? incompleteTasks.length
  const totalComplete = list.meta?.total_complete_tasks ?? completeTasks.length
  const total = totalIncomplete + totalComplete
  const progress = total > 0 ? Math.round((totalComplete / total) * 100) : 0

  const handleToggle = useCallback(() => {
    dispatch(toggleExpand(list.id))
  }, [dispatch, list.id])

  const handleCreateTask = useCallback(async (e) => {
    e.preventDefault()
    if (!newTitle.trim() || creating) return
    setCreating(true)
    try {
      const payload = {
        title: newTitle.trim(),
        board_id: list.id,
      }
      if (newDesc.trim()) payload.description = newDesc.trim()
      if (newDueDate) payload.due_date = newDueDate
      if (selectedAssignees.length > 0) payload.assignees = selectedAssignees.map(u => u.id)

      const result = await dispatch(createTask({
        projectId,
        payload,
      })).unwrap()
      if (result) {
        dispatch(addTaskToList({ listId: list.id, task: result }))
      }
      resetForm()
      setShowNewTask(true) // keep form open for rapid entry
      toast.success(__('Task created'))
    } catch {
      toast.error(__('Failed to create task'))
    }
    setCreating(false)
  }, [dispatch, projectId, list.id, newTitle, newDesc, newDueDate, selectedAssignees, creating, toast, __, resetForm])

  // ── Task drag-drop within list ──────────────────
  const dragTaskIdx = useRef(null)
  const [dragOverTaskIdx, setDragOverTaskIdx] = useState(null)

  const handleTaskDragStart = useCallback((idx) => {
    dragTaskIdx.current = idx
  }, [])

  const handleTaskDragOver = useCallback((e, idx) => {
    e.preventDefault()
    if (dragTaskIdx.current !== null && dragTaskIdx.current !== idx) {
      setDragOverTaskIdx(idx)
    }
  }, [])

  const handleTaskDrop = useCallback((e, toIdx) => {
    e.preventDefault()
    e.stopPropagation()
    const fromIdx = dragTaskIdx.current
    if (fromIdx === null || fromIdx === toIdx) {
      dragTaskIdx.current = null
      setDragOverTaskIdx(null)
      return
    }
    // Optimistic reorder
    dispatch(reorderTasksLocal({ listId: list.id, fromIndex: fromIdx, toIndex: toIdx }))
    // Build orders for API
    const tasks = [...incompleteTasks]
    const [moved] = tasks.splice(fromIdx, 1)
    tasks.splice(toIdx, 0, moved)
    const orders = tasks.map((t, i) => ({ id: t.id, index: i }))
    dispatch(sortTasks({ projectId, listId: list.id, taskId: moved.id, orders, receive: 0 }))

    dragTaskIdx.current = null
    setDragOverTaskIdx(null)
  }, [dispatch, projectId, list.id, incompleteTasks])

  const handleTaskDragEnd = useCallback(() => {
    dragTaskIdx.current = null
    setDragOverTaskIdx(null)
  }, [])

  // ── List rename ──────────────────────────────────
  const startRename = useCallback(() => {
    setRenameTitle(list.title)
    setRenaming(true)
  }, [list.title])

  const handleRename = useCallback(async () => {
    if (!renameTitle.trim()) return
    try {
      await api.post(`projects/${projectId}/task-lists/${list.id}/update`, {
        id: list.id,
        title: renameTitle.trim(),
      })
      toast.success(__('List renamed'))
      setRenaming(false)
      // Refetch to update — simple approach
      window.location.reload()
    } catch { toast.error(__('Failed to rename')) }
  }, [api, projectId, list.id, renameTitle, toast, __])

  const handleDeleteList = useCallback(async () => {
    if (!confirm(__('Delete this list and all its tasks?'))) return
    try {
      await api.post(`projects/${projectId}/task-lists/${list.id}/delete`)
      toast.success(__('List deleted'))
      window.location.reload()
    } catch { toast.error(__('Failed to delete list')) }
  }, [api, projectId, list.id, toast, __])

  // ── Load more tasks ──────────────────────────────
  const hasMoreIncomplete = !allIncompleteLoaded && incompleteTasks.length < totalIncomplete
  const hasMoreComplete = !allCompleteLoaded && completeTasks.length < totalComplete

  const handleLoadMore = useCallback(async (status) => {
    const isComplete = status === 1
    if (isComplete) setLoadingMoreComplete(true)
    else setLoadingMore(true)
    try {
      const existingIds = (isComplete ? completeTasks : incompleteTasks).map(t => t.id)
      const res = await api.get(`projects/${projectId}/task-lists/${list.id}/more/tasks`, {
        task_ids: existingIds,
        status,
      })
      const newTasks = res?.data?.tasks?.data ?? res?.data ?? []
      if (newTasks.length > 0) {
        newTasks.forEach(t => dispatch(addTaskToList({ listId: list.id, task: t })))
      } else {
        // No more tasks to load
        if (isComplete) setAllCompleteLoaded(true)
        else setAllIncompleteLoaded(true)
      }
    } catch { toast.error(__('Failed to load more tasks')) }
    if (isComplete) setLoadingMoreComplete(false)
    else setLoadingMore(false)
  }, [api, projectId, list.id, incompleteTasks, completeTasks, dispatch, toast, __])

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b">
        <button
          type="button"
          onClick={handleToggle}
          className="p-0.5 hover:bg-muted rounded transition-colors"
        >
          <ChevronDown
            className="h-4 w-4 text-pm-text-muted transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
        </button>

        {renaming ? (
          <div className="flex items-center gap-1.5 flex-1">
            <input
              autoFocus
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false); }}
              className="text-sm font-semibold text-pm-text-primary flex-1 bg-transparent border-b border-pm-accent outline-none px-0 py-0"
            />
            <button type="button" onClick={handleRename} className="text-pm-accent hover:text-pm-accent/80 text-xs font-medium">{__('Save')}</button>
            <button type="button" onClick={() => setRenaming(false)} className="text-pm-text-muted hover:text-pm-text text-xs">{__('Cancel')}</button>
          </div>
        ) : (
          <h3 className="text-sm font-semibold text-pm-text-primary flex-1 truncate">
            {list.title}
          </h3>
        )}

        {/* Counts */}
        <span className="text-[11px] text-pm-text-muted tabular-nums">
          {totalComplete}/{total}
        </span>

        {/* Mini progress */}
        <Progress value={progress} className="h-1 w-16" />

        <span className="text-[11px] font-medium text-pm-text-muted tabular-nums w-8 text-right">
          {progress}%
        </span>

        {/* Add task */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => { setShowNewTask(v => !v); if (!expanded) dispatch(toggleExpand(list.id)) }}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={startRename}>
              <Pencil className="h-3.5 w-3.5 mr-2" />
              {__('Rename')}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDeleteList}>
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              {__('Delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div>
          {/* Incomplete tasks */}
          {incompleteTasks.length > 0 ? (
            incompleteTasks.map((task, idx) => (
              <TaskRow
                key={task.id}
                task={task}
                projectId={projectId}
                listId={list.id}
                showLabels={showLabels}
                draggable
                onDragStart={() => handleTaskDragStart(idx)}
                onDragOver={(e) => handleTaskDragOver(e, idx)}
                onDrop={(e) => handleTaskDrop(e, idx)}
                onDragEnd={handleTaskDragEnd}
                isDragOver={dragOverTaskIdx === idx}
              />
            ))
          ) : null}

          {/* Load more incomplete */}
          {hasMoreIncomplete && incompleteTasks.length > 0 && (
            <div className="px-4 py-1.5 border-b border-border/40">
              <button
                type="button"
                className="text-xs text-pm-accent hover:underline disabled:opacity-50"
                disabled={loadingMore}
                onClick={() => handleLoadMore(0)}
              >
                {loadingMore ? __('Loading...') : __('Load more tasks')}
              </button>
            </div>
          )}

          {incompleteTasks.length === 0 && !showNewTask ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-pm-text-muted mb-3">{__('No tasks yet')}</p>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => setShowNewTask(true)}
              >
                <Plus className="h-4 w-4" />
                {__('Add a task')}
              </Button>
            </div>
          ) : null}

          {/* Inline add task */}
          {showNewTask && (
            <form
              onSubmit={handleCreateTask}
              className="px-3 py-3 border-b border-border/40 bg-muted/5 space-y-2"
            >
              {/* Title row */}
              <div className="flex items-center gap-2">
                <span className="h-[18px] w-[18px] rounded-full border border-dashed border-pm-text-muted/40 shrink-0" />
                <Input
                  autoFocus
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder={__('Task name...')}
                  className="h-8 text-sm flex-1"
                  onKeyDown={e => { if (e.key === 'Escape') resetForm() }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-1.5 text-pm-text-muted"
                  onClick={() => setExpandedForm(v => !v)}
                  title={__('More options')}
                >
                  {expandedForm ? __('Less') : __('More')}
                </Button>
              </div>

              {/* Expanded fields */}
              {expandedForm && (
                <div className="pl-[26px] space-y-2">
                  {/* Description */}
                  <RichTextEditor
                    content={newDesc}
                    onChange={setNewDesc}
                    placeholder={__('Description...')}
                    minHeight="60px"
                  />

                  {/* Due date */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-pm-text-muted w-16 shrink-0">{__('Due date')}</label>
                    <Input
                      type="date"
                      value={newDueDate}
                      onChange={e => setNewDueDate(e.target.value)}
                      className="h-8 text-sm w-40"
                    />
                  </div>

                  {/* Assignees */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-pm-text-muted w-16 shrink-0">{__('Assign')}</label>
                      <div className="relative flex-1">
                        <Input
                          value={assigneeSearch}
                          onChange={e => handleSearchUsers(e.target.value)}
                          placeholder={__('Search users...')}
                          className="h-8 text-sm"
                        />
                        {assigneeResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                            {assigneeResults.map(user => (
                              <button
                                key={user.id}
                                type="button"
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 text-left transition-colors"
                                onClick={() => addAssignee(user)}
                              >
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={user.avatar_url} />
                                  <AvatarFallback className="text-[8px]">{userInitials(user.display_name)}</AvatarFallback>
                                </Avatar>
                                <span className="truncate">{user.display_name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Selected assignees */}
                    {selectedAssignees.length > 0 && (
                      <div className="flex items-center gap-1.5 pl-[68px] flex-wrap">
                        {selectedAssignees.map(user => (
                          <span
                            key={user.id}
                            className="inline-flex items-center gap-1 text-xs bg-muted rounded-full pl-1 pr-2 py-0.5"
                          >
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={user.avatar_url} />
                              <AvatarFallback className="text-[7px]">{userInitials(user.display_name)}</AvatarFallback>
                            </Avatar>
                            {user.display_name}
                            <button
                              type="button"
                              className="ml-0.5 text-pm-text-muted hover:text-destructive"
                              onClick={() => removeAssignee(user.id)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pl-[26px]">
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={!newTitle.trim() || creating}
                >
                  {creating ? __('Adding...') : __('Add Task')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={resetForm}
                >
                  {__('Cancel')}
                </Button>
              </div>
            </form>
          )}

          {/* Completed tasks toggle */}
          {totalComplete > 0 && (
            <div className="border-t border-border/40">
              <button
                type="button"
                onClick={() => setShowCompleted(v => !v)}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-pm-text-muted hover:bg-muted/20 transition-colors"
              >
                <ChevronDown
                  className="h-3 w-3 transition-transform duration-200"
                  style={{ transform: showCompleted ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
                <span className="font-medium">
                  {totalComplete} {__('Completed')}
                </span>
              </button>
              {showCompleted && (
                <>
                  {completeTasks.map(task => (
                    <TaskRow key={task.id} task={task} projectId={projectId} listId={list.id} showLabels={showLabels} />
                  ))}
                  {hasMoreComplete && (
                    <div className="px-4 py-1.5">
                      <button
                        type="button"
                        className="text-xs text-pm-accent hover:underline disabled:opacity-50"
                        disabled={loadingMoreComplete}
                        onClick={() => handleLoadMore(1)}
                      >
                        {loadingMoreComplete ? __('Loading...') : __('Load more completed')}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
