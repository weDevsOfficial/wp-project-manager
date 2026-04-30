import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "@components/common/BackButton";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { useConfirm } from "@hooks/useConfirm";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import RichTextEditor from "@components/common/RichTextEditor";
import { Skeleton } from "@components/ui/skeleton";
import { UserAvatar } from "@components/common/UserAvatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Plus,
  MessageSquare,
  Trash2,
  MoreHorizontal,
  Lock,
  Unlock,
  Pencil,
  ChevronRight,
} from "lucide-react";
import FileUploadArea from "@components/common/FileUploadArea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { formatPmDateTime } from "@lib/pm-utils";
import ProBadge from "@components/common/ProBadge";
import { usePermissions } from "@hooks/usePermissions";
import { useCurrentProject } from "@hooks/useCurrentProject";
import DiscussionFiles from "./parts/DiscussionFiles";

export default function DiscussionsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { __ } = useI18n();
  const toast = useToast();
  const [ConfirmDialog, confirm] = useConfirm();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager, currentUserId } = usePermissions(project);
  const canCreateDiscussion = isManager || userCan("create_discussion");
  const canEditDiscussion = (d) => {
    if (isManager || userCan("delete_discussion")) return true;
    const creatorId = d?.creator?.data?.id ?? d?.created_by;
    return currentUserId && creatorId && String(currentUserId) === String(creatorId);
  };

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formMilestone, setFormMilestone] = useState("-1");
  const [formFiles, setFormFiles] = useState([]);
  const [creating, setCreating] = useState(false);

  const [milestones, setMilestones] = useState([]);

  const fetchDiscussions = useCallback(
    async (pg = 1) => {
      setLoading(true);
      try {
        const res = await api.get(`projects/${projectId}/discussion-boards`, {
          per_page: 20,
          page: pg,
        });
        setDiscussions(res.data ?? []);
        if (res.meta?.pagination) {
          setTotalPages(res.meta.pagination.total_pages || 1);
          setPage(pg);
        }
      } catch {}
      setLoading(false);
    },
    [api, projectId]
  );

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  useEffect(() => {
    if (showForm && milestones.length === 0) {
      api
        .get(`projects/${projectId}/milestones`, { per_page: 50 })
        .then((res) => setMilestones(res.data ?? []))
        .catch(() => {});
    }
  }, [showForm, projectId]);

  const handleCreate = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formTitle.trim() || creating) return;
      setCreating(true);
      try {
        const fd = new FormData();
        fd.append("title", formTitle.trim());
        fd.append("description", formDesc.trim());
        fd.append("order", "0");
        fd.append("notify_users", "");
        if (formMilestone && formMilestone !== "-1")
          fd.append("milestone", formMilestone);
        formFiles.forEach((f) => fd.append("files[]", f));
        const res = await api.upload(`projects/${projectId}/discussion-boards`, fd);
        const newDisc = res?.data ?? res;
        setFormTitle("");
        setFormDesc("");
        setFormMilestone("-1");
        setFormFiles([]);
        setShowForm(false);
        toast.success(__("Discussion created"));
        if (newDisc?.id) {
          navigate(`/projects/${projectId}/discussions/${newDisc.id}`);
        } else {
          await fetchDiscussions();
        }
      } catch {
        toast.error(__("Failed to create discussion"));
      }
      setCreating(false);
    },
    [api, projectId, formTitle, formDesc, formMilestone, formFiles, creating, toast, __, fetchDiscussions, navigate]
  );

  const handleDelete = useCallback(
    async (e, id) => {
      e.stopPropagation();
      const ok = await confirm(__("Are you sure?"), __("Delete Discussion"));
      if (!ok) return;
      try {
        await api.post(`projects/${projectId}/discussion-boards/${id}/delete`);
        setDiscussions((prev) => prev.filter((d) => d.id !== id));
        toast.success(__("Discussion deleted"));
      } catch {
        toast.error(__("Failed to delete"));
      }
    },
    [api, projectId, toast, __]
  );

  const handleTogglePrivacy = useCallback(
    async (e, disc) => {
      e.stopPropagation();
      const newPrivacy = disc.meta?.privacy ? 0 : 1;
      try {
        await api.post(
          `projects/${projectId}/discussion-boards/privacy/${disc.id}`,
          { is_private: newPrivacy }
        );
        setDiscussions((prev) =>
          prev.map((d) =>
            d.id === disc.id ? { ...d, meta: { ...d.meta, privacy: newPrivacy } } : d
          )
        );
        toast.success(newPrivacy ? __("Set to private") : __("Set to public"));
      } catch {
        toast.error(__("Failed to update privacy"));
      }
    },
    [api, projectId, toast, __]
  );

  return (
    <>
    <ConfirmDialog />
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton fallback={`/projects/${projectId}/task-lists`} />
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("Discussions")}
          </h1>
          {discussions.length > 0 && (
            <span className="text-sm text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-full tabular-nums">
              {discussions.length}
            </span>
          )}
        </div>
        {canCreateDiscussion && (
          <Button size="sm" className="gap-1.5" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-5 w-5" />
            {__("New Discussion")}
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border bg-card p-4 space-y-3">
          <Input
            autoFocus
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder={__("Enter message title")}
            className="h-9 text-sm"
          />
          <RichTextEditor
            content={formDesc}
            onChange={setFormDesc}
            placeholder={__("Description...")}
            minHeight="80px"
            users={project?.assignees?.data ?? []}
          />
          <Select value={formMilestone} onValueChange={setFormMilestone}>
            <SelectTrigger className="h-9 text-sm w-full sm:w-[200px]">
              <SelectValue placeholder={__("- Milestone -")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">{__("- Milestone -")}</SelectItem>
              {milestones.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FileUploadArea files={formFiles} onFilesChange={setFormFiles} />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormTitle("");
                setFormDesc("");
                setFormMilestone("-1");
              }}
            >
              {__("Cancel")}
            </Button>
            <Button size="sm" type="submit" disabled={!formTitle.trim() || creating}>
              {creating ? __("Creating...") : __("Add Message")}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text-primary mb-1">
            {__("No discussions yet")}
          </h3>
          <p className="text-sm text-pm-text-muted">
            {__("Start a conversation about this project.")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {discussions.map((d) => {
            const isPrivate = d.meta?.privacy;
            const commentCount = d.meta?.total_comments ?? d.comments?.data?.length ?? 0;

            return (
              <div
                key={d.id}
                className="rounded-xl border bg-card hover:shadow-sm transition-shadow cursor-pointer group"
                onClick={() => navigate(`/projects/${projectId}/discussions/${d.id}`)}
              >
                <div className="p-4 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-pm-text-primary group-hover:text-pm-accent transition-colors">
                        {d.title}
                      </h3>
                      {isPrivate && <Lock className="h-3.5 w-3.5 text-pm-text-muted shrink-0" />}
                    </div>
                    {d.description?.content && (
                      <p className="text-sm text-pm-text-muted mt-0.5 line-clamp-2">
                        {d.description.content.replace(/<[^>]*>/g, "")}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-[13px] text-pm-text-muted">
                      {d.creator?.data && (
                        <span className="flex items-center gap-1">
                          <UserAvatar user={d.creator.data} size="sm" />
                          {d.creator.data.display_name}
                        </span>
                      )}
                      <span>·</span>
                      <span>{formatPmDateTime(d.created_at)}</span>
                      {d.milestone?.data && (
                        <>
                          <span>·</span>
                          <button
                            type="button"
                            className="text-pm-accent hover:underline"
                            onClick={(e) => { e.stopPropagation(); navigate(`/projects/${projectId}/milestones`); }}
                          >
                            {d.milestone.data.title}
                          </button>
                        </>
                      )}
                    </div>
                    <DiscussionFiles files={d.files} />
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {commentCount > 0 && (
                      <span className="flex items-center gap-0.5 text-[13px] text-pm-text-muted">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {commentCount}
                      </span>
                    )}
                    {canEditDiscussion(d) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/projects/${projectId}/discussions/${d.id}`);
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            {__("Edit")}
                          </DropdownMenuItem>
                          {userCan("view_private_discussion") && (
                            <DropdownMenuItem
                              onClick={(e) => isPro && handleTogglePrivacy(e, d)}
                              disabled={!isPro}
                            >
                              {isPrivate ? (
                                <><Unlock className="h-4 w-4 mr-2" />{__("Make Public")}</>
                              ) : (
                                <><Lock className="h-4 w-4 mr-2" />{__("Make Private")}</>
                              )}
                              {!isPro && <ProBadge className="ml-auto" />}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => handleDelete(e, d.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {__("Delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <ChevronRight className="h-4 w-4 text-pm-text-muted/50" />
                  </div>
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <Button
                  key={pg}
                  variant={pg === page ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 text-sm"
                  onClick={() => fetchDiscussions(pg)}
                >
                  {pg}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}
