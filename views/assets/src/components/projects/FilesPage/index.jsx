import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "@hooks/useApi";
import { useProApi } from "@hooks/useProApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { usePermissions } from "@hooks/usePermissions";
import { useCurrentProject } from "@hooks/useCurrentProject";
import { useProModal } from "@components/common/ProUpgradeModal";
import ProBadge from "@components/common/ProBadge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Skeleton } from "@components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@components/ui/dialog";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import {
  ArrowLeft,
  FileText,
  Download,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  FolderPlus,
  Upload,
  FilePlus,
  Link2,
  FolderOpen,
  LayoutGrid,
  List,
  ChevronRight,
  Home,
  Move,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { formatPmDateTime } from "@lib/pm-utils";
import { getFileIcon, getAttachedLabel } from "./utils";

export default function FilesPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFolderId = parseInt(searchParams.get('folder')) || 0;
  const api = useApi();
  const proApi = useProApi();
  const { __ } = useI18n();
  const toast = useToast();
  const project = useCurrentProject(projectId);
  const { isPro, userCan, isManager, currentUserId } = usePermissions(project);
  const canCreateFile = isManager || userCan('create_file');
  const canDeleteFile = (f) => {
    if (isManager || userCan('delete_file')) return true;
    const creatorId = f?.creator?.data?.id ?? f?.created_by;
    return currentUserId && creatorId && String(currentUserId) === String(creatorId);
  };
  const { setOpen: setProModalOpen } = useProModal();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [folderId, setFolderId] = useState(urlFolderId);
  const [folderPath, setFolderPath] = useState([]);
  const [detailItem, setDetailItem] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('pm_files_view') || 'grid');

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
  const [refreshKey, setRefreshKey] = useState(0);

  const [moveOpen, setMoveOpen] = useState(false);
  const [moveItem, setMoveItem] = useState(null);
  const [moveTarget, setMoveTarget] = useState('0');
  const [allFolders, setAllFolders] = useState([]);
  const [movingLoading, setMovingLoading] = useState(false);

  const openMoveDialog = useCallback((file) => {
    setMoveItem(file);
    setMoveTarget('0');
    proApi.get(`projects/${projectId}/files/folders`).then(res => {
      const folders = res?.data || res || [];
      setAllFolders(Array.isArray(folders) ? folders.filter(f => f.id !== file.id) : []);
    }).catch(() => {});
    setMoveOpen(true);
  }, [proApi, projectId]);

  const handleMove = async () => {
    if (!moveItem) return;
    setMovingLoading(true);
    try {
      await proApi.post(`projects/${projectId}/files/sorting`, {
        source: moveItem.id,
        destination: parseInt(moveTarget) || 0,
      });
      toast.success(__('File moved'));
      setMoveOpen(false);
      setMoveItem(null);
      setRefreshKey(k => k + 1);
    } catch {
      toast.error(__('Failed to move file'));
    } finally {
      setMovingLoading(false);
    }
  };

  const proAction = (action) => {
    if (!isPro) { setProModalOpen(true); return; }
    action();
  };

  const sortFiles = (items) => {
    const order = { folder: 0, pro_file: 1, doc: 2, link: 3 };
    return [...items].sort((a, b) => {
      const ta = order[a.type] ?? order[a.file_type] ?? 1;
      const tb = order[b.type] ?? order[b.file_type] ?? 1;
      if (ta !== tb) return ta - tb;
      return (a.title || '').localeCompare(b.title || '');
    });
  };

  const fetchFiles = useCallback(() => {
    setLoading(true);
    const freeReq = folderId === 0
      ? api.get(`projects/${projectId}/files`, { per_page: 100 }).catch(() => ({ data: [] }))
      : Promise.resolve({ data: [] });

    if (isPro) {
      proApi.get(`projects/${projectId}/files`, { per_page: 100, folder_id: folderId || undefined })
        .then((proRes) => {
          const proFiles = proRes?.data ?? proRes ?? [];
          const proArr = Array.isArray(proFiles) ? proFiles : Object.values(proFiles);
          const filtered = proArr.filter(f => f.id !== folderId);
          setFiles(sortFiles(filtered));

          if (folderId) {
            const parentMeta = proRes?.meta?.parent?.data ?? proRes?.meta?.parent;
            if (parentMeta) {
              const ancestors = parentMeta.parents?.data ?? [];
              const chain = [...ancestors, parentMeta]
                .filter(p => p && p.id)
                .map(p => ({ id: p.id, title: p.meta?.title || p.title || p.name || `Folder #${p.id}` }));
              setFolderPath(chain);
            }
          } else {
            setFolderPath([]);
          }
        })
        .catch(() => setFiles([]))
        .finally(() => setLoading(false));
    } else {
      freeReq.then((res) => setFiles(res?.data ?? res ?? []))
        .finally(() => setLoading(false));
    }
  }, [api, proApi, projectId, isPro, folderId, refreshKey]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  useEffect(() => {
    if (urlFolderId !== folderId) setFolderId(urlFolderId);
  }, [urlFolderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFolderUrl = (id) => {
    if (id) setSearchParams({ folder: String(id) }, { replace: false });
    else setSearchParams({}, { replace: false });
  };
  const enterFolder = (folder) => {
    setFolderPath(prev => [...prev, { id: folder.id, title: folder.title }]);
    setFolderId(folder.id);
    updateFolderUrl(folder.id);
  };
  const navigateToBreadcrumb = (idx) => {
    if (idx === -1) { setFolderId(0); setFolderPath([]); updateFolderUrl(0); return; }
    const newPath = folderPath.slice(0, idx + 1);
    setFolderPath(newPath);
    setFolderId(newPath[newPath.length - 1].id);
    updateFolderUrl(newPath[newPath.length - 1].id);
  };
  const handleItemClick = (item) => {
    const type = item.type || item.file_type;
    if (type === 'folder') {
      if (item.id === folderId) return;
      enterFolder(item);
      return;
    }
    setDetailItem(item); setDetailOpen(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files[]", file);
      formData.append("type", "pro_file");
      formData.append("parent", String(folderId || 0));
      formData.append("project_id", String(projectId));
      await proApi.upload(`projects/${projectId}/files`, formData);
      toast.success(__("File uploaded"));
      setUploadOpen(false);
      fetchFiles();
    } catch (err) { toast.error(err?.message || __("Upload failed")); }
    setUploading(false);
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    try {
      await proApi.post(`projects/${projectId}/files`, {
        title: folderName.trim(),
        type: "folder",
        parent: folderId,
      });
      toast.success(__("Folder created"));
      setFolderOpen(false);
      setFolderName("");
      fetchFiles();
    } catch { toast.error(__("Failed to create folder")); }
  };

  const handleCreateDoc = async () => {
    if (!docTitle.trim()) return;
    try {
      await proApi.post(`projects/${projectId}/files`, {
        title: docTitle.trim(),
        description: docContent,
        type: "doc",
        parent: folderId,
      });
      toast.success(__("Document created"));
      setDocOpen(false);
      setDocTitle("");
      setDocContent("");
      fetchFiles();
    } catch { toast.error(__("Failed to create document")); }
  };

  const handleLinkDoc = async () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return;
    try {
      await proApi.post(`projects/${projectId}/files`, {
        title: linkTitle.trim(),
        url: linkUrl.trim(),
        type: "link",
        parent: folderId,
      });
      toast.success(__("Link added"));
      setLinkDocOpen(false);
      setLinkTitle("");
      setLinkUrl("");
      fetchFiles();
    } catch { toast.error(__("Failed to add link")); }
  };

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
            {__("Files")}
          </h1>
          {files.length > 0 && (
            <span className="text-sm text-pm-text-muted bg-muted/60 px-2 py-0.5 rounded-full tabular-nums">
              {files.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {canCreateFile && (<>
          <Button size="sm" variant="outline" className="h-8 text-sm group/btn" onClick={() => proAction(() => setFolderOpen(true))}>
            <FolderPlus className="h-4 w-4 mr-1" />{__("Create a folder")}
            {!isPro && <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>}
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-sm group/btn" onClick={() => proAction(() => setUploadOpen(true))}>
            <Upload className="h-4 w-4 mr-1" />{__("Upload a file")}
            {!isPro && <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>}
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-sm group/btn" onClick={() => proAction(() => setDocOpen(true))}>
            <FilePlus className="h-4 w-4 mr-1" />{__("Create a doc")}
            {!isPro && <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>}
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-sm group/btn" onClick={() => proAction(() => setLinkDocOpen(true))}>
            <Link2 className="h-4 w-4 mr-1" />{__("Link to Docs")}
            {!isPro && <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1"><ProBadge /></span>}
          </Button>
          </>)}
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
          <p className="text-sm text-pm-text-muted">
            {__("Files attached to tasks, discussions, and comments will appear here.")}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-pm-accent/5 border-b">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button onClick={() => navigateToBreadcrumb(-1)} className="flex items-center gap-1 text-sm font-medium text-pm-accent hover:underline">
                <Home className="h-4 w-4" />{__("Home")}
              </button>
              {folderPath.map((crumb, idx) => (
                <React.Fragment key={crumb.id}>
                  <ChevronRight className="h-3.5 w-3.5 text-pm-text-muted/50" />
                  <button onClick={() => navigateToBreadcrumb(idx)}
                    className={`text-sm font-medium ${idx === folderPath.length - 1 ? 'text-pm-text-primary' : 'text-pm-accent hover:underline'}`}>
                    {crumb.title}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-0.5 bg-muted/50 rounded-md p-0.5">
              <button onClick={() => { setViewMode('grid'); localStorage.setItem('pm_files_view', 'grid') }}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-pm-accent' : 'text-pm-text-muted hover:text-pm-text'}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => { setViewMode('list'); localStorage.setItem('pm_files_view', 'list') }}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-pm-accent' : 'text-pm-text-muted hover:text-pm-text'}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4' : 'divide-y divide-border/50'}>
            {files.map((f) => {
              const fileType = f.type || f.file_type || '';
              const isFolder = fileType === 'folder';
              const isDoc = fileType === 'doc';
              const isLink = fileType === 'link';
              const Icon = isFolder ? FolderOpen : isDoc ? FileText : isLink ? Globe : getFileIcon(f.type || f.mime_type);
              const iconColor = isFolder ? 'text-amber-500' : isDoc ? 'text-blue-500' : isLink ? 'text-emerald-500' : 'text-pm-text-muted';
              const fileName = f.meta?.title || f.name || f.title || "File";
              const attachedTo = !isFolder && !isDoc && !isLink ? getAttachedLabel(f, __) : '';
              const isImage = (f.type || f.mime_type || "").startsWith("image");
              const thumbUrl = !isFolder && !isDoc && !isLink ? (f.thumb || (isImage ? f.url : null)) : null;

              if (viewMode === 'grid') {
                return (
                  <div key={f.id} className="group relative rounded-xl border bg-white hover:shadow-md transition-all cursor-pointer overflow-hidden"
                    onClick={() => handleItemClick(f)}>
                    <div className={`h-24 flex items-center justify-center ${isFolder ? 'bg-amber-50' : thumbUrl ? 'bg-muted/10' : 'bg-muted/30'}`}>
                      {thumbUrl ? (
                        <img src={thumbUrl} alt={fileName} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <Icon className={`h-8 w-8 ${iconColor}`} />
                      )}
                    </div>
                    <div className="p-2.5">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-pm-text-primary truncate flex-1">{fileName}</p>
                      </div>
                      <p className="text-[13px] text-pm-text-muted mt-0.5 truncate">
                        {isFolder ? `${f.children_count ?? f.children?.data?.length ?? f.items_count ?? 0} ${__('items')}` : formatPmDateTime(f.created_at) || ''}
                      </p>
                    </div>
                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full shadow-sm bg-white/90 backdrop-blur">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!isFolder && f.url && (
                            <DropdownMenuItem onClick={() => window.open(f.url, "_blank")}>
                              <Download className="h-4 w-4 mr-2" />{__("Download")}
                            </DropdownMenuItem>
                          )}
                          {isPro && !isFolder && (
                            <DropdownMenuItem onClick={() => openMoveDialog(f)}>
                              <Move className="h-4 w-4 mr-2" />{__("Move to Folder")}
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
              }

              return (
                <div key={f.id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group ${isFolder ? 'cursor-pointer' : ''}`}
                  onClick={() => handleItemClick(f)}>
                  <div className={`w-10 h-10 rounded-lg ${isFolder ? 'bg-amber-50' : 'bg-muted/50'} flex items-center justify-center shrink-0 overflow-hidden`}>
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={fileName} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium text-pm-text-primary truncate ${isFolder ? 'hover:text-pm-accent' : ''}`}>{fileName}</p>
                      {isLink && f.url && <ExternalLink className="h-3.5 w-3.5 text-pm-text-muted/50 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[15px] text-pm-text-muted">
                      {isFolder && <span>{f.children_count ?? f.children?.data?.length ?? f.items_count ?? 0} {__('items')}</span>}
                      {isDoc && f.description?.content && <span className="truncate max-w-[200px]">{f.description.content.replace(/<[^>]*>/g, '').slice(0, 60)}</span>}
                      {isLink && f.url && <span className="truncate max-w-[200px]">{f.url}</span>}
                      {attachedTo && (
                        <><span className="inline-flex items-center gap-1"><ExternalLink className="h-3 w-3" />{attachedTo}</span><span>·</span></>
                      )}
                      {!isFolder && formatPmDateTime(f.created_at) && <span>{formatPmDateTime(f.created_at)}</span>}
                      {f.creator?.data?.display_name && <><span>·</span><span>{__("by")} {f.creator.data.display_name}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    {!isFolder && f.url && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => window.open(f.url, "_blank")} title={__("Download")}>
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
                        {!isFolder && f.url && (
                          <DropdownMenuItem onClick={() => window.open(f.url, "_blank")}>
                            <Download className="h-4 w-4 mr-2" />{__("Download")}
                          </DropdownMenuItem>
                        )}
                        {isPro && !isFolder && (
                          <DropdownMenuItem onClick={() => openMoveDialog(f)}>
                            <Move className="h-4 w-4 mr-2" />{__("Move to Folder")}
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
        </div>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-sm" data-pm-dialog>
          <DialogHeader><DialogTitle>{__("Upload a file")}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>{__("Choose file")}</Label>
            <Input type="file" onChange={handleUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-pm-text-muted">{__("Uploading...")}</p>}
          </div>
        </DialogContent>
      </Dialog>

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

      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent className="max-w-sm" data-pm-dialog>
          <DialogHeader><DialogTitle>{__("Move to Folder")}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-pm-text-muted">{__("Moving")}: <strong>{moveItem?.meta?.title || moveItem?.name || moveItem?.title}</strong></p>
            <div>
              <Label className="text-sm mb-1 block">{__("Destination Folder")}</Label>
              <Select value={String(moveTarget)} onValueChange={(val) => setMoveTarget(val)}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder={__("Root (Home)")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{__("Root (Home)")}</SelectItem>
                  {allFolders.map(f => (
                    <SelectItem key={f.id} value={String(f.id)}>{f.title || f.meta?.title || `Folder #${f.id}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setMoveOpen(false)}>{__("Cancel")}</Button>
            <Button size="sm" onClick={handleMove} disabled={movingLoading}>
              {movingLoading ? __("Moving...") : __("Move")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
