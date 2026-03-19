import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@hooks/useApi";
import { useProApi } from "@hooks/useProApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { usePermissions } from "@hooks/usePermissions";
import { useProModal } from "@components/common/ProUpgradeModal";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Skeleton } from "@components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@components/ui/dialog";
import { Textarea } from "@components/ui/textarea";
import {
  ArrowLeft,
  FileText,
  Download,
  Trash2,
  MoreHorizontal,
  File,
  Image,
  FileArchive,
  ExternalLink,
  FolderPlus,
  Upload,
  FilePlus,
  Link2,
  Crown,
  Folder,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { formatPmDate, formatPmDateTime } from "@lib/pm-utils";

function getFileIcon(type) {
  if (!type) return File;
  if (type.startsWith("image")) return Image;
  if (type.includes("zip") || type.includes("archive") || type.includes("rar"))
    return FileArchive;
  return FileText;
}

// Vue 2: shows "Attached to: Discussion/Task/Comment" with navigation link
function getAttachedLabel(file, __) {
  const type = file.fileable_type;
  if (type === "discussion_board") return __("Discussion");
  if (type === "task") return __("Task");
  if (type === "task_list") return __("Task List");
  if (type === "comment") {
    const parentType = file.fileable?.commentable_type;
    if (parentType === "task") return __("Task Comment");
    if (parentType === "discussion_board") return __("Discussion Comment");
    return __("Comment");
  }
  return "";
}

export default function FilesPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const proApi = useProApi();
  const { __ } = useI18n();
  const toast = useToast();
  const { isPro } = usePermissions();
  const { setOpen: setProModalOpen } = useProModal();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pro dialogs
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [linkDocOpen, setLinkDocOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docContent, setDocContent] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const proAction = (action) => {
    if (!isPro) { setProModalOpen(true); return; }
    action();
  };

  // Fetch files — free (pm/v2) + pro (pm-pro/v2) merged
  const fetchFiles = useCallback(() => {
    setLoading(true);
    const freeReq = api.get(`projects/${projectId}/files`, { per_page: 100 }).catch(() => ({ data: [] }));

    if (isPro) {
      const proReq = proApi.get(`projects/${projectId}/files`, { per_page: 100 }).catch(() => ({ data: [] }));
      Promise.all([freeReq, proReq]).then(([freeRes, proRes]) => {
        const freeFiles = freeRes?.data ?? freeRes ?? [];
        const proFiles = proRes?.data ?? proRes ?? [];
        const freeArr = Array.isArray(freeFiles) ? freeFiles : Object.values(freeFiles);
        const proArr = Array.isArray(proFiles) ? proFiles : Object.values(proFiles);
        // Merge, deduplicate by id
        const merged = [...proArr];
        const proIds = new Set(proArr.map(f => f.id));
        freeArr.forEach(f => { if (!proIds.has(f.id)) merged.push(f); });
        setFiles(merged);
      }).finally(() => setLoading(false));
    } else {
      freeReq.then((res) => setFiles(res?.data ?? res ?? []))
        .finally(() => setLoading(false));
    }
  }, [api, proApi, projectId, isPro]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  // Upload file (Pro) — pm-pro/v2/projects/{pid}/files
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files[0]", file);
      formData.append("type", "pro_file");
      formData.append("parent", "0");
      formData.append("project_id", projectId);
      await api.upload(`pm-pro/v2/projects/${projectId}/files`, formData);
      toast.success(__("File uploaded"));
      setUploadOpen(false);
      fetchFiles();
    } catch { toast.error(__("Upload failed")); }
    setUploading(false);
  };

  // Create folder (Pro) — pm-pro/v2/projects/{pid}/files
  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    try {
      await proApi.post(`projects/${projectId}/files`, {
        title: folderName.trim(),
        type: "folder",
        parent: 0,
      });
      toast.success(__("Folder created"));
      setFolderOpen(false);
      setFolderName("");
      fetchFiles();
    } catch { toast.error(__("Failed to create folder")); }
  };

  // Create doc (Pro) — pm-pro/v2/projects/{pid}/files
  const handleCreateDoc = async () => {
    if (!docTitle.trim()) return;
    try {
      await proApi.post(`projects/${projectId}/files`, {
        title: docTitle.trim(),
        description: docContent,
        type: "doc",
        parent: 0,
      });
      toast.success(__("Document created"));
      setDocOpen(false);
      setDocTitle("");
      setDocContent("");
      fetchFiles();
    } catch { toast.error(__("Failed to create document")); }
  };

  // Link to doc (Pro) — pm-pro/v2/projects/{pid}/files
  const handleLinkDoc = async () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return;
    try {
      await proApi.post(`projects/${projectId}/files`, {
        title: linkTitle.trim(),
        url: linkUrl.trim(),
        type: "link",
        parent: 0,
      });
      toast.success(__("Link added"));
      setLinkDocOpen(false);
      setLinkTitle("");
      setLinkUrl("");
      fetchFiles();
    } catch { toast.error(__("Failed to add link")); }
  };

  // Vue 2: POST projects/{pid}/files/{id}/delete
  const handleDelete = useCallback(
    async (id) => {
      if (!confirm(__("Are you sure?"))) return;
      try {
        await api.post(`projects/${projectId}/files/${id}/delete`);
        setFiles((prev) => prev.filter((f) => f.id !== id));
        toast.success(__("File deleted"));
      } catch {
        toast.error(__("Failed to delete"));
      }
    },
    [api, projectId, toast, __],
  );

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
            {__("Files")}
          </h1>
          {files.length > 0 && (
            <span className="text-xs text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-full tabular-nums">
              {files.length}
            </span>
          )}
        </div>

        {/* Pro action buttons */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => proAction(() => setFolderOpen(true))}>
            <FolderPlus className="h-3.5 w-3.5 mr-1" />{__("Create a folder")}
            {!isPro && <Crown className="h-3 w-3 ml-1 text-pm-accent" />}
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => proAction(() => setUploadOpen(true))}>
            <Upload className="h-3.5 w-3.5 mr-1" />{__("Upload a file")}
            {!isPro && <Crown className="h-3 w-3 ml-1 text-pm-accent" />}
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => proAction(() => setDocOpen(true))}>
            <FilePlus className="h-3.5 w-3.5 mr-1" />{__("Create a doc")}
            {!isPro && <Crown className="h-3 w-3 ml-1 text-pm-accent" />}
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => proAction(() => setLinkDocOpen(true))}>
            <Link2 className="h-3.5 w-3.5 mr-1" />{__("Link to Docs")}
            {!isPro && <Crown className="h-3 w-3 ml-1 text-pm-accent" />}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text-primary mb-1">
            {__("No files yet")}
          </h3>
          <p className="text-xs text-pm-text-muted">
            {__("Files attached to tasks, discussions, and comments will appear here.")}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          {/* Breadcrumb bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-pm-accent/5 border-b">
            <Folder className="h-4 w-4 text-pm-accent" />
            <span className="text-xs font-medium text-pm-text-primary">{__("Home")}</span>
          </div>

          {/* File list */}
          <div className="divide-y divide-border/50">
            {files.map((f) => {
              const Icon = getFileIcon(f.type || f.mime_type);
              const fileName = f.meta?.title || f.name || f.title || "File";
              const attachedTo = getAttachedLabel(f, __);
              const isImage = (f.type || f.mime_type || "").startsWith("image");
              const thumbUrl = f.thumb || (isImage ? f.url : null);

              return (
                <div
                  key={f.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group"
                >
                  {/* Thumbnail / Icon */}
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={fileName} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Icon className="h-5 w-5 text-pm-text-muted" />
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pm-text-primary truncate">{fileName}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-pm-text-muted">
                      {attachedTo && (
                        <span className="inline-flex items-center gap-1">
                          <ExternalLink className="h-2.5 w-2.5" />
                          {attachedTo}
                        </span>
                      )}
                      {attachedTo && <span>·</span>}
                      <span>{formatPmDateTime(f.created_at)}</span>
                      {f.creator?.data?.display_name && (
                        <>
                          <span>·</span>
                          <span>{__("by")} {f.creator.data.display_name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {f.url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => window.open(f.url, "_blank")}
                        title={__("Download")}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {f.url && (
                          <DropdownMenuItem onClick={() => window.open(f.url, "_blank")}>
                            <Download className="h-3.5 w-3.5 mr-2" />{__("Download")}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(f.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />{__("Delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Pro Dialogs ── */}

      {/* Upload file */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-sm" data-pm-dialog>
          <DialogHeader><DialogTitle>{__("Upload a file")}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>{__("Choose file")}</Label>
            <Input type="file" onChange={handleUpload} disabled={uploading} />
            {uploading && <p className="text-xs text-pm-text-muted">{__("Uploading...")}</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create folder */}
      <Dialog open={folderOpen} onOpenChange={setFolderOpen}>
        <DialogContent className="max-w-sm" data-pm-dialog>
          <DialogHeader><DialogTitle>{__("Create a folder")}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>{__("Folder name")}</Label>
            <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder={__("e.g. Design Assets")} autoFocus onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()} />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setFolderOpen(false)}>{__("Cancel")}</Button>
            <Button size="sm" onClick={handleCreateFolder} disabled={!folderName.trim()}>{__("Create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create doc */}
      <Dialog open={docOpen} onOpenChange={setDocOpen}>
        <DialogContent className="max-w-md" data-pm-dialog>
          <DialogHeader><DialogTitle>{__("Create a doc")}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{__("Title")}</Label>
              <Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder={__("Document title")} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>{__("Content")}</Label>
              <Textarea value={docContent} onChange={(e) => setDocContent(e.target.value)} rows={5} placeholder={__("Write document content...")} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDocOpen(false)}>{__("Cancel")}</Button>
            <Button size="sm" onClick={handleCreateDoc} disabled={!docTitle.trim()}>{__("Create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link to Docs */}
      <Dialog open={linkDocOpen} onOpenChange={setLinkDocOpen}>
        <DialogContent className="max-w-sm" data-pm-dialog>
          <DialogHeader><DialogTitle>{__("Link to Docs")}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{__("Title")}</Label>
              <Input value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder={__("Link title")} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>{__("URL")}</Label>
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setLinkDocOpen(false)}>{__("Cancel")}</Button>
            <Button size="sm" onClick={handleLinkDoc} disabled={!linkTitle.trim() || !linkUrl.trim()}>{__("Add Link")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
