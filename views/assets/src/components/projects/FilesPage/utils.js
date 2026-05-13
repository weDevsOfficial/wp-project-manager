import { __ } from '@wordpress/i18n';
import { File, Image, FileArchive, FileText } from "lucide-react";

export function getFileIcon(type) {
  if (!type) return File;
  if (type.startsWith("image")) return Image;
  if (type.includes("zip") || type.includes("archive") || type.includes("rar"))
    return FileArchive;
  return FileText;
}

export function getAttachedLabel(file, __) {
  const type = file.fileable_type;
  if (type === "discussion_board") return __("Discussion", 'wedevs-project-manager');
  if (type === "task") return __("Task", 'wedevs-project-manager');
  if (type === "task_list") return __("Task List", 'wedevs-project-manager');
  if (type === "comment") {
    const parentType = file.fileable?.commentable_type;
    if (parentType === "task") return __("Task Comment", 'wedevs-project-manager');
    if (parentType === "discussion_board") return __("Discussion Comment", 'wedevs-project-manager');
    return __("Comment", 'wedevs-project-manager');
  }
  return "";
}

// Vue project-files/files.vue contentURL() / getCommentUrl(): return hash route
// to the parent task/discussion/list/comment that owns this file.
export function getAttachedURL(file, projectId) {
  if (!file) return "";
  const base = `#/projects/${projectId}`;
  switch (file.fileable_type) {
    case "discussion_board":
      // DiscussionsPage has no nested route; deep-link via ?id=<discussionId>.
      return `${base}/discussions?id=${file.fileable_id}`;
    case "task_list":
      return `${base}/task-lists/${file.fileable_id}`;
    case "task":
      return `${base}/task-lists/tasks/${file.fileable_id}`;
    case "comment": {
      const c = file.fileable || {};
      switch (c.commentable_type) {
        case "task_list":
          return `${base}/task-lists/${c.commentable_id}`;
        case "discussion_board":
          return `${base}/discussions?id=${c.commentable_id}`;
        case "task":
          return `${base}/task-lists/tasks/${c.commentable_id}`;
        default:
          return base;
      }
    }
    default:
      return "";
  }
}

// Vue files.vue checkPermissionAndDownload(): HEAD request before downloading
// to verify backend permission. Mirrors that flow.
export async function checkPermissionAndDownload(permissionUrl, downloadUrl, __) {
  if (!downloadUrl) return;
  if (!permissionUrl) {
    window.open(downloadUrl, "_blank");
    return;
  }
  try {
    const res = await fetch(permissionUrl, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": (typeof PM_Vars !== "undefined" && PM_Vars.permission) || "",
      },
    });
    if (res.ok) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert(__ ? __("Permission denied.", 'wedevs-project-manager') : "Permission denied.");
    }
  } catch {
    window.open(downloadUrl, "_blank");
  }
}

// Vue mixin getDownloadUrl(): pm/v2/projects/X/files/permission_check?attachment_id=
export function getDownloadPermissionUrl(file, projectId) {
  if (!file?.attachment_id) return "";
  const base = (typeof PM_Vars !== "undefined" && PM_Vars.rest_url) || "";
  if (!base) return "";
  return `${base}projects/${projectId}/files/permission_check?attachment_id=${file.attachment_id}`;
}
