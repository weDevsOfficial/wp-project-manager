import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Skeleton } from "@components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
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
  FileText,
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
import { formatPmDate, formatPmDateTime, userInitials } from "@lib/pm-utils";
import ProBadge from "@components/common/ProBadge";
import { usePermissions } from "@hooks/usePermissions";

function renderFiles(files) {
  if (!files?.data?.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap mt-2">
      {files.data.map((f) => (
        <a
          key={f.id}
          href={f.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs border rounded-lg px-2.5 py-1.5 hover:bg-muted/30 transition-colors"
        >
          {f.type === "image" && f.thumb ? (
            <img
              src={f.thumb}
              alt={f.name}
              className="h-8 w-8 rounded object-cover"
            />
          ) : (
            <FileText className="h-4 w-4 text-pm-text-muted" />
          )}
          <span className="text-pm-text-primary truncate max-w-[120px]">
            {f.name}
          </span>
        </a>
      ))}
    </div>
  );
}

export default function DiscussionsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { __ } = useI18n();
  const toast = useToast();
  const { isPro } = usePermissions();

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formMilestone, setFormMilestone] = useState("-1");
  const [formFiles, setFormFiles] = useState([]);
  const [creating, setCreating] = useState(false);

  // Milestones for dropdown
  const [milestones, setMilestones] = useState([]);

  // Individual discussion view
  const [openId, setOpenId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentFiles, setCommentFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Edit discussion state
  const [editingDiscId, setEditingDiscId] = useState(null);
  const [editDiscTitle, setEditDiscTitle] = useState("");
  const [editDiscDesc, setEditDiscDesc] = useState("");

  // Edit comment state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Vue 2: GET projects/{pid}/discussion-boards?with=comments&per_page=20&page={page}
  const fetchDiscussions = useCallback(
    async (pg = 1) => {
      setLoading(true);
      try {
        const res = await api.get(`projects/${projectId}/discussion-boards`, {
          with: "comments",
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
    [api, projectId],
  );

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  // Fetch milestones for dropdown when form opens
  useEffect(() => {
    if (showForm && milestones.length === 0) {
      api
        .get(`projects/${projectId}/milestones`, { per_page: 50 })
        .then((res) => setMilestones(res.data ?? []))
        .catch(() => {});
    }
  }, [showForm, projectId]);

  // Vue 2 sends FormData with contentType: false for file support
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

        await api.upload(`projects/${projectId}/discussion-boards`, fd);
        setFormTitle("");
        setFormDesc("");
        setFormMilestone("-1");
        setFormFiles([]);
        setShowForm(false);
        toast.success(__("Discussion created"));
        fetchDiscussions();
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

  // Vue 2: POST projects/{pid}/discussion-boards/{id}/delete
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

  // Vue 2: POST projects/{pid}/discussion-boards/privacy/{id} with is_private: 0|1
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

  // Open discussion — load its comments
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

  // Vue 2: POST projects/{pid}/comments with FormData for file support
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

  // Edit discussion
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

  // Edit comment
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

  // Vue 2: POST projects/{pid}/comments/{id}/delete
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
      {/* Header */}
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
            {__("Discussions")}
          </h1>
          {discussions.length > 0 && (
            <span className="text-xs text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-full tabular-nums">
              {discussions.length}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setShowForm((v) => !v)}
        >
          <Plus className="h-4 w-4" />
          {__("New Discussion")}
        </Button>
      </div>

      {/* Create form */}
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

          {/* Milestone dropdown */}
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

          {/* File upload */}
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

      {/* List */}
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
          <p className="text-xs text-pm-text-muted">
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
                className="rounded-xl border bg-card overflow-hidden hover:shadow-sm transition-shadow"
              >
                {/* Discussion header */}
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
                          <Button size="sm" className="h-7 gap-1 text-xs" onClick={handleUpdateDiscussion} disabled={!editDiscTitle.trim()}>
                            <Check className="h-3 w-3" />
                            {__("Save")}
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={cancelEditDiscussion}>
                            <X className="h-3 w-3" />
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
                          className="h-4 w-4 text-pm-text-muted shrink-0 transition-transform duration-200"
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
                          <Lock className="h-3 w-3 text-pm-text-muted shrink-0" />
                        ) : null}
                      </div>
                      {d.description?.content && !isOpen && (
                        <p className="text-xs text-pm-text-muted mt-1 ml-6 line-clamp-2">
                          {d.description.content}
                        </p>
                      )}
                    </button>
                    )}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {commentCount > 0 && (
                        <span className="flex items-center gap-0.5 text-[11px] text-pm-text-muted">
                          <MessageSquare className="h-3 w-3" />
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
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEditDiscussion(d)}>
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            {__("Edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => isPro && handleTogglePrivacy(d)}
                            disabled={!isPro}
                          >
                            {isPrivate ? (
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
                            onClick={() => handleDelete(d.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            {__("Delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {/* Discussion files */}
                  {renderFiles(d.files)}

                  {/* Creator + date */}
                  <div className="flex items-center gap-2 mt-2 ml-6 text-[11px] text-pm-text-muted">
                    {d.creator?.data && (
                      <span className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={d.creator.data.avatar_url} />
                          <AvatarFallback className="text-[7px]">
                            {userInitials(d.creator.data.display_name)}
                          </AvatarFallback>
                        </Avatar>
                        {d.creator.data.display_name}
                      </span>
                    )}
                    <span>·</span>
                    <span>{formatPmDateTime(d.created_at)}</span>
                  </div>
                </div>

                {/* Expanded: description + comments */}
                {isOpen && (
                  <>
                    {d.description?.html && (
                      <div className="px-4 pb-3 ml-6">
                        <div
                          className="prose prose-sm max-w-none text-sm text-pm-text-primary/80 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                          dangerouslySetInnerHTML={{
                            __html: stripAllPreviewUrls(d.description.html),
                          }}
                        />
                        <GitHubPreviewContainer content={d.description.html} />
                        <NotionPreviewContainer content={d.description.html} />
                        <LoomPreviewContainer content={d.description.html} />
                      </div>
                    )}
                    <Separator />
                    <div className="p-4 bg-muted/10 space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-pm-text-muted/70 flex items-center gap-1.5">
                        <MessageSquare className="h-3 w-3" />
                        {__("Comments")}
                      </h4>

                      {/* Comment list */}
                      {comments.length > 0 && (
                        <div className="space-y-3">
                          {comments.map((c) => (
                            <div key={c.id} className="flex gap-2.5 group">
                              <Avatar className="h-6 w-6 shrink-0">
                                <AvatarImage
                                  src={c.creator?.data?.avatar_url}
                                />
                                <AvatarFallback className="text-[8px]">
                                  {userInitials(
                                    c.creator?.data?.display_name ?? "?",
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-medium text-pm-text-primary">
                                    {c.creator?.data?.display_name}
                                  </span>
                                  <span className="text-[10px] text-pm-text-muted">
                                    {formatPmDateTime(c.created_at)}
                                  </span>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                    <button
                                      type="button"
                                      className="text-[10px] text-pm-text-muted hover:text-pm-accent"
                                      onClick={() => startEditComment(c)}
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      className="text-[10px] text-pm-text-muted hover:text-destructive"
                                      onClick={() => handleDeleteComment(c.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
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
                                      <Button size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={handleUpdateComment} disabled={!editCommentText.trim()}>
                                        <Check className="h-2.5 w-2.5" />
                                        {__("Save")}
                                      </Button>
                                      <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={cancelEditComment}>
                                        {__("Cancel")}
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div
                                      className="text-xs text-pm-text-primary/80 leading-relaxed prose prose-sm max-w-none"
                                      dangerouslySetInnerHTML={{
                                        __html: stripAllPreviewUrls(c.content),
                                      }}
                                    />
                                    <GitHubPreviewContainer content={c.content || ''} />
                                    <NotionPreviewContainer content={c.content || ''} />
                                    <LoomPreviewContainer content={c.content || ''} />
                                  </>
                                )}
                                {renderFiles(c.files)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add comment */}
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
                            <Send className="h-4 w-4" />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <Button
                  key={pg}
                  variant={pg === page ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 text-xs"
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
