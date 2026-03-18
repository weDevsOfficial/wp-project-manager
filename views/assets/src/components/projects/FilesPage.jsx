import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
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
  const { __ } = useI18n();
  const toast = useToast();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vue 2: GET projects/{pid}/files
  useEffect(() => {
    setLoading(true);
    api
      .get(`projects/${projectId}/files`, { per_page: 100 })
      .then((res) => setFiles(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

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
            {__(
              "Files attached to tasks, discussions, and comments will appear here.",
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {files.map((f) => {
            const Icon = getFileIcon(f.type || f.mime_type);
            const fileName = f.meta?.title || f.name || f.title || "File";
            const attachedTo = getAttachedLabel(f, __);

            return (
              <div
                key={f.id}
                className="rounded-xl border bg-card p-4 flex items-start gap-3 hover:shadow-sm transition-shadow group"
              >
                <div className="p-2.5 bg-muted/50 rounded-xl shrink-0">
                  <Icon className="h-5 w-5 text-pm-text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-pm-text-primary truncate">
                    {fileName}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-pm-text-muted">
                    <span>{formatPmDateTime(f.created_at)}</span>
                    {attachedTo && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <ExternalLink className="h-2.5 w-2.5" />
                          {attachedTo}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {f.url && (
                      <DropdownMenuItem
                        onClick={() => window.open(f.url, "_blank")}
                      >
                        <Download className="h-3.5 w-3.5 mr-2" />
                        {__("Download")}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(f.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      {__("Delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
