import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  fetchProjects,
  toggleFavourite,
  deleteProject,
  toggleProjectStatus,
  fetchCategories,
  fetchRoles,
  setStatus,
  setPage,
  setCategory,
  setOrderBy,
  setViewMode,
  setCreateSheetOpen,
  openEditSheet,
} from "@store/projectsSlice";
import { cn } from "@lib/utils";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { usePermissions } from "@hooks/usePermissions";
import { useProModal } from "@components/common/ProUpgradeModal";

import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { Progress } from "@components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";

import {
  Plus,
  LayoutGrid,
  List,
  Star,
  MoreHorizontal,
  Trash2,
  Copy,
  Crown,
  CheckCircle,
  Undo2,
  FolderKanban,
  ListTodo,
  MessageSquare,
  Milestone,
  FileText,
  Activity,
  ClipboardList,
  Sparkles,
  Pencil,
  Settings,
  Search,
} from "lucide-react";

import AiCreateDialog from "./AiCreateDialog";

import { ProjectCreateSheet } from "./ProjectCreateSheet";

import { unwrapData, formatPmDate } from "@lib/pm-utils";

// ── Helpers ──────────────────────────────────────────────

function getMeta(p) {
  return unwrapData(p.meta);
}

function projectProgress(p) {
  const meta = getMeta(p);
  const total = meta?.total_tasks ?? 0;
  const complete = meta?.total_complete_tasks ?? 0;
  if (total === 0) return 0;
  return Math.round((complete / total) * 100);
}

function isComplete(p) {
  return p.status === "complete" || p.status === "1" || p.status === 1;
}

function statusColor(p) {
  if (isComplete(p)) return '#10b981' // emerald-500
  if (p.status === 'archived' || p.status === '2' || p.status === 2) return '#6b7280' // gray-500
  if (p.status === 'pending' || p.status === '3' || p.status === 3) return '#f59e0b' // amber-500
  return '#6366f1' // indigo-500 (active/incomplete)
}

function statusLabel(p) {
  if (isComplete(p)) return 'Completed'
  if (p.status === 'archived' || p.status === '2' || p.status === 2) return 'Archived'
  if (p.status === 'pending' || p.status === '3' || p.status === 3) return 'Pending'
  return 'Active'
}

