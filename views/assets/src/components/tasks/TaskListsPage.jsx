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
} from "@store/taskListsSlice";
import { cn } from "@lib/utils";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { useApi } from "@hooks/useApi";
import { usePermissions } from "@hooks/usePermissions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import RichTextEditor from "@components/common/RichTextEditor";
import { Checkbox } from "@components/ui/checkbox";
import { Skeleton } from "@components/ui/skeleton";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@components/ui/pagination";
import { ArrowLeft, Plus, ChevronsUpDown, ListTodo, Crown } from "lucide-react";
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
  const { __ } = useI18n();
  const toast = useToast();
  const api = useApi();
  const { isPro } = usePermissions();

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
    dispatch(reorderLists({ projectId, orders }));

    dragListIdx.current = null;
    setDragOverIdx(null);
  }, [dispatch, lists, projectId]);

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
        })
        .catch(() => {})
    }
  }, [dispatch, projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateList = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newListTitle.trim() || creatingList) return;
      setCreatingList(true);
      try {
        await dispatch(
          createTaskList({
            projectId,
            title: newListTitle.trim(),
            description: newListDesc.trim() || undefined,
            privacy: newListPrivate ? 1 : 0,
          }),
        ).unwrap();
        setNewListTitle("");
        setNewListDesc("");
        setNewListPrivate(false);
        setShowNewList(false);
        toast.success(__("Task list created"));
      } catch {
        toast.error(__("Failed to create task list"));
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
      toast,
      __,
    ],
  );

  const allExpanded = expandedIds.length === lists.length && lists.length > 0;

  // ── Skeleton ────────────────────────────────

  const renderSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card overflow-hidden">
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
        {__("No task lists yet")}
      </h3>
      <p className="text-sm text-pm-text-muted mb-4">
        {__("Create your first task list to start organizing work.")}
      </p>
      <Button onClick={() => setShowNewList(true)}>
        <Plus className="h-4 w-4 mr-2" />
        {__("New Task List")}
      </Button>
    </div>
  );

  // ── Main render ─────────────────────────────

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("Task Lists")}
          </h1>
          {lists.length > 0 && (
            <span className="text-xs text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-full tabular-nums">
              {lists.length} {lists.length === 1 ? __("list") : __("lists")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Expand/Collapse all */}
          {lists.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() =>
                allExpanded ? dispatch(collapseAll()) : dispatch(expandAll())
              }
            >
              <ChevronsUpDown className="h-3.5 w-3.5" />
              {allExpanded ? __("Collapse all") : __("Expand all")}
            </Button>
          )}

          {/* Pro slot: archive button, etc. */}
          <Slot name="tasklist.header.actions" projectId={projectId} />

          {/* New list button */}
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setShowNewList((v) => !v)}
          >
            <Plus className="h-4 w-4" />
            {__("New List")}
          </Button>
        </div>
      </div>

      {/* New list form */}
      {showNewList && (
        <form
          onSubmit={handleCreateList}
          className="rounded-xl border bg-card p-4 space-y-3"
        >
          <Input
            autoFocus
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder={__("Task list name")}
            className="h-9 text-sm"
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
            placeholder={__("Task list details")}
            minHeight="80px"
          />
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
              {__("Private")}
            </label>
            {!isPro && <Crown className="h-3 w-3 text-pm-accent" />}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button
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
              {__("Cancel")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!newListTitle.trim() || creatingList}
            >
              {creatingList ? __("Creating...") : __("Add List")}
            </Button>
          </div>
        </form>
      )}

      {/* Filter bar */}
      {!loading && lists.length > 0 && (
        <TaskFilterBar
          projectId={projectId}
          lists={lists}
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
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-2.5 bg-muted/30 border-b">
            <span className="text-xs font-medium text-pm-text-muted">
              {filteredTasks.length} {filteredTasks.length === 1 ? __("result") : __("results")}
            </span>
          </div>
          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center text-sm text-pm-text-muted">
              {__("No tasks match your filters.")}
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
              className={dragOverIdx === idx ? "ring-2 ring-pm-accent/40 rounded-xl transition-shadow" : ""}
            >
              <TaskListSection list={list} projectId={projectId} showLabels={showLabels} />
            </div>
          ))}
        </div>
      )}

      {/* Task list pagination */}
      {!loading && listsMeta.total_pages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(listsMeta.current_page - 1)}
                className={listsMeta.current_page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: listsMeta.total_pages }, (_, i) => i + 1).map((page) => {
              const current = listsMeta.current_page
              const total = listsMeta.total_pages
              // Show first, last, current, and neighbors; ellipsis for gaps
              if (page === 1 || page === total || (page >= current - 1 && page <= current + 1)) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === current}
                      onClick={() => handlePageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
              if (page === 2 && current > 3) {
                return <PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>
              }
              if (page === total - 1 && current < total - 2) {
                return <PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>
              }
              return null
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(listsMeta.current_page + 1)}
                className={listsMeta.current_page >= listsMeta.total_pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Task detail sheet */}
      <TaskDetailSheet />
    </div>
  );
}
