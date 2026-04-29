import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/index";
import { openTaskSheet } from "@store/tasksSlice";
import { setProjectId } from "@store/taskListsSlice";
import { useApi } from "@hooks/useApi";
import { useProApi } from "@hooks/useProApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { usePermissions } from "@hooks/usePermissions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
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
import { UserAvatar } from '@components/common/UserAvatar';
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
  Plus,
  Filter,
  X,
  BarChart3,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Crown,
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
} from "@lib/pm-utils";
import TaskDetailSheet from "@components/tasks/TaskDetailSheet";
import { useProModal } from "@components/common/ProUpgradeModal";
import { cn } from "@lib/utils";
import {
  ACTIVITY_ICON_MAP,
  ACTIVITY_COLOR_MAP,
  ACTIVITY_LABELS,
  isPro,
  TABS,
  PIE_COLORS,
} from "./constants";
import { parseActivityMessage } from "./utils";
import { resolveActivityUrl } from "@lib/activity-links";
import MyTaskRow from "./parts/MyTaskRow";
import NewTaskSheet from "./parts/NewTaskSheet";

export default function MyTasksPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const api = useApi();
  const proApi = useProApi();
  const { __ } = useI18n();
  const toast = useToast();
  const { canManage } = usePermissions();
  const { setOpen: setProModalOpen } = useProModal();

  const [activeTab, setActiveTab] = useState("current");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [taskPage, setTaskPage] = useState(1);
  const [taskTotalPages, setTaskTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [sortBy, setSortBy] = useState("id:desc");
  const [filterProjectId, setFilterProjectId] = useState("");

  const [newTaskOpen, setNewTaskOpen] = useState(false);

  const [filterProjects, setFilterProjects] = useState([]);

  const [graph, setGraph] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewStartDate, setOverviewStartDate] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    return d.toISOString().substring(0, 10);
  });
  const [overviewEndDate, setOverviewEndDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [appliedFilterDates, setAppliedFilterDates] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    return { start: d.toISOString().substring(0, 10), end: new Date().toISOString().substring(0, 10) };
  });

  const [calDate, setCalDate] = useState(new Date());
  const [calEvents, setCalEvents] = useState([]);

  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportStart, setReportStart] = useState("");
  const [reportEnd, setReportEnd] = useState("");
  const [showReportDateError, setShowReportDateError] = useState(false);

  const [activities, setActivities] = useState([]);
  const [actPage, setActPage] = useState(1);
  const [actHasMore, setActHasMore] = useState(false);
  const [actLoading, setActLoading] = useState(false);

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const uid = PM_Vars.current_user?.data?.ID || PM_Vars.current_user?.ID;
    if (uid) setUserId(uid);
  }, []);

  useEffect(() => {
    if (!userId) return;
    api
      .get(`users/${userId}`, { with: "meta" })
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    if (canManage) {
      api
        .get("assigned_users")
        .then((res) => setAllUsers(res.data ?? []))
        .catch(() => {});
    }
  }, [canManage]);

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

  const fetchTasks = useCallback(
    async (page = 1) => {
      if (!userId) return;
      const tab = TABS.find((t) => t.key === activeTab);
      if (!tab?.taskType) return;

      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const data = {
        with: "task_list,project,labels,assignees",
        select: "id, title, created_at, start_at, due_date, completed_at",
        per_page: 20,
        pages: page,
        users: userId,
        orderby: sortBy,
      };

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

  const taskSheetOpen = useAppSelector((s) => s.tasks.taskSheetOpen);
  const taskModified = useAppSelector((s) => s.tasks.taskModifiedInSheet);
  const prevSheetOpen = useRef(false);
  const fetchTasksRef = useRef(fetchTasks);
  const taskPageRef = useRef(taskPage);
  const userIdRef = useRef(userId);
  useEffect(() => { fetchTasksRef.current = fetchTasks; }, [fetchTasks]);
  useEffect(() => { taskPageRef.current = taskPage; }, [taskPage]);
  useEffect(() => { userIdRef.current = userId; }, [userId]);
  useEffect(() => {
    if (prevSheetOpen.current && !taskSheetOpen && taskModified) {
      fetchTasksRef.current(taskPageRef.current);
      if (userIdRef.current) {
        api.get(`users/${userIdRef.current}`, { with: "meta" })
          .then((res) => setUser(res.data))
          .catch(() => {});
      }
    }
    prevSheetOpen.current = taskSheetOpen;
  }, [taskSheetOpen, taskModified]);

  useEffect(() => {
    if (!userId || activeTab !== "overview") return;
    setOverviewLoading(true);
    const params = { with: "meta,graph" };
    if (appliedFilterDates.start) params.start_at = appliedFilterDates.start;
    if (appliedFilterDates.end) params.due_date = appliedFilterDates.end;
    api
      .get(`users/${userId}`, params)
      .then((res) => {
        setUser(res.data);
        setGraph(res.data?.graph?.data ?? res.data?.graph ?? []);
      })
      .catch(() => {})
      .finally(() => setOverviewLoading(false));
  }, [userId, activeTab, appliedFilterDates]);

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

  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calFirstDay = new Date(calYear, calMonth, 1).getDay();
  const calMonths = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(navigator.language, { month: "long" });
    return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2000, i, 1)));
  }, []);
  const calDays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(navigator.language, { weekday: "short" });
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2000, 0, 2 + i)));
  }, []);

  useEffect(() => {
    if (!userId || activeTab !== "overview") return;
    const start = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-01`;
    const end = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${calDaysInMonth}`;
    api
      .get(`users/${userId}/tasks/calender`, { start, end })
      .then((res) => setCalEvents(Array.isArray(res?.data ?? res) ? (res?.data ?? res) : []))
      .catch(() => setCalEvents([]));
  }, [userId, activeTab, calYear, calMonth, calDaysInMonth]);

  const calEventsByDate = useMemo(() => {
    const map = {};
    calEvents.forEach((evt) => {
      const d = extractDateStr(evt.start_date || evt.due_date || evt.start);
      if (d) { if (!map[d]) map[d] = []; map[d].push(evt); }
    });
    return map;
  }, [calEvents]);

  const [reportDates, setReportDates] = useState({ start: reportStart, end: reportEnd });

  const fetchReport = useCallback(() => {
    if (!userId || !proApi) return;
    if (!reportStart || !reportEnd) {
      setShowReportDateError(true);
      if (!reportStart && !reportEnd) {
        toast.error(__("Start Date and End Date are required."));
      } else if (!reportStart) {
        toast.error(__("Start Date is required."));
      } else {
        toast.error(__("End Date is required."));
      }
      return;
    }
    if (reportStart > reportEnd) {
      setShowReportDateError(true);
      toast.error(__("Start Date cannot be greater than End Date."));
      return;
    }
    setShowReportDateError(false);
    setReportLoading(true);
    const start = reportStart;
    const end = reportEnd;
    proApi
      .get("report-summary", {
        type: "user",
        users: userId,
        startDate: start,
        endDate: end,
        estimated_time: "task_estimation",
        report_query: "yes",
      })
      .then((res) => {
        setReportData(res?.data ?? res);
        setReportDates({ start, end });
      })
      .catch(() => setReportData(null))
      .finally(() => setReportLoading(false));
  }, [userId, proApi, reportStart, reportEnd, toast, __]);

  const handleOpenTask = useCallback(
    (task) => {
      dispatch(setProjectId(task.project_id));
      dispatch(openTaskSheet(task));
    },
    [dispatch],
  );

  const handleToggleTask = useCallback(
    async (task) => {
      const newStatus = isTaskComplete(task.status) ? 0 : 1;
      try {
        await api.post(
          `projects/${task.project_id}/tasks/${task.id}/change-status`,
          { status: newStatus },
        );
        toast.success(newStatus === 1 ? __("Task completed") : __("Task reopened"));
        fetchTasks(taskPage);
        const userRes = await api.get(`users/${userId}`, { with: "meta" });
        setUser(userRes.data);
      } catch {
        toast.error(__("Failed to update task"));
      }
    },
    [api, userId, toast, __, fetchTasks, taskPage],
  );

  const meta = user?.meta?.data || user?.meta || {};
  const counts = {
    current: meta.total_current_tasks ?? 0,
    outstanding: meta.total_outstanding_tasks ?? 0,
    complete: meta.total_complete_tasks ?? 0,
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <UserAvatar
          user={{
            avatar_url: user?.avatar_url || PM_Vars.current_user?.data?.avatar_url,
            display_name: user?.display_name || PM_Vars.current_user?.data?.display_name || '?',
          }}
          size="xl"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("My Tasks")}
          </h1>
          <p className="text-sm text-pm-text-muted">
            {user?.display_name || PM_Vars.current_user?.data?.display_name}
          </p>
        </div>

        {canManage && allUsers.length > 1 && (
          <Select
            value={String(userId || "")}
            onValueChange={(val) => {
              setUserId(Number(val));
              setReportStart("");
              setReportEnd("");
              setReportData(null);
              setShowReportDateError(false);
            }}
          >
            <SelectTrigger className="h-9 w-[220px] text-sm shrink-0">
              <SelectValue placeholder={__("Select User")} />
            </SelectTrigger>
            <SelectContent>
              {allUsers.map((u) => (
                <SelectItem key={u.id || u.ID} value={String(u.id || u.ID)}>
                  {u.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          size="sm"
          onClick={() => setNewTaskOpen(true)}
          className="gap-1.5 shrink-0"
        >
          <Plus className="h-5 w-5" />
          {__("New Task")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: __("Current"),     count: counts.current,     icon: CheckSquare,    color: "text-emerald-500 bg-emerald-50" },
          { label: __("Outstanding"), count: counts.outstanding, icon: AlertTriangle,  color: "text-red-500 bg-red-50" },
          { label: __("Completed"),   count: counts.complete,    icon: CheckCircle,    color: "text-blue-500 bg-blue-50" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-4 flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg ${s.color.split(" ")[1]}`}>
              <s.icon className={`h-5 w-5 ${s.color.split(" ")[0]}`} />
            </div>
            <div>
              {!user ? (
                <Skeleton className="h-7 w-10 mb-1" />
              ) : (
                <p className="text-2xl font-bold text-pm-text-primary tabular-nums">
                  {s.count}
                </p>
              )}
              <p className="text-[15px] text-pm-text-muted font-medium">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

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
              <Icon className="h-4 w-4" />
              {__(tab.label)}
              {tab.pro && !isPro && (
                <span className="inline-flex items-center gap-0.5 bg-pm-accent/10 text-pm-accent text-[11px] font-semibold px-1.5 py-0.5 rounded">
                  <Crown className="h-3 w-3" />PRO
                </span>
              )}
              {count !== undefined && (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-1.5 min-w-[18px] h-[18px] text-[14px] font-semibold tabular-nums ${
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

      {activeTab === "overview" ? (
        overviewLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-pm-text-primary flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {__('Activity Filter')}
                </span>
                {(overviewStartDate || overviewEndDate) && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-pm-text-muted hover:text-destructive" onClick={() => { setOverviewStartDate(''); setOverviewEndDate(''); setAppliedFilterDates({ start: '', end: '' }) }}>
                    <X className="h-3.5 w-3.5 mr-1" />{__('Clear')}
                  </Button>
                )}
              </div>
              <div className="flex items-end gap-3 flex-wrap">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase text-pm-text-muted">{__('From')}</label>
                  <Input
                    type="date"
                    value={overviewStartDate}
                    onChange={(e) => setOverviewStartDate(e.target.value)}
                    className="h-8 text-sm w-40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase text-pm-text-muted">{__('To')}</label>
                  <Input
                    type="date"
                    value={overviewEndDate}
                    onChange={(e) => setOverviewEndDate(e.target.value)}
                    className="h-8 text-sm w-40"
                  />
                </div>
                <Button size="sm" className="h-8 text-sm" onClick={() => setAppliedFilterDates({ start: overviewStartDate, end: overviewEndDate })}>
                  <Filter className="h-3.5 w-3.5 mr-1" />{__('Filter')}
                </Button>
              </div>
            </div>

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
                          { name: __("Outstanding"), value: counts.outstanding },
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
                    { label: __("Current"),     count: counts.current,     color: "#61BD4F" },
                    { label: __("Outstanding"), count: counts.outstanding, color: "#EB5A46" },
                    { label: __("Completed"),   count: counts.complete,    color: "#0090D9" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span
                        className="h-3.5 w-3.5 rounded-sm shrink-0"
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
                      <Line type="monotone" dataKey="tasks" stroke="#61BD4F" strokeWidth={2} dot={false} name={__("Tasks")} />
                      <Line type="monotone" dataKey="activities" stroke="#0090D9" strokeWidth={2} dot={false} name={__("Activities")} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="rounded-xl border bg-card">
              <div className="flex items-center justify-between px-4 py-3 border-b border-pm-border">
                <h3 className="text-sm font-semibold text-pm-text-primary flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-pm-accent" />
                  {__("Calendar")}
                </h3>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setCalDate(new Date())}>
                    {__("Today")}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setCalDate(new Date(calYear, calMonth - 1, 1))}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setCalDate(new Date(calYear, calMonth + 1, 1))}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-semibold min-w-[140px] text-center">{calMonths[calMonth]} {calYear}</span>
                </div>
              </div>
              <div className="grid grid-cols-7 border-b border-pm-border">
                {calDays.map((d) => (
                  <div key={d} className="text-center py-2 text-[14px] font-semibold uppercase text-pm-text-muted">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {Array.from({ length: calFirstDay }).map((_, i) => (
                  <div key={`e-${i}`} className="min-h-[120px] border-b border-r border-pm-border/30 bg-muted/20" />
                ))}
                {Array.from({ length: calDaysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const todayStr = new Date().toISOString().substring(0, 10);
                  const isToday = dateStr === todayStr;
                  const dayEvts = calEventsByDate[dateStr] || [];
                  return (
                    <div key={day} className={cn("min-h-[120px] border-b border-r border-pm-border/30 p-1", isToday && "bg-pm-accent/5")}>
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-sm font-medium inline-flex items-center justify-center w-6 h-6 rounded-full",
                          isToday ? "bg-pm-accent text-white" : "text-pm-text-muted"
                        )}>{day}</span>
                        {dayEvts.length > 0 && (
                          <span className="text-[11px] text-pm-text-muted">{dayEvts.length}</span>
                        )}
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {dayEvts.map((evt, j) => {
                          const complete = evt.status === 1 || evt.status === "complete";
                          const overdue = !complete && evt.due_date && extractDateStr(evt.due_date) < todayStr;
                          return (
                            <button
                              type="button"
                              key={evt.id || j}
                              onClick={() => {
                                if (evt.project_id) dispatch(setProjectId(evt.project_id));
                                dispatch(openTaskSheet(evt));
                              }}
                              className={cn(
                                "text-[11px] px-1.5 py-0.5 rounded truncate block w-full text-left cursor-pointer hover:opacity-80 transition-opacity",
                                complete ? "bg-blue-100 text-blue-700" : overdue ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                              )}
                              title={evt.title}
                            >
                              {evt.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 px-4 py-3 text-[13px] text-pm-text-muted border-t border-pm-border">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" />{__("Current")}</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" />{__("Outstanding")}</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" />{__("Completed")}</span>
              </div>
            </div>
          </div>
        )
      ) : activeTab === "reports" ? (
        reportLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        ) : !reportData ? (
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="space-y-1">
                <label className={cn("text-[14px] font-medium uppercase", showReportDateError && !reportStart ? "text-red-500" : "text-pm-text-muted")}>
                  {__("Start Date")}<span className="text-red-500 ml-0.5">*</span>
                </label>
                <Input type="date" value={reportStart} onChange={(e) => { setReportStart(e.target.value); setShowReportDateError(false) }} className={cn("h-8 text-sm w-36", showReportDateError && !reportStart && "border-red-500 ring-1 ring-red-500")} />
              </div>
              <div className="space-y-1">
                <label className={cn("text-[14px] font-medium uppercase", showReportDateError && !reportEnd ? "text-red-500" : "text-pm-text-muted")}>
                  {__("End Date")}<span className="text-red-500 ml-0.5">*</span>
                </label>
                <Input type="date" value={reportEnd} onChange={(e) => { setReportEnd(e.target.value); setShowReportDateError(false) }} className={cn("h-8 text-sm w-36", showReportDateError && !reportEnd && "border-red-500 ring-1 ring-red-500")} />
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
            <div className="flex items-end gap-3">
              <div className="space-y-1">
                <label className={cn("text-[14px] font-medium uppercase", showReportDateError && !reportStart ? "text-red-500" : "text-pm-text-muted")}>
                  {__("Start Date")}<span className="text-red-500 ml-0.5">*</span>
                </label>
                <Input type="date" value={reportStart} onChange={(e) => { setReportStart(e.target.value); setShowReportDateError(false) }} className={cn("h-8 text-sm w-36", showReportDateError && !reportStart && "border-red-500 ring-1 ring-red-500")} />
              </div>
              <div className="space-y-1">
                <label className={cn("text-[14px] font-medium uppercase", showReportDateError && !reportEnd ? "text-red-500" : "text-pm-text-muted")}>
                  {__("End Date")}<span className="text-red-500 ml-0.5">*</span>
                </label>
                <Input type="date" value={reportEnd} onChange={(e) => { setReportEnd(e.target.value); setShowReportDateError(false) }} className={cn("h-8 text-sm w-36", showReportDateError && !reportEnd && "border-red-500 ring-1 ring-red-500")} />
              </div>
              <Button size="sm" className="h-8" onClick={fetchReport}>{__("Run Report")}</Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{__("User Name")}</span>
              <span className="text-sm bg-muted px-2.5 py-1 rounded">{user?.display_name || "—"}</span>
            </div>

            {(() => {
              const projects = reportData?.projects?.data || {};
              const allProj = Object.values(projects).flatMap((up) => (up?.data ? (Array.isArray(up.data) ? up.data : Object.values(up.data)) : []));
              const totalEst = allProj.reduce((t, p) => { const tf = p.estimated_hours_tf || "0:00"; const pts = tf.split(":"); return t + (parseInt(pts[0]) || 0) * 3600 + (parseInt(pts[1]) || 0) * 60; }, 0);
              const totalWork = allProj.reduce((t, p) => { const tf = p.working_hours_tf || "0:00"; const pts = tf.split(":"); return t + (parseInt(pts[0]) || 0) * 3600 + (parseInt(pts[1]) || 0) * 60; }, 0);
              const completedTasks = allProj.reduce((t, p) => t + (p.completed_tasks || 0), 0);
              const totalTasks = allProj.reduce((t, p) => t + (p.assigned_tasks || 0) + (p.assigned_subtasks || 0), 0);
              const fmtTime = (s) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`; };
              const days = (() => { const s = new Date(reportDates.start); const e = new Date(reportDates.end); return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1); })();
              const avgPerTask = totalTasks > 0 ? fmtTime(totalEst / totalTasks) : "00:00";
              const avgPerDay = fmtTime(totalWork / days);
              const avgTaskPerDay = totalTasks > 0 ? (totalTasks / days).toFixed(1) : "0";
              return (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-sm font-medium px-2.5 py-1 rounded-full"><Clock className="h-3.5 w-3.5" />{__("Total Estimation Hours")} <span className="bg-white/20 px-1.5 rounded">{fmtTime(totalEst)}</span></span>
                  <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-2.5 py-1 rounded-full">{__("Completed Task Count")} <span className="bg-white/20 px-1.5 rounded">{completedTasks}</span></span>
                  <span className="inline-flex items-center gap-1.5 bg-amber-600 text-white text-sm font-medium px-2.5 py-1 rounded-full">{__("Avg. Hour Per-task")} <span className="bg-white/20 px-1.5 rounded">{avgPerTask}</span></span>
                  <span className="inline-flex items-center gap-1.5 bg-cyan-600 text-white text-sm font-medium px-2.5 py-1 rounded-full">{__("Avg. Work Hour Per-day")} <span className="bg-white/20 px-1.5 rounded">{avgPerDay}</span></span>
                  <span className="inline-flex items-center gap-1.5 bg-violet-600 text-white text-sm font-medium px-2.5 py-1 rounded-full">{__("Avg. Task Per-day")} <span className="bg-white/20 px-1.5 rounded">{avgTaskPerDay}</span></span>
                </div>
              );
            })()}

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
                    <div className="h-[200px] flex items-center justify-center text-sm text-pm-text-muted">{__("No data")}</div>
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

            {(() => {
              const projects = reportData?.projects?.data || {};
              const allProj = Object.values(projects).flatMap((up) => (up?.data ? (Array.isArray(up.data) ? up.data : Object.values(up.data)) : []));
              const subtasksAll = Object.values(reportData?.sub_tasks_details?.data || {}).flatMap((ut) => (ut?.data ? (Array.isArray(ut.data) ? ut.data : Object.values(ut.data)) : []));
              const taskTypes = reportData?.task_types_detailed?.data || [];

              return (
                <>
                  {allProj.length > 0 && (
                    <div className="rounded-xl border bg-card overflow-x-auto">
                      <h4 className="text-sm font-semibold text-pm-text-primary px-4 py-3 border-b">{__("Projects")}</h4>
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-sm text-pm-text-muted">
                          <th className="text-left px-4 py-2">{__("Project")}</th>
                          <th className="text-left px-4 py-2">{__("Assigned")}</th>
                          <th className="text-left px-4 py-2">{__("Completed")}</th>
                          <th className="text-left px-4 py-2">{__("Working H")}</th>
                          <th className="text-left px-4 py-2">{__("Est. H")}</th>
                        </tr></thead>
                        <tbody>
                          {allProj.map((p, i) => (
                            <tr key={i} className="border-b last:border-b-0">
                              <td className="px-4 py-2 font-medium max-w-[200px] truncate" title={p.project?.title || ""}>{p.project?.title || "—"}</td>
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

                  {Array.isArray(taskTypes) && taskTypes.length > 0 && (
                    <div className="rounded-xl border bg-card overflow-x-auto">
                      <h4 className="text-sm font-semibold text-pm-text-primary px-4 py-3 border-b">{__("Task type")}</h4>
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-sm text-pm-text-muted">
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

                  {subtasksAll.length > 0 && (
                    <div className="rounded-xl border bg-card overflow-x-auto">
                      <h4 className="text-sm font-semibold text-pm-text-primary px-4 py-3 border-b">{__("Subtasks")}</h4>
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-sm text-pm-text-muted">
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
                              <td className="px-4 py-2 max-w-[180px] truncate" title={st.parent_task_title || ""}>{st.parent_task_title || "—"}</td>
                              <td className="px-4 py-2 font-medium max-w-[180px] truncate" title={st.title}>{st.title}</td>
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
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder={__("Search by Task Title")}
              className="h-9 text-sm w-full sm:max-w-[220px]"
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchTasks(1);
              }}
            />

            <Select
              value={filterProjectId || "all"}
              onValueChange={(val) => setFilterProjectId(val === "all" ? "" : val)}
            >
              <SelectTrigger className="h-9 text-sm w-full sm:w-[180px]">
                <SelectValue placeholder={__("All Projects")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{__("All Projects")}</SelectItem>
                {filterProjects.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTasks(1)}
              className="gap-1.5"
            >
              <Filter className="h-4 w-4" />
              {__("Filter")}
            </Button>

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
                <X className="h-4 w-4" />
                {__("Clear")}
              </Button>
            )}

            <div className="ml-auto flex items-center gap-1 text-sm text-pm-text-muted">
              <span>{__("Sort:")}</span>
              <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                <SelectTrigger className="h-8 text-sm w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id:desc">{__("Newest")}</SelectItem>
                  <SelectItem value="id:asc">{__("Oldest")}</SelectItem>
                  <SelectItem value="title:asc">{__("Title A-Z")}</SelectItem>
                  <SelectItem value="title:desc">{__("Title Z-A")}</SelectItem>
                  <SelectItem value="due_date:asc">{__("Due Date ↑")}</SelectItem>
                  <SelectItem value="due_date:desc">{__("Due Date ↓")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-muted/30 border-b">
                <Skeleton className="col-span-5 h-3 w-12" />
                <Skeleton className="col-span-2 h-3 w-16" />
                <Skeleton className="col-span-2 h-3 w-14" />
                <Skeleton className="col-span-2 h-3 w-14" />
                <div className="col-span-1" />
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-b-0 items-center">
                  <div className="col-span-5 flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                  </div>
                  <Skeleton className="col-span-2 h-3 w-20" />
                  <Skeleton className="col-span-2 h-3 w-24" />
                  <Skeleton className="col-span-2 h-3 w-16" />
                  <div className="col-span-1" />
                </div>
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
              <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-muted/30 border-b text-[14px] font-semibold uppercase tracking-wider text-pm-text-muted/70">
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
                const Icon = ACTIVITY_ICON_MAP[act.action] || Activity;
                const actor = act.actor?.data || {};
                const actionType = act.action_type || 'update';
                const badgeColor = ACTIVITY_COLOR_MAP[actionType] || 'bg-pm-text-muted';
                const badgeLabel = ACTIVITY_LABELS[actionType] || actionType;
                const timeStr = act.committed_at?.time?.slice(0, 5) || '';

                const actUrl = resolveActivityUrl(act);

                const handleResourceClick = () => {
                  if (!actUrl) return;
                  if (actUrl.openTaskSheet) {
                    dispatch(openTaskSheet({ id: actUrl.taskId, project_id: actUrl.projectId, task_list_id: actUrl.listId }));
                  } else {
                    navigate(actUrl.path);
                  }
                };

                return (
                  <div
                    key={act.id || i}
                    className="flex items-start gap-3 py-3 px-4 bg-card rounded-lg border border-border/50 hover:shadow-sm transition-all"
                  >
                    <UserAvatar user={actor} size="lg" className="mt-0.5" fallbackClassName="bg-pm-accent/10 text-pm-accent" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <button
                          type="button"
                          onClick={() => navigate('/my-tasks')}
                          className="text-sm font-semibold text-pm-text hover:text-pm-accent transition-colors cursor-pointer"
                        >
                          {actor.display_name || 'Unknown'}
                        </button>
                        <Badge variant="outline" className={cn('text-[14px] px-1.5 py-0 h-4 font-medium border-0 text-white', badgeColor)}>
                          {badgeLabel}
                        </Badge>
                      </div>
                      {actUrl ? (
                        <button
                          type="button"
                          onClick={handleResourceClick}
                          className="text-sm text-pm-text-muted leading-snug hover:text-pm-accent transition-colors cursor-pointer text-left"
                        >
                          {parseActivityMessage(act)}
                        </button>
                      ) : (
                        <p className="text-sm text-pm-text-muted leading-snug">
                          {parseActivityMessage(act)}
                        </p>
                      )}
                      {timeStr && (
                        <span className="text-[15px] text-pm-text-muted/50 mt-1 inline-block">{timeStr}</span>
                      )}
                    </div>
                    <div className="shrink-0 mt-1">
                      <Icon className="h-5 w-5 text-pm-text-muted/40" />
                    </div>
                  </div>
                );
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

      <TaskDetailSheet />

      <NewTaskSheet
        open={newTaskOpen}
        onOpenChange={setNewTaskOpen}
        userId={userId}
        onCreated={() => {
          fetchTasks(taskPage);
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
