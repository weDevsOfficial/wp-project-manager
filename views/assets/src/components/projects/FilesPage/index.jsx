import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import BackButton from "@components/common/BackButton";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { usePermissions } from "@hooks/usePermissions";
import { useCurrentProject } from "@hooks/useCurrentProject";
import { useProModal } from "@components/common/ProUpgradeModal";
import ProBadge from "@components/common/ProBadge";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { formatPmDateTime } from "@lib/pm-utils";
import {
  getFileIcon,
  getAttachedLabel,
  getAttachedURL,
  getDownloadPermissionUrl,
  checkPermissionAndDownload,
} from "./utils";

// Free FilesPage — read-only listing of files attached to tasks/discussions/comments.
// Pro plugin replaces this via registerFilter('route.files.element') with full
// folders/docs/links/comments/revisions UI.
export default function FilesPage() {
  const { projectId } = useParams();

  const api = useApi();
  const { __ } = useI18n();
  const toast = useToast();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager, currentUserId } = usePermissions(project);
  const canDeleteFile = (f) => {
    if (isManager || userCan('delete_file')) return true;
    const creatorId = f?.creator?.data?.id ?? f?.created_by;
    return currentUserId && creatorId && String(currentUserId) === String(creatorId);
  };
  const { setOpen: setProModalOpen } = useProModal();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!confirm(__("Are you sure?"))) return;
    try {
      await api.post(`projects/${projectId}/files/${id}/delete`);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast.success(__("File deleted"));
    } catch {
      toast.error(__("Failed to delete"));
    }
  }, [api, projectId, toast, __]);

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton fallback={`/projects/${projectId}/task-lists`} />
          <h1 className="text-xl font-bold text-pm-text-primary">{__("Files")}</h1>
          {files.length > 0 && (
            <span className="text-sm text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-full tabular-nums">
              {files.length}
            </span>
          )}
        </div>

        {!isPro && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 text-sm group/btn" onClick={proAction}>
              <FolderPlus className="h-4 w-4 mr-1" />{__("Create a folder")}
              <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-sm group/btn" onClick={proAction}>
              <Upload className="h-4 w-4 mr-1" />{__("Upload a file")}
              <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-sm group/btn" onClick={proAction}>
              <FilePlus className="h-4 w-4 mr-1" />{__("Create a doc")}
              <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-sm group/btn" onClick={proAction}>
              <Link2 className="h-4 w-4 mr-1" />{__("Link to Docs")}
              <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text-primary mb-1">
            {__("No results found.")}
          </h3>
          <p className="text-sm text-pm-text-muted">
            {__("Files attached to tasks, discussions, and comments will appear here.")}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden divide-y divide-border/50">
          {files.map((f) => {
            const Icon = getFileIcon(f.type || f.mime_type);
            const fileName = f.meta?.title || f.name || f.title || __("File");
            const attachedTo = getAttachedLabel(f, __);
            const attachedUrl = getAttachedURL(f, projectId);
            const isImage = (f.type || f.mime_type || "").startsWith("image");
            const thumbUrl = f.thumb || (isImage ? f.url : null);
            const handleDownload = () => checkPermissionAndDownload(
              getDownloadPermissionUrl(f, projectId),
              f.url,
              __,
            );

            return (
              <div key={f.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
                  {thumbUrl ? (
                    <img src={thumbUrl} alt={fileName} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Icon className="h-5 w-5 text-pm-text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-pm-text-primary truncate">{fileName}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[15px] text-pm-text-muted">
                    {attachedTo && (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          {attachedUrl ? (
                            <a href={attachedUrl} className="text-pm-accent hover:underline">{attachedTo}</a>
                          ) : (
                            <span>{attachedTo}</span>
                          )}
                        </span>
                        <span>·</span>
                      </>
                    )}
                    {formatPmDateTime(f.created_at) && <span>{formatPmDateTime(f.created_at)}</span>}
                    {f.creator?.data?.display_name && (
                      <>
                        <span>·</span>
                        <span>{__("by")} {f.creator.data.display_name}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {attachedUrl && (
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => { window.location.hash = attachedUrl.replace(/^#/, ''); }}
                      title={__("Open parent")}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {f.url && (
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleDownload}
                      title={__("Download")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {f.url && (
                        <DropdownMenuItem onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />{__("Download")}
                        </DropdownMenuItem>
                      )}
                      {attachedUrl && (
                        <DropdownMenuItem onClick={() => { window.location.hash = attachedUrl.replace(/^#/, ''); }}>
                          <LinkIcon className="h-4 w-4 mr-2" />{__("Open parent")}
                        </DropdownMenuItem>
                      )}
                      {canDeleteFile(f) && (
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(f.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />{__("Delete")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
