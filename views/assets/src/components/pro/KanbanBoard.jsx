import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchBoards, fetchBoardTasks, createBoard, updateBoard, deleteBoard, reorderBoards, reorderTasks, addTaskToBoard, removeTaskFromBoard, setBoardColor, importTasks } from '@store/pro/kanbanSlice'
import { useI18n } from '@hooks/useI18n'
import { useApi } from '@hooks/useApi'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Badge } from '@components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog'
import { ScrollArea } from '@components/ui/scroll-area'
import { Skeleton } from '@components/ui/skeleton'
import { Plus, MoreHorizontal, Trash2, Palette, Settings, GripVertical, Calendar, MessageSquare, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function KanbanCard({ task, projectId, boardId, onRemove }) {
  const { __ } = useI18n()
  return (
    <div className="bg-white rounded-lg border border-pm-border p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-pm-text-primary leading-snug flex-1">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted transition-opacity">
              <MoreHorizontal className="h-3.5 w-3.5 text-pm-text-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem className="text-destructive" onClick={() => onRemove(task.id)}>
              <Trash2 className="h-3.5 w-3.5 mr-2" />{__('Remove')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-pm-text-muted">
        {task.due_date && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {task.due_date}
          </span>
        )}
        {task.comments_count > 0 && (
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {task.comments_count}
          </span>
        )}
      </div>
      {task.assignees?.data?.length > 0 && (
        <div className="flex items-center gap-1 mt-2">
          {task.assignees.data.slice(0, 3).map(u => (
            <Avatar key={u.id} className="h-5 w-5">
              <AvatarImage src={u.avatar_url} />
              <AvatarFallback className="text-[8px]">{(u.display_name || 'U')[0]}</AvatarFallback>
            </Avatar>
          ))}
          {task.assignees.data.length > 3 && (
            <span className="text-[10px] text-pm-text-muted">+{task.assignees.data.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
}

function KanbanColumn({ board, projectId, onUpdate, onDelete, onColorChange, onRefresh }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const api = useApi()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(board.title || '')
  const [addingTask, setAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [creating, setCreating] = useState(false)

  // Tasks come from fetchBoardTasks — could be { data: [...] } or array
  const rawTasks = board.tasks
  const tasks = Array.isArray(rawTasks) ? rawTasks : (rawTasks?.data ?? [])

  // Sync local title if board.title changes from Redux
  useEffect(() => { setTitle(board.title || '') }, [board.title])

  const handleTitleSave = () => {
    if (title.trim() && title !== board.title) {
      onUpdate(board.id, { title: title.trim() })
    }
    setEditing(false)
  }

  const handleRemoveTask = (taskId) => {
    dispatch(removeTaskFromBoard({ projectId, boardId: board.id, taskId }))
  }

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || creating) return
    setCreating(true)
    try {
      // Vue sends: title, board_id (list ID), kan_board_id (kanban column ID)
      // The backend uses kan_board_id to add the task to the kanban column
      await api.post(`projects/${projectId}/tasks`, {
        title: newTaskTitle.trim(),
        project_id: projectId,
        board_id: board.id,          // This doubles as list ID for the backend
        kan_board_id: board.id,      // Kanban column ID — tells backend to add to this column
      })
      setNewTaskTitle('')
      toast.success(__('Task created'))
      if (onRefresh) onRefresh()
    } catch (e) {
      console.error('[Kanban] Create task failed:', e)
      toast.error(e?.message || __('Failed to create task'))
    }
    setCreating(false)
  }

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] bg-muted/30 rounded-xl border border-pm-border/50">
      {/* Column header */}
      <div
        className="px-3 py-2.5 rounded-t-xl flex items-center justify-between gap-2"
        style={{ backgroundColor: board.header_background || 'transparent' }}
      >
        {editing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            className="h-7 text-sm font-semibold"
            autoFocus
          />
        ) : (
          <button
            className="text-sm font-semibold text-pm-text-primary truncate text-left flex-1"
            onClick={() => setEditing(true)}
          >
            {board.title}
            <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">{tasks.length}</Badge>
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-black/10 transition-colors">
              <MoreHorizontal className="h-4 w-4 text-pm-text-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onColorChange(board.id)}>
              <Palette className="h-3.5 w-3.5 mr-2" />{__('Change Color')}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(board.id)}>
              <Trash2 className="h-3.5 w-3.5 mr-2" />{__('Delete Column')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1 px-2 py-2 max-h-[calc(100vh-220px)]">
        <div className="space-y-2">
          {tasks.map(task => (
            <KanbanCard
              key={task.id}
              task={task}
              projectId={projectId}
              boardId={board.id}
              onRemove={handleRemoveTask}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Add task */}
      <div className="px-2 pb-2">
        {addingTask ? (
          <div className="space-y-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder={__('Task title...')}
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateTask()
                if (e.key === 'Escape') setAddingTask(false)
              }}
            />
            <div className="flex gap-1">
              <Button size="sm" className="h-7 text-xs" disabled={creating} onClick={handleCreateTask}>
                {creating ? __('Adding...') : __('Add')}
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setAddingTask(false)}>
                {__('Cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <button
            className="w-full text-left text-sm text-pm-text-muted hover:text-pm-accent p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-1.5"
            onClick={() => setAddingTask(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            {__('Add task')}
          </button>
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard() {
  const { projectId } = useParams()
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { boards, loading } = useAppSelector(s => s.kanban)
  const [newColTitle, setNewColTitle] = useState('')
  const [addingCol, setAddingCol] = useState(false)

  // Two-step load: 1) fetch board columns, 2) fetch tasks per column
  const loadAllBoards = useCallback(() => {
    if (!projectId) return
    dispatch(fetchBoards({ projectId })).then((action) => {
      const boardsList = action.payload
      const arr = Array.isArray(boardsList) ? boardsList : boardsList?.data ?? []
      arr.forEach(board => {
        dispatch(fetchBoardTasks({ projectId, boardId: board.id }))
      })
    })
  }, [projectId, dispatch])

  useEffect(() => { loadAllBoards() }, [loadAllBoards])

  const handleCreateBoard = () => {
    if (!newColTitle.trim()) return
    dispatch(createBoard({ projectId, title: newColTitle.trim() })).then(() => loadAllBoards())
    setNewColTitle('')
    setAddingCol(false)
  }

  const handleUpdateBoard = (boardId, payload) => {
    dispatch(updateBoard({ projectId, boardId, payload }))
  }

  const handleDeleteBoard = (boardId) => {
    if (window.confirm(__('Delete this column and all its tasks?'))) {
      dispatch(deleteBoard({ projectId, boardId }))
    }
  }

  const handleColorChange = (boardId) => {
    // Simple color prompt — can upgrade to a proper picker later
    const color = window.prompt(__('Enter hex color (e.g. #6C63FF):'), '#6C63FF')
    if (color) dispatch(setBoardColor({ projectId, boardId, color }))
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="min-w-[280px]">
              <Skeleton className="h-10 w-full rounded-t-xl mb-2" />
              <Skeleton className="h-24 w-full mb-2" />
              <Skeleton className="h-24 w-full mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-pm-text-primary">{__('Kanban Board')}</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-180px)]">
        {boards.map(board => (
          <KanbanColumn
            key={board.id}
            board={board}
            projectId={projectId}
            onUpdate={handleUpdateBoard}
            onDelete={handleDeleteBoard}
            onColorChange={handleColorChange}
            onRefresh={loadAllBoards}
          />
        ))}

        {/* Add new column */}
        <div className="min-w-[280px] max-w-[320px]">
          {addingCol ? (
            <div className="bg-muted/30 rounded-xl border border-dashed border-pm-border/50 p-3 space-y-2">
              <Input
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                placeholder={__('Column title...')}
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateBoard()
                  if (e.key === 'Escape') setAddingCol(false)
                }}
              />
              <div className="flex gap-1">
                <Button size="sm" className="h-7 text-xs" onClick={handleCreateBoard}>
                  {__('Add Column')}
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setAddingCol(false)}>
                  {__('Cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <button
              className="w-full h-20 rounded-xl border-2 border-dashed border-pm-border/40 hover:border-pm-accent/50 flex items-center justify-center gap-2 text-sm text-pm-text-muted hover:text-pm-accent transition-colors"
              onClick={() => setAddingCol(true)}
            >
              <Plus className="h-4 w-4" />
              {__('Add Column')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
