import { Loader2 } from 'lucide-react'
import { __ } from '@wordpress/i18n';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "@store/index";
import { loadMoreBoardTasks } from "@store/kanbanSlice";
import { openTaskSheet } from "@store/tasksSlice";
import { useApi } from "@hooks/useApi";
import { usePermissions } from "@hooks/usePermissions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { UserAvatar } from '@components/common/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  Plus,
  MoreVertical,
  Trash2,
  Palette,
  Settings,
  Import,
  Calendar,
  Flag,
  User as UserIcon,
  List as ListIcon,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  KanbanBoard as KanbanBoardDnd,
  KanbanCard as KanbanCardDnd,
  KanbanCards,
  KanbanHeader as KanbanHeaderDnd,
} from "../../kanban/index";
import KanbanCard from "./KanbanCard";

// Same three colours the cards use, so the composer previews what it will make.
const PRIORITY_ICON_CLASS = {
  low: "text-emerald-500",
  medium: "text-amber-500",
  high: "text-red-500",
};

const PRIORITY_LABELS = () => ({
  low: __("Low", 'wedevs-project-manager'),
  medium: __("Medium", 'wedevs-project-manager'),
  high: __("High", 'wedevs-project-manager'),
});
import ImportTaskModal from "./ImportTaskModal";
import AutomationModal from "./AutomationModal";
import ColorPickerDialog from "./ColorPickerDialog";
import SearchAddTask from "./SearchAddTask";

const api = useApi();

