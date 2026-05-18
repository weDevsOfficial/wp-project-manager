import { __ } from '@wordpress/i18n';
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, resetProjectState } from "@store/index";
import {
  fetchTaskLists,
  createTaskList,
} from "@store/taskListsSlice";
import { cn } from "@lib/utils";
import { useToast } from "@hooks/useToast";
import { useApi } from "@hooks/useApi";
import { usePermissions } from "@hooks/usePermissions";
import { useCurrentProject } from "@hooks/useCurrentProject";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import RichTextEditor from "@components/common/RichTextEditor";
import { Checkbox } from "@components/ui/checkbox";
import { Skeleton } from "@components/ui/skeleton";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious,
} from "@components/ui/pagination";
import {
  Plus,
  ClipboardList,
  ListChecks,
  ListTodo,
  LoaderCircle,
  CircleCheck,
  ArrowLeft,
  Crown
} from "lucide-react";
import TaskListSection from "./TaskListSection";
import TaskDetailSheet from "./TaskDetailSheet";
import TaskFilterBar from "./TaskFilterBar";
import TaskRow from "./TaskRow";
import TaskListSidebarItem from "./TaskListSidebarItem";

export default function TaskListsPage() {
  const { projectId: pidParam } = useParams();
  const projectId = parseInt(pidParam ?? "0", 10);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const api = useApi();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager } = usePermissions(project);
  const canCreateList = isManager || userCan('create_task_list');

  const { lists, loading, listsMeta } = useAppSelector((s) => s.taskLists);

  const [selectedListId, setSelectedListId] = useState(null);
  const [showNewList, setShowNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [newListPrivate, setNewListPrivate] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(null);
  const [showLabels, setShowLabels] = useState(false);
  const [inboxListId, setInboxListId] = useState(null);

  // Stats from project meta
  const stats = useMemo(() => {
    const meta = project?.meta || {}
    return [
      { label: __('Task List', 'wedevs-project-manager'), value: meta.total_task_lists || 0, icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50' },
      { label: __('Tasks', 'wedevs-project-manager'), value: meta.total_tasks || 0, icon: ListChecks, color: 'text-purple-500', bg: 'bg-purple-50' },
      { label: __('Current', 'wedevs-project-manager'), value: meta.total_incomplete_tasks || 0, icon: ListTodo, color: 'text-orange-500', bg: 'bg-orange-50' },
      { label: __('Outstanding', 'wedevs-project-manager'), value: meta.total_incomplete_tasks || 0, icon: LoaderCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
      { label: __('Completed', 'wedevs-project-manager'), value: meta.total_complete_tasks || 0, icon: CircleCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ]
  }, [project])

  const handlePageChange = useCallback((page) => {
    if (page < 1 || page > listsMeta.total_pages || page === listsMeta.current_page) return
    dispatch(fetchTaskLists({ projectId, page }))
  }, [dispatch, projectId, listsMeta.total_pages, listsMeta.current_page])

  // Fetch task lists on mount / project change
  useEffect(() => {
    setShowLabels(false)
    dispatch(resetProjectState())
    if (projectId) {
      dispatch(fetchTaskLists({ projectId }));
      api.get(`projects/${projectId}`, { with: 'labels' })
        .then(res => {
          const proj = res?.data ?? res
          if (proj?.label_in_tasks_list) {
            setShowLabels(proj.label_in_tasks_list.status === 'enable' || proj.label_in_tasks_list.status === true)
          }
          if (proj?.list_inbox) setInboxListId(parseInt(proj.list_inbox, 10) || null)
        })
        .catch(() => {})
    }
  }, [dispatch, projectId]);

  // Set initial selected list
  useEffect(() => {
    if (lists.length > 0 && !selectedListId) {
      setSelectedListId(lists[0].id)
    }
  }, [lists, selectedListId])

  const handleCreateList = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newListTitle.trim() || creatingList) return;
      setCreatingList(true);
      try {
        const result = await dispatch(
          createTaskList({
            projectId,
            title: newListTitle.trim(),
            description: newListDesc.trim() || undefined,
            privacy: newListPrivate ? 1 : 0,
          }),
        ).unwrap();
        
        if (result?.id) setSelectedListId(result.id)
        
        setNewListTitle("");
        setNewListDesc("");
        setNewListPrivate(false);
        setShowNewList(false);
        toast.success(__("Task list created", 'wedevs-project-manager'));
      } catch {
        toast.error(__("Failed to create task list", 'wedevs-project-manager'));
      }
      setCreatingList(false);
    },
    [dispatch, projectId, newListTitle, newListDesc, newListPrivate, creatingList, toast, __]
  );

  const selectedList = useMemo(() => 
    lists.find(l => l.id === selectedListId), 
  [lists, selectedListId])

  // ── Render helpers ────────────────────────────────

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon
        return (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-pm-border flex flex-col gap-6">
            <div className={cn('p-2 rounded-full flex items-center justify-center self-start', s.bg)}>
              <Icon className={cn('w-5 h-5', s.color)} />
            </div>
            <div className="flex items-end justify-between gap-1">
              <span className="text-sm text-pm-text-muted leading-tight">{s.label}</span>
              <span className="text-3xl font-bold text-pm-text-primary tabular-nums leading-none shrink-0">
                {s.value}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderSkeleton = () => (
    <div className="flex flex-col lg:flex-row rounded-lg border border-pm-border overflow-hidden min-h-[600px]">
      <div className="lg:w-[350px] shrink-0 border-b lg:border-b-0 lg:border-r border-pm-border p-[21px] flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex-1">
        <Skeleton className="h-full w-full min-h-[600px]" />
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-xl border border-pm-border">
      <ListTodo className="h-16 w-16 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-medium text-pm-text-primary mb-1">
        {__("No task lists yet", 'wedevs-project-manager')}
      </h3>
      <p className="text-sm text-pm-text-muted mb-4">
        {__("Create your first task list to start organizing work.", 'wedevs-project-manager')}
      </p>
      {canCreateList && (
        <Button onClick={() => setShowNewList(true)} className="rounded-[6px] px-5">
          <Plus className="h-5 w-5 mr-2" />
          {__("New Task List", 'wedevs-project-manager')}
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-sm text-pm-text-muted hover:text-pm-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{__('Back to Projects', 'wedevs-project-manager')}</span>
        </button>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[28px] font-bold text-pm-text-primary leading-tight">
            {__("Task List", 'wedevs-project-manager')}
          </h1>
          <div className="flex items-center gap-3">
            <TaskFilterBar
              projectId={projectId}
              lists={lists}
              onFilterResults={(tasks) => setFilteredTasks(tasks)}
              onClear={() => setFilteredTasks(null)}
            />
            {canCreateList && (
              <Button
                className="rounded-[6px] px-4 h-10 bg-pm-accent hover:bg-pm-accent/90"
                onClick={() => setShowNewList(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {__('New List', 'wedevs-project-manager')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && lists.length > 0 && renderStats()}

      {/* Main Content Area */}
      {loading ? (
        renderSkeleton()
      ) : lists.length === 0 ? (
        renderEmpty()
      ) : (
        <div className="flex flex-col lg:flex-row rounded-lg border border-pm-border overflow-hidden bg-white dark:bg-slate-900 min-h-[600px]">
          {/* Sidebar: List of Task Lists */}
          <div className="lg:w-[350px] shrink-0 border-b lg:border-b-0 lg:border-r border-pm-border flex flex-col">
            <div className="flex-1 overflow-y-auto p-[21px] flex flex-col gap-4 custom-scrollbar">
              {lists.map((list) => (
                <TaskListSidebarItem
                  key={list.id}
                  list={list}
                  projectId={projectId}
                  isActive={selectedListId === list.id && !filteredTasks}
                  onClick={() => { setSelectedListId(list.id); setFilteredTasks(null); }}
                />
              ))}
            </div>

            {/* Pagination for lists if many */}
            {listsMeta.total_pages > 1 && (
              <div className="p-4 border-t border-pm-border">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(listsMeta.current_page - 1)}
                        className={listsMeta.current_page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="text-xs font-bold text-pm-text-muted px-2">
                        {listsMeta.current_page} / {listsMeta.total_pages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(listsMeta.current_page + 1)}
                        className={listsMeta.current_page >= listsMeta.total_pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Main: Tasks for Selected List */}
          <div className="flex-1 overflow-hidden">
            {filteredTasks ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-pm-border flex items-center justify-between bg-pm-surface/30">
                  <div>
                    <h2 className="text-xl font-bold text-pm-text-primary">{__('Filtered Results', 'wedevs-project-manager')}</h2>
                    <p className="text-sm text-pm-text-muted mt-0.5">{__('Showing matching tasks from all lists', 'wedevs-project-manager')}</p>
                  </div>
                  <Button variant="ghost" onClick={() => setFilteredTasks(null)} className="text-pm-accent font-bold hover:bg-pm-accent/5">
                    {__('Back to list', 'wedevs-project-manager')}
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-pm-border">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <TaskRow 
                        key={task.id} 
                        task={task} 
                        projectId={projectId} 
                        listId={task.task_list_id || task.board_id} 
                        showLabels={showLabels} 
                      />
                    ))
                  ) : (
                    <div className="py-40 text-center flex flex-col items-center">
                      <ListTodo className="h-12 w-12 text-pm-text-muted/20 mb-3" />
                      <p className="text-pm-text-muted font-medium">{__('No tasks match your filters', 'wedevs-project-manager')}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedList ? (
              <TaskListSection 
                list={selectedList} 
                projectId={projectId} 
                showLabels={showLabels} 
                isInbox={inboxListId && parseInt(selectedList.id, 10) === inboxListId}
                variant="expanded"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-40 text-center">
                <ListTodo className="h-16 w-16 text-pm-text-muted/10 mb-4" />
                <p className="text-pm-text-muted font-bold text-lg">{__('Select a task list', 'wedevs-project-manager')}</p>
                <p className="text-pm-text-muted/60 text-sm mt-1">{__('Choose a list from the sidebar to manage its tasks', 'wedevs-project-manager')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New list form modal/sheet can be added here if needed, 
          for now using the existing form logic but could be a dialog */}
      {showNewList && (
        <div className="fixed inset-0 z-[100100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <form
            onSubmit={handleCreateList}
            className="w-full max-w-lg rounded-xl border bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-pm-text-primary">{__('New Task List', 'wedevs-project-manager')}</h3>
              <button type="button" onClick={() => setShowNewList(false)} className="text-pm-text-muted hover:text-pm-text-primary">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-pm-text-primary">{__('List Name', 'wedevs-project-manager')}</label>
                <Input
                  autoFocus
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder={__("Enter list name", 'wedevs-project-manager')}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-pm-text-primary">{__('Description', 'wedevs-project-manager')}</label>
                <RichTextEditor
                  content={newListDesc}
                  onChange={setNewListDesc}
                  placeholder={__("Add some details...", 'wedevs-project-manager')}
                  minHeight="100px"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <Checkbox
                  id="new-list-private"
                  checked={newListPrivate}
                  onCheckedChange={(v) => setNewListPrivate(!!v)}
                  disabled={!isPro}
                />
                <div className="flex-1">
                  <label
                    htmlFor="new-list-private"
                    className={cn("text-sm font-medium cursor-pointer", isPro ? 'text-pm-text-primary' : 'text-pm-text-muted')}
                  >
                    {__("Make this list private", 'wedevs-project-manager')}
                  </label>
                  <p className="text-xs text-pm-text-muted">{__('Only assigned users can see this list.', 'wedevs-project-manager')}</p>
                </div>
                {!isPro && <Crown className="h-4 w-4 text-pm-accent" />}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-[6px] h-11 border-pm-border"
                onClick={() => setShowNewList(false)}
              >
                {__("Cancel", 'wedevs-project-manager')}
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-[6px] h-11 bg-pm-accent hover:bg-pm-accent/90"
                disabled={!newListTitle.trim() || creatingList}
              >
                {creatingList ? __("Creating...", 'wedevs-project-manager') : __("Create List", 'wedevs-project-manager')}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Task detail sheet */}
      <TaskDetailSheet />
    </div>
  );
}
