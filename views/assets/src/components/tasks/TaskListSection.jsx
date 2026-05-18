import { __ } from '@wordpress/i18n';
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@store/index'
import { toggleExpand, addTaskToList, reorderTasksLocal, updateTaskList, deleteTaskList } from '@store/taskListsSlice'
import { sortTasks } from '@store/tasksSlice'
import { createTask } from '@store/tasksSlice'
import { useApi } from '@hooks/useApi'
import { cn } from '@lib/utils'
import { useToast } from '@hooks/useToast'
import { useConfirm } from '@hooks/useConfirm'
import { Milestone as MilestoneIcon } from 'lucide-react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import RichTextEditor from '@components/common/RichTextEditor'
import { Progress } from '@components/ui/progress'
import { UserAvatar } from '@components/common/UserAvatar'
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
  Check,
  X,
  Lock,
  ArrowUpRight,
  Archive,
  Copy,
  Crown,
  ListChecks,
} from 'lucide-react'
import { Slot } from '@hooks/useSlot'
import { usePermissions } from '@hooks/usePermissions'
import { useCurrentProject } from '@hooks/useCurrentProject'
import { useProModal } from '@components/common/ProUpgradeModal'
import TaskRow from './TaskRow'
import { sanitizeHtml } from '@lib/sanitize'

