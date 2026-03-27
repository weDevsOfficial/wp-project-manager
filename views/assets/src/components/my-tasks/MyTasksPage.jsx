import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAppDispatch } from "@store/index";
import { openTaskSheet } from "@store/tasksSlice";
import { setProjectId } from "@store/taskListsSlice";
import { useApi } from "@hooks/useApi";
import { useProApi } from "@hooks/useProApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { usePermissions } from "@hooks/usePermissions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import RichTextEditor from "@components/common/RichTextEditor";
import { Skeleton } from "@components/ui/skeleton";
import { Badge } from "@components/ui/badge";
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
  BarChart3,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Crown,
  Edit3,
  Trash2,
  FolderKanban,
  FileText,
  Milestone,
  ArrowUpDown,
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
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  isTaskComplete,
  formatPmDate,
  extractDateStr,
  userInitials,
  isOverdue,
} from "@lib/pm-utils";
import TaskDetailSheet from "@components/tasks/TaskDetailSheet";
import { useProModal } from "@components/common/ProUpgradeModal";
import { cn } from "@lib/utils";

// ── Activity helpers (same as ActivitiesPage) ────────
const ACTIVITY_ICON_MAP = {
  create_project: FolderKanban, update_project: Edit3, delete_project: Trash2,
  create_task: CheckSquare, update_task: Edit3, delete_task: Trash2,
  update_task_title: Edit3, update_task_description: Edit3, update_task_status: ArrowUpDown,
  update_task_start_at: Edit3, update_task_due_date: Edit3, update_task_estimation: Edit3,
  complete_task: CheckSquare, incomplete_task: CheckSquare,
  create_task_list: Plus, delete_task_list: Trash2,
  create_milestone: Milestone, delete_milestone: Trash2,
  create_discussion_board: MessageSquare, comment_on_task: MessageSquare,
  comment_on_discussion_board: MessageSquare, upload_file: FileText,
}
const ACTIVITY_COLOR_MAP = { create: 'bg-emerald-500', update: 'bg-blue-500', delete: 'bg-red-500' }
const ACTIVITY_LABELS = { create: 'Created', update: 'Updated', delete: 'Deleted' }
const ACTIVITY_FALLBACKS = {
  create_project: 'created a project', create_task: 'created a task', delete_task: 'deleted a task',
  update_task_title: 'updated task title', update_task_status: 'updated task status',
  update_task_start_at: 'updated task start date', update_task_due_date: 'updated task due date',
  create_task_list: 'created a task list', create_milestone: 'created a milestone',
  create_discussion_board: 'created a discussion', comment_on_task: 'commented on a task',
}

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

      {/* Due date + overdue badge */}
      <span
        className={`text-[11px] shrink-0 tabular-nums ${
          isOverdue(task.due_date, task.status)
            ? "text-red-500"
            : "text-pm-text-muted"
        }`}
      >
        {formatPmDate(task.due_date) || "—"}
      </span>
      {isOverdue(task.due_date, task.status) && (
        <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4 shrink-0">
          Overdue
        </Badge>
      )}

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

const isPro = typeof PM_Vars !== "undefined" && !!PM_Vars.is_pro;

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
  { key: "reports", label: "Reports", icon: BarChart3, pro: true },
];

const PIE_COLORS = ["#61BD4F", "#EB5A46", "#0090D9"]; // green, red, blue — matches Vue 2

