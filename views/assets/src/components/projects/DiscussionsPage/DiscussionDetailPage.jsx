import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "@components/common/BackButton";
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
import { UserAvatar } from "@components/common/UserAvatar";
import { Separator } from "@components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  MessageSquare,
  Trash2,
  Lock,
  Unlock,
  Send,
  Pencil,
  Check,
  X,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import FileUploadArea from "@components/common/FileUploadArea";
import ProBadge from "@components/common/ProBadge";
import { formatPmDateTime } from "@lib/pm-utils";
import { usePermissions } from "@hooks/usePermissions";
import { useCurrentProject } from "@hooks/useCurrentProject";
import DiscussionFiles from "./parts/DiscussionFiles";

function extractMentionedUsers(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const ids = []
  doc.querySelectorAll('span[data-type="mention"][data-id]').forEach(el => {
    const id = el.getAttribute('data-id')
    if (id && !ids.includes(id)) ids.push(id)
  })
  return ids.join(',')
}

export default function DiscussionDetailPage() {
  const { projectId, discussionId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { __ } = useI18n();
  const toast = useToast();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager, canEditComment, currentUserId } = usePermissions(project);
  const projectUsers = project?.assignees?.data ?? [];

  const canEditDiscussion = (d) => {
    if (isManager || userCan("delete_discussion")) return true;
    const creatorId = d?.creator?.data?.id ?? d?.created_by;
    return currentUserId && creatorId && String(currentUserId) === String(creatorId);
  };

  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editMilestone, setEditMilestone] = useState("-1");
  const [milestones, setMilestones] = useState([]);

  const [newComment, setNewComment] = useState("");
  const [commentFiles, setCommentFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const fetchDiscussion = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `projects/${projectId}/discussion-boards/${discussionId}`,
        { with: "comments" }
      );
      const d = res?.data ?? res;
      setDiscussion(d);
      setComments(d.comments?.data ?? []);
    } catch {
      toast.error(__("Failed to load discussion"));
    }
    setLoading(false);
  }, [api, projectId, discussionId]);

  useEffect(() => {
    fetchDiscussion();
  }, [fetchDiscussion]);

  useEffect(() => {
    api
      .get(`projects/${projectId}/milestones`, { per_page: 50 })
      .then((res) => setMilestones(res.data ?? []))
      .catch(() => {});
  }, [projectId]);

  const startEdit = () => {
    setEditTitle(discussion.title || "");
    setEditDesc(discussion.description?.content || "");
    setEditMilestone(discussion.milestone?.data?.id ? String(discussion.milestone.data.id) : "-1");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditTitle("");
    setEditDesc("");
    setEditMilestone("-1");
  };

  const handleUpdate = useCallback(async () => {
    if (!editTitle.trim()) return;
    try {
      const payload = {
        title: editTitle.trim(),
        description: editDesc.trim(),
        project_id: projectId,
        milestone_id: editMilestone !== "-1" ? editMilestone : "",
      };
      await api.post(`projects/${projectId}/discussion-boards/${discussionId}`, payload);
      const milestone =
        editMilestone !== "-1"
          ? milestones.find((m) => String(m.id) === editMilestone)
          : null;
      setDiscussion((prev) => ({
        ...prev,
        title: editTitle.trim(),
        description: { ...prev.description, content: editDesc.trim(), html: editDesc.trim() },
        milestone: milestone ? { data: milestone } : null,
      }));
      cancelEdit();
      toast.success(__("Discussion updated"));
    } catch {
      toast.error(__("Failed to update discussion"));
    }
  }, [api, projectId, discussionId, editTitle, editDesc, editMilestone, milestones, toast, __]);

  const handleDelete = async () => {
    if (!confirm(__("Are you sure?"))) return;
    try {
      await api.post(`projects/${projectId}/discussion-boards/${discussionId}/delete`);
      toast.success(__("Discussion deleted"));
      navigate(`/projects/${projectId}/discussions`);
    } catch {
      toast.error(__("Failed to delete"));
    }
  };

  const handleTogglePrivacy = async () => {
    const newPrivacy = discussion.meta?.privacy ? 0 : 1;
    try {
      await api.post(`projects/${projectId}/discussion-boards/privacy/${discussionId}`, {
        is_private: newPrivacy,
      });
      setDiscussion((prev) => ({ ...prev, meta: { ...prev.meta, privacy: newPrivacy } }));
      toast.success(newPrivacy ? __("Set to private") : __("Set to public"));
    } catch {
      toast.error(__("Failed to update privacy"));
    }
  };

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    const mentionedUsers = extractMentionedUsers(newComment);
    try {
      const fd = new FormData();
      fd.append("content", newComment.trim());
      fd.append("commentable_id", discussionId);
      fd.append("commentable_type", "discussion_board");
      fd.append("mentioned_users", mentionedUsers);
      fd.append("notify_users", mentionedUsers);
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
  }, [api, projectId, discussionId, newComment, commentFiles, submitting, toast, __]);

  const startEditComment = (c) => {
    setEditingCommentId(c.id);
    setEditCommentText(c.content || "");
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleUpdateComment = useCallback(async () => {
    if (!editCommentText.trim() || !editingCommentId) return;
    const mentionedUsers = extractMentionedUsers(editCommentText);
    try {
      await api.post(`projects/${projectId}/comments/${editingCommentId}`, {
        content: editCommentText.trim(),
        project_id: projectId,
        mentioned_users: mentionedUsers,
        notify_users: mentionedUsers,
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === editingCommentId ? { ...c, content: editCommentText.trim() } : c
        )
      );
      cancelEditComment();
      toast.success(__("Comment updated"));
    } catch {
      toast.error(__("Failed to update comment"));
    }
  }, [api, projectId, editingCommentId, editCommentText, toast, __]);

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
    [api, projectId, toast, __]
  );

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  if (!discussion) return null;

  const isPrivate = discussion.meta?.privacy;
  const commentCount = comments.length;

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BackButton fallback={`/projects/${projectId}/discussions`} />
        <h1 className="text-xl font-bold text-pm-text-primary flex items-center gap-2">
          {__("Discussions")}
          {isPrivate && <Lock className="h-4 w-4 text-pm-text-muted" />}
        </h1>
      </div>

      {/* Discussion body */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 sm:p-5">
          {editing ? (
            <div className="space-y-3">
              <Input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-base font-semibold h-9"
              />
              <RichTextEditor
                content={editDesc}
                onChange={setEditDesc}
                minHeight="80px"
                users={projectUsers}
              />
              <Select value={editMilestone} onValueChange={setEditMilestone}>
                <SelectTrigger className="h-8 text-sm w-full sm:w-[200px]">
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
              <div className="flex gap-2">
                <Button size="sm" className="gap-1" onClick={handleUpdate} disabled={!editTitle.trim()}>
                  <Check className="h-3.5 w-3.5" />
                  {__("Save")}
                </Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={cancelEdit}>
                  <X className="h-3.5 w-3.5" />
                  {__("Cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-pm-text-primary">{discussion.title}</h2>
                {canEditDiscussion(discussion) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={startEdit}>
                        <Pencil className="h-4 w-4 mr-2" />
                        {__("Edit")}
                      </DropdownMenuItem>
                      {userCan("view_private_discussion") && (
                        <DropdownMenuItem
                          onClick={() => isPro && handleTogglePrivacy()}
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
                        onClick={handleDelete}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {__("Delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 text-[13px] text-pm-text-muted">
                {discussion.creator?.data && (
                  <span className="flex items-center gap-1">
                    <UserAvatar user={discussion.creator.data} size="sm" />
                    {discussion.creator.data.display_name}
                  </span>
                )}
                <span>·</span>
                <span>{formatPmDateTime(discussion.created_at)}</span>
                {discussion.milestone?.data && (
                  <>
                    <span>·</span>
                    <button
                      type="button"
                      className="text-pm-accent hover:underline"
                      onClick={() => navigate(`/projects/${projectId}/milestones`)}
                    >
                      {discussion.milestone.data.title}
                    </button>
                  </>
                )}
              </div>

              {discussion.description?.html && (
                <div className="mt-3">
                  <div
                    className="prose prose-sm max-w-none text-sm text-pm-text-primary/80 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(stripAllPreviewUrls(discussion.description.html)),
                    }}
                  />
                  <GitHubPreviewContainer content={discussion.description.html} />
                  <NotionPreviewContainer content={discussion.description.html} />
                  <LoomPreviewContainer content={discussion.description.html} />
                </div>
              )}

              <DiscussionFiles files={discussion.files} />
            </>
          )}
        </div>

        <Separator />

        {/* Comments */}
        <div className="p-4 sm:p-5 bg-muted/10 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-pm-text-muted/70 flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            {commentCount > 0 ? `${commentCount} ${__("Comments")}` : __("Comments")}
          </h3>

          {comments.length > 0 && (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 group">
                  <UserAvatar user={c.creator?.data} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
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
                            className="text-pm-text-muted hover:text-pm-accent"
                            onClick={() => startEditComment(c)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            className="text-pm-text-muted hover:text-destructive"
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
                          users={projectUsers}
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="h-6 text-[13px] gap-1 px-2"
                            onClick={handleUpdateComment}
                            disabled={!editCommentText.trim()}
                          >
                            <Check className="h-3 w-3" />
                            {__("Save")}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[13px] px-2"
                            onClick={cancelEditComment}
                          >
                            {__("Cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="text-sm text-pm-text-primary/80 leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(stripAllPreviewUrls(c.content || "")),
                          }}
                        />
                        <GitHubPreviewContainer content={c.content || ""} />
                        <NotionPreviewContainer content={c.content || ""} />
                        <LoomPreviewContainer content={c.content || ""} />
                        <DiscussionFiles files={c.files} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New comment form */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <RichTextEditor
                content={newComment}
                onChange={setNewComment}
                placeholder={__("Write a comment...")}
                minHeight="40px"
                className="flex-1"
                users={projectUsers}
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
      </div>
    </div>
  );
}