export default function TaskListSection({ list, projectId, showLabels, isInbox = false, variant = 'default' }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  
  // In expanded variant, we don't use the store's expanded state, we force it open
  const isExpandedVariant = variant === 'expanded'
  const expandedStore = useAppSelector(s => s.taskLists.expandedIds.includes(list.id))
  const expanded = isExpandedVariant ? true : expandedStore

  const project = useCurrentProject(projectId)
  const { isPro, userCan, isManager } = usePermissions(project)
  const { setOpen: openProModal } = useProModal()
  const canCreateTask = isManager || userCan('create_task')
  const canEditTaskList = isManager || userCan('edit_task_list')
  const canDeleteTaskList = isManager || userCan('delete_task_list')

  const api = useApi()
  const [ConfirmDialog, confirm] = useConfirm()

  const [showNewTask, setShowNewTask] = useState(false)
  const [expandedForm, setExpandedForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [assigneeSearch, setAssigneeSearch] = useState('')
  const projectMembers = project?.assignees?.data ?? []
  const assigneeResults = assigneeSearch.trim().length === 0
    ? projectMembers
    : projectMembers.filter(u => (u.display_name || '').toLowerCase().includes(assigneeSearch.toLowerCase()))
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [creating, setCreating] = useState(false)
  const [milestones, setMilestones] = useState([])
  const [selectedMilestone, setSelectedMilestone] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)

  // List rename
  const [renaming, setRenaming] = useState(false)
  const [renameTitle, setRenameTitle] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingMoreComplete, setLoadingMoreComplete] = useState(false)
  const [allIncompleteLoaded, setAllIncompleteLoaded] = useState(false)
  const [allCompleteLoaded, setAllCompleteLoaded] = useState(false)

  const handleSearchUsers = useCallback((q) => {
    setAssigneeSearch(q)
  }, [])

  const addAssignee = useCallback((user) => {
    if (!selectedAssignees.find(u => parseInt(u.id) === parseInt(user.id))) {
      setSelectedAssignees(prev => [...prev, user])
    }
    setAssigneeSearch('')
  }, [selectedAssignees])

  const removeAssignee = useCallback((userId) => {
    setSelectedAssignees(prev => prev.filter(u => u.id !== userId))
  }, [])

  useEffect(() => {
    if (!showNewTask || !projectId || milestones.length > 0) return;
    api.get(`projects/${projectId}/milestones`, { per_page: 50 })
      .then(res => setMilestones(res?.data ?? []))
      .catch(() => {});
  }, [showNewTask, projectId, api, milestones.length])

  const resetForm = useCallback(() => {
    setShowNewTask(false)
    setExpandedForm(false)
    setNewTitle('')
    setNewDesc('')
    setNewDueDate('')
    setAssigneeSearch('')
    setSelectedAssignees([])
    setSelectedMilestone('')
  }, [])

  const incompleteTasks = list.incomplete_tasks?.data ?? []
  const completeTasks = list.complete_tasks?.data ?? []
  const totalIncomplete = list.meta?.total_incomplete_tasks ?? incompleteTasks.length
  const totalComplete = list.meta?.total_complete_tasks ?? completeTasks.length
  const total = totalIncomplete + totalComplete
  const progress = total > 0 ? Math.round((totalComplete / total) * 100) : 0

  const handleToggle = useCallback(() => {
    if (isExpandedVariant) return
    dispatch(toggleExpand(list.id))
  }, [dispatch, list.id, isExpandedVariant])

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
        if (selectedMilestone && result.id) {
          api.post(`projects/${projectId}/milestones/${selectedMilestone}/attach-tasks`, {
            task_ids: [result.id],
          }).catch(() => {});
        }
      }
      resetForm()
      setShowNewTask(true) // keep form open for rapid entry
      toast.success(__('Task created', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to create task', 'wedevs-project-manager'))
    }
    setCreating(false)
  }, [dispatch, projectId, list.id, newTitle, newDesc, newDueDate, selectedAssignees, creating, toast, __, resetForm, selectedMilestone, api])

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

  const handleTaskDrop = useCallback(async (e, toIdx) => {
    e.preventDefault()
    e.stopPropagation()
    const fromIdx = dragTaskIdx.current
    if (fromIdx === null || fromIdx === toIdx) {
      dragTaskIdx.current = null
      setDragOverTaskIdx(null)
      return;
    }
    // Optimistic reorder
    dispatch(reorderTasksLocal({ listId: list.id, fromIndex: fromIdx, toIndex: toIdx }))
    // Build orders for API
    const tasks = [...incompleteTasks]
    const [moved] = tasks.splice(fromIdx, 1)
    tasks.splice(toIdx, 0, moved)
    const orders = tasks.map((t, i) => ({ id: t.id, index: i }))

    dragTaskIdx.current = null
    setDragOverTaskIdx(null)

    try {
      await dispatch(sortTasks({ projectId, listId: list.id, taskId: moved.id, orders, receive: 0 })).unwrap()
    } catch {
      // Undo the optimistic move by reversing the splice
      dispatch(reorderTasksLocal({ listId: list.id, fromIndex: toIdx, toIndex: fromIdx }))
      toast.error(__('Failed to reorder tasks', 'wedevs-project-manager'))
    }
  }, [dispatch, projectId, list.id, incompleteTasks, toast, __])

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
      await dispatch(updateTaskList({ projectId, listId: list.id, title: renameTitle.trim() })).unwrap()
      toast.success(__('List renamed', 'wedevs-project-manager'))
      setRenaming(false)
    } catch { toast.error(__('Failed to rename', 'wedevs-project-manager')) }
  }, [dispatch, projectId, list.id, renameTitle, toast, __])

  const handleDeleteList = useCallback(async () => {
    const ok = await confirm(__('Delete this list and all its tasks?', 'wedevs-project-manager'), __('Delete List', 'wedevs-project-manager'))
    if (!ok) return
    try {
      await dispatch(deleteTaskList({ projectId, listId: list.id })).unwrap()
      toast.success(__('List deleted', 'wedevs-project-manager'))
    } catch { toast.error(__('Failed to delete list', 'wedevs-project-manager')) }
  }, [dispatch, projectId, list.id, toast, __, confirm])

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
        newTasks.forEach(t => dispatch(addTaskToList({ listId: list.id, task: t, incrementTotal: false })))
      } else {
        // No more tasks to load
        if (isComplete) setAllCompleteLoaded(true)
        else setAllIncompleteLoaded(true)
      }
    } catch { toast.error(__('Failed to load more tasks', 'wedevs-project-manager')) }
    if (isComplete) setLoadingMoreComplete(false)
    else setLoadingMore(false)
  }, [api, projectId, list.id, incompleteTasks, completeTasks, dispatch, toast, __])

  if (isExpandedVariant) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900">
        <ConfirmDialog />
        {/* Expanded Header */}
        <div className="flex items-center justify-between p-6 border-b border-pm-border">
          <div className="space-y-1">
             {renaming ? (
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  autoFocus
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false); }}
                  className="text-xl font-bold text-pm-text-primary flex-1 bg-transparent border-b border-pm-accent outline-none px-0 py-0"
                />
                <button type="button" onClick={handleRename} className="text-pm-accent hover:text-pm-accent/80 p-1 rounded hover:bg-muted transition-colors"><Check className="h-5 w-5" /></button>
                <button type="button" onClick={() => setRenaming(false)} className="text-pm-text-muted hover:text-pm-text p-1 rounded hover:bg-muted transition-colors"><X className="h-5 w-5" /></button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-pm-text-primary" dangerouslySetInnerHTML={{ __html: sanitizeHtml(list.title) }} />
                  {list.meta?.privacy === 1 && <Lock className="h-4 w-4 text-amber-500" />}
                </div>
                {list.description && (
                  <p className="text-sm text-pm-text-muted leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(list.description) }} />
                )}
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-pm-text-muted">
              <span className="font-medium">{totalComplete}/{total} {__('tasks completed', 'wedevs-project-manager')}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-border" />
              <button 
                onClick={() => setShowCompleted(!showCompleted)}
                className="hover:text-pm-accent transition-colors font-medium"
              >
                {showCompleted ? __('Hide completed', 'wedevs-project-manager') : __('Show completed', 'wedevs-project-manager')}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canCreateTask && (
              <Button
                onClick={() => setShowNewTask(true)}
                className="rounded-[6px] bg-pm-accent hover:bg-pm-accent/90 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                {__('Add Task', 'wedevs-project-manager')}
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border-pm-border">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {canEditTaskList && (
                  <DropdownMenuItem onClick={startRename}>
                    <Pencil className="h-4 w-4 mr-2" />
                    {__('Rename List', 'wedevs-project-manager')}
                  </DropdownMenuItem>
                )}
                <Slot name="tasklist.section.menu" listId={list.id} projectId={projectId} list={list} isInbox={isInbox} />
                {!isInbox && canDeleteTaskList && (
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDeleteList}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {__('Delete List', 'wedevs-project-manager')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Task List Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Inline add task (Top) */}
          {showNewTask && canCreateTask && (
            <div className="p-4 border-b border-pm-border bg-pm-accent/[0.02]">
              <form onSubmit={handleCreateTask} className="space-y-3">
                 <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-dashed border-pm-text-muted/30 shrink-0" />
                  <Input
                    autoFocus
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder={__('What needs to be done?', 'wedevs-project-manager')}
                    className="h-10 text-[15px] flex-1 rounded-xl border-pm-border bg-white"
                    onKeyDown={e => { if (e.key === 'Escape') resetForm() }}
                  />
                </div>
                
                <div className="pl-8 space-y-3">
                   <RichTextEditor
                    content={newDesc}
                    onChange={setNewDesc}
                    placeholder={__('Add notes or description...', 'wedevs-project-manager')}
                    minHeight="80px"
                    users={project?.assignees?.data ?? []}
                  />

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={newDueDate}
                        onChange={e => setNewDueDate(e.target.value)}
                        className="h-9 text-sm w-40 rounded-lg border-pm-border"
                      />
                    </div>

                    {milestones.length > 0 && (
                      <select
                        value={selectedMilestone}
                        onChange={e => setSelectedMilestone(e.target.value)}
                        className="h-9 text-sm text-foreground rounded-lg border border-pm-border bg-white px-3 focus:outline-none focus:ring-1 focus:ring-pm-accent w-44"
                      >
                        <option value="">{__('No Milestone', 'wedevs-project-manager')}</option>
                        {milestones.map(m => (
                          <option key={m.id} value={String(m.id)}>{m.title}</option>
                        ))}
                      </select>
                    )}

                    <div className="relative flex-1 max-w-[240px]">
                        <Input
                          value={assigneeSearch}
                          onChange={e => handleSearchUsers(e.target.value)}
                          placeholder={__('Assign to...', 'wedevs-project-manager')}
                          className="h-9 text-sm rounded-lg border-pm-border"
                        />
                        {assigneeResults.length > 0 && assigneeSearch && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-pm-border rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                            {assigneeResults.map(user => {
                              const isSelected = selectedAssignees.some(u => parseInt(u.id) === parseInt(user.id))
                              return (
                                <button
                                  key={user.id}
                                  type="button"
                                  className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-pm-accent/5", isSelected && "text-pm-accent")}
                                  onClick={() => isSelected ? removeAssignee(user.id) : addAssignee(user)}
                                >
                                  <UserAvatar user={user} size="xs" />
                                  <span className="flex-1 truncate font-medium">{user.display_name}</span>
                                  {isSelected && <Check className="h-4 w-4 shrink-0" />}
                                </button>
                              )
                            })}
                          </div>
                        )}
                    </div>
                  </div>

                  {selectedAssignees.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedAssignees.map(user => (
                        <div key={user.id} className="flex items-center gap-1 bg-pm-accent/5 text-pm-accent text-xs font-semibold px-2 py-1 rounded-full border border-pm-accent/10">
                          <UserAvatar user={user} size="xs" />
                          {user.display_name}
                          <button onClick={() => removeAssignee(user.id)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button type="submit" size="sm" className="bg-pm-accent hover:bg-pm-accent/90 rounded-lg px-4" disabled={!newTitle.trim() || creating}>
                      {creating ? __('Adding...', 'wedevs-project-manager') : __('Add Task', 'wedevs-project-manager')}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={resetForm} className="rounded-lg">{__('Cancel', 'wedevs-project-manager')}</Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Task List */}
          <div className="divide-y divide-pm-border">
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
            ) : !showNewTask && (
              <div className="py-20 text-center flex flex-col items-center">
                <ListChecks className="h-12 w-12 text-pm-text-muted/20 mb-3" />
                <p className="text-pm-text-muted font-medium">{__('No active tasks', 'wedevs-project-manager')}</p>
                {canCreateTask && (
                   <button 
                    onClick={() => setShowNewTask(true)}
                    className="mt-4 text-pm-accent hover:underline text-sm font-semibold"
                  >
                    + {__('Add your first task', 'wedevs-project-manager')}
                  </button>
                )}
              </div>
            )}

            {hasMoreIncomplete && (
              <div className="p-4 text-center">
                <Button variant="ghost" onClick={() => handleLoadMore(0)} disabled={loadingMore} className="text-pm-accent">
                  {loadingMore ? __('Loading...', 'wedevs-project-manager') : __('Load more tasks', 'wedevs-project-manager')}
                </Button>
              </div>
            )}

            {/* Bottom add task pill */}
            {canCreateTask && !showNewTask && (
              <div className="p-4">
                <Button
                  onClick={() => setShowNewTask(true)}
                  className="rounded-[6px] bg-pm-accent hover:bg-pm-accent/90 px-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {__('Add Task', 'wedevs-project-manager')}
                </Button>
              </div>
            )}

            {/* Completed Tasks */}
            {showCompleted && totalComplete > 0 && (
              <div className="bg-muted/5">
                <div className="px-4 py-3 bg-muted/10 font-semibold text-xs text-pm-text-muted uppercase tracking-wider">
                  {__('Completed Tasks', 'wedevs-project-manager')}
                </div>
                {completeTasks.map(task => (
                  <TaskRow key={task.id} task={task} projectId={projectId} listId={list.id} showLabels={showLabels} />
                ))}
                {hasMoreComplete && (
                  <div className="p-4 text-center">
                    <Button variant="ghost" onClick={() => handleLoadMore(1)} disabled={loadingMoreComplete} className="text-pm-accent">
                      {loadingMoreComplete ? __('Loading...', 'wedevs-project-manager') : __('Load more completed', 'wedevs-project-manager')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card">
      <ConfirmDialog />
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b">
        <button
          type="button"
          onClick={handleToggle}
          className="p-0.5 hover:bg-muted rounded transition-colors"
        >
          <ChevronDown
            className="h-5 w-5 text-pm-text-muted transition-transform duration-200"
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
            <button type="button" onClick={handleRename} className="text-pm-accent hover:text-pm-accent/80 p-1 rounded hover:bg-muted transition-colors" title={__('Save', 'wedevs-project-manager')}><Check className="h-4 w-4" /></button>
            <button type="button" onClick={() => setRenaming(false)} className="text-pm-text-muted hover:text-pm-text p-1 rounded hover:bg-muted transition-colors" title={__('Cancel', 'wedevs-project-manager')}><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <h3 className="text-sm font-semibold text-pm-text-primary flex-1 truncate" dangerouslySetInnerHTML={{ __html: sanitizeHtml(list.title) }} />
        )}

        {!renaming && list.meta?.privacy === 1 && (
          <Lock className="h-3.5 w-3.5 text-pm-text-muted shrink-0" title={__('Private', 'wedevs-project-manager')} />
        )}

        {/* Counts */}
        <span className="text-[15px] text-pm-text-muted tabular-nums">
          {totalComplete}/{total}
        </span>

        {/* Mini progress */}
        <Progress value={progress} className="h-1 w-16" />

        <span className="text-[14px] font-medium text-pm-text-muted tabular-nums w-8 text-right">
          {progress}%
        </span>

        {/* View single list */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          title={__('View List', 'wedevs-project-manager')}
          onClick={() => navigate(`/projects/${projectId}/task-lists/${list.id}`)}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Button>

        {/* Add task */}
        {canCreateTask && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => { setShowNewTask(v => !v); if (!expanded) dispatch(toggleExpand(list.id)) }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {canEditTaskList && (
              <DropdownMenuItem onClick={startRename}>
                <Pencil className="h-4 w-4 mr-2" />
                {__('Rename', 'wedevs-project-manager')}
              </DropdownMenuItem>
            )}

            {/* Pro slot: archive, duplicate, etc. */}
            <Slot name="tasklist.section.menu" listId={list.id} projectId={projectId} list={list} isInbox={isInbox} />

            {/* Free-tier pro preview rows (shown only when pro is not installed) */}
            {!isPro && (
              <>
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); openProModal(true) }}
                  className="text-pm-text-muted focus:text-pm-text"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  <span className="flex-1">{__('Duplicate', 'wedevs-project-manager')}</span>
                  <Crown className="h-3.5 w-3.5 text-pm-accent" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); openProModal(true) }}
                  className="text-pm-text-muted focus:text-pm-text"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  <span className="flex-1">{__('Archive', 'wedevs-project-manager')}</span>
                  <Crown className="h-3.5 w-3.5 text-pm-accent" />
                </DropdownMenuItem>
              </>
            )}

            {!isInbox && canDeleteTaskList && (
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDeleteList}>
                <Trash2 className="h-4 w-4 mr-2" />
                {__('Delete', 'wedevs-project-manager')}
              </DropdownMenuItem>
            )}
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
                className="text-sm text-pm-accent hover:underline disabled:opacity-50"
                disabled={loadingMore}
                onClick={() => handleLoadMore(0)}
              >
                {loadingMore ? __('Loading...', 'wedevs-project-manager') : __('Load more tasks', 'wedevs-project-manager')}
              </button>
            </div>
          )}

          {incompleteTasks.length === 0 && !showNewTask ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-pm-text-muted mb-3">{__('No tasks yet', 'wedevs-project-manager')}</p>
              {canCreateTask && (
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setShowNewTask(true)}
                >
                  <Plus className="h-5 w-5" />
                  {__('Add a task', 'wedevs-project-manager')}
                </Button>
              )}
            </div>
          ) : null}

          {/* Inline add task */}
          {showNewTask && canCreateTask && (
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
                  placeholder={__('Task name...', 'wedevs-project-manager')}
                  className="h-8 text-sm flex-1"
                  onKeyDown={e => { if (e.key === 'Escape') resetForm() }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-sm px-1.5 text-pm-text-muted"
                  onClick={() => setExpandedForm(v => !v)}
                  title={__('More options', 'wedevs-project-manager')}
                >
                  {expandedForm ? __('Less', 'wedevs-project-manager') : __('More', 'wedevs-project-manager')}
                </Button>
              </div>

              {/* Expanded fields */}
              {expandedForm && (
                <div className="pl-[26px] space-y-2">
                  {/* Description */}
                  <RichTextEditor
                    content={newDesc}
                    onChange={setNewDesc}
                    placeholder={__('Description...', 'wedevs-project-manager')}
                    minHeight="60px"
                    users={project?.assignees?.data ?? []}
                  />

                  {/* Due date */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-pm-text-muted w-16 shrink-0">{__('Due date', 'wedevs-project-manager')}</label>
                    <Input
                      type="date"
                      value={newDueDate}
                      onChange={e => setNewDueDate(e.target.value)}
                      className="h-8 text-sm w-40"
                    />
                  </div>

                  {/* Milestone */}
                  {milestones.length > 0 && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-pm-text-muted w-16 shrink-0 flex items-center gap-1">
                        <MilestoneIcon className="h-3.5 w-3.5" />{__('Milestone', 'wedevs-project-manager')}
                      </label>
                      <select
                        value={selectedMilestone}
                        onChange={e => setSelectedMilestone(e.target.value)}
                        className="h-8 text-sm text-foreground rounded-md border border-input bg-background px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-48"
                      >
                        <option value="">{__('None', 'wedevs-project-manager')}</option>
                        {milestones.map(m => (
                          <option key={m.id} value={String(m.id)}>{m.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Assignees */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-pm-text-muted w-16 shrink-0">{__('Assign', 'wedevs-project-manager')}</label>
                      <div className="relative flex-1">
                        <Input
                          value={assigneeSearch}
                          onChange={e => handleSearchUsers(e.target.value)}
                          placeholder={__('Search users...', 'wedevs-project-manager')}
                          className="h-8 text-sm"
                        />
                        {assigneeResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                            {assigneeResults.map(user => {
                              const isSelected = selectedAssignees.some(u => parseInt(u.id) === parseInt(user.id))
                              return (
                                <button
                                  key={user.id}
                                  type="button"
                                  className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors", isSelected ? "bg-pm-accent/5 text-pm-accent" : "hover:bg-muted/50")}
                                  onClick={() => isSelected ? removeAssignee(user.id) : addAssignee(user)}
                                >
                                  <UserAvatar user={user} size="sm" />
                                  <span className="flex-1 truncate">{user.display_name}</span>
                                  {isSelected && <Check className="h-4 w-4 text-pm-accent shrink-0" />}
                                </button>
                              )
                            })}
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
                            className="inline-flex items-center gap-1 text-sm bg-muted rounded-full pl-1 pr-2 py-0.5"
                          >
                            <UserAvatar user={user} size="sm" />
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
                  className="h-7 text-sm"
                  disabled={!newTitle.trim() || creating}
                >
                  {creating ? __('Adding...', 'wedevs-project-manager') : __('Add Task', 'wedevs-project-manager')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-sm"
                  onClick={resetForm}
                >
                  {__('Cancel', 'wedevs-project-manager')}
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
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-pm-text-muted hover:bg-muted/20 transition-colors"
              >
                <ChevronDown
                  className="h-3.5 w-3.5 transition-transform duration-200"
                  style={{ transform: showCompleted ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
                <span className="font-medium">
                  {totalComplete} {__('Completed', 'wedevs-project-manager')}
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
                        className="text-sm text-pm-accent hover:underline disabled:opacity-50"
                        disabled={loadingMoreComplete}
                        onClick={() => handleLoadMore(1)}
                      >
                        {loadingMoreComplete ? __('Loading...', 'wedevs-project-manager') : __('Load more completed', 'wedevs-project-manager')}
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