export default function MyTasksPage() {
  const dispatch = useAppDispatch();
  const api = useApi();
  const proApi = isPro ? useProApi() : null;
  const { __ } = useI18n();
  const toast = useToast();
  const { canManage } = usePermissions();
  const { setOpen: setProModalOpen } = useProModal();

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
  const [overviewStartDate, setOverviewStartDate] = useState('');
  const [overviewEndDate, setOverviewEndDate] = useState('');

  // Overview calendar
  const [calDate, setCalDate] = useState(new Date());
  const [calEvents, setCalEvents] = useState([]);

  // Reports tab (Pro)
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportStart, setReportStart] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [reportEnd, setReportEnd] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });

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
    const params = { with: "meta,graph" };
    if (overviewStartDate) params.start_at = overviewStartDate;
    if (overviewEndDate) params.due_date = overviewEndDate;
    api
      .get(`users/${userId}`, params)
      .then((res) => {
        setUser(res.data);
        setGraph(res.data?.graph?.data ?? res.data?.graph ?? []);
      })
      .catch(() => {})
      .finally(() => setOverviewLoading(false));
  }, [userId, activeTab, overviewStartDate, overviewEndDate]);

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

  // Fetch overview calendar events
  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calFirstDay = new Date(calYear, calMonth, 1).getDay();
  const calMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const calDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  useEffect(() => {
    if (!userId || activeTab !== "overview") return;
    const start = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-01`;
    const end = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${calDaysInMonth}`;
    api
      .get(`users/${userId}/tasks/calender`, { start, end })
      .then((res) => setCalEvents(Array.isArray(res?.data ?? res) ? (res?.data ?? res) : []))
      .catch(() => setCalEvents([]));
  }, [userId, activeTab, calYear, calMonth]);

  const calEventsByDate = useMemo(() => {
    const map = {};
    calEvents.forEach((evt) => {
      const d = extractDateStr(evt.start_date || evt.due_date || evt.start);
      if (d) { if (!map[d]) map[d] = []; map[d].push(evt); }
    });
    return map;
  }, [calEvents]);

  // Fetch reports data (Pro)
  const fetchReport = useCallback(() => {
    if (!userId || !proApi) return;
    setReportLoading(true);
    proApi
      .get("report-summary", {
        type: "user",
        users: userId,
        startDate: reportStart,
        endDate: reportEnd,
        estimated_time: "task_estimation",
        report_query: "yes",
      })
      .then((res) => setReportData(res?.data ?? res))
      .catch(() => setReportData(null))
      .finally(() => setReportLoading(false));
  }, [userId, proApi, reportStart, reportEnd]);

  useEffect(() => {
    if (activeTab === "reports" && isPro) fetchReport();
  }, [activeTab, fetchReport]);

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
    const actor = act.actor?.data || {}
    const meta = act.meta || {}
    let msg = act.message || ""

    if (!msg) {
      const fallback = ACTIVITY_FALLBACKS[act.action]
      if (fallback) {
        const title = meta.task_title || meta.task_list_title || meta.project_title
          || meta.milestone_title || meta.discussion_board_title || ''
        return title ? `${fallback} "${title}"` : fallback
      }
      return (act.action || 'activity').replace(/_/g, ' ')
    }

    msg = msg.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
      const keys = path.trim().split(".")
      const data = { actor: { data: actor }, meta }
      let val = data
      for (const key of keys) {
        if (val == null) return ""
        val = val[key]
      }
      return (val != null && typeof val !== 'object') ? String(val) : ""
    })

    // Remove actor name from beginning (shown separately)
    const actorName = actor.display_name || ''
    if (actorName && msg.startsWith(actorName)) {
      msg = msg.slice(actorName.length).replace(/^\s+/, '')
      msg = msg.charAt(0).toUpperCase() + msg.slice(1)
    }

    return msg
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
              onClick={() => {
                if (tab.pro && !isPro) { setProModalOpen(true); return; }
                setActiveTab(tab.key);
              }}
              className={`relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-background text-pm-text-primary shadow-sm"
                  : "text-pm-text-muted hover:text-pm-text-primary"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {__(tab.label)}
              {tab.pro && !isPro && (
                <span className="inline-flex items-center gap-0.5 bg-pm-accent/10 text-pm-accent text-[9px] font-semibold px-1.5 py-0.5 rounded">
                  <Crown className="h-2.5 w-2.5" />PRO
                </span>
              )}
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
            {/* Date range filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-pm-text-muted">{__('Activity Filter')}</span>
              <input
                type="date"
                value={overviewStartDate}
                onChange={(e) => setOverviewStartDate(e.target.value)}
                className="h-8 rounded-md border border-pm-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-pm-accent"
              />
              <span className="text-xs text-pm-text-muted">{__('to')}</span>
              <input
                type="date"
                value={overviewEndDate}
                onChange={(e) => setOverviewEndDate(e.target.value)}
                className="h-8 rounded-md border border-pm-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-pm-accent"
              />
              {(overviewStartDate || overviewEndDate) && (
                <Button variant="ghost" size="sm" className="h-8 text-xs text-pm-text-muted" onClick={() => { setOverviewStartDate(''); setOverviewEndDate('') }}>
                  <X className="h-3 w-3 mr-1" />{__('Clear')}
                </Button>
              )}
            </div>

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

            {/* Mini Calendar — user's tasks */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-pm-text-primary flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {__("Calendar")}
                </h3>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setCalDate(new Date(calYear, calMonth - 1, 1))} className="p-1 rounded hover:bg-muted">
                    <ChevronLeft className="h-4 w-4 text-pm-text-muted" />
                  </button>
                  <span className="text-sm font-medium min-w-[130px] text-center">{calMonths[calMonth]} {calYear}</span>
                  <button type="button" onClick={() => setCalDate(new Date(calYear, calMonth + 1, 1))} className="p-1 rounded hover:bg-muted">
                    <ChevronRight className="h-4 w-4 text-pm-text-muted" />
                  </button>
                </div>
              </div>
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {calDays.map((d) => (
                  <div key={d} className="text-center text-[10px] font-semibold uppercase text-pm-text-muted py-1">{d}</div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {Array.from({ length: calFirstDay }).map((_, i) => (
                  <div key={`e-${i}`} className="min-h-[60px] border border-transparent" />
                ))}
                {Array.from({ length: calDaysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const todayStr = new Date().toISOString().substring(0, 10);
                  const isToday = dateStr === todayStr;
                  const dayEvts = calEventsByDate[dateStr] || [];
                  return (
                    <div key={day} className={`min-h-[60px] border border-pm-border/20 p-0.5 ${isToday ? "bg-pm-accent/5" : ""}`}>
                      <span className={`text-[10px] font-medium inline-flex items-center justify-center w-5 h-5 rounded-full ${isToday ? "bg-pm-accent text-white" : "text-pm-text-muted"}`}>{day}</span>
                      {dayEvts.slice(0, 2).map((evt, j) => {
                        const complete = evt.status === 1 || evt.status === "complete";
                        const overdue = !complete && evt.due_date && extractDateStr(evt.due_date) < todayStr;
                        return (
                          <div
                            key={evt.id || j}
                            className={`text-[8px] px-1 py-0 rounded truncate mt-0.5 cursor-pointer ${complete ? "bg-blue-100 text-blue-700" : overdue ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                            title={evt.title}
                          >
                            {evt.title}
                          </div>
                        );
                      })}
                      {dayEvts.length > 2 && <div className="text-[7px] text-pm-text-muted px-1">+{dayEvts.length - 2}</div>}
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 text-[10px] text-pm-text-muted">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />{__("Current")}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />{__("Outstanding")}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />{__("Completed")}</span>
              </div>
            </div>
          </div>
        )
      ) : activeTab === "reports" ? (
        /* Reports tab (Pro) */
        reportLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        ) : !reportData ? (
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-medium uppercase text-pm-text-muted">{__("Start Date")}</label>
                <Input type="date" value={reportStart} onChange={(e) => setReportStart(e.target.value)} className="h-8 text-sm w-36" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium uppercase text-pm-text-muted">{__("End Date")}</label>
                <Input type="date" value={reportEnd} onChange={(e) => setReportEnd(e.target.value)} className="h-8 text-sm w-36" />
              </div>
              <Button size="sm" className="h-8" onClick={fetchReport}>{__("Run Report")}</Button>
            </div>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-pm-text-muted/20 mx-auto mb-3" />
              <p className="text-sm text-pm-text-muted">{__("Select date range and click Run Report.")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Date filter */}
            <div className="flex items-end gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-medium uppercase text-pm-text-muted">{__("Start Date")}</label>
                <Input type="date" value={reportStart} onChange={(e) => setReportStart(e.target.value)} className="h-8 text-sm w-36" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium uppercase text-pm-text-muted">{__("End Date")}</label>
                <Input type="date" value={reportEnd} onChange={(e) => setReportEnd(e.target.value)} className="h-8 text-sm w-36" />
              </div>
              <Button size="sm" className="h-8" onClick={fetchReport}>{__("Run Report")}</Button>
            </div>

            {/* User Name */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{__("User Name")}</span>
              <span className="text-sm bg-muted px-2.5 py-1 rounded">{user?.display_name || "—"}</span>
            </div>

            {/* Meta badges */}
            {(() => {
              const projects = reportData?.projects?.data || {};
              const allProj = Object.values(projects).flatMap((up) => (up?.data ? (Array.isArray(up.data) ? up.data : Object.values(up.data)) : []));
              const totalEst = allProj.reduce((t, p) => { const tf = p.estimated_hours_tf || "0:00"; const pts = tf.split(":"); return t + (parseInt(pts[0]) || 0) * 3600 + (parseInt(pts[1]) || 0) * 60; }, 0);
              const totalWork = allProj.reduce((t, p) => { const tf = p.working_hours_tf || "0:00"; const pts = tf.split(":"); return t + (parseInt(pts[0]) || 0) * 3600 + (parseInt(pts[1]) || 0) * 60; }, 0);
              const completedTasks = allProj.reduce((t, p) => t + (p.completed_tasks || 0), 0);
              const totalTasks = allProj.reduce((t, p) => t + (p.assigned_tasks || 0) + (p.assigned_subtasks || 0), 0);
              const fmtTime = (s) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`; };
              const days = (() => { const s = new Date(reportStart); const e = new Date(reportEnd); return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1); })();
              const avgPerTask = totalTasks > 0 ? fmtTime(totalEst / totalTasks) : "00:00";
              const avgPerDay = fmtTime(totalWork / days);
              const avgTaskPerDay = totalTasks > 0 ? (totalTasks / days).toFixed(1) : "0";
              return (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs font-medium px-2.5 py-1 rounded-full"><Clock className="h-3 w-3" />{__("Total Estimation Hours")} <span className="bg-white/20 px-1.5 rounded">{fmtTime(totalEst)}</span></span>
                  <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">{__("Completed Task Count")} <span className="bg-white/20 px-1.5 rounded">{completedTasks}</span></span>
                  <span className="inline-flex items-center gap-1.5 bg-amber-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">{__("Avg. Hour Per-task")} <span className="bg-white/20 px-1.5 rounded">{avgPerTask}</span></span>
                  <span className="inline-flex items-center gap-1.5 bg-cyan-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">{__("Avg. Work Hour Per-day")} <span className="bg-white/20 px-1.5 rounded">{avgPerDay}</span></span>
                  <span className="inline-flex items-center gap-1.5 bg-violet-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">{__("Avg. Task Per-day")} <span className="bg-white/20 px-1.5 rounded">{avgTaskPerDay}</span></span>
                </div>
              );
            })()}

            {/* 3 Charts side by side */}
            {(() => {
              const projects = reportData?.projects?.data || {};
              const allProj = Object.values(projects).flatMap((up) => (up?.data ? (Array.isArray(up.data) ? up.data : Object.values(up.data)) : []));
              const taskTypes = reportData?.task_types_detailed?.data || [];
              const subtaskTypes = reportData?.subtask_types_detailed?.data || [];

              const projChart = allProj.map((p) => ({
                name: (p.project?.title || "?").substring(0, 12),
                estHours: parseFloat(p.estimated_hours || 0),
                completed: p.completed_tasks || 0,
              }));
              const ttChart = (Array.isArray(taskTypes) ? taskTypes : []).map((t) => ({
                name: (t.type || "?").substring(0, 12),
                estHours: parseFloat(t.est_hours_decimal || 0),
                completed: t.completed || 0,
              }));
              const stChart = (Array.isArray(subtaskTypes) ? subtaskTypes : []).map((t) => ({
                name: (t.type || "?").substring(0, 12),
                estHours: parseFloat(t.est_hours_decimal || 0),
                completed: t.completed || 0,
              }));

              const renderChart = (data, title) => (
                <div className="rounded-xl border bg-card p-4 flex-1 min-w-[250px]">
                  <h4 className="text-sm font-semibold text-pm-text-primary mb-2">{title}</h4>
                  {data.length > 0 ? (
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} width={25} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: 10 }} />
                          <Bar dataKey="estHours" name={__("Est. Hours")} fill="#f77726" radius={[3, 3, 0, 0]} maxBarSize={20} />
                          <Bar dataKey="completed" name={__("Completed")} fill="#4bc0c0" radius={[3, 3, 0, 0]} maxBarSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-xs text-pm-text-muted">{__("No data")}</div>
                  )}
                </div>
              );

              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {renderChart(projChart, __("All Projects"))}
                  {renderChart(ttChart, __("Task Types"))}
                  {renderChart(stChart, __("Subtask Types"))}
                </div>
              );
            })()}

            {/* Tables */}
            {(() => {
              const projects = reportData?.projects?.data || {};
              const allProj = Object.values(projects).flatMap((up) => (up?.data ? (Array.isArray(up.data) ? up.data : Object.values(up.data)) : []));
              const subtasksAll = Object.values(reportData?.sub_tasks_details?.data || {}).flatMap((ut) => (ut?.data ? (Array.isArray(ut.data) ? ut.data : Object.values(ut.data)) : []));
              const taskTypes = reportData?.task_types_detailed?.data || [];

              return (
                <>
                  {/* Projects table */}
                  {allProj.length > 0 && (
                    <div className="rounded-xl border bg-card overflow-hidden">
                      <h4 className="text-sm font-semibold text-pm-text-primary px-4 py-3 border-b">{__("Projects")}</h4>
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-xs text-pm-text-muted">
                          <th className="text-left px-4 py-2">{__("Project")}</th>
                          <th className="text-left px-4 py-2">{__("Assigned")}</th>
                          <th className="text-left px-4 py-2">{__("Completed")}</th>
                          <th className="text-left px-4 py-2">{__("Working H")}</th>
                          <th className="text-left px-4 py-2">{__("Est. H")}</th>
                        </tr></thead>
                        <tbody>
                          {allProj.map((p, i) => (
                            <tr key={i} className="border-b last:border-b-0">
                              <td className="px-4 py-2 font-medium">{p.project?.title || "—"}</td>
                              <td className="px-4 py-2 text-pm-text-muted">{p.assigned_tasks || 0}</td>
                              <td className="px-4 py-2 text-pm-text-muted">{p.completed_tasks || 0}</td>
                              <td className="px-4 py-2 text-pm-text-muted">{p.working_hours_tf || "0:00"}</td>
                              <td className="px-4 py-2 text-pm-text-muted">{p.estimated_hours_tf || "0:00"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Task Type table */}
                  {Array.isArray(taskTypes) && taskTypes.length > 0 && (
                    <div className="rounded-xl border bg-card overflow-hidden">
                      <h4 className="text-sm font-semibold text-pm-text-primary px-4 py-3 border-b">{__("Task type")}</h4>
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-xs text-pm-text-muted">
                          <th className="text-left px-4 py-2">{__("Task type")}</th>
                          <th className="text-left px-4 py-2">{__("Task")}</th>
                          <th className="text-left px-4 py-2">{__("Est. Hour")}</th>
                        </tr></thead>
                        <tbody>
                          {taskTypes.map((t, i) => (
                            <tr key={i} className="border-b last:border-b-0">
                              <td className="px-4 py-2 font-medium">{t.type || "—"}</td>
                              <td className="px-4 py-2 text-pm-text-muted">{t.assigned || 0}</td>
                              <td className="px-4 py-2 text-pm-text-muted">{t.est_hours || "0:00"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Subtasks table */}
                  {subtasksAll.length > 0 && (
                    <div className="rounded-xl border bg-card overflow-hidden">
                      <h4 className="text-sm font-semibold text-pm-text-primary px-4 py-3 border-b">{__("Subtasks")}</h4>
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-xs text-pm-text-muted">
                          <th className="text-left px-4 py-2">{__("Completed At")}</th>
                          <th className="text-left px-4 py-2">{__("Task Title")}</th>
                          <th className="text-left px-4 py-2">{__("Subtask Title")}</th>
                          <th className="text-left px-4 py-2">{__("Project")}</th>
                          <th className="text-left px-4 py-2">{__("Type")}</th>
                          <th className="text-left px-4 py-2">{__("Hour")}</th>
                        </tr></thead>
                        <tbody>
                          {subtasksAll.map((st, i) => (
                            <tr key={i} className="border-b last:border-b-0">
                              <td className="px-4 py-2 text-pm-text-muted">{st.completed_at_display || "N/A"}</td>
                              <td className="px-4 py-2">{st.parent_task_title || "—"}</td>
                              <td className="px-4 py-2 font-medium">{st.title}</td>
                              <td className="px-4 py-2 text-pm-text-muted">{st.project_title || "—"}</td>
                              <td className="px-4 py-2 text-pm-text-muted">{st.type?.title || "—"}</td>
                              <td className="px-4 py-2 text-pm-text-muted">{st.estimation_tf || "0:00"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              );
            })()}
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
              {activities.map((act, i) => {
                const Icon = ACTIVITY_ICON_MAP[act.action] || Activity
                const actor = act.actor?.data || {}
                const actionType = act.action_type || 'update'
                const badgeColor = ACTIVITY_COLOR_MAP[actionType] || 'bg-gray-400'
                const badgeLabel = ACTIVITY_LABELS[actionType] || actionType
                const timeStr = act.committed_at?.time?.slice(0, 5) || ''

                return (
                  <div
                    key={act.id || i}
                    className="flex items-start gap-3 py-3 px-4 bg-white rounded-lg border border-border/50 hover:shadow-sm transition-all"
                  >
                    <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                      <AvatarImage src={actor.avatar_url} />
                      <AvatarFallback className="text-[11px] font-semibold bg-pm-accent/10 text-pm-accent">
                        {userInitials(actor.display_name ?? "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-pm-text">{actor.display_name || 'Unknown'}</span>
                        <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-4 font-medium border-0 text-white', badgeColor)}>
                          {badgeLabel}
                        </Badge>
                      </div>
                      <p className="text-sm text-pm-text-muted leading-snug">
                        {parseActivityMessage(act)}
                      </p>
                      {timeStr && (
                        <span className="text-[11px] text-pm-text-muted/50 mt-1 inline-block">{timeStr}</span>
                      )}
                    </div>
                    <div className="shrink-0 mt-1">
                      <Icon className="h-4 w-4 text-pm-text-muted/40" />
                    </div>
                  </div>
                )
              })}
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
