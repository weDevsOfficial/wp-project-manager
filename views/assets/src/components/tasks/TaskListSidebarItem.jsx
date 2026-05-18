import { __ } from '@wordpress/i18n';
import React, { useState, useCallback } from 'react'
import { useAppDispatch } from '@store/index'
import { updateTaskList, deleteTaskList } from '@store/taskListsSlice'
import { cn } from '@lib/utils'
import { useToast } from '@hooks/useToast'
import { useConfirm } from '@hooks/useConfirm'
import { usePermissions } from '@hooks/usePermissions'
import { useCurrentProject } from '@hooks/useCurrentProject'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { Button } from '@components/ui/button'
import { MoreHorizontal, Pencil, Trash2, Check, X } from 'lucide-react'

export default function TaskListSidebarItem({ list, isActive, onClick, projectId }) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [ConfirmDialog, confirm] = useConfirm()
  const project = useCurrentProject(projectId)
  const { isManager, userCan } = usePermissions(project)
  const canEdit = isManager || userCan('edit_task_list')
  const canDelete = isManager || userCan('delete_task_list')

  const [renaming, setRenaming] = useState(false)
  const [renameTitle, setRenameTitle] = useState('')

  const completed = list.meta?.total_complete_tasks ?? 0
  const incomplete = list.meta?.total_incomplete_tasks ?? 0
  const total = completed + incomplete
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  const startRename = useCallback((e) => {
    e.stopPropagation()
    setRenameTitle(list.title)
    setRenaming(true)
  }, [list.title])

  const handleRenameSubmit = useCallback(async (e) => {
    e?.stopPropagation()
    if (!renameTitle.trim() || renameTitle.trim() === list.title) { setRenaming(false); return }
    try {
      await dispatch(updateTaskList({ projectId, listId: list.id, title: renameTitle.trim() })).unwrap()
      toast.success(__('List renamed', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to rename list', 'wedevs-project-manager'))
    }
    setRenaming(false)
  }, [dispatch, projectId, list.id, list.title, renameTitle, toast])

  const handleDelete = useCallback(async (e) => {
    e.stopPropagation()
    const ok = await confirm(
      __('Delete this list and all its tasks?', 'wedevs-project-manager'),
      __('Delete List', 'wedevs-project-manager')
    )
    if (!ok) return
    try {
      await dispatch(deleteTaskList({ projectId, listId: list.id })).unwrap()
      toast.success(__('List deleted', 'wedevs-project-manager'))
    } catch {
      toast.error(__('Failed to delete list', 'wedevs-project-manager'))
    }
  }, [dispatch, projectId, list.id, toast, confirm])

  return (
    <>
      <ConfirmDialog />
      <div
        role="button"
        tabIndex={0}
        onClick={!renaming ? onClick : undefined}
        onKeyDown={!renaming ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick?.() : undefined}
        className={cn(
          'group w-full flex flex-col gap-3 p-5 rounded-lg transition-all text-left cursor-pointer',
          isActive
            ? 'bg-white border border-pm-accent shadow-sm'
            : 'bg-white border border-pm-border/50 hover:border-pm-border hover:shadow-sm'
        )}
      >
        {/* Title row */}
        {renaming ? (
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <input
              autoFocus
              value={renameTitle}
              onChange={e => setRenameTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRenameSubmit(e); if (e.key === 'Escape') setRenaming(false) }}
              className="flex-1 text-[15px] font-semibold text-pm-text-primary bg-transparent border-b border-pm-accent outline-none"
            />
            <button type="button" onClick={handleRenameSubmit} className="text-pm-accent hover:text-pm-accent/80 p-1 rounded">
              <Check className="h-4 w-4" />
            </button>
            <button type="button" onClick={e => { e.stopPropagation(); setRenaming(false) }} className="text-pm-text-muted hover:text-pm-text-primary p-1 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span className="text-[15px] font-semibold text-pm-text-primary truncate flex-1">
              {list.title}
            </span>
            {(canEdit || canDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 rounded-lg hover:bg-pm-surface"
                    onClick={e => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl border-pm-border">
                  {canEdit && (
                    <DropdownMenuItem onClick={startRename} className="rounded-lg">
                      <Pencil className="h-4 w-4 mr-2" />
                      {__('Rename', 'wedevs-project-manager')}
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive focus:bg-destructive/5 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {__('Delete', 'wedevs-project-manager')}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {/* Progress bar + percentage on same row */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-pm-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[12px] font-semibold text-pm-text-muted shrink-0">
            {progress}%
          </span>
        </div>

        {/* Done / total below bar */}
        <span className="text-[12px] text-pm-text-muted">
          {completed}/{total} {__('done', 'wedevs-project-manager')} / {total} {__('total', 'wedevs-project-manager')}
        </span>
      </div>
    </>
  )
}
