import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  fetchTaskLists,
  createTaskList,
  expandAll,
  collapseAll,
} from "@store/taskListsSlice";
import { cn } from "@lib/utils";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Checkbox } from "@components/ui/checkbox";
import { Skeleton } from "@components/ui/skeleton";
import { ArrowLeft, Plus, ChevronsUpDown, ListTodo } from "lucide-react";
import TaskListSection from "./TaskListSection";
import TaskDetailSheet from "./TaskDetailSheet";

export default function TaskListsPage() {
  const { projectId: pidParam } = useParams();
  const projectId = parseInt(pidParam ?? "0", 10);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { __ } = useI18n();
  const toast = useToast();

  const { lists, loading, expandedIds } = useAppSelector((s) => s.taskLists);

  const [showNewList, setShowNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [newListPrivate, setNewListPrivate] = useState(false);
  const [creatingList, setCreatingList] = useState(false);

  // Fetch task lists on mount
  useEffect(() => {
    if (projectId) {
      dispatch(fetchTaskLists(projectId));
    }
  }, [dispatch, projectId]);

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
    <div className="max-w-[1400px] mx-auto p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
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
          <Textarea
            value={newListDesc}
            onChange={(e) => setNewListDesc(e.target.value)}
            placeholder={__("Task list details")}
            className="text-sm min-h-[80px] resize-y"
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="new-list-private"
              checked={newListPrivate}
              onCheckedChange={(v) => setNewListPrivate(!!v)}
            />
            <label
              htmlFor="new-list-private"
              className="text-sm text-pm-text-primary cursor-pointer"
            >
              {__("Private")}
            </label>
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

      {/* Content */}
      {loading ? (
        renderSkeleton()
      ) : lists.length === 0 ? (
        renderEmpty()
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <TaskListSection key={list.id} list={list} projectId={projectId} />
          ))}
        </div>
      )}

      {/* Task detail sheet */}
      <TaskDetailSheet />
    </div>
  );
}
