import { __ } from '@wordpress/i18n';
import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/ui/command'
import { ListTodo, Loader2, Check } from 'lucide-react'

export default function MoveTaskDialog({ open, onOpenChange, task, projectId, currentListId, onMoved }) {
  const api = useApi()
  const toast = useToast()

  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedListId, setSelectedListId] = useState(null)
  const [moving, setMoving] = useState(false)

  useEffect(() => {
    if (!open || !projectId) return
    setLoading(true)
    setSelectedListId(null)
    api
      .get(`projects/${projectId}/task-lists`, { per_page: 100 })
      .then((res) => setLists(res.data ?? []))
      .catch(() => setLists([]))
      .finally(() => setLoading(false))
  }, [open, projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMove = useCallback(async () => {
    if (!selectedListId || !task) return
    setMoving(true)
    try {
      await api.post(`projects/${projectId}/tasks/sorting`, {
        project_id: projectId,
        list_id: selectedListId,
        task_id: task.id,
        orders: [{ id: task.id, index: 0 }],
        receive: 1,
      })
      toast.success(__('Task moved', 'wedevs-project-manager'))
      onMoved?.(task.id, currentListId, selectedListId)
      onOpenChange(false)
    } catch {
      toast.error(__('Failed to move task', 'wedevs-project-manager'))
    }
    setMoving(false)
  }, [api, projectId, task, selectedListId, currentListId, toast, __, onMoved, onOpenChange])

  const availableLists = lists.filter((l) => l.id !== currentListId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]" data-pm-dialog>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-pm-accent" />
            {__('Move Task', 'wedevs-project-manager')}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-pm-text-muted" />
          </div>
        ) : (
          <Command className="rounded-lg border">
            <CommandInput placeholder={__('Search task lists...', 'wedevs-project-manager')} />
            <CommandList className="max-h-[240px]">
              <CommandEmpty>{__('No lists found', 'wedevs-project-manager')}</CommandEmpty>
              <CommandGroup>
                {availableLists.map((list) => (
                  <CommandItem
                    key={list.id}
                    value={list.title}
                    onSelect={() => setSelectedListId(list.id)}
                    className="cursor-pointer"
                  >
                    <ListTodo className="h-4 w-4 mr-2 text-pm-text-muted" />
                    <span className="flex-1 truncate">{list.title}</span>
                    {selectedListId === list.id && (
                      <Check className="h-5 w-5 text-pm-accent" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={moving}>
            {__('Cancel', 'wedevs-project-manager')}
          </Button>
          <Button onClick={handleMove} disabled={!selectedListId || moving}>
            {moving && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
            {moving ? __('Moving...', 'wedevs-project-manager') : __('Move', 'wedevs-project-manager')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
