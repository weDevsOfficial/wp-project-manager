import { __ } from '@wordpress/i18n';
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "@components/common/BackButton";
import { useApi } from "@hooks/useApi";
import { useToast } from "@hooks/useToast";
import { useConfirm } from "@hooks/useConfirm";
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
import NotifyUsers from "@components/common/NotifyUsers";
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
  const toast = useToast();
  const [ConfirmDialog, confirm] = useConfirm();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager, canEditComment, currentUserId } = usePermissions(project);
  const projectUsers = project?.assignees?.data ?? [];

  const canEditDiscussion = (d) => {
    if (isManager) return true;
    const creatorId = d?.creator?.data?.id ?? d?.created_by;
    return currentUserId && creatorId && String(currentUserId) === String(creatorId);
  };
  const canViewPrivateDiscussion = isManager || userCan("view_private_message");

  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editMilestone, setEditMilestone] = useState("-1");
  const [editNewFiles, setEditNewFiles] = useState([]);
  const [editDeletedFileIds, setEditDeletedFileIds] = useState([]);
  const [savingDiscussion, setSavingDiscussion] = useState(false);
  const [milestones, setMilestones] = useState([]);

  const [newComment, setNewComment] = useState("");
  const [commentFiles, setCommentFiles] = useState([]);
  const [commentNotifyUsers, setCommentNotifyUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentNewFiles, setEditCommentNewFiles] = useState([]);
  const [editCommentDeletedFileIds, setEditCommentDeletedFileIds] = useState([]);
  const [savingEditComment, setSavingEditComment] = useState(false);

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
      toast.error(__("Failed to load discussion", 'wedevs-project-manager'));
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
    setEditDesc(typeof discussion.description === 'string' ? discussion.description : (discussion.description?.content || discussion.description?.html || ""));
    setEditMilestone(discussion.milestone?.data?.id ? String(discussion.milestone.data.id) : "-1");
    setEditNewFiles([]);
    setEditDeletedFileIds([]);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditTitle("");
    setEditDesc("");
    setEditMilestone("-1");
    setEditNewFiles([]);
    setEditDeletedFileIds([]);
  };

  const markDeleteDiscussionFile = (fileId) => {
    setEditDeletedFileIds((prev) => (prev.includes(fileId) ? prev : [...prev, fileId]));
  };

  const handleUpdate = useCallback(async () => {
    if (!editTitle.trim()) return;
    setSavingDiscussion(true);
    try {
      const hasFileChange = editNewFiles.length > 0 || editDeletedFileIds.length > 0;
      if (hasFileChange) {
        const fd = new FormData();
        fd.append("title", editTitle.trim());
        fd.append("description", editDesc.trim());
        fd.append("project_id", projectId);
        fd.append("milestone_id", editMilestone !== "-1" ? editMilestone : "");
        editNewFiles.forEach((f) => fd.append("files[]", f));
        editDeletedFileIds.forEach((id) => fd.append("files_to_delete[]", String(id)));
        await api.upload(`projects/${projectId}/discussion-boards/${discussionId}`, fd);
      } else {
        await api.post(`projects/${projectId}/discussion-boards/${discussionId}`, {
          title: editTitle.trim(),
          description: editDesc.trim(),
          project_id: projectId,
          milestone_id: editMilestone !== "-1" ? editMilestone : "",
        });
      }
      await fetchDiscussion();
      cancelEdit();
      toast.success(__("Discussion updated", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Failed to update discussion", 'wedevs-project-manager'));
    }
    setSavingDiscussion(false);
  }, [api, projectId, discussionId, editTitle, editDesc, editMilestone, editNewFiles, editDeletedFileIds, fetchDiscussion, toast, __]);

  const handleDelete = async () => {
    const ok = await confirm(__("Are you sure?", 'wedevs-project-manager'), __("Delete Discussion", 'wedevs-project-manager'));
    if (!ok) return;
    try {
      await api.post(`projects/${projectId}/discussion-boards/${discussionId}/delete`);
      toast.success(__("Discussion deleted", 'wedevs-project-manager'));
      navigate(`/projects/${projectId}/discussions`);
    } catch {
      toast.error(__("Failed to delete", 'wedevs-project-manager'));
    }
  };

  const handleTogglePrivacy = async () => {
    const newPrivacy = discussion.meta?.privacy ? 0 : 1;
    try {
      await api.post(`projects/${projectId}/discussion-boards/privacy/${discussionId}`, {
        is_private: newPrivacy,
      });
      setDiscussion((prev) => ({ ...prev, meta: { ...prev.meta, privacy: newPrivacy } }));
      toast.success(newPrivacy ? __("Set to private", 'wedevs-project-manager') : __("Set to public", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Failed to update privacy", 'wedevs-project-manager'));
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
      commentNotifyUsers.forEach((id) => fd.append("notify_users[]", String(id)));
      fd.append("project_id", projectId);
      commentFiles.forEach((f) => fd.append("files[]", f));
      const res = await api.upload(`projects/${projectId}/comments`, fd);
      if (res.data) setComments((prev) => [...prev, res.data]);
      setNewComment("");
      setCommentFiles([]);
      setCommentNotifyUsers([]);
      toast.success(__("Comment added", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Failed to add comment", 'wedevs-project-manager'));
    }
    setSubmitting(false);
  }, [api, projectId, discussionId, newComment, commentFiles, commentNotifyUsers, submitting, toast, __]);

  const startEditComment = (c) => {
    setEditingCommentId(c.id);
    setEditCommentText(c.content || "");
    setEditCommentNewFiles([]);
    setEditCommentDeletedFileIds([]);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
    setEditCommentNewFiles([]);
    setEditCommentDeletedFileIds([]);
  };

  const markDeleteCommentFile = (fileId) => {
    setEditCommentDeletedFileIds((prev) => (prev.includes(fileId) ? prev : [...prev, fileId]));
  };

  const handleUpdateComment = useCallback(async () => {
    if (!editCommentText.trim() || !editingCommentId) return;
    setSavingEditComment(true);
    const mentionedUsers = extractMentionedUsers(editCommentText);
    try {
      const hasFileChange = editCommentNewFiles.length > 0 || editCommentDeletedFileIds.length > 0;
      let res;
      if (hasFileChange) {
        const fd = new FormData();
        fd.append("content", editCommentText.trim());
        fd.append("project_id", projectId);
        fd.append("mentioned_users", mentionedUsers);
        fd.append("notify_users", "");
        editCommentNewFiles.forEach((f) => fd.append("files[]", f));
        editCommentDeletedFileIds.forEach((id) => fd.append("files_to_delete[]", String(id)));
        res = await api.upload(`projects/${projectId}/comments/${editingCommentId}`, fd);
      } else {
        res = await api.post(`projects/${projectId}/comments/${editingCommentId}`, {
          content: editCommentText.trim(),
          project_id: projectId,
          mentioned_users: mentionedUsers,
          notify_users: '',
        });
      }
      if (res?.data) {
        setComments((prev) => prev.map((c) => (c.id === editingCommentId ? res.data : c)));
      } else {
        setComments((prev) =>
          prev.map((c) =>
            c.id === editingCommentId ? { ...c, content: editCommentText.trim() } : c
          )
        );
      }
      await fetchDiscussion();
      cancelEditComment();
      toast.success(__("Comment updated", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Failed to update comment", 'wedevs-project-manager'));
    }
    setSavingEditComment(false);
  }, [api, projectId, editingCommentId, editCommentText, editCommentNewFiles, editCommentDeletedFileIds, fetchDiscussion, toast, __]);

  const handleDeleteComment = useCallback(
    async (commentId) => {
      try {
        await api.post(`projects/${projectId}/comments/${commentId}/delete`);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success(__("Comment deleted", 'wedevs-project-manager'));
      } catch {
        toast.error(__("Failed to delete comment", 'wedevs-project-manager'));
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
    <>
    <ConfirmDialog />
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BackButton fallback={`/projects/${projectId}/discussions`} />
        <h1 className="text-xl font-bold text-pm-text-primary flex items-center gap-2">
          {__("Discussions", 'wedevs-project-manager')}
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
                  <SelectValue placeholder={__("- Milestone -", 'wedevs-project-manager')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">{__("- Milestone -", 'wedevs-project-manager')}</SelectItem>
                  {milestones.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {discussion.files?.data?.filter((f) => !editDeletedFileIds.includes(f.id)).length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {discussion.files.data.filter((f) => !editDeletedFileIds.includes(f.id)).map((f) => {
                    const isImg = (f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url)
                    return (
                      <div key={f.id} className={`relative inline-flex items-center gap-1.5 text-sm border border-border/50 bg-muted/30 rounded-md ${isImg ? 'p-0' : 'px-2 py-1 pr-6'}`}>
                        {isImg ? (
                          <img src={f.thumb || f.url} alt={f.name} className="h-12 w-12 rounded object-cover" />
                        ) : (
                          <span className="truncate max-w-[140px]">{f.name}</span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); markDeleteDiscussionFile(f.id); }}
                          className="absolute -top-1.5 -right-1.5 z-10 bg-background border border-border/60 rounded-full p-0.5 text-pm-text-muted hover:text-destructive hover:border-destructive/40 shadow-sm cursor-pointer"
                          title={__('Remove', 'wedevs-project-manager')}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
              <FileUploadArea files={editNewFiles} onFilesChange={setEditNewFiles} compact />
              <div className="flex gap-2">
                <Button size="sm" className="gap-1" onClick={handleUpdate} disabled={savingDiscussion || !editTitle.trim()}>
                  <Check className="h-3.5 w-3.5" />
                  {savingDiscussion ? __("Saving...", 'wedevs-project-manager') : __("Save", 'wedevs-project-manager')}
                </Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={cancelEdit} disabled={savingDiscussion}>
                  <X className="h-3.5 w-3.5" />
                  {__("Cancel", 'wedevs-project-manager')}
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
                        {__("Edit", 'wedevs-project-manager')}
                      </DropdownMenuItem>
                      {canViewPrivateDiscussion && (
                        <DropdownMenuItem
                          onClick={() => isPro && handleTogglePrivacy()}
                          disabled={!isPro}
                        >
                          {isPrivate ? (
                            <><Unlock className="h-4 w-4 mr-2" />{__("Make Public", 'wedevs-project-manager')}</>
                          ) : (
                            <><Lock className="h-4 w-4 mr-2" />{__("Make Private", 'wedevs-project-manager')}</>
                          )}
                          {!isPro && <ProBadge className="ml-auto" />}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={handleDelete}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {__("Delete", 'wedevs-project-manager')}
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

              {(() => {
                const descHtml = typeof discussion.description === 'string'
                  ? discussion.description
                  : (discussion.description?.html || discussion.description?.content || "");
                if (!descHtml) return null;
                return (
                  <div className="mt-3">
                    <div
                      className="prose prose-sm max-w-none text-foreground text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(stripAllPreviewUrls(descHtml)),
                      }}
                    />
                    <GitHubPreviewContainer content={descHtml} />
                    <NotionPreviewContainer content={descHtml} />
                    <LoomPreviewContainer content={descHtml} />
                  </div>
                );
              })()}

              <DiscussionFiles files={discussion.files} />
            </>
          )}
        </div>

        <Separator />

        {/* Comments */}
        <div className="p-4 sm:p-5 bg-muted/10 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-pm-text-muted/70 flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            {commentCount > 0 ? `${commentCount} ${__("Comments", 'wedevs-project-manager')}` : __("Comments", 'wedevs-project-manager')}
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
                        {c.files?.data?.filter((f) => !editCommentDeletedFileIds.includes(f.id)).length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {c.files.data.filter((f) => !editCommentDeletedFileIds.includes(f.id)).map((f) => {
                              const isImg = (f.type || f.mime_type || '').startsWith('image') && (f.thumb || f.url)
                              return (
                                <div key={f.id} className={`relative inline-flex items-center gap-1.5 text-sm border border-border/50 bg-muted/30 rounded-md ${isImg ? 'p-0' : 'px-2 py-1 pr-6'}`}>
                                  {isImg ? (
                                    <img src={f.thumb || f.url} alt={f.name} className="h-12 w-12 rounded object-cover" />
                                  ) : (
                                    <span className="truncate max-w-[140px]">{f.name}</span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); markDeleteCommentFile(f.id); }}
                                    className="absolute -top-1.5 -right-1.5 z-10 bg-background border border-border/60 rounded-full p-0.5 text-pm-text-muted hover:text-destructive hover:border-destructive/40 shadow-sm cursor-pointer"
                                    title={__('Remove', 'wedevs-project-manager')}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                        <FileUploadArea files={editCommentNewFiles} onFilesChange={setEditCommentNewFiles} compact />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="h-6 text-[13px] gap-1 px-2"
                            onClick={handleUpdateComment}
                            disabled={savingEditComment || !editCommentText.trim()}
                          >
                            <Check className="h-3 w-3" />
                            {savingEditComment ? __("Saving...", 'wedevs-project-manager') : __("Save", 'wedevs-project-manager')}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[13px] px-2"
                            onClick={cancelEditComment}
                            disabled={savingEditComment}
                          >
                            {__("Cancel", 'wedevs-project-manager')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="text-sm leading-relaxed prose prose-sm max-w-none text-foreground"
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
                placeholder={__("Write a comment...", 'wedevs-project-manager')}
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
            <NotifyUsers
              users={projectUsers}
              value={commentNotifyUsers}
              onChange={setCommentNotifyUsers}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
