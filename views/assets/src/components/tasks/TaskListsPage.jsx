import { Loader2 } from 'lucide-react'
import { __ } from '@wordpress/i18n';
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, resetProjectState } from "@store/index";
import {
  fetchTaskLists,
  createTaskList,
  reorderLists,
  reorderListsLocal,
  expandAll,
  collapseAll,
  updateListPrivacy,
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
import { PaginationNav } from "@components/ui/pagination";
import { Plus, ChevronsUpDown, ListTodo, Filter, X } from "lucide-react";
import ProBadge from "@components/common/ProBadge";
import { Badge } from "@components/ui/badge";
import BackButton from '@components/common/BackButton';
import { Slot } from "@hooks/useSlot";
import TaskListSection from "./TaskListSection";
import TaskDetailSheet from "./TaskDetailSheet";
import TaskFilterBar from "./TaskFilterBar";
import TaskRow from "./TaskRow";

export default function TaskListsPage() {
  const { projectId: pidParam } = useParams();
  const projectId = parseInt(pidParam ?? "0", 10);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const api = useApi();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager } = usePermissions(project);
  const canCreateList = isManager || userCan('create_list');

  const { lists, loading, expandedIds, listsMeta } = useAppSelector((s) => s.taskLists);

  const handlePageChange = useCallback((page) => {
    if (page < 1 || page > listsMeta.total_pages || page === listsMeta.current_page) return
    dispatch(fetchTaskLists({ projectId, page }))
  }, [dispatch, projectId, listsMeta.total_pages, listsMeta.current_page])

  const [showNewList, setShowNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [newListPrivate, setNewListPrivate] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(null);
  const [showLabels, setShowLabels] = useState(false);
  const [inboxListId, setInboxListId] = useState(null);

  // ── List drag-drop ────────────────────────────────
  const dragListIdx = useRef(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const handleListDragStart = useCallback((idx) => {
    dragListIdx.current = idx;
  }, []);

  const handleListDragOver = useCallback((e, idx) => {
    e.preventDefault();
    if (dragListIdx.current !== null && dragListIdx.current !== idx) {
      setDragOverIdx(idx);
    }
  }, []);

  const handleListDrop = useCallback((e, toIdx) => {
    e.preventDefault();
    const fromIdx = dragListIdx.current;
    if (fromIdx === null || fromIdx === toIdx) {
      dragListIdx.current = null;
      setDragOverIdx(null);
      return;
    }
    // Optimistic reorder
    dispatch(reorderListsLocal({ fromIndex: fromIdx, toIndex: toIdx }));
    // Build orders array for API
    const reordered = [...lists];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const orders = reordered.map((l, i) => ({ id: l.id, index: i }));
    dispatch(reorderLists({ projectId, orders }))
      .then((action) => {
        if (action.error) toast.error(__('Failed to reorder lists', 'wedevs-project-manager'))
        else toast.success(__('Lists reordered', 'wedevs-project-manager'))
      });

    dragListIdx.current = null;
    setDragOverIdx(null);
  }, [dispatch, lists, projectId, toast, __]);

  const handleListDragEnd = useCallback(() => {
    dragListIdx.current = null;
    setDragOverIdx(null);
  }, []);

  // Fetch task lists on mount / project change
  useEffect(() => {
    setShowLabels(false) // Reset for new project
    dispatch(resetProjectState()) // Clear all project-scoped Redux state
    if (projectId) {
      dispatch(fetchTaskLists({ projectId }));
      // Check label_in_tasks_list project setting
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
  }, [dispatch, projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateList = useCallback(
    async (e) => {
      e.preventDefault();
      if (!canCreateList || !newListTitle.trim() || creatingList) return;
      setCreatingList(true);
      try {
        const newList = await dispatch(
          createTaskList({
            projectId,
            title: newListTitle.trim(),
            description: newListDesc.trim() || undefined,
          }),
        ).unwrap();
        // Privacy is a Pro feature persisted through the dedicated privacy
        // endpoint (the create route ignores it). Mirror the task-privacy flow.
        if (isPro && newListPrivate && newList?.id) {
          try {
            await api.post(`projects/${projectId}/task-lists/privacy/${newList.id}`, {
              is_private: 1,
            });
            dispatch(updateListPrivacy({ listId: newList.id, privacy: 1 }));
          } catch {
            toast.error(__("Failed to set list privacy", 'wedevs-project-manager'));
          }
        }
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
    [
      dispatch,
      projectId,
      newListTitle,
      newListDesc,
      newListPrivate,
      creatingList,
      canCreateList,
      isPro,
      api,
      toast,
      __,
    ],
  );

  useEffect(() => {
    if (!canCreateList) {
      setShowNewList(false);
      setNewListTitle("");
      setNewListDesc("");
      setNewListPrivate(false);
    }
  }, [canCreateList, projectId]);

  const allExpanded = expandedIds.length === lists.length && lists.length > 0;

  // ── Skeleton ────────────────────────────────

  const renderSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card overflow-hidden">
          <div className="px-4 py-3 bg-muted/30 border-b">
            <Skeleton className="h-5 w-1/3" />
          </div>
          <div className="p-3 space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-9 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Empty state ─────────────────────────────

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ListTodo className="h-16 w-16 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-medium text-pm-text-primary mb-1">
        {__("No task lists yet", 'wedevs-project-manager')}
      </h3>
      <p className="text-sm text-pm-text-muted mb-4">
        {__("Create your first task list to start organizing work.", 'wedevs-project-manager')}
      </p>
      {canCreateList && (
        <Button className="h-11 px-5" onClick={() => setShowNewList(true)}>
          <Plus className="h-5 w-5 mr-2" />
          {__("New Task List", 'wedevs-project-manager')}
        </Button>
      )}
    </div>
  );

  const [filterOpen, setFilterOpen] = useState(false)
  const [filterCount, setFilterCount] = useState(0)
  const clearFilterRef = useRef(null)

  // ── Main render ─────────────────────────────

  return (
    <div className="w-full p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <BackButton fallback="/projects" />
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("Task Lists", 'wedevs-project-manager')}
          </h1>
          {lists.length > 0 && (
            <span className="text-sm text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-md tabular-nums">
              {lists.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Expand/Collapse all */}
          {lists.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-sm gap-1.5 h-11 px-5"
              onClick={() =>
                allExpanded ? dispatch(collapseAll()) : dispatch(expandAll())
              }
            >
              <ChevronsUpDown className="h-4 w-4" />
              {allExpanded ? __("Collapse all", 'wedevs-project-manager') : __("Expand all", 'wedevs-project-manager')}
            </Button>
          )}

          {/* Filter */}
          {lists.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-sm gap-1.5 h-11 px-5"
              onClick={() => setFilterOpen((v) => !v)}
            >
              <Filter className="h-4 w-4" />
              {__("Filter", 'wedevs-project-manager')}
              {filterCount > 0 && (
                <Badge variant="secondary" className="h-4 px-1 text-[14px] rounded-md ml-0.5">
                  {filterCount}
                </Badge>
              )}
            </Button>
          )}

          {/* With the bar closed the Clear sits next to the trigger; with it
              open the bar's own Clear is the nearer one, so only one shows. */}
          {filterCount > 0 && !filterOpen && (
            <Button
              variant="outline"
              size="sm"
              className="text-sm gap-1 h-11 px-5"
              onClick={() => clearFilterRef.current?.()}
            >
              <X className="h-3.5 w-3.5" />
              {__("Clear", 'wedevs-project-manager')}
            </Button>
          )}

          {/* Pro slot: archive button, etc. */}
          <Slot name="tasklist.header.actions" projectId={projectId} />

          {/* New list button */}
          {canCreateList && (
            <Button
              size="sm"
              className="text-sm gap-1.5 h-11 px-5"
              onClick={() => setShowNewList((v) => !v)}
            >
              <Plus className="h-4 w-4" />
              {__("New List", 'wedevs-project-manager')}
            </Button>
          )}
        </div>
      </div>

      {/* New list form */}
      {showNewList && canCreateList && (
        <form
          onSubmit={handleCreateList}
          className="rounded-lg border bg-card p-4 space-y-3"
        >
          <Input
            autoFocus
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder={__("Task list name", 'wedevs-project-manager')}
            className="h-11 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowNewList(false);
                setNewListTitle("");
                setNewListDesc("");
                setNewListPrivate(false);
              }
            }}
          />
          <RichTextEditor
            content={newListDesc}
            onChange={setNewListDesc}
            placeholder={__("Task list details", 'wedevs-project-manager')}
            minHeight="80px"
          />
          {userCan('view_private_list') && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="new-list-private"
                checked={newListPrivate}
                onCheckedChange={(v) => setNewListPrivate(!!v)}
                disabled={!isPro}
              />
              <label
                htmlFor="new-list-private"
                className={cn("text-sm cursor-pointer", isPro ? 'text-pm-text-primary' : 'text-pm-text-muted')}
              >
                {__("Private", 'wedevs-project-manager')}
              </label>
              {!isPro && <ProBadge />}
            </div>
          )}
          <div className="flex items-center gap-2 pt-1">
            <Button className="h-11 px-5"
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowNewList(false);
                setNewListTitle("");
                setNewListDesc("");
                setNewListPrivate(false);
              }}
            >
              {__("Cancel", 'wedevs-project-manager')}
            </Button>
            <Button className="h-11 px-5"
              type="submit"
              size="sm"
              disabled={!newListTitle.trim() || creatingList}
            >
              {creatingList ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{__("Creating...", 'wedevs-project-manager')}</> : __("Add List", 'wedevs-project-manager')}
            </Button>
          </div>
        </form>
      )}

      {/* Filter bar */}
      {!loading && lists.length > 0 && (
        <TaskFilterBar
          projectId={projectId}
          lists={lists}
          open={filterOpen}
          onOpenChange={setFilterOpen}
          onActiveCountChange={setFilterCount}
          onRegisterClear={(fn) => { clearFilterRef.current = fn }}
          onFilterResults={(tasks) => setFilteredTasks(tasks)}
          onClear={() => setFilteredTasks(null)}
        />
      )}

      {/* Content */}
      {loading ? (
        renderSkeleton()
      ) : lists.length === 0 ? (
        renderEmpty()
      ) : filteredTasks ? (
        /* Filtered results — flat task list */
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="px-4 py-2.5 bg-muted/30 border-b">
            <span className="text-sm font-medium text-pm-text-muted">
              {filteredTasks.length} {filteredTasks.length === 1 ? __("result", 'wedevs-project-manager') : __("results", 'wedevs-project-manager')}
            </span>
          </div>
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center">
              <Filter className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-pm-text-muted">{__("No tasks match your filters.", 'wedevs-project-manager')}</p>
            </div>
          ) : (
            <div>
              {filteredTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    projectId={projectId}
                    listId={task.task_list_id ?? task.board_id ?? 0}
                    showLabels={showLabels}
                  />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map((list, idx) => (
            <div
              key={list.id}
              draggable
              onDragStart={() => handleListDragStart(idx)}
              onDragOver={(e) => handleListDragOver(e, idx)}
              onDrop={(e) => handleListDrop(e, idx)}
              onDragEnd={handleListDragEnd}
              className={dragOverIdx === idx ? "ring-2 ring-pm-accent/40 rounded-lg transition-shadow" : ""}
            >
              <TaskListSection list={list} projectId={projectId} showLabels={showLabels} isInbox={inboxListId && parseInt(list.id, 10) === inboxListId} />
            </div>
          ))}
        </div>
      )}

      {/* Task list pagination */}
      {!loading && (
        <PaginationNav
          page={listsMeta.current_page}
          totalPages={listsMeta.total_pages}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}

      {/* Task detail sheet */}
      <TaskDetailSheet />
    </div>
  );
}
