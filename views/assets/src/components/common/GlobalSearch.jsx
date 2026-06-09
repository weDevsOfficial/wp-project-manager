import { __ } from '@wordpress/i18n'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@store/index'
import { openTaskSheet } from '@store/tasksSlice'
import { useApi } from '@hooks/useApi'
import { Button } from '@components/ui/button'
import { Dialog, DialogContent } from '@components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/ui/command'
import {
  Search,
  FolderKanban,
  CheckSquare,
  LayoutList,
  Loader2,
} from 'lucide-react'

export function GlobalSearch({ variant = 'topbar' }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const api = useApi()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ projects: [], tasks: [], taskLists: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleSearch = useCallback(async (value) => {
    setQuery(value)
    if (value.trim().length < 2) {
      setResults({ projects: [], tasks: [], taskLists: [] })
      return
    }
    setLoading(true)
    try {
      const [topbarRes, taskRes] = await Promise.all([
        api.get('admin-topbar-search', { query: value.trim() }),
        api.get('tasks', { title: value.trim(), per_page: 5 }),
      ])
      const items = Array.isArray(topbarRes) ? topbarRes : []
      const projects = items.filter(i => i.type === 'project').slice(0, 5)
      const taskLists = items.filter(i => i.type === 'task_list').slice(0, 5)
      const tasks = (taskRes.data ?? []).slice(0, 5)
      setResults({ projects, tasks, taskLists })
    } catch {
      setResults({ projects: [], tasks: [], taskLists: [] })
    }
    setLoading(false)
  }, [api])

  const hasResults =
    results.projects.length > 0 ||
    results.tasks.length > 0 ||
    results.taskLists.length > 0

  const close = () => {
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      {variant === 'topbar' ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden shrink-0"
            onClick={() => setOpen(true)}
          >
            <Search className="h-5 w-5 text-pm-text-muted" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-sm gap-1.5 text-pm-text-muted font-normal hidden md:flex"
            onClick={() => setOpen(true)}
          >
            <Search className="h-3.5 w-3.5" />
            {__('Search...', 'wedevs-project-manager')}
            <kbd className="ml-2 text-[14px] bg-muted px-1 py-0.5 rounded font-mono">⌘K</kbd>
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden shrink-0"
            onClick={() => setOpen(true)}
          >
            <Search className="h-5 w-5 text-pm-text-muted" />
          </Button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden md:flex items-center gap-2 h-8 w-56 lg:w-64 px-3 rounded-md border border-pm-border bg-pm-surface-muted text-sm text-pm-text-muted hover:bg-muted/60 transition-colors"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left truncate">
              {__('Search projects and tasks...', 'wedevs-project-manager')}
            </span>
            <kbd className="text-[12px] bg-muted px-1 py-0.5 rounded font-mono">⌘K</kbd>
          </button>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[calc(100vw-2rem)] sm:max-w-[480px] p-0 gap-0 overflow-hidden"
          data-pm-dialog
        >
          <Command shouldFilter={false} className="rounded-lg">
            <CommandInput
              placeholder={__('Search projects and tasks...', 'wedevs-project-manager')}
              value={query}
              onValueChange={handleSearch}
            />
            <CommandList className="max-h-[320px]">
              {loading && (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {__('Searching...', 'wedevs-project-manager')}
                </div>
              )}
              {!loading && query.trim().length >= 2 && !hasResults && (
                <CommandEmpty>{__('No results found', 'wedevs-project-manager')}</CommandEmpty>
              )}
              {results.projects.length > 0 && (
                <CommandGroup heading={__('Projects', 'wedevs-project-manager')}>
                  {results.projects.map(p => (
                    <CommandItem
                      key={`p-${p.id}`}
                      value={`project-${p.id}`}
                      onSelect={() => { navigate(`/projects/${p.id}/task-lists`); close() }}
                      className="cursor-pointer"
                    >
                      <FolderKanban className="h-4 w-4 mr-2 text-pm-text-muted" />
                      <span className="text-sm truncate">{p.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {results.taskLists.length > 0 && (
                <CommandGroup heading={__('Task Lists', 'wedevs-project-manager')}>
                  {results.taskLists.map(l => (
                    <CommandItem
                      key={`tl-${l.id}`}
                      value={`tasklist-${l.id}`}
                      onSelect={() => { navigate(`/projects/${l.project_id}/task-lists/${l.id}`); close() }}
                      className="cursor-pointer"
                    >
                      <LayoutList className="h-4 w-4 mr-2 text-pm-text-muted" />
                      <span className="text-sm truncate">{l.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {results.tasks.length > 0 && (
                <CommandGroup heading={__('Tasks', 'wedevs-project-manager')}>
                  {results.tasks.map(t => (
                    <CommandItem
                      key={`t-${t.id}`}
                      value={`task-${t.id}`}
                      onSelect={() => {
                        const rawList = t.task_list_id
                        const listId = rawList?.data?.id ?? rawList?.id ?? rawList ?? null
                        const projectId = t.project_id
                        close()
                        const target = listId
                          ? `/projects/${projectId}/task-lists/${listId}`
                          : `/projects/${projectId}/task-lists`
                        navigate(target)
                        dispatch(openTaskSheet({ ...t, project_id: projectId, task_list_id: listId }))
                      }}
                      className="cursor-pointer"
                    >
                      <CheckSquare className="h-4 w-4 mr-2 text-pm-text-muted" />
                      <span className="text-sm truncate">{t.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