export default function KanbanBoardColumn({
  column,
  projectId,
  users,
  defaultListId,
  onUpdate,
  onDelete,
  onColorChange,
  onRefresh,
  onMoveTask,
  onImportTasks,
  onSaveAutomation,
  onTaskCreated,
  onAddExistingTask,
  boardBg = false,
}) {
  const dispatch = useAppDispatch();
  const { canManage, canCreate } = usePermissions();
  const board = column.rawBoard;

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title || "");
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignees, setNewTaskAssignees] = useState([]);
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskListId, setNewTaskListId] = useState(defaultListId || "");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [creating, setCreating] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [automationOpen, setAutomationOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [taskLists, setTaskLists] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const dueDateInputRef = useRef(null);

  useEffect(() => {
    setTitle(board.title || "");
  }, [board.title]);

  useEffect(() => {
    setNewTaskListId(defaultListId || "");
  }, [defaultListId]);

  useEffect(() => {
    if (!addingTask || !projectId || taskLists.length > 0) return;
    api
      .get(`projects/${projectId}/task-lists`, { per_page: -1 })
      .then((res) => {
        const d = res?.data ?? res;
        setTaskLists(Array.isArray(d) ? d : Object.values(d || {}));
      })
      .catch(() => setTaskLists([]));
  }, [addingTask, projectId, taskLists.length]);

  const pagination = board.tasksMeta?.pagination;
  const hasMore = useMemo(() => {
    if (!pagination) return false;
    const cur = parseInt(pagination.current_page || 1, 10);
    const total = parseInt(pagination.total_pages || 1, 10);
    return cur < total;
  }, [pagination]);

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || loadingMore) return;
        setLoadingMore(true);
        try {
          const nextPage =
            parseInt(pagination?.current_page || 1, 10) + 1;
          await dispatch(
            loadMoreBoardTasks({
              projectId,
              boardId: board.id,
              page: nextPage,
            }),
          ).unwrap();
        } catch {
          /* noop */
        } finally {
          setLoadingMore(false);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, pagination, dispatch, projectId, board.id]);

  const handleTitleSave = () => {
    if (title.trim() && title !== board.title)
      onUpdate(board.id, { title: title.trim() });
    setEditing(false);
  };

  const toggleAssignee = (userId) => {
    setNewTaskAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((x) => x !== userId)
        : [...prev, userId],
    );
  };

  const resetCreateForm = () => {
    setNewTaskTitle("");
    setNewTaskAssignees([]);
    setNewTaskDueDate("");
    setNewTaskPriority("medium");
    setNewTaskListId(defaultListId || "");
    setAddingTask(false);
  };

  const handleCreateTask = async () => {
    const taskTitle = newTaskTitle.trim();
    if (!taskTitle || creating) return;
    setCreating(true);
    try {
      const payload = {
        title: taskTitle,
        project_id: projectId,
        board_id: newTaskListId || defaultListId || "",
        kan_board_id: board.id,
      };
      if (newTaskAssignees.length)
        payload.assignees = newTaskAssignees.map((id) => parseInt(id, 10));
      if (newTaskDueDate) payload.due_date = newTaskDueDate;
      if (newTaskPriority) payload.priority = newTaskPriority;

      const res = await api.post(`projects/${projectId}/tasks`, payload);
      toast.success(__("Task created", 'wedevs-project-manager'));
      const newTask = res?.data ?? res;
      if (newTask?.id) {
        onTaskCreated?.(String(board.id), newTask);
      }
      resetCreateForm();
    } catch (e) {
      toast.error(e?.message || __("Failed", 'wedevs-project-manager'));
    }
    setCreating(false);
  };

  const headerBg = board.header_background;

  // The action is called "Background Color" and the value is stored as
  // header_background, but it only tinted a 14px ring, so a colour a user
  // picked was almost invisible. Tint the header strip with it as well,
  // lightly enough to keep the title readable in both themes.
  const headerTint = (() => {
    const hex = String(headerBg || '').trim();
    const match = /^#?([0-9a-f]{6})$/i.exec(hex);
    if (!match) return undefined;
    const int = parseInt(match[1], 16);
    return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, 0.16)`;
  })();

  const tasksArr = Array.isArray(board.tasks)
    ? board.tasks
    : board.tasks?.data ?? [];
  const taskCount = pagination?.total ?? tasksArr.length;

  const selectedAssigneeObjs = users.filter((u) =>
    newTaskAssignees.includes(String(u.id || u.user_id)),
  );
  const selectedList = taskLists.find(
    (l) => String(l.id) === String(newTaskListId),
  );

  return (
    <>
      <KanbanBoardDnd id={column.id} className={boardBg ? "bg-pm-surface border-pm-border shadow-sm" : undefined}>
        <KanbanHeaderDnd className="!p-0">
          <div
            className="flex items-center justify-between w-full px-3 py-2.5"
            style={headerTint ? { backgroundColor: headerTint } : undefined}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span
                className="h-3.5 w-3.5 rounded-full border-2 shrink-0"
                style={{ borderColor: headerBg || 'var(--pm-accent)', backgroundColor: headerBg || 'transparent' }}
              />
              {editing && canManage ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleSave();
                  }}
                  autoFocus
                  className="h-6 text-sm"
                />
              ) : (
                <span
                  className="font-semibold text-sm truncate cursor-pointer select-none text-pm-text-primary"
                  onDoubleClick={() => canManage && setEditing(true)}
                  title={canManage ? __("Double-click to rename", 'wedevs-project-manager') : ""}
                >
                  {board.title}
                </span>
              )}
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-muted text-pm-text-muted shrink-0">
                {taskCount}
              </span>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <SearchAddTask
                projectId={projectId}
                boardId={board.id}
                onAdd={onAddExistingTask}
                iconStyle={{ color: "var(--pm-text-muted)" }}
              />
              {(canManage || canCreate) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button aria-label={__('Column actions', 'wedevs-project-manager')}
                      className="p-1 rounded-lg hover:bg-muted border-none outline-none shadow-none bg-transparent transition-colors"
                      style={{ color: "var(--pm-text-muted)" }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {canManage && (
                      <DropdownMenuItem onClick={() => setAutomationOpen(true)}>
                        <Settings className="h-4 w-4 mr-2" />
                        {__("Manage Automation", 'wedevs-project-manager')}
                      </DropdownMenuItem>
                    )}
                    {canCreate && (
                      <DropdownMenuItem onClick={() => setImportOpen(true)}>
                        <Import className="h-4 w-4 mr-2" />
                        {__("Import Task", 'wedevs-project-manager')}
                      </DropdownMenuItem>
                    )}
                    {canManage && (
                      <DropdownMenuItem onClick={() => setColorOpen(true)}>
                        <Palette className="h-4 w-4 mr-2" />
                        {__("Background Color", 'wedevs-project-manager')}
                      </DropdownMenuItem>
                    )}
                    {canManage && <DropdownMenuSeparator />}
                    {canManage && (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(board.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {__("Delete", 'wedevs-project-manager')}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </KanbanHeaderDnd>

        <KanbanCards id={column.id}>
          {(item) => (
            <KanbanCardDnd
              id={item.id}
              name={item.name}
              column={item.column}
              key={item.id}
              onCardClick={() => {
                const pid =
                  item.task?.project_id ||
                  item.task?.project?.data?.id ||
                  item.task?.project?.id ||
                  projectId;
                if (!pid) return;
                dispatch(openTaskSheet({ ...item.task, project_id: pid }));
              }}
            >
              <KanbanCard
                task={item.task}
                boardId={board.id}
                onRemove={(taskId) => onMoveTask(taskId, board.id, null)}
              />
            </KanbanCardDnd>
          )}
        </KanbanCards>

        {hasMore && (
          <div
            ref={sentinelRef}
            className="px-2 py-1 text-center text-[11px] text-pm-text-muted"
          >
            {loadingMore ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{__("Loading...", 'wedevs-project-manager')}</> : __("Scroll for more", 'wedevs-project-manager')}
          </div>
        )}

        {canCreate && (
          <div className="mt-2 px-2 pb-2.5 pt-2.5 border-t border-pm-border/60">
            {addingTask ? (
              <div className="rounded-lg bg-pm-surface border border-pm-border shadow-sm p-3 space-y-2.5 transition-colors focus-within:border-pm-accent/50">
                <textarea
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder={__("What needs to be done?", 'wedevs-project-manager')}
                  autoFocus
                  rows={3}
                  className="w-full min-h-[88px] text-[13px] font-medium text-pm-text-primary placeholder:text-pm-text-muted bg-transparent outline-none border-none resize-none p-0 leading-snug"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCreateTask();
                    }
                    if (e.key === "Escape") resetCreateForm();
                  }}
                />

                <div className="flex flex-wrap items-center gap-1.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={`inline-flex items-center gap-1.5 h-8 text-xs font-medium px-3 rounded-md border transition-colors ${
                          selectedList
                            ? "border-pm-accent/20 bg-pm-accent/5 text-pm-accent hover:bg-pm-accent/10"
                            : "border-pm-border bg-pm-surface-muted text-pm-text hover:bg-pm-hover"
                        }`}
                        title={__("Choose list", 'wedevs-project-manager')}
                      >
                        <ListIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate max-w-[100px]">
                          {selectedList ? selectedList.title : __("List", 'wedevs-project-manager')}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-56 p-1"
                      align="start"
                      side="bottom"
                    >
                      <div className="max-h-52 overflow-y-auto">
                        {taskLists.length === 0 ? (
                          <div className="p-2 text-xs text-pm-text-muted">
                            {__("No lists", 'wedevs-project-manager')}
                          </div>
                        ) : (
                          taskLists.map((l) => (
                            <button
                              key={l.id}
                              className="w-full flex items-center justify-between text-left px-2 py-1.5 text-xs hover:bg-pm-surface-muted rounded-md"
                              onClick={() => setNewTaskListId(String(l.id))}
                            >
                              <span className="truncate">{l.title}</span>
                              {String(l.id) === String(newTaskListId) && (
                                <Check className="h-3 w-3 text-emerald-600 shrink-0 ml-2" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={`inline-flex items-center gap-1.5 h-8 text-xs font-medium px-3 rounded-md border transition-colors ${
                          selectedAssigneeObjs.length > 0
                            ? "border-pm-accent/20 bg-pm-accent/5 text-pm-accent hover:bg-pm-accent/10"
                            : "border-pm-border bg-pm-surface-muted text-pm-text hover:bg-pm-hover"
                        }`}
                        title={__("Assign users", 'wedevs-project-manager')}
                      >
                        {selectedAssigneeObjs.length > 0 ? (
                          <>
                            <div className="flex -space-x-1">
                              {selectedAssigneeObjs.slice(0, 3).map((u) => (
                                <UserAvatar key={u.id} user={u} size="sm" className="ring-1 ring-white" />
                              ))}
                            </div>
                            <span>
                              {selectedAssigneeObjs.length}{" "}
                              {__("assigned", 'wedevs-project-manager')}
                            </span>
                          </>
                        ) : (
                          <>
                            <UserIcon className="h-3.5 w-3.5 shrink-0" />
                            <span>{__("Assign", 'wedevs-project-manager')}</span>
                          </>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-60 p-1"
                      align="start"
                      side="bottom"
                    >
                      <div className="max-h-52 overflow-y-auto">
                        {users.length === 0 ? (
                          <div className="p-2 text-xs text-pm-text-muted">
                            {__("No users", 'wedevs-project-manager')}
                          </div>
                        ) : (
                          users.map((u) => {
                            const uid = String(u.id || u.user_id);
                            const checked = newTaskAssignees.includes(uid);
                            return (
                              <button
                                key={uid}
                                className={`w-full flex items-center gap-2 text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
                                  checked ? "bg-pm-accent/5" : "hover:bg-pm-surface-muted"
                                }`}
                                onClick={() => toggleAssignee(uid)}
                              >
                                <UserAvatar user={u} size="sm" />
                                <span className="flex-1 truncate">
                                  {u.display_name}
                                </span>
                                {checked && (
                                  <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div
                    className={`inline-flex items-center gap-1 h-8 text-xs font-medium rounded-md border transition-colors ${
                      newTaskDueDate
                        ? "border-pm-accent/20 bg-pm-accent/5 text-pm-accent"
                        : "border-pm-border bg-pm-surface-muted text-pm-text hover:bg-pm-hover"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const el = dueDateInputRef.current;
                        if (!el) return;
                        if (typeof el.showPicker === "function") {
                          try {
                            el.showPicker();
                            return;
                          } catch (_) {
                            /* fall through */
                          }
                        }
                        el.focus();
                        el.click();
                      }}
                      className="inline-flex items-center gap-1.5 h-full px-3 rounded-md border-none outline-none shadow-none bg-transparent cursor-pointer"
                      title={__("Pick due date", 'wedevs-project-manager')}
                    >
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {newTaskDueDate
                          ? new Date(newTaskDueDate).toLocaleDateString(
                              undefined,
                              { month: "short", day: "numeric", year: "numeric" },
                            )
                          : __("Due date", 'wedevs-project-manager')}
                      </span>
                    </button>
                    {newTaskDueDate && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setNewTaskDueDate("");
                        }}
                        className="mr-1.5 p-0.5 rounded-full hover:bg-pm-accent/10 border-none outline-none shadow-none bg-transparent cursor-pointer"
                        title={__("Clear", 'wedevs-project-manager')}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                    <input
                      ref={dueDateInputRef}
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="sr-only"
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Nothing in the app could set priority, so every card was
                      stuck on the model default (medium). */}
                  {/* A native select here rendered an OS dropdown next to three
                      Radix ones, and painted its own arrow over the label. */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="inline-flex items-center gap-1.5 h-8 text-xs font-medium px-3 rounded-md border border-pm-border bg-pm-surface-muted text-pm-text hover:bg-pm-hover transition-colors"
                        aria-label={__("Priority", 'wedevs-project-manager')}
                        title={__("Set priority", 'wedevs-project-manager')}
                      >
                        <Flag className={`h-3.5 w-3.5 shrink-0 ${PRIORITY_ICON_CLASS[newTaskPriority] || "text-pm-text-muted"}`} />
                        <span>{PRIORITY_LABELS()[newTaskPriority] ?? PRIORITY_LABELS().medium}</span>
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-pm-text-muted" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-36 p-1" align="start" side="bottom">
                      {Object.entries(PRIORITY_LABELS()).map(([value, label]) => (
                        <button
                          key={value}
                          className={`w-full flex items-center gap-2 text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
                            value === newTaskPriority ? "bg-pm-accent/5" : "hover:bg-pm-surface-muted"
                          }`}
                          onClick={() => setNewTaskPriority(value)}
                        >
                          <Flag className={`h-3 w-3 shrink-0 ${PRIORITY_ICON_CLASS[value]}`} />
                          <span className="flex-1 truncate">{label}</span>
                          {value === newTaskPriority && (
                            <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center justify-end pt-1 border-t border-pm-border/40">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-11 text-xs px-2 text-pm-text-muted"
                      onClick={resetCreateForm}
                    >
                      {__("Cancel", 'wedevs-project-manager')}
                    </Button>
                    <Button
                      size="sm"
                      className="h-11 text-xs px-3"
                      disabled={creating || !newTaskTitle.trim()}
                      onClick={handleCreateTask}
                    >
                      {creating ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{__("Adding...", 'wedevs-project-manager')}</> : __("Add task", 'wedevs-project-manager')}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-[13px] font-medium text-pm-text-muted hover:text-pm-text hover:bg-pm-surface transition-colors"
                onClick={() => setAddingTask(true)}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current shrink-0">
                  <Plus className="h-3 w-3" />
                </span>
                {__("Add Task", 'wedevs-project-manager')}
              </button>
            )}
          </div>
        )}
      </KanbanBoardDnd>

      <ImportTaskModal
        open={importOpen}
        onOpenChange={setImportOpen}
        projectId={projectId}
        boardId={board.id}
        onImport={onImportTasks}
      />
      <AutomationModal
        open={automationOpen}
        onOpenChange={setAutomationOpen}
        projectId={projectId}
        board={board}
        users={users}
        onSave={onSaveAutomation}
      />
      <ColorPickerDialog
        open={colorOpen}
        onOpenChange={setColorOpen}
        currentColor={board.header_background || ""}
        onSelect={(color) => onColorChange(board.id, color)}
      />
    </>
  );
}
