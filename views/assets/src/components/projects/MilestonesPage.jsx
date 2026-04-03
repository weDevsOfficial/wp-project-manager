import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  fetchMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  toggleMilestonePrivacy,
  openForm,
  closeForm,
  setFilter as setStoreFilter,
  setSort as setStoreSort,
} from "@store/milestonesSlice";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { usePermissions } from "@hooks/usePermissions";
import { cn } from "@lib/utils";
import { formatPmDateTime, extractDateStr } from "@lib/pm-utils";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { Card, CardContent } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { ScrollArea } from "@components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { Skeleton } from "@components/ui/skeleton";
import { Progress } from "@components/ui/progress";
import { Separator } from "@components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@components/ui/dropdown-menu";
import RichTextEditor from "@components/common/RichTextEditor";
import ProBadge from "@components/common/ProBadge";
import {
  ArrowLeft,
  Plus,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  Milestone as MilestoneIcon,
  Lock,
  Unlock,
  Pencil,
  LayoutList,
  MessageSquare,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Import,
  Minus,
} from "lucide-react";

// ── Health Badge ──────────────────────────────────────

const healthConfig = {
  "on-track":  { label: "On Track",  icon: CheckCircle,   className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "at-risk":   { label: "At Risk",   icon: AlertTriangle, className: "bg-amber-50 text-amber-700 border-amber-200" },
  overdue:     { label: "Overdue",   icon: AlertCircle,   className: "bg-red-50 text-red-700 border-red-200" },
  completed:   { label: "Completed", icon: CheckCircle,   className: "bg-blue-50 text-blue-700 border-blue-200" },
  "no-date":   { label: "No Date",   icon: Clock,         className: "bg-gray-50 text-gray-500 border-gray-200" },
};

function MilestoneHealthBadge({ health }) {
  const { __ } = useI18n();
  const cfg = healthConfig[health] || healthConfig["no-date"];
  const Icon = cfg.icon;

  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full border", cfg.className)}>
      <Icon className="h-3 w-3" />
      {__(cfg.label)}
    </span>
  );
}

// ── Progress Display ──────────────────────────────────

