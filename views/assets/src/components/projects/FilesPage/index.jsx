import { __ } from '@wordpress/i18n';
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import BackButton from "@components/common/BackButton";
import { UserAvatar } from "@components/common/UserAvatar";
import { useApi } from "@hooks/useApi";
import { useToast } from "@hooks/useToast";
import { useConfirm } from "@hooks/useConfirm";
import { usePermissions } from "@hooks/usePermissions";
import { useCurrentProject } from "@hooks/useCurrentProject";
import { useProModal } from "@components/common/ProUpgradeModal";
import ProBadge from "@components/common/ProBadge";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { cn } from "@lib/utils";
import {
  FileText,
  Download,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  FolderPlus,
  Upload,
  FilePlus,
  Link2,
  Link as LinkIcon,
  Search,
  ArrowUpDown,
  FolderOpen,
  User as UserIcon,
  Calendar,
  Paperclip,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { formatPmDate } from "@lib/pm-utils";
import {
  getFileIcon,
  getFileIconColor,
  getFileIconBg,
  getFileIconHover,
  getAttachedLabel,
  getAttachedURL,
  getDownloadPermissionUrl,
  checkPermissionAndDownload,
} from "./utils";

const FILES_GRID =
  "grid-cols-[minmax(200px,2.2fr)_100px_120px_minmax(140px,1.3fr)_minmax(170px,1.4fr)_120px]";

// Free FilesPage — read-only listing of files attached to tasks/discussions/comments.
// Pro plugin replaces this via registerFilter('route.files.element') with full
// folders/docs/links/comments/revisions UI.
export default function FilesPage() {
  const { projectId } = useParams();

  const api = useApi();
  const toast = useToast();
  const [ConfirmDialog, confirm] = useConfirm();
  const project = useCurrentProject(projectId);
  const { isPro, isManager, currentUserId } = usePermissions(project);
  // No delete_file capability exists — file delete is manager-or-creator (Vue
  // can_edit_file parity). The bogus userCan('delete_file') always returned false.
  const canDeleteFile = (f) => {
    if (isManager) return true;
    const creatorId = f?.creator?.data?.id ?? f?.created_by ?? f?.creator?.id;
    return currentUserId && creatorId && String(currentUserId) === String(creatorId);
  };
  const { setOpen: setProModalOpen } = useProModal();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "uploaded", dir: "desc" });
  const [selectedId, setSelectedId] = useState(null);

  const fetchFiles = useCallback(() => {
    setLoading(true);
    api.get(`projects/${projectId}/files`, { per_page: 100 })
      .then((res) => setFiles(res?.data ?? res ?? []))
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, [api, projectId]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const proAction = () => setProModalOpen(true);

  const handleDelete = useCallback(async (id) => {
    const ok = await confirm(__("Are you sure?", 'wedevs-project-manager'), __("Delete File", 'wedevs-project-manager'));
    if (!ok) return;
    try {
      await api.post(`projects/${projectId}/files/${id}/delete`);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast.success(__("File deleted", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Failed to delete", 'wedevs-project-manager'));
    }
  }, [api, projectId, toast, __]);

  // Derive a flat, sortable/filterable row model from our real file data.
  const rows = useMemo(() => {
    const mapped = files.map((f) => {
      const iconType = f.mime_type || f.file_extension || f.type;
      const ext = String(f.file_extension || "").toUpperCase();
      return {
        raw: f,
        id: f.id,
        Icon: getFileIcon(iconType),
        iconColor: getFileIconColor(iconType),
        iconBg: getFileIconBg(iconType),
        iconHover: getFileIconHover(iconType),
        fileName: f.meta?.title || f.name || f.title || __("File", 'wedevs-project-manager'),
        typeLabel: ext || (f.type === "image" ? __("Image", 'wedevs-project-manager') : __("File", 'wedevs-project-manager')),
        uploaded: f.attached_at,
        uploadedTs: (() => {
          const d = new Date(f.attached_at?.date ?? f.attached_at ?? 0);
          return isNaN(d.getTime()) ? 0 : d.getTime();
        })(),
        attachedTo: getAttachedLabel(f, __),
        attachedUrl: getAttachedURL(f, projectId),
        creator: f.creator?.data ?? null,
        isImage: f.type === "image" || String(f.mime_type || "").startsWith("image"),
        thumbUrl: (f.type === "image" || String(f.mime_type || "").startsWith("image")) ? (f.thumb || f.url) : null,
        url: f.url,
      };
    });

    const filtered = mapped
      .filter((r) => tab === "all" || (r.creator && String(r.creator.id) === String(currentUserId)))
      .filter((r) => !query.trim() || r.fileName.toLowerCase().includes(query.trim().toLowerCase()));

    const dir = sort.dir === "asc" ? 1 : -1;
    const sorted = [...filtered].sort((a, b) => {
      switch (sort.key) {
        case "name": return a.fileName.localeCompare(b.fileName) * dir;
        case "type": return a.typeLabel.localeCompare(b.typeLabel) * dir;
        case "uploadedBy":
          return (a.creator?.display_name || "").localeCompare(b.creator?.display_name || "") * dir;
        case "uploaded":
        default:
          return (a.uploadedTs - b.uploadedTs) * dir;
      }
    });
    return sorted;
  }, [files, tab, query, sort, currentUserId, projectId, __]);

  // Newest-first, independent of the table sort — powers the Recent Files strip.
  const recentFiles = useMemo(
    () => [...rows].sort((a, b) => b.uploadedTs - a.uploadedTs).slice(0, 8),
    [rows],
  );

  // Keep a valid selection: default to the newest visible file.
  useEffect(() => {
    if (!rows.length) { setSelectedId(null); return; }
    if (!rows.some((r) => r.id === selectedId)) {
      setSelectedId(recentFiles[0]?.id ?? rows[0].id);
    }
  }, [rows, recentFiles, selectedId]);

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const downloadRow = useCallback((r) => {
    if (!r?.url) return;
    checkPermissionAndDownload(getDownloadPermissionUrl(r.raw, projectId), r.url, __);
  }, [projectId, __]);

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const SortHead = ({ label, sortKey, className }) => (
    <button
      type="button"
      onClick={() => toggleSort(sortKey)}
      className={cn(
        "flex items-center gap-1 text-left transition-colors hover:text-pm-text-primary",
        sort.key === sortKey ? "text-pm-text-primary" : "text-pm-text-muted",
        className,
      )}
    >
      {label}
      <ArrowUpDown className="h-4 w-4 shrink-0 opacity-60" />
    </button>
  );

  const TABS = [
    { key: "all", label: __("All Files", 'wedevs-project-manager'), icon: FolderOpen },
    { key: "mine", label: __("My Files", 'wedevs-project-manager'), icon: UserIcon },
  ];

  return (
    <>
    <ConfirmDialog />
    <div className="w-full p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <BackButton fallback={`/projects/${projectId}/task-lists`} />
          <div>
            <h1 className="text-xl font-bold text-pm-text-primary">{__("Files", 'wedevs-project-manager')}</h1>
            <p className="text-[13px] text-pm-text-muted">{__("Files attached to tasks, discussions and comments", 'wedevs-project-manager')}</p>
          </div>
          {files.length > 0 && (
            <span className="text-sm text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-md tabular-nums">
              {files.length}
            </span>
          )}
        </div>

        {!isPro && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" className="h-11 text-sm group/btn" onClick={proAction}>
              <FolderPlus className="h-4 w-4 mr-1" />{__("Create a folder", 'wedevs-project-manager')}
              <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>
            </Button>
            <Button size="sm" variant="outline" className="h-11 text-sm group/btn" onClick={proAction}>
              <Upload className="h-4 w-4 mr-1" />{__("Upload a file", 'wedevs-project-manager')}
              <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>
            </Button>
            <Button size="sm" variant="outline" className="h-11 text-sm group/btn" onClick={proAction}>
              <FilePlus className="h-4 w-4 mr-1" />{__("Create a doc", 'wedevs-project-manager')}
              <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>
            </Button>
            <Button size="sm" variant="outline" className="h-11 text-sm group/btn" onClick={proAction}>
              <Link2 className="h-4 w-4 mr-1" />{__("Link to Docs", 'wedevs-project-manager')}
              <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>
            </Button>
          </div>
        )}
      </div>

      {/* Toolbar: tabs + search */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex items-center gap-0.5 rounded-lg border border-pm-border bg-muted/60 p-1">
          {TABS.map((t) => {
            const TabIcon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all",
                  tab === t.key
                    ? "bg-background text-pm-accent shadow-sm"
                    : "text-pm-text-muted hover:text-pm-text-primary",
                )}
              >
                {TabIcon && <TabIcon className="h-4 w-4" />}
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto sm:flex-1 min-w-[160px] max-w-[260px] h-11 rounded-md border border-input bg-background px-2.5 focus-within:ring-1 focus-within:ring-pm-accent/40 focus-within:border-pm-accent">
          <Search className="h-4 w-4 text-pm-text-muted shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={__("Search files", 'wedevs-project-manager')}
            className="flex-1 min-w-0 h-full bg-transparent text-sm text-pm-text-primary placeholder:text-muted-foreground focus:outline-none !border-0 !p-0 !shadow-none"
          />
          {query && (
            <button
              type="button"
              aria-label={__("Clear search", 'wedevs-project-manager')}
              onClick={() => setQuery("")}
              className="text-pm-text-muted hover:text-pm-text-primary shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-card divide-y divide-border/50">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-4 py-3"><Skeleton className="h-8 rounded-md" /></div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 rounded-lg border bg-card">
          <FileText className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text-primary mb-1">
            {query.trim() || tab === "mine"
              ? __("No files match.", 'wedevs-project-manager')
              : __("No files yet.", 'wedevs-project-manager')}
          </h3>
          <p className="text-sm text-pm-text-muted">
            {__("Files attached to tasks, discussions, and comments will appear here.", 'wedevs-project-manager')}
          </p>
        </div>
      ) : (
        <>
          {/* Recent Files strip */}
          {recentFiles.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground/70">
                {__("Recent Files", 'wedevs-project-manager')}
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {recentFiles.map((r) => {
                  const { Icon } = r;
                  const active = r.id === selectedId;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedId(r.id)}
                      className={cn(
                        "group shrink-0 w-48 rounded-xl border bg-card p-2 text-left transition-all hover:border-pm-accent/50",
                        active ? "border-pm-accent bg-pm-accent-light/30 shadow-sm" : "border-pm-border",
                      )}
                    >
                      <div className={cn("h-24 rounded-lg flex items-center justify-center overflow-hidden mb-2 transition-colors", r.thumbUrl ? "bg-muted/40" : cn("bg-muted/40", r.iconHover.bg))}>
                        {r.thumbUrl ? (
                          <img src={r.thumbUrl} alt={r.fileName} className="w-full h-full object-cover" />
                        ) : (
                          <Icon className={cn("h-12 w-12 text-pm-text-muted transition-colors", r.iconHover.text)} />
                        )}
                      </div>
                      <p className="text-sm font-medium text-pm-text-primary truncate px-1 pb-0.5">{r.fileName}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Split: files table (left) + File Details rail (right) */}
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
            {/* Table */}
            <div className="rounded-xl border bg-card overflow-hidden min-w-0">
              <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                  {/* Header */}
                  <div className={cn("grid gap-3 px-4 py-2.5 bg-muted/30 border-b text-[12px] font-medium uppercase tracking-wide", FILES_GRID)}>
                    <SortHead label={__("File Name", 'wedevs-project-manager')} sortKey="name" />
                    <SortHead label={__("Type", 'wedevs-project-manager')} sortKey="type" />
                    <SortHead label={__("Uploaded", 'wedevs-project-manager')} sortKey="uploaded" />
                    <span className="text-muted-foreground/70">{__("Attached To", 'wedevs-project-manager')}</span>
                    <SortHead label={__("Uploaded By", 'wedevs-project-manager')} sortKey="uploadedBy" />
                    <span className="text-muted-foreground/70 text-right">{__("Action", 'wedevs-project-manager')}</span>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-border/50">
                    {rows.map((r) => {
                      const { Icon } = r;
                      const active = r.id === selectedId;
                      return (
                        <div
                          key={r.id}
                          onClick={() => setSelectedId(r.id)}
                          className={cn(
                            "grid gap-3 items-center px-4 py-3 cursor-pointer transition-colors group",
                            active ? "bg-pm-accent-light/40" : "hover:bg-muted/30",
                            FILES_GRID,
                          )}
                        >
                          {/* File Name */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden", r.thumbUrl ? "bg-muted/50" : r.iconBg)}>
                              {r.thumbUrl ? (
                                <img src={r.thumbUrl} alt={r.fileName} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Icon className={cn("h-4 w-4", r.iconColor)} />
                              )}
                            </div>
                            <p className="text-sm font-medium text-pm-text-primary truncate">{r.fileName}</p>
                          </div>

                          {/* Type */}
                          <div className="min-w-0">
                            <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-[12px] font-medium text-pm-text-muted uppercase">
                              {r.typeLabel}
                            </span>
                          </div>

                          {/* Uploaded */}
                          <div className="text-[13px] text-pm-text-muted tabular-nums truncate">
                            {formatPmDate(r.uploaded, { month: "short", day: "numeric", year: "numeric" }) || "—"}
                          </div>

                          {/* Attached To */}
                          <div className="min-w-0 text-[13px]">
                            {r.attachedTo ? (
                              r.attachedUrl ? (
                                <a
                                  href={r.attachedUrl}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-pm-accent hover:underline truncate"
                                >
                                  <ExternalLink className="h-4 w-4 shrink-0" />
                                  {r.attachedTo}
                                </a>
                              ) : (
                                <span className="text-pm-text-muted">{r.attachedTo}</span>
                              )
                            ) : (
                              <span className="text-pm-text-muted">—</span>
                            )}
                          </div>

                          {/* Uploaded By */}
                          <div className="flex items-center gap-2 min-w-0">
                            {r.creator ? (
                              <>
                                <UserAvatar user={r.creator} size="md" className="shrink-0" />
                                <p className="text-[13px] font-medium text-pm-text-primary truncate">{r.creator.display_name}</p>
                              </>
                            ) : (
                              <span className="text-[13px] text-pm-text-muted">—</span>
                            )}
                          </div>

                          {/* Action */}
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            {r.url && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" title={__("Download", 'wedevs-project-manager')} onClick={() => downloadRow(r)}>
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-label={__('File actions', 'wedevs-project-manager')} variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {r.url && (
                                  <DropdownMenuItem onClick={() => downloadRow(r)}>
                                    <Download className="h-4 w-4 mr-2" />{__("Download", 'wedevs-project-manager')}
                                  </DropdownMenuItem>
                                )}
                                {r.attachedUrl && (
                                  <DropdownMenuItem onClick={() => { window.location.hash = r.attachedUrl.replace(/^#/, ''); }}>
                                    <LinkIcon className="h-4 w-4 mr-2" />{__("Open parent", 'wedevs-project-manager')}
                                  </DropdownMenuItem>
                                )}
                                {canDeleteFile(r.raw) && (
                                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(r.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />{__("Delete", 'wedevs-project-manager')}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* File Details rail */}
            <div className="rounded-xl border bg-card p-5 lg:sticky lg:top-6">
              <h3 className="text-sm font-medium text-pm-text-primary flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-pm-text-muted" />
                {__("File Details", 'wedevs-project-manager')}
              </h3>
              {selected ? (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="rounded-xl border bg-muted/30 p-4 flex flex-col items-center text-center">
                    <div className="h-28 w-full rounded-lg bg-background/60 flex items-center justify-center overflow-hidden mb-3">
                      {selected.thumbUrl ? (
                        <img src={selected.thumbUrl} alt={selected.fileName} className="w-full h-full object-cover" />
                      ) : (
                        <selected.Icon className={cn("h-12 w-12", selected.iconColor)} />
                      )}
                    </div>
                    <p className="text-sm font-medium text-pm-text-primary break-words w-full">{selected.fileName}</p>
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-pm-text-muted uppercase mt-1.5">
                      {selected.typeLabel}
                    </span>
                  </div>

                  {/* Meta */}
                  <dl className="space-y-3 text-[13px]">
                    <div className="flex items-center gap-2 text-pm-text-muted">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{formatPmDate(selected.uploaded, { month: "short", day: "numeric", year: "numeric" }) || "—"}</span>
                    </div>
                    {selected.creator && (
                      <div className="flex items-center gap-2">
                        <UserAvatar user={selected.creator} size="sm" className="shrink-0" />
                        <span className="text-pm-text-primary truncate">{selected.creator.display_name}</span>
                      </div>
                    )}
                    {selected.attachedTo && (
                      <div className="flex items-center gap-2 text-pm-text-muted min-w-0">
                        <Paperclip className="h-4 w-4 shrink-0" />
                        {selected.attachedUrl ? (
                          <a href={selected.attachedUrl} className="text-pm-accent hover:underline truncate">{selected.attachedTo}</a>
                        ) : (
                          <span className="truncate">{selected.attachedTo}</span>
                        )}
                      </div>
                    )}
                  </dl>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {selected.url && (
                      <Button size="sm" className="h-11 flex-1 text-[13px]" onClick={() => downloadRow(selected)}>
                        <Download className="h-4 w-4 mr-1" />{__("Download", 'wedevs-project-manager')}
                      </Button>
                    )}
                    {canDeleteFile(selected.raw) && (
                      <Button size="icon" variant="outline" className="h-8 w-8 text-destructive hover:text-destructive" title={__("Delete", 'wedevs-project-manager')} onClick={() => handleDelete(selected.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-pm-text-muted text-center py-10">
                  {__("Select a file to see details.", 'wedevs-project-manager')}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
}
