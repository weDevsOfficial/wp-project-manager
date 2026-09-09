import { __, _n, sprintf } from '@wordpress/i18n';
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@hooks/useApi";
import { useToast } from "@hooks/useToast";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { Progress } from "@components/ui/progress";
import { UserAvatar } from '@components/common/UserAvatar';
import {
  ArrowLeft,
  ClipboardList,
  CheckCircle,
  ListTodo,
  MessageSquare,
  Milestone,
  FileText,
  Activity,
  Users,
  Plus,
  X,
  UserPlus,
  Loader2,
  Trash2,
  ListChecks,
  Pencil,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { useAppDispatch, useAppSelector } from "@store/index";
import { fetchRoles, openEditSheet, invalidateProjectAssignees } from "@store/projectsSlice";
import { invalidateProjectCache } from "@hooks/useCurrentProject";
import { ProjectCreateSheet } from "@components/projects/ProjectCreateSheet";
import CreateUserDialog from "@components/common/CreateUserDialog";
import { Area, AreaChart, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@components/ui/chart";
import { unwrapData, formatPmDate, defaultMemberRoleId } from "@lib/pm-utils";
import { usePermissions } from "@hooks/usePermissions";

export default function ProjectOverview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const toast = useToast();
  const [project, setProject] = useState(null);
  const { isPro, isManager, canManage } = usePermissions(project);
  const canManageMembers = isManager || canManage;
  const dispatch = useAppDispatch();

  const invalidateMemberCaches = useCallback(() => {
    invalidateProjectCache(projectId);
    dispatch(invalidateProjectAssignees(projectId));
  }, [projectId, dispatch]);
  const roles = useAppSelector((s) => s.projects.roles);

  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    if (!projectId) return;
    api.get(`projects/${projectId}/files`, { per_page: 6 })
      .then((res) => setDocuments(res?.data ?? []))
      .catch(() => setDocuments([]));
    api.get(`projects/${projectId}/milestones`, { per_page: 6 })
      .then((res) => setMilestones(res?.data ?? []))
      .catch(() => setMilestones([]));
  }, [projectId]);

  // Member management
  const [memberPopover, setMemberPopover] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState([]);
  const [searchingMembers, setSearchingMembers] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [pendingRoleId, setPendingRoleId] = useState(null);
  const searchTimer = useRef(null);

  useEffect(() => { dispatch(fetchRoles()); }, [dispatch]);

  // Vue 2 fetches: GET projects/{id}?with=overview_graph
  const loadProject = useCallback((showLoader = true) => {
    if (!projectId) return;
    if (showLoader) setLoading(true);
    api
      .get(`projects/${projectId}`, { with: "overview_graph" })
      .then((res) => {
        const proj = res.data;
        setProject(proj);
        // Fractal wraps in { data: [...] } — each item has { date_time, tasks, activities }
        const graphData = proj?.overview_graph?.data ?? [];
        setGraph(graphData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId, api]);

  useEffect(() => { loadProject(); }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch when the edit sheet closes (after saving project changes).
  const editSheetOpen = useAppSelector((s) => s.projects.editSheetOpen);
  const prevEditOpen = useRef(false);
  useEffect(() => {
    if (prevEditOpen.current && !editSheetOpen) loadProject(false);
    prevEditOpen.current = editSheetOpen;
  }, [editSheetOpen, loadProject]);

  const handleMemberSearch = useCallback((value) => {
    setMemberSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (value.trim().length < 2) { setMemberResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      setSearchingMembers(true);
      try {
        const res = await api.get('users/search', { query: value.trim() });
        const existing = new Set((project?.assignees?.data ?? []).map(u => parseInt(u.id)));
        setMemberResults((res.data ?? []).filter(u => !existing.has(parseInt(u.id))));
      } catch { setMemberResults([]); }
      setSearchingMembers(false);
    }, 300);
  }, [api, project]);

  const handleSelectUserForAdd = useCallback((user) => {
    const defaultRoleId = defaultMemberRoleId(roles);
    setPendingUser(user);
    setPendingRoleId(defaultRoleId);
    setMemberSearch('');
    setMemberResults([]);
  }, [roles]);

  const handleConfirmAddMember = useCallback(async () => {
    if (!pendingUser || !pendingRoleId) return;
    const user = pendingUser;
    const newRoleId = pendingRoleId;
    setMemberPopover(false);
    setPendingUser(null);
    setPendingRoleId(null);
    try {
      const existing = project?.assignees?.data ?? [];
      const allAssignees = [
        ...existing.map(u => ({
          user_id: u.id,
          role_id: u.roles?.data?.[0]?.id ?? 2,
        })),
        { user_id: user.id, role_id: newRoleId },
      ];
      await api.post(`projects/${projectId}/update`, {
        title: project.title,
        status: project.status,
        assignees: allAssignees,
      });
      const roleObj = roles.find(r => r.id === newRoleId);
      const userWithRole = {
        ...user,
        roles: { data: roleObj ? [{ id: roleObj.id, title: roleObj.title }] : [] },
      };
      setProject(prev => ({
        ...prev,
        assignees: { data: [...(prev.assignees?.data ?? []), userWithRole] },
      }));
      invalidateMemberCaches();
      toast.success(
        __('Member added', 'wedevs-project-manager'),
        sprintf(/* translators: %s is the name of the user added to the project. */ __('%s was added to the project.', 'wedevs-project-manager'), userWithRole.display_name),
        { user: userWithRole }
      );
    } catch { toast.error(__('Failed to add member', 'wedevs-project-manager')); }
  }, [api, projectId, project, toast, __, pendingUser, pendingRoleId, roles]);

  const handleChangeRole = useCallback(async (userId, newRoleId) => {
    try {
      const allAssignees = (project?.assignees?.data ?? []).map(u => ({
        user_id: u.id,
        role_id: parseInt(u.id) === parseInt(userId)
          ? newRoleId
          : (u.roles?.data?.[0]?.id ?? 2),
      }));
      await api.post(`projects/${projectId}/update`, {
        title: project.title,
        status: project.status,
        assignees: allAssignees,
      });
      const roleObj = roles.find(r => r.id === newRoleId);
      const target = (project?.assignees?.data ?? []).find(u => parseInt(u.id) === parseInt(userId));
      setProject(prev => ({
        ...prev,
        assignees: {
          data: (prev.assignees?.data ?? []).map(u =>
            parseInt(u.id) === parseInt(userId)
              ? { ...u, roles: { data: roleObj ? [{ id: roleObj.id, title: roleObj.title }] : [] } }
              : u
          ),
        },
      }));
      invalidateMemberCaches();
      toast.success(
        __('Role updated', 'wedevs-project-manager'),
        target && roleObj
          ? sprintf(/* translators: %1$s is the user name, %2$s is their new role. */ __('%1$s is now %2$s.', 'wedevs-project-manager'), target.display_name, roleObj.title)
          : undefined,
        target ? { user: target } : undefined
      );
    } catch { toast.error(__('Failed to update role', 'wedevs-project-manager')); }
  }, [api, projectId, project, toast, __, roles]);

  const handleRemoveMember = useCallback(async (userId) => {
    try {
      const target = (project?.assignees?.data ?? []).find(u => parseInt(u.id) === parseInt(userId));
      const remaining = (project?.assignees?.data ?? []).filter(u => parseInt(u.id) !== parseInt(userId));
      const allAssignees = remaining.map(u => ({
        user_id: u.id,
        role_id: u.roles?.data?.[0]?.id ?? 2,
      }));
      await api.post(`projects/${projectId}/update`, {
        title: project.title,
        status: project.status,
        assignees: allAssignees,
      });
      setProject(prev => ({
        ...prev,
        assignees: { data: (prev.assignees?.data ?? []).filter(u => parseInt(u.id) !== parseInt(userId)) },
      }));
      invalidateMemberCaches();
      toast.success(
        __('Member removed', 'wedevs-project-manager'),
        target ? sprintf(/* translators: %s is the name of the user removed from the project. */ __('%s was removed from the project.', 'wedevs-project-manager'), target.display_name) : undefined,
        target ? { user: target } : undefined
      );
    } catch { toast.error(__('Failed to remove member', 'wedevs-project-manager')); }
  }, [api, projectId, project, toast, __]);

  useEffect(() => { return () => { if (searchTimer.current) clearTimeout(searchTimer.current); }; }, []);

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6 space-y-5">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-40 rounded-lg" />
      </div>
    );
  }

  if (!project) return null;

  const meta = unwrapData(project.meta) || {};
  const totalTasks = meta.total_tasks ?? 0;
  const completeTasks = meta.total_complete_tasks ?? 0;
  const incompleteTasks = meta.total_incomplete_tasks ?? 0;
  const totalSubtasks = meta.total_subtasks ?? 0;
  const progress =
    totalTasks > 0 ? Math.round((completeTasks / totalTasks) * 100) : 0;
  const assignees = project.assignees?.data ?? [];

  const stats = [
    {
      label: __("Task Lists", 'wedevs-project-manager'),
      value: meta.total_task_lists ?? 0,
      icon: ListTodo,
      bg: "bg-indigo-50",
      fg: "text-indigo-500",
      route: "task-lists",
    },
    {
      label: __("Tasks", 'wedevs-project-manager'),
      value: totalTasks,
      icon: ClipboardList,
      bg: "bg-blue-50",
      fg: "text-blue-500",
      route: "task-lists",
    },
    ...(isPro ? [{
      label: __("Subtasks", 'wedevs-project-manager'),
      value: totalSubtasks,
      icon: ListChecks,
      bg: "bg-amber-50",
      fg: "text-amber-500",
      route: "task-lists",
    }] : []),
    {
      label: __("Completed", 'wedevs-project-manager'),
      value: completeTasks,
      icon: CheckCircle,
      bg: "bg-emerald-50",
      fg: "text-emerald-500",
    },
    {
      label: __("Discussions", 'wedevs-project-manager'),
      value: meta.total_discussion_boards ?? 0,
      icon: MessageSquare,
      bg: "bg-purple-50",
      fg: "text-purple-500",
      route: "discussions",
    },
    {
      label: __("Milestones", 'wedevs-project-manager'),
      value: meta.total_milestones ?? 0,
      icon: Milestone,
      bg: "bg-pink-50",
      fg: "text-pink-500",
      route: "milestones",
    },
    {
      label: __("Files", 'wedevs-project-manager'),
      value: meta.total_files ?? 0,
      icon: FileText,
      bg: "bg-cyan-50",
      fg: "text-cyan-500",
      route: "files",
    },
  ];

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-pm-text-primary truncate">{__("Projects", 'wedevs-project-manager')}</h1>
        </div>
        {canManageMembers && (
          <Button size="sm" className="h-11 px-5 gap-1.5 shrink-0" onClick={() => dispatch(openEditSheet(project))}>
            <Pencil className="h-4 w-4" />{__("Edit", 'wedevs-project-manager')}
          </Button>
        )}
      </div>

      {/* Project header card */}
      {(() => {
        const st = project.status;
        const pill = st === "complete"
          ? { label: __("Completed", 'wedevs-project-manager'), cls: "bg-emerald-100 text-emerald-700" }
          : st === "archived"
            ? { label: __("Archived", 'wedevs-project-manager'), cls: "bg-muted text-pm-text-muted" }
            : { label: __("Active", 'wedevs-project-manager'), cls: "bg-blue-100 text-blue-700" };
        return (
          <div className="rounded-xl border bg-card p-4 flex flex-wrap items-center gap-4">
            <div
              className={cn("h-14 w-14 rounded-lg flex items-center justify-center shrink-0", !project.color_code && "bg-pm-accent/10")}
              style={project.color_code ? { backgroundColor: `${project.color_code}1a` } : undefined}
            >
              <ClipboardList
                className={cn("h-7 w-7", !project.color_code && "text-pm-accent")}
                style={project.color_code ? { color: project.color_code } : undefined}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-pm-text-primary truncate">{project.title}</h2>
                <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[12px] font-medium", pill.cls)}>
                  <CheckCircle className="h-4 w-4" />{pill.label}
                </span>
              </div>
              <div className="flex items-center gap-4 flex-wrap mt-2 text-[13px] text-pm-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  {formatPmDate(project.created_at, { month: "short", day: "numeric", year: "numeric" }) || "—"}
                  {project.est_completion_date ? ` – ${formatPmDate(project.est_completion_date, { month: "short", day: "numeric", year: "numeric" })}` : ""}
                </span>
                {assignees.length > 0 && (
                  <span className="inline-flex items-center gap-2">
                    <span className="flex items-center -space-x-2">
                      {assignees.slice(0, 5).map((u) => (
                        <UserAvatar key={u.id} user={u} size="sm" className="border-2 border-card" title={u.display_name} />
                      ))}
                      {assignees.length > 5 && (
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-md border-2 border-card bg-muted text-[11px] font-medium text-pm-text-muted">
                          +{assignees.length - 5}
                        </span>
                      )}
                    </span>
                    <span>{sprintf(/* translators: %d is the number of project members. */ _n('%d member', '%d members', assignees.length, 'wedevs-project-manager'), assignees.length)}</span>
                  </span>
                )}
          {canManageMembers && (
          <Popover
            open={memberPopover}
            onOpenChange={(open) => {
              setMemberPopover(open);
              if (!open) {
                setPendingUser(null);
                setPendingRoleId(null);
                setMemberSearch('');
                setMemberResults([]);
              }
            }}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                title={__("Add member", 'wedevs-project-manager')}
                className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-dashed border-pm-border text-pm-text-muted hover:text-pm-accent hover:border-pm-accent transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              {!pendingUser ? (
                <Command shouldFilter={false}>
                  <CommandInput placeholder={__("Search users...", 'wedevs-project-manager')} value={memberSearch} onValueChange={handleMemberSearch} />
                  <CommandList>
                    {searchingMembers && (
                      <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{__("Searching...", 'wedevs-project-manager')}
                      </div>
                    )}
                    {!searchingMembers && memberSearch.trim().length >= 2 && memberResults.length === 0 && (
                      <div className="px-3 py-4 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {__("No user found named", 'wedevs-project-manager')}{' '}
                          <span className="font-medium text-pm-text-primary">&quot;{memberSearch}&quot;</span>
                        </p>
                        <Button className="h-11 px-5"
                          type="button"
                          size="sm"
                          onClick={() => { setMemberPopover(false); setCreateUserOpen(true); }}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />{__("Create User", 'wedevs-project-manager')}
                        </Button>
                      </div>
                    )}
                    {memberResults.length > 0 && (
                      <CommandGroup>
                        {memberResults.map(u => (
                          <CommandItem key={u.id} value={String(u.id)} onSelect={() => handleSelectUserForAdd(u)} className="cursor-pointer">
                            <UserAvatar user={u} size="md" className="mr-2" />
                            <span className="text-sm truncate flex-1">{u.display_name}</span>
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              ) : (
                <div className="p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <UserAvatar user={pendingUser} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{pendingUser.display_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{pendingUser.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">{__("Role", 'wedevs-project-manager')}</label>
                    <Select
                      value={pendingRoleId ? String(pendingRoleId) : ''}
                      onValueChange={(val) => setPendingRoleId(Number(val))}
                    >
                      <SelectTrigger className="h-11 text-sm">
                        <SelectValue placeholder={__("Select role", 'wedevs-project-manager')} />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={String(role.id)}>
                            {role.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button className="h-11 px-5" variant="ghost" size="sm" onClick={() => { setPendingUser(null); setPendingRoleId(null); }}>
                      {__("Back", 'wedevs-project-manager')}
                    </Button>
                    <Button className="h-11 px-5" size="sm" onClick={handleConfirmAddMember} disabled={!pendingRoleId}>
                      {__("Add", 'wedevs-project-manager')}
                    </Button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          )}
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] text-pm-text-muted">
                  {sprintf(/* translators: %1$d is the number of completed tasks, %2$d is the total. */ __('Project progress · %1$d of %2$d tasks done', 'wedevs-project-manager'), completeTasks, totalTasks)}
                </span>
                <span className="text-sm font-semibold text-pm-text-primary">{progress}%</span>
              </div>
              <Progress
                value={progress}
                className="h-1.5 bg-muted"
                indicatorStyle={project.color_code ? { backgroundColor: project.color_code } : undefined}
              />
            </div>
          </div>
        );
      })()}

      {/* Stats grid — clickable cards */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            className="flex-1 min-w-[120px] rounded-xl border bg-card px-3 py-3 flex items-center gap-3 hover:border-border/80 transition-all"
            onClick={() =>
              s.route && navigate(`/projects/${projectId}/${s.route}`)
            }
          >
            <div className={`p-2 rounded-lg ${s.bg} shrink-0`}>
              <s.icon className={`h-4 w-4 ${s.fg}`} />
            </div>
            <div className="text-left min-w-0">
              <p className="text-lg font-bold text-pm-text-primary tabular-nums leading-none">{s.value}</p>
              <p className="text-[13px] text-pm-text-muted font-medium mt-0.5">{s.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Progress Over Time + Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Progress Over Time */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-medium text-pm-text-primary mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-pm-text-muted" />
            {__("Progress Over Time", 'wedevs-project-manager')}
          </h3>
          {graph.length > 0 ? (
            (() => {
              const chartData = graph.map((day) => ({
                date: day.date_time?.date || "",
                label: formatPmDate(day.date_time, { month: "short", day: "numeric" }),
                tasks: day.tasks || 0,
                activities: day.activities || 0,
              }));
              const chartConfig = {
                tasks: { label: __("Tasks", 'wedevs-project-manager'), color: "hsl(var(--primary))" },
                activities: { label: __("Activities", 'wedevs-project-manager'), color: "hsl(152 60% 52%)" },
              };
              return (
                <ChartContainer config={chartConfig} className="h-[220px] w-full">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-tasks)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-tasks)" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="fillActivities" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-activities)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-activities)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                      interval={Math.floor(chartData.length / 5)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area dataKey="activities" type="monotone" fill="url(#fillActivities)" stroke="var(--color-activities)" strokeWidth={2} stackId="a" />
                    <Area dataKey="tasks" type="monotone" fill="url(#fillTasks)" stroke="var(--color-tasks)" strokeWidth={2} stackId="a" />
                  </AreaChart>
                </ChartContainer>
              );
            })()
          ) : (
            <p className="text-sm text-pm-text-muted py-16 text-center">{__("No activity data yet", 'wedevs-project-manager')}</p>
          )}
        </div>

        {/* Recent Documents */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-pm-text-primary flex items-center gap-2">
              <FileText className="h-4 w-4 text-pm-text-muted" />
              {__("Recent Documents", 'wedevs-project-manager')}
            </h3>
            <button type="button" onClick={() => navigate(`/projects/${projectId}/files`)} className="text-[13px] font-medium text-pm-accent hover:underline">
              {__("Show All", 'wedevs-project-manager')}
            </button>
          </div>
          {documents.length > 0 ? (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="h-10 text-[12px] font-normal uppercase leading-[1.4] tracking-normal text-[#828282] border-b border-border bg-card">
                    <th className="text-left font-normal py-2 px-2">{__("Document", 'wedevs-project-manager')}</th>
                    <th className="text-left font-normal py-2 px-2">{__("Type", 'wedevs-project-manager')}</th>
                    <th className="text-left font-normal py-2 px-2">{__("Date", 'wedevs-project-manager')}</th>
                    <th className="text-left font-normal py-2 px-2">{__("Created by", 'wedevs-project-manager')}</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((f) => {
                    const name = f.meta?.title || f.name || f.title || __("File", 'wedevs-project-manager');
                    const ext = f.file_extension ? String(f.file_extension).toUpperCase() : (f.type === "image" ? __("Image", 'wedevs-project-manager') : __("File", 'wedevs-project-manager'));
                    const creator = f.creator?.data;
                    return (
                      <tr key={f.id} className="border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors">
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-pm-text-muted shrink-0" />
                            <span className="truncate text-pm-text-primary">{name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-[12px] font-medium text-pm-text-muted uppercase">{ext}</span>
                        </td>
                        <td className="py-2.5 px-2 text-[13px] text-pm-text-muted tabular-nums whitespace-nowrap">
                          {formatPmDate(f.attached_at, { month: "short", day: "numeric", year: "numeric" }) || "—"}
                        </td>
                        <td className="py-2.5 px-2">
                          {creator ? (
                            <span className="inline-flex items-center gap-1.5 min-w-0">
                              <UserAvatar user={creator} size="sm" />
                              <span className="truncate text-[13px] text-pm-text-primary">{creator.display_name}</span>
                            </span>
                          ) : <span className="text-[13px] text-pm-text-muted">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-pm-text-muted py-8 text-center">{__("No documents yet", 'wedevs-project-manager')}</p>
          )}
        </div>
      </div>

      {/* Milestones */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-pm-text-primary flex items-center gap-2">
            <Milestone className="h-4 w-4 text-pm-text-muted" />
            {__("Milestones", 'wedevs-project-manager')}
          </h3>
          <button type="button" onClick={() => navigate(`/projects/${projectId}/milestones`)} className="text-[13px] font-medium text-pm-accent hover:underline">
            {__("Show All", 'wedevs-project-manager')}
          </button>
        </div>
        {milestones.length > 0 ? (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="h-10 text-[12px] font-normal uppercase leading-[1.4] tracking-normal text-[#828282] border-b border-border bg-card">
                  <th className="text-left font-medium py-2 px-2 w-10">{__("No", 'wedevs-project-manager')}</th>
                  <th className="text-left font-normal py-2 px-2">{__("Milestone", 'wedevs-project-manager')}</th>
                  <th className="text-left font-normal py-2 px-2">{__("Planned Date", 'wedevs-project-manager')}</th>
                  <th className="text-left font-normal py-2 px-2">{__("Tasks", 'wedevs-project-manager')}</th>
                  <th className="text-left font-normal py-2 px-2">{__("Status", 'wedevs-project-manager')}</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((m, i) => {
                  const done = m.status === 1 || m.status === "1" || m.status === "complete";
                  return (
                    <tr key={m.id} className="border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 px-2 text-[13px] text-pm-text-muted tabular-nums">{i + 1}</td>
                      <td className="py-2.5 px-2 text-pm-text-primary truncate max-w-[220px]">{m.title}</td>
                      <td className="py-2.5 px-2 text-[13px] text-pm-text-muted tabular-nums whitespace-nowrap">
                        {formatPmDate(m.achieve_date, { month: "short", day: "numeric", year: "numeric" }) || "—"}
                      </td>
                      <td className="py-2.5 px-2 text-[13px] text-pm-text-muted tabular-nums whitespace-nowrap">
                        {(m.task_count?.completed ?? 0)}/{(m.task_count?.total ?? 0)}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-medium", done ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                          {done ? __("Complete", 'wedevs-project-manager') : __("Pending", 'wedevs-project-manager')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-pm-text-muted py-8 text-center">{__("No milestones yet", 'wedevs-project-manager')}</p>
        )}
      </div>

      {/* Members */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-pm-text-primary flex items-center gap-2">
            <Users className="h-4 w-4 text-pm-text-muted" />
            {__("Team Members", 'wedevs-project-manager')}
            <span className="text-[12px] bg-muted px-1.5 py-0.5 rounded-md tabular-nums font-medium text-pm-text-muted">
              {assignees.length}
            </span>
          </h3>

        </div>
        {assignees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {assignees.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors group"
              >
                <UserAvatar user={user} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-pm-text-primary truncate">
                    {user.display_name}
                  </p>
                  <p className="text-[13px] text-pm-text-muted truncate">
                    {user.email}
                  </p>
                </div>
                {canManageMembers && roles.length > 0 ? (
                  <Select
                    value={String(user.roles?.data?.[0]?.id ?? '')}
                    onValueChange={(val) => handleChangeRole(user.id, Number(val))}
                  >
                    <SelectTrigger className="h-7 w-32 text-xs">
                      <SelectValue placeholder={__("Role", 'wedevs-project-manager')} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={String(role.id)}>
                          {role.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  user.roles?.data?.[0] && (
                    <span className="text-[13px] text-pm-text-muted bg-muted/50 px-2 py-0.5 rounded-md">
                      {user.roles.data[0].title}
                    </span>
                  )
                )}
                {canManageMembers && (
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-pm-text-muted hover:text-destructive shrink-0"
                    onClick={() => handleRemoveMember(user.id)}
                    title={sprintf(/* translators: %s is the member's name. */ __("Remove %s", 'wedevs-project-manager'), user.display_name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-pm-text-muted italic">
            {__("No team members assigned", 'wedevs-project-manager')}
          </p>
        )}
      </div>

      <CreateUserDialog
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        defaultSeed={memberSearch}
        onCreated={(created) => {
          setMemberSearch('');
          setMemberResults([]);
          setMemberPopover(true);
          handleSelectUserForAdd(created);
        }}
      />

      <ProjectCreateSheet />
    </div>
  );
}

