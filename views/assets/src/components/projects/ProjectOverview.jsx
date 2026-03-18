import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { Progress } from "@components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
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
} from "lucide-react";
import { Area, AreaChart, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@components/ui/chart";
import { userInitials, unwrapData, formatPmDate } from "@lib/pm-utils";

export default function ProjectOverview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { __ } = useI18n();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState([]);

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

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 space-y-5">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-3 gap-4">
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
  const progress =
    totalTasks > 0 ? Math.round((completeTasks / totalTasks) * 100) : 0;
  const assignees = project.assignees?.data ?? [];

  const stats = [
    {
      label: __("Task Lists"),
      value: meta.total_task_lists ?? 0,
      icon: ListTodo,
      bg: "bg-indigo-50",
      fg: "text-indigo-500",
      route: "task-lists",
    },
    {
      label: __("Tasks"),
      value: totalTasks,
      icon: ClipboardList,
      bg: "bg-blue-50",
      fg: "text-blue-500",
      route: "task-lists",
    },
    {
      label: __("Completed"),
      value: completeTasks,
      icon: CheckCircle,
      bg: "bg-emerald-50",
      fg: "text-emerald-500",
    },
    {
      label: __("Discussions"),
      value: meta.total_discussion_boards ?? 0,
      icon: MessageSquare,
      bg: "bg-purple-50",
      fg: "text-purple-500",
      route: "discussions",
    },
    {
      label: __("Milestones"),
      value: meta.total_milestones ?? 0,
      icon: Milestone,
      bg: "bg-pink-50",
      fg: "text-pink-500",
      route: "milestones",
    },
    {
      label: __("Files"),
      value: meta.total_files ?? 0,
      icon: FileText,
      bg: "bg-cyan-50",
      fg: "text-cyan-500",
      route: "files",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-pm-text-primary">
            {project.title}
          </h1>
          <p className="text-xs text-pm-text-muted">{__("Project Overview")}</p>
        </div>
      </div>

      {/* Stats grid — clickable cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            className="rounded-xl border bg-card p-4 flex items-center gap-3.5 text-left hover:shadow-md hover:border-border/80 transition-all"
            onClick={() =>
              s.route && navigate(`/projects/${projectId}/${s.route}`)
            }
          >
            <div className={`p-2.5 rounded-xl ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.fg}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-pm-text-primary tabular-nums">
                {s.value}
              </p>
              <p className="text-[11px] text-pm-text-muted font-medium">
                {s.label}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-pm-text-primary">
            {__("Overall Progress")}
          </h3>
          <span className="text-lg font-bold text-pm-accent tabular-nums">
            {progress}%
          </span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex items-center justify-between text-xs text-pm-text-muted">
          <span>
            {completeTasks} {__("completed")}
          </span>
          <span>
            {incompleteTasks} {__("remaining")}
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
            tasks: { label: __("Tasks"), color: "hsl(var(--primary))" },
            activities: { label: __("Activities"), color: "hsl(152 60% 52%)" },
          };

          return (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold text-pm-text-primary mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-pm-text-muted" />
                {__("30-Day Activity")}
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
        <h3 className="text-sm font-semibold text-pm-text-primary mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-pm-text-muted" />
          {__("Team Members")}
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums font-normal">
            {assignees.length}
          </span>
        </h3>
        {assignees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {assignees.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors group"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {userInitials(user.display_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-pm-text-primary truncate">
                    {user.display_name}
                  </p>
                  <p className="text-[11px] text-pm-text-muted truncate">
                    {user.email}
                  </p>
                </div>
                {user.roles?.data?.[0] && (
                  <span className="text-[10px] text-pm-text-muted bg-muted/50 px-2 py-0.5 rounded-full">
                    {user.roles.data[0].title}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-pm-text-muted italic">
            {__("No team members assigned")}
          </p>
        )}
      </div>
    </div>
  );
}
