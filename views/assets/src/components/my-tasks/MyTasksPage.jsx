import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAppDispatch } from "@store/index";
import { openTaskSheet } from "@store/tasksSlice";
import { setProjectId } from "@store/taskListsSlice";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { usePermissions } from "@hooks/usePermissions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import RichTextEditor from "@components/common/RichTextEditor";
import { Skeleton } from "@components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  CheckSquare,
  AlertTriangle,
  CheckCircle,
  Activity,
  Check,
  MessageSquare,
  Lock,
  PieChart as PieChartIcon,
  Plus,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
} from "recharts";
import {
  isTaskComplete,
  formatPmDate,
  formatPmDateTime,
  extractDateStr,
  userInitials,
} from "@lib/pm-utils";
import TaskDetailSheet from "@components/tasks/TaskDetailSheet";

// ── Task Row ─────────────────────────────────────────

function MyTaskRow({ task, projectTitle, onToggle, onOpen }) {
  const { __ } = useI18n();
  const complete = isTaskComplete(task.status);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    await onToggle(task);
    setToggling(false);
  };

  const assignees = Array.isArray(task.assignees)
    ? task.assignees
    : task.assignees?.data ?? [];

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 last:border-b-0 hover:bg-muted/20 transition-colors group">
      {/* Checkbox */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={toggling}
        className="shrink-0"
      >
        {complete ? (
          <span className="flex items-center justify-center h-[18px] w-[18px] rounded-full bg-emerald-500 text-white">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        ) : (
          <span className="h-[18px] w-[18px] rounded-full border-[1.5px] border-dashed border-pm-text-muted/40 block" />
        )}
      </button>

      {/* Title */}
      <button
        type="button"
        className={`flex-1 text-sm truncate text-left hover:text-pm-accent transition-colors ${
          complete ? "line-through text-pm-text-muted" : "text-pm-text-primary"
        }`}
        onClick={() => onOpen && onOpen(task)}
      >
        {task.title}
      </button>

      {/* Assignees */}
      {assignees.length > 0 && (
        <div className="flex -space-x-1.5 shrink-0">
          {assignees.slice(0, 3).map((u) => (
            <Avatar
              key={u.id || u.ID}
              className="h-5 w-5 border border-background"
            >
              <AvatarImage src={u.avatar_url} />
              <AvatarFallback className="text-[7px]">
                {userInitials(u.display_name || "")}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      )}

      {/* Labels */}
      {task.labels?.data?.length > 0 && (
        <div className="flex gap-1 shrink-0">
          {task.labels.data.slice(0, 2).map((l) => (
            <span
              key={l.id}
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: l.color || "#ccc" }}
              title={l.title}
            />
          ))}
        </div>
      )}

      {/* Project name */}
      {projectTitle && (
        <span className="text-[11px] text-pm-text-muted bg-muted/50 px-2 py-0.5 rounded truncate max-w-[120px] shrink-0">
          {projectTitle}
        </span>
      )}

      {/* Task list */}
      {task.task_list?.data?.title && (
        <span className="text-[11px] text-pm-text-muted truncate max-w-[100px] shrink-0 hidden md:block">
          {task.task_list.data.title}
        </span>
      )}

      {/* Due date */}
      <span
        className={`text-[11px] shrink-0 tabular-nums ${
          !complete &&
          extractDateStr(task.due_date) &&
          new Date(extractDateStr(task.due_date)) < new Date()
            ? "text-red-500"
            : "text-pm-text-muted"
        }`}
      >
        {formatPmDate(task.due_date) || "—"}
      </span>

      {/* Comment count */}
      {(task.meta?.total_comment ?? 0) > 0 && (
        <span className="flex items-center gap-0.5 text-[11px] text-pm-text-muted shrink-0">
          <MessageSquare className="h-3 w-3" />
          {task.meta.total_comment}
        </span>
      )}

      {/* Privacy */}
      {task.meta?.privacy === 1 && (
        <Lock className="h-3 w-3 text-pm-text-muted shrink-0" />
      )}
    </div>
  );
}