function userInitials(name) {
  return name
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function getDescriptionSnippet(project) {
  const desc = project.description;
  if (!desc || typeof desc === "string") return "";
  // Prefer content (raw), fall back to html — strip tags for plain text display
  const raw = desc.content || desc.html || "";
  return raw ? stripHtml(raw).trim() : "";
}

// ── Filter tabs definition ──────────────────────────────

const FILTER_TABS = [
  { key: "incomplete", label: "Active", countKey: "total_incomplete", color: "#6366f1" },
  { key: "complete", label: "Completed", countKey: "total_complete", color: "#10b981" },
  { key: "favourite", label: "Favourite", countKey: "total_favourite", color: "#f59e0b" },
  { key: "all", label: "All", color: "#6b7280" },
];

// ── Component ────────────────────────────────────────────

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { __ } = useI18n();
  const toast = useToast();
  const { canCreate, isPro } = usePermissions();
  const { setOpen: setProModalOpen } = useProModal();

  const {
    projects,
    loading,
    currentPage,
    totalPages,
    total,
    activeFilter,
    categoryId,
    orderBy,
    viewMode,
    projectsMeta,
    categories,
  } = useAppSelector((s) => s.projects);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimerRef = React.useRef(null);

  // ── Initial load ────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchProjects(undefined));
    dispatch(fetchCategories());
    dispatch(fetchRoles());
  }, [dispatch]);

  // ── Callbacks ───────────────────────────────────────────

  const handleFilterChange = useCallback(
    (key) => {
      dispatch(setStatus(key));
      // Pass page: 1 explicitly since setStatus resets currentPage
      const status = key === "all" ? undefined : key;
      dispatch(fetchProjects({ page: 1, status }));
    },
    [dispatch],
  );

  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      dispatch(fetchProjects({ page: 1, title: value || undefined }));
    }, 400);
  }, [dispatch]);

  const handleCategoryChange = useCallback(
    (value) => {
      const catId = value === "__all__" ? undefined : Number(value);
      dispatch(setCategory(catId));
      dispatch(fetchProjects({ page: 1 }));
    },
    [dispatch],
  );

  const handleSortChange = useCallback(
    (value) => {
      dispatch(setOrderBy(value));
      dispatch(fetchProjects({ page: 1, orderby: value }));
    },
    [dispatch],
  );

  const handleToggleFavourite = useCallback(
    (projectId) => {
      dispatch(toggleFavourite(projectId));
    },
    [dispatch],
  );

  const handleToggleStatus = useCallback(
    async (projectId) => {
      try {
        await dispatch(toggleProjectStatus(projectId)).unwrap();
        toast.success(__("Project status updated"));
      } catch {
        toast.error(__("Failed to update project status"));
      }
    },
    [dispatch, toast, __],
  );

  const confirmDelete = useCallback((project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!projectToDelete) return;
    try {
      await dispatch(deleteProject(projectToDelete.id)).unwrap();
      toast.success(__("Project deleted"));
    } catch {
      toast.error(__("Failed to delete project"));
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  }, [dispatch, projectToDelete, toast, __]);

  const handleDuplicate = useCallback(async (project) => {
    if (!isPro) {
      setProModalOpen(true)
      return
    }
    try {
      const baseUrl = typeof PM_Vars !== 'undefined' ? PM_Vars.api_base_url : '/wp-json/'
      const res = await fetch(`${baseUrl}pm-pro/v2/duplicate/project/${project.id}`, {
        method: 'POST',
        headers: {
          'X-WP-Nonce': typeof PM_Vars !== 'undefined' ? PM_Vars.permission : '',
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(__('Project duplicated'))
      dispatch(fetchProjects({ status: activeFilter === 'all' ? '' : activeFilter }))
    } catch {
      toast.error(__('Failed to duplicate project'))
    }
  }, [dispatch, isPro, activeFilter, setProModalOpen, toast, __])

  const handleViewModeChange = useCallback(
    (mode) => {
      dispatch(setViewMode(mode));
    },
    [dispatch],
  );

  // ── Derived values ─────────────────────────────────────

  const totalCount = useMemo(
    () => projectsMeta.total_incomplete + projectsMeta.total_complete,
    [projectsMeta],
  );

  // ── Render helpers ─────────────────────────────────────

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-8 w-8 rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FolderKanban className="h-16 w-16 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-medium text-pm-text-primary mb-1">
        {__("No projects found")}
      </h3>
      <p className="text-sm text-pm-text-muted mb-4">
        {__("Get started by creating a new project.")}
      </p>
      {canCreate && (
        <Button onClick={() => dispatch(setCreateSheetOpen(true))}>
          <Plus className="h-4 w-4 mr-2" />
          {__("New Project")}
        </Button>
      )}
    </div>
  );

  const renderMetaCounters = (project) => {
    const meta = getMeta(project);
    if (!meta) return null;

    const pid = project.id;
    const items = [
      { icon: ClipboardList, label: __("Tasks"), value: meta.total_tasks, route: `/projects/${pid}/task-lists` },
      { icon: MessageSquare, label: __("Discussions"), value: meta.total_discussion_boards, route: `/projects/${pid}/discussions` },
      { icon: ListTodo, label: __("Task Lists"), value: meta.total_task_lists, route: `/projects/${pid}/task-lists` },
      { icon: FileText, label: __("Files"), value: meta.total_files, route: `/projects/${pid}/files` },
      { icon: Milestone, label: __("Milestones"), value: meta.total_milestones, route: `/projects/${pid}/milestones` },
      { icon: Activity, label: __("Comments"), value: meta.total_comments, route: `/projects/${pid}/task-lists` },
    ];

    return (
      <TooltipProvider delayDuration={200}>
        <div className="flex items-center gap-3 text-pm-text-muted">
          {items.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs hover:text-pm-accent transition-colors"
                  onClick={(e) => { e.stopPropagation(); navigate(item.route) }}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.value ?? 0}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{item.value ?? 0} {item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    );
  };

  const renderAssignees = (project) => {
    const users = project.assignees?.data ?? [];
    const visible = users.slice(0, 6);
    const overflow = users.length - 6;

    return (
      <div className="flex items-center -space-x-2">
        {visible.map((user) => (
          <Avatar key={user.id} className="h-7 w-7 border-2 border-background">
            <AvatarImage src={user.avatar_url} alt={user.display_name} />
            <AvatarFallback className="text-[10px]">
              {userInitials(user.display_name)}
            </AvatarFallback>
          </Avatar>
        ))}
        {overflow > 0 && (
          <Avatar className="h-7 w-7 border-2 border-background">
            <AvatarFallback className="text-[10px] bg-muted">
              +{overflow}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  const renderProjectDropdown = (project) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-pm-text-primary">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => dispatch(openEditSheet(project))}>
          <Pencil className="h-4 w-4 mr-2" />
          {__("Edit")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleStatus(project.id)}>
          {isComplete(project) ? (
            <>
              <Undo2 className="h-4 w-4 mr-2" />
              {__("Restore")}
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              {__("Complete")}
            </>
          )}
        </DropdownMenuItem>
        {isPro && (
          <DropdownMenuItem onClick={() => navigate(`/projects/${project.id}/settings`)}>
            <Settings className="h-4 w-4 mr-2" />
            {__("Settings")}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleDuplicate(project)}>
          <Copy className="h-4 w-4 mr-2" />
          {__("Duplicate")}
          {!isPro && <Crown className="h-3 w-3 ml-auto text-amber-500" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => confirmDelete(project)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {__("Delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ── Grid view ──────────────────────────────────────────

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => {
        const progress = projectProgress(project);
        const projectColor = project.color_code || statusColor(project);

        return (
          <div
            key={project.id}
            className="group relative rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-border/80 transition-all duration-200"
          >
            {/* Left accent strip */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
              style={{ backgroundColor: projectColor }}
            />

            <div className="pl-5 pr-4 py-4 space-y-3">
              {/* Header: status dot + title + actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full shrink-0 ring-2 ring-background"
                    style={{ backgroundColor: projectColor }}
                  />
                  <h3
                    className="font-semibold text-sm text-pm-text-primary line-clamp-1 cursor-pointer hover:text-pm-accent transition-colors"
                    onClick={() =>
                      navigate(`/projects/${project.id}/task-lists`)
                    }
                  >
                    {project.title}
                  </h3>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7 transition-opacity",
                      !project.favourite && "opacity-0 group-hover:opacity-100",
                    )}
                    onClick={() => handleToggleFavourite(project.id)}
                  >
                    <Star
                      className={cn(
                        "h-3.5 w-3.5",
                        project.favourite
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground",
                      )}
                    />
                  </Button>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {renderProjectDropdown(project)}
                  </div>
                </div>
              </div>

              {/* Description snippet */}
              {getDescriptionSnippet(project) && (
                <p className="text-xs text-pm-text-muted line-clamp-2 leading-relaxed">
                  {getDescriptionSnippet(project)}
                </p>
              )}

              {/* Meta counters */}
              {renderMetaCounters(project)}

              {/* Progress bar + task breakdown */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <Progress value={progress} className="h-1 flex-1" />
                  <span className="text-[11px] font-medium text-pm-text-muted tabular-nums w-7 text-right">
                    {progress}%
                  </span>
                </div>
                {getMeta(project) && (
                  <p className="text-[10px] text-pm-text-muted">
                    {getMeta(project).total_complete_tasks ?? 0} {__("done")} / {getMeta(project).total_tasks ?? 0} {__("total")}
                  </p>
                )}
              </div>

              {/* Footer: assignees + created date + status */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  {renderAssignees(project)}
                  {project.created_at && (
                    <span className="text-[10px] text-pm-text-muted">
                      {formatPmDate(project.created_at)}
                    </span>
                  )}
                </div>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: statusColor(project) + '12', color: statusColor(project) }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: statusColor(project) }}
                  />
                  {__(statusLabel(project))}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── List view ──────────────────────────────────────────

  const renderListView = () => (
    <div className="rounded-xl border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70">
              {__("Project")}
            </th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70">
              {__("Status")}
            </th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70 w-36">
              {__("Progress")}
            </th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70">
              {__("Details")}
            </th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70">
              {__("Members")}
            </th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70">
              {__("Created")}
            </th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70 w-10">
              {__("Action")}
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const progress = projectProgress(project);
            const projectColor = project.color_code || statusColor(project);

            return (
              <tr
                key={project.id}
                className="group border-b last:border-b-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 rounded-full shrink-0 ring-2 ring-background"
                      style={{ backgroundColor: projectColor }}
                    />
                    <span
                      className="font-medium text-pm-text-primary line-clamp-1 cursor-pointer hover:text-pm-accent transition-colors"
                      onClick={() =>
                        navigate(`/projects/${project.id}/task-lists`)
                      }
                    >
                      {project.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6 shrink-0 transition-opacity",
                        !project.favourite &&
                          "opacity-0 group-hover:opacity-100",
                      )}
                      onClick={() => handleToggleFavourite(project.id)}
                    >
                      <Star
                        className={cn(
                          "h-3.5 w-3.5",
                          project.favourite
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground",
                        )}
                      />
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: statusColor(project) + '12', color: statusColor(project) }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: statusColor(project) }}
                    />
                    {__(statusLabel(project))}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="h-1 flex-1" />
                      <span className="text-[11px] font-medium text-pm-text-muted tabular-nums w-7 text-right">
                        {progress}%
                      </span>
                    </div>
                    {getMeta(project) && (
                      <p className="text-[10px] text-pm-text-muted">
                        {getMeta(project).total_complete_tasks ?? 0} {__("done")} / {getMeta(project).total_tasks ?? 0} {__("total")}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {renderMetaCounters(project)}
                </td>
                <td className="px-4 py-3">{renderAssignees(project)}</td>
                <td className="px-4 py-3">
                  {project.created_at && (
                    <span className="text-[11px] text-pm-text-muted">
                      {formatPmDate(project.created_at)}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  {renderProjectDropdown(project)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // ── Pagination ─────────────────────────────────────────

  const goToPage = useCallback(
    (page) => {
      dispatch(setPage(page));
      dispatch(fetchProjects({ page }));
    },
    [dispatch],
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={cn(
                currentPage <= 1 && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>

          {pages.map((page, idx) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && goToPage(currentPage + 1)
              }
              disabled={currentPage >= totalPages}
              className={cn(
                currentPage >= totalPages && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // ── Main render ────────────────────────────────────────

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pm-text-primary">
          {__("Projects")}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setAiDialogOpen(true)}
          >
            <Sparkles className="h-4 w-4" />
            {__("AI Create")}
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => dispatch(setCreateSheetOpen(true))}
          >
            <Plus className="h-4 w-4" />
            {__("New Project")}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex items-center rounded-lg bg-muted/60 p-1 gap-0.5">
          {FILTER_TABS.map((tab) => {
            const count = tab.countKey
              ? projectsMeta[tab.countKey]
              : totalCount;
            const isActive = activeFilter === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleFilterChange(tab.key)}
                className={cn(
                  "relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-background text-pm-text-primary shadow-sm"
                    : "text-pm-text-muted hover:text-pm-text-primary",
                )}
              >
                {__(tab.label)}
                <span
                  className="inline-flex items-center justify-center rounded-full px-1.5 min-w-[18px] h-[18px] text-[10px] font-semibold tabular-nums transition-colors"
                  style={isActive ? { backgroundColor: tab.color + '15', color: tab.color } : { color: 'var(--pm-text-muted)' }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 h-9 w-[180px] rounded-md border border-pm-border bg-background px-2.5 focus-within:ring-1 focus-within:ring-pm-accent">
            <Search className="h-3.5 w-3.5 text-pm-text-muted shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={__('Search projects...')}
              className="flex-1 min-w-0 h-full bg-transparent text-sm placeholder:text-pm-text-muted/60 focus:outline-none !border-0 !p-0 !shadow-none"
            />
          </div>
          <Select
            value={categoryId !== undefined ? String(categoryId) : "__all__"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder={__("All Categories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{__("All Categories")}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={orderBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder={__("Sort By")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id:desc">{__("Newest First")}</SelectItem>
              <SelectItem value="id:asc">{__("Oldest First")}</SelectItem>
              <SelectItem value="title:asc">{__("Title A-Z")}</SelectItem>
              <SelectItem value="title:desc">{__("Title Z-A")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => handleViewModeChange("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => handleViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {loading
        ? renderSkeleton()
        : projects.length === 0
        ? renderEmpty()
        : viewMode === "grid"
        ? renderGridView()
        : renderListView()}

      {projects.length > 0 && renderPagination()}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent data-pm-dialog>
          <DialogHeader>
            <DialogTitle>{__("Delete Project")}</DialogTitle>
            <DialogDescription>
              {__("Are you sure you want to delete")}{" "}
              <strong>{projectToDelete?.title}</strong>?{" "}
              {__("This action cannot be undone.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {__("Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              {__("Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProjectCreateSheet />
      <AiCreateDialog open={aiDialogOpen} onOpenChange={setAiDialogOpen} />
    </div>
  );
}
