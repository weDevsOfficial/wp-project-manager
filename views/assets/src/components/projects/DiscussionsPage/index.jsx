import { Loader2 } from 'lucide-react'
import { __ } from '@wordpress/i18n';
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "@components/common/BackButton";
import { useApi } from "@hooks/useApi";
import { useToast } from "@hooks/useToast";
import { useConfirm } from "@hooks/useConfirm";
import { Button } from "@components/ui/button";
import { PaginationNav } from "@components/ui/pagination";
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
  Search,
  X,
} from "lucide-react";
import FileUploadArea from "@components/common/FileUploadArea";
import CommentLinkActions from "@components/google-workspace/CommentLinkActions";
import { useAppDispatch } from "@store/index";
import { attachFileFor } from "@store/googleWorkspaceSlice";
import NotifyUsers from "@components/common/NotifyUsers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { formatPmDateTime, isPrivate as checkPrivate } from "@lib/pm-utils";
import ProBadge from "@components/common/ProBadge";
import { usePermissions } from "@hooks/usePermissions";
import { useCurrentProject } from "@hooks/useCurrentProject";
import DiscussionFiles from "./parts/DiscussionFiles";
import DiscussionDetailPage from "./DiscussionDetailPage";

export default function DiscussionsPage() {
  const { projectId, discussionId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [ConfirmDialog, confirm] = useConfirm();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager, isUserInProject, currentUserId } = usePermissions(project);
  const canCreateDiscussion = isManager || (isUserInProject && userCan("create_message"));
  const canEditDiscussion = (d) => {
    if (isManager) return true;
    const creatorId = d?.creator?.data?.id ?? d?.created_by;
    return currentUserId && creatorId && String(currentUserId) === String(creatorId);
  };
  const canViewPrivateDiscussion = isManager || userCan("view_private_message");

  const [discussions, setDiscussions] = useState([]);

  // Resizable split: left list width (px), draggable divider, persisted.
  const gridRef = useRef(null);
  const [leftW, setLeftW] = useState(() => {
    try {
      const s = window.localStorage.getItem('pm-disc-left-w');
      const n = s ? parseInt(s, 10) : NaN;
      return Number.isFinite(n) ? Math.min(1000, Math.max(280, n)) : null;
    } catch { return null; }
  });
  const leftWRef = useRef(leftW);
  useEffect(() => { leftWRef.current = leftW; }, [leftW]);
  // Holds the active drag's teardown so an unmount mid-drag detaches the window listeners.
  const dragCleanupRef = useRef(null);
  const startResize = useCallback((e) => {
    e.preventDefault();
    const move = (ev) => {
      if (!gridRef.current) return;
      const left = gridRef.current.getBoundingClientRect().left;
      const w = Math.min(1000, Math.max(280, ev.clientX - left));
      setLeftW(w);
    };
    const up = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      dragCleanupRef.current = null;
      if (Number.isFinite(leftWRef.current)) { try { window.localStorage.setItem('pm-disc-left-w', String(Math.round(leftWRef.current))); } catch { /* ignore */ } }
    };
    dragCleanupRef.current = up;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, []);
  useEffect(() => () => { if (dragCleanupRef.current) dragCleanupRef.current(); }, []);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formMilestone, setFormMilestone] = useState("-1");
  const [formFiles, setFormFiles] = useState([]);
  const [stagedDrive, setStagedDrive] = useState([]);
  const [formNotifyUsers, setFormNotifyUsers] = useState([]);
  const [creating, setCreating] = useState(false);

  const [milestones, setMilestones] = useState([]);
  const [query, setQuery] = useState("");
  // Held in a ref as well, so fetchDiscussions can read the current term
  // without taking `query` as a dependency: that would make the mount effect
  // re-run on every keystroke and fire an undebounced request each time.
  const queryRef = useRef("");
  const searchTimerRef = useRef(null);

  const fetchDiscussions = useCallback(
    async (pg = 1, title = queryRef.current) => {
      setLoading(true);
      try {
        const params = { per_page: 20, page: pg };
        if (title.trim()) params.title = title.trim();
        const res = await api.get(`projects/${projectId}/discussion-boards`, params);
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

  // The list paginates at 20, so long-lived projects need a way to find an
  // older thread without paging through everything.
  const handleSearch = useCallback(
    (value) => {
      setQuery(value);
      queryRef.current = value;
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => fetchDiscussions(1, value), 400);
    },
    [fetchDiscussions]
  );

  useEffect(() => () => clearTimeout(searchTimerRef.current), []);

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
        formNotifyUsers.forEach((id) => fd.append("notify_users[]", String(id)));
        if (formMilestone && formMilestone !== "-1")
          fd.append("milestone", formMilestone);
        formFiles.forEach((f) => fd.append("files[]", f));
        const res = await api.upload(`projects/${projectId}/discussion-boards`, fd);
        const newDisc = res?.data ?? res;
        // Attach any staged Drive files now that the discussion has an id.
        if (newDisc?.id && stagedDrive.length) {
          for (const file of stagedDrive) {
            await dispatch(attachFileFor({ projectId, attachableType: 'discussion', attachableId: newDisc.id, file }));
          }
        }
        setFormTitle("");
        setFormDesc("");
        setFormMilestone("-1");
        setFormFiles([]);
        setStagedDrive([]);
        setFormNotifyUsers([]);
        setShowForm(false);
        toast.success(__("Discussion created", 'wedevs-project-manager'));
        await fetchDiscussions();
        if (newDisc?.id) {
          navigate(`/projects/${projectId}/discussions/${newDisc.id}`);
        }
      } catch {
        toast.error(__("Failed to create discussion", 'wedevs-project-manager'));
      }
      setCreating(false);
    },
    [api, projectId, formTitle, formDesc, formMilestone, formFiles, formNotifyUsers, creating, toast, __, fetchDiscussions, navigate, stagedDrive, dispatch]
  );

  const handleDelete = useCallback(
    async (e, id) => {
      e.stopPropagation();
      const ok = await confirm(__("Are you sure?", 'wedevs-project-manager'), __("Delete Discussion", 'wedevs-project-manager'));
      if (!ok) return;
      try {
        await api.post(`projects/${projectId}/discussion-boards/${id}/delete`);
        setDiscussions((prev) => prev.filter((d) => d.id !== id));
        if (String(id) === String(discussionId)) {
          navigate(`/projects/${projectId}/discussions`);
        }
        toast.success(__("Discussion deleted", 'wedevs-project-manager'));
      } catch {
        toast.error(__("Failed to delete", 'wedevs-project-manager'));
      }
    },
    [api, projectId, discussionId, navigate, toast, __]
  );

  const handleTogglePrivacy = useCallback(
    async (e, disc) => {
      e.stopPropagation();
      const newPrivacy = checkPrivate(disc.meta?.privacy) ? 0 : 1;
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
        toast.success(newPrivacy ? __("Set to private", 'wedevs-project-manager') : __("Set to public", 'wedevs-project-manager'));
      } catch {
        toast.error(__("Failed to update privacy", 'wedevs-project-manager'));
      }
    },
    [api, projectId, toast, __]
  );

  return (
    <>
    <ConfirmDialog />
    <div className="w-full p-4 sm:p-6">
      <div ref={gridRef} className="flex items-stretch max-md:flex-col max-md:gap-4">
        {/* LEFT — discussions list */}
        <div className="flex flex-col min-w-0 gap-4 shrink-0 max-md:!w-full" style={{ width: leftW == null ? '50%' : leftW }}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <BackButton fallback={`/projects/${projectId}/task-lists`} />
              <h1 className="text-xl font-bold text-pm-text-primary">
                {__("Discussions", 'wedevs-project-manager')}
              </h1>
              {discussions.length > 0 && (
                <span className="text-sm text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-md tabular-nums">
                  {discussions.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 h-11 w-[180px] max-w-full rounded-md border border-input bg-background px-2.5 focus-within:ring-1 focus-within:ring-pm-accent/40 focus-within:border-pm-accent">
                <Search className="h-4 w-4 text-pm-text-muted shrink-0" />
                <input
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={__("Search discussions", 'wedevs-project-manager')}
                  className="flex-1 min-w-0 h-full bg-transparent text-sm text-pm-text-primary placeholder:text-muted-foreground focus:outline-none !border-0 !p-0 !shadow-none"
                />
                {query && (
                  <button
                    type="button"
                    aria-label={__("Clear search", 'wedevs-project-manager')}
                    onClick={() => handleSearch("")}
                    className="text-pm-text-muted hover:text-pm-text-primary shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {canCreateDiscussion && (
                <Button size="sm" className="gap-1.5 h-11 px-5" onClick={() => setShowForm((v) => !v)}>
                  <Plus className="h-5 w-5" />
                  {__("New", 'wedevs-project-manager')}
                </Button>
              )}
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="rounded-lg border bg-card p-4 space-y-3">
              <Input
                autoFocus
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder={__("Enter message title", 'wedevs-project-manager')}
                className="h-11 text-sm"
              />
              <RichTextEditor
                content={formDesc}
                onChange={setFormDesc}
                placeholder={__("Description...", 'wedevs-project-manager')}
                minHeight="80px"
                users={project?.assignees?.data ?? []}
              />
              <Select value={formMilestone} onValueChange={setFormMilestone}>
                <SelectTrigger className="h-11 text-sm w-full">
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
              <FileUploadArea files={formFiles} onFilesChange={setFormFiles} />
              <CommentLinkActions projectId={projectId} onInsert={(html) => setFormDesc(prev => (prev || '') + html)} />
              <div className="flex items-center gap-2 flex-wrap">
                <NotifyUsers
                  users={project?.assignees?.data ?? []}
                  value={formNotifyUsers}
                  onChange={setFormNotifyUsers}
                />
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="h-11 px-5"
                  onClick={() => {
                    setShowForm(false);
                    setFormTitle("");
                    setFormDesc("");
                    setFormMilestone("-1");
                    setFormNotifyUsers([]);
                  }}
                >
                  {__("Cancel", 'wedevs-project-manager')}
                </Button>
                <Button size="sm" type="submit" className="h-11 px-5" disabled={!formTitle.trim() || creating}>
                  {creating ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{__("Creating...", 'wedevs-project-manager')}</> : __("Add Message", 'wedevs-project-manager')}
                </Button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-16 rounded-lg border bg-card">
              <MessageSquare className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-pm-text-primary mb-1">
                {query.trim()
                  ? __("No discussions match your search", 'wedevs-project-manager')
                  : __("No discussions yet", 'wedevs-project-manager')}
              </h3>
              <p className="text-sm text-pm-text-muted">
                {query.trim()
                  ? __("Try a different search term.", 'wedevs-project-manager')
                  : __("Start a conversation about this project.", 'wedevs-project-manager')}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {discussions.map((d) => {
                const isPrivate = checkPrivate(d.meta?.privacy);
                const commentCount = d.meta?.total_comments ?? d.comments?.data?.length ?? 0;
                const active = String(d.id) === String(discussionId);

                return (
                  <div
                    key={d.id}
                    className={`rounded-xl border transition-all cursor-pointer group ${active ? 'border-pm-accent bg-pm-accent-light/40 shadow-sm' : 'border-pm-border bg-card hover:border-pm-accent/40 hover:bg-muted/30'}`}
                    onClick={() => navigate(`/projects/${projectId}/discussions/${d.id}`)}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-2">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <h3 className={`min-w-0 truncate text-[15px] font-semibold transition-colors ${active ? 'text-pm-accent' : 'text-pm-text-primary group-hover:text-pm-accent'}`}>
                            {d.title}
                          </h3>
                          {isPrivate && <Lock className="h-3.5 w-3.5 text-pm-text-muted shrink-0" />}
                        </div>
                        {canEditDiscussion(d) && (
                          <div className="shrink-0 -mr-1.5 -mt-1" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6" aria-label={__('Discussion actions', 'wedevs-project-manager')}>
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
                                  {__("Open", 'wedevs-project-manager')}
                                </DropdownMenuItem>
                                {canViewPrivateDiscussion && (
                                  <DropdownMenuItem
                                    onClick={(e) => isPro && handleTogglePrivacy(e, d)}
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
                                  onClick={(e) => handleDelete(e, d.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {__("Delete", 'wedevs-project-manager')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>

                      {(() => {
                        const descText = typeof d.description === 'string'
                          ? d.description
                          : (d.description?.content || d.description?.html || "");
                        if (!descText) return null;
                        return (
                          <p className="text-sm text-pm-text-muted mt-2 line-clamp-3">
                            {descText.replace(/<[^>]*>/g, "")}
                          </p>
                        );
                      })()}

                      <div className="flex items-center gap-1.5 mt-3 text-[13px] text-pm-text-muted">
                        {d.creator?.data && (
                          <span className="flex items-center gap-1 min-w-0">
                            <UserAvatar user={d.creator.data} size="sm" />
                            <span className="truncate max-w-[120px]">{d.creator.data.display_name}</span>
                          </span>
                        )}
                        <span className="shrink-0">·</span>
                        <span className="shrink-0 whitespace-nowrap">{formatPmDateTime(d.created_at)}</span>
                        {commentCount > 0 && (
                          <span className="ml-auto shrink-0 flex items-center gap-0.5">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {commentCount}
                          </span>
                        )}
                      </div>

                      <DiscussionFiles files={d.files} />
                    </div>
                  </div>
                );
              })}

              <PaginationNav
                page={page}
                totalPages={totalPages}
                onPageChange={fetchDiscussions}
                className="pt-2"
              />
            </div>
          )}
        </div>

        {/* Resizable divider */}
        <div
          onMouseDown={startResize}
          role="separator"
          aria-orientation="vertical"
          title={__("Drag to resize", 'wedevs-project-manager')}
          className="group relative w-4 shrink-0 cursor-col-resize flex items-stretch justify-center select-none max-md:hidden"
        >
          <div className="w-px bg-pm-border group-hover:bg-pm-accent group-active:bg-pm-accent transition-colors" />
          <div className="absolute top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-pm-border/0 group-hover:bg-pm-accent transition-colors" />
        </div>

        {/* RIGHT — conversation panel */}
        <div className="flex flex-col min-w-0 flex-1 max-md:w-full">
          {discussionId ? (
            <DiscussionDetailPage
              key={discussionId}
              syncedPrivacy={
                discussions.find((d) => String(d.id) === String(discussionId))?.meta?.privacy
              }
              onPrivacyChange={(id, privacy) =>
                setDiscussions((prev) =>
                  prev.map((d) =>
                    String(d.id) === String(id) ? { ...d, meta: { ...d.meta, privacy } } : d
                  )
                )
              }
            />
          ) : (
            <div className="w-full flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-pm-border py-24 px-6">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-pm-text-muted">
                {__("Select a discussion to view the conversation.", 'wedevs-project-manager')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