// ── New Task Sheet ───────────────────────────────────

function NewTaskSheet({ open, onOpenChange, userId, onCreated }) {
  const api = useApi();
  const { __ } = useI18n();
  const toast = useToast();

  const [projects, setProjects] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);

  // Fetch user's projects when sheet opens
  useEffect(() => {
    if (!open || !userId) return;
    setLoadingProjects(true);
    api
      .get("projects", {
        select: "id, title",
        with: "assignees",
        status: "incomplete",
        per_page: 100,
      })
      .then((res) => {
        const p = res.data ?? [];
        setProjects(p);
        if (p.length > 0) setSelectedProject(String(p[0].id));
      })
      .catch(() => {})
      .finally(() => setLoadingProjects(false));
  }, [open, userId]);

  // Fetch task lists when project changes
  useEffect(() => {
    if (!selectedProject) {
      setLists([]);
      setSelectedList("");
      return;
    }
    setLoadingLists(true);
    api
      .get(`projects/${selectedProject}/task-lists`, {
        select: "id, title",
        per_page: 300,
      })
      .then((res) => {
        const l = res.data ?? [];
        setLists(l);
        if (l.length > 0) setSelectedList(String(l[0].id));
        else setSelectedList("");
      })
      .catch(() => {})
      .finally(() => setLoadingLists(false));
  }, [selectedProject]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setSelectedProject("");
      setSelectedList("");
      setProjects([]);
      setLists([]);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!title.trim() || !selectedProject || !selectedList) return;
    setSaving(true);
    try {
      await api.post(`projects/${selectedProject}/tasks`, {
        title: title.trim(),
        description: description.trim() || undefined,
        board_id: selectedList,
        assignees: [userId],
      });
      toast.success(__("Task created"));
      onOpenChange(false);
      onCreated?.();
    } catch {
      toast.error(__("Failed to create task"));
    }
    setSaving(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[520px] flex flex-col p-0 gap-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>{__("New Task")}</SheetTitle>
        </SheetHeader>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Project selector */}
          <div className="space-y-2">
            <Label>
              {__("Project")} <span className="text-destructive">*</span>
            </Label>
            {loadingProjects ? (
              <Skeleton className="h-10 rounded-md" />
            ) : (
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder={__("Select a project")} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Task list selector */}
          <div className="space-y-2">
            <Label>
              {__("Task List")} <span className="text-destructive">*</span>
            </Label>
            {loadingLists ? (
              <Skeleton className="h-10 rounded-md" />
            ) : (
              <Select
                value={selectedList}
                onValueChange={setSelectedList}
                disabled={!selectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder={__("Select a list")} />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((l) => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {l.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Task title */}
          <div className="space-y-2">
            <Label>
              {__("Task Title")} <span className="text-destructive">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={__("Enter task title")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>{__("Description")}</Label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder={__("Add a description (optional)")}
            />
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {__("Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              saving || !title.trim() || !selectedProject || !selectedList
            }
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {saving ? __("Creating...") : __("Create Task")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ── Main Page ────────────────────────────────────────

const TABS = [
  {
    key: "current",
    label: "Current Tasks",
    icon: CheckSquare,
    taskType: "current",
  },
  {
    key: "outstanding",
    label: "Outstanding",
    icon: AlertTriangle,
    taskType: "outstanding",
  },
  {
    key: "complete",
    label: "Completed",
    icon: CheckCircle,
    taskType: "complete",
  },
  { key: "overview", label: "Overview", icon: PieChartIcon },
  { key: "activities", label: "Activities", icon: Activity },
];

const PIE_COLORS = ["#61BD4F", "#EB5A46", "#0090D9"]; // green, red, blue — matches Vue 2

export default function MyTasksPage() {
  const dispatch = useAppDispatch();
  const api = useApi();
  const { __ } = useI18n();
  const toast = useToast();
  const { canManage } = usePermissions();

  const [activeTab, setActiveTab] = useState("current");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  // Task data — uses GET /tasks with pagination like Vue 2
  const [tasks, setTasks] = useState([]);
  const [taskPage, setTaskPage] = useState(1);
  const [taskTotalPages, setTaskTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [sortBy, setSortBy] = useState("id:desc");
  const [filterProjectId, setFilterProjectId] = useState("");

  // New task sheet
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  // Projects list for filter dropdown
  const [filterProjects, setFilterProjects] = useState([]);

  // Overview graph
  const [graph, setGraph] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Activities
  const [activities, setActivities] = useState([]);
  const [actPage, setActPage] = useState(1);
  const [actHasMore, setActHasMore] = useState(false);
  const [actLoading, setActLoading] = useState(false);

  // Users for selector
  const [allUsers, setAllUsers] = useState([]);

  // Get current user ID
  useEffect(() => {
    const uid = PM_Vars.current_user?.data?.ID || PM_Vars.current_user?.ID;
    if (uid) setUserId(uid);
  }, []);

  // Fetch user meta (counts)
  useEffect(() => {
    if (!userId) return;
    api
      .get(`users/${userId}`, { with: "meta" })
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, [userId]);

  // Fetch users list for admin selector
  useEffect(() => {
    if (canManage) {
      api
        .get("assigned_users")
        .then((res) => setAllUsers(res.data ?? []))
        .catch(() => {});
    }
  }, [canManage]);

  // Fetch projects for filter dropdown
  useEffect(() => {
    if (!userId) return;
    api
      .get("projects", {
        select: "id, title",
        status: "incomplete",
        per_page: 100,
      })
      .then((res) => setFilterProjects(res.data ?? []))
      .catch(() => {});
  }, [userId]);

  // Fetch tasks — uses GET /tasks with pagination like Vue 2 search-task.vue
  const fetchTasks = useCallback(
    async (page = 1) => {
      if (!userId) return;
      const tab = TABS.find((t) => t.key === activeTab);
      if (!tab?.taskType) return;

      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const data = {
        with: "task_list,project",
        select: "id, title, created_at, start_at, due_date, completed_at",
        per_page: 20,
        pages: page,
        users: userId,
        orderby: sortBy,
      };

      // Status & date filters matching Vue 2 logic
      if (tab.taskType === "current") {
        data.status = 0;
        data.due_date_operator = ["greater_than_equal|or", "null|or", "empty"];
        data.due_date = today;
      } else if (tab.taskType === "outstanding") {
        data.status = 0;
        data.due_date = today;
        data.due_date_operator = ["less_than"];
      } else if (tab.taskType === "complete") {
        data.status = 1;
      }

      if (searchTitle.trim()) data.title = searchTitle.trim();
      if (filterProjectId) data.project_id = [filterProjectId];

      try {
        const res = await api.get("tasks", data);
        setTasks(res.data ?? []);
        setTaskTotalPages(res.meta?.total_page ?? 1);
        setTaskPage(page);
      } catch {}
      setLoading(false);
    },
    [api, userId, activeTab, sortBy, searchTitle, filterProjectId],
  );

  useEffect(() => {
    const tab = TABS.find((t) => t.key === activeTab);
    if (tab?.taskType) fetchTasks(1);
  }, [userId, activeTab, fetchTasks]);

  // Fetch overview graph data — Vue 2: GET users/{id}?with=meta,graph
  useEffect(() => {
    if (!userId || activeTab !== "overview") return;
    setOverviewLoading(true);
    api
      .get(`users/${userId}`, { with: "meta,graph" })
      .then((res) => {
        setUser(res.data);
        setGraph(res.data?.graph?.data ?? res.data?.graph ?? []);
      })
      .catch(() => {})
      .finally(() => setOverviewLoading(false));
  }, [userId, activeTab]);

  // Fetch activities
  useEffect(() => {
    if (!userId || activeTab !== "activities") return;
    setActLoading(true);
    api
      .get(`users/${userId}/user-activities`, {
        mytask_activities_page: 1,
        mytask_activities_per_page: 15,
        with: "activities",
      })
      .then((res) => {
        setActivities(res.data ?? []);
        const meta = res.meta?.pagination;
        setActHasMore(meta ? meta.current_page < meta.total_pages : false);
        setActPage(1);
      })
      .catch(() => {})
      .finally(() => setActLoading(false));
  }, [userId, activeTab]);

  // Load more activities
  const loadMoreActivities = useCallback(async () => {
    if (!userId) return;
    setActLoading(true);
    const nextPage = actPage + 1;
    try {
      const res = await api.get(`users/${userId}/user-activities`, {
        mytask_activities_page: nextPage,
        mytask_activities_per_page: 15,
        with: "activities",
      });
      const newActs = res.data ?? [];
      setActivities((prev) => [...prev, ...newActs]);
      const meta = res.meta?.pagination;
      setActHasMore(meta ? meta.current_page < meta.total_pages : false);
      setActPage(nextPage);
    } catch {}
    setActLoading(false);
  }, [api, userId, actPage]);

  // Open task detail sheet
  const handleOpenTask = useCallback(
    (task) => {
      dispatch(setProjectId(task.project_id));
      dispatch(openTaskSheet(task));
    },
    [dispatch],
  );

  // Toggle task status
  const handleToggleTask = useCallback(
    async (task) => {
      const newStatus = isTaskComplete(task.status) ? 0 : 1;
      try {
        await api.post(
          `projects/${task.project_id}/tasks/${task.id}/change-status`,
          { status: newStatus },
        );
        fetchTasks(taskPage);
        // Refetch user meta for counts
        const userRes = await api.get(`users/${userId}`, { with: "meta" });
        setUser(userRes.data);
      } catch {
        toast.error(__("Failed to update task"));
      }
    },
    [api, userId, activeTab, toast, __],
  );

  // User meta counts
  const meta = user?.meta?.data || user?.meta || {};
  const counts = {
    current: meta.total_current_tasks ?? 0,
    outstanding: meta.total_outstanding_tasks ?? 0,
    complete: meta.total_complete_tasks ?? 0,
  };

  // Parse activity message
  function parseActivityMessage(act) {
    let msg = act.message || "";
    if (!msg) return act.action || "";
    return msg.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
      const keys = path.trim().split(".");
      let val = act;
      for (const key of keys) {
        if (val && typeof val === "object" && key in val) val = val[key];
        else return "";
      }
      return val != null ? String(val) : "";
    });
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header — user info + user selector */}
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage
            src={user?.avatar_url || PM_Vars.current_user?.data?.avatar_url}
          />
          <AvatarFallback className="text-lg">
            {userInitials(
              user?.display_name ||
                PM_Vars.current_user?.data?.display_name ||
                "?",
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("My Tasks")}
          </h1>
          <p className="text-sm text-pm-text-muted">
            {user?.display_name || PM_Vars.current_user?.data?.display_name}
          </p>
        </div>

        {/* User selector for admins */}
        {canManage && allUsers.length > 1 && (
          <select
            className="h-9 text-sm border rounded-md px-3 bg-background text-pm-text-primary"
            value={userId || ""}
            onChange={(e) => setUserId(Number(e.target.value))}
          >
            {allUsers.map((u) => (
              <option key={u.id || u.ID} value={u.id || u.ID}>
                {u.display_name}
              </option>
            ))}
          </select>
        )}

        {/* Add New Task button */}
        <Button
          size="sm"
          onClick={() => setNewTaskOpen(true)}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          {__("New Task")}
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: __("Current"),
            count: counts.current,
            icon: CheckSquare,
            color: "text-emerald-500 bg-emerald-50",
          },
          {
            label: __("Outstanding"),
            count: counts.outstanding,
            icon: AlertTriangle,
            color: "text-red-500 bg-red-50",
          },
          {
            label: __("Completed"),
            count: counts.complete,
            icon: CheckCircle,
            color: "text-blue-500 bg-blue-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-4 flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg ${s.color.split(" ")[1]}`}>
              <s.icon className={`h-5 w-5 ${s.color.split(" ")[0]}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-pm-text-primary tabular-nums">
                {s.count}
              </p>
              <p className="text-[11px] text-pm-text-muted font-medium">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="inline-flex items-center rounded-lg bg-muted/60 p-1 gap-0.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          const count = counts[tab.key];
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-background text-pm-text-primary shadow-sm"
                  : "text-pm-text-muted hover:text-pm-text-primary"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {__(tab.label)}
              {count !== undefined && (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-1.5 min-w-[18px] h-[18px] text-[10px] font-semibold tabular-nums ${
                    isActive
                      ? "bg-pm-accent/10 text-pm-accent"
                      : "text-pm-text-muted/70"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "overview" ? (
        /* Overview tab — pie chart + stats */
        overviewLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* At a Glance — Pie Chart */}
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-sm font-semibold text-pm-text-primary mb-4">
                {__("At a Glance")}
              </h3>
              <div className="flex items-center gap-8">
                <div className="w-[200px] h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: __("Current"), value: counts.current },
                          {
                            name: __("Outstanding"),
                            value: counts.outstanding,
                          },
                          { name: __("Completed"), value: counts.complete },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {PIE_COLORS.map((color, i) => (
                          <Cell key={i} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      label: __("Current"),
                      count: counts.current,
                      color: "#61BD4F",
                    },
                    {
                      label: __("Outstanding"),
                      count: counts.outstanding,
                      color: "#EB5A46",
                    },
                    {
                      label: __("Completed"),
                      count: counts.complete,
                      color: "#0090D9",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-sm shrink-0"
                        style={{ background: item.color }}
                      />
                      <span className="text-sm text-pm-text-primary w-24">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-pm-text-primary tabular-nums">
                        {item.count} {__("Tasks")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Trend — Line Chart */}
            {graph.length > 0 && (
              <div className="rounded-xl border bg-card p-6">
                <h3 className="text-sm font-semibold text-pm-text-primary mb-4">
                  {__("Activity Trend")}
                </h3>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={graph.map((d) => ({
                        date: formatPmDate(d.date_time),
                        tasks: d.tasks || 0,
                        activities: d.activities || 0,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10 }}
                        interval={Math.floor(graph.length / 5)}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="tasks"
                        stroke="#61BD4F"
                        strokeWidth={2}
                        dot={false}
                        name={__("Tasks")}
                      />
                      <Line
                        type="monotone"
                        dataKey="activities"
                        stroke="#0090D9"
                        strokeWidth={2}
                        dot={false}
                        name={__("Activities")}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )
      ) : activeTab !== "activities" ? (
        <div className="space-y-4">
          {/* Search + filter + sort bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder={__("Search by Task Title")}
              className="h-9 text-sm max-w-[220px]"
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchTasks(1);
              }}
            />

            {/* Project filter */}
            <select
              className="h-9 text-sm border rounded-md px-3 bg-background text-pm-text-primary max-w-[180px]"
              value={filterProjectId}
              onChange={(e) => {
                setFilterProjectId(e.target.value);
              }}
            >
              <option value="">{__("All Projects")}</option>
              {filterProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTasks(1)}
              className="gap-1.5"
            >
              <Filter className="h-3.5 w-3.5" />
              {__("Filter")}
            </Button>

            {/* Clear filters */}
            {(searchTitle || filterProjectId) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTitle("");
                  setFilterProjectId("");
                }}
                className="gap-1 text-pm-text-muted h-8 px-2"
              >
                <X className="h-3.5 w-3.5" />
                {__("Clear")}
              </Button>
            )}

            <div className="ml-auto flex items-center gap-1 text-xs text-pm-text-muted">
              <span>{__("Sort:")}</span>
              <select
                className="h-8 text-xs border rounded px-2 bg-background"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                }}
              >
                <option value="id:desc">{__("Newest")}</option>
                <option value="id:asc">{__("Oldest")}</option>
                <option value="title:asc">{__("Title A-Z")}</option>
                <option value="title:desc">{__("Title Z-A")}</option>
                <option value="due_date:asc">{__("Due Date ↑")}</option>
                <option value="due_date:desc">{__("Due Date ↓")}</option>
              </select>
            </div>
          </div>

          {/* Task list */}
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-11 rounded-lg" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-pm-text-muted">
                {activeTab === "current"
                  ? __("No current tasks")
                  : activeTab === "outstanding"
                  ? __("No overdue tasks — great job!")
                  : __("No completed tasks yet")}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border bg-card overflow-hidden">
              {/* Table header */}
              <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-muted/30 border-b text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70">
                <div className="col-span-5">{__("Task")}</div>
                <div className="col-span-2">{__("Task List")}</div>
                <div className="col-span-2">{__("Project")}</div>
                <div className="col-span-2">
                  {activeTab === "complete" ? __("Completed") : __("Due Date")}
                </div>
                <div className="col-span-1"></div>
              </div>
              {tasks.map((task) => (
                <MyTaskRow
                  key={task.id}
                  task={task}
                  projectTitle={task.project?.data?.title || ""}
                  onToggle={handleToggleTask}
                  onOpen={handleOpenTask}
                />
              ))}
            </div>
          )}

          {/* Pagination — same as ProjectsPage */}
          {taskTotalPages > 1 &&
            (() => {
              const pages = [];
              for (let i = 1; i <= taskTotalPages; i++) {
                if (
                  i === 1 ||
                  i === taskTotalPages ||
                  (i >= taskPage - 1 && i <= taskPage + 1)
                ) {
                  pages.push(i);
                } else if (pages[pages.length - 1] !== "ellipsis") {
                  pages.push("ellipsis");
                }
              }
              return (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => taskPage > 1 && fetchTasks(taskPage - 1)}
                        className={
                          taskPage <= 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>
                    {pages.map((page, idx) =>
                      page === "ellipsis" ? (
                        <PaginationItem key={`e-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === taskPage}
                            onClick={() => fetchTasks(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          taskPage < taskTotalPages && fetchTasks(taskPage + 1)
                        }
                        className={
                          taskPage >= taskTotalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              );
            })()}
        </div>
      ) : (
        /* Activities tab */
        <div className="space-y-0">
          {actLoading && activities.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-pm-text-muted">
                {__("No activities found")}
              </p>
            </div>
          ) : (
            <>
              {activities.map((act, i) => (
                <div
                  key={act.id || i}
                  className="flex gap-3 py-2.5 border-b border-border/40 last:border-b-0"
                >
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={act.actor?.data?.avatar_url} />
                    <AvatarFallback className="text-[8px]">
                      {userInitials(act.actor?.data?.display_name ?? "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-pm-text-primary/80">
                      {parseActivityMessage(act)}
                    </p>
                    <p className="text-[10px] text-pm-text-muted mt-0.5">
                      {formatPmDateTime(act.committed_at)}
                    </p>
                  </div>
                </div>
              ))}
              {actHasMore && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadMoreActivities}
                    disabled={actLoading}
                  >
                    {actLoading ? __("Loading...") : __("Load more")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Task detail drawer — same as task lists page */}
      <TaskDetailSheet />

      {/* New task sheet */}
      <NewTaskSheet
        open={newTaskOpen}
        onOpenChange={setNewTaskOpen}
        userId={userId}
        onCreated={() => {
          fetchTasks(taskPage);
          // Refresh user meta counts
          if (userId) {
            api
              .get(`users/${userId}`, { with: "meta" })
              .then((res) => setUser(res.data))
              .catch(() => {});
          }
        }}
      />
    </div>
  );
}