function MilestoneProgress({ progress, taskCount }) {
  const { __ } = useI18n();
  const total = taskCount?.total ?? 0;
  const completed = taskCount?.completed ?? 0;

  if (total === 0) {
    return (
      <span className="text-sm text-pm-text-muted italic">
        {__("No tasks linked")}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      <Progress value={progress} className="h-1.5 flex-1 max-w-[120px]" />
      <span className="text-sm text-pm-text-muted tabular-nums whitespace-nowrap">
        {progress}% ({completed}/{total})
      </span>
    </div>
  );
}

// ── Filter Bar ────────────────────────────────────────

const filterTabs = [
  { key: "all",       label: "All",       color: "#6b7280" },
  { key: "upcoming",  label: "Upcoming",  color: "#3b82f6" },
  { key: "at-risk",   label: "At Risk",   color: "#f59e0b" },
  { key: "overdue",   label: "Overdue",   color: "#ef4444" },
  { key: "completed", label: "Completed", color: "#10b981" },
];

const sortOptions = [
  { value: "date",     label: "Target Date" },
  { value: "progress", label: "Progress" },
  { value: "title",    label: "Title" },
];

function MilestoneFilterBar({ filter, sort, counts, onFilterChange, onSortChange }) {
  const { __ } = useI18n();

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="inline-flex items-center rounded-lg bg-muted/60 p-1 gap-0.5">
        {filterTabs.map((tab) => {
          const count = counts[tab.key] ?? 0;
          const isActive = filter === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-background text-pm-text-primary shadow-sm"
                  : "text-pm-text-muted hover:text-pm-text-primary",
              )}
            >
              {__(tab.label)}
              <span
                className="inline-flex items-center justify-center rounded-full px-1.5 min-w-[18px] h-[18px] text-[14px] font-semibold tabular-nums transition-colors"
                style={isActive ? { backgroundColor: tab.color + '15', color: tab.color } : { color: 'var(--pm-text-muted)' }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm">
            <ArrowUpDown className="h-3.5 w-3.5" />
            {__(sortOptions.find((s) => s.value === sort)?.label ?? "Sort")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={cn(sort === opt.value && "font-medium text-primary")}
            >
              {__(opt.label)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ── Milestone Form (Dialog content) ───────────────────

function MilestoneForm({ milestone, onSubmit, onCancel }) {
  const { __ } = useI18n();
  const [title, setTitle] = useState(milestone?.title || "");
  const [description, setDescription] = useState(
    milestone?.description?.content || milestone?.description || "",
  );
  const [achieveDate, setAchieveDate] = useState(
    extractDateStr(milestone?.achieve_date) || "",
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      achieve_date: achieveDate || undefined,
      status: milestone?.status ?? "incomplete",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>{__("Title")}</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={__("Milestone title")}
          autoFocus
        />
      </div>
      <div className="space-y-1.5">
        <Label>{__("Description")}</Label>
        <RichTextEditor
          content={description}
          onChange={setDescription}
          placeholder={__("Description...")}
          minHeight="80px"
        />
      </div>
      <div className="space-y-1.5">
        <Label>{__("Target Date")}</Label>
        <Input
          type="date"
          value={achieveDate}
          onChange={(e) => setAchieveDate(e.target.value)}
          className="w-full sm:w-[200px]"
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {__("Cancel")}
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {milestone ? __("Update") : __("Create Milestone")}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ── Import Task Lists Dialog ──────────────────────────

function ImportTaskListsDialog({ open, onOpenChange, milestone, projectId, onDone }) {
  const { __ } = useI18n();
  const api = useApi();
  const toast = useToast();

  const [taskLists, setTaskLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [importing, setImporting] = useState(false);

  // Already linked list IDs
  const linkedIds = useMemo(
    () => (milestone?.task_lists?.data ?? []).map((l) => l.id),
    [milestone],
  );

  // Fetch all task lists for this project
  useEffect(() => {
    if (!open || !projectId) return;
    setLoading(true);
    setSelected([]);
    api.get(`projects/${projectId}/task-lists`, { per_page: -1 })
      .then((res) => {
        const items = res?.data ?? [];
        setTaskLists(Array.isArray(items) ? items : []);
      })
      .catch(() => setTaskLists([]))
      .finally(() => setLoading(false));
  }, [open, projectId, api]);

  // Filter out already linked lists
  const available = useMemo(
    () => taskLists.filter((l) => !linkedIds.includes(l.id)),
    [taskLists, linkedIds],
  );

  const toggleList = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selected.length === available.length) {
      setSelected([]);
    } else {
      setSelected(available.map((l) => l.id));
    }
  };

  const handleImport = async () => {
    if (selected.length === 0 || importing) return;
    setImporting(true);
    try {
      // Link each selected task list to this milestone via task-list update
      await Promise.all(
        selected.map((listId) => {
          const list = taskLists.find((l) => l.id === listId);
          return api.post(`projects/${projectId}/task-lists/${listId}/update`, {
            id: listId,
            title: list?.title || "Untitled",
            milestone: milestone.id,
          });
        }),
      );
      toast.success(
        `${selected.length} ${selected.length === 1 ? __("list linked") : __("lists linked")}`,
      );
      onOpenChange(false);
      onDone();
    } catch {
      toast.error(__("Failed to link task lists"));
    }
    setImporting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-pm-dialog>
        <DialogHeader>
          <DialogTitle>{__("Link Task Lists")}</DialogTitle>
          <DialogDescription className="sr-only">
            {__("Link task lists to this milestone")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-pm-text-muted">
            {__("Select task lists to link to")} <strong>{milestone?.title}</strong>
          </p>

          {loading ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 rounded" />
              ))}
            </div>
          ) : available.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-pm-text-muted">
                {taskLists.length === 0
                  ? __("No task lists found in this project")
                  : __("All task lists are already linked to a milestone")}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b pb-2">
                <Checkbox
                  id="select-all-lists"
                  checked={available.length > 0 && selected.length === available.length}
                  onCheckedChange={selectAll}
                />
                <label htmlFor="select-all-lists" className="text-sm font-medium cursor-pointer">
                  {__("Select All")}
                </label>
                {selected.length > 0 && (
                  <Badge variant="secondary" className="text-[11px] ml-auto">
                    {selected.length} {__("selected")}
                  </Badge>
                )}
              </div>
              <ScrollArea className="h-52 border rounded-md">
                <div className="p-2 space-y-0.5">
                  {available.map((list) => {
                    const total =
                      (list.meta?.total_incomplete_tasks ?? 0) +
                      (list.meta?.total_complete_tasks ?? 0);
                    const complete = list.meta?.total_complete_tasks ?? 0;
                    return (
                      <div
                        key={list.id}
                        className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/30"
                      >
                        <Checkbox
                          id={`list-${list.id}`}
                          checked={selected.includes(list.id)}
                          onCheckedChange={() => toggleList(list.id)}
                        />
                        <label
                          htmlFor={`list-${list.id}`}
                          className="text-sm cursor-pointer flex-1 truncate"
                        >
                          {list.title}
                        </label>
                        <span className="text-[11px] text-pm-text-muted tabular-nums shrink-0">
                          {complete}/{total} {__("tasks")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {__("Cancel")}
          </Button>
          <Button onClick={handleImport} disabled={selected.length === 0 || importing}>
            <Import className="h-4 w-4 mr-1" />
            {__("Link")} {selected.length > 0 && `(${selected.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Unlink confirmation helper ────────────────────────

function useUnlinkList(projectId, api, toast, __, dispatch) {
  return useCallback(
    async (list) => {
      if (!confirm(__("Remove this task list from the milestone?"))) return;
      try {
        await api.post(`projects/${projectId}/task-lists/${list.id}/update`, {
          id: list.id,
          title: list.title,
          milestone: 0,
        });
        toast.success(__("Task list unlinked"));
        dispatch(fetchMilestones({ projectId }));
      } catch {
        toast.error(__("Failed to unlink"));
      }
    },
    [projectId, api, toast, __, dispatch],
  );
}

// ── Milestone Card ────────────────────────────────────

function MilestoneCard({ milestone, projectId, onEdit, onImport }) {
  const { __ } = useI18n();
  const api = useApi();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isPro } = usePermissions();

  const isComplete =
    milestone.status === "complete" || milestone.status === 1 || milestone.status === "1";
  const taskLists = milestone.task_lists?.data ?? [];
  const discussions = milestone.discussion_boards?.data ?? [];
  const hasDetails = taskLists.length > 0 || discussions.length > 0;

  const handleUnlink = useUnlinkList(projectId, api, toast, __, dispatch);

  const handleDelete = useCallback(async () => {
    if (!confirm(__("Are you sure?"))) return;
    try {
      await dispatch(
        deleteMilestone({ projectId, milestoneId: milestone.id }),
      ).unwrap();
      toast.success(__("Milestone deleted"));
    } catch {
      toast.error(__("Failed to delete"));
    }
  }, [dispatch, projectId, milestone.id, toast, __]);

  const handleToggleStatus = useCallback(async () => {
    const newStatus = isComplete ? "incomplete" : "complete";
    try {
      await dispatch(
        updateMilestone({
          projectId,
          milestoneId: milestone.id,
          data: { title: milestone.title, status: newStatus },
        }),
      ).unwrap();
      dispatch(fetchMilestones({ projectId }));
      toast.success(
        newStatus === "complete"
          ? __("Milestone marked as complete")
          : __("Milestone marked as incomplete"),
      );
    } catch {
      toast.error(__("Failed to update status"));
    }
  }, [dispatch, projectId, milestone, isComplete, toast, __]);

  const handleTogglePrivacy = useCallback(async () => {
    const newPrivacy = milestone.meta?.privacy ? 0 : 1;
    try {
      await dispatch(
        toggleMilestonePrivacy({
          projectId,
          milestoneId: milestone.id,
          isPrivate: newPrivacy,
        }),
      ).unwrap();
    } catch {
      toast.error(__("Failed to update"));
    }
  }, [dispatch, projectId, milestone, toast, __]);

  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Status toggle */}
          <button
            type="button"
            onClick={handleToggleStatus}
            className="shrink-0 mt-0.5"
            title={isComplete ? __("Mark Incomplete") : __("Mark Complete")}
          >
            <CheckCircle
              className={cn(
                "h-5 w-5 transition-colors",
                isComplete
                  ? "text-emerald-500"
                  : "text-pm-text-muted/30 hover:text-emerald-400",
              )}
            />
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={cn(
                  "text-sm font-semibold",
                  isComplete
                    ? "text-pm-text-muted line-through"
                    : "text-pm-text-primary",
                )}
              >
                {milestone.title}
              </h4>
              <MilestoneHealthBadge
                health={
                  milestone.health ?? (isComplete ? "completed" : "no-date")
                }
              />
              {milestone.meta?.privacy ? (
                <Lock className="h-3.5 w-3.5 text-pm-text-muted" />
              ) : null}
            </div>

            {milestone.description?.content && (
              <p className="text-sm text-pm-text-muted mt-1 line-clamp-2">
                {milestone.description.content}
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-4 mt-2.5 flex-wrap">
              <MilestoneProgress
                progress={milestone.progress ?? 0}
                taskCount={milestone.task_count}
              />
              {milestone.achieve_date && (
                <span className="text-sm text-pm-text-muted flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatPmDateTime(milestone.achieve_date)}
                </span>
              )}
              {taskLists.length > 0 && (
                <span className="text-sm text-pm-text-muted flex items-center gap-1">
                  <LayoutList className="h-3.5 w-3.5" />
                  {taskLists.length} {__("lists")}
                </span>
              )}
              {discussions.length > 0 && (
                <span className="text-sm text-pm-text-muted flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {discussions.length} {__("discussions")}
                </span>
              )}
            </div>
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(milestone)}>
                <Pencil className="h-4 w-4 mr-2" />
                {__("Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onImport(milestone)}>
                <Import className="h-4 w-4 mr-2" />
                {__("Link Task Lists")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleStatus}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {isComplete ? __("Mark Incomplete") : __("Mark Complete")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => isPro && handleTogglePrivacy()}
                disabled={!isPro}
              >
                {milestone.meta?.privacy ? (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    {__("Make Public")}
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    {__("Make Private")}
                  </>
                )}
                {!isPro && <ProBadge className="ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {__("Delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      {/* Linked task lists & discussions */}
      {hasDetails && (
        <>
          <Separator />
          <div className={cn(
            "bg-muted/10 px-4 py-3 grid gap-4",
            taskLists.length > 0 && discussions.length > 0
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1",
          )}>
            {taskLists.length > 0 && (
              <div>
                <h5 className="text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70 mb-2 flex items-center gap-1">
                  <LayoutList className="h-3 w-3" />
                  {__("Task Lists")}
                </h5>
                <ul className="space-y-1">
                  {taskLists.map((list) => {
                    const total =
                      (list.meta?.total_incomplete_tasks ?? 0) +
                      (list.meta?.total_complete_tasks ?? 0);
                    const complete = list.meta?.total_complete_tasks ?? 0;
                    const pct =
                      total > 0 ? Math.round((complete / total) * 100) : 0;
                    return (
                      <li key={list.id} className="group flex items-center gap-2 rounded-md px-2 py-1 -mx-2 hover:bg-muted/30 transition-colors">
                        <button
                          type="button"
                          className="text-[13px] text-pm-accent hover:underline truncate text-left shrink-0 max-w-[40%]"
                          onClick={() =>
                            navigate(`/projects/${projectId}/task-lists`)
                          }
                        >
                          {list.title}
                        </button>
                        <Progress value={pct} className="h-1 flex-1" />
                        <span className="text-[11px] text-pm-text-muted tabular-nums shrink-0">
                          {pct}%
                        </span>
                        <span className="text-[11px] text-pm-text-muted tabular-nums shrink-0">
                          {complete}/{total}
                        </span>
                        <button
                          type="button"
                          className="h-5 w-5 rounded flex items-center justify-center text-pm-text-muted/30 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          onClick={() => handleUnlink(list)}
                          title={__("Unlink from milestone")}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {discussions.length > 0 && (
              <div>
                <h5 className="text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70 mb-2 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {__("Discussions")}
                </h5>
                <ul className="space-y-1.5">
                  {discussions.map((disc) => (
                    <li key={disc.id}>
                      <button
                        type="button"
                        className="text-sm text-pm-accent hover:underline truncate block text-left"
                        onClick={() =>
                          navigate(`/projects/${projectId}/discussions`)
                        }
                      >
                        {disc.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

// ── Group Header ──────────────────────────────────────

const groupConfig = {
  upcoming:  { icon: Clock,         color: "text-blue-500" },
  "at-risk": { icon: AlertTriangle, color: "text-amber-500" },
  overdue:   { icon: AlertCircle,   color: "text-red-500" },
  completed: { icon: CheckCircle,   color: "text-emerald-500" },
};

function GroupHeader({ label, count, groupKey }) {
  const cfg = groupConfig[groupKey] || groupConfig.upcoming;
  const Icon = cfg.icon;

  return (
    <h3
      className={cn(
        "text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5",
        cfg.color,
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      <Badge variant="secondary" className="text-[11px] px-1.5 font-normal">
        {count}
      </Badge>
    </h3>
  );
}

// ── Main Page ─────────────────────────────────────────

export default function MilestonesPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { __ } = useI18n();
  const toast = useToast();

  const { items: milestones, loading, filter, sort, formOpen, editingId } =
    useAppSelector((s) => s.milestones);

  const [saving, setSaving] = useState(false);
  const [importTarget, setImportTarget] = useState(null); // milestone for import dialog

  useEffect(() => {
    dispatch(fetchMilestones({ projectId }));
  }, [dispatch, projectId]);

  // ── Form handlers ──

  const editingMilestone = editingId
    ? milestones.find((m) => m.id === editingId)
    : null;

  const handleEdit = useCallback(
    (m) => dispatch(openForm(m.id)),
    [dispatch],
  );

  const handleFormSubmit = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        if (editingMilestone) {
          await dispatch(
            updateMilestone({
              projectId,
              milestoneId: editingMilestone.id,
              data: payload,
            }),
          ).unwrap();
          toast.success(__("Milestone updated"));
        } else {
          await dispatch(
            createMilestone({ projectId, data: payload }),
          ).unwrap();
          toast.success(__("Milestone created"));
        }
        dispatch(fetchMilestones({ projectId }));
        dispatch(closeForm());
      } catch {
        toast.error(
          editingMilestone
            ? __("Failed to update milestone")
            : __("Failed to create milestone"),
        );
      }
      setSaving(false);
    },
    [dispatch, projectId, editingMilestone, toast, __],
  );

  // ── Filter + Sort + Group ──

  const { upcoming, atRisk, overdue, completed } = useMemo(() => {
    const groups = { upcoming: [], atRisk: [], overdue: [], completed: [] };

    for (const m of milestones) {
      const isComplete =
        m.status === "complete" || m.status === 1 || m.status === "1";
      const health = m.health || "no-date";

      if (isComplete) {
        groups.completed.push(m);
      } else if (health === "overdue") {
        groups.overdue.push(m);
      } else if (health === "at-risk") {
        groups.atRisk.push(m);
      } else {
        groups.upcoming.push(m);
      }
    }

    const sortFn = (a, b) => {
      if (sort === "progress") return (b.progress ?? 0) - (a.progress ?? 0);
      if (sort === "title")
        return (a.title || "").localeCompare(b.title || "");
      const da = extractDateStr(a.achieve_date) || "9999-12-31";
      const db = extractDateStr(b.achieve_date) || "9999-12-31";
      return da.localeCompare(db);
    };

    groups.upcoming.sort(sortFn);
    groups.atRisk.sort(sortFn);
    groups.overdue.sort(sortFn);
    groups.completed.sort(sortFn);

    return groups;
  }, [milestones, sort]);

  const visibleGroups = useMemo(() => {
    const groups = [];
    if (filter === "all" || filter === "upcoming") {
      if (upcoming.length > 0)
        groups.push({ key: "upcoming", label: __("Upcoming"), items: upcoming });
    }
    if (filter === "all" || filter === "at-risk") {
      if (atRisk.length > 0)
        groups.push({ key: "at-risk", label: __("At Risk"), items: atRisk });
    }
    if (filter === "all" || filter === "overdue") {
      if (overdue.length > 0)
        groups.push({ key: "overdue", label: __("Overdue"), items: overdue });
    }
    if (filter === "all" || filter === "completed") {
      if (completed.length > 0)
        groups.push({
          key: "completed",
          label: __("Completed"),
          items: completed,
        });
    }
    return groups;
  }, [filter, upcoming, atRisk, overdue, completed, __]);

  const totalVisible = visibleGroups.reduce(
    (sum, g) => sum + g.items.length,
    0,
  );

  // Counts for filter tabs
  const filterCounts = useMemo(() => ({
    all:       milestones.length,
    upcoming:  upcoming.length,
    "at-risk": atRisk.length,
    overdue:   overdue.length,
    completed: completed.length,
  }), [milestones, upcoming, atRisk, overdue, completed]);

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`/projects/${projectId}/task-lists`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("Milestones")}
          </h1>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => dispatch(openForm())}
        >
          <Plus className="h-4 w-4" />
          {__("New Milestone")}
        </Button>
      </div>

      {/* Filter bar */}
      {!loading && milestones.length > 0 && (
        <MilestoneFilterBar
          filter={filter}
          sort={sort}
          counts={filterCounts}
          onFilterChange={(v) => dispatch(setStoreFilter(v))}
          onSortChange={(v) => dispatch(setStoreSort(v))}
        />
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : milestones.length === 0 ? (
        <div className="text-center py-16">
          <MilestoneIcon className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text-primary mb-1">
            {__("No milestones yet")}
          </h3>
          <p className="text-sm text-pm-text-muted mb-4">
            {__("Track your project progress with milestones.")}
          </p>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => dispatch(openForm())}
          >
            <Plus className="h-4 w-4" />
            {__("Create your first milestone")}
          </Button>
        </div>
      ) : totalVisible === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-pm-text-muted">
            {__("No milestones match the selected filter.")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleGroups.map((group) => (
            <div key={group.key} className="space-y-2">
              <GroupHeader
                label={group.label}
                count={group.items.length}
                groupKey={group.key}
              />
              <div className="space-y-2">
                {group.items.map((m) => (
                  <MilestoneCard
                    key={m.id}
                    milestone={m}
                    projectId={projectId}
                    onEdit={handleEdit}
                    onImport={setImportTarget}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => !open && dispatch(closeForm())}
      >
        <DialogContent className="sm:max-w-[500px]" data-pm-dialog>
          <DialogHeader>
            <DialogTitle>
              {editingMilestone
                ? __("Edit Milestone")
                : __("Create Milestone")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editingMilestone
                ? __("Edit an existing milestone")
                : __("Create a new milestone")}
            </DialogDescription>
          </DialogHeader>
          <MilestoneForm
            milestone={editingMilestone}
            onSubmit={handleFormSubmit}
            onCancel={() => dispatch(closeForm())}
          />
        </DialogContent>
      </Dialog>

      {/* Import Task Lists Dialog */}
      <ImportTaskListsDialog
        open={!!importTarget}
        onOpenChange={(open) => !open && setImportTarget(null)}
        milestone={importTarget}
        projectId={projectId}
        onDone={() => dispatch(fetchMilestones({ projectId }))}
      />
    </div>
  );
}
