import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import RichTextEditor from "@components/common/RichTextEditor";
import GitHubPreviewContainer from "@components/common/GitHubPreviewContainer";
import NotionPreviewContainer from "@components/common/NotionPreviewContainer";
import LoomPreviewContainer from "@components/common/LoomPreviewContainer";
import { stripAllPreviewUrls } from "@/lib/url-strippers";
import { sanitizeHtml } from "@lib/sanitize";
import { Skeleton } from "@components/ui/skeleton";
import { UserAvatar } from '@components/common/UserAvatar';
import { Separator } from "@components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  ArrowLeft,
  Plus,
  MessageSquare,
  Trash2,
  MoreHorizontal,
  Lock,
  Unlock,
  ChevronDown,
  Send,
  Pencil,
  Check,
  X,
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
  const [searchParams] = useSearchParams();
  const targetDiscussionId = parseInt(searchParams.get('id')) || null;
  const api = useApi();
  const { __ } = useI18n();
  const toast = useToast();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager, canEditComment, currentUserId } = usePermissions(project);
  const canCreateDiscussion = isManager || userCan('create_discussion');
  const canDeleteDiscussion = (d) => {
    if (isManager || userCan('delete_discussion')) return true;
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

  const [openId, setOpenId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentFiles, setCommentFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [editingDiscId, setEditingDiscId] = useState(null);
  const [editDiscTitle, setEditDiscTitle] = useState("");
  const [editDiscDesc, setEditDiscDesc] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const fetchDiscussions = useCallback(
    async (pg = 1) => {
      setLoading(true);
      try {
        const res = await api.get(`projects/${projectId}/discussion-boards`, {
          with: "comments",
          per_page: 20,
          page: pg,
        });
        const data = res.data ?? [];
        setDiscussions(data);
        if (res.meta?.pagination) {
          setTotalPages(res.meta.pagination.total_pages || 1);
          setPage(pg);
        }
        if (pg === 1 && data.length > 0 && !openId) {
          // Honor ?id=<discussionId> deep link from attached-to file links
          const target = targetDiscussionId
            ? data.find(d => d.id === targetDiscussionId)
            : null
          const initial = target || data[0]
          setOpenId(initial.id);
          setComments(initial.comments?.data ?? []);
          if (target) {
            setTimeout(() => {
              const el = document.getElementById(`pm-discuss-${target.id}`)
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
          }
        }
      } catch {}
      setLoading(false);
    },
    [api, projectId],
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
        await fetchDiscussions();
        if (newDisc?.id) {
          setOpenId(newDisc.id);
          setComments(newDisc.comments?.data ?? []);
        }
      } catch {
        toast.error(__("Failed to create discussion"));
      }
      setCreating(false);
    },
    [
      api,
      projectId,
      formTitle,
      formDesc,
      formMilestone,
      formFiles,
      creating,
      toast,
      __,
      fetchDiscussions,
    ],
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!confirm(__("Are you sure?"))) return;
      try {
        await api.post(`projects/${projectId}/discussion-boards/${id}/delete`);
        setDiscussions((prev) => prev.filter((d) => d.id !== id));
        if (openId === id) setOpenId(null);
        toast.success(__("Discussion deleted"));
      } catch {
        toast.error(__("Failed to delete"));
      }
    },
    [api, projectId, openId, toast, __],
  );

  const handleTogglePrivacy = useCallback(
    async (disc) => {
      const newPrivacy = disc.meta?.privacy ? 0 : 1;
      try {
        await api.post(
          `projects/${projectId}/discussion-boards/privacy/${disc.id}`,
          {
            is_private: newPrivacy,
          },
        );
        setDiscussions((prev) =>
          prev.map((d) =>
            d.id === disc.id
              ? { ...d, meta: { ...d.meta, privacy: newPrivacy } }
              : d,
          ),
        );
        toast.success(newPrivacy ? __("Set to private") : __("Set to public"));
      } catch {
        toast.error(__("Failed to update privacy"));
      }
    },
    [api, projectId, toast, __],
  );

  const handleOpen = useCallback(
    async (disc) => {
      if (openId === disc.id) {
        setOpenId(null);
        return;
      }
      setOpenId(disc.id);
      setComments(disc.comments?.data ?? []);
    },
    [openId],
  );

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("content", newComment.trim());
      fd.append("commentable_id", openId);
      fd.append("commentable_type", "discussion_board");
      fd.append("mentioned_users", "");
      fd.append("notify_users", "");
      fd.append("project_id", projectId);
      commentFiles.forEach((f) => fd.append("files[]", f));

      const res = await api.upload(`projects/${projectId}/comments`, fd);
      if (res.data) setComments((prev) => [...prev, res.data]);
      setNewComment("");
      setCommentFiles([]);
      toast.success(__("Comment added"));
    } catch {
      toast.error(__("Failed to add comment"));
    }
    setSubmitting(false);
  }, [api, projectId, openId, newComment, submitting, toast, __]);

  const startEditDiscussion = useCallback((d) => {
    setEditingDiscId(d.id);
    setEditDiscTitle(d.title || "");
    setEditDiscDesc(d.description?.content || "");
  }, []);

  const cancelEditDiscussion = useCallback(() => {
    setEditingDiscId(null);
    setEditDiscTitle("");
    setEditDiscDesc("");
  }, []);

  const handleUpdateDiscussion = useCallback(async () => {
    if (!editDiscTitle.trim() || !editingDiscId) return;
    try {
      await api.post(`projects/${projectId}/discussion-boards/${editingDiscId}`, {
        title: editDiscTitle.trim(),
        description: editDiscDesc.trim(),
        project_id: projectId,
      });
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === editingDiscId
            ? { ...d, title: editDiscTitle.trim(), description: { ...d.description, content: editDiscDesc.trim(), html: editDiscDesc.trim() } }
            : d,
        ),
      );
      cancelEditDiscussion();
      toast.success(__("Discussion updated"));
    } catch {
      toast.error(__("Failed to update discussion"));
    }
  }, [api, projectId, editingDiscId, editDiscTitle, editDiscDesc, toast, __, cancelEditDiscussion]);

  const startEditComment = useCallback((c) => {
    setEditingCommentId(c.id);
    setEditCommentText(c.content || "");
  }, []);

  const cancelEditComment = useCallback(() => {
    setEditingCommentId(null);
    setEditCommentText("");
  }, []);

  const handleUpdateComment = useCallback(async () => {
    if (!editCommentText.trim() || !editingCommentId) return;
    try {
      await api.post(`projects/${projectId}/comments/${editingCommentId}`, {
        content: editCommentText.trim(),
        project_id: projectId,
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === editingCommentId ? { ...c, content: editCommentText.trim() } : c,
        ),
      );
      cancelEditComment();
      toast.success(__("Comment updated"));
    } catch {
      toast.error(__("Failed to update comment"));
    }
  }, [api, projectId, editingCommentId, editCommentText, toast, __, cancelEditComment]);

  const handleDeleteComment = useCallback(
    async (commentId) => {
      try {
        await api.post(`projects/${projectId}/comments/${commentId}/delete`);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success(__("Comment deleted"));
      } catch {
        toast.error(__("Failed to delete comment"));
      }
    },
    [api, projectId, toast, __],
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
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
            {__("Discussions")}
          </h1>
          {discussions.length > 0 && (
            <span className="text-sm text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-full tabular-nums">
              {discussions.length}
            </span>
          )}
        </div>
        {canCreateDiscussion && (
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus className="h-5 w-5" />
            {__("New Discussion")}
          </Button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border bg-card p-4 space-y-3"
        >
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
            <Button
              size="sm"
              type="submit"
              disabled={!formTitle.trim() || creating}
            >
              {creating ? __("Creating...") : __("Add Message")}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
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
        <div className="space-y-3">
          {discussions.map((d) => {
            const isOpen = openId === d.id;
            const isPrivate = d.meta?.privacy;
            const commentCount =
              d.meta?.total_comments ?? d.comments?.data?.length ?? 0;

            return (
              <div
                key={d.id}
                id={`pm-discuss-${d.id}`}
                className="rounded-xl border bg-card overflow-hidden hover:shadow-sm transition-shadow scroll-mt-20"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    {editingDiscId === d.id ? (
                      <div className="flex-1 space-y-2">
                        <Input
                          autoFocus
                          value={editDiscTitle}
                          onChange={(e) => setEditDiscTitle(e.target.value)}
                          className="h-8 text-sm"
                        />
                        <RichTextEditor
                          content={editDiscDesc}
                          onChange={setEditDiscDesc}
                          minHeight="50px"
                        />
                        <div className="flex gap-1.5">
                          <Button size="sm" className="h-7 gap-1 text-sm" onClick={handleUpdateDiscussion} disabled={!editDiscTitle.trim()}>
                            <Check className="h-3.5 w-3.5" />
                            {__("Save")}
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm" onClick={cancelEditDiscussion}>
                            <X className="h-3.5 w-3.5" />
                            {__("Cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                    <button
                      type="button"
                      className="flex-1 text-left min-w-0"
                      onClick={() => handleOpen(d)}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className="h-5 w-5 text-pm-text-muted shrink-0 transition-transform duration-200"
                          style={{
                            transform: isOpen
                              ? "rotate(0deg)"
                              : "rotate(-90deg)",
                          }}
                        />
                        <h3 className="text-sm font-semibold text-pm-text-primary">
                          {d.title}
                        </h3>
                        {isPrivate ? (
                          <Lock className="h-3.5 w-3.5 text-pm-text-muted shrink-0" />
                        ) : null}
                      </div>
                      {d.description?.content && !isOpen && (
                        <p className="text-sm text-pm-text-muted mt-1 ml-6 line-clamp-2">
                          {d.description.content}
                        </p>
                      )}
                    </button>
                    )}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {commentCount > 0 && (
                        <span className="flex items-center gap-0.5 text-[15px] text-pm-text-muted">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {commentCount}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canDeleteDiscussion(d) && (
                            <DropdownMenuItem onClick={() => startEditDiscussion(d)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              {__("Edit")}
                            </DropdownMenuItem>
                          )}
                          {canDeleteDiscussion(d) && userCan('view_private_discussion') && (
                            <DropdownMenuItem
                              onClick={() => isPro && handleTogglePrivacy(d)}
                              disabled={!isPro}
                            >
                              {isPrivate ? (
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
                          )}
                          {canDeleteDiscussion(d) && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(d.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {__("Delete")}
                          </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <DiscussionFiles files={d.files} />

                  <div className="flex items-center gap-2 mt-2 ml-6 text-[15px] text-pm-text-muted">
                    {d.creator?.data && (
                      <span className="flex items-center gap-1">
                        <UserAvatar user={d.creator.data} size="sm" />
                        {d.creator.data.display_name}
                      </span>
                    )}
                    <span>·</span>
                    <span>{formatPmDateTime(d.created_at)}</span>
                  </div>
                </div>

                {isOpen && (
                  <>
                    {d.description?.html && (
                      <div className="px-4 pb-3 ml-6">
                        <div
                          className="prose prose-sm max-w-none text-sm text-pm-text-primary/80 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(stripAllPreviewUrls(d.description.html)),
                          }}
                        />
                        <GitHubPreviewContainer content={d.description.html} />
                        <NotionPreviewContainer content={d.description.html} />
                        <LoomPreviewContainer content={d.description.html} />
                      </div>
                    )}
                    <Separator />
                    <div className="p-4 bg-muted/10 space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-pm-text-muted/70 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {__("Comments")}
                      </h4>

                      {comments.length > 0 && (
                        <div className="space-y-3">
                          {comments.map((c) => (
                            <div key={c.id} className="flex gap-2.5 group">
                              <UserAvatar user={c.creator?.data} size="md" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-sm font-medium text-pm-text-primary">
                                    {c.creator?.data?.display_name}
                                  </span>
                                  <span className="text-[13px] text-pm-text-muted">
                                    {formatPmDateTime(c.created_at)}
                                  </span>
                                  {canEditComment(c) && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                      <button
                                        type="button"
                                        className="text-[13px] text-pm-text-muted hover:text-pm-accent"
                                        onClick={() => startEditComment(c)}
                                      >
                                        <Pencil className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        className="text-[13px] text-pm-text-muted hover:text-destructive"
                                        onClick={() => handleDeleteComment(c.id)}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {editingCommentId === c.id ? (
                                  <div className="space-y-1.5">
                                    <RichTextEditor
                                      content={editCommentText}
                                      onChange={setEditCommentText}
                                      autofocus
                                      minHeight="36px"
                                    />
                                    <div className="flex gap-1">
                                      <Button size="sm" className="h-6 text-[14px] gap-1 px-2" onClick={handleUpdateComment} disabled={!editCommentText.trim()}>
                                        <Check className="h-3 w-3" />
                                        {__("Save")}
                                      </Button>
                                      <Button size="sm" variant="ghost" className="h-6 text-[14px] px-2" onClick={cancelEditComment}>
                                        {__("Cancel")}
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div
                                      className="text-sm text-pm-text-primary/80 leading-relaxed prose prose-sm max-w-none"
                                      dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(stripAllPreviewUrls(c.content)),
                                      }}
                                    />
                                    <GitHubPreviewContainer content={c.content || ''} />
                                    <NotionPreviewContainer content={c.content || ''} />
                                    <LoomPreviewContainer content={c.content || ''} />
                                  </>
                                )}
                                <DiscussionFiles files={c.files} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <RichTextEditor
                            content={newComment}
                            onChange={setNewComment}
                            placeholder={__("Write a comment...")}
                            minHeight="40px"
                            className="flex-1"
                          />
                          <Button
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            onClick={handleAddComment}
                            disabled={!newComment.trim() || submitting}
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        </div>
                        <FileUploadArea
                          files={commentFiles}
                          onFilesChange={setCommentFiles}
                          compact
                        />
                      </div>
                    </div>
                  </>
                )}
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
  );
}
