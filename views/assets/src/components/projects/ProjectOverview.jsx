import { __ } from '@wordpress/i18n';
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
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  Command,
  CommandEmpty,
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
import { fetchRoles } from "@store/projectsSlice";
import { Area, AreaChart, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@components/ui/chart";
import { unwrapData, formatPmDate } from "@lib/pm-utils";
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
  const roles = useAppSelector((s) => s.projects.roles);

  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState([]);

  // Member management
  const [memberPopover, setMemberPopover] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState([]);
  const [searchingMembers, setSearchingMembers] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [pendingRoleId, setPendingRoleId] = useState(null);
  const searchTimer = useRef(null);

  useEffect(() => { dispatch(fetchRoles()); }, [dispatch]);

  // Vue 2 fetches: GET projects/{id}?with=overview_graph
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
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
  }, [projectId]);

  const handleMemberSearch = useCallback((value) => {
    setMemberSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (value.trim().length < 2) { setMemberResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      setSearchingMembers(true);
      try {
        const res = await api.get('users', { search: value.trim() });
        const existing = new Set((project?.assignees?.data ?? []).map(u => u.id));
        setMemberResults((res.data ?? []).filter(u => !existing.has(u.id)));
      } catch { setMemberResults([]); }
      setSearchingMembers(false);
    }, 300);
  }, [api, project]);

  const handleSelectUserForAdd = useCallback((user) => {
    const defaultRoleId = roles.length > 0 ? roles[0].id : 2;
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
      toast.success(__('Member added', 'wedevs-project-manager'));
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
      toast.success(__('Role updated', 'wedevs-project-manager'));
    } catch { toast.error(__('Failed to update role', 'wedevs-project-manager')); }
  }, [api, projectId, project, toast, __, roles]);

  const handleRemoveMember = useCallback(async (userId) => {
    try {
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
      toast.success(__('Member removed', 'wedevs-project-manager'));
    } catch { toast.error(__('Failed to remove member', 'wedevs-project-manager')); }
  }, [api, projectId, project, toast, __]);

  useEffect(() => { return () => { if (searchTimer.current) clearTimeout(searchTimer.current); }; }, []);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-40 rounded-xl" />
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
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-pm-text-primary">
            {project.title}
          </h1>
          <p className="text-sm text-pm-text-muted">{__("Project Overview", 'wedevs-project-manager')}</p>
        </div>
      </div>

      {/* Stats grid — clickable cards */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            className="flex-1 min-w-[120px] rounded-xl border bg-pm-surface px-3 py-3 flex items-center gap-3 hover:shadow-md hover:border-border/80 transition-all"
            onClick={() =>
              s.route && navigate(`/projects/${projectId}/${s.route}`)
            }
          >
            <div className={`p-2 rounded-lg ${s.bg} shrink-0`}>
              <s.icon className={`h-5 w-5 ${s.fg}`} />
            </div>
            <div className="text-left min-w-0">
              <p className="text-lg font-bold text-pm-text-primary tabular-nums leading-none">{s.value}</p>
              <p className="text-[13px] text-pm-text-muted font-medium mt-0.5">{s.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-pm-text-primary">
            {__("Overall Progress", 'wedevs-project-manager')}
          </h3>
          <span className="text-lg font-bold text-pm-accent tabular-nums">
            {progress}%
          </span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex items-center justify-between text-sm text-pm-text-muted">
          <span>
            {completeTasks} {__("completed", 'wedevs-project-manager')}
          </span>
          <span>
            {incompleteTasks} {__("remaining", 'wedevs-project-manager')}
          </span>
        </div>
      </div>

      {/* 30-Day Activity Chart — shadcn/Recharts */}
      {graph.length > 0 &&
        (() => {
          const chartData = graph.map((day) => ({
            date: day.date_time?.date || "",
            label: formatPmDate(day.date_time),
            tasks: day.tasks || 0,
            activities: day.activities || 0,
          }));

          const chartConfig = {
            tasks: { label: __("Tasks", 'wedevs-project-manager'), color: "hsl(var(--primary))" },
            activities: { label: __("Activities", 'wedevs-project-manager'), color: "hsl(152 60% 52%)" },
          };

          return (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold text-pm-text-primary mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-pm-text-muted" />
                {__("30-Day Activity", 'wedevs-project-manager')}
              </h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-tasks)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-tasks)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="fillActivities"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-activities)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-activities)"
                        stopOpacity={0.1}
                      />
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
                  <Area
                    dataKey="activities"
                    type="monotone"
                    fill="url(#fillActivities)"
                    stroke="var(--color-activities)"
                    strokeWidth={2}
                    stackId="a"
                  />
                  <Area
                    dataKey="tasks"
                    type="monotone"
                    fill="url(#fillTasks)"
                    stroke="var(--color-tasks)"
                    strokeWidth={2}
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          );
        })()}

      {/* Members */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-pm-text-primary flex items-center gap-2">
            <Users className="h-5 w-5 text-pm-text-muted" />
            {__("Team Members", 'wedevs-project-manager')}
            <span className="text-[14px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums font-normal">
              {assignees.length}
            </span>
          </h3>
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
              <Button variant="outline" size="sm" className="h-7 text-sm gap-1.5">
                <UserPlus className="h-3.5 w-3.5" />
                {__("Add", 'wedevs-project-manager')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
              {!pendingUser ? (
                <Command shouldFilter={false}>
                  <CommandInput placeholder={__("Search users...", 'wedevs-project-manager')} value={memberSearch} onValueChange={handleMemberSearch} />
                  <CommandList>
                    {searchingMembers && (
                      <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{__("Searching...", 'wedevs-project-manager')}
                      </div>
                    )}
                    {!searchingMembers && memberSearch.trim().length >= 2 && memberResults.length === 0 && (
                      <CommandEmpty>{__("No users found", 'wedevs-project-manager')}</CommandEmpty>
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
                      <SelectTrigger className="h-8 text-sm">
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
                    <Button variant="ghost" size="sm" onClick={() => { setPendingUser(null); setPendingRoleId(null); }}>
                      {__("Back", 'wedevs-project-manager')}
                    </Button>
                    <Button size="sm" onClick={handleConfirmAddMember} disabled={!pendingRoleId}>
                      {__("Add", 'wedevs-project-manager')}
                    </Button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          )}
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
                  <p className="text-[15px] text-pm-text-muted truncate">
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
                    <span className="text-[13px] text-pm-text-muted bg-muted/50 px-2 py-0.5 rounded-full">
                      {user.roles.data[0].title}
                    </span>
                  )
                )}
                {canManageMembers && (
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-pm-text-muted hover:text-destructive shrink-0"
                    onClick={() => handleRemoveMember(user.id)}
                    title={__("Remove", 'wedevs-project-manager')}
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
    </div>
  );
}
