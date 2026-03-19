import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Skeleton } from "@components/ui/skeleton";
import { Progress } from "@components/ui/progress";
import {
  ArrowLeft,
  Plus,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  Milestone as MilestoneIcon,
  Lock,
  Unlock,
  Pencil,
  ListTodo,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { formatPmDate, formatPmDateTime, extractDateStr } from "@lib/pm-utils";
import ProBadge from "@components/common/ProBadge";
import { usePermissions } from "@hooks/usePermissions";

export default function MilestonesPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { __ } = useI18n();
  const toast = useToast();
  const { isPro } = usePermissions();

  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [achieveDate, setAchieveDate] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  // Vue 2: GET projects/{pid}/milestones?with=discussion_boards,task_lists&per_page=20
  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`projects/${projectId}/milestones`, {
        with: "discussion_boards,task_lists",
        per_page: 50,
      });
      setMilestones(res.data ?? []);
    } catch {}
    setLoading(false);
  }, [api, projectId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  // Vue 2: POST projects/{pid}/milestones
  const handleCreate = useCallback(
    async (e) => {
      e.preventDefault();
      if (!title.trim() || creating) return;
      setCreating(true);
      try {
        await api.post(`projects/${projectId}/milestones`, {
          title: title.trim(),
          description: description.trim(),
          achieve_date: achieveDate || undefined,
          status: "incomplete",
          project_id: projectId,
        });
        setTitle("");
        setDescription("");
        setAchieveDate("");
        setShowForm(false);
        toast.success(__("Milestone created"));
        fetchMilestones();
      } catch {
        toast.error(__("Failed to create milestone"));
      }
      setCreating(false);
    },
    [
      api,
      projectId,
      title,
      description,
      achieveDate,
      creating,
      toast,
      __,
      fetchMilestones,
    ],
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!confirm(__("Are you sure?"))) return;
      try {
        await api.post(`projects/${projectId}/milestones/${id}/delete`);
        setMilestones((prev) => prev.filter((m) => m.id !== id));
        toast.success(__("Milestone deleted"));
      } catch {
        toast.error(__("Failed to delete"));
      }
    },
    [api, projectId, toast, __],
  );

  // Vue 2: POST projects/{pid}/milestones/privacy/{id}
  const handleTogglePrivacy = useCallback(
    async (m) => {
      const newPrivacy = m.meta?.privacy ? 0 : 1;
      try {
        await api.post(`projects/${projectId}/milestones/privacy/${m.id}`, {
          is_private: newPrivacy,
        });
        setMilestones((prev) =>
          prev.map((ms) =>
            ms.id === m.id
              ? { ...ms, meta: { ...ms.meta, privacy: newPrivacy } }
              : ms,
          ),
        );
      } catch {
        toast.error(__("Failed to update"));
      }
    },
    [api, projectId, toast, __],
  );

  // Vue 2: POST projects/{pid}/milestones/{id}/update
  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editingMilestone || !title.trim()) return;
      setCreating(true);
      try {
        await api.post(
          `projects/${projectId}/milestones/${editingMilestone.id}/update`,
          {
            title: title.trim(),
            description: description.trim(),
            achieve_date: achieveDate || undefined,
            project_id: projectId,
          },
        );
        setEditingMilestone(null);
        setTitle("");
        setDescription("");
        setAchieveDate("");
        setShowForm(false);
        toast.success(__("Milestone updated"));
        fetchMilestones();
      } catch {
        toast.error(__("Failed to update milestone"));
      }
      setCreating(false);
    },
    [api, projectId, editingMilestone, title, description, achieveDate, toast, __, fetchMilestones],
  );

  const handleToggleStatus = useCallback(
    async (m) => {
      const isComplete = m.status === "complete" || m.status === 1 || m.status === "1";
      const newStatus = isComplete ? "incomplete" : "complete";
      try {
        await api.post(`projects/${projectId}/milestones/${m.id}/update`, {
          title: m.title,
          status: newStatus,
          project_id: projectId,
        });
        setMilestones((prev) =>
          prev.map((ms) => (ms.id === m.id ? { ...ms, status: newStatus } : ms)),
        );
        toast.success(
          newStatus === "complete"
            ? __("Milestone marked as complete")
            : __("Milestone marked as incomplete"),
        );
      } catch {
        toast.error(__("Failed to update status"));
      }
    },
    [api, projectId, toast, __],
  );

  const startEdit = useCallback((m) => {
    setEditingMilestone(m);
    setTitle(m.title || "");
    setDescription(m.description?.content || m.description || "");
    setAchieveDate(extractDateStr(m.achieve_date) || "");
    setShowForm(true);
  }, []);

  // Vue 2 groups: Upcoming, Late, Completed
  const today = new Date().toISOString().split("T")[0];

  const grouped = useMemo(() => {
    const upcoming = [];
    const late = [];
    const completed = [];

    for (const m of milestones) {
      const isComplete =
        m.status === "complete" || m.status === 1 || m.status === "1";
      if (isComplete) {
        completed.push(m);
      } else {
        const dateStr = extractDateStr(m.achieve_date);
        if (dateStr && dateStr < today) {
          late.push(m);
        } else {
          upcoming.push(m);
        }
      }
    }
    return { upcoming, late, completed };
  }, [milestones, today]);

  const renderMilestone = (m) => {
    const isComplete = m.status === "complete" || m.status === 1;
    const taskLists = m.task_lists?.data ?? [];
    const discussions = m.discussion_boards?.data ?? [];
    const hasDetails = taskLists.length > 0 || discussions.length > 0;

    return (
      <div
        key={m.id}
        className="rounded-xl border bg-background overflow-hidden hover:shadow-sm transition-shadow"
      >
        {/* Milestone header */}
        <div className="p-4 flex items-start gap-3">
          <CheckCircle
            className={`h-5 w-5 shrink-0 mt-0.5 ${
              isComplete ? "text-emerald-500" : "text-pm-text-muted/30"
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-pm-text-primary">
                {m.title}
              </h4>
              {m.meta?.privacy ? (
                <Lock className="h-3 w-3 text-pm-text-muted" />
              ) : null}
            </div>
            {m.description?.content && (
              <p className="text-xs text-pm-text-muted mt-0.5 line-clamp-2">
                {m.description.content}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-pm-text-muted">
              {m.achieve_date && (
                <span>{formatPmDateTime(m.achieve_date)}</span>
              )}
              {taskLists.length > 0 && (
                <span className="flex items-center gap-1">
                  <ListTodo className="h-3 w-3" />
                  {taskLists.length} {__("lists")}
                </span>
              )}
              {discussions.length > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {discussions.length} {__("discussions")}
                </span>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => startEdit(m)}>
                <Pencil className="h-3.5 w-3.5 mr-2" />
                {__("Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatus(m)}>
                <CheckCircle className="h-3.5 w-3.5 mr-2" />
                {isComplete ? __("Mark Incomplete") : __("Mark Complete")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => isPro && handleTogglePrivacy(m)}
                disabled={!isPro}
              >
                {m.meta?.privacy ? (
                  <>
                    <Unlock className="h-3.5 w-3.5 mr-2" />
                    {__("Make Public")}
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5 mr-2" />
                    {__("Make Private")}
                  </>
                )}
                {!isPro && <ProBadge className="ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(m.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                {__("Delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Linked task lists & discussions */}
        {hasDetails && (
          <div className="border-t bg-muted/10 px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task Lists */}
            {taskLists.length > 0 && (
              <div>
                <h5 className="text-[11px] font-semibold uppercase tracking-wider text-pm-text-muted/70 mb-2 flex items-center gap-1">
                  <ListTodo className="h-3 w-3" />
                  {__("Task Lists")}
                </h5>
                <ul className="space-y-1.5">
                  {taskLists.map((list) => {
                    const total =
                      (list.meta?.total_incomplete_tasks ?? 0) +
                      (list.meta?.total_complete_tasks ?? 0);
                    const complete = list.meta?.total_complete_tasks ?? 0;
                    const pct =
                      total > 0 ? Math.round((complete / total) * 100) : 0;
                    return (
                      <li key={list.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-xs text-pm-accent hover:underline truncate flex-1 text-left"
                          onClick={() =>
                            navigate(`/projects/${projectId}/task-lists`)
                          }
                        >
                          {list.title}
                        </button>
                        <Progress value={pct} className="h-1 w-12" />
                        <span className="text-[10px] text-pm-text-muted tabular-nums w-6 text-right">
                          {pct}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Discussions */}
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
                        className="text-xs text-pm-accent hover:underline truncate block text-left"
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
        )}
      </div>
    );
  };

  const renderGroup = (label, icon, items, color) => {
    if (items.length === 0) return null;
    const Icon = icon;
    return (
      <div className="space-y-2">
        <h3
          className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${color}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full tabular-nums font-normal text-pm-text-muted">
            {items.length}
          </span>
        </h3>
        <div className="space-y-2">{items.map(renderMilestone)}</div>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`/projects/${projectId}/task-lists`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("Milestones")}
          </h1>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => { setEditingMilestone(null); setTitle(""); setDescription(""); setAchieveDate(""); setShowForm((v) => !v) }}
        >
          <Plus className="h-4 w-4" />
          {__("New Milestone")}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={editingMilestone ? handleUpdate : handleCreate}
          className="rounded-xl border bg-card p-4 space-y-3"
        >
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={__("Milestone title")}
            className="h-9 text-sm"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={__("Description...")}
            className="text-sm min-h-[60px] resize-y"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-pm-text-muted w-20 shrink-0">
              {__("Target date")}
            </label>
            <Input
              type="date"
              value={achieveDate}
              onChange={(e) => setAchieveDate(e.target.value)}
              className="h-8 text-sm w-[160px]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingMilestone(null);
                setTitle("");
                setDescription("");
                setAchieveDate("");
              }}
            >
              {__("Cancel")}
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={!title.trim() || creating}
            >
              {creating
                ? (editingMilestone ? __("Updating...") : __("Creating..."))
                : (editingMilestone ? __("Update") : __("Create"))}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : milestones.length === 0 ? (
        <div className="text-center py-16">
          <MilestoneIcon className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text-primary mb-1">
            {__("No milestones yet")}
          </h3>
          <p className="text-xs text-pm-text-muted">
            {__("Track your project progress with milestones.")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {renderGroup(
            __("Upcoming"),
            Clock,
            grouped.upcoming,
            "text-blue-500",
          )}
          {renderGroup(__("Late"), AlertTriangle, grouped.late, "text-red-500")}
          {renderGroup(
            __("Completed"),
            CheckCircle,
            grouped.completed,
            "text-emerald-500",
          )}
        </div>
      )}
    </div>
  );
}
